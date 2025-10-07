// Filtering functions for recipes

import { getRecipesData } from './recipe-data.mjs';

// Filtra receitas por critério e busca
export function filterRecipes(criteria, searchTerm = '') {
    const recipesData = getRecipesData();
    let filtered = [];
    
    switch (criteria) {
        case 'favorites':
            filtered = recipesData.filter(recipe => recipe.isFavorite === true);
            break;
        case 'saved':
            filtered = recipesData.filter(recipe => recipe.isSaved === true);
            break;
        case 'all':
        default:
            filtered = recipesData;
    }
    
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(searchLower);
            const ingredientMatch = recipe.ingredients && recipe.ingredients.some(ingredient => 
                ingredient.item && ingredient.item.toLowerCase().includes(searchLower)
            );
            const filterMatch = recipe.filters && recipe.filters.some(filter =>
                filter.toLowerCase().includes(searchLower)
            );
            
            return nameMatch || ingredientMatch || filterMatch;
        });
    }
    
    return filtered;
}

// Filtra receitas por categoria específica
export function filterRecipesByCategory(category, searchTerm = '') {
    const recipesData = getRecipesData();
    
    if (category === 'all') {
        return filterRecipes('all', searchTerm);
    }
    
    let filtered = recipesData.filter(recipe => 
        recipe.filters && recipe.filters.includes(category)
    );
    
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(searchLower);
            const ingredientMatch = recipe.ingredients && recipe.ingredients.some(ingredient => 
                ingredient.item && ingredient.item.toLowerCase().includes(searchLower)
            );
            
            return nameMatch || ingredientMatch;
        });
    }
    
    return filtered;
}
