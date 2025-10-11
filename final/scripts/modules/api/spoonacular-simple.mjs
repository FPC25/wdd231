const API_KEY = '66860e68188d417ca9ce3fdb7964b505';
const BASE_URL = 'https://api.spoonacular.com';

// Basic API fetch function
async function fetchFromAPI(endpoint, params = {}) {
    const url = new URL(endpoint, BASE_URL);
    url.searchParams.append('apiKey', API_KEY);
    
    for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, value);
    }
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
}

// Get random recipes from API
export async function getRandomRecipes(number = 30) {
    return await fetchFromAPI('/recipes/random', { number });
}

// Search for recipes by query
export async function searchRecipes(query, number = 10) {
    return await fetchFromAPI('/recipes/complexSearch', { 
        query, 
        number,
        addRecipeInformation: true 
    });
}

// Get detailed recipe information
export async function getRecipeInformation(id) {
    return await fetchFromAPI(`/recipes/${id}/information`);
}

// LocalStorage management for caching recipes
const STORAGE_KEY = 'daily_recipes';
const ONE_DAY = 24 * 60 * 60 * 1000; // cache for one day

function isRecipesExpired() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return true;
    
    const data = JSON.parse(stored);
    const now = Date.now();
    return (now - data.saved) > ONE_DAY;
}

function saveRecipesToStorage(recipes) {
    const data = {
        recipes: recipes,
        saved: Date.now()
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    
    // Also save to JSON file
    saveToJsonFile(data);
}

function getRecipesFromStorage() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    
    const data = JSON.parse(stored);
    return data.recipes;
}

function saveToJsonFile(data) {
    try {
        const jsonData = JSON.stringify(data, null, 2);
    } catch (error) {
        console.warn('Could not save JSON backup:', error);
    }
}

// Get daily recipes with localStorage caching
export async function getDailyRecipes() {
    // Check if we have recipes and they're not expired
    if (!isRecipesExpired()) {
        return { recipes: getRecipesFromStorage() };
    }
    
    const data = await getRandomRecipes(30);
    
    if (data.recipes && data.recipes.length > 0) {
        saveRecipesToStorage(data.recipes);
    }
    
    return data;
}

// Map API categories to local app categories
function mapCategoriesToLocal(apiCategories) {
    const localCategories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack'];
    const mapped = [];
    
    if (!apiCategories || !Array.isArray(apiCategories)) {
        return [];
    }
    
    apiCategories.forEach(category => {
        const categoryLower = category.toLowerCase();
        
        // Map to local categories
        if (categoryLower.includes('breakfast') || categoryLower.includes('brunch') || 
            categoryLower.includes('morning')) {
            if (!mapped.includes('Breakfast')) mapped.push('Breakfast');
        }
        
        if (categoryLower.includes('lunch') || categoryLower.includes('salad') || 
            categoryLower.includes('sandwich')) {
            if (!mapped.includes('Lunch')) mapped.push('Lunch');
        }
        
        if (categoryLower.includes('dinner') || categoryLower.includes('main course') || 
            categoryLower.includes('entre') || categoryLower.includes('main') ||
            categoryLower.includes('supper')) {
            if (!mapped.includes('Dinner')) mapped.push('Dinner');
        }
        
        if (categoryLower.includes('dessert') || categoryLower.includes('sweet') || 
            categoryLower.includes('cake') || categoryLower.includes('cookie') ||
            categoryLower.includes('pie') || categoryLower.includes('ice cream')) {
            if (!mapped.includes('Dessert')) mapped.push('Dessert');
        }
        
        if (categoryLower.includes('snack') || categoryLower.includes('appetizer') || 
            categoryLower.includes('finger food') || categoryLower.includes('hors')) {
            if (!mapped.includes('Snack')) mapped.push('Snack');
        }
    });
    
    // Default fallback if no categories match
    if (mapped.length === 0) {
        mapped.push('Lunch');
    }
    
    return mapped;
}

// Convert API recipe to app format
export function convertSpoonacularRecipe(recipe) {
    const mappedCategories = mapCategoriesToLocal(recipe.dishTypes);

    const result = {
        id: recipe.id,
        name: recipe.title || 'Unknown Recipe',
        description: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '',
        cover: recipe.image || 'https://fpc25.github.io/wdd231/final/images/placeholder.svg',
        cookTime: { time: recipe.readyInMinutes || 30, unit: 'min' },
        serves: recipe.servings || 4,
        difficulty: 'medium',
        categories: mappedCategories,
        filters: mappedCategories,
        
        // Use extendedIngredients format to match local JSON structure
        extendedIngredients: (recipe.extendedIngredients || []).map(ing => {
            const metricMeasure = ing.measures?.metric;
            const usMeasure = ing.measures?.us;
            
            return {
                name: ing.name || ing.original,
                original: ing.original,
                measures: {
                    us: {
                        amount: usMeasure?.amount || ing.amount || 1,
                        unitShort: usMeasure?.unitShort || 'piece',
                        unitLong: usMeasure?.unitLong || 'piece'
                    },
                    metric: {
                        amount: metricMeasure?.amount || ing.amount || 1,
                        unitShort: metricMeasure?.unitShort || 'piece',
                        unitLong: metricMeasure?.unitLong || 'piece'
                    }
                }
            };
        }),
        
        // Keep backward compatibility - create ingredients array for calculator
        ingredients: (recipe.extendedIngredients || []).map(ing => {
            const metricMeasure = ing.measures?.metric;
            const amount = metricMeasure?.amount || ing.amount || 1;
            const unitShort = metricMeasure?.unitShort || 'piece';
            const unitLong = metricMeasure?.unitLong || 'piece';
            
            return {
                name: ing.name || ing.original,
                amount: amount,
                unit: unitShort.toLowerCase(),
                unitLong: unitLong.toLowerCase(),
                original: ing.original,
                // Calculator compatibility
                quantity: amount,
                item: ing.name || ing.original
            };
        }),
        
        instructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => step.step) || 
                    recipe.instructions?.split('.').filter(s => s.trim()) || 
                    ['Instructions not available'],
        source: {
            // Primary source name with fallback
            name: recipe.creditsText || recipe.sourceName || 'Spoonacular',
            url: recipe.sourceUrl || recipe.spoonacularSourceUrl || null
        },
        isApiRecipe: true,
        isFavorite: false,
        isSaved: false
    };

    return result;
}

// Clear recipe cache
export function clearRecipes() {
    localStorage.removeItem(STORAGE_KEY);
}