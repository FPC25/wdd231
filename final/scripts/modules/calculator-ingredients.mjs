// Ingredient management for calculator page

import { calculateIngredientCost } from './calculator-utils.mjs';
import { createUnitOptions, addSectionHeader } from './calculator-template.mjs';
import { getState, setState } from './calculator-state.mjs';

export async function setupCostInputs(recipe) {
    const container = document.getElementById('ingredients-cost-grid');
    const costInputSection = document.getElementById('cost-input');
    
    if (!container) {
        console.error('Ingredients cost grid container not found');
        return;
    }
    
    container.innerHTML = '';
    
    // Mostrar a seção de input de custos
    if (costInputSection) {
        costInputSection.style.display = 'block';
    }
    
    const { essentialIngredients, toTasteIngredients } = separateIngredients(recipe);
    
    if (essentialIngredients.length > 0) {
        addSectionHeader(container, 'Essential Ingredients');
        essentialIngredients.forEach(ingredient => createIngredientItem(ingredient, container));
    }
    
    if (toTasteIngredients.length > 0) {
        createToTasteSection(toTasteIngredients, container);
    }
}

export function separateIngredients(recipe) {
    const essentialIngredients = [];
    const toTasteIngredients = [];
    
    recipe.ingredients.forEach((ingredient, index) => {
        const ingredientWithIndex = { ...ingredient, originalIndex: index };
        if (ingredient.quantity === 'to taste') {
            toTasteIngredients.push(ingredientWithIndex);
        } else {
            essentialIngredients.push(ingredientWithIndex);
        }
    });
    
    return { essentialIngredients, toTasteIngredients };
}

export function createIngredientItem(ingredient, container, isOptional = false) {
    const index = ingredient.originalIndex;
    const itemDiv = document.createElement('div');
    itemDiv.className = `ingredient-item ${isOptional ? 'optional' : ''}`;
    itemDiv.dataset.ingredientIndex = index;
    
    const recipeQuantity = ingredient.quantity === 'to taste' ? 'to taste' :
        ingredient.unit ? `${ingredient.quantity} ${ingredient.unit}` : `${ingredient.quantity}`;
    
    itemDiv.innerHTML = createIngredientTemplate(ingredient, index, recipeQuantity, isOptional);
    container.appendChild(itemDiv);
    
    setupIngredientEventListeners(itemDiv, ingredient, index);
}

export function createIngredientTemplate(ingredient, index, recipeQuantity, isOptional) {
    const removeButton = isOptional ? 
        `<button type="button" class="remove-btn" data-index="${index}">×</button>` : '';
    
    const actualUsageSection = ingredient.quantity === 'to taste' ? `
        <div class="actual-usage">
            <h5>Amount you'll actually use:</h5>
            <div class="usage-inputs">
                <input type="number" class="actual-quantity" data-ingredient-index="${index}"
                       placeholder="Amount" step="0.01" min="0">
                <select class="actual-unit" data-ingredient-index="${index}">
                    <option value="">Unit</option>
                    <option value="g">g</option>
                    <option value="kg">kg</option>
                    <option value="lb">pounds</option>
                    <option value="oz">ounces</option>
                    <option value="ml">ml</option>
                    <option value="l">liters</option>
                    <option value="cup">cups</option>
                    <option value="tbsp">tbsp</option>
                    <option value="tsp">tsp</option>
                    <option value="piece">pieces</option>
                </select>
            </div>
        </div>
    ` : '';
    
    return `
        <div class="ingredient-header">
            <div class="ingredient-name">${ingredient.item}</div>
            <div class="recipe-needs">Recipe needs: ${recipeQuantity}</div>
            ${removeButton}
        </div>
        
        ${actualUsageSection}
        
        <div class="purchase-inputs">
            <div class="input-group">
                <label>Quantity you buy:</label>
                <input type="number" class="purchase-quantity" data-ingredient-index="${index}"
                       placeholder="e.g., 1000" step="0.01" min="0">
            </div>
            
            <div class="input-group">
                <label>Unit:</label>
                <select class="purchase-unit" data-ingredient-index="${index}">
                    <option value="">Select unit</option>
                    ${createUnitOptions()}
                </select>
            </div>
            
            <div class="input-group">
                <label>Total price paid:</label>
                <div class="price-input">
                    <span class="currency">$</span>
                    <input type="number" class="purchase-price" data-ingredient-index="${index}"
                           placeholder="0.00" step="0.01" min="0">
                </div>
            </div>
        </div>
        
        <div class="cost-display">
            <div class="conversion-info" id="conversion-info-${index}" style="display: none;">
                <small class="conversion-text">Conversion: <span class="conversion-details"></span></small>
            </div>
            <div class="unit-cost">Cost per unit: <span class="unit-cost-value">$0.00</span></div>
            <div class="recipe-cost">Cost for this recipe: <span class="recipe-cost-value">$0.00</span></div>
        </div>
    `;
}

export function setupIngredientEventListeners(itemDiv, ingredient, index) {
    const inputs = itemDiv.querySelectorAll('.purchase-quantity, .purchase-unit, .purchase-price, .actual-quantity, .actual-unit');
    const updateCalculation = () => {
        try {
            calculateIngredientCost(index, ingredient, itemDiv);
        } catch (error) {
            console.error('Error calculating ingredient cost:', error);
        }
    };
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', updateCalculation);
            input.addEventListener('change', updateCalculation);
        }
    });
    
    const removeBtn = itemDiv.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            removeToTasteIngredient(index);
        });
    }
}

// === TO TASTE INGREDIENTS MANAGEMENT ===
// (Moved from calculator-taste.mjs to eliminate circular dependency)

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