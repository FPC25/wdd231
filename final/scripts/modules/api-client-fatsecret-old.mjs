// API client for FatSecret Platform API
// KISS implementation with URL-based requests

let dailyRecipes = [];
let lastFetchDate = null;

// FatSecret API credentials
const API_CONFIG = {
    clientId: '630ab4e919a043e2a023510bc0d70d3a',
    clientSecret: '04abd6c58d0e4c2f8a8e320b953dc744',
    baseUrl: 'https://platform.fatsecret.com/rest',
    accessToken: null
};

// Fallback recipes data
const FALLBACK_RECIPES = [
    {
        recipe_id: "1001",
        recipe_name: "Grilled Chicken Breast",
        recipe_description: "Tender grilled chicken breast with herbs",
        recipe_image: "https://images.unsplash.com/photo-1532636054994-587b76bc9f3e?w=400",
        recipe_ingredients: { ingredient: ["Chicken breast", "Olive oil", "Garlic", "Rosemary"] },
        recipe_types: { recipe_type: ["Main Dish"] },
        recipe_nutrition: { calories: "231", protein: "43.5", carbohydrate: "0", fat: "5.0" }
    },
    {
        recipe_id: "1002", 
        recipe_name: "Mediterranean Quinoa Salad",
        recipe_description: "Fresh quinoa salad with Mediterranean flavors",
        recipe_image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        recipe_ingredients: { ingredient: ["Quinoa", "Cucumber", "Tomatoes", "Feta cheese"] },
        recipe_types: { recipe_type: ["Side Dish"] },
        recipe_nutrition: { calories: "285", protein: "12.0", carbohydrate: "39.0", fat: "10.5" }
    },
    {
        recipe_id: "1003",
        recipe_name: "Blueberry Pancakes", 
        recipe_description: "Fluffy pancakes with fresh blueberries",
        recipe_image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        recipe_ingredients: { ingredient: ["Flour", "Milk", "Eggs", "Blueberries"] },
        recipe_types: { recipe_type: ["Breakfast"] },
        recipe_nutrition: { calories: "342", protein: "8.5", carbohydrate: "52.0", fat: "12.0" }
    },
    {
        recipe_id: "1004",
        recipe_name: "Beef Tacos",
        recipe_description: "Savory ground beef tacos with fresh toppings", 
        recipe_image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        recipe_ingredients: { ingredient: ["Ground beef", "Taco shells", "Lettuce", "Cheese"] },
        recipe_types: { recipe_type: ["Main Dish"] },
        recipe_nutrition: { calories: "356", protein: "22.0", carbohydrate: "28.0", fat: "18.0" }
    },
    {
        recipe_id: "1005",
        recipe_name: "Caesar Salad",
        recipe_description: "Classic Caesar salad with crispy croutons",
        recipe_image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400", 
        recipe_ingredients: { ingredient: ["Romaine lettuce", "Parmesan", "Croutons", "Caesar dressing"] },
        recipe_types: { recipe_type: ["Side Dish"] },
        recipe_nutrition: { calories: "189", protein: "7.5", carbohydrate: "12.0", fat: "14.0" }
    }
];

// Get OAuth2 access token
async function getAccessToken() {
    console.log('Getting access token...');
    
    try {
        const response = await fetch('https://oauth.fatsecret.com/connect/token', {
            method: 'POST',
            mode: 'cors',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${btoa(`${API_CONFIG.clientId}:${API_CONFIG.clientSecret}`)}`
            },
            body: 'grant_type=client_credentials&scope=premier'
        });

        if (response.ok) {
            const data = await response.json();
            API_CONFIG.accessToken = data.access_token;
            console.log('Access token obtained');
            return true;
        }
    } catch (error) {
        console.log('Token fetch failed (CORS), using fallback');
    }
    
    return false;
}

// Make API request to FatSecret (URL-based)
async function makeApiRequest(endpoint, params = {}) {
    if (!API_CONFIG.accessToken) {
        const tokenObtained = await getAccessToken();
        if (!tokenObtained) {
            throw new Error('CORS_ERROR');
        }
    }

    const url = new URL(`${API_CONFIG.baseUrl}/${endpoint}`);
    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });

    const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Authorization': `Bearer ${API_CONFIG.accessToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
}

// Search recipes using API
async function searchRecipesFromAPI(query, maxResults = 50) {
    try {
        console.log(`Searching API for: ${query}`);
        
        const data = await makeApiRequest('recipes/search/v1', {
            search_expression: query,
            max_results: maxResults,
            format: 'json'
        });

        if (data.recipes && data.recipes.recipe) {
            const recipes = Array.isArray(data.recipes.recipe) ? 
                data.recipes.recipe : [data.recipes.recipe];
            
            console.log(`Found ${recipes.length} recipes from API`);
            return recipes.map(adaptFatSecretToOurFormat);
        }
        
        return [];
    } catch (error) {
        console.log('API search failed, using fallback');
        throw new Error('CORS_ERROR');
    }
}

// Get recipe by ID from API
async function getRecipeById(id) {
    try {
        console.log(`Getting recipe ${id} from API`);
        
        const data = await makeApiRequest('recipe/v4', {
            recipe_id: id,
            format: 'json'
        });

        if (data.recipe) {
            console.log('Recipe found in API');
            return adaptDetailedFatSecretToOurFormat(data.recipe);
        }
        
        return null;
    } catch (error) {
        console.log('API recipe fetch failed, using fallback');
        const fallbackRecipe = FALLBACK_RECIPES.find(r => r.recipe_id === id);
        return fallbackRecipe || null;
    }
}

// Adapt FatSecret API format to our format (search results)
function adaptFatSecretToOurFormat(recipe) {
    return {
        id: recipe.recipe_id,
        name: recipe.recipe_name,
        description: recipe.recipe_description || "Delicious recipe",
        image: recipe.recipe_image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        cover: recipe.recipe_image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        ingredients: recipe.recipe_ingredients?.ingredient || [],
        type: recipe.recipe_types?.recipe_type?.[0] || "Main Dish",
        difficulty: 'Medium',
        prepTime: '30',
        cookTime: '30 min',
        nutrition: recipe.recipe_nutrition || { calories: "200", protein: "10", carbohydrate: "20", fat: "8" },
        isApiRecipe: true
    };
}

// Adapt detailed FatSecret API format
function adaptDetailedFatSecretToOurFormat(recipe) {
    return {
        id: recipe.recipe_id,
        name: recipe.recipe_name,
        description: recipe.recipe_description || "Delicious recipe",
        image: recipe.recipe_image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        cover: recipe.recipe_image || "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        ingredients: Array.isArray(recipe.recipe_ingredients?.ingredient) ? 
            recipe.recipe_ingredients.ingredient : 
            (recipe.recipe_ingredients?.ingredient ? [recipe.recipe_ingredients.ingredient] : []),
        instructions: Array.isArray(recipe.recipe_instructions?.instruction) ?
            recipe.recipe_instructions.instruction :
            (recipe.recipe_instructions?.instruction ? [recipe.recipe_instructions.instruction] : []),
        type: recipe.recipe_types?.recipe_type?.[0] || "Main Dish",
        difficulty: 'Medium',
        nutrition: recipe.recipe_nutrition || { calories: "200", protein: "10", carbohydrate: "20", fat: "8" },
        servings: recipe.number_of_servings || "4",
        prepTime: recipe.preparation_time_min || "30",
        cookTime: `${recipe.cooking_time_min || "30"} min`,
        isApiRecipe: true
    };
}

// Check if we need to fetch new daily recipes
function shouldFetchNewRecipes() {
    const today = new Date().toDateString();
    return !lastFetchDate || lastFetchDate !== today || dailyRecipes.length === 0;
}

// Get daily recipes (30 random recipes that refresh daily)
export async function getDailyRecipes() {
    if (!shouldFetchNewRecipes()) {
        console.log('Using cached daily recipes');
        return dailyRecipes;
    }

    console.log('Fetching new daily recipes...');

    try {
        // Try to get recipes from API with generic search terms
        const searchTerms = ['chicken', 'salad', 'pasta', 'beef', 'fish'];
        let allRecipes = [];

        for (const term of searchTerms) {
            try {
                const recipes = await searchRecipesFromAPI(term, 10);
                allRecipes = [...allRecipes, ...recipes];
            } catch (error) {
                // Continue with next search term
            }
        }

        if (allRecipes.length >= 15) {
            // Shuffle and take 30 random recipes
            const shuffled = allRecipes.sort(() => 0.5 - Math.random());
            dailyRecipes = shuffled.slice(0, 30);
            lastFetchDate = new Date().toDateString();
            
            console.log(`Got ${dailyRecipes.length} daily recipes from API`);
            return dailyRecipes;
        }
    } catch (error) {
        console.log('API failed, using fallback recipes');
    }

    // Fallback: use and expand our static recipes
    const expandedRecipes = [];
    for (let i = 0; i < 30; i++) {
        const baseRecipe = FALLBACK_RECIPES[i % FALLBACK_RECIPES.length];
        expandedRecipes.push({
            ...baseRecipe,
            recipe_id: `fallback_${i + 1}`,
            id: `fallback_${i + 1}`
        });
    }

    dailyRecipes = expandedRecipes.map(adaptFatSecretToOurFormat);
    lastFetchDate = new Date().toDateString();
    
    console.log(`Using ${dailyRecipes.length} fallback daily recipes`);
    return dailyRecipes;
}

// Search recipes
export async function searchRecipes(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }

    console.log(`Searching for: ${query}`);

    try {
        // Try API first
        const apiResults = await searchRecipesFromAPI(query, 20);
        if (apiResults.length > 0) {
            return apiResults;
        }
    } catch (error) {
        console.log('API search failed, searching fallback data');
    }

    // Fallback: search in our static data
    const fallbackResults = FALLBACK_RECIPES.filter(recipe => 
        recipe.recipe_name.toLowerCase().includes(query.toLowerCase()) ||
        recipe.recipe_description.toLowerCase().includes(query.toLowerCase()) ||
        recipe.recipe_ingredients.ingredient.some(ing => 
            ing.toLowerCase().includes(query.toLowerCase())
        )
    );

    console.log(`Found ${fallbackResults.length} results in fallback data`);
    return fallbackResults.map(adaptFatSecretToOurFormat);
}

// Get recipe details by ID
export async function getRecipeDetails(id) {
    console.log(`Getting details for recipe: ${id}`);

    // Try API first
    const apiResult = await getRecipeById(id);
    if (apiResult) {
        return apiResult;
    }

    // Fallback: check our static data
    const fallbackRecipe = FALLBACK_RECIPES.find(r => r.recipe_id === id || r.id === id);
    if (fallbackRecipe) {
        console.log('Found recipe in fallback data');
        return adaptDetailedFatSecretToOurFormat(fallbackRecipe);
    }

    console.log('Recipe not found');
    return null;
}