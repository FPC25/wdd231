export class SearchManager {
    constructor() {
        this.searchInput = document.querySelector('.search-input');
        this.searchButton = document.querySelector('.search-button');
        this.currentSearch = '';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Event listeners para busca
        if (this.searchButton) {
            this.searchButton.addEventListener('click', () => this.performSearch());
        }

        if (this.searchInput) {
            this.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.performSearch();
                }
            });

            // Feedback visual durante digitação
            this.searchInput.addEventListener('input', (e) => {
                this.handleSearchInput(e.target);
            });
        }
    }

    performSearch() {
        const searchTerm = this.searchInput?.value.trim();
        if (searchTerm) {
            // Redirecionar para explore com parâmetro de busca
            window.location.href = `./explore.html?search=${encodeURIComponent(searchTerm)}`;
        }
    }

    handleSearchInput(input) {
        if (input.value.trim()) {
            input.style.backgroundColor = '#e8f5e8';
        } else {
            input.style.backgroundColor = '';
        }
    }

    getCurrentSearch() {
        return this.currentSearch;
    }

    setCurrentSearch(searchTerm) {
        this.currentSearch = searchTerm;
    }

    clearSearch() {
        if (this.searchInput) {
            this.searchInput.value = '';
            this.searchInput.style.backgroundColor = '';
        }
        this.currentSearch = '';
    }
}