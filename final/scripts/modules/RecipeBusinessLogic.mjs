import { RecipeDataService } from './RecipeDataService.mjs';

/**
 * RecipeBusinessLogic - Pure Business Logic (Single Responsibility)
 * Handles ONLY business rules and data coordination - NO UI
 */
export class RecipeBusinessLogic {
    constructor(dataService = null) {
        this.dataService = dataService || new RecipeDataService();
        this.updateCallbacks = [];
    }

    // ================== DATA OPERATIONS ==================

    async loadRecipes() {
        return await this.dataService.loadRecipes();
    }

    getRecipes(criteria = 'all', searchTerm = '') {
        return this.dataService.filterRecipes(criteria, searchTerm);
    }

    getRecipeById(id) {
        return this.dataService.getRecipeById(id);
    }

    getRecipeStates(recipeId) {
        return this.dataService.getRecipeStates(recipeId);
    }

    // ================== BUSINESS RULES ==================

    /**
     * Toggle favorite - BUSINESS RULE: favoriting auto-saves
     */
    toggleFavorite(recipeId) {
        recipeId = parseInt(recipeId);
        const favorites = this.dataService.getFavorites();
        const saved = this.dataService.getSaved();
        const isFavorite = favorites.includes(recipeId);
        
        if (isFavorite) {
            favorites.splice(favorites.indexOf(recipeId), 1);
        } else {
            favorites.push(recipeId);
            // BUSINESS RULE: Favoriting auto-saves
            if (!saved.includes(recipeId)) {
                saved.push(recipeId);
                this.dataService.setSaved(saved);
            }
        }
        
        this.dataService.setFavorites(favorites);
        this.notifyChange();
        
        return !isFavorite;
    }

    /**
     * Toggle saved - BUSINESS RULE: unsaving removes from favorites
     */
    toggleSaved(recipeId) {
        recipeId = parseInt(recipeId);
        const favorites = this.dataService.getFavorites();
        const saved = this.dataService.getSaved();
        const isSaved = saved.includes(recipeId);
        const isFavorite = favorites.includes(recipeId);
        
        if (isSaved) {
            saved.splice(saved.indexOf(recipeId), 1);
            // BUSINESS RULE: Unsaving removes from favorites
            if (isFavorite) {
                favorites.splice(favorites.indexOf(recipeId), 1);
                this.dataService.setFavorites(favorites);
            }
        } else {
            saved.push(recipeId);
        }
        
        this.dataService.setSaved(saved);
        this.notifyChange();
        
        return !isSaved;
    }

    // ================== RECIPE MANAGEMENT ==================

    saveRecipe(recipeData) {
        const recipe = this.dataService.addRecipe(recipeData);
        
        // Handle initial favorites/saved state
        const saved = this.dataService.getSaved();
        const favorites = this.dataService.getFavorites();
        
        if (!saved.includes(recipe.id)) {
            saved.push(recipe.id);
            this.dataService.setSaved(saved);
        }
        
        if (recipeData.isFavorite && !favorites.includes(recipe.id)) {
            favorites.push(recipe.id);
            this.dataService.setFavorites(favorites);
        }
        
        this.notifyChange();
        return recipe;
    }

    saveDraft(draftData) {
        this.dataService.saveDraft(draftData);
    }

    getDraft() {
        return this.dataService.getDraft();
    }

    deleteDraft() {
        this.dataService.deleteDraft();
    }

    // ================== OBSERVER PATTERN ==================

    onFavoritesChange(callback) {
        this.updateCallbacks.push(callback);
    }

    notifyChange() {
        this.updateCallbacks.forEach(callback => {
            try {
                callback();
            } catch (error) {
                console.error('Error in callback:', error);
            }
        });
    }
}