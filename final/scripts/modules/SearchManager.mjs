/**
 * SearchManager class handles search functionality across the application
 * Manages search input, search button interactions, and search state
 */
export class SearchManager {
    constructor() {
        // Get DOM elements for search functionality
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');
        
        // Track current search term
        this.currentSearch = '';
        
        // Initialize the search manager
        this.init();
    }

    /**
     * Initialize the search manager by setting up event listeners
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * Set up event listeners for search input and button interactions
     */
    setupEventListeners() {
        // Add click event listener to search button
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => this.performSearch());
        }

        if (this.searchInput) {
            // Add Enter key event listener to search input
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // Add input event listener for visual feedback during typing
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target);
            });
        }
    }

    /**
     * Perform search by redirecting to explore page with search parameters
     * Only executes if search term is not empty after trimming whitespace
     */
    performSearch() {
        // Get search term and remove leading/trailing whitespace
        const searchTerm = this.searchInput?.value.trim();
        
        if (searchTerm) {
            // Redirect to explore page with encoded search parameter
            window.location.href = `./explore.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }

    /**
     * Handle input changes in search field to provide visual feedback
     * Changes background color based on whether input has content
     * @param {HTMLInputElement} input - The search input element
     */
    handleSearchInput(input) {
        if (input.value.trim()) {
            // Set light green background when input has content
            input.style.backgroundColor = '#e8f5e8';
        } else {
            // Reset background when input is empty
            input.style.backgroundColor = '';
        }
    }

    /**
     * Get the current search term
     * @returns {string} The current search term
     */
    getCurrentSearch() {
        return this.currentSearch;
    }

    /**
     * Set the current search term (used for tracking search state)
     * @param {string} searchTerm - The search term to store
     */
    setCurrentSearch(searchTerm) {
        this.currentSearch = searchTerm;
    }

    /**
     * Clear the search input and reset search state
     * Removes text from input field and resets visual styling
     */
    clearSearch() {
        if (this.searchInput) {
            // Clear input value
            this.searchInput.value = '';
            // Reset background color
            this.searchInput.style.backgroundColor = '';
        }
        // Reset stored search term
        this.currentSearch = '';
    }
}