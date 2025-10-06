import { SearchManager } from './SearchManager.mjs';
import { RecipeManager } from './RecipeManager.mjs';

/**
 * PageManager class handles the main functionality for the index page
 * Now uses the unified RecipeManager instead of separate managers
 */
export class PageManager {
    constructor() {
        this.searchManager = new SearchManager();
        this.recipeManager = new RecipeManager();
        
        // Get DOM elements for different recipe sections
        this.favoritesGrid = document.querySelector('.favorites .recipe-grid');
        this.savedGrid = document.querySelector('.recent .recipe-grid');
        this.userRecipesContainer = document.querySelector('.your-recipes .recipe-grid');
        
        // Initialize the page manager
        this.init();
    }

    /**
     * Initialize the page manager by loading data, rendering sections, and setting up listeners
     */
    async init() {
        await this.loadInitialData();
        this.renderAllSections();
        this.setupEventListeners();
        this.setupStorageListeners();
    }

    /**
     * Load initial recipe data from RecipeUtils
     */
    async loadInitialData() {
        // Load recipes data from localStorage or JSON file
        await this.recipeManager.loadRecipes();
    }

    /**
     * Render all recipe sections on the page
     */
    renderAllSections() {
        this.renderFavoritesSection();
        this.renderSavedSection();
        this.renderUserRecipesSection();
    }

    /**
     * Set up event listeners for recipe interactions and data changes
     */
    setupEventListeners() {
        // Register callback for when favorites/saved recipes change
        this.recipeManager.onFavoritesChange(() => {
            this.renderFavoritesSection();
            this.renderSavedSection();
        });

        // Set up event listeners for user recipe actions (edit, delete, etc.)
        this.setupUserRecipeListeners();
    }

    /**
     * Set up listeners for localStorage changes from other browser tabs/windows
     */
    setupStorageListeners() {
        // Listen for localStorage changes from other tabs
        window.addEventListener('storage', (e) => {
            if (e.key === 'flavorfy_favorites' || e.key === 'flavorfy_saved' || e.key === 'recipesData') {
                this.recipeManager.loadRecipes().then(() => {
                    this.renderAllSections();
                });
            }
        });

        // Update data when page becomes visible again (user switches back to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.recipeManager.loadRecipes().then(() => {
                    this.renderAllSections();
                });
            }
        });
    }

    // ================== RENDER SECTIONS ==================

    /**
     * Render the favorites section with user's favorite recipes
     * Applies current search filters and displays recipes in the favorites grid
     */
    renderFavoritesSection() {
        const currentSearch = this.searchManager.getCurrentSearch();
        const favoriteRecipes = this.recipeManager.getRecipes('favorites', currentSearch);
        
        if (this.favoritesGrid) {
            // Render favorite recipes using the unified rendering method
            this.recipeManager.renderingService.renderFavoriteRecipes(
                favoriteRecipes, 
                this.favoritesGrid, 
                (recipeId) => this.recipeManager.getRecipeStates(recipeId)
            );
            this.recipeManager.addEventListeners(this.favoritesGrid);
        }
    }

    /**
     * Render the saved recipes section with user's recently saved recipes
     * Applies current search filters and displays recipes in the saved recipes grid
     */
    renderSavedSection() {
        const currentSearch = this.searchManager.getCurrentSearch();
        const savedRecipes = this.recipeManager.getRecipes('saved', currentSearch);
        
        if (this.savedGrid) {
            // Render saved recipes using the unified rendering method
            this.recipeManager.renderingService.renderSavedRecipes(
                savedRecipes, 
                this.savedGrid, 
                (recipeId) => this.recipeManager.getRecipeStates(recipeId)
            );
            this.recipeManager.addEventListeners(this.savedGrid);
        }
    }

    /**
     * Render the user recipes section with user-created recipes and drafts
     */
    renderUserRecipesSection() {
        if (this.userRecipesContainer) {
            // MUDAR para usar o método unificado
            this.recipeManager.renderUserRecipes(this.userRecipesContainer);
        }
    }

    // ================== USER RECIPE EVENT LISTENERS ==================

    /**
     * Set up event listeners for user recipe interactions (clicks on cards and action buttons)
     */
    setupUserRecipeListeners() {
        if (!this.userRecipesContainer) return;

        // Use event delegation to handle clicks on user recipe cards and buttons
        this.userRecipesContainer.addEventListener('click', (e) => {
            this.handleUserRecipeAction(e);
        });
    }

    /**
     * Handle user actions on recipe cards (clicks on cards or action buttons)
     * @param {Event} e - The click event
     */
    handleUserRecipeAction(e) {
        const actionBtn = e.target.closest('.action-btn');
        const card = e.target.closest('.recipe-card');

        if (actionBtn) {
            // Handle action button clicks (edit, delete, etc.)
            this.handleActionButton(actionBtn);
        } else if (card && !e.target.closest('.recipe-actions')) {
            // Handle card clicks (but not if clicking on action buttons area)
            this.handleCardClick(card);
        }
    }

    /**
     * Handle clicks on action buttons (edit, delete, etc.)
     * @param {HTMLElement} actionBtn - The clicked action button
     */
    handleActionButton(actionBtn) {
        const action = actionBtn.dataset.action;
        const recipeId = actionBtn.dataset.recipeId;

        switch (action) {
            case 'edit-draft':
                // Continue editing a draft recipe
                window.location.href = './recipe.html';
                break;
            case 'delete-draft':
                // Delete a draft recipe with confirmation
                if (confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
                    this.recipeManager.deleteDraft();
                    this.renderUserRecipesSection();
                }
                break;
            case 'favorite':
            case 'save':
                // These are handled by RecipeManager's event listeners
                break;
        }
    }

    /**
     * Handle clicks on recipe cards (not on action buttons)
     * @param {HTMLElement} card - The clicked recipe card
     */
    handleCardClick(card) {
        if (card.classList.contains('draft-card')) {
            // If it's a draft card, redirect to recipe creation page for editing
            window.location.href = './recipe.html';
        } else {
            // If it's a complete recipe, redirect to recipe detail page
            const recipeId = card.dataset.recipeId;
            window.location.href = `./recipe-detail.html?id=${recipeId}`;
        }
    }

    // ================== PUBLIC METHODS ==================

    /**
     * Refresh all sections by re-rendering them
     */
    refresh() {
        this.renderAllSections();
    }

    /**
     * Get the count of user-created recipes
     * @returns {number} The number of user recipes
     */
    getUserRecipeCount() {
        return this.recipeManager.getRecipes('user').length;
    }

    /**
     * Check if user has a draft recipe saved
     * @returns {boolean} True if user has a draft, false otherwise
     */
    hasDraft() {
        return this.recipeManager.getDraft() !== null;
    }
}