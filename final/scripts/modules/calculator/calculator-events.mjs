// Event handling for calculator page

import { loadSelectedRecipe } from './calculator-renderer.mjs';
import { calculateCosts, toggleCostBreakdown } from '../calculator-calculations.mjs';
import { saveCalculation } from '../calculator-history.mjs';
import { resetCalculator } from '../calculator-reset.mjs';
import { updateProfitCalculations } from '../calculator-utils.mjs';

export function setupEventListeners(domElements) {
    const { recipeSelect, loadBtn, calculateBtn, profitMarginInput, toggleBreakdownBtn, saveBtn, resetBtn } = domElements;

    if (recipeSelect && loadBtn) {
        // Event listener para mudança no select
        recipeSelect.addEventListener('change', function() {
            // Habilitar/desabilitar o botão Load baseado na seleção
            if (this.value) {
                loadBtn.disabled = false;
                loadBtn.classList.remove('disabled');
            } else {
                loadBtn.disabled = true;
                loadBtn.classList.add('disabled');
            }
        });
        
        // Event listener para clique no Load
        loadBtn.addEventListener('click', function() {
            if (!this.disabled) {
                loadSelectedRecipe();
            }
        });
        
        // Estado inicial - botão desabilitado
        loadBtn.disabled = true;
        loadBtn.classList.add('disabled');
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