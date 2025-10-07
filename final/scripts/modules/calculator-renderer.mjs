// Rendering logic for calculator page

import { getState, setState } from './calculator-state.mjs';
import { getDomElements } from './calculator-dom.mjs';
import { getRecipesData } from './recipe-data.mjs';

export function populateRecipeSelect() {
    const recipes = getRecipesData();
    const select = document.getElementById('recipe-select');
    if (!select) return;

    select.innerHTML = '<option value="">Choose a saved recipe to calculate costs...</option>';
    recipes.forEach(recipe => {
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

    if (nameElement) nameElement.textContent = recipe.name;
    if (servesElement) servesElement.textContent = recipe.serves;
    if (difficultyElement) difficultyElement.textContent = recipe.difficulty;
}

export async function loadSelectedRecipe() {
    const { recipeSelect } = getDomElements();
    if (!recipeSelect || !recipeSelect.value) return;

    const recipeId = parseInt(recipeSelect.value);
    const recipes = getRecipesData();
    const recipe = recipes.find(r => r.id === recipeId);

    if (!recipe) return;

    setState({ currentRecipe: recipe });
    displayRecipe(recipe);
    
    // Import setupCostInputs dynamically to avoid circular dependency
    const { setupCostInputs } = await import('./calculator-ingredients.mjs');
    await setupCostInputs(recipe);
}