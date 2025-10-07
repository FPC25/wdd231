// Reset and navigation for calculator page

import { setState } from './calculator-state.mjs';
import { populateRecipeSelect } from './calculator-renderer.mjs';

export function resetCalculator() {
    const recipeSelect = document.getElementById('recipe-select');
    const loadBtn = document.getElementById('load-recipe-btn');
    
    if (recipeSelect) {
        recipeSelect.value = '';
        recipeSelect.style.border = '';
    }
    if (loadBtn) {
        loadBtn.disabled = true;
        loadBtn.style.background = '';
        loadBtn.style.color = '';
    }
    
    const recipeDisplaySection = document.getElementById('recipe-display');
    const costInputSection = document.getElementById('cost-input');
    const resultsSection = document.getElementById('results');
    
    if (recipeDisplaySection) recipeDisplaySection.style.display = 'none';
    if (costInputSection) costInputSection.style.display = 'none';
    if (resultsSection) resultsSection.style.display = 'none';
    
    setState({ 
        currentRecipe: null, 
        ingredientCosts: {}, 
        calculationResults: {} 
    });
    
    populateRecipeSelect();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function setupBottomNavigation() {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        if (item.getAttribute('href') === './calculator.html') {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}