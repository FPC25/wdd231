// DOM manipulation for calculator page

export function getDomElements() {
    return {
        recipeSelect: document.getElementById('recipe-select'),
        loadBtn: document.getElementById('load-recipe-btn'),
        calculateBtn: document.getElementById('calculate-btn'),
        profitMarginInput: document.getElementById('profit-margin'),
        toggleBreakdownBtn: document.getElementById('toggle-breakdown'),
        saveBtn: document.getElementById('save-calculation'),
        resetBtn: document.getElementById('reset-calculator'),
    };
}

export function updateDomElementStyles(element, styles) {
    if (!element) return;
    Object.assign(element.style, styles);
}