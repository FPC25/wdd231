// This class manages user recipes and drafts stored in localStorage
export class UserRecipeManager {
    constructor() {
        // Keys used to store user recipes and drafts in localStorage
        this.userRecipesKey = 'recipesData';
        this.draftKey = 'recipeDraft';
    }

    // Initialize the localStorage keys if they don't exist
    init() {
        try {
            // Initialize user recipes if not already present in localStorage
            if (!localStorage.getItem(this.userRecipesKey)) {
                localStorage.setItem(this.userRecipesKey, JSON.stringify([]));
            }

            // Initialize draft if not already present in localStorage
            if (!localStorage.getItem(this.draftKey)) {
                localStorage.setItem(this.draftKey, JSON.stringify(null));
            }
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    }

    // ================== USER RECIPES ==================

    // Retrieve all user-created recipes (ID > 1000)
    getUserRecipes() {
        try {
            const recipesData = JSON.parse(localStorage.getItem(this.userRecipesKey) || '[]');
            // Filter recipes to include only user-created ones
            return recipesData.filter(recipe => recipe.id > 1000);
        } catch (error) {
            console.error('Error loading user recipes:', error);
            return [];
        }
    }

    // Save user recipes to localStorage
    saveUserRecipes(recipes) {
        try {
            // Load all recipes (including default ones)
            const allRecipes = JSON.parse(localStorage.getItem(this.userRecipesKey) || '[]');
            
            // Separate default recipes and add updated user recipes
            const defaultRecipes = allRecipes.filter(recipe => recipe.id <= 1000);
            const updatedRecipes = [...defaultRecipes, ...recipes];
            
            // Save the updated recipes back to localStorage
            localStorage.setItem(this.userRecipesKey, JSON.stringify(updatedRecipes));
            return true;
        } catch (error) {
            console.error('Error saving user recipes:', error);
            return false;
        }
    }

    // Delete a specific user recipe by its ID
    deleteUserRecipe(recipeId) {
        const userRecipes = this.getUserRecipes();
        const filteredRecipes = userRecipes.filter(recipe => recipe.id !== recipeId);
        return this.saveUserRecipes(filteredRecipes);
    }

    // ================== DRAFT MANAGEMENT ==================

    // Retrieve the current draft from localStorage
    getDraft() {
        try {
            const draftData = localStorage.getItem(this.draftKey);
            if (draftData) {
                const draft = JSON.parse(draftData);
                // Validate that the draft has at least a name
                if (draft.name && draft.name.trim()) {
                    return draft;
                }
            }
        } catch (error) {
            console.error('Error loading draft:', error);
        }
        return null;
    }

    // Save a draft to localStorage
    saveDraft(draftData) {
        try {
            localStorage.setItem(this.draftKey, JSON.stringify(draftData));
            return true;
        } catch (error) {
            console.error('Error saving draft:', error);
            return false;
        }
    }

    // Delete the current draft from localStorage
    deleteDraft() {
        try {
            localStorage.removeItem(this.draftKey);
            return true;
        } catch (error) {
            console.error('Error deleting draft:', error);
            return false;
        }
    }

    // Check if there is a draft saved in localStorage
    hasDraft() {
        return this.getDraft() !== null;
    }

    // ================== COMBINED DATA ==================

    // Retrieve all user content (recipes and draft)
    getAllUserContent() {
        const userRecipes = this.getUserRecipes();
        const draft = this.getDraft();
        const allContent = [];

        // Add the draft to the content list if it exists
        if (draft) {
            allContent.push({
                ...draft,
                isDraft: true,
                id: 'draft-' + Date.now() // Assign a temporary ID for the draft
            });
        }

        // Add saved user recipes to the content list
        allContent.push(...userRecipes);

        return allContent;
    }

    // Get the count of user-created recipes
    getUserRecipeCount() {
        return this.getUserRecipes().length;
    }

    // ================== ACTIONS ==================

    // Redirect to the recipe editing page for drafts
    editDraft() {
        window.location.href = './recipe.html';
    }

    // Placeholder for editing an existing recipe
    editRecipe(recipeId) {
        console.log('Edit recipe:', recipeId);
        // Currently, this only logs the action
    }

    // Confirm and delete the current draft
    confirmDeleteDraft() {
        if (confirm('Are you sure you want to delete this draft? This action cannot be undone.')) {
            return this.deleteDraft();
        }
        return false;
    }

    // Confirm and delete a specific user recipe
    confirmDeleteRecipe(recipeId) {
        if (confirm('Are you sure you want to delete this recipe? This action cannot be undone.')) {
            return this.deleteUserRecipe(recipeId);
        }
        return false;
    }
}