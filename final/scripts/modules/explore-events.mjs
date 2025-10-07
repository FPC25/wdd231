// Event handling for explore page

import { setupCategoryButtons } from './explore-categories.mjs';
import { performSearch, clearSearch } from './explore-search.mjs';
import { setupBottomNavigation } from './explore-navigation.mjs';
import { initializeScrollBehavior } from './explore-scroll.mjs';

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
}