import { loadRecipes } from './modules/recipe/recipe-data.mjs';
import { getDomElements } from './modules/explore/explore-dom.mjs';
import { setupEventListeners } from './modules/explore/explore-events.mjs';
import { renderCurrentView } from './modules/explore/explore-renderer.mjs';
import { getStateFromURL } from './modules/explore/explore-url.mjs';
import { initBelowFoldLazyLoading } from './modules/utils/below-fold-lazy.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    // Load recipes
    await loadRecipes();
    
    // Setup DOM and events
    const domElements = getDomElements();
    setupEventListeners(domElements);
    
    // Set initial state from URL and render
    getStateFromURL();
    await renderCurrentView();
    
    // Initialize below-fold lazy loading after initial render
    setTimeout(initBelowFoldLazyLoading, 100);
    
    // Listen for daily recipes updates
    window.addEventListener('daily-recipes-updated', () => {
        renderCurrentView().then(() => {
            // Re-initialize lazy loading after content updates
            setTimeout(initBelowFoldLazyLoading, 100);
        });
    });
});

