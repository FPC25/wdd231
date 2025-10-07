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
        sourceElement.textContent = recipe.source || 'Not specified';
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
