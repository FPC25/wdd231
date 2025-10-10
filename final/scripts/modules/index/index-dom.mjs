/**
 * index-dom.mjs
 * Responsible for DOM element selection and management for the index page
 * Following SOLID principle: Single responsibility for DOM operations
 */

/**
 * Get all DOM elements used by the index page
 * @returns {Object} Object containing all necessary DOM elements
 */
export function getDomElements() {
    return {
        favoritesGrid: document.querySelector('.favorites .recipe-grid'),
        savedGrid: document.querySelector('.recent .recipe-grid'),
        userRecipesGrid: document.querySelector('.your-recipes .recipe-grid'),
        searchInput: document.querySelector('.search-input'),
        searchButton: document.querySelector('.search-button')
    };
}

/**
 * Check if required DOM elements exist
 * @returns {boolean} True if all required elements exist
 */
export function validateDomElements() {
    const elements = getDomElements();
    const required = ['favoritesGrid', 'savedGrid', 'searchInput'];
    
    return required.every(elementName => {
        const exists = elements[elementName] !== null;
        if (!exists) {
            console.warn(`Required DOM element missing: ${elementName}`);
        }
        return exists;
    });
}

/**
 * Create an empty state message for recipe grids
 * @param {string} message - The message to display
 * @param {string} actionText - Text for the action button (optional)
 * @param {string} actionHref - URL for the action button (optional)
 * @returns {string} HTML string for empty state
 */
export function createEmptyState(message, actionText = null, actionHref = null) {
    let actionButton = '';
    if (actionText && actionHref) {
        actionButton = `<a href="${actionHref}" class="btn-accent">${actionText}</a>`;
    }
    
    return `
        <div class="empty-state">
            <p>${message}</p>
            ${actionButton}
        </div>
    `;
}