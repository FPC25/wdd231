// Rendering logic for index page

import { getState } from './index-state.mjs';
import { getDomElements } from './index-dom.mjs';
import { loadRecipes, filterRecipes } from './recipe-data.mjs';
import { renderRecipes } from './recipe-renderer.mjs';

const { favoritesGrid, savedGrid } = getDomElements();

export async function renderFavoritesSection() {
    await loadRecipes(); // Garantir que os dados estão carregados
    const { currentSearch } = getState();
    const favoriteRecipes = filterRecipes('favorites', currentSearch);
    const emptyMessage = 'No favorite recipes yet. Start exploring and add some favorites!';
    renderRecipes(favoriteRecipes, favoritesGrid, emptyMessage);
}

export async function renderSavedSection() {
    await loadRecipes(); // Garantir que os dados estão carregados
    const { currentSearch } = getState();
    const savedRecipes = filterRecipes('saved', currentSearch);
    const emptyMessage = 'No saved recipes yet. Create your first recipe or save some from explore!';
    renderRecipes(savedRecipes, savedGrid, emptyMessage);
}

export function displayUserRecipes() {
    // Implementação existente
}