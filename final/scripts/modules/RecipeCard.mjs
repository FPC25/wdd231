export class RecipeCardRenderer {
    // ================== USER RECIPE CARDS ==================

    createUserRecipeCard(recipe) {
        const cookTime = recipe.cookTime ? `${recipe.cookTime.time} ${recipe.cookTime.unit}` : 'Not specified';
        const difficulty = recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : 'Not specified';
        const serves = recipe.serves || 'Not specified';

        const hasImage = recipe.cover && recipe.cover !== "image" && !recipe.cover.includes('placeholder.svg');
        const imageSrc = hasImage ? recipe.cover : './images/placeholder.svg';
        const imageClass = hasImage ? 'has-photo' : 'no-photo';

        // Badge para draft
        const draftBadge = recipe.isDraft ? '<span class="draft-badge">Draft</span>' : '';

        // Ações diferentes para draft vs receita completa
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

    createFavoritesEmptyState() {
        return this.createEmptyState('No favorite recipes yet. Start exploring and add some favorites!');
    }

    createSavedEmptyState() {
        return this.createEmptyState('No saved recipes yet. Create your first recipe or save some from explore!');
    }

    createUserRecipesEmptyState() {
        return this.createEmptyState(
            "You haven't created any recipes yet.",
            'Create Your First Recipe',
            './recipe.html'
        );
    }

    // ================== RENDER METHODS ==================

    renderUserRecipes(recipes, container) {
        if (!container) return;

        if (recipes.length === 0) {
            container.innerHTML = this.createUserRecipesEmptyState();
            return;
        }

        container.innerHTML = recipes.map(recipe => this.createUserRecipeCard(recipe)).join('');
    }
}