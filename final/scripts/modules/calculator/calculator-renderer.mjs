// Rendering logic for calculator page

import { getState, setState } from './calculator-state.mjs';
import { getDomElements } from './calculator-dom.mjs';
import { getRecipesData, getSavedFromStorage } from '../recipe/recipe-data.mjs';

export function populateRecipeSelect() {
    const recipes = getRecipesData(); // Isso já aplica localStorage changes
    const savedRecipeIds = getSavedFromStorage();
    const select = document.getElementById('recipe-select');
    if (!select) return;

    select.innerHTML = '<option value="">Choose a saved recipe to calculate costs...</option>';
    
    // Filtrar apenas receitas salvas pelo usuário
    const savedRecipes = recipes.filter(recipe => {
        // Use flexible comparison
        return savedRecipeIds.some(savedId => savedId == recipe.id);
    });
    
    if (savedRecipes.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'No saved recipes found. Save some recipes first!';
        option.disabled = true;
        select.appendChild(option);
        return;
    }
    
    savedRecipes.forEach(recipe => {
        const option = document.createElement('option');
        option.value = recipe.id;
        option.textContent = recipe.name;
        select.appendChild(option);
    });
}

export function displayRecipe(recipe) {
    const nameElement = document.getElementById('selected-recipe-name');
    const servesElement = document.getElementById('recipe-serves');
    const difficultyElement = document.getElementById('recipe-difficulty');
    const recipeDisplaySection = document.getElementById('recipe-display');

    if (nameElement) nameElement.textContent = recipe.name;
    if (servesElement) servesElement.textContent = recipe.serves;
    if (difficultyElement) difficultyElement.textContent = recipe.difficulty;
    
    // Mostrar a seção da receita quando uma receita é carregada
    if (recipeDisplaySection) {
        recipeDisplaySection.style.display = 'block';
    }
}

export async function loadSelectedRecipe() {
    const { recipeSelect } = getDomElements();
    if (!recipeSelect || !recipeSelect.value) {
        return;
    }

    const recipeId = recipeSelect.value; // Remove parseInt, IDs podem ser strings
    const recipes = getRecipesData();
    const recipe = recipes.find(r => r.id == recipeId); // Use == para comparação flexível

    if (!recipe) {
        return;
    }

    setState({ currentRecipe: recipe });
    displayRecipe(recipe);
    
    // Import setupCostInputs dynamically to avoid circular dependency
    const { setupCostInputs } = await import('./calculator-ingredients.mjs');
    await setupCostInputs(recipe);
}