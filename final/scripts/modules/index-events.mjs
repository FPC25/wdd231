// Event handling for index page

import { renderFavoritesSection, renderSavedSection } from './index-renderer.mjs';
import { performSearch } from './index-navigation.mjs';

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

export function setupStorageEvents() {
    window.addEventListener('storage', function(e) {
        if (['flavorfy_favorites', 'flavorfy_saved', 'recipesData'].includes(e.key)) {
            renderFavoritesSection();
            renderSavedSection();
        }
    });
}

export function setupVisibilityEvents() {
    document.addEventListener('visibilitychange', function() {
        if (!document.hidden) {
            renderFavoritesSection();
            renderSavedSection();
        }
    });
}