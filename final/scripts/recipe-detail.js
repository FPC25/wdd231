import { RecipeManager } from './modules/RecipeManager.mjs';

let recipeManager;
let currentRecipe;

document.addEventListener('DOMContentLoaded', async function() {
    recipeManager = new RecipeManager();
    await recipeManager.loadRecipes();
    
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    
    if (!recipeId) {
        showError();
        return;
    }
    
    currentRecipe = recipeManager.getRecipeById(recipeId);
    
    if (!currentRecipe) {
        showError();
        return;
    }
    
    displayRecipe(currentRecipe);
    setupActionButtons();
    setupEventListeners();
    showContent();
});

// Exibe os dados da receita na página
function displayRecipe(recipe) {
    document.getElementById('page-title').textContent = `${recipe.name} - Flavorfy`;
    
    const headerTitle = document.getElementById('recipe-header-title');
    if (headerTitle) headerTitle.textContent = recipe.name;
    
    displayRecipeImage(recipe);
    
    document.getElementById('cook-time').textContent = `${recipe.cookTime.time} ${recipe.cookTime.unit}`;
    document.getElementById('difficulty').textContent = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
    document.getElementById('serves').textContent = recipe.serves;
    document.getElementById('source').textContent = recipe.source || 'Not specified';
    
    displayCategories(recipe);
    displayIngredients(recipe);
    displayInstructions(recipe);
}

function displayRecipeImage(recipe) {
    const imageSection = document.getElementById('recipe-image-section');
    const mainImg = document.getElementById('recipe-main-img');
    
    if (!imageSection || !mainImg) return;
    
    const hasValidImage = recipe.cover && 
                         recipe.cover !== "image" && 
                         !recipe.cover.includes('placeholder.svg') &&
                         recipe.cover.trim() !== '';
    
    if (hasValidImage) {
        mainImg.src = recipe.cover;
        mainImg.alt = recipe.name;
        imageSection.style.display = 'block';
    } else {
        imageSection.style.display = 'none';
    }
}

function displayCategories(recipe) {
    const categoriesContainer = document.getElementById('categories');
    if (!categoriesContainer) return;
    
    if (recipe.filters && recipe.filters.length > 0) {
        categoriesContainer.innerHTML = recipe.filters.map(filter => 
            `<span class="category-tag">${filter}</span>`
        ).join('');
    } else {
        categoriesContainer.innerHTML = '<span class="category-tag">Uncategorized</span>';
    }
}

function displayIngredients(recipe) {
    const ingredientsList = document.getElementById('ingredients-list');
    if (!ingredientsList) return;
    
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        ingredientsList.innerHTML = recipe.ingredients.map(ingredient => {
            const quantity = ingredient.quantity;
            const unit = ingredient.unit ? ` ${ingredient.unit}` : '';
            const quantityText = `${quantity}${unit}`;
            
            return `
                <li class="ingredient-item">
                    <span class="ingredient-quantity">${quantityText}</span>
                    <span class="ingredient-name">${ingredient.item}</span>
                </li>
            `;
        }).join('');
    } else {
        ingredientsList.innerHTML = '<li class="ingredient-item">No ingredients specified</li>';
    }
}

function displayInstructions(recipe) {
    const instructionsList = document.getElementById('instructions-list');
    if (!instructionsList) return;
    
    if (recipe.instructions && recipe.instructions.length > 0) {
        instructionsList.innerHTML = recipe.instructions.map(instruction => 
            `<li class="instruction-item">${instruction}</li>`
        ).join('');
    } else {
        instructionsList.innerHTML = '<li class="instruction-item">No instructions provided</li>';
    }
}

// SIMPLIFICADO - usa RecipeManager diretamente
function setupActionButtons() {
    const favoriteBtn = document.getElementById('favorite-btn');
    const saveBtn = document.getElementById('save-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    
    if (!favoriteBtn || !saveBtn || !calculateBtn) return;
    
    // Set recipe ID for updates
    favoriteBtn.dataset.recipeId = currentRecipe.id;
    saveBtn.dataset.recipeId = currentRecipe.id;
    
    // Initial state
    updateButtonStates();
    
    // Event listeners - usa RecipeManager diretamente
    favoriteBtn.addEventListener('click', function() {
        recipeManager.toggleFavorite(currentRecipe.id);
        updateButtonStates();
    });
    
    saveBtn.addEventListener('click', function() {
        recipeManager.toggleSaved(currentRecipe.id);
        updateButtonStates();
    });
    
    calculateBtn.addEventListener('click', function() {
        const states = recipeManager.getRecipeStates(currentRecipe.id);
        
        if (states.isSaved) {
            window.location.href = `./calculator.html?recipe=${currentRecipe.id}`;
        } else {
            // Save first, then navigate
            recipeManager.toggleSaved(currentRecipe.id);
            
            setTimeout(() => {
                window.location.href = `./calculator.html?recipe=${currentRecipe.id}`;
            }, 300);
        }
    });
}

function updateButtonStates() {
    const favoriteBtn = document.getElementById('favorite-btn');
    const saveBtn = document.getElementById('save-btn');
    
    if (!favoriteBtn || !saveBtn) return;
    
    const states = recipeManager.getRecipeStates(currentRecipe.id);
    
    favoriteBtn.classList.toggle('active', states.isFavorite);
    saveBtn.classList.toggle('active', states.isSaved);
    
    const saveImg = saveBtn.querySelector('img');
    if (saveImg) {
        saveImg.src = states.isSaved ? './images/check.svg' : './images/plus.svg';
        saveImg.alt = states.isSaved ? 'Saved' : 'Save';
    }
}

function setupEventListeners() {
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => window.history.back());
    }
}

function showContent() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const recipeContent = document.getElementById('recipe-content');
    
    if (loadingState) loadingState.style.display = 'none';
    if (errorState) errorState.style.display = 'none';
    if (recipeContent) recipeContent.style.display = 'block';
}

function showError() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const recipeContent = document.getElementById('recipe-content');
    
    if (loadingState) loadingState.style.display = 'none';
    if (recipeContent) recipeContent.style.display = 'none';
    if (errorState) errorState.style.display = 'block';
    
    document.getElementById('page-title').textContent = 'Recipe Not Found - Flavorfy';
}