// Data management for recipes

import { getDailyRecipes, searchRecipes } from './api-client.mjs';

let recipesData = [];
let apiRecipes = [];
let updateCallbacks = [];

// Carrega receitas do localStorage ou JSON inicial
export async function loadRecipes() {
    try {
        const localStorageRecipes = localStorage.getItem('recipesData');
        
        if (localStorageRecipes) {
            recipesData = JSON.parse(localStorageRecipes);
        } else {
            const response = await fetch('./data/recipes.json');
            if (!response.ok) throw new Error('Failed to load recipes');
            recipesData = await response.json();
            localStorage.setItem('recipesData', JSON.stringify(recipesData));
        }
        
        // Load daily API recipes
        apiRecipes = await getDailyRecipes();
        
        initializeUserDataFromServer();
        applyLocalStorageChanges();
        localStorage.setItem('recipesData', JSON.stringify(recipesData));
        
    } catch (error) {
        console.error('Error loading recipes:', error);
        recipesData = [];
        apiRecipes = [];
    }
}

// Registra callback para mudanças nos favoritos
export function onFavoritesChange(callback) {
    updateCallbacks.push(callback);
}

// Notifica todos os callbacks registrados
export function notifyFavoritesChange() {
    // Garantir que os dados estejam atualizados antes de notificar
    applyLocalStorageChanges();
    
    // Notificar todos os callbacks
    updateCallbacks.forEach(callback => {
        try {
            callback();
        } catch (error) {
            console.error('Error in callback:', error);
        }
    });
    
    // Dispatch custom event for cross-page communication
    window.dispatchEvent(new CustomEvent('flavorfy-data-changed'));
}

// Inicializa dados do usuário na primeira execução
export function initializeUserDataFromServer() {
    const hasUserData = localStorage.getItem('flavorfy_favorites') || localStorage.getItem('flavorfy_saved');
    
    if (!hasUserData) {
        const serverFavorites = recipesData.filter(recipe => recipe.isFavorite).map(recipe => recipe.id);
        const serverSaved = recipesData.filter(recipe => recipe.isSaved).map(recipe => recipe.id);
        
        saveFavoritesToStorage(serverFavorites);
        saveSavedToStorage(serverSaved);
    }
}

// Aplica mudanças do localStorage aos dados das receitas
export function applyLocalStorageChanges() {
    const favorites = getFavoritesFromStorage();
    const saved = getSavedFromStorage();
    
    // Apply to local recipes
    recipesData.forEach(recipe => {
        const isFavorite = favorites.some(id => id == recipe.id);
        const isSaved = saved.some(id => id == recipe.id);
        
        recipe.isFavorite = isFavorite;
        recipe.isSaved = isSaved;
        
        if (recipe.isFavorite && !recipe.isSaved) {
            recipe.isSaved = true;
        }
    });
    
    // Apply to API recipes
    apiRecipes.forEach(recipe => {
        const isFavorite = favorites.some(id => id == recipe.id);
        const isSaved = saved.some(id => id == recipe.id);
        
        recipe.isFavorite = isFavorite;
        recipe.isSaved = isSaved;
        
        if (recipe.isFavorite && !recipe.isSaved) {
            recipe.isSaved = true;
        }
    });
    
    // Ensure business rules consistency
    enforceBusinessRules();
}

/**
 * Enforce business rules for favorites and saved recipes
 * Rule: Favorites must be saved, but saved doesn't have to be favorite
 */
function enforceBusinessRules() {
    let favoritesChanged = false;
    let savedChanged = false;
    
    const favorites = getFavoritesFromStorage();
    const saved = getSavedFromStorage();
    
    // Check local recipes
    recipesData.forEach(recipe => {
        if (recipe.isFavorite && !recipe.isSaved) {
            recipe.isSaved = true;
            if (!saved.some(id => id == recipe.id)) {
                saved.push(recipe.id);
                savedChanged = true;
            }
        }
        
        if (!recipe.isSaved && recipe.isFavorite) {
            recipe.isFavorite = false;
            const indexesToRemove = [];
            favorites.forEach((id, index) => {
                if (id == recipe.id) indexesToRemove.push(index);
            });
            indexesToRemove.reverse().forEach(index => favorites.splice(index, 1));
            favoritesChanged = true;
        }
    });
    
    // Check API recipes
    apiRecipes.forEach(recipe => {
        if (recipe.isFavorite && !recipe.isSaved) {
            recipe.isSaved = true;
            if (!saved.some(id => id == recipe.id)) {
                saved.push(recipe.id);
                savedChanged = true;
            }
        }
        
        if (!recipe.isSaved && recipe.isFavorite) {
            recipe.isFavorite = false;
            const indexesToRemove = [];
            favorites.forEach((id, index) => {
                if (id == recipe.id) indexesToRemove.push(index);
            });
            indexesToRemove.reverse().forEach(index => favorites.splice(index, 1));
            favoritesChanged = true;
        }
    });
    
    // Update storage if changes were made
    if (favoritesChanged) {
        saveFavoritesToStorage(favorites);
    }
    if (savedChanged) {
        saveSavedToStorage(saved);
    }
}

// Obtém favoritos do localStorage
export function getFavoritesFromStorage() {
    const favorites = localStorage.getItem('flavorfy_favorites');
    return favorites ? JSON.parse(favorites) : [];
}

// Obtém receitas salvas do localStorage
export function getSavedFromStorage() {
    const saved = localStorage.getItem('flavorfy_saved');
    return saved ? JSON.parse(saved) : [];
}

// Salva favoritos no localStorage
export function saveFavoritesToStorage(favorites) {
    localStorage.setItem('flavorfy_favorites', JSON.stringify(favorites));
}

// Salva receitas no localStorage
export function saveSavedToStorage(saved) {
    localStorage.setItem('flavorfy_saved', JSON.stringify(saved));
}

// Obtém dados atualizados das receitas
export function getRecipesData() {
    const localStorageRecipes = localStorage.getItem('recipesData');
    if (localStorageRecipes) {
        recipesData = JSON.parse(localStorageRecipes);
        applyLocalStorageChanges();
    }
    // Combine local and API recipes
    return [...recipesData, ...apiRecipes];
}

// Filtra receitas por critério
export function filterRecipes(criteria, searchTerm = '') {
    let allRecipes = [...recipesData, ...apiRecipes];
    let filtered = [];
    
    switch (criteria) {
        case 'favorites':
            filtered = allRecipes.filter(recipe => recipe.isFavorite === true);
            break;
        case 'saved':
            filtered = allRecipes.filter(recipe => recipe.isSaved === true);
            break;
        case 'all':
        default:
            filtered = allRecipes;
    }
    
    if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter(recipe => {
            const nameMatch = recipe.name.toLowerCase().includes(searchLower);
            const ingredientMatch = recipe.ingredients && recipe.ingredients.some(ingredient => 
                ingredient.item && ingredient.item.toLowerCase().includes(searchLower)
            );
            const filterMatch = recipe.filters && recipe.filters.some(filter =>
                filter.toLowerCase().includes(searchLower)
            );
            
            return nameMatch || ingredientMatch || filterMatch;
        });
    }
    
    return filtered;
}

// Obtém estatísticas do usuário
export function getUserStats() {
    const favorites = getFavoritesFromStorage();
    const saved = getSavedFromStorage();
    
    return {
        totalRecipes: recipesData.length + apiRecipes.length,
        favoriteCount: favorites.length,
        savedCount: saved.length,
        deviceId: getDeviceId()
    };
}

// Gera ID único do dispositivo
export function getDeviceId() {
    let deviceId = localStorage.getItem('flavorfy_device_id');
    if (!deviceId) {
        deviceId = 'device_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        localStorage.setItem('flavorfy_device_id', deviceId);
    }
    return deviceId;
}

// Reseta dados do usuário
export function resetUserData() {
    localStorage.removeItem('flavorfy_favorites');
    localStorage.removeItem('flavorfy_saved');
    localStorage.removeItem('recipesData');
    
    recipesData.forEach(recipe => {
        recipe.isFavorite = false;
        recipe.isSaved = false;
    });
    
    apiRecipes.forEach(recipe => {
        recipe.isFavorite = false;
        recipe.isSaved = false;
    });
}

// Busca receitas na API
export async function searchApiRecipes(searchTerm) {
    try {
        const results = await searchRecipes(searchTerm);
        return results;
    } catch (error) {
        console.error('Error searching API recipes:', error);
        return [];
    }
}

// Sincroniza dados do usuário com servidor (implementação futura)
export function syncUserDataToServer() {
    return 
}
