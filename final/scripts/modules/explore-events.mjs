// Event handling for explore page

import { setupCategoryButtons } from './explore-categories.mjs';
import { performSearch, clearSearch } from './explore-search.mjs';
import { setupBottomNavigation } from './explore-navigation.mjs';
import { initializeScrollBehavior } from './explore-scroll.mjs';
import { renderCurrentView } from './explore-renderer.mjs';
import { loadRecipes } from './recipe-data.mjs';

export function initializeAllEvents(domElements) {
    const { categoryButtons, searchInput, searchButton, bottomNav, recipesGrid } = domElements;

    // Setup category buttons
    setupCategoryButtons(categoryButtons, searchInput);

    // Setup search functionality
    if (searchButton) {
        searchButton.addEventListener('click', () => performSearch(searchInput, categoryButtons));
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchInput, categoryButtons);
            }
        });

        searchInput.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.backgroundColor = '#e8f5e8';
            } else {
                this.style.backgroundColor = '';
            }
        });
    }

    // Setup bottom navigation
    const favoritesNavItem = document.querySelector('.bottom-nav .nav-item[href="#"]');
    setupBottomNavigation(favoritesNavItem, categoryButtons, searchInput);

    // Initialize scroll behavior
    initializeScrollBehavior(bottomNav);
    
    // Setup storage events for cross-page synchronization
    setupStorageEvents();
}

/**
 * Set up localStorage event listeners for cross-tab/page synchronization
 */
function setupStorageEvents() {
    window.addEventListener('storage', function(e) {
        if (['flavorfy_favorites', 'flavorfy_saved', 'recipesData'].includes(e.key)) {
            console.log('Storage changed in explore, updating page:', e.key);
            loadRecipes().then(() => {
                renderCurrentView();
            });
        }
    });
    
    // Also listen for custom events for same-page updates
    window.addEventListener('flavorfy-data-changed', function() {
        console.log('Data changed event received in explore');
        loadRecipes().then(() => {
            renderCurrentView();
        });
    });
}