// Rendering functions for recipes

// Cria HTML do card da receita
export function createRecipeCard(recipe) {
    const favoriteClass = recipe.isFavorite ? 'active' : '';
    const savedClass = recipe.isSaved ? 'active' : '';
    const cookTime = `${recipe.cookTime.time} ${recipe.cookTime.unit}`;
    const difficulty = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
    const saveIcon = recipe.isSaved ? 'check.svg' : 'plus.svg';
    const saveAlt = recipe.isSaved ? 'Saved' : 'Save';
    
    const hasImage = recipe.cover && recipe.cover !== "image" && !recipe.cover.includes('placeholder.svg');
    const imageSrc = hasImage ? recipe.cover : './images/placeholder.svg';
    const imageClass = hasImage ? 'has-photo' : 'no-photo';
    
    return `
        <div class="recipe-card" data-recipe-id="${recipe.id}">
            <div class="recipe-image ${imageClass}">
                <img src="${imageSrc}" alt="${recipe.name}" loading="lazy">
                <div class="recipe-actions">
                    <button class="action-btn save-btn ${savedClass}" 
                            data-recipe-id="${recipe.id}" 
                            data-action="save" 
                            aria-label="Toggle save">
                        <img src="./images/${saveIcon}" alt="${saveAlt}">
                    </button>
                    <button class="action-btn favorite-btn ${favoriteClass}" 
                            data-recipe-id="${recipe.id}" 
                            data-action="favorite" 
                            aria-label="Toggle favorite">
                        <img src="./images/star.svg" alt="Favorite">
                    </button>
                </div>
            </div>
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.name}</h3>
                <div class="recipe-meta">
                    <span class="cook-time">${cookTime}</span>
                    <span class="difficulty">${difficulty}</span>
                    <span class="serves">Serves ${recipe.serves}</span>
                </div>
            </div>
        </div>
    `;
}

// Renderiza receitas no container especificado
export function renderRecipes(recipes, container, emptyMessage = 'No recipes found.') {
    if (!container) return;
    
    if (recipes.length === 0) {
        container.innerHTML = `<p class="empty-message">${emptyMessage}</p>`;
        return;
    }
    
    container.innerHTML = recipes.map(recipe => createRecipeCard(recipe)).join('');
    
    // Adicionar event listeners após renderizar
    setupRecipeCardEvents(container);
}

/**
 * Configura event listeners para cards de receitas
 * @param {HTMLElement} container - Container com os cards
 */
function setupRecipeCardEvents(container) {
    const recipeCards = container.querySelectorAll('.recipe-card');
    
    recipeCards.forEach(card => {
        // Event listener para clique no card (navegar para detalhes)
        card.addEventListener('click', function(e) {
            // Verificar se o clique não foi em um botão de ação
            if (!e.target.closest('.action-btn')) {
                const recipeId = this.dataset.recipeId;
                window.location.href = `./recipe-detail.html?id=${recipeId}`;
            }
        });
        
        // Adicionar cursor pointer
        card.style.cursor = 'pointer';
    });
    
    // Event listeners para botões de ação
    setupActionButtons(container);
}

/**
 * Configura event listeners para botões de favoritar/salvar
 * @param {HTMLElement} container - Container com os cards
 */
function setupActionButtons(container) {
    const actionButtons = container.querySelectorAll('.action-btn');
    
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Evitar trigger do clique no card
            
            const recipeId = this.dataset.recipeId;
            const action = this.dataset.action;
            
            if (action === 'favorite') {
                toggleFavorite(recipeId, this);
            } else if (action === 'save') {
                toggleSave(recipeId, this);
            } else if (action === 'create-copy') {
                // Handle create copy action
                if (confirm('Create a personal copy of this recipe that you can edit?')) {
                    window.location.href = `./recipe.html?fork=${recipeId}`;
                }
            }
        });
    });
}

// Exibe os dados da receita na página - COM IMAGEM CONDICIONAL
export function displayRecipe(recipe) {
    // Atualizar título no header
    const headerTitle = document.getElementById('recipe-header-title');
    if (headerTitle) {
        headerTitle.textContent = recipe.name;
    }
    
    // Verificar e exibir imagem se não for placeholder
    displayRecipeImage(recipe);
    
    // Meta informações básicas
    const cookTimeElement = document.getElementById('cook-time');
    const difficultyElement = document.getElementById('difficulty');
    const servesElement = document.getElementById('serves');
    const sourceElement = document.getElementById('source');
    
    if (cookTimeElement) {
        cookTimeElement.textContent = `${recipe.cookTime.time} ${recipe.cookTime.unit}`;
    }
    if (difficultyElement) {
        difficultyElement.textContent = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
    }
    if (servesElement) {
        servesElement.textContent = recipe.serves;
    }
    if (sourceElement) {
        // Determine recipe origin and display appropriate message
        const isUserRecipe = recipe.isUserCreated || recipe.source === "user";
        const isForkedRecipe = recipe.forkedFrom && recipe.forkedFromName;
        
        if (isForkedRecipe) {
            sourceElement.textContent = `Based on "${recipe.forkedFromName}"`;
        } else if (isUserRecipe) {
            sourceElement.innerHTML = `<span class="source-badge user">Your Recipe</span>`;
        } else {
            // Just show the source without badge for external recipes
            sourceElement.textContent = recipe.source || 'External source';
        }
    }
    
    // Categorias
    displayCategories(recipe);
    
    // Ingredientes
    displayIngredients(recipe);
    
    // Instruções
    displayInstructions(recipe);
}

// Exibe a imagem da receita se não for placeholder
export function displayRecipeImage(recipe) {
    const imageSection = document.getElementById('recipe-image-section');
    const mainImg = document.getElementById('recipe-main-img');
    
    if (!imageSection || !mainImg) return;
    
    // Verificar se a receita tem imagem e não é placeholder
    const hasValidImage = recipe.cover && 
                         recipe.cover !== "image" && 
                         !recipe.cover.includes('placeholder.svg') &&
                         recipe.cover.trim() !== '';
    
    if (hasValidImage) {
        mainImg.src = recipe.cover;
        mainImg.alt = recipe.name;
        mainImg.loading = "lazy";
        imageSection.style.display = 'block';
    } else {
        imageSection.style.display = 'none';
    }
}

/**
 * Toggle favorite status of a recipe
 * Logic: Favoriting always saves. Unfavoriting only removes favorite but keeps saved.
 * @param {string} recipeId - Recipe ID
 * @param {HTMLElement} button - Button element
 */
function toggleFavorite(recipeId, button) {
    // Import dynamic to avoid circular dependency
    import('./recipe-data.mjs').then(({ getRecipesData, saveFavoritesToStorage, getFavoritesFromStorage, saveSavedToStorage, getSavedFromStorage, notifyFavoritesChange }) => {
        const recipesData = getRecipesData();
        
        // Use flexible comparison for ID matching
        const recipe = recipesData.find(r => r.id == recipeId);
        
        if (!recipe) {
            return;
        }
        
        // Toggle favorite status
        recipe.isFavorite = !recipe.isFavorite;
        
        // RULE: If favoriting, also save. If unfavoriting, keep saved.
        if (recipe.isFavorite) {
            recipe.isSaved = true; // Favoriting implies saving
        }
        
        // Update favorites storage
        const favorites = getFavoritesFromStorage();
        if (recipe.isFavorite) {
            // Add to favorites if not present
            if (!favorites.some(id => id == recipeId)) {
                favorites.push(recipeId);
            }
        } else {
            // Remove from favorites
            const indexesToRemove = [];
            favorites.forEach((id, index) => {
                if (id == recipeId) indexesToRemove.push(index);
            });
            indexesToRemove.reverse().forEach(index => favorites.splice(index, 1));
        }
        saveFavoritesToStorage(favorites);
        
        // Update saved storage (if favoriting, ensure it's saved)
        if (recipe.isFavorite) {
            const saved = getSavedFromStorage();
            if (!saved.some(id => id == recipeId)) {
                saved.push(recipeId);
                saveSavedToStorage(saved);
            }
        }
        
        // Update button visual states
        updateButtonStates(button.closest('.recipe-card'), recipe);
        
        // Notify changes to update other parts of the app
        notifyFavoritesChange();
        
    }).catch(error => {
        console.error('Error in toggleFavorite:', error);
    });
}

/**
 * Toggle save status of a recipe
 * Logic: Saving only saves. Unsaving a favorite also removes favorite.
 * @param {string} recipeId - Recipe ID
 * @param {HTMLElement} button - Button element
 */
function toggleSave(recipeId, button) {
    // Import dynamic to avoid circular dependency
    import('./recipe-data.mjs').then(({ getRecipesData, saveSavedToStorage, getSavedFromStorage, saveFavoritesToStorage, getFavoritesFromStorage, notifyFavoritesChange }) => {
        const recipesData = getRecipesData();
        
        // Use flexible comparison for ID matching
        const recipe = recipesData.find(r => r.id == recipeId);
        
        if (!recipe) {
            return;
        }
        
        // Toggle save status
        recipe.isSaved = !recipe.isSaved;
        
        // RULE: If unsaving a favorite, also remove from favorites
        if (!recipe.isSaved && recipe.isFavorite) {
            recipe.isFavorite = false;
        }
        
        // Update saved storage
        const saved = getSavedFromStorage();
        if (recipe.isSaved) {
            // Add to saved if not present
            if (!saved.some(id => id == recipeId)) {
                saved.push(recipeId);
            }
        } else {
            // Remove from saved
            const indexesToRemove = [];
            saved.forEach((id, index) => {
                if (id == recipeId) indexesToRemove.push(index);
            });
            indexesToRemove.reverse().forEach(index => saved.splice(index, 1));
        }
        saveSavedToStorage(saved);
        
        // Update favorites storage (if unsaving, also remove from favorites)
        if (!recipe.isSaved) {
            const favorites = getFavoritesFromStorage();
            const indexesToRemove = [];
            favorites.forEach((id, index) => {
                if (id == recipeId) indexesToRemove.push(index);
            });
            indexesToRemove.reverse().forEach(index => favorites.splice(index, 1));
            saveFavoritesToStorage(favorites);
        }
        
        // Update button visual states
        updateButtonStates(button.closest('.recipe-card'), recipe);
        
        // Notify changes to update other parts of the app
        notifyFavoritesChange();
    }).catch(error => {
        console.error('Error in toggleSave:', error);
    });
}

/**
 * Update visual states of both buttons in a recipe card
 * @param {HTMLElement} card - Recipe card element
 * @param {Object} recipe - Recipe object with current states
 */
function updateButtonStates(card, recipe) {
    const favoriteBtn = card.querySelector('.favorite-btn');
    const saveBtn = card.querySelector('.save-btn');
    
    if (favoriteBtn) {
        const favoriteIcon = favoriteBtn.querySelector('img');
        if (recipe.isFavorite) {
            favoriteBtn.classList.add('active');
            favoriteIcon.src = './images/favorite.svg';
            favoriteIcon.alt = 'Favorited';
        } else {
            favoriteBtn.classList.remove('active');
            favoriteIcon.src = './images/favorite.svg';
            favoriteIcon.alt = 'Add to favorites';
        }
    }
    
    if (saveBtn) {
        const saveIcon = saveBtn.querySelector('img');
        if (recipe.isSaved) {
            saveBtn.classList.add('active');
            saveIcon.src = './images/check.svg';
            saveIcon.alt = 'Saved';
        } else {
            saveBtn.classList.remove('active');
            saveIcon.src = './images/plus.svg';
            saveIcon.alt = 'Save';
        }
    }
}

// Exibe as categorias da receita
export function displayCategories(recipe) {
    const categoriesContainer = document.getElementById('categories');
    if (!categoriesContainer) return;
    
    if (recipe.filters && recipe.filters.length > 0) {
        categoriesContainer.innerHTML = recipe.filters.map(filter => 
            `<span class="category-tag">${filter}</span>`
        ).join('');
    } else {
        categoriesContainer.innerHTML = '<span class="category-tag">Uncategorized</span>';
    }
}

// Exibe a lista de ingredientes
export function displayIngredients(recipe) {
    const ingredientsList = document.getElementById('ingredients-list');
    if (!ingredientsList) return;
    
    if (recipe.ingredients && recipe.ingredients.length > 0) {
        ingredientsList.innerHTML = recipe.ingredients.map(ingredient => {
            const quantity = ingredient.quantity;
            const unit = ingredient.unit ? ` ${ingredient.unit}` : '';
            const quantityText = `${quantity}${unit}`;
            
            return `
                <li class="ingredient-item">
                    <span class="ingredient-quantity">${quantityText}</span>
                    <span class="ingredient-name">${ingredient.item}</span>
                </li>
            `;
        }).join('');
    } else {
        ingredientsList.innerHTML = '<li class="ingredient-item">No ingredients specified</li>';
    }
}

// Exibe as instruções da receita
export function displayInstructions(recipe) {
    const instructionsList = document.getElementById('instructions-list');
    if (!instructionsList) return;
    
    if (recipe.instructions && recipe.instructions.length > 0) {
        instructionsList.innerHTML = recipe.instructions.map(instruction => 
            `<li class="instruction-item">${instruction}</li>`
        ).join('');
    } else {
        instructionsList.innerHTML = '<li class="instruction-item">No instructions provided</li>';
    }
}

/**
 * Create enhanced recipe card with management buttons for API recipes
 * @param {Object} recipe - Recipe object
 * @returns {string} HTML string for enhanced recipe card
 */
export function createEnhancedRecipeCard(recipe) {
    const favoriteClass = recipe.isFavorite ? 'active' : '';
    const savedClass = recipe.isSaved ? 'active' : '';
    const cookTime = `${recipe.cookTime.time} ${recipe.cookTime.unit}`;
    const difficulty = recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1);
    const saveIcon = recipe.isSaved ? 'check.svg' : 'plus.svg';
    const saveAlt = recipe.isSaved ? 'Saved' : 'Save';
    
    const hasImage = recipe.cover && recipe.cover !== "image" && !recipe.cover.includes('placeholder.svg');
    const imageSrc = hasImage ? recipe.cover : './images/placeholder.svg';
    const imageClass = hasImage ? 'has-photo' : 'no-photo';
    
    // Check if recipe is from API (not user-created)
    const isApiRecipe = !recipe.isUserCreated && recipe.source !== "user";
    const isForkedRecipe = recipe.forkedFrom && recipe.forkedFromName;
    
    // Add personal copy button for API recipes
    const personalCopyBtn = isApiRecipe ? `
        <button class="action-btn copy-btn" 
                data-recipe-id="${recipe.id}" 
                data-action="create-copy" 
                aria-label="Create personal copy"
                title="Create a personal copy you can edit">
            <img src="./images/copy.svg" alt="Copy">
        </button>
    ` : '';
    
    // Recipe type for CSS class - but no visual badges on cards
    const recipeTypeClass = isApiRecipe ? 'api-recipe' : 'user-recipe';
    
    return `
        <div class="recipe-card ${recipeTypeClass}" data-recipe-id="${recipe.id}">
            <div class="recipe-image ${imageClass}">
                <img src="${imageSrc}" alt="${recipe.name}" loading="lazy">
                <div class="recipe-actions">
                    <button class="action-btn save-btn ${savedClass}" 
                            data-recipe-id="${recipe.id}" 
                            data-action="save" 
                            aria-label="Toggle save">
                        <img src="./images/${saveIcon}" alt="${saveAlt}">
                    </button>
                    <button class="action-btn favorite-btn ${favoriteClass}" 
                            data-recipe-id="${recipe.id}" 
                            data-action="favorite" 
                            aria-label="Toggle favorite">
                        <img src="./images/star.svg" alt="Favorite">
                    </button>
                    ${personalCopyBtn}
                </div>
            </div>
            <div class="recipe-info">
                <h3 class="recipe-name">${recipe.name}</h3>
                <div class="recipe-meta">
                    <span class="cook-time">${cookTime}</span>
                    <span class="difficulty">${difficulty}</span>
                    <span class="serves">Serves ${recipe.serves}</span>
                </div>
            </div>
        </div>
    `;
}

/**
 * Enhanced render function that supports personal copy buttons
 * @param {Array} recipes - Array of recipe objects
 * @param {HTMLElement} container - Container element
 * @param {string} emptyMessage - Message when no recipes
 * @param {boolean} enhanced - Whether to use enhanced cards with copy buttons
 */
export function renderEnhancedRecipes(recipes, container, emptyMessage = 'No recipes found.', enhanced = false) {
    if (!container) return;
    
    if (recipes.length === 0) {
        container.innerHTML = `<p class="empty-message">${emptyMessage}</p>`;
        return;
    }
    
    const cardFunction = enhanced ? createEnhancedRecipeCard : createRecipeCard;
    container.innerHTML = recipes.map(recipe => cardFunction(recipe)).join('');
    
    // Adicionar event listeners após renderizar
    setupRecipeCardEvents(container);
}
