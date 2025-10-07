// DOM manipulation for explore page

export function getDomElements() {
    return {
        recipesGrid: document.querySelector('.recipe-grid'),
        bottomNav: document.querySelector('.bottom-nav'),
        categoryButtons: document.querySelectorAll('.category-btn'),
        searchInput: document.querySelector('.search-input'),
        searchButton: document.querySelector('.search-button')
    };
}