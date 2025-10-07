// Ingredient management for calculator page

import { calculateIngredientCost } from './calculator-utils.mjs';
import { createUnitOptions, addSectionHeader } from './calculator-template.mjs';
import { createToTasteSection } from './calculator-taste.mjs';

export async function setupCostInputs(recipe) {
    const container = document.getElementById('ingredients-cost-grid');
    if (!container) {
        console.error('Ingredients cost grid container not found');
        return;
    }
    
    container.innerHTML = '';
    
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
                    <option value="g">grams</option>
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
    const updateCalculation = () => calculateIngredientCost(index, ingredient, itemDiv);
    
    inputs.forEach(input => {
        if (input) {
            input.addEventListener('input', updateCalculation);
            input.addEventListener('change', updateCalculation);
        }
    });
    
    const removeBtn = itemDiv.querySelector('.remove-btn');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            // Import dinamicamente para evitar dependência circular
            import('./calculator-taste.mjs').then(({ removeToTasteIngredient }) => {
                removeToTasteIngredient(index);
            });
        });
    }
}