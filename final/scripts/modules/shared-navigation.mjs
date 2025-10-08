/**
 * shared-navigation.mjs
 * Unified bottom navigation setup for all pages
 * Follows SOLID principles while maintaining KISS simplicity
 */

/**
 * Setup bottom navigation with page-specific behavior
 * @param {string} activePage - Current page identifier ('calculator', 'explore', 'recipe-detail', 'index')
 * @param {Object} options - Page-specific options
 * @param {HTMLElement[]} options.categoryButtons - Category buttons (explore page)
 * @param {HTMLElement} options.searchInput - Search input (explore page)
 * @param {Function} options.setState - State setter function (explore page)
 * @param {Function} options.renderCurrentView - Render function (explore page)
 */
export function setupBottomNavigation(activePage, options = {}) {
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    const favoritesNavItem = document.getElementById('favorites-nav');
    
    // Setup favorites navigation for all pages
    if (favoritesNavItem) {
        favoritesNavItem.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (activePage === 'explore') {
                // Explore page specific behavior
                const { categoryButtons, searchInput, setState, renderCurrentView } = options;
                
                if (categoryButtons) {
                    categoryButtons.forEach(btn => btn.classList.remove('active'));
                }
                
                if (setState) {
                    setState({ currentFilter: 'favorites', currentSearch: '' });
                }
                
                if (searchInput) {
                    searchInput.value = '';
                    searchInput.style.backgroundColor = '';
                }
                
                if (renderCurrentView) {
                    renderCurrentView();
                }
            } else {
                // Default behavior for other pages: navigate to explore with favorites filter
                window.location.href = './explore.html?filter=favorites';
            }
        });
    }
    
    // Setup active page indicator
    navItems.forEach(item => {
        item.classList.remove('active');
        
        switch (activePage) {
            case 'calculator':
                if (item.getAttribute('href') === './calculator.html') {
                    item.classList.add('active');
                }
                break;
            case 'explore':
                if (item.getAttribute('href') === './explore.html') {
                    item.classList.add('active');
                }
                break;
            case 'index':
                if (item.getAttribute('href') === './index.html') {
                    item.classList.add('active');
                }
                break;
            case 'recipe-detail':
                // No specific active item for recipe detail page
                break;
            default:
                // No active item for unknown pages
                break;
        }
    });
}

/**
 * Convenience function for calculator page
 */
export function setupCalculatorNavigation() {
    setupBottomNavigation('calculator');
}

/**
 * Convenience function for explore page
 * @param {HTMLElement[]} categoryButtons - Category filter buttons
 * @param {HTMLElement} searchInput - Search input element
 * @param {Function} setState - State management function
 * @param {Function} renderCurrentView - View rendering function
 */
export function setupExploreNavigation(categoryButtons, searchInput, setState, renderCurrentView) {
    setupBottomNavigation('explore', {
        categoryButtons,
        searchInput,
        setState,
        renderCurrentView
    });
}

/**
 * Convenience function for recipe detail page
 */
export function setupRecipeDetailNavigation() {
    setupBottomNavigation('recipe-detail');
}

/**
 * Convenience function for index page
 */
export function setupIndexNavigation() {
    setupBottomNavigation('index');
}