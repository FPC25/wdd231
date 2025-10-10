import { loadRecipes, getRecipesData } from './modules/recipe/recipe-data.mjs';
import { 
    displayRecipe, 
    displayRecipeImage, 
    displayCategories, 
    displayIngredients, 
    displayInstructions
} from './modules/recipe/recipe-renderer.mjs';
import { 
    setupActionButtons, 
    updateButtonStates, 
    onFavoritesChange 
} from './modules/recipe/recipe-favorites.mjs';
import { 
    setupEventListeners, 
    setupBottomNavigation, 
    setupScrollBehavior 
} from './modules/recipe/recipe-events.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    // Carregar receitas primeiro
    await loadRecipes();
    
    // Obter ID da receita da URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeIdParam = urlParams.get('id');
    
    // Manter como string para IDs da API (ex: "api_1001") ou converter para número se for numérico
    const recipeId = isNaN(parseInt(recipeIdParam)) ? recipeIdParam : parseInt(recipeIdParam);
    
    // Carregar e exibir receita
    await loadRecipeDetail(recipeId);
    
    // Configurar event listeners
    setupEventListeners(recipeId);
    
    // Configurar bottom navigation
    setupBottomNavigation();
    
    // Auto-hide bottom navigation on scroll
    setupScrollBehavior();
});

// Carrega e exibe os detalhes da receita
async function loadRecipeDetail(recipeId) {
    const recipes = getRecipesData();
    let recipe = recipes.find(r => r.id === recipeId);
    
    // Verificar se a receita foi encontrada
    if (!recipe) {
        console.error('Recipe not found with ID:', recipeId);
        showRecipeNotFound();
        return;
    }
    
    console.log('🔍 [RECIPE DETAIL] Loading recipe:', recipe.name, 'isApiRecipe:', recipe.isApiRecipe);
    
    // Se for uma receita da API, tentar buscar detalhes completos
    if (recipe.isApiRecipe && recipeId.toString().startsWith('api_')) {
        console.log('🌐 [RECIPE DETAIL] Fetching detailed API recipe...');
        
        try {
            const detailedRecipe = await getRecipeDetails(recipeId);
            
            if (detailedRecipe) {
                console.log('✅ [RECIPE DETAIL] Got detailed recipe:', detailedRecipe);
                // Preserve user interactions from original recipe
                recipe = {
                    ...detailedRecipe,
                    isFavorite: recipe.isFavorite,
                    isSaved: recipe.isSaved
                };
                console.log('📋 [RECIPE DETAIL] Using enhanced detailed recipe data');
            } else {
                console.log('ℹ️ [RECIPE DETAIL] Detailed fetch returned null, using existing search data');
            }
        } catch (error) {
            console.log('⚠️ [RECIPE DETAIL] Detailed fetch failed (expected with CORS), using existing data:', error.message);
        }
    } else {
        console.log('📋 [RECIPE DETAIL] Using local recipe data');
    }
    
    // Atualizar título da página
    document.getElementById('page-title').textContent = `${recipe.name} - Flavorfy`;
    
    // Exibir conteúdo da receita
    displayRecipe(recipe);
    
    // Configurar botões de gestão ANTES dos botões de ação
    // Isso é feito na função setupEventListeners que já foi chamada
    
    // Configurar botões de ação (favorite/save)
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

// Mostra mensagem de receita não encontrada
function showRecipeNotFound() {
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const recipeContent = document.getElementById('recipe-content');
    
    // Esconder loading e receita
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    if (recipeContent) {
        recipeContent.style.display = 'none';
    }
    
    // Mostrar erro
    if (errorState) {
        errorState.style.display = 'block';
        errorState.classList.add('show');
        errorState.innerHTML = `
            <div class="error-content">
                <h2>Recipe Not Found</h2>
                <p>The recipe you're looking for could not be found.</p>
                <button onclick="window.history.back()" class="error-button">Go Back</button>
            </div>
        `;
    } else {
        // Fallback se não houver elemento de erro
        document.body.innerHTML = `
            <div style="text-align: center; padding: 50px;">
                <h2>Recipe Not Found</h2>
                <p>The recipe you're looking for could not be found.</p>
                <button onclick="window.history.back()">Go Back</button>
            </div>
        `;
    }
}