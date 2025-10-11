/**
 * index-renderer.mjs
 * Responsible for rendering content on the index page
 * Following SOLID principle: Single responsibility for rendering
 */

import { filterRecipes } from '../recipe/recipe-data.mjs';
import { renderRecipes } from '../recipe/recipe-renderer.mjs';
import { getDraft, getUserRecipes, saveUserRecipes } from './index-utils.mjs';
import { getDomElements } from './index-dom.mjs';

/**
 * Render the favorites section
 */
export function renderFavoritesSection(searchTerm = '') {
    const { favoritesGrid } = getDomElements();
    if (!favoritesGrid) return;
    
    const favoriteRecipes = filterRecipes('favorites', searchTerm);
    const emptyMessage = 'No favorite recipes yet. Start exploring and add some favorites!';
    renderRecipes(favoriteRecipes, favoritesGrid, emptyMessage);
}

/**
 * Render the saved recipes section
 */
export function renderSavedSection(searchTerm = '') {
    const { savedGrid } = getDomElements();
    if (!savedGrid) return;
    
    const savedRecipes = filterRecipes('saved', searchTerm);
    const emptyMessage = 'No saved recipes yet. Create your first recipe or save some from explore!';
    renderRecipes(savedRecipes, savedGrid, emptyMessage);
}

/**
 * Display user recipes including drafts
 */
export function displayUserRecipes() {
    const { userRecipesGrid } = getDomElements();
    if (!userRecipesGrid) return;
    
    // Load user recipes
    const userRecipes = getUserRecipes();
    
    // Load draft if exists
    const draft = getDraft();
    const allUserContent = [];
    
    // Add draft first if exists
    if (draft) {
        allUserContent.push({
            ...draft,
            isDraft: true,
            id: 'draft-' + Date.now()
        });
    }
    
    // Add saved recipes
    allUserContent.push(...userRecipes);
    
    if (allUserContent.length === 0) {
        userRecipesGrid.innerHTML = `
            <div class="empty-state">
                <p>You haven't created any recipes yet.</p>
                <a href="./recipe.html" class="btn-accent">Create Your First Recipe</a>
            </div>
        `;
        return;
    }
    
    userRecipesGrid.innerHTML = allUserContent.map(recipe => createUserRecipeCard(recipe)).join('');
    
    // Add event listeners
    addUserRecipeListeners();
}

/**
 * Create card for user recipes (including drafts)
 * @param {Object} recipe - Recipe object
 * @returns {string} HTML string for recipe card
 */
function createUserRecipeCard(recipe) {
    const cookTime = recipe.cookTime ? `${recipe.cookTime.time} ${recipe.cookTime.unit}` : 'Not specified';
    const difficulty = recipe.difficulty ? recipe.difficulty.charAt(0).toUpperCase() + recipe.difficulty.slice(1) : 'Not specified';
    const serves = recipe.serves || 'Not specified';
    
    const hasImage = recipe.cover && recipe.cover !== "image" && !recipe.cover.includes('placeholder.svg');
    const imageSrc = hasImage ? recipe.cover : './images/placeholder.svg';
    const imageClass = hasImage ? 'has-photo' : 'no-photo';
    
    // Badge for draft
    const draftBadge = recipe.isDraft ? '<span class="draft-badge">Draft</span>' : '';
    
    // Different actions for draft vs complete recipe
    const actions = recipe.isDraft ? `
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
    ` : `
        <button class="action-btn edit-btn" 
                data-recipe-id="${recipe.id}" 
                data-action="edit" 
                aria-label="Edit recipe">
            <img src="./images/edit.svg" alt="Edit">
        </button>
        <button class="action-btn delete-btn" 
                data-recipe-id="${recipe.id}" 
                data-action="delete" 
                aria-label="Delete recipe">
            <img src="./images/trash.svg" alt="Delete">
        </button>
    `;
    
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
 * Add event listeners for user recipe cards
 */
function addUserRecipeListeners() {
    const { userRecipesGrid } = getDomElements();
    if (!userRecipesGrid) return;
    
    userRecipesGrid.addEventListener('click', function(e) {
        const actionBtn = e.target.closest('.action-btn');
        if (!actionBtn) return;
        
        const action = actionBtn.dataset.action;
        const recipeId = actionBtn.dataset.recipeId;
        
        switch (action) {
            case 'edit-draft':
                editDraft();
                break;
            case 'delete-draft':
                deleteDraft();
                break;
            case 'edit':
                editRecipe(recipeId);
                break;
            case 'delete':
                deleteRecipe(recipeId);
                break;
        }
    });
    
    // Click on card to open recipe (except drafts)
    userRecipesGrid.addEventListener('click', function(e) {
        const card = e.target.closest('.recipe-card');
        if (!card || e.target.closest('.recipe-actions')) return;
        
        if (card.classList.contains('draft-card')) {
            // Draft - redirect to editing
            editDraft();
        } else {
            // Complete recipe - open details
            const recipeId = card.dataset.recipeId;
            window.location.href = `./recipe-detail.html?id=${recipeId}`;
        }
    });
}

/**
 * Edit draft function
 */
function editDraft() {
    window.location.href = './recipe.html';
}

/**
 * Delete draft function
 */
function deleteDraft() {
    if (confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
        localStorage.removeItem('recipeDraft');
        displayUserRecipes(); // Reload the list
        console.log('Draft deleted successfully');
    }
}

/**
 * Edit existing recipe function
 * @param {string} recipeId - Recipe ID to edit
 */
async function editRecipe(recipeId) {
    try {
        const { getRecipeById } = await import('../recipe/recipe-management.mjs');
        const recipe = getRecipeById(recipeId);
        
        if (!recipe) {
            alert('Recipe not found!');
            return;
        }
        
        if (recipe.isApiRecipe) {
            // API recipe - offer to create personal copy
            if (confirm(`"${recipe.name}" is from an external source. Would you like to create a personal copy that you can edit?`)) {
                window.location.href = `./recipe.html?fork=${recipeId}`;
            }
        } else {
            // User recipe - direct edit
            window.location.href = `./recipe.html?edit=${recipeId}`;
        }
        
    } catch (error) {
        console.error('Error editing recipe:', error);
        alert('Error loading recipe for editing.');
    }
}

/**
 * Delete recipe function
 * @param {string} recipeId - Recipe ID to delete
 */
async function deleteRecipe(recipeId) {
    try {
        const { getRecipeById, deleteUserRecipe } = await import('../recipe/recipe-management.mjs');
        const recipe = getRecipeById(recipeId);
        
        if (!recipe) {
            alert('Recipe not found!');
            return;
        }
        
        if (recipe.isApiRecipe) {
            alert('External recipes cannot be deleted. You can only remove them from your saved list.');
            return;
        }
        
        const recipeName = recipe.name || 'this recipe';
        if (confirm(`Are you sure you want to delete "${recipeName}"? This action cannot be undone.`)) {
            const success = deleteUserRecipe(recipeId);
            
            if (success) {
                displayUserRecipes(); // Reload the list
                alert('Recipe deleted successfully!');
            } else {
                alert('Error deleting recipe. Please try again.');
            }
        }
        
    } catch (error) {
        console.error('Error deleting recipe:', error);
        alert('Error deleting recipe.');
    }
}