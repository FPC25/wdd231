// Event handling functions for recipes

import { addIngredientRow, handleImageUpload, setupDifficultySelect } from './recipe-dom.mjs';
import { toggleFavorite, toggleSaved, onFavoritesChange } from './recipe-favorites.mjs';
import { getRecipesData } from './recipe-data.mjs';

// Adiciona event listeners aos botões de ação
export function addButtonListeners(container) {
    const actionButtons = container.querySelectorAll('.action-btn');
    const recipeCards = container.querySelectorAll('.recipe-card');
    
    // Event listeners para botões de ação
    actionButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const recipeId = parseInt(this.dataset.recipeId);
            const action = this.dataset.action;
            
            if (action === 'favorite') {
                toggleFavorite(recipeId);
            } else if (action === 'save') {
                toggleSaved(recipeId);
            }
        });
    });
    
    // Event listeners para clique no card (navegar para detalhes)
    recipeCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Verificar se o clique não foi em um botão de ação
            if (!e.target.closest('.action-btn')) {
                const recipeId = this.dataset.recipeId;
                window.location.href = `./recipe-detail.html?id=${recipeId}`;
            }
        });
        
        // Adicionar cursor pointer para indicar que é clicável
        card.style.cursor = 'pointer';
    });
}

// Adiciona todos os event listeners
export function addEventListeners() {
    document.getElementById('back-btn').addEventListener('click', () => {
        window.history.back();
    });
    
    // CORREÇÃO: Adicionar event listener para submissão do formulário
    const form = document.getElementById('recipe-form');
    if (form) {
        form.addEventListener('submit', window.handleFormSubmit);
    }
    
    // Event listener para botão de rascunho
    const saveDraftBtn = document.getElementById('save-draft-btn');
    if (saveDraftBtn) {
        saveDraftBtn.addEventListener('click', window.saveDraft);
    }
    
    document.getElementById('add-ingredient-btn').addEventListener('click', addIngredientRow);
    
    const imageInput = document.getElementById('cover-image');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
    
    setupDifficultySelect();
}

// Configura event listeners gerais
export function setupEventListeners(recipeId) {
    // Botão voltar
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
    
    // Listener para mudanças nos favoritos/salvos de outras páginas
    onFavoritesChange(() => {
        // Recarregar dados atualizados
        const recipes = getRecipesData();
        const recipe = recipes.find(r => r.id === recipeId);
        if (recipe) {
            updateButtonStates(recipe);
        }
    });
    
    // Listener para mudanças no localStorage de outras páginas
    window.addEventListener('storage', function(e) {
        if (e.key === 'flavorfy_favorites' || e.key === 'flavorfy_saved' || e.key === 'recipesData') {
            import('./recipe-data.mjs').then(module => {
                module.loadRecipes().then(() => {
                    const recipes = getRecipesData();
                    const recipe = recipes.find(r => r.id === recipeId);
                    if (recipe) {
                        updateButtonStates(recipe);
                    }
                });
            });
        }
    });
}

// Configura bottom navigation
export function setupBottomNavigation() {
    // Favoritos no bottom nav
    const favoritesNavItem = document.getElementById('favorites-nav');
    if (favoritesNavItem) {
        favoritesNavItem.addEventListener('click', function(e) {
            e.preventDefault();
            // Navegar para explore com filtro de favoritos
            window.location.href = './explore.html?filter=favorites';
        });
    }
    
    // Marcar item ativo se necessário
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    navItems.forEach(item => {
        // Nenhum item específico ativo na página de detalhes
        item.classList.remove('active');
    });
}

// Configura comportamento de scroll para o bottom nav
export function setupScrollBehavior() {
    let lastScrollTop = 0;
    const bottomNav = document.querySelector('.bottom-nav');
    
    if (!bottomNav) return;
    
    // Throttle function para melhor performance
    let isScrolling = false;
    
    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            requestAnimationFrame(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > lastScrollTop && scrollTop > 100) {
                    // Scrolling down - esconder navigation
                    bottomNav.classList.add('hidden');
                } else {
                    // Scrolling up - mostrar navigation
                    bottomNav.classList.remove('hidden');
                }
                
                lastScrollTop = scrollTop;
                isScrolling = false;
            });
            isScrolling = true;
        }
    });
}

// Helper function to update button states
function updateButtonStates(recipe) {
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
