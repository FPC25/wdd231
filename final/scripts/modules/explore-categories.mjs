// Category management for explore page

import { setState } from './explore-state.mjs';
import { renderCurrentView } from './explore-renderer.mjs';

export function setupCategoryButtons(categoryButtons, searchInput) {
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            setState({ currentFilter: this.dataset.category, currentSearch: '' });

            if (searchInput) {
                searchInput.value = '';
                searchInput.style.backgroundColor = '';
            }

            renderCurrentView();
        });
    });
}