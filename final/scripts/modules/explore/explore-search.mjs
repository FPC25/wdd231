// Search functionality for explore page

import { getState, setState } from './explore-state.mjs';
import { renderCurrentView, renderSearchResults } from './explore/explore-renderer.mjs';
import { searchApiRecipes } from '../recipe/recipe-data.mjs';
import { showSearchLoadingState, showSearchErrorState, updateDailyRecipesIndicator } from './explore-ui.mjs';

export async function performSearch(searchInput, categoryButtons) {
    const searchValue = searchInput ? searchInput.value.trim() : '';
    
    if (!searchValue) {
        clearSearch(searchInput, categoryButtons);
        return;
    }
    
    setState({ currentSearch: searchValue.toLowerCase(), currentFilter: 'all' });

    // Visual feedback
    searchInput.style.backgroundColor = '#e8f5e8';
    
    // Hide daily recipes indicator during search
    updateDailyRecipesIndicator(false);

    // Reset category buttons
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) allButton.classList.add('active');

    try {
        // Show loading state
        showSearchLoadingState();
        
        // Search both local and API recipes
        const apiResults = await searchApiRecipes(searchValue);
        await renderSearchResults(apiResults, searchValue);
        
    } catch (error) {
        console.error('Search error:', error);
        // Show error state and fallback to local search
        showSearchErrorState();
        setTimeout(() => renderCurrentView(), 1500);
    }
}

export function clearSearch(searchInput, categoryButtons) {
    if (searchInput) {
        searchInput.value = '';
        searchInput.style.backgroundColor = '';
    }
    setState({ currentSearch: '', currentFilter: 'all' });
    
    // Show daily recipes indicator when not searching
    updateDailyRecipesIndicator(true);

    // Reset category buttons
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) allButton.classList.add('active');

    renderCurrentView();
}