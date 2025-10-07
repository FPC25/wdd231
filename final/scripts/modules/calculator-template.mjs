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

export function addSectionHeader(container, title) {
    const header = document.createElement('h3');
    header.textContent = title;
    header.className = 'ingredients-section-header';
    container.appendChild(header);
}