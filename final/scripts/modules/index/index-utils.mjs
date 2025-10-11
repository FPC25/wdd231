/**
 * Load draft from localStorage
 * @returns {Object|null} Draft object or null if not found
 */
export function getDraft() {
    try {
        const draftData = localStorage.getItem('recipeDraft');
        if (draftData) {
            const draft = JSON.parse(draftData);
            // Validate if draft has at least a name
            if (draft.name && draft.name.trim()) {
                return draft;
            }
        }
    } catch (error) {
        console.error('Error loading draft:', error);
    }
    return null;
}

/**
 * Get user recipes from localStorage
 * @returns {Array} Array of user recipes
 */
export function getUserRecipes() {
    try {
        const userRecipes = localStorage.getItem('userRecipes');
        return userRecipes ? JSON.parse(userRecipes) : [];
    } catch (error) {
        console.error('Error loading user recipes:', error);
        return [];
    }
}

/**
 * Save user recipes to localStorage
 * @param {Array} recipes - Array of recipes to save
 */
export function saveUserRecipes(recipes) {
    try {
        localStorage.setItem('userRecipes', JSON.stringify(recipes));
    } catch (error) {
        console.error('Error saving user recipes:', error);
    }
}

/**
 * Validate localStorage data
 * @param {string} key - localStorage key to validate
 * @returns {boolean} True if data is valid
 */
export function validateLocalStorageData(key) {
    try {
        const data = localStorage.getItem(key);
        if (data) {
            JSON.parse(data);
            return true;
        }
    } catch (error) {
        console.error(`Invalid data in localStorage for key: ${key}`, error);
        localStorage.removeItem(key); // Clear invalid data
    }
    return false;
}

/**
 * Clear all user data from localStorage
 * @param {boolean} confirm - Whether to ask for confirmation
 */
export function clearUserData(confirm = true) {
    if (confirm && !window.confirm('Are you sure you want to clear all your data? This cannot be undone.')) {
        return false;
    }
    
    const keysToRemove = ['userRecipes', 'recipeDraft', 'flavorfy_favorites', 'flavorfy_saved'];
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    return true;
}