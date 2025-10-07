import { SearchManager } from './modules/SearchManager.mjs';
import { RecipeManager } from './modules/RecipeManager.mjs';

let recipeManager;

document.addEventListener('DOMContentLoaded', async function() {
    // Get DOM elements
    const recipesGrid = document.querySelector('.recipe-grid');
    const bottomNav = document.querySelector('.bottom-nav');
    const categoryButtons = document.querySelectorAll('.category-btn');
    
    // Initialize managers
    recipeManager = new RecipeManager();
    try {
        await recipeManager.loadRecipes();
    } catch (error) {
        console.error('Failed to load recipes:', error);
        recipesGrid.innerHTML = '<p class="error-message">Failed to load recipes. Please refresh the page.</p>';
        return;
    }
    
    // Use SearchManager instead of duplicating search logic
    const searchManager = new SearchManager();
    
    // State management
    let lastScrollTop = 0;
    let scrollTimeout;
    let currentFilter = 'all';

    // Check URL parameters for search and filters
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search');
    const filterParam = urlParams.get('filter');
    
    console.log('URL search param:', searchParam);
    console.log('URL filter param:', filterParam);
    
    // Set initial search and filter from URL
    if (searchParam) {
        searchManager.performSearch(searchParam);
        console.log('Search set from URL:', searchParam);
    }
    
    if (filterParam === 'favorites') {
        currentFilter = 'favorites';
        categoryButtons.forEach(btn => btn.classList.remove('active'));
        const favButton = document.querySelector('[data-category="favorites"]');
        if (favButton) favButton.classList.add('active');
    }

    // Listen to search changes
    searchManager.onSearchChange((searchTerm) => {
        renderCurrentView();
    });

    // Initial render with URL parameters
    renderCurrentView();

    // Auto-hide bottom navigation on scroll (MANTER - funciona bem)
    function throttle(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function handleScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        clearTimeout(scrollTimeout);
        
        if (currentScroll <= 0) {
            bottomNav.classList.remove('hidden');
            lastScrollTop = 0;
            return;
        }
        
        if (currentScroll > lastScrollTop) {
            bottomNav.classList.add('hidden');
        } else if (currentScroll < lastScrollTop) {
            bottomNav.classList.remove('hidden');
        }
        
        lastScrollTop = currentScroll;
        
        if (bottomNav.classList.contains('hidden')) {
            scrollTimeout = setTimeout(() => {
                bottomNav.classList.remove('hidden');
            }, 2000);
        }
    }

    window.addEventListener('scroll', throttle(handleScroll, 100));

    // Unified render function (CORRIGIR apenas as chamadas)
    function renderCurrentView() {
        const currentSearch = searchManager.getCurrentSearch();
        let recipes;
        
        console.log('Rendering with search:', currentSearch, 'and filter:', currentFilter);
        
        // ✅ USAR RecipeManager em vez de RecipeUtils
        if (currentFilter === 'favorites') {
            recipes = recipeManager.getRecipes('favorites', currentSearch);
        } else if (currentFilter === 'all') {
            recipes = recipeManager.getRecipes('all', currentSearch);
        } else {
            // ✅ USAR getRecipes com filtro customizado em vez de filterRecipesByCategory
            const allRecipes = recipeManager.getRecipes('all', currentSearch);
            recipes = allRecipes.filter(recipe => 
                recipe.filters && recipe.filters.some(filter => 
                    filter.toLowerCase() === currentFilter.toLowerCase()
                )
            );
        }
        
        console.log('Found recipes:', recipes.length);
        console.log('Recipes data:', recipes);
        
        // Custom message based on search/filter state
        let emptyMessage = 'No recipes found.';
        if (currentSearch && currentFilter !== 'all') {
            emptyMessage = `No recipes found in "${currentFilter}" for "${currentSearch}".`;
        } else if (currentSearch) {
            emptyMessage = `No recipes found for "${currentSearch}".`;
        } else if (currentFilter === 'favorites') {
            emptyMessage = 'No favorite recipes yet. Start exploring and add some favorites!';
        }
        
        // ✅ USAR RecipeManager para renderizar
        recipeManager.renderRecipes(recipes, recipesGrid, 'library');
        
        // Handle empty state
        if (recipes.length === 0) {
            recipesGrid.innerHTML = `<p class="empty-message">${emptyMessage}</p>`;
        }
        
        // Se há busca ativa, remover seleção de categoria
        if (currentSearch) {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
        }
    }

    // Category button functionality (MANTER - funciona bem)
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.dataset.category;
            
            // Limpar busca quando selecionar categoria
            searchManager.clearSearch();
            
            renderCurrentView();
        });
    });

    // Bottom navigation - favorites filter (MANTER - funciona bem)
    const favoritesNavItem = document.querySelector('.bottom-nav .nav-item[href="#"]');
    if (favoritesNavItem) {
        favoritesNavItem.addEventListener('click', function(e) {
            e.preventDefault();
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            currentFilter = 'favorites';
            
            // Limpar busca quando clicar em favoritos
            searchManager.clearSearch();
            
            renderCurrentView();
        });
    }
});

