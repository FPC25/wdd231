import { RecipeCard } from './RecipeCard.mjs';
import { RecipeConfigFactory } from './RecipeConfigFactory.mjs';

/**
 * RecipeRenderingService - Coordinates UI rendering (Single Responsibility)
 * Combines RecipeCard + RecipeConfigFactory to render different recipe types
 */
export class RecipeRenderingService {
    constructor(cardRenderer = null) {
        this.cardRenderer = cardRenderer || new RecipeCard();
    }

    // ================== SPECIFIC RENDERING METHODS ==================

    /**
     * Render library recipes
     */
    renderLibraryRecipes(recipes, container, getStatesCallback) {
        const configProvider = (recipe) => {
            const states = getStatesCallback ? getStatesCallback(recipe.id) : {};
            return RecipeConfigFactory.createLibraryConfig(recipe, states);
        };

        const emptyState = this.cardRenderer.getEmptyState('default');
        this.cardRenderer.renderCards(recipes, container, configProvider, emptyState);
    }

    /**
     * Render user recipes
     */
    renderUserRecipes(recipes, container, getStatesCallback) {
        const configProvider = (recipe) => {
            const states = getStatesCallback ? getStatesCallback(recipe.id) : {};
            return RecipeConfigFactory.createUserConfig(recipe, states);
        };

        const emptyState = this.cardRenderer.getEmptyState('user');
        this.cardRenderer.renderCards(recipes, container, configProvider, emptyState);
    }

    /**
     * Render favorite recipes
     */
    renderFavoriteRecipes(recipes, container, getStatesCallback) {
        const configProvider = (recipe) => {
            const states = getStatesCallback ? getStatesCallback(recipe.id) : {};
            return RecipeConfigFactory.createLibraryConfig(recipe, states);
        };

        const emptyState = this.cardRenderer.getEmptyState('favorites');
        this.cardRenderer.renderCards(recipes, container, configProvider, emptyState);
    }

    /**
     * Render saved recipes
     */
    renderSavedRecipes(recipes, container, getStatesCallback) {
        const configProvider = (recipe) => {
            const states = getStatesCallback ? getStatesCallback(recipe.id) : {};
            return RecipeConfigFactory.createLibraryConfig(recipe, states);
        };

        const emptyState = this.cardRenderer.getEmptyState('saved');
        this.cardRenderer.renderCards(recipes, container, configProvider, emptyState);
    }

    /**
     * Render mixed user content (recipes + drafts)
     */
    renderUserContent(allContent, container, getStatesCallback) {
        const configProvider = (item) => {
            if (item.isDraft) {
                return RecipeConfigFactory.createDraftConfig(item);
            } else {
                const states = getStatesCallback ? getStatesCallback(item.id) : {};
                return RecipeConfigFactory.createUserConfig(item, states);
            }
        };

        const emptyState = this.cardRenderer.getEmptyState('user');
        this.cardRenderer.renderCards(allContent, container, configProvider, emptyState);
    }

    // ================== GENERIC RENDER METHOD ==================

    /**
     * Generic render method - MOST FLEXIBLE
     */
    renderRecipes(recipes, container, type = 'library', getStatesCallback = null) {
        const configProvider = (recipe) => {
            const states = getStatesCallback ? getStatesCallback(recipe.id) : {};
            return RecipeConfigFactory.createConfig(type, recipe, states);
        };

        const emptyState = this.cardRenderer.getEmptyState(type === 'user' ? 'user' : 'default');
        this.cardRenderer.renderCards(recipes, container, configProvider, emptyState);
    }
}