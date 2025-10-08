/**
 * recipe-management.mjs
 * Handles recipe CRUD operations: Create, Read, Update, Delete
 * Manages both user-created recipes and API recipe "forks"
 */

import { getRecipesData } from './recipe-data.mjs';
import { getUserRecipes, saveUserRecipes } from './index-utils.mjs';

/**
 * Check if a recipe is user-created or from API
 * @param {Object} recipe - Recipe object
 * @returns {boolean} True if user-created, false if from API
 */
export function isUserRecipe(recipe) {
    // User recipes have source as "user" or no specific API source
    return recipe.source === "user" || recipe.isUserCreated === true;
}

/**
 * Get recipe by ID from both API recipes and user recipes
 * @param {number|string} recipeId - Recipe ID to find
 * @returns {Object|null} Recipe object or null if not found
 */
export function getRecipeById(recipeId) {
    recipeId = parseInt(recipeId);
    
    // First check main recipes data (includes API recipes)
    const recipesData = getRecipesData();
    let recipe = recipesData.find(r => r.id === recipeId);
    
    if (recipe) {
        return { ...recipe, isApiRecipe: !isUserRecipe(recipe) };
    }
    
    // Then check user recipes
    const userRecipes = getUserRecipes();
    recipe = userRecipes.find(r => r.id === recipeId);
    
    if (recipe) {
        return { ...recipe, isApiRecipe: false, isUserCreated: true };
    }
    
    return null;
}

/**
 * Delete a user-created recipe
 * @param {number|string} recipeId - Recipe ID to delete
 * @returns {boolean} True if deleted successfully, false otherwise
 */
export function deleteUserRecipe(recipeId) {
    recipeId = parseInt(recipeId);
    
    // Get the recipe to verify it's user-created
    const recipe = getRecipeById(recipeId);
    if (!recipe || recipe.isApiRecipe) {
        console.error('Cannot delete API recipe or recipe not found');
        return false;
    }
    
    try {
        // Remove from user recipes
        let userRecipes = getUserRecipes();
        const initialLength = userRecipes.length;
        userRecipes = userRecipes.filter(r => r.id !== recipeId);
        
        if (userRecipes.length === initialLength) {
            console.error('Recipe not found in user recipes');
            return false;
        }
        
        saveUserRecipes(userRecipes);
        
        // Also remove from main recipes data if it exists there
        let recipesData = getRecipesData();
        const mainRecipeIndex = recipesData.findIndex(r => r.id === recipeId && isUserRecipe(r));
        if (mainRecipeIndex !== -1) {
            recipesData.splice(mainRecipeIndex, 1);
            localStorage.setItem('recipesData', JSON.stringify(recipesData));
        }
        
        // Remove from favorites and saved if present
        const favorites = JSON.parse(localStorage.getItem('flavorfy_favorites') || '[]');
        const saved = JSON.parse(localStorage.getItem('flavorfy_saved') || '[]');
        
        const favIndex = favorites.indexOf(recipeId);
        if (favIndex > -1) {
            favorites.splice(favIndex, 1);
            localStorage.setItem('flavorfy_favorites', JSON.stringify(favorites));
        }
        
        const savedIndex = saved.indexOf(recipeId);
        if (savedIndex > -1) {
            saved.splice(savedIndex, 1);
            localStorage.setItem('flavorfy_saved', JSON.stringify(saved));
        }
        
        // Notify about the change
        window.dispatchEvent(new CustomEvent('flavorfy-data-changed'));
        
        return true;
    } catch (error) {
        console.error('Error deleting recipe:', error);
        return false;
    }
}

/**
 * Compare two recipes to detect if there are real changes
 * @param {Object} original - Original recipe
 * @param {Object} modified - Modified recipe
 * @returns {boolean} True if there are meaningful changes
 */
export function hasRealChanges(original, modified) {
    // Compare basic properties
    const basicProps = ['name', 'source', 'difficulty', 'serves'];
    for (const prop of basicProps) {
        if (original[prop] !== modified[prop]) {
            return true;
        }
    }
    
    // Compare cook time
    if (original.cookTime?.time !== modified.cookTime?.time || 
        original.cookTime?.unit !== modified.cookTime?.unit) {
        return true;
    }
    
    // Compare filters
    if (JSON.stringify(original.filters || []) !== JSON.stringify(modified.filters || [])) {
        return true;
    }
    
    // Compare ingredients
    if (JSON.stringify(original.ingredients || []) !== JSON.stringify(modified.ingredients || [])) {
        return true;
    }
    
    // Compare instructions
    if (JSON.stringify(original.instructions || []) !== JSON.stringify(modified.instructions || [])) {
        return true;
    }
    
    return false;
}

/**
 * Create a fork of an API recipe (copy for user modification)
 * @param {Object} originalRecipe - Original API recipe
 * @param {Object} modifiedData - Modified recipe data
 * @returns {Object|null} New user recipe or null if no changes
 */
export function forkApiRecipe(originalRecipe, modifiedData) {
    // Check if there are real changes
    if (!hasRealChanges(originalRecipe, modifiedData)) {
        return null; // No changes, don't create fork
    }
    
    // Generate new ID for the fork
    const userRecipes = getUserRecipes();
    const recipesData = getRecipesData();
    const allIds = [...userRecipes.map(r => r.id), ...recipesData.map(r => r.id)];
    const nextId = allIds.length > 0 ? Math.max(...allIds) + 1 : 1000; // Start user IDs from 1000
    
    // Create forked recipe
    const forkedRecipe = {
        ...modifiedData,
        id: nextId,
        source: "user",
        isUserCreated: true,
        forkedFrom: originalRecipe.id,
        forkedFromName: originalRecipe.name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    return forkedRecipe;
}

/**
 * Update an existing user recipe
 * @param {number|string} recipeId - Recipe ID to update
 * @param {Object} updatedData - New recipe data
 * @returns {boolean} True if updated successfully
 */
export function updateUserRecipe(recipeId, updatedData) {
    recipeId = parseInt(recipeId);
    
    try {
        // Update in user recipes
        let userRecipes = getUserRecipes();
        const recipeIndex = userRecipes.findIndex(r => r.id === recipeId);
        
        if (recipeIndex === -1) {
            console.error('Recipe not found in user recipes');
            return false;
        }
        
        // Update the recipe
        userRecipes[recipeIndex] = {
            ...userRecipes[recipeIndex],
            ...updatedData,
            id: recipeId, // Ensure ID doesn't change
            updatedAt: new Date().toISOString()
        };
        
        saveUserRecipes(userRecipes);
        
        // Also update in main recipes data if it exists there
        let recipesData = getRecipesData();
        const mainRecipeIndex = recipesData.findIndex(r => r.id === recipeId && isUserRecipe(r));
        if (mainRecipeIndex !== -1) {
            recipesData[mainRecipeIndex] = { ...userRecipes[recipeIndex] };
            localStorage.setItem('recipesData', JSON.stringify(recipesData));
        }
        
        // Notify about the change
        window.dispatchEvent(new CustomEvent('flavorfy-data-changed'));
        
        return true;
    } catch (error) {
        console.error('Error updating recipe:', error);
        return false;
    }
}

/**
 * Save a forked recipe (from API recipe modification)
 * @param {Object} forkedRecipe - Forked recipe to save
 * @returns {boolean} True if saved successfully
 */
export function saveForkRecipe(forkedRecipe) {
    try {
        // Add to user recipes
        let userRecipes = getUserRecipes();
        userRecipes.push(forkedRecipe);
        saveUserRecipes(userRecipes);
        
        // Add to main recipes data
        let recipesData = getRecipesData();
        recipesData.push(forkedRecipe);
        localStorage.setItem('recipesData', JSON.stringify(recipesData));
        
        // Automatically save the forked recipe as saved
        const saved = JSON.parse(localStorage.getItem('flavorfy_saved') || '[]');
        if (!saved.includes(forkedRecipe.id)) {
            saved.push(forkedRecipe.id);
            localStorage.setItem('flavorfy_saved', JSON.stringify(saved));
        }
        
        // Notify about the change
        window.dispatchEvent(new CustomEvent('flavorfy-data-changed'));
        
        return true;
    } catch (error) {
        console.error('Error saving forked recipe:', error);
        return false;
    }
}

/**
 * Get all editable recipes for current user
 * @returns {Array} Array of recipes that can be edited by user
 */
export function getEditableRecipes() {
    const userRecipes = getUserRecipes();
    return userRecipes.filter(recipe => isUserRecipe(recipe));
}

/**
 * Get all deletable recipes for current user  
 * @returns {Array} Array of recipes that can be deleted by user
 */
export function getDeletableRecipes() {
    // Only user-created recipes can be deleted
    return getEditableRecipes();
}