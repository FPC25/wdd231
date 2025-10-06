import { RecipeBusinessLogic } from './RecipeBusinessLogic.mjs';
import { RecipeRenderingService } from './RecipeRenderingService.mjs';

/**
 * RecipeManager - Facade Pattern (Simplified Interface)
 * Provides a simple interface to complex subsystems
 */
export class RecipeManager {
    constructor(businessLogic = null, renderingService = null) {
        this.businessLogic = businessLogic || new RecipeBusinessLogic();
        this.renderingService = renderingService || new RecipeRenderingService();
        
        // Form utilities (could be moved to separate FormManager)
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

    // ================== DELEGATE TO BUSINESS LOGIC ==================

    async loadRecipes() {
        return await this.businessLogic.loadRecipes();
    }

    getRecipes(criteria = 'all', searchTerm = '') {
        return this.businessLogic.getRecipes(criteria, searchTerm);
    }

    getRecipeById(id) {
        return this.businessLogic.getRecipeById(id);
    }

    getRecipeStates(recipeId) {
        return this.businessLogic.getRecipeStates(recipeId);
    }

    toggleFavorite(recipeId) {
        return this.businessLogic.toggleFavorite(recipeId);
    }

    toggleSaved(recipeId) {
        return this.businessLogic.toggleSaved(recipeId);
    }

    saveRecipe(recipeData) {
        return this.businessLogic.saveRecipe(recipeData);
    }

    saveDraft(draftData) {
        return this.businessLogic.saveDraft(draftData);
    }

    getDraft() {
        return this.businessLogic.getDraft();
    }

    deleteDraft() {
        return this.businessLogic.deleteDraft();
    }

    onFavoritesChange(callback) {
        return this.businessLogic.onFavoritesChange(callback);
    }

    // ================== DELEGATE TO RENDERING ==================

    renderRecipes(recipes, container, type = 'library') {
        const getStatesCallback = (recipeId) => this.getRecipeStates(recipeId);
        return this.renderingService.renderRecipes(recipes, container, type, getStatesCallback);
    }

    renderUserRecipes(container) {
        const userRecipes = this.getRecipes('user');
        const draft = this.getDraft();
        const allContent = [];

        if (draft) {
            allContent.push({ ...draft, isDraft: true, id: 'draft' });
        }
        allContent.push(...userRecipes);

        const getStatesCallback = (recipeId) => this.getRecipeStates(recipeId);
        this.renderingService.renderUserContent(allContent, container, getStatesCallback);
        
        // Add event listeners
        this.addEventListeners(container);
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

    // Expose dataService for direct access when needed
    get dataService() {
        return this.businessLogic.dataService;
    }
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
    getRecipesData: () => window.recipeManager.businessLogic.dataService.getRecipes(),
    getFavoritesFromStorage: () => window.recipeManager.businessLogic.dataService.getFavorites(),
    getSavedFromStorage: () => window.recipeManager.businessLogic.dataService.getSaved(),
    getUserRecipes: () => window.recipeManager.getRecipes('user'),
    getDraft: () => window.recipeManager.getDraft()
};