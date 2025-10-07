// Navigation handling for explore page

import { setState } from './explore-state.mjs';
import { renderCurrentView } from './explore-renderer.mjs';

export function setupBottomNavigation(favoritesNavItem, categoryButtons, searchInput) {
    if (favoritesNavItem) {
        favoritesNavItem.addEventListener('click', function(e) {
            e.preventDefault();
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            setState({ currentFilter: 'favorites', currentSearch: '' });

            if (searchInput) {
                searchInput.value = '';
                searchInput.style.backgroundColor = '';
            }

            renderCurrentView();
        });
    }
}