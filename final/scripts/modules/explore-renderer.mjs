// Rendering logic for explore page

import { getState } from './explore-state.mjs';
import { loadRecipes, filterRecipes } from './recipe-data.mjs';
import { filterRecipesByCategory } from './recipe-filters.mjs';
import { renderEnhancedRecipes } from './recipe-renderer.mjs';

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

    if (currentSearch) {
        categoryButtons.forEach(btn => btn.classList.remove('active'));
    }
}