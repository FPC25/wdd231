import { loadRecipes, getRecipesData } from './modules/recipe-data.mjs';
import { 
    displayRecipe, 
    displayRecipeImage, 
    displayCategories, 
    displayIngredients, 
    displayInstructions
} from './modules/recipe-renderer.mjs';
import { 
    setupActionButtons, 
    updateButtonStates, 
    onFavoritesChange 
} from './modules/recipe-favorites.mjs';
import { 
    setupEventListeners, 
    setupBottomNavigation, 
    setupScrollBehavior 
} from './modules/recipe-events.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    // Carregar receitas primeiro
    await loadRecipes();
    
    // Obter ID da receita da URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = parseInt(urlParams.get('id'));
    
    if (!recipeId) {
        showError();
        return;
    }
    
    // Carregar e exibir receita
    loadRecipeDetail(recipeId);
    
    // Configurar event listeners
    setupEventListeners(recipeId);
    
    // Configurar bottom navigation
    setupBottomNavigation();
    
    // Auto-hide bottom navigation on scroll
    setupScrollBehavior();
});

// Carrega e exibe os detalhes da receita
function loadRecipeDetail(recipeId) {
    const recipes = getRecipesData();
    const recipe = recipes.find(r => r.id === recipeId);
    
    if (!recipe) {
        showError();
        return;
    }
    
    // Atualizar título da página
    document.getElementById('page-title').textContent = `${recipe.name} - Flavorfy`;
    
    // Exibir conteúdo da receita
    displayRecipe(recipe);
    
    // Configurar botões de ação
    setupActionButtons(recipe);
    
    // Esconder loading e mostrar conteúdo
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const recipeContent = document.getElementById('recipe-content');
    
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    if (errorState) {
        errorState.classList.remove('show');
        errorState.style.display = 'none';
    }
    if (recipeContent) {
        recipeContent.style.display = 'block';
        recipeContent.classList.add('show');
    }
}

// Função auxiliar para debug
function debugRecipeData(recipe) {
    console.log('Recipe data:', {
        id: recipe.id,
        name: recipe.name,
        hasIngredients: recipe.ingredients && recipe.ingredients.length > 0,
        hasInstructions: recipe.instructions && recipe.instructions.length > 0,
        hasFilters: recipe.filters && recipe.filters.length > 0,
        isSaved: recipe.isSaved,
        isFavorite: recipe.isFavorite,
        hasValidImage: recipe.cover && recipe.cover !== "image" && !recipe.cover.includes('placeholder.svg')
    });
}