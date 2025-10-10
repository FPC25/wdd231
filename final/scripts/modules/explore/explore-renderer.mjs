// Rendering logic for explore page

import { getState } from '../explore-state.mjs';
import { loadRecipes, filterRecipes } from '../recipe/recipe-data.mjs';
import { filterRecipesByCategory } from '../recipe/recipe-filters.mjs';
import { renderEnhancedRecipes } from '../recipe/recipe-renderer.mjs';
import { updateDailyRecipesIndicator } from './explore-ui.mjs';

export async function renderCurrentView() {
    const { currentFilter, currentSearch } = getState();
    const recipesGrid = document.querySelector('.recipe-grid');
    const categoryButtons = document.querySelectorAll('.category-btn');

    await loadRecipes(); // Certificar que os dados estão carregados

    let recipes;
    if (currentFilter === 'favorites') {
        recipes = filterRecipes('favorites', currentSearch);
    } else if (currentFilter === 'all') {
        recipes = filterRecipes('all', currentSearch);
    } else {
        recipes = filterRecipesByCategory(currentFilter, currentSearch);
    }

    let emptyMessage = 'No recipes found.';
    if (currentSearch && currentFilter !== 'all') {
        emptyMessage = `No recipes found in "${currentFilter}" for "${currentSearch}".`;
    } else if (currentSearch) {
        emptyMessage = `No recipes found for "${currentSearch}".`;
    } else if (currentFilter === 'favorites') {
        emptyMessage = 'No favorite recipes yet. Start exploring and add some favorites!';
    }

    // Use enhanced renderer with copy buttons for API recipes
    renderEnhancedRecipes(recipes, recipesGrid, emptyMessage, true);
    
    // Show/hide daily recipes indicator
    updateDailyRecipesIndicator(!currentSearch);

    if (currentSearch) {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
    }
}

export async function renderSearchResults(apiResults, searchTerm) {
    const recipesGrid = document.querySelector('.recipe-grid');
    const { currentSearch } = getState();
    
    // Combine API results with local search results
    await loadRecipes();
    const localResults = filterRecipes('all', searchTerm);
    
    // Merge results, prioritizing local recipes
    const allResults = [...localResults, ...apiResults];
    
    // Remove duplicates based on name similarity
    const uniqueResults = allResults.filter((recipe, index, arr) => {
        return index === arr.findIndex(r => 
            r.name.toLowerCase().trim() === recipe.name.toLowerCase().trim()
        );
    });
    
    const emptyMessage = `No recipes found for "${searchTerm}". Try a different search term.`;
    
    // Render with enhanced options for API recipes
    renderEnhancedRecipes(uniqueResults, recipesGrid, emptyMessage, true);
}