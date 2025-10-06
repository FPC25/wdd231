/**
 * RecipeCardRenderer class handles the creation and rendering of recipe cards
 * Manages different types of cards: user recipes, drafts, and empty states
 */
export class RecipeCardRenderer {
    // ================== USER RECIPE CARDS ==================

    /**
     * Creates HTML for a user recipe card with all necessary information and actions
     * @param {Object} recipe - The recipe object containing name, cookTime, difficulty, etc.
     * @returns {string} HTML string for the recipe card
     */
    createUserRecipeCard(recipe) {
        // Format cooking time or show default message if not available
        const cookTime = recipe.cookTime ? `${recipe.cookTime.time} ${recipe.cookTime.unit}` : 'Not specified';
        
        // Capitalize difficulty level or show default message
        const difficulty = recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : 'Not specified';
        
        // Get serving size or show default message
        const serves = recipe.serves || 'Not specified';

        // Check if recipe has a valid image (not placeholder or empty)
        const hasImage = recipe.cover && recipe.cover !== "image" && !recipe.cover.includes('placeholder.svg');
        
        // Set image source - use recipe image or fallback to placeholder
        const imageSrc = hasImage ? recipe.cover : './images/placeholder.svg';
        
        // Set CSS class based on whether recipe has image
        const imageClass = hasImage ? 'has-photo' : 'no-photo';

        // Create draft badge for draft recipes
        const draftBadge = recipe.isDraft ? '<span class="draft-badge">Draft</span>' : '';

        // Create different action buttons for drafts vs completed recipes
        const actions = recipe.isDraft ? this.createDraftActions() : this.createRecipeActions(recipe.id);

        return `
            <div class="recipe-card ${recipe.isDraft ? 'draft-card' : 'user-recipe-card'}" data-recipe-id="${recipe.id}">
                <div class="recipe-image ${imageClass}">
                    <img src="${imageSrc}" alt="${recipe.name}" loading="lazy">
                    ${draftBadge}
                    <div class="recipe-actions">
                        ${actions}
                    </div>
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-name">${recipe.name}</h3>
                    <div class="recipe-meta">
                        <span class="cook-time">${cookTime}</span>
                        <span class="difficulty">${difficulty}</span>
                        <span class="serves">Serves ${serves}</span>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Creates action buttons specifically for draft recipes (edit and delete)
     * @returns {string} HTML string for draft action buttons
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

    /**
     * Creates action buttons for completed user recipes (edit and delete)
     * @param {number|string} recipeId - The ID of the recipe
     * @returns {string} HTML string for recipe action buttons
     */
    createRecipeActions(recipeId) {
        return `
            <button class="action-btn edit-btn" 
                    data-recipe-id="${recipeId}" 
                    data-action="edit" 
                    aria-label="Edit recipe">
                <img src="./images/edit.svg" alt="Edit">
            </button>
            <button class="action-btn delete-btn" 
                    data-recipe-id="${recipeId}" 
                    data-action="delete" 
                    aria-label="Delete recipe">
                <img src="./images/trash.svg" alt="Delete">
            </button>
        `;
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
        // Create button only if both text and href are provided
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
     * Renders user recipes into the specified container
     * Shows empty state if no recipes exist, otherwise renders recipe cards
     * @param {Array} recipes - Array of recipe objects to render
     * @param {HTMLElement} container - DOM element to render recipes into
     */
    renderUserRecipes(recipes, container) {
        // Exit early if container doesn't exist
        if (!container) return;

        // Show empty state if no recipes exist
        if (recipes.length === 0) {
            container.innerHTML = this.createUserRecipesEmptyState();
            return;
        }

        // Render all recipe cards by mapping over recipes array
        container.innerHTML = recipes.map(recipe => this.createUserRecipeCard(recipe)).join('');
    }
}