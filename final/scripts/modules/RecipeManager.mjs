import { RecipeDataService } from './RecipeDataService.mjs';
import { RecipeCard } from './RecipeCard.mjs';

/**
 * RecipeManager - Main facade for recipe operations
 * Consolidates all recipe business logic and rendering
 */
export class RecipeManager {
    constructor() {
        this.dataService = new RecipeDataService();
        this.cardRenderer = new RecipeCard();
        this.updateCallbacks = [];
        
        // Form utilities
        this.initializeFormOptions();
    }

    initializeFormOptions() {
        this.quantityOptions = [
            'to taste', '1/8', '1/4', '1/3', '3/8', '1/2', '2/3', '5/8', '3/4', '7/8',
            '1', '1 1/4', '1 1/3', '1 1/2', '1 2/3', '1 3/4',
            '2', '2 1/4', '2 1/3', '2 1/2', '2 2/3', '2 3/4',
            '3', '4', '5', '6', '7', '8', '9', '10'
        ];
        
        this.unitOptions = [
            { value: '', text: 'Select' },
            { value: 'ml', text: 'ml' },
            { value: 'l', text: 'liter(s)' },
            { value: 'g', text: 'gram(s)' },
            { value: 'kg', text: 'kg' },
            { value: 'cup', text: 'cup(s)' },
            { value: 'tbsp', text: 'tablespoon(s)' },
            { value: 'tsp', text: 'teaspoon(s)' },
            { value: 'oz', text: 'ounce(s)' },
            { value: 'lb', text: 'pound(s)' },
            { value: 'piece', text: 'piece(s)' },
            { value: 'can', text: 'can(s)' },
            { value: 'package', text: 'package(s)' },
            { value: 'sachet', text: 'sachet(s)' },
            { value: 'pinch', text: 'pinch' },
            { value: 'dash', text: 'dash' },
            { value: 'handful', text: 'handful' },
            { value: 'slice', text: 'slice(s)' },
            { value: 'clove', text: 'clove(s)' },
            { value: 'sprig', text: 'sprig(s)' },
            { value: 'bunch', text: 'bunch(es)' }
        ];
    }

    // ================== BUSINESS LOGIC ==================

    async loadRecipes() {
        return await this.dataService.loadRecipes();
    }

    getRecipes(criteria = 'all', searchTerm = '') {
        const allRecipes = this.dataService.getRecipes();
        const userRecipes = this.dataService.getUserRecipes();
        const favorites = this.dataService.getFavorites();
        const saved = this.dataService.getSaved();
        
        let filteredRecipes = [];
        
        switch (criteria) {
            case 'library':
                filteredRecipes = allRecipes;
                break;
            case 'user':
                filteredRecipes = userRecipes;
                break;
            case 'favorites':
                filteredRecipes = allRecipes.filter(recipe => favorites.includes(recipe.id));
                break;
            case 'saved':
                filteredRecipes = allRecipes.filter(recipe => saved.includes(recipe.id));
                break;
            case 'all':
            default:
                filteredRecipes = [...allRecipes, ...userRecipes];
                break;
        }
        
        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredRecipes = filteredRecipes.filter(recipe =>
                recipe.name.toLowerCase().includes(term) ||
                recipe.filters.some(filter => filter.toLowerCase().includes(term)) ||
                recipe.ingredients.some(ing => ing.item.toLowerCase().includes(term))
            );
        }
        
        return filteredRecipes;
    }

    getRecipeById(id) {
        return this.dataService.getRecipeById(id);
    }

    getRecipeStates(recipeId) {
        const favorites = this.dataService.getFavorites();
        const saved = this.dataService.getSaved();
        
        return {
            isFavorite: favorites.includes(recipeId),
            isSaved: saved.includes(recipeId)
        };
    }

    toggleFavorite(recipeId) {
        const recipe = this.getRecipeById(recipeId);
        if (!recipe) return null;
        
        const favorites = this.dataService.getFavorites();
        const index = favorites.indexOf(recipeId);
        
        if (index > -1) {
            favorites.splice(index, 1);
            this.dataService.setFavorites(favorites);
        } else {
            favorites.push(recipeId);
            this.dataService.setFavorites(favorites);
        }
        
        this.notifyChange();
        return recipe;
    }

    toggleSaved(recipeId) {
        const recipe = this.getRecipeById(recipeId);
        if (!recipe) return null;
        
        const saved = this.dataService.getSaved();
        const index = saved.indexOf(recipeId);
        
        if (index > -1) {
            saved.splice(index, 1);
            this.dataService.setSaved(saved);
        } else {
            saved.push(recipeId);
            this.dataService.setSaved(saved);
        }
        
        this.notifyChange();
        return recipe;
    }

    saveRecipe(recipeData) {
        const recipe = this.dataService.saveUserRecipe(recipeData);
        
        if (recipeData.isFavorite) {
            const favorites = this.dataService.getFavorites();
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

    // ================== RENDERING ==================

    renderRecipes(recipes, container, type = 'library') {
        const configProvider = (recipe) => {
            const states = this.getRecipeStates(recipe.id);
            return this.createConfig(type, recipe, states);
        };

        const emptyState = this.cardRenderer.getEmptyState(type === 'user' ? 'user' : 'default');
        this.cardRenderer.renderCards(recipes, container, configProvider, emptyState);
        this.addEventListeners(container);
    }

    renderUserRecipes(container) {
        const userRecipes = this.getRecipes('user');
        const draft = this.getDraft();
        const allContent = [];

        if (draft) {
            allContent.push({ ...draft, isDraft: true, id: 'draft' });
        }
        allContent.push(...userRecipes);

        const configProvider = (item) => {
            if (item.isDraft) {
                return this.createDraftConfig(item);
            } else {
                const states = this.getRecipeStates(item.id);
                return this.createUserConfig(item, states);
            }
        };

        const emptyState = this.cardRenderer.getEmptyState('user');
        this.cardRenderer.renderCards(allContent, container, configProvider, emptyState);
        this.addEventListeners(container);
    }

    // ================== CARD CONFIGURATION ==================

    createConfig(type, recipe, states = {}) {
        switch (type) {
            case 'library':
                return this.createLibraryConfig(recipe, states);
            case 'user':
                return this.createUserConfig(recipe, states);
            case 'draft':
                return this.createDraftConfig(recipe);
            default:
                return this.createLibraryConfig(recipe, states);
        }
    }

    createLibraryConfig(recipe, states = {}) {
        const { isFavorite = false, isSaved = false } = states;
        
        return {
            cardClass: 'library-card',
            badge: '',
            actions: this.createLibraryActions(recipe.id, isFavorite, isSaved),
            metaContent: null,
            imageClass: '',
            showMeta: true
        };
    }

    createUserConfig(recipe, states = {}) {
        const { isFavorite = false, isSaved = false } = states;
        
        return {
            cardClass: 'user-recipe-card',
            badge: '',
            actions: this.createLibraryActions(recipe.id, isFavorite, isSaved),
            metaContent: null,
            imageClass: '',
            showMeta: true
        };
    }

    createDraftConfig(recipe) {
        return {
            cardClass: 'draft-card',
            badge: '<span class="draft-badge">Draft</span>',
            actions: this.createDraftActions(),
            metaContent: '<span class="draft-status">Draft in progress</span>',
            imageClass: 'draft-image',
            showMeta: false
        };
    }

    createLibraryActions(recipeId, isFavorite, isSaved) {
        const favoriteClass = isFavorite ? 'active' : '';
        const savedClass = isSaved ? 'active' : '';
        const saveIcon = isSaved ? 'check.svg' : 'plus.svg';
        const saveAlt = isSaved ? 'Saved' : 'Save';

        return `
            <button class="action-btn save-btn ${savedClass}" 
                    data-recipe-id="${recipeId}" 
                    data-action="save" 
                    aria-label="Toggle save"
                    aria-pressed="${isSaved}">
                <img src="./images/${saveIcon}" alt="${saveAlt}">
            </button>
            <button class="action-btn favorite-btn ${favoriteClass}" 
                    data-recipe-id="${recipeId}" 
                    data-action="favorite" 
                    aria-label="Toggle favorite"
                    aria-pressed="${isFavorite}">
                <img src="./images/star.svg" alt="Favorite">
            </button>
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

    // ================== EVENT HANDLING ==================

    addEventListeners(container) {
        container.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleActionClick(button);
            });
        });

        container.querySelectorAll('.recipe-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.closest('.action-btn')) {
                    this.handleCardClick(card);
                }
            });
            card.style.cursor = 'pointer';
        });
    }

    handleActionClick(button) {
        const action = button.dataset.action;
        const recipeId = parseInt(button.dataset.recipeId);

        switch (action) {
            case 'favorite':
                this.toggleFavorite(recipeId);
                this.updateButtonsForRecipe(recipeId);
                break;
            case 'save':
                this.toggleSaved(recipeId);
                this.updateButtonsForRecipe(recipeId);
                break;
            case 'edit-draft':
                window.location.href = './recipe.html';
                break;
            case 'delete-draft':
                if (confirm('Are you sure you want to delete this draft?')) {
                    this.deleteDraft();
                    window.location.reload();
                }
                break;
        }
    }

    handleCardClick(card) {
        const recipeId = card.dataset.recipeId;
        
        if (card.classList.contains('draft-card')) {
            window.location.href = './recipe.html';
        } else {
            window.location.href = `./recipe-detail.html?id=${recipeId}`;
        }
    }

    updateButtonsForRecipe(recipeId) {
        const states = this.getRecipeStates(recipeId);
        
        document.querySelectorAll(`[data-recipe-id="${recipeId}"]`).forEach(btn => {
            const action = btn.dataset.action;
            if (action === 'favorite') {
                btn.classList.toggle('active', states.isFavorite);
                btn.setAttribute('aria-pressed', states.isFavorite);
            } else if (action === 'save') {
                btn.classList.toggle('active', states.isSaved);
                btn.setAttribute('aria-pressed', states.isSaved);
                const img = btn.querySelector('img');
                if (img) {
                    img.src = states.isSaved ? './images/check.svg' : './images/plus.svg';
                    img.alt = states.isSaved ? 'Saved' : 'Save';
                }
            }
        });
    }

    // ================== FORM UTILITIES (could be extracted) ==================

    addIngredientRow(container) {
        const quantityOptionsHTML = this.quantityOptions.map(option => 
            `<option value="${option}">${option}</option>`
        ).join('');
        
        const unitOptionsHTML = this.unitOptions.map(option => 
            `<option value="${option.value}">${option.text}</option>`
        ).join('');
        
        const ingredientRow = document.createElement('div');
        ingredientRow.className = 'ingredient-row';
        ingredientRow.innerHTML = `
            <div>
                <label>Quantity</label>
                <select class="quantity-input">
                    <option value="">Select</option>
                    ${quantityOptionsHTML}
                </select>
            </div>
            <div>
                <label>Unit</label>
                <select class="unit-input">
                    ${unitOptionsHTML}
                </select>
            </div>
            <div>
                <label>Ingredient</label>
                <input type="text" class="ingredient-input" placeholder="e.g., flour, sugar">
            </div>
            <button type="button" class="remove-ingredient" onclick="this.closest('.ingredient-row').remove()">×</button>
        `;
        
        container.appendChild(ingredientRow);
        
        const quantitySelect = ingredientRow.querySelector('.quantity-input');
        const unitSelect = ingredientRow.querySelector('.unit-input');
        
        quantitySelect.addEventListener('change', function() {
            if (this.value === 'to taste') {
                unitSelect.value = '';
                unitSelect.disabled = true;
            } else {
                unitSelect.disabled = false;
            }
        });
    }

    collectFormData() {
        const name = document.getElementById('recipe-name').value.trim();
        const source = document.getElementById('source').value.trim() || '';
        const difficulty = document.getElementById('difficulty').value;
        const serves = parseInt(document.getElementById('serves').value) || 1;
        
        const cookTime = {
            time: parseInt(document.getElementById('cook-time').value),
            unit: document.getElementById('time-unit').value
        };
        
        const filterCheckboxes = document.querySelectorAll('#filters-group input[type="checkbox"]:checked');
        const filters = Array.from(filterCheckboxes).map(cb => cb.value);
        
        const ingredientRows = document.querySelectorAll('.ingredient-row');
        const ingredients = [];
        
        ingredientRows.forEach(row => {
            const quantity = row.querySelector('.quantity-input').value.trim();
            const item = row.querySelector('.ingredient-input').value.trim();
            const unit = row.querySelector('.unit-input').value.trim();
            
            if (quantity && item) {
                ingredients.push({
                    item: item,
                    quantity: quantity === 'to taste' ? 'to taste' : parseFloat(quantity) || quantity,
                    unit: quantity === 'to taste' ? null : (unit || null)
                });
            }
        });
        
        const instructionsText = document.getElementById('instructions').value.trim();
        const instructions = instructionsText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        const isFavorite = document.getElementById('mark-favorite').checked;
        
        let cover = "image";
        const uploadedImage = document.querySelector('.image-preview img[src^="data:"]');
        if (uploadedImage) {
            cover = uploadedImage.src;
        }
        
        return {
            name,
            cover,
            source,
            difficulty,
            cookTime,
            filters,
            ingredients,
            instructions,
            isSaved: true,
            isFavorite,
            serves
        };
    }

    // Note: dataService is directly accessible as this.dataService
}

// Global instance for backward compatibility
window.recipeManager = new RecipeManager();

// Backward compatibility with old RecipeUtils
window.RecipeUtils = {
    loadRecipes: () => window.recipeManager.loadRecipes(),
    filterRecipes: (criteria, search) => window.recipeManager.getRecipes(criteria, search),
    toggleFavorite: (id) => window.recipeManager.toggleFavorite(id),
    toggleSaved: (id) => window.recipeManager.toggleSaved(id),
    onFavoritesChange: (callback) => window.recipeManager.onFavoritesChange(callback),
    getRecipesData: () => window.recipeManager.dataService.getRecipes(),
    getFavoritesFromStorage: () => window.recipeManager.dataService.getFavorites(),
    getSavedFromStorage: () => window.recipeManager.dataService.getSaved(),
    getUserRecipes: () => window.recipeManager.getRecipes('user'),
    getDraft: () => window.recipeManager.getDraft()
};