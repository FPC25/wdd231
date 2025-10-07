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
    loadDraftIfExists();
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
        const quantity = row.querySelector('.quantity-input').value.trim();
        const item = row.querySelector('.ingredient-input').value.trim();
        const unit = row.querySelector('.unit-input').value.trim();
        
        if (quantity && item) {
            ingredients.push({
                item: item,
                quantity: quantity === 'to taste' ? 'to taste' : parseFloat(quantity) || quantity,
                unit: quantity === 'to taste' ? null : (unit || null)
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
        source: source,
        difficulty: difficulty,
        cookTime: cookTime,
        filters: filters,
        ingredients: ingredients,
        instructions: instructions,
        isSaved: true,
        isFavorite: isFavorite,
        serves: serves,
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
function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    const recipeData = collectFormData();
    
    try {
        let existingRecipes = [];
        try {
            existingRecipes = getRecipesData() || [];
        } catch (error) {
            const storedRecipes = localStorage.getItem('recipesData');
            existingRecipes = storedRecipes ? JSON.parse(storedRecipes) : [];
        }
        
        existingRecipes.push(recipeData);
        localStorage.setItem('recipesData', JSON.stringify(existingRecipes));
        
        manageLocalStorageDirectly(recipeData);
        
        localStorage.removeItem('recipeDraft');
        
        alert('Recipe saved successfully!');
        window.location.href = './index.html';
        
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Error saving recipe. Please try again.');
    }
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
window.addIngredientRow = addIngredientRow;
window.handleFormSubmit = handleFormSubmit;
window.saveDraft = saveDraft;