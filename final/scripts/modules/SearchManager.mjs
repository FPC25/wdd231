/**
 * SearchManager - Handles search functionality with improved event system
 * Single Responsibility: Only search logic
 */
export class SearchManager {
    constructor() {
        this.currentSearch = '';
        this.searchInput = null;
        this.clearButton = null;
        this.callbacks = [];
        
        this.init();
    }

    init() {
        this.searchInput = document.getElementById('search-input');
        this.clearButton = document.getElementById('clear-search');
        
        if (this.searchInput) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Search input with debounce
        let searchTimeout;
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                this.performSearch(e.target.value);
            }, 300);
        });

        // Clear button
        if (this.clearButton) {
            this.clearButton.addEventListener('click', () => {
                this.clearSearch();
            });
        }

        // Enter key
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.performSearch(e.target.value);
            }
        });
    }

    performSearch(searchTerm) {
        this.currentSearch = searchTerm.trim();
        this.updateUI();
        this.notifySearchChange(); // Observer pattern
        this.dispatchSearchEvent(); // Custom event
    }

    clearSearch() {
        this.currentSearch = '';
        if (this.searchInput) {
            this.searchInput.value = '';
        }
        this.updateUI();
        this.notifySearchChange();
        this.dispatchSearchEvent();
    }

    updateUI() {
        if (this.clearButton) {
            this.clearButton.style.display = this.currentSearch ? 'block' : 'none';
        }
    }

    // Observer pattern for backward compatibility
    onSearchChange(callback) {
        this.callbacks.push(callback);
    }

    notifySearchChange() {
        this.callbacks.forEach(callback => {
            try {
                callback(this.currentSearch);
            } catch (error) {
                console.error('Error in search callback:', error);
            }
        });
    }

    // Modern approach with custom events
    dispatchSearchEvent() {
        const event = new CustomEvent('searchChanged', {
            detail: { searchTerm: this.currentSearch }
        });
        document.dispatchEvent(event);
    }

    getCurrentSearch() {
        return this.currentSearch;
    }

    hasActiveSearch() {
        return this.currentSearch.length > 0;
    }
}

// Global instance
window.searchManager = new SearchManager();