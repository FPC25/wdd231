// Calculation logic for calculator page

import { getState, setState } from './calculator-state.mjs';
import { updateProfitCalculations } from './calculator-utils.mjs';
import { notification } from '../utils/modal-dialog.mjs';

export function checkAllCostsEntered() {
    const state = getState();
    if (!state.currentRecipe) return;
    
    const totalIngredients = state.currentRecipe.ingredients.length;
    const filledIngredients = Object.keys(state.ingredientCosts).filter(key => state.ingredientCosts[key] !== null).length;
    
    const calculateBtn = document.getElementById('calculate-btn');
    if (!calculateBtn) return;
    
    calculateBtn.disabled = filledIngredients === 0;
    
    if (filledIngredients === 0) {
        calculateBtn.textContent = 'Calculate Costs';
    } else if (filledIngredients < totalIngredients) {
        calculateBtn.textContent = `Calculate Costs (${filledIngredients}/${totalIngredients} ingredients)`;
    } else {
        calculateBtn.textContent = 'Calculate Costs (All ingredients)';
    }
}

export async function calculateCosts() {
    const state = getState();
    
    const costsWithData = Object.keys(state.ingredientCosts).filter(key => state.ingredientCosts[key] !== null);
    
    if (!state.currentRecipe || costsWithData.length === 0) {
        await notification.warning('Please enter costs for at least one ingredient');
        return;
    }
    
    const totalCost = Object.values(state.ingredientCosts)
        .filter(item => item !== null)
        .reduce((sum, item) => sum + item.costForRecipe, 0);
    
    const costPerPortion = totalCost / state.currentRecipe.serves;
    const includedIngredients = costsWithData.length;
    
    const calculationResults = {
        recipeId: state.currentRecipe.id,
        recipeName: state.currentRecipe.name,
        totalCost, costPerPortion,
        serves: state.currentRecipe.serves,
        ingredientCosts: { ...state.ingredientCosts },
        includedIngredients, totalIngredients: state.currentRecipe.ingredients.length,
        timestamp: new Date().toISOString()
    };
    
    setState({ calculationResults });
    displayResults();
    
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

export function displayResults() {
    const state = getState();
    const { totalCost, costPerPortion, includedIngredients, totalIngredients } = state.calculationResults;
    
    const totalCostElement = document.getElementById('total-cost');
    const costPerPortionElement = document.getElementById('cost-per-portion');
    
    if (totalCostElement) totalCostElement.textContent = totalCost.toFixed(2);
    if (costPerPortionElement) costPerPortionElement.textContent = costPerPortion.toFixed(2);
    
    const totalCostCard = document.querySelector('.result-card .cost-description');
    if (totalCostCard) {
        totalCostCard.textContent = includedIngredients < totalIngredients 
            ? `Total cost of ${includedIngredients} out of ${totalIngredients} ingredients`
            : 'Total cost of all ingredients';
    }
    
    updateProfitCalculations();
}

export function toggleCostBreakdown() {
    const breakdownSection = document.getElementById('cost-breakdown');
    const toggleBtn = document.getElementById('toggle-breakdown');
    
    if (!breakdownSection || !toggleBtn) {
        console.warn('Cost breakdown elements not found');
        return;
    }
    
    const isVisible = breakdownSection.style.display !== 'none';
    
    if (isVisible) {
        breakdownSection.style.display = 'none';
        toggleBtn.textContent = 'Show Cost Breakdown';
    } else {
        breakdownSection.style.display = 'block';
        toggleBtn.textContent = 'Hide Cost Breakdown';
        
        // Generate cost breakdown if not already generated
        generateCostBreakdown();
    }
}

function generateCostBreakdown() {
    const state = getState();
    const breakdownContainer = document.getElementById('cost-breakdown-content');
    
    if (!breakdownContainer || !state.calculationResults) return;
    
    const { ingredientCosts } = state.calculationResults;
    const breakdown = Object.entries(ingredientCosts)
        .filter(([_, cost]) => cost !== null)
        .map(([index, cost]) => {
            const ingredient = state.currentRecipe.ingredients[index];
            return `
                <div class="breakdown-item">
                    <span class="ingredient-name">${ingredient.item}</span>
                    <span class="ingredient-cost">$${cost.costForRecipe.toFixed(2)}</span>
                </div>
            `;
        }).join('');
    
    breakdownContainer.innerHTML = breakdown || '<p>No cost breakdown available.</p>';
}