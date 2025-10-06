/**
 * RecipeConfigFactory - Strategy Pattern Implementation
 * Creates card configurations for different recipe types
 * Follows Open/Closed Principle - easy to add new types without modifying existing code
 */
export class RecipeConfigFactory {
    
    /**
     * Create configuration for library recipe cards
     * @param {Object} recipe - Recipe data
     * @param {Object} states - { isFavorite, isSaved }
     * @returns {Object} Card configuration
     */
    static createLibraryConfig(recipe, states = {}) {
        const { isFavorite = false, isSaved = false } = states;
        
        return {
            cardClass: 'library-card',
            badge: '',
            actions: this.createLibraryActions(recipe.id, isFavorite, isSaved),
            metaContent: null,
            imageClass: '',
            showMeta: true
        };
    }

    /**
     * Create configuration for user recipe cards
     * @param {Object} recipe - Recipe data
     * @param {Object} states - { isFavorite, isSaved }
     * @returns {Object} Card configuration
     */
    static createUserConfig(recipe, states = {}) {
        const { isFavorite = false, isSaved = false } = states;
        
        return {
            cardClass: 'user-recipe-card',
            badge: '',
            actions: this.createLibraryActions(recipe.id, isFavorite, isSaved), // Same as library
            metaContent: null,
            imageClass: '',
            showMeta: true
        };
    }

    /**
     * Create configuration for draft recipe cards
     * @param {Object} recipe - Recipe data
     * @returns {Object} Card configuration
     */
    static createDraftConfig(recipe) {
        return {
            cardClass: 'draft-card',
            badge: '<span class="draft-badge">Draft</span>',
            actions: this.createDraftActions(),
            metaContent: '<span class="draft-status">Draft in progress</span>',
            imageClass: 'draft-image',
            showMeta: false
        };
    }

    /**
     * Create configuration based on type - FACTORY METHOD
     * @param {string} type - 'library', 'user', 'draft'
     * @param {Object} recipe - Recipe data
     * @param {Object} states - Recipe states
     * @returns {Object} Card configuration
     */
    static createConfig(type, recipe, states = {}) {
        switch (type) {
            case 'library':
                return this.createLibraryConfig(recipe, states);
            case 'user':
                return this.createUserConfig(recipe, states);
            case 'draft':
                return this.createDraftConfig(recipe);
            default:
                return this.createLibraryConfig(recipe, states);
        }
    }

    // ================== PRIVATE ACTION CREATORS ==================

    /**
     * Create action buttons for library/user cards
     * @private
     */
    static createLibraryActions(recipeId, isFavorite, isSaved) {
        const favoriteClass = isFavorite ? 'active' : '';
        const savedClass = isSaved ? 'active' : '';
        const saveIcon = isSaved ? 'check.svg' : 'plus.svg';
        const saveAlt = isSaved ? 'Saved' : 'Save';

        return `
            <button class="action-btn save-btn ${savedClass}" 
                    data-recipe-id="${recipeId}" 
                    data-action="save" 
                    aria-label="Toggle save"
                    aria-pressed="${isSaved}">
                <img src="./images/${saveIcon}" alt="${saveAlt}">
            </button>
            <button class="action-btn favorite-btn ${favoriteClass}" 
                    data-recipe-id="${recipeId}" 
                    data-action="favorite" 
                    aria-label="Toggle favorite"
                    aria-pressed="${isFavorite}">
                <img src="./images/star.svg" alt="Favorite">
            </button>
        `;
    }

    /**
     * Create action buttons for draft cards
     * @private
     */
    static createDraftActions() {
        return `
            <button class="action-btn edit-draft-btn" 
                    data-action="edit-draft" 
                    aria-label="Continue editing draft">
                <img src="./images/edit.svg" alt="Edit">
            </button>
            <button class="action-btn delete-draft-btn" 
                    data-action="delete-draft" 
                    aria-label="Delete draft">
                <img src="./images/trash.svg" alt="Delete">
            </button>
        `;
    }
}