// Search functionality for explore page

import { getState, setState } from './explore-state.mjs';
import { renderCurrentView } from './explore-renderer.mjs';

export function performSearch(searchInput, categoryButtons) {
    const searchValue = searchInput ? searchInput.value.trim() : '';
    setState({ currentSearch: searchValue.toLowerCase(), currentFilter: 'all' });

    // Visual feedback
    if (searchValue) {
        searchInput.style.backgroundColor = '#e8f5e8';
    } else {
        searchInput.style.backgroundColor = '';
    }

    // Reset category buttons
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) allButton.classList.add('active');

    renderCurrentView();
}

export function clearSearch(searchInput, categoryButtons) {
    if (searchInput) {
        searchInput.value = '';
        searchInput.style.backgroundColor = '';
    }
    setState({ currentSearch: '', currentFilter: 'all' });

    // Reset category buttons
    categoryButtons.forEach(btn => btn.classList.remove('active'));
    const allButton = document.querySelector('[data-category="all"]');
    if (allButton) allButton.classList.add('active');

    renderCurrentView();
}