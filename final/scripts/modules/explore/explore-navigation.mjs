// Navigation handling for explore page

import { setupExploreNavigation } from '../shared-navigation.mjs';

export async function setupBottomNavigation(favoritesNavItem, categoryButtons, searchInput) {
    // Import required functions for explore page
    const { setState } = await import('./explore-state.mjs');
    const { renderCurrentView } = await import('./explore-renderer.mjs');
    
    setupExploreNavigation(categoryButtons, searchInput, setState, renderCurrentView);
}