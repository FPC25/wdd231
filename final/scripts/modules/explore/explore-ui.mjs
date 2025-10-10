// UI utilities for explore page

/**
 * Show/hide daily recipes indicator based on current view
 */
export function updateDailyRecipesIndicator(showIndicator = true) {
    const indicator = document.querySelector('.daily-recipes-indicator');
    if (indicator) {
        indicator.style.display = showIndicator ? 'block' : 'none';
    }
}

/**
 * Show loading state for search
 */
export function showSearchLoadingState() {
    const recipeGrid = document.querySelector('.recipe-grid');
    if (recipeGrid) {
        recipeGrid.innerHTML = `
            <div style="text-align: center; color: #666; padding: 2rem;">
                <div style="margin-bottom: 1rem;">🔍</div>
                <p>Searching recipes...</p>
                <p style="font-size: 0.9em; margin-top: 0.5rem; color: #999;">
                    Including fresh API results
                </p>
            </div>
        `;
    }
}

/**
 * Show error state for search
 */
export function showSearchErrorState() {
    const recipeGrid = document.querySelector('.recipe-grid');
    if (recipeGrid) {
        recipeGrid.innerHTML = `
            <div style="text-align: center; color: #e74c3c; padding: 2rem;">
                <div style="margin-bottom: 1rem;">⚠️</div>
                <p>API search temporarily unavailable</p>
                <p style="font-size: 0.9em; margin-top: 0.5rem;">
                    Showing local recipes only
                </p>
            </div>
        `;
    }
}

/**
 * Add API recipe badge to recipe cards from API
 */
export function addApiRecipeBadges() {
    const recipeCards = document.querySelectorAll('.recipe-card');
    recipeCards.forEach(card => {
        const recipeId = card.dataset.recipeId;
        if (recipeId && recipeId.startsWith('api_')) {
            // Check if badge doesn't already exist
            if (!card.querySelector('.api-badge')) {
                const badge = document.createElement('div');
                badge.className = 'api-badge';
                badge.innerHTML = '🌟 API';
                badge.style.cssText = `
                    position: absolute;
                    top: 8px;
                    right: 8px;
                    background: linear-gradient(135deg, #FF6B6B, #4ECDC4);
                    color: white;
                    padding: 2px 6px;
                    border-radius: 12px;
                    font-size: 0.7em;
                    font-weight: bold;
                    z-index: 2;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                `;
                
                const imageContainer = card.querySelector('.recipe-image');
                if (imageContainer) {
                    imageContainer.style.position = 'relative';
                    imageContainer.appendChild(badge);
                }
            }
            
            // Add nutrition info if available
            addNutritionInfo(card, recipeId);
        }
    });
}

/**
 * Add nutrition information to API recipes
 */
function addNutritionInfo(card, recipeId) {
    // Get recipe data from API recipes
    const apiRecipes = JSON.parse(localStorage.getItem('flavorfy_daily_recipes') || '[]');
    const recipe = apiRecipes.find(r => r.id === recipeId);
    
    if (recipe && recipe.nutrition && !card.querySelector('.nutrition-info')) {
        const nutritionDiv = document.createElement('div');
        nutritionDiv.className = 'nutrition-info';
        nutritionDiv.innerHTML = `
            <div style="
                position: absolute;
                bottom: 8px;
                left: 8px;
                background: rgba(0,0,0,0.8);
                color: white;
                padding: 4px 8px;
                border-radius: 8px;
                font-size: 0.7em;
                z-index: 2;
            ">
                📊 ${recipe.nutrition.calories} cal
            </div>
        `;
        
        const imageContainer = card.querySelector('.recipe-image');
        if (imageContainer) {
            imageContainer.appendChild(nutritionDiv);
        }
    }
}