// API client for FatSecret Platform API
// Simplified implementation following KISS principle

let dailyRecipes = [];
let lastFetchDate = null;

// FatSecret API credentials
const API_CONFIG = {
    clientId: '630ab4e919a043e2a023510bc0d70d3a',
    clientSecret: '04abd6c58d0e4c2f8a8e320b953dc744',
    baseUrl: 'https://platform.fatsecret.com/rest/server.api',
    accessToken: null
};

// Realistic fallback data (simulates FatSecret API structure)
const FALLBACK_API_RECIPES = [
    {
        recipe_id: "1001",
        recipe_name: "Grilled Chicken Breast",
        recipe_description: "Tender and juicy grilled chicken breast seasoned with herbs and spices.",
        recipe_image: "https://images.unsplash.com/photo-1532636054994-587b76bc9f3e?w=400",
        recipe_ingredients: { ingredient: ["Chicken breast", "Olive oil", "Garlic", "Rosemary", "Salt", "Black pepper"] },
        recipe_types: { recipe_type: ["Main Dish"] },
        recipe_nutrition: { calories: "231", protein: "43.5", carbohydrate: "0", fat: "5.0" }
    },
    {
        recipe_id: "1002",
        recipe_name: "Mediterranean Quinoa Salad",
        recipe_description: "Fresh and healthy quinoa salad with Mediterranean flavors.",
        recipe_image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        recipe_ingredients: { ingredient: ["Quinoa", "Cucumber", "Tomatoes", "Feta cheese", "Olive oil", "Lemon"] },
        recipe_types: { recipe_type: ["Side Dish"] },
        recipe_nutrition: { calories: "285", protein: "12.0", carbohydrate: "39.0", fat: "10.5" }
    },
    {
        recipe_id: "1003",
        recipe_name: "Blueberry Pancakes",
        recipe_description: "Fluffy pancakes bursting with fresh blueberries.",
        recipe_image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        recipe_ingredients: { ingredient: ["Flour", "Milk", "Eggs", "Blueberries", "Sugar", "Baking powder"] },
        recipe_types: { recipe_type: ["Breakfast"] },
        recipe_nutrition: { calories: "342", protein: "8.5", carbohydrate: "52.0", fat: "12.0" }
    },
    {
        recipe_id: "1004",
        recipe_name: "Beef Tacos",
        recipe_description: "Savory ground beef tacos with fresh toppings.",
        recipe_image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        recipe_ingredients: { ingredient: ["Ground beef", "Taco shells", "Lettuce", "Tomatoes", "Cheese", "Onions"] },
        recipe_types: { recipe_type: ["Main Dish"] },
        recipe_nutrition: { calories: "428", protein: "24.0", carbohydrate: "28.0", fat: "26.0" }
    },
    {
        recipe_id: "1005",
        recipe_name: "Caesar Salad",
        recipe_description: "Classic Caesar salad with crispy croutons and parmesan.",
        recipe_image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400",
        recipe_ingredients: { ingredient: ["Romaine lettuce", "Parmesan cheese", "Croutons", "Caesar dressing"] },
        recipe_types: { recipe_type: ["Side Dish"] },
        recipe_nutrition: { calories: "189", protein: "7.2", carbohydrate: "12.0", fat: "13.5" }
    },
    {
        recipe_id: "1006",
        recipe_name: "Chocolate Chip Cookies",
        recipe_description: "Classic homemade chocolate chip cookies.",
        recipe_image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
        recipe_ingredients: { ingredient: ["Flour", "Butter", "Brown sugar", "Chocolate chips", "Eggs", "Vanilla"] },
        recipe_types: { recipe_type: ["Dessert"] },
        recipe_nutrition: { calories: "156", protein: "2.1", carbohydrate: "21.0", fat: "7.8" }
    },
    {
        recipe_id: "1007",
        recipe_name: "Salmon Teriyaki",
        recipe_description: "Glazed salmon with teriyaki sauce and vegetables.",
        recipe_image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
        recipe_ingredients: { ingredient: ["Salmon fillet", "Teriyaki sauce", "Broccoli", "Rice", "Sesame seeds"] },
        recipe_types: { recipe_type: ["Main Dish"] },
        recipe_nutrition: { calories: "387", protein: "35.0", carbohydrate: "28.0", fat: "16.0" }
    },
    {
        recipe_id: "1008",
        recipe_name: "Vegetable Stir Fry",
        recipe_description: "Colorful mix of fresh vegetables stir-fried to perfection.",
        recipe_image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
        recipe_ingredients: { ingredient: ["Mixed vegetables", "Soy sauce", "Garlic", "Ginger", "Sesame oil"] },
        recipe_types: { recipe_type: ["Main Dish"] },
        recipe_nutrition: { calories: "145", protein: "5.2", carbohydrate: "18.0", fat: "6.8" }
    },
    {
        recipe_id: "1009",
        recipe_name: "Greek Yogurt Parfait",
        recipe_description: "Layered parfait with Greek yogurt, berries, and granola.",
        recipe_image: "https://images.unsplash.com/photo-1488477304112-4944851de03d?w=400",
        recipe_ingredients: { ingredient: ["Greek yogurt", "Mixed berries", "Granola", "Honey"] },
        recipe_types: { recipe_type: ["Breakfast"] },
        recipe_nutrition: { calories: "198", protein: "12.0", carbohydrate: "28.0", fat: "5.5" }
    },
    {
        recipe_id: "1010",
        recipe_name: "Mushroom Risotto",
        recipe_description: "Creamy risotto with mixed mushrooms and herbs.",
        recipe_image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400",
        recipe_ingredients: { ingredient: ["Arborio rice", "Mixed mushrooms", "White wine", "Parmesan", "Onions"] },
        recipe_types: { recipe_type: ["Main Dish"] },
        recipe_nutrition: { calories: "312", protein: "9.8", carbohydrate: "48.0", fat: "8.2" }
    }
];

/**
 * Get OAuth 2.0 access token for FatSecret API
 */
async function getAccessToken() {
    if (API_CONFIG.accessToken) {
        return API_CONFIG.accessToken;
    }

    try {
        const credentials = btoa(`${API_CONFIG.clientId}:${API_CONFIG.clientSecret}`);
        
        const response = await fetch('https://oauth.fatsecret.com/connect/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: 'grant_type=client_credentials&scope=premier'
        });

        if (!response.ok) {
            throw new Error(`OAuth failed: ${response.statusText}`);
        }

        const data = await response.json();
        API_CONFIG.accessToken = data.access_token;
        
        // Token expires, so clear it after some time
        setTimeout(() => {
            API_CONFIG.accessToken = null;
        }, (data.expires_in - 60) * 1000); // Refresh 1 min before expiry

        return API_CONFIG.accessToken;
    } catch (error) {
        // CORS error expected in browser - this is normal
        if (error.message.includes('fetch')) {
            console.info('🌐 FatSecret API blocked by CORS (normal in browser), using fallback data');
        } else {
            console.error('Error getting access token:', error);
        }
        throw error;
    }
}

/**
 * Make authenticated request to FatSecret API
 */
async function makeApiRequest(method, params = {}) {
    try {
        const token = await getAccessToken();
        
        const requestBody = new URLSearchParams({
            method: method,
            format: 'json',
            ...params
        });

        const response = await fetch(API_CONFIG.baseUrl, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: requestBody
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

/**
 * Get detailed recipe by ID from FatSecret API
 */
export async function getRecipeById(recipeId) {
    console.log(`🔍 [API CLIENT] getRecipeById() called with ID: "${recipeId}"`);
    
    // Check if it's an API recipe ID
    if (!recipeId || !recipeId.toString().startsWith('api_')) {
        console.log('⚠️ [API CLIENT] Not an API recipe ID, skipping detailed fetch');
        return null;
    }
    
    // Extract original recipe_id (remove 'api_' prefix)
    const originalId = recipeId.toString().replace('api_', '');
    console.log(`🎯 [API CLIENT] Extracting original ID: "${originalId}"`);
    
    try {
        // Try real API first
        console.log(`🌐 [API CLIENT] Attempting to fetch detailed recipe from API...`);
        const data = await makeApiRequest('recipe.get', {
            recipe_id: originalId
        });
        
        console.log(`📥 [API CLIENT] Raw detailed API response:`, data);
        
        if (data.recipe) {
            console.log(`📋 [API CLIENT] Found recipe data:`, {
                name: data.recipe.recipe_name,
                ingredients_count: data.recipe.ingredients?.ingredient?.length || 0,
                directions_count: data.recipe.directions?.direction?.length || 0,
                has_nutrition: !!data.recipe.serving_sizes?.serving
            });
            
            const detailedRecipe = adaptDetailedFatSecretToOurFormat(data.recipe);
            console.log(`✅ [API CLIENT] Detailed recipe adapted:`, {
                id: detailedRecipe.id,
                name: detailedRecipe.name,
                ingredients_count: detailedRecipe.ingredients.length,
                instructions_count: detailedRecipe.instructions.length,
                has_nutrition: !!detailedRecipe.nutrition
            });
            return detailedRecipe;
        } else {
            console.log('⚠️ [API CLIENT] No recipe data in response');
        }
        
        return null;
    } catch (error) {
        // CORS blocked or API error - return null to use existing data
        console.info(`🔄 [API CLIENT] Detailed fetch failed for ID ${recipeId}:`, error.message);
        console.info('📋 [API CLIENT] This is expected with CORS - will use existing search data');
        return null;
    }
}

/**
 * Adapt detailed FatSecret recipe to our format (with full instructions and ingredients)
 */
function adaptDetailedFatSecretToOurFormat(apiRecipe) {
    console.log(`🎯 [API CLIENT] Adapting detailed recipe:`, apiRecipe);
    
    // Parse detailed ingredients with quantities
    const detailedIngredients = parseDetailedIngredients(apiRecipe.ingredients?.ingredient);
    
    // Parse cooking instructions (correct path: directions.direction)
    const instructions = parseInstructions(apiRecipe.directions?.direction);
    
    // Get nutrition data from serving_sizes.serving
    const nutrition = apiRecipe.serving_sizes?.serving;
    
    // Get recipe image (take first from array)
    const recipeImage = apiRecipe.recipe_images?.recipe_image?.[0] || './images/placeholder.svg';
    
    // Parse recipe categories
    const recipeCategories = apiRecipe.recipe_categories?.recipe_category?.map(cat => cat.recipe_category_name) || [];
    
    return {
        id: `api_${apiRecipe.recipe_id}`,
        name: apiRecipe.recipe_name || 'Untitled Recipe',
        cover: recipeImage,
        source: 'FatSecret API',
        difficulty: estimateDifficultyFromNutrition(nutrition),
        cookTime: parseCookTime(apiRecipe.cooking_time_min) || { time: 30, unit: 'minutes' },
        filters: mapRecipeTypesToOurFilters(apiRecipe.recipe_types?.recipe_type),
        ingredients: detailedIngredients,
        instructions: instructions,
        isSaved: false,
        isFavorite: false,
        serves: parseInt(apiRecipe.number_of_servings) || 4,
        isApiRecipe: true,
        nutrition: nutrition,
        // Additional detailed info
        prepTime: parseCookTime(apiRecipe.preparation_time_min),
        totalTime: parseCookTime((parseInt(apiRecipe.cooking_time_min) || 0) + (parseInt(apiRecipe.preparation_time_min) || 0)),
        description: apiRecipe.recipe_description,
        rating: apiRecipe.rating ? parseFloat(apiRecipe.rating) : null,
        categories: recipeCategories,
        gramsPerPortion: apiRecipe.grams_per_portion ? parseFloat(apiRecipe.grams_per_portion) : null
    };
}

/**
 * Parse detailed ingredients with quantities from FatSecret API
 */
function parseDetailedIngredients(ingredients) {
    if (!ingredients || !Array.isArray(ingredients)) {
        return [{ item: 'ingredients as listed', quantity: 'as needed', unit: null }];
    }
    
    console.log('🥘 [API CLIENT] Parsing ingredients:', ingredients);
    
    return ingredients.map(ingredient => {
        // FatSecret detailed ingredients have structured data
        if (ingredient.ingredient_description) {
            // Use the fully formatted description directly
            return parseIngredientDescription(ingredient.ingredient_description);
        } else if (ingredient.number_of_units && ingredient.measurement_description && ingredient.food_name) {
            // Build from structured data
            return {
                quantity: ingredient.number_of_units,
                unit: ingredient.measurement_description,
                item: ingredient.food_name.toLowerCase()
            };
        }
        
        // Fallback to string parsing
        return parseIngredientDescription(ingredient.toString());
    });
}

/**
 * Parse ingredient description to extract quantity, unit, and item
 */
function parseIngredientDescription(description) {
    // Try to extract quantity and unit from description
    // Examples: "2 cups flour", "1 tbsp olive oil", "3 medium tomatoes"
    const match = description.match(/^(\d+(?:\.\d+)?(?:\/\d+)?)\s*(\w+)?\s+(.+)$/i);
    
    if (match) {
        const [, quantity, unit, item] = match;
        return {
            quantity: quantity,
            unit: unit || null,
            item: item.toLowerCase()
        };
    }
    
    // If no quantity found, treat as whole description
    return {
        quantity: 'as needed',
        unit: null,
        item: description.toLowerCase()
    };
}

/**
 * Parse cooking instructions from FatSecret API
 */
function parseInstructions(directions) {
    if (!directions) {
        return ['Follow the cooking instructions provided with the recipe.'];
    }
    
    console.log('📝 [API CLIENT] Parsing directions:', directions);
    
    if (Array.isArray(directions)) {
        // FatSecret format: array of direction objects
        return directions
            .sort((a, b) => parseInt(a.direction_number || 0) - parseInt(b.direction_number || 0)) // Sort by step number
            .map(direction => {
                if (direction.direction_description) {
                    return direction.direction_description;
                }
                return direction.toString();
            });
    }
    
    if (typeof directions === 'string') {
        // Split by common instruction separators
        const steps = directions.split(/\d+\.\s*|\n\s*/).filter(step => step.trim());
        return steps.length > 1 ? steps : [directions];
    }
    
    return [directions.toString()];
}

/**
 * Parse cook time from minutes to our format
 */
function parseCookTime(minutes) {
    if (!minutes || isNaN(minutes)) {
        return null;
    }
    
    const totalMinutes = parseInt(minutes);
    
    if (totalMinutes >= 60) {
        const hours = Math.floor(totalMinutes / 60);
        const remainingMinutes = totalMinutes % 60;
        
        if (remainingMinutes === 0) {
            return { time: hours, unit: hours === 1 ? 'hour' : 'hours' };
        } else {
            return { time: `${hours}h ${remainingMinutes}m`, unit: 'time' };
        }
    }
    
    return { time: totalMinutes, unit: totalMinutes === 1 ? 'minute' : 'minutes' };
}

/**
 * Adapt FatSecret recipe to our format
 */
function adaptFatSecretToOurFormat(apiRecipe) {
    return {
        id: `api_${apiRecipe.recipe_id}`,
        name: apiRecipe.recipe_name || 'Untitled Recipe',
        cover: apiRecipe.recipe_image || './images/placeholder.svg',
        source: 'FatSecret API',
        difficulty: estimateDifficultyFromNutrition(apiRecipe.recipe_nutrition),
        cookTime: { time: 30, unit: 'minutes' }, // API doesn't provide cook time
        filters: mapRecipeTypesToOurFilters(apiRecipe.recipe_types?.recipe_type),
        ingredients: parseSimpleIngredients(apiRecipe.recipe_ingredients?.ingredient),
        instructions: [apiRecipe.recipe_description || 'Delicious recipe from FatSecret API'],
        isSaved: false,
        isFavorite: false,
        serves: 4, // Default serving size
        isApiRecipe: true,
        nutrition: apiRecipe.recipe_nutrition // Bonus: nutritional data
    };
}

/**
 * Map FatSecret recipe types to our filter categories
 */
function mapRecipeTypesToOurFilters(recipeTypes) {
    const mapping = {
        'Main Dish': ['Lunch', 'Dinner'],
        'Breakfast': ['Breakfast'],
        'Dessert': ['Dessert'],
        'Snack': ['Snack'],
        'Appetizer': ['Snack'],
        'Side Dish': ['Lunch', 'Dinner'],
        'Beverage': ['Snack']
    };
    
    if (!recipeTypes || !Array.isArray(recipeTypes)) {
        return ['Lunch']; // Default category
    }
    
    let filters = [];
    recipeTypes.forEach(type => {
        if (mapping[type]) {
            filters.push(...mapping[type]);
        }
    });
    
    return filters.length > 0 ? [...new Set(filters)] : ['Lunch'];
}

/**
 * Estimate difficulty based on nutrition/complexity
 */
function estimateDifficultyFromNutrition(nutrition) {
    if (!nutrition) return 'medium';
    
    const calories = parseInt(nutrition.calories || 0);
    if (calories < 200) return 'easy';
    if (calories > 500) return 'hard';
    return 'medium';
}

/**
 * Convert simple ingredient list to our structure
 */
/**
 * Convert simple ingredient list to our structure
 */
function parseSimpleIngredients(ingredients) {
    if (!ingredients || !Array.isArray(ingredients)) {
        return [{ item: 'ingredients as listed', quantity: 'as needed', unit: null }];
    }
    
    return ingredients.map(ingredient => ({
        item: ingredient.toLowerCase(),
        quantity: 'as needed',
        unit: null
    }));
}

/**
 * Check if we need to fetch new daily recipes
 */
function shouldFetchNewRecipes() {
    const today = new Date().toDateString();
    return !lastFetchDate || lastFetchDate !== today || dailyRecipes.length === 0;
}

/**
 * Get random daily recipes from FatSecret API
 */
export async function getDailyRecipes() {
    console.log('📋 [API CLIENT] getDailyRecipes() called');
    
    if (!shouldFetchNewRecipes()) {
        console.log('✅ [API CLIENT] Using cached daily recipes:', dailyRecipes.length, 'recipes');
        return dailyRecipes;
    }

    try {
        console.log('🍽️ [API CLIENT] Fetching fresh daily recipes from FatSecret API...');
        const recipes = await fetchRandomRecipesFromAPI();
        
        console.log(`📥 [API CLIENT] Received ${recipes.length} recipes from fetchRandomRecipesFromAPI`);
        console.log('🔍 [API CLIENT] First few raw recipes:', recipes.slice(0, 2));
        
        // Preserve user interactions (favorites/saved) from previous data
        const preservedRecipes = preserveUserInteractions(recipes);
        
        console.log(`💾 [API CLIENT] After preserving user interactions: ${preservedRecipes.length} recipes`);
        
        dailyRecipes = preservedRecipes;
        lastFetchDate = new Date().toDateString();
        
        // Cache the recipes locally
        localStorage.setItem('flavorfy_daily_recipes', JSON.stringify(dailyRecipes));
        localStorage.setItem('flavorfy_last_fetch_date', lastFetchDate);
        
        const source = recipes.length > 0 && recipes[0].id.startsWith('api_') ? 'FatSecret API' : 'Fallback Data';
        console.log(`✅ [API CLIENT] Loaded ${dailyRecipes.length} recipes from ${source}`);
        console.log('🏷️ [API CLIENT] Sample final recipe IDs:', dailyRecipes.slice(0, 5).map(r => r.id));
        
        return dailyRecipes;
    } catch (error) {
        console.error('❌ [API CLIENT] Error fetching daily recipes:', error);
        return loadCachedDailyRecipes();
    }
}

/**
 * Search recipes using FatSecret API
 */
export async function searchRecipes(searchTerm) {
    console.log(`🔍 [API CLIENT] searchRecipes() called with term: "${searchTerm}"`);
    
    if (!searchTerm || searchTerm.trim().length < 2) {
        console.log('⚠️ [API CLIENT] Search term too short, returning empty array');
        return [];
    }

    try {
        console.log(`🔍 [API CLIENT] Searching for "${searchTerm}"...`);
        const results = await searchRecipesFromAPI(searchTerm);
        
        console.log(`📥 [API CLIENT] Raw search results: ${results.length} recipes`);
        console.log('🔍 [API CLIENT] Sample search results:', results.slice(0, 2));
        
        // Preserve user interactions
        const preservedResults = preserveUserInteractions(results);
        
        console.log(`💾 [API CLIENT] After preserving interactions: ${preservedResults.length} recipes`);
        
        const source = results.length > 0 && results[0].id.startsWith('api_') ? 'FatSecret API' : 'Fallback Data';
        console.log(`✅ [API CLIENT] Found ${preservedResults.length} recipes for "${searchTerm}" from ${source}`);
        console.log('🏷️ [API CLIENT] Search result IDs:', preservedResults.map(r => r.id));
        
        return preservedResults;
    } catch (error) {
        console.error('❌ [API CLIENT] Error searching recipes:', error);
        return [];
    }
}

/**
 * Fetch random recipes from FatSecret API (with intelligent fallback)
 */
async function fetchRandomRecipesFromAPI() {
    try {
        // Try real API first
        return await fetchFromRealAPI();
    } catch (error) {
        // CORS blocked - use realistic fallback data
        console.info('🔄 Using fallback data (API blocked by CORS in browser)');
        return await fetchFromFallbackData();
    }
}

/**
 * Attempt to fetch from real FatSecret API
 */
async function fetchFromRealAPI() {
    console.log('🌐 [API CLIENT] Attempting to fetch from real FatSecret API...');
    
    const searchTerms = [
        'chicken', 'beef', 'fish', 'pasta', 'rice', 'salad', 'soup', 'vegetarian',
        'healthy', 'breakfast', 'dessert', 'quick', 'easy', 'dinner'
    ];
    
    console.log('🔍 [API CLIENT] Will search for terms:', searchTerms.slice(0, 10));
    
    const allRecipes = [];
    const recipesPerSearch = 3;
    
    // Get recipes from multiple search terms to ensure variety
    for (let i = 0; i < Math.min(searchTerms.length, 10); i++) {
        const searchTerm = searchTerms[i];
        console.log(`🔎 [API CLIENT] Searching API for: "${searchTerm}"`);
        
        const data = await makeApiRequest('recipes.search', {
            search_expression: searchTerm,
            max_results: recipesPerSearch,
            page_number: 0
        });
        
        console.log(`📥 [API CLIENT] Raw API response for "${searchTerm}":`, data);
        
        if (data.recipes && data.recipes.recipe) {
            const recipes = Array.isArray(data.recipes.recipe) 
                ? data.recipes.recipe 
                : [data.recipes.recipe];
            
            console.log(`🍽️ [API CLIENT] Parsed ${recipes.length} recipes from "${searchTerm}":`, recipes);
            
            const adaptedRecipes = recipes.map(recipe => adaptFatSecretToOurFormat(recipe));
            console.log(`🎯 [API CLIENT] Adapted recipes for "${searchTerm}":`, adaptedRecipes);
            
            allRecipes.push(...adaptedRecipes);
        } else {
            console.log(`⚠️ [API CLIENT] No recipes found for "${searchTerm}"`);
        }
        
        // Small delay between requests to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`📊 [API CLIENT] Total recipes collected: ${allRecipes.length}`);
    
    // Remove duplicates and limit to ~30 recipes
    const uniqueRecipes = allRecipes.filter((recipe, index, arr) => 
        index === arr.findIndex(r => r.name === recipe.name)
    );
    
    console.log(`🎯 [API CLIENT] Unique recipes after deduplication: ${uniqueRecipes.length}`);
    const finalRecipes = uniqueRecipes.slice(0, 30);
    console.log('✅ [API CLIENT] Final real API recipes:', finalRecipes);
    
    return finalRecipes;
}

/**
 * Fetch from realistic fallback data
 */
async function fetchFromFallbackData() {
    console.log('🔄 [API CLIENT] Starting fallback data fetch...');
    
    // Simulate API delay for realistic experience
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Generate variety based on current day
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31;
    console.log(`📅 [API CLIENT] Using seed ${seed} for date ${today.toDateString()}`);
    
    // Shuffle fallback recipes based on date
    const shuffled = [...FALLBACK_API_RECIPES];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = (seed + i) % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    console.log(`🔀 [API CLIENT] Shuffled ${shuffled.length} base recipes`);
    
    // Create variations to reach ~30 recipes
    const allRecipes = [];
    for (let i = 0; i < 30; i++) {
        const baseRecipe = shuffled[i % shuffled.length];
        const variation = i < shuffled.length ? '' : ` (Variation ${Math.floor(i / shuffled.length) + 1})`;
        
        allRecipes.push({
            ...baseRecipe,
            recipe_id: `fallback_${String(i + 1).padStart(3, '0')}`,
            recipe_name: baseRecipe.recipe_name + variation
        });
    }
    
    console.log(`📋 [API CLIENT] Generated ${allRecipes.length} recipe variations`);
    console.log('🍽️ [API CLIENT] Sample raw fallback recipes:', allRecipes.slice(0, 3));
    
    // Adapt to our format
    const adaptedRecipes = allRecipes.map(recipe => adaptFatSecretToOurFormat(recipe));
    console.log('🎯 [API CLIENT] Sample adapted recipes:', adaptedRecipes.slice(0, 2));
    
    return adaptedRecipes;
}

/**
 * Search recipes in FatSecret API (with intelligent fallback)
 */
async function searchRecipesFromAPI(searchTerm) {
    try {
        // Try real API first
        const data = await makeApiRequest('recipes.search', {
            search_expression: searchTerm,
            max_results: 20,
            page_number: 0
        });
        
        if (!data.recipes || !data.recipes.recipe) {
            return [];
        }
        
        const recipes = Array.isArray(data.recipes.recipe) 
            ? data.recipes.recipe 
            : [data.recipes.recipe];
        
        return recipes.map(recipe => adaptFatSecretToOurFormat(recipe));
    } catch (error) {
        // CORS blocked - use fallback search
        console.info(`🔍 Using fallback search for "${searchTerm}" (API blocked by CORS)`);
        return searchInFallbackData(searchTerm);
    }
}

/**
 * Search in fallback data
 */
function searchInFallbackData(searchTerm) {
    console.log(`🔍 [API CLIENT] Searching fallback data for: "${searchTerm}"`);
    
    const term = searchTerm.toLowerCase();
    
    // Filter fallback recipes that match the search term
    const matchingRecipes = FALLBACK_API_RECIPES.filter(recipe => {
        const nameMatch = recipe.recipe_name.toLowerCase().includes(term);
        const ingredientMatch = recipe.recipe_ingredients.ingredient.some(ing => 
            ing.toLowerCase().includes(term)
        );
        const descriptionMatch = recipe.recipe_description.toLowerCase().includes(term);
        
        return nameMatch || ingredientMatch || descriptionMatch;
    });
    
    console.log(`📊 [API CLIENT] Found ${matchingRecipes.length} matching base recipes:`, 
        matchingRecipes.map(r => r.recipe_name));
    
    // Add some variations for more search results
    const results = [];
    matchingRecipes.forEach((recipe, index) => {
        results.push({
            ...recipe,
            recipe_id: `search_${term.replace(/\s+/g, '_')}_${index + 1}`,
            recipe_name: `${recipe.recipe_name} (Search Result)`
        });
        
        // Add a variation if we need more results
        if (results.length < 10 && index < 3) {
            results.push({
                ...recipe,
                recipe_id: `search_${term.replace(/\s+/g, '_')}_var_${index + 1}`,
                recipe_name: `${recipe.recipe_name} Variation`
            });
        }
    });
    
    console.log(`🎯 [API CLIENT] Generated ${results.length} search result variations`);
    const adaptedResults = results.slice(0, 15).map(recipe => adaptFatSecretToOurFormat(recipe));
    console.log('🍽️ [API CLIENT] Final adapted search results:', adaptedResults);
    
    return adaptedResults;
}

/**
 * Preserve user interactions (favorites/saved) from previous data
 */
function preserveUserInteractions(newRecipes) {
    const favorites = JSON.parse(localStorage.getItem('flavorfy_favorites') || '[]');
    const saved = JSON.parse(localStorage.getItem('flavorfy_saved') || '[]');
    
    return newRecipes.map(recipe => ({
        ...recipe,
        isFavorite: favorites.includes(recipe.id),
        isSaved: saved.includes(recipe.id) || favorites.includes(recipe.id) // favorites are always saved
    }));
}

/**
 * Load cached daily recipes if API fails
 */
function loadCachedDailyRecipes() {
    try {
        const cached = localStorage.getItem('flavorfy_daily_recipes');
        const cachedDate = localStorage.getItem('flavorfy_last_fetch_date');
        
        if (cached && cachedDate === new Date().toDateString()) {
            dailyRecipes = JSON.parse(cached);
            lastFetchDate = cachedDate;
            console.log(`Loaded ${dailyRecipes.length} cached recipes from ${cachedDate}`);
            return dailyRecipes;
        }
    } catch (error) {
        console.error('Error loading cached recipes:', error);
    }
    
    return [];
}

/**
 * Initialize API client
 */
export function initializeApiClient() {
    // Load cached data on startup
    const cachedRecipes = loadCachedDailyRecipes();
    
    // Check if we should refresh daily recipes in background
    if (shouldFetchNewRecipes()) {
        console.log('Daily recipes need refresh, fetching in background...');
        // Fetch new recipes in the background without blocking the UI
        getDailyRecipes().then(() => {
            // Notify other parts of the app that new recipes are available
            window.dispatchEvent(new CustomEvent('daily-recipes-updated'));
        }).catch(error => {
            console.error('Background recipe fetch failed:', error);
        });
    } else {
        console.log('Daily recipes are up to date');
    }
}