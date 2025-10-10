/**
 * index-events.mjs
 * Event handling for the index page
 * Following SOLID principle: Single responsibility for event management
 */

import { loadRecipes } from '../recipe/recipe-data.mjs';
import { renderFavoritesSection, renderSavedSection } from './index-renderer.mjs';
import { performSearch } from './index-navigation.mjs';

/**
 * Set up search-related event listeners
 * @param {HTMLElement} searchInput - Search input element
 * @param {HTMLElement} searchButton - Search button element
 */
export function setupSearchEvents(searchInput, searchButton) {
    if (searchButton) {
        searchButton.addEventListener('click', () => performSearch(searchInput.value.trim()));
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput.value.trim());
            }
        });

        searchInput.addEventListener('input', function() {
            this.style.backgroundColor = this.value.trim() ? '#e8f5e8' : '';
        });
    }
}

/**
 * Set up localStorage event listeners for cross-tab synchronization
 */
export function setupStorageEvents() {
    window.addEventListener('storage', function(e) {
        if (['flavorfy_favorites', 'flavorfy_saved', 'recipesData'].includes(e.key)) {
            console.log('Storage changed, updating page:', e.key);
            loadRecipes().then(() => {
                renderFavoritesSection();
                renderSavedSection();
            });
        }
    });
    
    // Also listen for custom events for same-page updates
    window.addEventListener('flavorfy-data-changed', function() {
        console.log('Data changed event received');
        loadRecipes().then(() => {
            renderFavoritesSection();
            renderSavedSection();
        });
    });
}

/**
 * Set up visibility change event listeners for page focus
 */
export function setupVisibilityEvents() {
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            loadRecipes().then(() => {
                renderFavoritesSection();
                renderSavedSection();
            });
        }
    });
}