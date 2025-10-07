// DOM manipulation for index page

export function getDomElements() {
    return {
        favoritesGrid: document.querySelector('.favorites .recipe-grid'),
        savedGrid: document.querySelector('.recent .recipe-grid'),
        searchInput: document.querySelector('.search-input'),
        searchButton: document.querySelector('.search-button'),
    };
}