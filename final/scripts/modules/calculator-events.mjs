// Event handling for calculator page

import { loadSelectedRecipe } from './calculator-renderer.mjs';
import { calculateCosts, toggleCostBreakdown } from './calculator-calculations.mjs';
import { saveCalculation } from './calculator-history.mjs';
import { resetCalculator } from './calculator-reset.mjs';
import { updateProfitCalculations } from './calculator-utils.mjs';

export function setupEventListeners(domElements) {
    const { recipeSelect, loadBtn, calculateBtn, profitMarginInput, toggleBreakdownBtn, saveBtn, resetBtn } = domElements;

    if (recipeSelect && loadBtn) {
        loadBtn.addEventListener('click', loadSelectedRecipe);
    }

    if (calculateBtn) {
        calculateBtn.addEventListener('click', calculateCosts);
    }

    if (profitMarginInput) {
        profitMarginInput.addEventListener('input', updateProfitCalculations);
    }

    if (toggleBreakdownBtn) {
        toggleBreakdownBtn.addEventListener('click', toggleCostBreakdown);
    }

    if (saveBtn) {
        saveBtn.addEventListener('click', saveCalculation);
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', resetCalculator);
    }
}