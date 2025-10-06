import { UserRecipeManager } from './UserRecipeManager.mjs';
import { SearchManager } from './SearchManager.mjs';
import { RecipeCardRenderer } from './RecipeCard.mjs';

/**
 * PageManager class handles the main functionality for the index page
 * Manages user recipes, favorites, saved recipes, and search functionality
 */
export class PageManager {
    constructor() {
        // Initialize manager instances for different functionalities
        this.userRecipeManager = new UserRecipeManager();
        this.searchManager = new SearchManager();
        this.cardRenderer = new RecipeCardRenderer();
        
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
        await window.RecipeUtils.loadRecipes();
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
        window.RecipeUtils.onFavoritesChange(() => {
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
                window.RecipeUtils.loadRecipes().then(() => {
                    this.renderFavoritesSection();
                    this.renderSavedSection();
                    this.renderUserRecipesSection();
                });
            }
        });

        // Update data when page becomes visible again (user switches back to tab)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                window.RecipeUtils.loadRecipes().then(() => {
                    this.renderAllSections();
                });
            }
        });
    }

    // ================== RENDER SECTIONS ==================

    /**
     * Render the favorites section with favorite recipes
     */
    renderFavoritesSection() {
        const currentSearch = this.searchManager.getCurrentSearch();
        const favoriteRecipes = window.RecipeUtils.filterRecipes('favorites', currentSearch);
        const emptyMessage = this.cardRenderer.createFavoritesEmptyState();
        
        if (this.favoritesGrid) {
            if (favoriteRecipes.length === 0) {
                this.favoritesGrid.innerHTML = emptyMessage;
            } else {
                window.RecipeUtils.renderRecipes(favoriteRecipes, this.favoritesGrid, emptyMessage);
            }
        }
    }

    /**
     * Render the saved recipes section with recently saved recipes
     */
    renderSavedSection() {
        const currentSearch = this.searchManager.getCurrentSearch();
        const savedRecipes = window.RecipeUtils.filterRecipes('saved', currentSearch);
        const emptyMessage = this.cardRenderer.createSavedEmptyState();
        
        if (this.savedGrid) {
            if (savedRecipes.length === 0) {
                this.savedGrid.innerHTML = emptyMessage;
            } else {
                window.RecipeUtils.renderRecipes(savedRecipes, this.savedGrid, emptyMessage);
            }
        }
    }

    /**
     * Render the user recipes section with user-created recipes and drafts
     */
    renderUserRecipesSection() {
        const allUserContent = this.userRecipeManager.getAllUserContent();
        this.cardRenderer.renderUserRecipes(allUserContent, this.userRecipesContainer);
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
                this.userRecipeManager.editDraft();
                break;
            case 'delete-draft':
                // Delete a draft recipe with confirmation
                if (this.userRecipeManager.confirmDeleteDraft()) {
                    this.renderUserRecipesSection();
                }
                break;
            case 'edit':
                // Edit an existing user recipe
                this.userRecipeManager.editRecipe(recipeId);
                break;
            case 'delete':
                // Delete an existing user recipe with confirmation
                if (this.userRecipeManager.confirmDeleteRecipe(recipeId)) {
                    this.renderUserRecipesSection();
                }
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
            this.userRecipeManager.editDraft();
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
        return this.userRecipeManager.getUserRecipeCount();
    }

    /**
     * Check if user has a draft recipe saved
     * @returns {boolean} True if user has a draft, false otherwise
     */
    hasDraft() {
        return this.userRecipeManager.hasDraft();
    }
}