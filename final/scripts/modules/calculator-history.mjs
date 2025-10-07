// History management for calculator page

import { getState } from './calculator-state.mjs';

export function loadCalculationHistory() {
    const savedCalculations = JSON.parse(localStorage.getItem('calculationHistory') || '[]');
    console.log('Loaded calculation history:', savedCalculations);
    return savedCalculations;
}

export function saveCalculation() {
    const state = getState();
    
    if (!state.calculationResults || !state.currentRecipe) {
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
}

export function loadSavedCalculation(calcId, savedCalculations) {
    const calculation = savedCalculations.find(calc => calc.id === calcId);
    if (!calculation) throw new Error('Calculation not found');
    console.log('Loaded saved calculation:', calculation);
    return calculation;
}