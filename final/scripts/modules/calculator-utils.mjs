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

export function convertUnits(fromQuantity, fromUnit, toUnit) {
    if (!fromUnit || !toUnit || fromUnit === toUnit) return fromQuantity;

    const fromType = getUnitType(fromUnit);
    const toType = getUnitType(toUnit);

    if (fromType !== toType) throw new Error('Incompatible unit types');

    const conversionTable = unitConversions[fromType];
    const fromFactor = conversionTable.conversions[fromUnit.toLowerCase()];
    const toFactor = conversionTable.conversions[toUnit.toLowerCase()];

    if (!fromFactor || !toFactor) throw new Error('Invalid units');

    return (fromQuantity * fromFactor) / toFactor;
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
        throw new Error('Missing input fields for ingredient cost calculation');
    }

    const purchaseQuantity = parseFloat(purchaseQuantityInput.value);
    const purchaseUnit = purchaseUnitSelect.value;
    const purchasePrice = parseFloat(purchasePriceInput.value);

    if (isNaN(purchaseQuantity) || isNaN(purchasePrice) || !purchaseUnit) {
        return;
    }

    const unitCost = purchasePrice / purchaseQuantity;
    const unitCostDisplay = itemDiv.querySelector('.unit-cost-value');
    if (unitCostDisplay) {
        unitCostDisplay.textContent = `$${unitCost.toFixed(2)}`;
    }

    const recipeCostDisplay = itemDiv.querySelector('.recipe-cost-value');
    if (actualQuantityInput && actualUnitSelect && recipeCostDisplay) {
        const actualQuantity = parseFloat(actualQuantityInput.value);
        const actualUnit = actualUnitSelect.value;

        if (!isNaN(actualQuantity) && actualUnit) {
            const convertedQuantity = convertUnits(actualQuantity, actualUnit, purchaseUnit);
            const recipeCost = convertedQuantity * unitCost;
            recipeCostDisplay.textContent = `$${recipeCost.toFixed(2)}`;
        } else {
            recipeCostDisplay.textContent = '$0.00';
        }
    }
}

// Function to update profit calculations dynamically
export function updateProfitCalculations() {
    const profitMarginInput = document.getElementById('profit-margin');
    const totalCostElement = document.getElementById('total-cost');
    const profitDisplay = document.getElementById('profit-display');

    if (!profitMarginInput || !totalCostElement || !profitDisplay) {
        throw new Error('Missing elements for profit calculation');
    }

    const profitMargin = parseFloat(profitMarginInput.value);
    const totalCost = parseFloat(totalCostElement.textContent.replace('$', ''));

    if (isNaN(profitMargin) || isNaN(totalCost)) {
        profitDisplay.textContent = '$0.00';
        return;
    }

    const profit = totalCost * (profitMargin / 100);
    profitDisplay.textContent = `$${profit.toFixed(2)}`;
}