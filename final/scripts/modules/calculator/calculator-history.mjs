// History management for calculator page

import { getState } from './calculator-state.mjs';
import { notification, showConfirmation } from '../utils/modal-dialog.mjs';

export function loadCalculationHistory() {
    const savedCalculations = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    return savedCalculations;
}

export async function saveCalculation() {
    const state = getState();
    
    if (!state.calculationResults || Object.keys(state.calculationResults).length === 0 || !state.currentRecipe) {
        await notification.warning('No calculation to save. Please calculate costs first.');
        return;
    }
    
    const calculation = {
        id: Date.now(),
        ...state.calculationResults,
        savedAt: new Date().toISOString()
    };
    
    const savedCalculations = loadCalculationHistory();
    savedCalculations.push(calculation);
    localStorage.setItem('calculationHistory', JSON.stringify(savedCalculations));
    
    await notification.success('Cálculo Salvo!', 'Seu cálculo foi salvo com sucesso na sua coleção.');
    
    // Update the history display
    displayCalculationHistory();
}

export function loadSavedCalculation(calcId, savedCalculations) {
    const calculation = savedCalculations.find(calc => calc.id === calcId);
    if (!calculation) throw new Error('Calculation not found');
    return calculation;
}

export function displayCalculationHistory() {
    const savedCalculations = loadCalculationHistory();
    const historyGrid = document.getElementById('history-grid');
    
    if (!historyGrid) {
        console.error('History grid element not found');
        return;
    }
    
    if (savedCalculations.length === 0) {
        historyGrid.innerHTML = '<p class="no-history">No saved calculations yet.</p>';
        return;
    }
    
    historyGrid.innerHTML = savedCalculations.map(calc => `
        <div class="history-item" data-calc-id="${calc.id}">
            <div class="history-header">
                <h4>${calc.recipeName || 'Unknown Recipe'}</h4>
                <span class="history-date">${new Date(calc.savedAt).toLocaleDateString()}</span>
            </div>
            <div class="history-details">
                <p><strong>Total Cost:</strong> $${calc.totalCost ? calc.totalCost.toFixed(2) : '0.00'}</p>
                <p><strong>Cost per Portion:</strong> $${calc.costPerPortion ? calc.costPerPortion.toFixed(2) : '0.00'}</p>
                <p><strong>Serves:</strong> ${calc.serves || 'N/A'}</p>
                <p><strong>Ingredients Used:</strong> ${calc.includedIngredients || 0}/${calc.totalIngredients || 0}</p>
            </div>
            <div class="history-actions">
                <button class="load-calc-btn" data-calc-id="${calc.id}">Load</button>
                <button class="delete-calc-btn" data-calc-id="${calc.id}">Delete</button>
            </div>
        </div>
    `).join('');
    
    // Add event listeners for load and delete buttons
    historyGrid.querySelectorAll('.load-calc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const calcId = parseInt(e.target.dataset.calcId);
            loadCalculationById(calcId);
        });
    });
    
    historyGrid.querySelectorAll('.delete-calc-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const calcId = parseInt(e.target.dataset.calcId);
            deleteCalculation(calcId);
        });
    });
}

async function loadCalculationById(calcId) {
    try {
        const savedCalculations = loadCalculationHistory();
        const calculation = loadSavedCalculation(calcId, savedCalculations);
        
        // Load the recipe data first
        const { loadRecipes, getRecipeById } = await import('../recipe/recipe-data.mjs');
        await loadRecipes();
        
        const recipe = getRecipeById(calculation.recipeId);
        if (!recipe) {
            await notification.error('Receita Não Encontrada', 'A receita associada a este cálculo não foi encontrada.');
            return;
        }
        
        // Set the recipe in the selector
        const recipeSelect = document.getElementById('recipe-select');
        if (recipeSelect) {
            recipeSelect.value = calculation.recipeId;
            
            // Trigger change event to load the recipe
            const changeEvent = new Event('change');
            recipeSelect.dispatchEvent(changeEvent);
        }
        
        // Wait a bit for the recipe to load, then set the costs
        setTimeout(async () => {
            try {
                // Set the ingredient costs
                if (calculation.ingredientCosts) {
                    Object.keys(calculation.ingredientCosts).forEach(index => {
                        const costData = calculation.ingredientCosts[index];
                        if (!costData) return;
                        
                        // Find the cost input for this ingredient
                        const costInput = document.querySelector(`[data-ingredient-index="${index}"] .cost-input`);
                        const unitSelect = document.querySelector(`[data-ingredient-index="${index}"] .unit-select`);
                        const quantityInput = document.querySelector(`[data-ingredient-index="${index}"] .quantity-input`);
                        
                        if (costInput && costData.totalCost) {
                            costInput.value = costData.totalCost.toFixed(2);
                        }
                        
                        if (unitSelect && costData.unit) {
                            unitSelect.value = costData.unit;
                        }
                        
                        if (quantityInput && costData.quantity) {
                            quantityInput.value = costData.quantity;
                        }
                        
                        // Trigger input events to update calculations
                        if (costInput) {
                            costInput.dispatchEvent(new Event('input'));
                        }
                    });
                }
                
                // Set serves if available
                const servesInput = document.getElementById('recipe-serves');
                if (servesInput && calculation.serves) {
                    servesInput.value = calculation.serves;
                    servesInput.dispatchEvent(new Event('input'));
                }
                
                // Set profit margin if available
                const profitInput = document.getElementById('profit-margin');
                if (profitInput && calculation.profitMargin) {
                    profitInput.value = calculation.profitMargin;
                    profitInput.dispatchEvent(new Event('input'));
                }
                
                await notification.success('Cálculo Carregado!', 'O cálculo foi carregado com sucesso. Todos os custos e configurações foram restaurados.');
                
            } catch (loadError) {
                console.error('Error setting calculation data:', loadError);
                await notification.warning('Carregamento Parcial', 'A receita foi carregada, mas alguns dados podem não ter sido restaurados completamente.');
            }
        }, 500);
        
    } catch (error) {
        console.error('Error loading calculation:', error);
        await notification.error('Erro ao Carregar', 'Não foi possível carregar o cálculo. Tente novamente.');
    }
}

async function deleteCalculation(calcId) {
    const calculation = loadCalculationHistory().find(calc => calc.id === calcId);
    const recipeName = calculation?.recipeName || 'this calculation';
    
    const confirmed = await showConfirmation(
        'Confirmar Exclusão',
        `Tem certeza que deseja apagar o cálculo "${recipeName}"? Esta ação não pode ser desfeita.`,
        'Apagar',
        'Cancelar'
    );
    if (confirmed) {
        const savedCalculations = loadCalculationHistory();
        const filteredCalculations = savedCalculations.filter(calc => calc.id !== calcId);
        localStorage.setItem('calculationHistory', JSON.stringify(filteredCalculations));
        displayCalculationHistory(); // Refresh the display
        await notification.success('Cálculo Apagado!', 'O cálculo foi removido com sucesso.');
    }
}