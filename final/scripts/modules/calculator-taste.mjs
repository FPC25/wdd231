// "To taste" ingredients management

import { getState, setState } from './calculator-state.mjs';
import { createIngredientItem } from './calculator-ingredients.mjs';

export function createToTasteSection(toTasteIngredients, container) {
    const toTasteSection = document.createElement('section');
    toTasteSection.className = 'to-taste-section';
    toTasteSection.innerHTML = `
        <h3 class="ingredients-section-header">Other Ingredients (Optional)</h3>
        <p class="section-description">
            These ingredients are marked as "to taste" in the recipe. 
            Select which ones you want to include in your cost calculation:
        </p>
        <div class="to-taste-controls">
            <button type="button" id="add-to-taste-btn" class="add-btn">
                + Add Optional Ingredient
            </button>
            <div class="to-taste-selector" id="to-taste-selector" style="display: none;">
                <select id="to-taste-ingredient-select">
                    <option value="">Choose an ingredient...</option>
                    ${toTasteIngredients.map(ingredient => 
                        `<option value="${ingredient.originalIndex}">${ingredient.item}</option>`
                    ).join('')}
                </select>
                <button type="button" id="confirm-to-taste-btn" class="confirm-btn">Add</button>
                <button type="button" id="cancel-to-taste-btn" class="cancel-btn">Cancel</button>
            </div>
        </div>
        <div class="to-taste-ingredients" id="to-taste-ingredients"></div>
    `;
    
    container.appendChild(toTasteSection);
    setupToTasteEventListeners(toTasteIngredients);
}

export function setupToTasteEventListeners(toTasteIngredients) {
    const addBtn = document.getElementById('add-to-taste-btn');
    const selector = document.getElementById('to-taste-selector');
    const select = document.getElementById('to-taste-ingredient-select');
    const confirmBtn = document.getElementById('confirm-to-taste-btn');
    const cancelBtn = document.getElementById('cancel-to-taste-btn');
    
    if (!addBtn || !selector || !select || !confirmBtn || !cancelBtn) {
        console.error('To-taste elements not found');
        return;
    }
    
    addBtn.addEventListener('click', () => {
        const availableOptions = Array.from(select.options).filter(option => 
            option.value !== '' && !option.disabled
        );
        
        if (availableOptions.length === 0) {
            alert('All optional ingredients have been added.');
            return;
        }
        
        addBtn.style.display = 'none';
        selector.style.display = 'flex';
        select.value = '';
    });
    
    confirmBtn.addEventListener('click', () => {
        const selectedIndex = parseInt(select.value);
        if (!selectedIndex && selectedIndex !== 0) {
            alert('Please select an ingredient.');
            return;
        }
        
        const ingredient = toTasteIngredients.find(ing => ing.originalIndex === selectedIndex);
        if (ingredient) {
            const container = document.getElementById('to-taste-ingredients');
            if (container) {
                createIngredientItem(ingredient, container, true);
                
                const option = select.querySelector(`option[value="${selectedIndex}"]`);
                if (option) {
                    option.disabled = true;
                    option.style.display = 'none';
                }
            }
        }
        
        addBtn.style.display = 'inline-block';
        selector.style.display = 'none';
        select.value = '';
    });
    
    cancelBtn.addEventListener('click', () => {
        addBtn.style.display = 'inline-block';
        selector.style.display = 'none';
        select.value = '';
    });
}

export function removeToTasteIngredient(index) {
    const itemDiv = document.querySelector(`[data-ingredient-index="${index}"].optional`);
    if (itemDiv) itemDiv.remove();
    
    const select = document.getElementById('to-taste-ingredient-select');
    const option = select?.querySelector(`option[value="${index}"]`);
    if (option) {
        option.disabled = false;
        option.style.display = 'block';
    }
    
    const state = getState();
    const newIngredientCosts = { ...state.ingredientCosts };
    delete newIngredientCosts[index];
    setState({ ingredientCosts: newIngredientCosts });
    
    // Import checkAllCostsEntered dinamicamente para evitar dependência circular
    import('./calculator-calculations.mjs').then(({ checkAllCostsEntered }) => {
        checkAllCostsEntered();
    });
}