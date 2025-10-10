// Spoonacular API Client - KISS Version
// Simple and direct API calls

const API_KEY = '66860e68188d417ca9ce3fdb7964b505';
const BASE_URL = 'https://api.spoonacular.com';

/**
 * Simple API call function
 */
async function apiCall(endpoint, params = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('apiKey', API_KEY);
    
    Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            url.searchParams.append(key, value);
        }
    });

    console.log(`API Call: ${url.toString()}`);
    
    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Get random recipes
 */
export async function getRandomRecipes(number = 30) {
    return await apiCall('/recipes/random', { number });
}

/**
 * Search recipes
 */
export async function searchRecipes(query, number = 10) {
    return await apiCall('/recipes/complexSearch', { 
        query, 
        number,
        addRecipeInformation: true 
    });
}

/**
 * Get recipe by ID
 */
export async function getRecipeInformation(id) {
    return await apiCall(`/recipes/${id}/information`);
}

/**
 * Simple localStorage management (1 day)
 */
const STORAGE_KEY = 'daily_recipes';
const ONE_DAY = 24 * 60 * 60 * 1000; // 1 day

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
        console.log('Recipes saved to localStorage and JSON backup');
    } catch (error) {
        console.warn('Could not save JSON backup:', error);
    }
}

/**
 * Get daily recipes from localStorage (1 day storage)
 */
export async function getDailyRecipes() {
    // Check if we have recipes and they're not expired
    if (!isRecipesExpired()) {
        console.log('Using recipes from localStorage');
        return { recipes: getRecipesFromStorage() };
    }
    
    console.log('Fetching new daily recipes (expired or not found)');
    const data = await getRandomRecipes(30);
    
    if (data.recipes && data.recipes.length > 0) {
        saveRecipesToStorage(data.recipes);
        console.log(`Saved ${data.recipes.length} recipes to localStorage for 1 day`);
    }
    
    return data;
}

/**
 * Convert Spoonacular recipe to our format
 */
export function convertSpoonacularRecipe(recipe) {
    return {
        id: recipe.id,
        name: recipe.title || 'Unknown Recipe',
        description: recipe.summary ? recipe.summary.replace(/<[^>]*>/g, '').substring(0, 200) + '...' : '',
        cover: recipe.image || './images/placeholder.svg',
        cookTime: { time: recipe.readyInMinutes || 30, unit: 'min' },
        serves: recipe.servings || 4,
        difficulty: 'medium',
        categories: recipe.dishTypes || [],
        ingredients: (recipe.extendedIngredients || []).map(ing => {
            // Use US measurements preferentially
            const usMeasure = ing.measures?.us;
            const amount = usMeasure?.amount || ing.amount || 1;
            const unitShort = usMeasure?.unitShort || ing.unit || 'serving';
            const unitLong = usMeasure?.unitLong || ing.unit || 'serving';
            
            // Check for serving conversions
            //const servingEquivalent = getServingEquivalent(ing.name, amount, unitShort);
            return {
                name: ing.name || ing.original,
                amount: amount,
                unit: unitShort.toLowerCase(),
                unitLong: unitLong.toLowerCase(),
                original: ing.original,
                //servingInfo: servingEquivalent // Additional serving context
            };
        }),
        
        instructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => step.step) || 
                    recipe.instructions?.split('.').filter(s => s.trim()) || 
                    ['Instructions not available'],
        source: {
            name: recipe.sourceName || 'Spoonacular',
            url: recipe.sourceUrl || recipe.spoonacularSourceUrl || null
        },
        isApiRecipe: true,
        isFavorite: false,
        isSaved: false
    };
}

/**
 * Helper function to handle serving conversions
 * Based on USDA dietary guidelines
 */
function getServingEquivalent(ingredient, amount, unit) {
    const servingConversions = {
        // Grains: 1 serving = 1 oz equivalent
        'rice': '0.5 cup cooked',
        'pasta': '0.5 cup cooked',
        'bread': '1 slice',
        'cereal': '1 cup flakes',
        
        // Vegetables: 1 serving = 1 cup equivalent
        'vegetables': '1 cup raw or ½ cup cooked',
        'salad': '2 cups leafy greens',
        
        // Fruits: 1 serving = 1 cup equivalent
        'fruit': '1 cup fresh or ½ cup juice',
        
        // Protein: 1 serving = 1 oz equivalent
        'meat': '1 oz cooked',
        'fish': '1 oz cooked',
        'egg': '1 large egg',
        'beans': '¼ cup cooked',
        'nuts': '½ oz',
        
        // Dairy: 1 serving = 1 cup equivalent
        'milk': '1 cup',
        'yogurt': '1 cup',
        'cheese': '1½ oz natural cheese'
    };
    
    if (unit === 'serving' || unit === 'servings') {
        // Try to find a better description
        const name = ingredient.toLowerCase();
        for (const [key, value] of Object.entries(servingConversions)) {
            if (name.includes(key)) {
                return `${amount} ${value}`;
            }
        }
        return `${amount} serving${amount > 1 ? 's' : ''}`;
    }
    
    return null;
}

/**
 * Clear localStorage (force new recipes)
 */
export function clearRecipes() {
    localStorage.removeItem(STORAGE_KEY);
    console.log('localStorage cleared - new recipes will be fetched');
}