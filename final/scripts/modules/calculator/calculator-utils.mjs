// Utility functions for calculator page

const unitConversions = {
    weight: {
        baseUnit: 'g',
        conversions: { 'g': 1, 'kg': 1000, 'lb': 453.592, 'oz': 28.3495 }
    },
    volume: {
        baseUnit: 'ml',
        conversions: {
            'ml': 1, 'l': 1000, 'cup': 240, 'tbsp': 15, 'tsp': 5,
            'fl oz': 29.5735, 'pint': 473.176, 'quart': 946.353, 'gallon': 3785.41
        }
    },
    unit: {
        baseUnit: 'piece',
        conversions: { 'piece': 1 }
    }
};

const ingredientConversions = {
    'flour': { 'cup': 120 }, 'all-purpose flour': { 'cup': 120 }, 'bread flour': { 'cup': 120 },
    'almond flour': { 'cup': 96 }, 'farinha': { 'cup': 120 }, 'farinha de trigo': { 'cup': 120 },
    'sugar': { 'cup': 200 }, 'granulated sugar': { 'cup': 200 }, 'brown sugar': { 'cup': 213 },
    'powdered sugar': { 'cup': 113.5 }, 'açúcar': { 'cup': 200 }, 'açúcar cristal': { 'cup': 200 },
    'açúcar mascavo': { 'cup': 213 }, 'butter': { 'cup': 227 }, 'milk': { 'cup': 240 },
    'manteiga': { 'cup': 227 }, 'leite': { 'cup': 240 }, 'oats': { 'cup': 85 },
    'rolled oats': { 'cup': 85 }, 'aveia': { 'cup': 85 }, 'cocoa powder': { 'cup': 84 },
    'chocolate chips': { 'cup': 170 }, 'cacau em pó': { 'cup': 84 }, 'nuts': { 'cup': 113 },
    'walnuts': { 'cup': 113 }, 'nozes': { 'cup': 113 }, 'honey': { 'cup': 340 },
    'maple syrup': { 'cup': 340 }, 'mel': { 'cup': 340 }
};

export function getUnitType(unit) {
    const lowerUnit = unit.toLowerCase();
    
    if (unitConversions.weight.conversions[lowerUnit]) return 'weight';
    if (unitConversions.volume.conversions[lowerUnit]) return 'volume';
    if (unitConversions.unit.conversions[lowerUnit]) return 'unit';
    
    throw new Error(`Unknown unit type for: ${unit}`);
}

export function convertUnits(fromQuantity, fromUnit, toUnit) {
    if (!fromQuantity || isNaN(fromQuantity)) return 0;
    if (!fromUnit || !toUnit) {
        return fromQuantity;
    }
    
    // Se as unidades são iguais, retorna a quantidade original
    if (fromUnit === toUnit) {
        return fromQuantity;
    }

    try {
        const fromType = getUnitType(fromUnit);
        const toType = getUnitType(toUnit);

        if (fromType !== toType) {
            console.warn(`Incompatible unit types: ${fromUnit} (${fromType}) to ${toUnit} (${toType})`);
            return fromQuantity; // Retorna quantidade original se não conseguir converter
        }

        const conversionTable = unitConversions[fromType];
        const fromFactor = conversionTable.conversions[fromUnit.toLowerCase()];
        const toFactor = conversionTable.conversions[toUnit.toLowerCase()];

        if (!fromFactor || !toFactor) {
            console.warn(`Invalid units for conversion: ${fromUnit} or ${toUnit}`);
            return fromQuantity; // Retorna quantidade original
        }

        const result = (fromQuantity * fromFactor) / toFactor;
        return result;
    } catch (error) {
        console.warn('Unit conversion error:', error.message);
        return fromQuantity; // Retorna quantidade original em caso de erro
    }
}

export function convertVolumeToWeight(quantity, volumeUnit, ingredientName) {
    if (!ingredientName) throw new Error('Ingredient name is required');

    const ingredientKey = ingredientName.toLowerCase().trim();
    const conversionData = ingredientConversions[ingredientKey];

    if (!conversionData) throw new Error(`No conversion data for ingredient: ${ingredientName}`);

    const quantityInCups = convertUnits(quantity, volumeUnit, 'cup');
    return quantityInCups * conversionData.cup;
}

// Function to calculate the cost of an ingredient
export function calculateIngredientCost(index, ingredient, itemDiv) {
    const purchaseQuantityInput = itemDiv.querySelector('.purchase-quantity');
    const purchaseUnitSelect = itemDiv.querySelector('.purchase-unit');
    const purchasePriceInput = itemDiv.querySelector('.purchase-price');
    const actualQuantityInput = itemDiv.querySelector('.actual-quantity');
    const actualUnitSelect = itemDiv.querySelector('.actual-unit');

    if (!purchaseQuantityInput || !purchaseUnitSelect || !purchasePriceInput) {
        console.error('Missing input fields for ingredient cost calculation');
        return;
    }

    const purchaseQuantity = parseFloat(purchaseQuantityInput.value);
    const purchaseUnit = purchaseUnitSelect.value;
    const purchasePrice = parseFloat(purchasePriceInput.value);

    // Limpar displays se campos estão vazios
    const unitCostDisplay = itemDiv.querySelector('.unit-cost-value');
    const recipeCostDisplay = itemDiv.querySelector('.recipe-cost-value');
    
    if (isNaN(purchaseQuantity) || isNaN(purchasePrice) || !purchaseUnit) {
        if (unitCostDisplay) unitCostDisplay.textContent = '$0.00';
        if (recipeCostDisplay) recipeCostDisplay.textContent = '$0.00';
        
        // Remover do estado se campos estão vazios
        updateIngredientCostState(index, null);
        return;
    }

    // CORREÇÃO: Calcular custo por unidade da receita, não por unidade de compra
    let unitCost = 0;
    let recipeUnit = ingredient.unit;
    
    // Normalizar unidade da receita
    if (recipeUnit === 'unit') {
        recipeUnit = 'piece';
    }
    if (!recipeUnit) {
        recipeUnit = 'piece';
    }

    try {
        // Para ingredientes "to taste", usar a unidade atual se disponível
        let targetUnit = recipeUnit;
        if (ingredient.quantity === 'to taste' && actualUnitSelect && actualUnitSelect.value) {
            targetUnit = actualUnitSelect.value;
        }

        // Converter 1 unidade da receita para a unidade base (ml para volume, g para peso, piece para unidade)
        const recipeUnitType = getUnitType(targetUnit);
        const purchaseUnitType = getUnitType(purchaseUnit);
        
        if (recipeUnitType === purchaseUnitType) {
            // Converter para unidade base comum para fazer o cálculo
            const baseUnit = unitConversions[recipeUnitType].baseUnit;
            
            // 1 unidade da receita em unidade base
            const oneRecipeUnitInBase = convertUnits(1, targetUnit, baseUnit);
            
            // Total comprado em unidade base
            const totalPurchaseInBase = convertUnits(purchaseQuantity, purchaseUnit, baseUnit);
            
            // Custo por unidade base
            const costPerBaseUnit = purchasePrice / totalPurchaseInBase;
            
            // Custo por unidade da receita
            unitCost = oneRecipeUnitInBase * costPerBaseUnit;
        } else {
            // Unidades incompatíveis, usar cálculo direto
            unitCost = purchasePrice / purchaseQuantity;
        }
    } catch (error) {
        console.warn('Error calculating unit cost:', error.message);
        // Fallback para cálculo simples
        unitCost = purchasePrice / purchaseQuantity;
    }

    if (unitCostDisplay) {
        unitCostDisplay.textContent = `$${unitCost.toFixed(2)}`;
    }

    let recipeCost = 0;
    
    // Para ingredientes "to taste" que precisam de quantidade atual
    if (ingredient.quantity === 'to taste' && actualQuantityInput && actualUnitSelect) {
        const actualQuantity = parseFloat(actualQuantityInput.value);
        const actualUnit = actualUnitSelect.value;

        if (!isNaN(actualQuantity) && actualUnit) {
            // Se a unidade atual é a mesma usada para calcular unitCost, multiplicação direta
            if (actualUnit === (ingredient.unit === 'unit' ? 'piece' : (ingredient.unit || 'piece'))) {
                recipeCost = actualQuantity * unitCost;
            } else {
                // Caso contrário, converter para a unidade base e calcular
                try {
                    const targetUnit = ingredient.unit === 'unit' ? 'piece' : (ingredient.unit || 'piece');
                    const convertedQuantity = convertUnits(actualQuantity, actualUnit, targetUnit);
                    recipeCost = convertedQuantity * unitCost;
                } catch (error) {
                    console.warn('Unit conversion error:', error.message);
                    recipeCost = 0;
                }
            }
        }
    } else {
        // Para ingredientes essenciais, usar a quantidade da receita
        const recipeQuantity = parseFloat(ingredient.quantity);
        if (!isNaN(recipeQuantity)) {
            // Multiplicação direta já que unitCost está na unidade correta da receita
            recipeCost = recipeQuantity * unitCost;
        }
    }
    
    if (recipeCostDisplay) {
        recipeCostDisplay.textContent = `$${recipeCost.toFixed(2)}`;
    }

    // Salvar no estado apenas se há custo válido
    const costData = recipeCost > 0 ? {
        costPerUnit: unitCost,
        costForRecipe: recipeCost
    } : null;
    
    updateIngredientCostState(index, costData);
}

// Função helper para atualizar o estado sem circular imports
function updateIngredientCostState(index, costData) {
    // Use setTimeout para evitar problemas de timing
    setTimeout(() => {
        // Import usando dynamic import para evitar circular dependency
        import('./calculator-state.mjs').then(({ getState, setState }) => {
            const state = getState();
            const newIngredientCosts = { ...state.ingredientCosts };
            
            if (costData) {
                newIngredientCosts[index] = costData;
            } else {
                delete newIngredientCosts[index];
            }
            
            setState({ ingredientCosts: newIngredientCosts });
            
            // Atualizar botão de calcular
            import('./calculator-calculations.mjs').then(({ checkAllCostsEntered }) => {
                checkAllCostsEntered();
            });
        });
    }, 0);
}

// Function to update profit calculations dynamically
export function updateProfitCalculations() {
    const profitMarginInput = document.getElementById('profit-margin');
    const costPerPortionElement = document.getElementById('cost-per-portion');
    const suggestedPriceElement = document.getElementById('suggested-price');
    const totalSalePriceElement = document.getElementById('total-sale-price');
    const profitAmountElement = document.getElementById('profit-amount');
    const totalCostElement = document.getElementById('total-cost');

    // Se algum elemento não existir, usar valores padrão
    if (!profitMarginInput || !costPerPortionElement || !suggestedPriceElement) {
        console.warn('Missing elements for profit calculation, using defaults');
        return;
    }

    const profitMargin = parseFloat(profitMarginInput.value) || 20; // Default 20%
    const costPerPortionText = costPerPortionElement.textContent || '0';
    const costPerPortion = parseFloat(costPerPortionText.replace('$', '')) || 0;

    if (costPerPortion <= 0) {
        suggestedPriceElement.textContent = '0.00';
        if (totalSalePriceElement) totalSalePriceElement.textContent = '0.00';
        if (profitAmountElement) profitAmountElement.textContent = '0.00';
        return;
    }

    // Calcular preço sugerido POR PORÇÃO com base no custo + margem de lucro
    const suggestedPricePerPortion = costPerPortion * (1 + profitMargin / 100);
    suggestedPriceElement.textContent = suggestedPricePerPortion.toFixed(2);

    // Obter número de porções da receita atual
    import('./calculator-state.mjs').then(({ getState }) => {
        const state = getState();
        const servings = state.currentRecipe ? state.currentRecipe.serves : 1;
        
        // Calcular preço total de venda da receita: preço por porção × número de porções
        const totalSalePrice = suggestedPricePerPortion * servings;
        if (totalSalePriceElement) {
            totalSalePriceElement.textContent = totalSalePrice.toFixed(2);
        }

        // Calcular lucro esperado: preço de venda total - custo total
        if (profitAmountElement && totalCostElement) {
            const totalCostText = totalCostElement.textContent || '0';
            const totalCost = parseFloat(totalCostText.replace('$', '')) || 0;
            const expectedProfit = totalSalePrice - totalCost;
            profitAmountElement.textContent = expectedProfit.toFixed(2);
        }
    });
}