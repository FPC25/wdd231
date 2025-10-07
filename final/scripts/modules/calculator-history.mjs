// History management for calculator page

import { getState } from './calculator-state.mjs';

export function loadCalculationHistory() {
    const savedCalculations = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    console.log('Loaded calculation history:', savedCalculations);
    return savedCalculations;
}

export function saveCalculation() {
    const state = getState();
    
    console.log('State when trying to save:', state);
    console.log('calculationResults:', state.calculationResults);
    console.log('currentRecipe:', state.currentRecipe);
    
    if (!state.calculationResults || Object.keys(state.calculationResults).length === 0 || !state.currentRecipe) {
        alert('No calculation to save. Please calculate costs first.');
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
    
    console.log('Calculation saved:', calculation);
    alert('Calculation saved successfully!');
    
    // Update the history display
    displayCalculationHistory();
}

export function loadSavedCalculation(calcId, savedCalculations) {
    const calculation = savedCalculations.find(calc => calc.id === calcId);
    if (!calculation) throw new Error('Calculation not found');
    console.log('Loaded saved calculation:', calculation);
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

function loadCalculationById(calcId) {
    try {
        const savedCalculations = loadCalculationHistory();
        const calculation = loadSavedCalculation(calcId, savedCalculations);
        
        // Here you would restore the calculation state
        // This would involve setting the recipe, ingredient costs, etc.
        console.log('Loading calculation:', calculation);
        alert('Calculation loaded! (Feature in development)');
        
    } catch (error) {
        console.error('Error loading calculation:', error);
        alert('Error loading calculation');
    }
}

function deleteCalculation(calcId) {
    if (confirm('Are you sure you want to delete this calculation?')) {
        const savedCalculations = loadCalculationHistory();
        const filteredCalculations = savedCalculations.filter(calc => calc.id !== calcId);
        localStorage.setItem('calculationHistory', JSON.stringify(filteredCalculations));
        displayCalculationHistory(); // Refresh the display
        console.log('Calculation deleted:', calcId);
    }
}