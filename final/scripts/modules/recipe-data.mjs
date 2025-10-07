// Data management for recipes

let recipesData = [];
let updateCallbacks = [];

// Carrega receitas do localStorage ou JSON inicial
export async function loadRecipes() {
    try {
        const localStorageRecipes = localStorage.getItem('recipesData');
        
        if (localStorageRecipes) {
            recipesData = JSON.parse(localStorageRecipes);
        } else {
            const response = await fetch('./scripts/recipes.json');
            if (!response.ok) throw new Error('Failed to load recipes');
            recipesData = await response.json();
            localStorage.setItem('recipesData', JSON.stringify(recipesData));
        }
        
        initializeUserDataFromServer();
        applyLocalStorageChanges();
        localStorage.setItem('recipesData', JSON.stringify(recipesData));
        
    } catch (error) {
        console.error('Error loading recipes:', error);
        recipesData = [];
    }
}

// Registra callback para mudanças nos favoritos
export function onFavoritesChange(callback) {
    updateCallbacks.push(callback);
}

// Notifica todos os callbacks registrados
export function notifyFavoritesChange() {
    updateCallbacks.forEach(callback => callback());
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
    
    recipesData.forEach(recipe => {
        const isFavorite = favorites.includes(recipe.id);
        const isSaved = saved.includes(recipe.id);
        
        recipe.isFavorite = isFavorite;
        recipe.isSaved = isSaved || isFavorite;
    });
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
    return recipesData;
}

// Filtra receitas por critério
export function filterRecipes(criteria, searchTerm = '') {
    let filtered = [];
    
    switch (criteria) {
        case 'favorites':
            filtered = recipesData.filter(recipe => recipe.isFavorite === true);
            break;
        case 'saved':
            filtered = recipesData.filter(recipe => recipe.isSaved === true);
            break;
        case 'all':
        default:
            filtered = recipesData;
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
        totalRecipes: recipesData.length,
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
}

// Sincroniza dados do usuário com servidor (implementação futura)
export function syncUserDataToServer() {
    console.log('Syncing user data to server...');
}
