// Favorites and saved recipes management

import { getRecipesData, getFavoritesFromStorage, getSavedFromStorage, saveFavoritesToStorage, saveSavedToStorage } from './recipe-data.mjs';
import { updateAllButtons } from './recipe-dom.mjs';

let updateCallbacks = [];

// Alterna status de favorito
export function toggleFavorite(recipeId) {
    const recipesData = getRecipesData();
    recipeId = parseInt(recipeId);
    const recipe = recipesData.find(r => r.id === recipeId);
    
    if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
        
        const favorites = getFavoritesFromStorage();
        const saved = getSavedFromStorage();
        
        if (recipe.isFavorite) {
            if (!favorites.includes(recipeId)) {
                favorites.push(recipeId);
            }
            if (!saved.includes(recipeId)) {
                saved.push(recipeId);
            }
            recipe.isSaved = true;
        } else {
            const favIndex = favorites.indexOf(recipeId);
            if (favIndex > -1) {
                favorites.splice(favIndex, 1);
            }
        }
        
        saveFavoritesToStorage(favorites);
        saveSavedToStorage(saved);
        
        updateAllButtons(recipeId, recipe.isFavorite, recipe.isSaved);
        notifyFavoritesChange();
        
        return recipe.isFavorite;
    }
    return false;
}

// Alterna status de salvo
export function toggleSaved(recipeId) {
    const recipesData = getRecipesData();
    recipeId = parseInt(recipeId);
    const recipe = recipesData.find(r => r.id === recipeId);
    
    if (recipe) {
        const wasOriginallyFavorite = recipe.isFavorite;
        recipe.isSaved = !recipe.isSaved;
        
        if (!recipe.isSaved && wasOriginallyFavorite) {
            recipe.isFavorite = false;
        }
        
        const favorites = getFavoritesFromStorage();
        const saved = getSavedFromStorage();
        
        if (recipe.isSaved) {
            if (!saved.includes(recipeId)) {
                saved.push(recipeId);
            }
        } else {
            const savedIndex = saved.indexOf(recipeId);
            if (savedIndex > -1) {
                saved.splice(savedIndex, 1);
            }
            
            if (wasOriginallyFavorite) {
                const favIndex = favorites.indexOf(recipeId);
                if (favIndex > -1) {
                    favorites.splice(favIndex, 1);
                }
            }
        }
        
        saveFavoritesToStorage(favorites);
        saveSavedToStorage(saved);
        
        updateAllButtons(recipeId, recipe.isFavorite, recipe.isSaved);
        notifyFavoritesChange();
        
        return recipe.isSaved;
    }
    return false;
}

// Registra callback para mudanças nos favoritos
export function onFavoritesChange(callback) {
    updateCallbacks.push(callback);
}

// Notifica todos os callbacks registrados
export function notifyFavoritesChange() {
    updateCallbacks.forEach(callback => callback());
}

// Configura os botões de ação (favorito, salvar e calcular)
export function setupActionButtons(recipe) {
    const favoriteBtn = document.getElementById('favorite-btn');
    const saveBtn = document.getElementById('save-btn');
    const calculateBtn = document.getElementById('calculate-btn');
    
    if (!favoriteBtn || !saveBtn || !calculateBtn) {
        console.error('Action buttons not found in DOM');
        return;
    }
    
    // Estado inicial dos botões
    updateButtonStates(recipe);
    
    // Event listeners
    favoriteBtn.addEventListener('click', function() {
        const newState = toggleFavorite(recipe.id);
        recipe.isFavorite = newState;
        updateButtonStates(recipe);
    });
    
    saveBtn.addEventListener('click', function() {
        const newState = toggleSaved(recipe.id);
        recipe.isSaved = newState;
        updateButtonStates(recipe);
    });
    
    // Botão de calcular custos - redireciona para calculadora
    calculateBtn.addEventListener('click', function() {
        if (recipe.isSaved) {
            window.location.href = `./calculator.html?recipe=${recipe.id}`;
        } else {
            // Se a receita não está salva, salvar primeiro
            toggleSaved(recipe.id);
            recipe.isSaved = true;
            updateButtonStates(recipe);
            
            setTimeout(() => {
                window.location.href = `./calculator.html?recipe=${recipe.id}`;
            }, 300);
        }
    });
}

// Atualiza o estado visual dos botões
export function updateButtonStates(recipe) {
    const favoriteBtn = document.getElementById('favorite-btn');
    const saveBtn = document.getElementById('save-btn');
    
    if (!favoriteBtn || !saveBtn) return;
    
    // Botão de favorito
    favoriteBtn.classList.toggle('active', recipe.isFavorite);
    
    // Botão de salvar
    saveBtn.classList.toggle('active', recipe.isSaved);
    const saveImg = saveBtn.querySelector('img');
    if (saveImg) {
        if (recipe.isSaved) {
            saveImg.src = './images/check.svg';
            saveImg.alt = 'Saved';
        } else {
            saveImg.src = './images/plus.svg';
            saveImg.alt = 'Save';
        }
    }
}

// Função auxiliar para gerenciar localStorage diretamente
export function manageLocalStorageDirectly(recipeData) {
    // Gerenciar favoritos
    const favorites = JSON.parse(localStorage.getItem('flavorfy_favorites') || '[]');
    if (recipeData.isFavorite && !favorites.includes(recipeData.id)) {
        favorites.push(recipeData.id);
    }
    localStorage.setItem('flavorfy_favorites', JSON.stringify(favorites));
    
    // Gerenciar salvos - SEMPRE adicionar receitas criadas pelo usuário
    const saved = JSON.parse(localStorage.getItem('flavorfy_saved') || '[]');
    if (!saved.includes(recipeData.id)) {
        saved.push(recipeData.id);
    }
    localStorage.setItem('flavorfy_saved', JSON.stringify(saved));
    
}
