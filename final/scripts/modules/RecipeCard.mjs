/**
 * RecipeCard - Pure UI Component (Single Responsibility Principle)
 * Generic card renderer - works for ANY recipe type without knowing business logic
 */
export class RecipeCard {
    
    /**
     * Creates a recipe card HTML - GENERIC approach
     * @param {Object} recipe - Recipe data
     * @param {Object} config - Configuration object with ALL rendering options
     * @returns {string} HTML string
     */
    createCard(recipe, config = {}) {
        // Default configuration (Open/Closed Principle - extensible)
        const defaultConfig = {
            cardClass: 'recipe-card',
            badge: '',
            actions: '',
            metaContent: null,
            imageClass: '',
            showMeta: true
        };
        
        // Merge provided config with defaults
        const finalConfig = { ...defaultConfig, ...config };
        
        const meta = this.formatMeta(recipe);
        const image = this.formatImage(recipe);

        return `
            <div class="recipe-card ${finalConfig.cardClass}" data-recipe-id="${recipe.id}">
                <div class="recipe-image ${image.class} ${finalConfig.imageClass}">
                    <img src="${image.src}" alt="${recipe.name}" loading="lazy">
                    ${finalConfig.badge}
                    <div class="recipe-actions">
                        ${finalConfig.actions}
                    </div>
                </div>
                <div class="recipe-info">
                    <h3 class="recipe-name">${recipe.name}</h3>
                    <div class="recipe-meta">
                        ${finalConfig.showMeta ? (finalConfig.metaContent || meta.default) : ''}
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Format recipe metadata - PURE function
     */
    formatMeta(recipe) {
        const cookTime = recipe.cookTime ? `${recipe.cookTime.time} ${recipe.cookTime.unit}` : 'Not specified';
        const difficulty = recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : 'Not specified';
        const serves = recipe.serves || 'Not specified';

        return {
            cookTime,
            difficulty,
            serves,
            default: `
                <span class="cook-time">${cookTime}</span>
                <span class="difficulty">${difficulty}</span>
                <span class="serves">Serves ${serves}</span>
            `
        };
    }

    /**
     * Format recipe image - PURE function
     */
    formatImage(recipe) {
        const hasImage = recipe.cover && recipe.cover !== "image" && !recipe.cover.includes('placeholder.svg');
        return {
            src: hasImage ? recipe.cover : './images/placeholder.svg',
            class: hasImage ? 'has-photo' : 'no-photo'
        };
    }

    /**
     * Render multiple cards to container - GENERIC
     * @param {Array} items - Array of items to render
     * @param {HTMLElement} container - DOM container
     * @param {Function} configProvider - Function that returns config for each item
     * @param {string} emptyStateHTML - HTML for empty state
     */
    renderCards(items, container, configProvider, emptyStateHTML = '<p>No items found.</p>') {
        if (!container) {
            console.warn('Container not found for rendering');
            return;
        }

        if (items.length === 0) {
            container.innerHTML = emptyStateHTML;
            return;
        }

        const cardsHTML = items.map(item => {
            const config = configProvider ? configProvider(item) : {};
            return this.createCard(item, config);
        }).join('');

        container.innerHTML = cardsHTML;
    }

    /**
     * Get common empty states - HELPER ONLY
     */
    getEmptyState(type) {
        const states = {
            favorites: '<p class="empty-message">No favorite recipes yet. Start exploring and add some favorites!</p>',
            saved: '<p class="empty-message">No saved recipes yet. Create your first recipe or save some from explore!</p>',
            user: '<div class="empty-state"><p>You haven\'t created any recipes yet.</p><a href="./recipe.html" class="btn-accent">Create Your First Recipe</a></div>',
            default: '<p class="empty-message">No recipes found.</p>'
        };
        
        return states[type] || states.default;
    }
}

// Global instance for backward compatibility
window.recipeCard = new RecipeCard();