/**
 * RecipeCardRenderer class handles the creation and rendering of ALL types of recipe cards
 * Supports library recipes, completed user recipes, and draft recipes
 */
export class RecipeCardRenderer {
    
    /**
     * Creates a recipe card with dynamic content based on recipe type
     * @param {Object} recipe - The recipe object
     * @param {string} cardType - 'library', 'user', or 'draft'
     * @returns {string} HTML string for the recipe card
     */
    createRecipeCard(recipe, cardType = 'library') {
        // Format meta information with fallbacks
        const cookTime = recipe.cookTime ? `${recipe.cookTime.time} ${recipe.cookTime.unit}` : 'Not specified';
        const difficulty = recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : 'Not specified';
        const serves = recipe.serves || 'Not specified';

        // Determine image source and styling
        const hasImage = recipe.cover && recipe.cover !== "image" && !recipe.cover.includes('placeholder.svg');
        const imageSrc = hasImage ? recipe.cover : './images/placeholder.svg';
        const imageClass = hasImage ? 'has-photo' : 'no-photo';

        // Get card-specific configurations
        const config = this.getCardConfig(cardType, recipe);

        return `
            <div class="recipe-card ${config.cardClass}" data-recipe-id="${recipe.id}">
                <div class="recipe-image ${imageClass}">
                    <img src="${imageSrc}" alt="${recipe.name}" loading="lazy">
                    ${config.badge}
                    <div class="recipe-actions">
                        ${config.actions}
                    </div>
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-name">${recipe.name}</h3>
                    <div class="recipe-meta">
                        ${config.metaContent || this.getDefaultMeta(cookTime, difficulty, serves)}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Get configuration for different card types
     * @param {string} cardType - Type of card
     * @param {Object} recipe - Recipe object for context
     * @returns {Object} Configuration object
     */
    getCardConfig(cardType, recipe) {
        switch (cardType) {
            case 'library':
                return {
                    cardClass: 'library-card',
                    badge: '',
                    actions: this.createLibraryActions(recipe.id),
                    metaContent: null // Use default meta
                };
            
            case 'user':
                return {
                    cardClass: 'user-recipe-card',
                    badge: '',
                    actions: this.createUserActions(recipe.id), // SAME as library - favorite + save!
                    metaContent: null // Use default meta
                };
            
            case 'draft':
                return {
                    cardClass: 'draft-card',
                    badge: '<span class="draft-badge">Draft</span>',
                    actions: this.createDraftActions(),
                    metaContent: '<span class="draft-status">Draft in progress</span>'
                };
            
            default:
                return this.getCardConfig('library', recipe);
        }
    }

    /**
     * Get default meta content
     * @param {string} cookTime - Formatted cook time
     * @param {string} difficulty - Formatted difficulty
     * @param {string} serves - Formatted serves
     * @returns {string} Meta HTML content
     */
    getDefaultMeta(cookTime, difficulty, serves) {
        return `
            <span class="cook-time">${cookTime}</span>
            <span class="difficulty">${difficulty}</span>
            <span class="serves">Serves ${serves}</span>
        `;
    }

    // ================== ACTION BUTTON CREATORS ==================

    /**
     * Creates action buttons for library AND user cards (favorite + save)
     * Both library and completed user recipes have the same actions!
     * @param {number} recipeId - Recipe ID
     * @returns {string} HTML for favorite and save actions
     */
    createLibraryActions(recipeId) {
        // Get current states
        const favorites = this.getFavoritesFromStorage();
        const saved = this.getSavedFromStorage();
        const isFavorite = favorites.includes(recipeId);
        const isSaved = saved.includes(recipeId);

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
     * Creates action buttons for user cards (same as library - favorite + save)
     * User can favorite their own recipes and they're automatically saved
     * @param {number} recipeId - Recipe ID
     * @returns {string} HTML for user actions (same as library)
     */
    createUserActions(recipeId) {
        // User recipes have the SAME actions as library recipes
        return this.createLibraryActions(recipeId);
    }

    /**
     * Creates action buttons for draft cards (edit draft + delete draft)
     * Only drafts have edit/delete functionality
     * @returns {string} HTML for draft actions
     */
    createDraftActions() {
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

    // ================== BACKWARD COMPATIBILITY ==================

    /**
     * Legacy method for user recipe cards (backward compatibility)
     * @param {Object} recipe - Recipe object
     * @returns {string} HTML for user recipe card
     */
    createUserRecipeCard(recipe) {
        const cardType = recipe.isDraft ? 'draft' : 'user';
        return this.createRecipeCard(recipe, cardType);
    }

    // ================== EMPTY STATES ==================

    /**
     * Creates a generic empty state message with optional call-to-action button
     * @param {string} message - The message to display when section is empty
     * @param {string|null} buttonText - Optional text for call-to-action button
     * @param {string|null} buttonHref - Optional URL for call-to-action button
     * @returns {string} HTML string for empty state
     */
    createEmptyState(message, buttonText = null, buttonHref = null) {
        const button = buttonText && buttonHref ? 
            `<a href="${buttonHref}" class="btn-accent">${buttonText}</a>` : '';
        
        return `
            <div class="empty-state">
                <p>${message}</p>
                ${button}
            </div>
        `;
    }

    /**
     * Creates empty state specifically for favorites section
     * @returns {string} HTML string for favorites empty state
     */
    createFavoritesEmptyState() {
        return this.createEmptyState('No favorite recipes yet. Start exploring and add some favorites!');
    }

    /**
     * Creates empty state specifically for saved recipes section
     * @returns {string} HTML string for saved recipes empty state
     */
    createSavedEmptyState() {
        return this.createEmptyState('No saved recipes yet. Create your first recipe or save some from explore!');
    }

    /**
     * Creates empty state specifically for user recipes section with call-to-action
     * @returns {string} HTML string for user recipes empty state
     */
    createUserRecipesEmptyState() {
        return this.createEmptyState(
            "You haven't created any recipes yet.",
            'Create Your First Recipe',
            './recipe.html'
        );
    }

    // ================== RENDER METHODS ==================

    /**
     * Universal render method for any type of recipes
     * @param {Array} recipes - Array of recipe objects
     * @param {HTMLElement} container - DOM container
     * @param {string} cardType - Type of cards to render
     * @param {string} emptyStateType - Type of empty state to show
     */
    renderRecipes(recipes, container, cardType = 'library', emptyStateType = 'default') {
        if (!container) {
            console.warn('Container not found for rendering recipes');
            return;
        }

        // Handle empty state
        if (recipes.length === 0) {
            container.innerHTML = this.getEmptyState(emptyStateType);
            return;
        }

        // Render recipe cards
        const cardsHTML = recipes.map(recipe => this.createRecipeCard(recipe, cardType)).join('');
        container.innerHTML = cardsHTML;

        // Add event listeners
        this.addEventListeners(container);
    }

    /**
     * Legacy method for user recipes (backward compatibility)
     * @param {Array} recipes - Array of user recipe objects
     * @param {HTMLElement} container - DOM container
     */
    renderUserRecipes(recipes, container) {
        this.renderRecipes(recipes, container, 'user', 'user');
    }

    /**
     * Get appropriate empty state based on type
     * @param {string} emptyStateType - Type of empty state
     * @returns {string} HTML for empty state
     */
    getEmptyState(emptyStateType) {
        switch (emptyStateType) {
            case 'favorites':
                return this.createFavoritesEmptyState();
            case 'saved':
                return this.createSavedEmptyState();
            case 'user':
                return this.createUserRecipesEmptyState();
            default:
                return '<p class="empty-message">No recipes found.</p>';
        }
    }

    // ================== EVENT HANDLING ==================

    /**
     * Add event listeners to recipe cards and action buttons
     * @param {HTMLElement} container - Container with recipe cards
     */
    addEventListeners(container) {
        // Action button listeners
        const actionButtons = container.querySelectorAll('.action-btn');
        actionButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleActionClick(button);
            });
        });

        // Card click listeners
        const recipeCards = container.querySelectorAll('.recipe-card');
        recipeCards.forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    this.handleCardClick(card);
                }
            });
            card.style.cursor = 'pointer';
        });
    }

    /**
     * Handle action button clicks
     * @param {HTMLElement} button - Clicked button
     */
    handleActionClick(button) {
        const action = button.dataset.action;
        const recipeId = parseInt(button.dataset.recipeId);

        switch (action) {
            case 'favorite':
                this.toggleFavorite(recipeId);
                break;
            case 'save':
                this.toggleSaved(recipeId);
                break;
            case 'edit-draft':
                window.location.href = './recipe.html';
                break;
            case 'delete-draft':
                this.deleteDraft();
                break;
            // NO MORE edit/delete for completed user recipes!
        }
    }

    /**
     * Handle card clicks for navigation
     * @param {HTMLElement} card - Clicked card
     */
    handleCardClick(card) {
        const recipeId = card.dataset.recipeId;
        
        if (card.classList.contains('draft-card')) {
            // Drafts go to recipe creation page for editing
            window.location.href = './recipe.html';
        } else {
            // Completed recipes (library OR user) go to detail page
            window.location.href = `./recipe-detail.html?id=${recipeId}`;
        }
    }

    // ================== UTILITY METHODS ==================

    /**
     * Toggle favorite status
     * @param {number} recipeId - Recipe ID
     */
    toggleFavorite(recipeId) {
        if (window.RecipeUtils?.toggleFavorite) {
            window.RecipeUtils.toggleFavorite(recipeId);
            this.updateButtonsForRecipe(recipeId);
        }
    }

    /**
     * Toggle saved status
     * @param {number} recipeId - Recipe ID
     */
    toggleSaved(recipeId) {
        if (window.RecipeUtils?.toggleSaved) {
            window.RecipeUtils.toggleSaved(recipeId);
            this.updateButtonsForRecipe(recipeId);
        }
    }

    /**
     * Delete draft with confirmation
     */
    deleteDraft() {
        if (confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
            localStorage.removeItem('recipeDraft');
            
            // Refresh user recipes section if available
            if (window.indexPageManager?.renderUserRecipesSection) {
                window.indexPageManager.renderUserRecipesSection();
            } else {
                window.location.reload();
            }
        }
    }

    /**
     * Update buttons for a specific recipe across all instances
     * @param {number} recipeId - Recipe ID
     */
    updateButtonsForRecipe(recipeId) {
        const favorites = this.getFavoritesFromStorage();
        const saved = this.getSavedFromStorage();
        const isFavorite = favorites.includes(recipeId);
        const isSaved = saved.includes(recipeId);

        // Update all buttons for this recipe
        document.querySelectorAll(`[data-recipe-id="${recipeId}"]`).forEach(btn => {
            const action = btn.dataset.action;
            if (action === 'favorite') {
                btn.classList.toggle('active', isFavorite);
                btn.setAttribute('aria-pressed', isFavorite);
            } else if (action === 'save') {
                btn.classList.toggle('active', isSaved);
                btn.setAttribute('aria-pressed', isSaved);
                const img = btn.querySelector('img');
                if (img) {
                    img.src = isSaved ? './images/check.svg' : './images/plus.svg';
                    img.alt = isSaved ? 'Saved' : 'Save';
                }
            }
        });
    }

    /**
     * Get favorites from storage
     * @returns {Array} Favorite recipe IDs
     */
    getFavoritesFromStorage() {
        if (window.RecipeUtils?.getFavoritesFromStorage) {
            return window.RecipeUtils.getFavoritesFromStorage();
        }
        return JSON.parse(localStorage.getItem('flavorfy_favorites') || '[]');
    }

    /**
     * Get saved recipes from storage
     * @returns {Array} Saved recipe IDs
     */
    getSavedFromStorage() {
        if (window.RecipeUtils?.getSavedFromStorage) {
            return window.RecipeUtils.getSavedFromStorage();
        }
        return JSON.parse(localStorage.getItem('flavorfy_saved') || '[]');
    }
}

// Create global instance for backward compatibility
window.recipeCardRenderer = new RecipeCardRenderer();