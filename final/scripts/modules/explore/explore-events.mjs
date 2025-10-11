// Event handling for explore page

import { setupCategoryButtons } from './explore-categories.mjs';
import { performSearch, clearSearch } from './explore-search.mjs';
import { setupBottomNavigation } from './explore-navigation.mjs';
import { initializeScrollBehavior } from './explore-scroll.mjs';
import { renderCurrentView } from './explore-renderer.mjs';
import { loadRecipes } from '../recipe/recipe-data.mjs';

export async function initializeAllEvents(domElements) {
    const { categoryButtons, searchInput, searchButton, bottomNav, recipesGrid } = domElements;

    // Setup category buttons
    setupCategoryButtons(categoryButtons, searchInput);

    // Setup search functionality
    if (searchButton) {
        searchButton.addEventListener('click', async () => {
            await performSearch(searchInput, categoryButtons);
        });
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', async function(e) {
            if (e.key === 'Enter') {
                await performSearch(searchInput, categoryButtons);
            }
        });

        searchInput.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.backgroundColor = '#e8f5e8';
            } else {
                this.style.backgroundColor = '';
                // If search is cleared, show default view
                if (!this.value.trim()) {
                    clearSearch(searchInput, categoryButtons);
                }
            }
        });
    }

    // Setup bottom navigation
    const favoritesNavItem = document.querySelector('.bottom-nav .nav-item[href="#"]');
    await setupBottomNavigation(favoritesNavItem, categoryButtons, searchInput);

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
            loadRecipes().then(() => {
                renderCurrentView();
            });
        }
    });
    
    // Also listen for custom events for same-page updates
    window.addEventListener('flavorfy-data-changed', function() {
        loadRecipes().then(() => {
            renderCurrentView();
        });
    });
}

// Export alias for backward compatibility
export { initializeAllEvents as setupEventListeners };