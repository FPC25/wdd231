import { getState, setState } from './modules/calculator/calculator-state.mjs';
import { getDomElements } from './modules/calculator/calculator-dom.mjs';
import { setupEventListeners } from './modules/calculator/calculator-events.mjs';
import { populateRecipeSelect, loadSelectedRecipe, displayRecipe } from './modules/calculator/calculator-renderer.mjs';
import { convertUnits, convertVolumeToWeight, calculateIngredientCost, updateProfitCalculations } from './modules/calculator/calculator-utils.mjs';
import { loadCalculationHistory, saveCalculation, loadSavedCalculation, displayCalculationHistory } from './modules/calculator/calculator-history.mjs';
import { preselectRecipeFromUrl } from './modules/calculator/calculator-navigation.mjs';
import { setupCostInputs } from './modules/calculator/calculator-ingredients.mjs';
import { checkAllCostsEntered, calculateCosts, displayResults } from './modules/calculator/calculator-calculations.mjs';
import { resetCalculator, setupBottomNavigation } from './modules/calculator/calculator-reset.mjs';
import { loadRecipes } from './modules/explore/recipe-data.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    await loadRecipes();

    const domElements = getDomElements();
    populateRecipeSelect();
    setupEventListeners(domElements);
    
    // Load and display calculation history
    displayCalculationHistory();

    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('recipe');
    if (recipeId) {
        preselectRecipeFromUrl(recipeId);
    }
});