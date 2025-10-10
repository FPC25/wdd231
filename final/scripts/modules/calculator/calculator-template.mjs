// Template helpers for calculator page

export function createUnitOptions() {
    const unitOptions = ['piece']
        .map(unit => `<option value="${unit}">${unit}</option>`).join('');
    const weightOptions = ['g', 'kg', 'lb', 'oz']
        .map(unit => `<option value="${unit}">${unit}</option>`).join('');
    const volumeOptions = ['ml', 'l', 'cup', 'tbsp', 'tsp', 'fl oz', 'pint', 'quart', 'gallon']
        .map(unit => `<option value="${unit}">${unit}</option>`).join('');
    
    return `
        <optgroup label="Units">${unitOptions}</optgroup>
        <optgroup label="Weight">${weightOptions}</optgroup>
        <optgroup label="Volume">${volumeOptions}</optgroup>
    `;
}

// Criar opções de unidades compatíveis com base no tipo de unidade selecionado
export function createCompatibleUnitOptions(unitType, selectedUnit = null) {
    switch (unitType) {
        case 'weight':
            const weightOptions = ['g', 'kg', 'lb', 'oz']
                .map(unit => `<option value="${unit}" ${unit === selectedUnit ? 'selected' : ''}>${unit}</option>`).join('');
            return `<optgroup label="Weight">${weightOptions}</optgroup>`;
        
        case 'volume':
            const volumeOptions = ['ml', 'l', 'cup', 'tbsp', 'tsp', 'fl oz', 'pint', 'quart', 'gallon']
                .map(unit => `<option value="${unit}" ${unit === selectedUnit ? 'selected' : ''}>${unit}</option>`).join('');
            return `<optgroup label="Volume">${volumeOptions}</optgroup>`;
        
        case 'unit':
        default:
            return `<optgroup label="Units"><option value="piece" ${selectedUnit === 'piece' ? 'selected' : ''}>piece</option></optgroup>`;
    }
}

export function getUnitTypeForTemplate(unit) {
    const lowerUnit = unit.toLowerCase();
    
    // Unidades de peso
    const weightUnits = ['g', 'kg', 'lb', 'oz', 'gram', 'grams', 'kilogram', 'kilograms', 'pound', 'pounds', 'ounce', 'ounces'];
    if (weightUnits.includes(lowerUnit)) return 'weight';
    
    // Unidades de volume
    const volumeUnits = ['ml', 'l', 'cup', 'cups', 'tbsp', 'tsp', 'fl oz', 'pint', 'quart', 'gallon', 
                        'milliliter', 'milliliters', 'liter', 'liters', 'tablespoon', 'tablespoons', 
                        'teaspoon', 'teaspoons', 'fluid ounce', 'fluid ounces'];
    if (volumeUnits.includes(lowerUnit)) return 'volume';
    
    // Caso contrário, é piece (unidade padrão)
    return 'unit';
}

export function addSectionHeader(container, title) {
    const header = document.createElement('h3');
    header.textContent = title;
    header.className = 'ingredients-section-header';
    container.appendChild(header);
}