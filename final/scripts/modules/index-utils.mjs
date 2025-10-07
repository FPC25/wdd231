// Utility functions for index page

export function getDraft() {
    try {
        const draftData = localStorage.getItem('recipeDraft');
        if (draftData) {
            const draft = JSON.parse(draftData);
            if (draft.name && draft.name.trim()) {
                return draft;
            }
        }
    } catch (error) {
        console.error('Error loading draft:', error);
    }
    return null;
}

export function createUserRecipeCard(recipe) {
    // Implementação existente
}

export function addUserRecipeListeners() {
    // Implementação existente
}