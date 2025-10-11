import { getDomElements } from './modules/explore/explore-dom.mjs';
import { initializeAllEvents } from './modules/explore/explore-events.mjs';
import { parseUrlParameters } from './modules/explore/explore-url.mjs';
import { renderCurrentView } from './modules/explore/explore-renderer.mjs';
import { setState } from './modules/explore/explore-state.mjs';
import { onFavoritesChange } from './modules/recipe/recipe-data.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    const domElements = getDomElements();
    const { searchParam, filterParam } = parseUrlParameters();

    if (searchParam) {
        setState({ currentSearch: searchParam.toLowerCase().trim() });
        if (domElements.searchInput) {
            domElements.searchInput.value = searchParam;
            domElements.searchInput.style.backgroundColor = '#e8f5e8';
        }
    }

    if (filterParam === 'favorites') {
        setState({ currentFilter: 'favorites' });
        domElements.categoryButtons.forEach(btn => btn.classList.remove('active'));
        const favButton = document.querySelector('[data-category="favorites"]');
        if (favButton) favButton.classList.add('active');
    }

    await renderCurrentView();
    await initializeAllEvents(domElements);
    
    // Registrar callback para mudanças nos dados
    onFavoritesChange(() => {
        renderCurrentView();
    });
    
    // Listen for daily recipes updates
    window.addEventListener('daily-recipes-updated', () => {
        renderCurrentView();
    });
});

