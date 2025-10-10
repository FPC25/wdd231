import { loadRecipes, onFavoritesChange } from './modules/recipe/recipe-data.mjs';
import { getDomElements } from './modules/index/index-dom.mjs';
import { setupSearchEvents, setupStorageEvents, setupVisibilityEvents } from './modules/index/index-events.mjs';
import { renderFavoritesSection, renderSavedSection, displayUserRecipes } from './modules/index/index-renderer.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    // Carregar dados das receitas
    await loadRecipes();
    
    // Obter elementos DOM
    const { favoritesGrid, savedGrid, searchInput, searchButton } = getDomElements();
    
    // Renderização inicial
    renderFavoritesSection();
    renderSavedSection();
    displayUserRecipes();
    
    // Configurar event listeners
    setupSearchEvents(searchInput, searchButton);
    setupStorageEvents();
    setupVisibilityEvents();
    
    // Registrar callback para mudanças nos dados
    onFavoritesChange(() => {
        renderFavoritesSection();
        renderSavedSection();
        displayUserRecipes();
    });
});
