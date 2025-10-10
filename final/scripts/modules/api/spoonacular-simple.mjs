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
 * Get daily recipes (just random recipes)
 */
export async function getDailyRecipes() {
    return await getRandomRecipes(30);
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
        categories: [...(recipe.dishTypes || []), ...(recipe.cuisines || [])],
        ingredients: (recipe.extendedIngredients || []).map(ing => ({
            name: ing.name || ing.original,
            amount: ing.amount || 1,
            unit: ing.unit || '',
            original: ing.original
        })),
        instructions: recipe.analyzedInstructions?.[0]?.steps?.map(step => step.step) || 
                    recipe.instructions?.split('.').filter(s => s.trim()) || 
                    ['Instructions not available'],
        isApiRecipe: true,
        isFavorite: false,
        isSaved: false
    };
}