/**
 * RecipeDataService - Pure Data Layer (Single Responsibility Principle)
 * Handles ONLY data operations - NO UI, NO business logic
 */
export class RecipeDataService {
    constructor() {
        this.recipesData = [];
        this.favoritesKey = 'flavorfy_favorites';
        this.savedKey = 'flavorfy_saved';
        this.recipesKey = 'recipesData';
        this.draftKey = 'recipeDraft';
    }

    // ================== DATA LOADING ==================

    /**
     * Load recipes from localStorage or JSON file
     */
    async loadRecipes() {
        try {
            const localData = localStorage.getItem(this.recipesKey);
            
            if (localData) {
                this.recipesData = JSON.parse(localData);
            } else {
                const response = await fetch('./data/recipes.json');
                if (!response.ok) throw new Error('Failed to load recipes');
                this.recipesData = await response.json();
                this.saveRecipesToStorage();
            }
            
            return this.recipesData;
        } catch (error) {
            console.error('Error loading recipes:', error);
            this.recipesData = [];
            return [];
        }
    }

    /**
     * Get all recipes data
     */
    getRecipes() {
        return this.recipesData;
    }

    /**
     * Get recipe by ID
     */
    getRecipeById(id) {
        return this.recipesData.find(recipe => recipe.id === parseInt(id));
    }

    /**
     * Add new recipe
     */
    addRecipe(recipeData) {
        const nextId = this.recipesData.length > 0 ? 
            Math.max(...this.recipesData.map(r => r.id || 0)) + 1 : 1;
        
        const recipe = { ...recipeData, id: nextId };
        this.recipesData.push(recipe);
        this.saveRecipesToStorage();
        return recipe;
    }

    /**
     * Update existing recipe
     */
    updateRecipe(id, updates) {
        const index = this.recipesData.findIndex(r => r.id === parseInt(id));
        if (index !== -1) {
            this.recipesData[index] = { ...this.recipesData[index], ...updates };
            this.saveRecipesToStorage();
            return this.recipesData[index];
        }
        return null;
    }

    /**
     * Filter recipes
     */
    filterRecipes(criteria, searchTerm = '') {
        let filtered = [...this.recipesData];
        
        // Apply criteria filter
        if (criteria === 'favorites') {
            const favorites = this.getFavorites();
            filtered = filtered.filter(recipe => favorites.includes(recipe.id));
        } else if (criteria === 'saved') {
            const saved = this.getSaved();
            filtered = filtered.filter(recipe => saved.includes(recipe.id));
        } else if (criteria === 'user') {
            filtered = filtered.filter(recipe => recipe.id > 1000);
        }
        
        // Apply search filter
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(recipe => {
                const nameMatch = recipe.name?.toLowerCase().includes(searchLower);
                const ingredientMatch = recipe.ingredients?.some(ing => 
                    ing.item?.toLowerCase().includes(searchLower)
                );
                const filterMatch = recipe.filters?.some(filter =>
                    filter.toLowerCase().includes(searchLower)
                );
                
                return nameMatch || ingredientMatch || filterMatch;
            });
        }
        
        return filtered;
    }

    // ================== FAVORITES & SAVED ==================

    /**
     * Get favorites list
     */
    getFavorites() {
        try {
            return JSON.parse(localStorage.getItem(this.favoritesKey) || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Get saved list
     */
    getSaved() {
        try {
            return JSON.parse(localStorage.getItem(this.savedKey) || '[]');
        } catch {
            return [];
        }
    }

    /**
     * Update favorites list
     */
    setFavorites(favorites) {
        localStorage.setItem(this.favoritesKey, JSON.stringify(favorites));
    }

    /**
     * Update saved list
     */
    setSaved(saved) {
        localStorage.setItem(this.savedKey, JSON.stringify(saved));
    }

    /**
     * Get recipe states (favorite/saved)
     */
    getRecipeStates(recipeId) {
        const favorites = this.getFavorites();
        const saved = this.getSaved();
        
        return {
            isFavorite: favorites.includes(recipeId),
            isSaved: saved.includes(recipeId)
        };
    }

    // ================== DRAFT OPERATIONS ==================

    /**
     * Get draft from localStorage
     */
    getDraft() {
        try {
            const draftData = localStorage.getItem(this.draftKey);
            if (draftData) {
                const draft = JSON.parse(draftData);
                if (draft.name?.trim()) return draft;
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
        return null;
    }

    /**
     * Save draft to localStorage
     */
    saveDraft(draftData) {
        localStorage.setItem(this.draftKey, JSON.stringify(draftData));
    }

    /**
     * Delete draft from localStorage
     */
    deleteDraft() {
        localStorage.removeItem(this.draftKey);
    }

    // ================== PRIVATE METHODS ==================

    /**
     * Save recipes to localStorage
     */
    saveRecipesToStorage() {
        localStorage.setItem(this.recipesKey, JSON.stringify(this.recipesData));
    }
}