import { loadRecipes, getRecipesData } from './modules/recipe-data.mjs';
import { 
    quantityOptions, 
    unitOptions, 
    initializeForm, 
    setupDifficultySelect, 
    setupImagePreviewClick, 
    addIngredientRow, 
    removeIngredientRow, 
    handleImageUpload, 
    removeImageSimple, 
    populateForm 
} from './modules/recipe-dom.mjs';
import { addEventListeners } from './modules/recipe-events.mjs';
import { manageLocalStorageDirectly } from './modules/recipe-favorites.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    await loadRecipes();
    initializeForm();
    addEventListeners();
    checkForEditMode(); // Changed from loadDraftIfExists to handle edit/fork modes
});

let ingredientCount = 0;

// MANTER ESTAS FUNÇÕES (não foram migradas):
// Coleta dados do formulário
function collectFormData() {
    let existingRecipes = [];
    try {
        existingRecipes = getRecipesData() || [];
    } catch (error) {
        existingRecipes = [];
    }
    
    const nextId = existingRecipes.length > 0 ? Math.max(...existingRecipes.map(r => r.id || 0)) + 1 : 1;
    
    const name = document.getElementById('recipe-name').value.trim();
    const source = document.getElementById('source').value.trim() || '';
    const difficulty = document.getElementById('difficulty').value;
    const servesValue = document.getElementById('serves').value;
    const serves = servesValue ? parseInt(servesValue) : 1;
    
    const cookTime = {
        time: parseInt(document.getElementById('cook-time').value),
        unit: document.getElementById('time-unit').value
    };
    
    const filterCheckboxes = document.querySelectorAll('#filters-group input[type="checkbox"]:checked');
    const filters = Array.from(filterCheckboxes).map(cb => cb.value);
    
    const ingredientRows = document.querySelectorAll('.ingredient-row');
    const ingredients = [];
    
    ingredientRows.forEach(row => {
        const quantityInput = row.querySelector('.quantity-input');
        const toTasteBtn = row.querySelector('.to-taste-btn');
        const item = row.querySelector('.ingredient-input').value.trim();
        const unit = row.querySelector('.unit-input').value.trim();
        
        // Check if "to taste" is active
        const isToTaste = toTasteBtn && toTasteBtn.dataset.active === 'true';
        const quantityValue = quantityInput.value.trim();
        
        if ((quantityValue || isToTaste) && item) {
            ingredients.push({
                item: item,
                quantity: isToTaste ? 'to taste' : (parseFloat(quantityValue) || quantityValue),
                unit: isToTaste ? null : (unit || null)
            });
        }
    });
    
    const instructionsText = document.getElementById('instructions').value.trim();
    const instructions = instructionsText
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
    
    const isFavorite = document.getElementById('mark-favorite').checked;
    
    let cover = "image";
    const uploadedImage = document.querySelector('.image-preview img[src^="data:"]');
    if (uploadedImage) {
        cover = uploadedImage.src;
    }
    
    return {
        id: nextId,
        name: name,
        cover: cover,
        source: source || "user", // Mark as user-created if no source specified
        difficulty: difficulty,
        cookTime: cookTime,
        filters: filters,
        ingredients: ingredients,
        instructions: instructions,
        isSaved: true,
        isFavorite: isFavorite,
        serves: serves,
        isUserCreated: true, // Always true for newly created recipes
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

// Valida dados do formulário
function validateForm() {
    const name = document.getElementById('recipe-name').value.trim();
    const difficulty = document.getElementById('difficulty').value;
    const cookTime = document.getElementById('cook-time').value;
    const instructions = document.getElementById('instructions').value.trim();
    
    if (!name) {
        alert('Please enter a recipe name');
        return false;
    }
    
    if (!difficulty) {
        alert('Please select a difficulty level');
        return false;
    }
    
    if (!cookTime || cookTime <= 0) {
        alert('Please enter a valid cook time');
        return false;
    }
    
    if (!instructions) {
        alert('Please enter cooking instructions');
        return false;
    }
    
    const ingredientRows = document.querySelectorAll('.ingredient-row');
    let hasValidIngredient = false;
    
    ingredientRows.forEach(row => {
        const quantity = row.querySelector('.quantity-input').value.trim();
        const item = row.querySelector('.ingredient-input').value.trim();
        
        if (quantity && item) {
            hasValidIngredient = true;
        }
    });
    
    if (!hasValidIngredient) {
        alert('Please add at least one ingredient');
        return false;
    }
    
    return true;
}

// Manipula submissão do formulário
async function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    try {
        // Check if we're in edit or fork mode
        if (window.editMode?.isEditing) {
            await handleRecipeUpdate();
        } else if (window.editMode?.isForking) {
            await handleRecipeFork();
        } else {
            await handleNewRecipe();
        }
    } catch (error) {
        console.error('Error handling form submission:', error);
        alert('Error saving recipe. Please try again.');
    }
}

// Handle updating existing user recipe
async function handleRecipeUpdate() {
    const { updateUserRecipe } = await import('./modules/recipe-management.mjs');
    const recipeData = collectFormData();
    
    // Keep the original ID
    recipeData.id = window.editMode.recipeId;
    
    const success = updateUserRecipe(window.editMode.recipeId, recipeData);
    
    if (success) {
        localStorage.removeItem('recipeDraft');
        alert('Recipe updated successfully!');
        window.location.href = './index.html';
    } else {
        alert('Error updating recipe. Please try again.');
    }
}

// Handle creating fork of API recipe
async function handleRecipeFork() {
    const { forkApiRecipe, saveForkRecipe } = await import('./modules/recipe-management.mjs');
    const recipeData = collectFormData();
    
    // Create fork
    const forkedRecipe = forkApiRecipe(window.editMode.originalRecipe, recipeData);
    
    if (!forkedRecipe) {
        // No real changes detected
        alert('No changes detected. Personal copy not created.');
        window.location.href = './index.html';
        return;
    }
    
    const success = saveForkRecipe(forkedRecipe);
    
    if (success) {
        localStorage.removeItem('recipeDraft');
        alert('Personal copy created successfully!');
        window.location.href = './index.html';
    } else {
        alert('Error creating personal copy. Please try again.');
    }
}

// Handle creating new recipe
async function handleNewRecipe() {
    const recipeData = collectFormData();
    
    // 1. Salvar nas receitas principais (recipesData)
    let existingRecipes = [];
    try {
        existingRecipes = getRecipesData() || [];
    } catch (error) {
        const storedRecipes = localStorage.getItem('recipesData');
        existingRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
    }
    
    existingRecipes.push(recipeData);
    localStorage.setItem('recipesData', JSON.stringify(existingRecipes));
    
    // 2. CORREÇÃO: Também salvar nas receitas do usuário (userRecipes)
    let userRecipes = [];
    try {
        const storedUserRecipes = localStorage.getItem('userRecipes');
        userRecipes = storedUserRecipes ? JSON.parse(storedUserRecipes) : [];
    } catch (error) {
        userRecipes = [];
    }
    
    userRecipes.push(recipeData);
    localStorage.setItem('userRecipes', JSON.stringify(userRecipes));
    
    manageLocalStorageDirectly(recipeData);
    
    localStorage.removeItem('recipeDraft');
    
    alert('Recipe saved successfully!');
    window.location.href = './index.html';
}

// Salva rascunho da receita
function saveDraft() {
    if (!document.getElementById('recipe-name').value.trim()) {
        alert('Please enter at least a recipe name before saving draft');
        return;
    }
    
    const draftData = collectFormData();
    localStorage.setItem('recipeDraft', JSON.stringify(draftData));
    alert('Draft saved successfully!');
}

// Carrega rascunho se existir
function loadDraftIfExists() {
    const draftData = localStorage.getItem('recipeDraft');
    if (draftData) {
        try {
            const draft = JSON.parse(draftData);
            if (confirm('You have a saved draft. Would you like to continue editing it?')) {
                populateForm(draft);
            } else {
                localStorage.removeItem('recipeDraft');
            }
        } catch (error) {
            localStorage.removeItem('recipeDraft');
        }
    }
}

// Expor funções globais necessárias
window.removeIngredientRow = removeIngredientRow;
window.removeImageSimple = removeImageSimple;

// **NEW FUNCTIONALITY: Recipe Editing**

// Check if we're editing an existing recipe
function checkForEditMode() {
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('edit');
    const forkId = urlParams.get('fork');
    
    if (editId) {
        loadRecipeForEdit(editId);
    } else if (forkId) {
        loadRecipeForFork(forkId);
    } else {
        loadDraftIfExists();
    }
}

// Load recipe for editing
async function loadRecipeForEdit(recipeId) {
    try {
        const { getRecipeById, isUserRecipe } = await import('./modules/recipe-management.mjs');
        const recipe = getRecipeById(recipeId);
        
        if (!recipe) {
            alert('Recipe not found!');
            window.location.href = './index.html';
            return;
        }
        
        if (recipe.isApiRecipe) {
            alert('API recipes cannot be edited directly. You can create a personal copy instead.');
            window.location.href = `./recipe.html?fork=${recipeId}`;
            return;
        }
        
        // Update page title and form for editing
        document.title = 'Edit Recipe - Flavorfy';
        const pageTitle = document.querySelector('h1');
        if (pageTitle) pageTitle.textContent = 'Edit Recipe';
        
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Update Recipe';
        
        // Store edit mode data
        window.editMode = {
            isEditing: true,
            recipeId: recipeId,
            originalRecipe: recipe
        };
        
        // Populate form with recipe data
        populateForm(recipe);
        
    } catch (error) {
        console.error('Error loading recipe for edit:', error);
        alert('Error loading recipe for editing');
        window.location.href = './index.html';
    }
}

// Load recipe for forking (creating personal copy)
async function loadRecipeForFork(recipeId) {
    try {
        const { getRecipeById } = await import('./modules/recipe-management.mjs');
        const recipe = getRecipeById(recipeId);
        
        if (!recipe) {
            alert('Recipe not found!');
            window.location.href = './index.html';
            return;
        }
        
        // Update page title and form for forking
        document.title = 'Create Personal Copy - Flavorfy';
        const pageTitle = document.querySelector('h1');
        if (pageTitle) pageTitle.textContent = `Create Personal Copy: ${recipe.name}`;
        
        const submitBtn = document.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.textContent = 'Create Personal Copy';
        
        // Store fork mode data
        window.editMode = {
            isForking: true,
            originalRecipeId: recipeId,
            originalRecipe: recipe
        };
        
        // Populate form with recipe data but clear the source
        const recipeForFork = { ...recipe };
        recipeForFork.source = ''; // Clear source so user can add their own
        recipeForFork.name = `My ${recipe.name}`; // Prefix to indicate it's a copy
        
        populateForm(recipeForFork);
        
    } catch (error) {
        console.error('Error loading recipe for fork:', error);
        alert('Error loading recipe for forking');
        window.location.href = './index.html';
    }
}
window.addIngredientRow = addIngredientRow;
window.handleFormSubmit = handleFormSubmit;
window.saveDraft = saveDraft;