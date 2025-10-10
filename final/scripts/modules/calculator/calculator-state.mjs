// State management for calculator page

let currentRecipe = null;
let ingredientCosts = {};
let calculationResults = {};

export function getState() {
    return { currentRecipe, ingredientCosts, calculationResults };
}

export function setState(newState) {
    if (newState.currentRecipe !== undefined) currentRecipe = newState.currentRecipe;
    if (newState.ingredientCosts !== undefined) ingredientCosts = newState.ingredientCosts;
    if (newState.calculationResults !== undefined) calculationResults = newState.calculationResults;
}