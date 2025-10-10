// API client using Spoonacular API
// Free tier: 150 requests/day - perfect for testing and demos

let dailyRecipes = [];
let lastFetchDate = null;

// Spoonacular API configuration (free tier)
const API_CONFIG = {
    apiKey: 'YOUR_SPOONACULAR_API_KEY', // Will use fallback for demo
    baseUrl: 'https://api.spoonacular.com/recipes',
    useApi: false // Set to false to use realistic mock data
};

// Realistic recipe database (simulates API responses)
const RECIPE_DATABASE = [
    {
        id: 1001,
        title: "Grilled Chicken Breast with Herbs",
        summary: "Tender and juicy grilled chicken breast seasoned with fresh herbs and garlic.",
        image: "https://images.unsplash.com/photo-1532636054994-587b76bc9f3e?w=400",
        readyInMinutes: 25,
        servings: 4,
        dishTypes: ["lunch", "main course", "dinner"],
        extendedIngredients: [
            { name: "chicken breast", amount: 2, unit: "pieces" },
            { name: "olive oil", amount: 2, unit: "tbsp" },
            { name: "garlic", amount: 3, unit: "cloves" },
            { name: "fresh rosemary", amount: 1, unit: "tbsp" },
            { name: "salt", amount: 1, unit: "tsp" },
            { name: "black pepper", amount: 0.5, unit: "tsp" }
        ],
        nutrition: { calories: 231, protein: "43.5g", carbs: "0g", fat: "5.0g" },
        instructions: [
            "Preheat grill to medium-high heat.",
            "Season chicken with salt, pepper, and herbs.",
            "Grill for 6-7 minutes per side until cooked through.",
            "Let rest for 5 minutes before serving."
        ]
    },
    {
        id: 1002,
        title: "Mediterranean Quinoa Salad",
        summary: "Fresh and healthy quinoa salad packed with Mediterranean flavors and vegetables.",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        readyInMinutes: 20,
        servings: 6,
        dishTypes: ["side dish", "salad"],
        extendedIngredients: [
            { name: "quinoa", amount: 1, unit: "cup" },
            { name: "cucumber", amount: 1, unit: "large" },
            { name: "cherry tomatoes", amount: 1, unit: "cup" },
            { name: "feta cheese", amount: 0.5, unit: "cup" },
            { name: "olive oil", amount: 3, unit: "tbsp" },
            { name: "lemon juice", amount: 2, unit: "tbsp" }
        ],
        nutrition: { calories: 285, protein: "12.0g", carbs: "39.0g", fat: "10.5g" },
        instructions: [
            "Cook quinoa according to package instructions.",
            "Dice cucumber and halve cherry tomatoes.",
            "Mix quinoa with vegetables and feta.",
            "Dress with olive oil and lemon juice."
        ]
    },
    {
        id: 1003,
        title: "Fluffy Blueberry Pancakes",
        summary: "Classic breakfast pancakes bursting with fresh blueberries and served with maple syrup.",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        readyInMinutes: 15,
        servings: 4,
        dishTypes: ["breakfast"],
        extendedIngredients: [
            { name: "all-purpose flour", amount: 1.5, unit: "cups" },
            { name: "milk", amount: 1, unit: "cup" },
            { name: "eggs", amount: 2, unit: "large" },
            { name: "fresh blueberries", amount: 1, unit: "cup" },
            { name: "sugar", amount: 2, unit: "tbsp" },
            { name: "baking powder", amount: 2, unit: "tsp" }
        ],
        nutrition: { calories: 342, protein: "8.5g", carbs: "52.0g", fat: "12.0g" },
        instructions: [
            "Mix dry ingredients in a large bowl.",
            "Whisk together milk and eggs.",
            "Combine wet and dry ingredients until just mixed.",
            "Fold in blueberries and cook on griddle."
        ]
    },
    {
        id: 1004,
        title: "Beef Tacos with Fresh Salsa",
        summary: "Savory ground beef tacos topped with fresh salsa and crispy lettuce.",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        readyInMinutes: 30,
        servings: 4,
        dishTypes: ["lunch", "main course", "dinner"],
        extendedIngredients: [
            { name: "ground beef", amount: 1, unit: "lb" },
            { name: "taco shells", amount: 8, unit: "pieces" },
            { name: "lettuce", amount: 2, unit: "cups" },
            { name: "tomatoes", amount: 2, unit: "medium" },
            { name: "cheddar cheese", amount: 1, unit: "cup" },
            { name: "onion", amount: 1, unit: "small" }
        ],
        nutrition: { calories: 356, protein: "22.0g", carbs: "28.0g", fat: "18.0g" },
        instructions: [
            "Brown ground beef in a large skillet.",
            "Season with taco seasoning.",
            "Warm taco shells in oven.",
            "Assemble tacos with beef and toppings."
        ]
    },
    {
        id: 1005,
        title: "Classic Caesar Salad",
        summary: "Traditional Caesar salad with crispy romaine, parmesan, and homemade croutons.",
        image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400",
        readyInMinutes: 15,
        servings: 4,
        dishTypes: ["side dish", "salad"],
        extendedIngredients: [
            { name: "romaine lettuce", amount: 2, unit: "heads" },
            { name: "parmesan cheese", amount: 0.5, unit: "cup" },
            { name: "bread cubes", amount: 1, unit: "cup" },
            { name: "caesar dressing", amount: 0.25, unit: "cup" },
            { name: "olive oil", amount: 2, unit: "tbsp" }
        ],
        nutrition: { calories: 189, protein: "7.5g", carbs: "12.0g", fat: "14.0g" },
        instructions: [
            "Wash and chop romaine lettuce.",
            "Make croutons by toasting bread cubes.",
            "Toss lettuce with dressing.",
            "Top with parmesan and croutons."
        ]
    },
    {
        id: 1006,
        title: "Salmon Teriyaki Bowl",
        summary: "Glazed salmon served over rice with steamed vegetables and teriyaki sauce.",
        image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400",
        readyInMinutes: 25,
        servings: 2,
        dishTypes: ["lunch", "main course", "dinner"],
        extendedIngredients: [
            { name: "salmon fillet", amount: 2, unit: "pieces" },
            { name: "teriyaki sauce", amount: 0.25, unit: "cup" },
            { name: "jasmine rice", amount: 1, unit: "cup" },
            { name: "broccoli", amount: 1, unit: "cup" },
            { name: "sesame seeds", amount: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 425, protein: "35.0g", carbs: "28.0g", fat: "18.0g" },
        instructions: [
            "Cook rice according to package directions.",
            "Pan-sear salmon until cooked through.",
            "Steam broccoli until tender.",
            "Serve salmon over rice with vegetables."
        ]
    },
    {
        id: 1007,
        title: "Chocolate Chip Cookies",
        summary: "Classic homemade chocolate chip cookies that are crispy on the outside and chewy inside.",
        image: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400",
        readyInMinutes: 25,
        servings: 24,
        dishTypes: ["dessert"],
        extendedIngredients: [
            { name: "all-purpose flour", amount: 2.25, unit: "cups" },
            { name: "butter", amount: 1, unit: "cup" },
            { name: "brown sugar", amount: 0.75, unit: "cup" },
            { name: "chocolate chips", amount: 2, unit: "cups" },
            { name: "eggs", amount: 2, unit: "large" },
            { name: "vanilla extract", amount: 2, unit: "tsp" }
        ],
        nutrition: { calories: 156, protein: "2.0g", carbs: "22.0g", fat: "7.0g" },
        instructions: [
            "Preheat oven to 375°F.",
            "Cream butter and sugars together.",
            "Add eggs and vanilla, then flour.",
            "Fold in chocolate chips and bake 9-11 minutes."
        ]
    },
    {
        id: 1008,
        title: "Vegetable Stir Fry",
        summary: "Colorful mix of fresh vegetables stir-fried with garlic and soy sauce.",
        image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
        readyInMinutes: 15,
        servings: 4,
        dishTypes: ["side dish", "main course"],
        extendedIngredients: [
            { name: "mixed vegetables", amount: 4, unit: "cups" },
            { name: "soy sauce", amount: 3, unit: "tbsp" },
            { name: "garlic", amount: 3, unit: "cloves" },
            { name: "ginger", amount: 1, unit: "tbsp" },
            { name: "sesame oil", amount: 1, unit: "tbsp" }
        ],
        nutrition: { calories: 185, protein: "8.0g", carbs: "32.0g", fat: "4.0g" },
        instructions: [
            "Heat oil in a large wok or skillet.",
            "Add garlic and ginger, stir-fry briefly.",
            "Add vegetables and cook until tender-crisp.",
            "Finish with soy sauce and sesame oil."
        ]
    }
];

// Convert our format to standard format
function convertToStandardFormat(recipe) {
    return {
        id: recipe.id,
        name: recipe.title,
        description: recipe.summary,
        image: recipe.image,
        cover: recipe.image,
        ingredients: recipe.extendedIngredients.map(ing => `${ing.amount} ${ing.unit} ${ing.name}`),
        instructions: recipe.instructions || [],
        type: recipe.dishTypes[0] || "Main Dish",
        difficulty: 'Medium',
        prepTime: recipe.readyInMinutes?.toString() || "30",
        cookTime: `${recipe.readyInMinutes || 30} min`,
        servings: recipe.servings?.toString() || "4",
        nutrition: recipe.nutrition || { calories: "200", protein: "10g", carbs: "20g", fat: "8g" },
        isApiRecipe: true
    };
}

// Simulate API delay for realism
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Get daily recipes (30 random recipes that refresh daily)
export async function getDailyRecipes() {
    const today = new Date().toDateString();
    
    if (lastFetchDate === today && dailyRecipes.length > 0) {
        console.log('Using cached daily recipes');
        return dailyRecipes;
    }

    console.log('Fetching new daily recipes...');
    
    // Simulate API loading time
    await delay(500);
    
    // Generate 30 varied recipes by combining and modifying base recipes
    const expandedRecipes = [];
    const variations = [
        { suffix: " (Spicy)", modifier: "with extra spices" },
        { suffix: " (Healthy)", modifier: "with reduced calories" },
        { suffix: " (Quick)", modifier: "ready in 15 minutes" },
        { suffix: " (Family Size)", modifier: "serves 6-8 people" }
    ];
    
    for (let i = 0; i < 30; i++) {
        const baseRecipe = RECIPE_DATABASE[i % RECIPE_DATABASE.length];
        const variation = variations[Math.floor(i / RECIPE_DATABASE.length)] || { suffix: "", modifier: "" };
        
        const recipe = {
            ...baseRecipe,
            id: `daily_${i + 1}`,
            title: baseRecipe.title + variation.suffix,
            summary: variation.modifier ? 
                baseRecipe.summary + " " + variation.modifier : 
                baseRecipe.summary,
            readyInMinutes: baseRecipe.readyInMinutes + Math.floor(Math.random() * 10) - 5
        };
        
        expandedRecipes.push(recipe);
    }
    
    // Shuffle for variety
    const shuffled = expandedRecipes.sort(() => 0.5 - Math.random());
    dailyRecipes = shuffled.map(convertToStandardFormat);
    lastFetchDate = today;
    
    console.log(`✅ Generated ${dailyRecipes.length} daily recipes (simulated API)`);
    updateApiStatusBadge();
    
    return dailyRecipes;
}

// Search recipes
export async function searchRecipes(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }

    console.log(`🔍 Searching for: "${query}"`);
    
    // Simulate API delay
    await delay(300);
    
    const searchTerm = query.toLowerCase();
    const results = RECIPE_DATABASE.filter(recipe => 
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.summary.toLowerCase().includes(searchTerm) ||
        recipe.dishTypes.some(type => type.includes(searchTerm)) ||
        recipe.extendedIngredients.some(ing => ing.name.toLowerCase().includes(searchTerm))
    );
    
    // Add some variety to search results
    const expandedResults = [];
    results.forEach((recipe, index) => {
        expandedResults.push({
            ...recipe,
            id: `search_${recipe.id}_${index}`
        });
    });
    
    console.log(`✅ Found ${expandedResults.length} recipes matching "${query}"`);
    return expandedResults.map(convertToStandardFormat);
}

// Get recipe details by ID
export async function getRecipeDetails(id) {
    console.log(`📖 Getting details for recipe: ${id}`);
    
    // Simulate API delay
    await delay(200);
    
    // Extract base ID if it's a generated ID
    const baseId = id.toString().includes('_') ? 
        parseInt(id.toString().split('_')[1]) || parseInt(id.toString().split('_')[0].replace(/\D/g, '')) :
        parseInt(id);
    
    let recipe = RECIPE_DATABASE.find(r => r.id === baseId);
    
    if (!recipe) {
        // Try to find by any ID pattern
        recipe = RECIPE_DATABASE[Math.abs(baseId) % RECIPE_DATABASE.length];
    }
    
    if (recipe) {
        const detailedRecipe = {
            ...recipe,
            id: id, // Keep the original ID
            // Add more detailed information
            instructions: recipe.instructions || [
                "Prepare all ingredients according to the ingredient list.",
                "Follow standard cooking procedures for this type of dish.",
                "Cook until done and serve immediately.",
                "Enjoy your delicious homemade meal!"
            ]
        };
        
        console.log(`✅ Found recipe details for: ${recipe.title}`);
        return convertToStandardFormat(detailedRecipe);
    }

    console.log(`❌ Recipe not found for ID: ${id}`);
    return null;
}

// Update API status badge
function updateApiStatusBadge() {
    const badge = document.querySelector('.daily-recipes-indicator span');
    if (badge) {
        badge.textContent = '🍽️ Daily fresh recipes • Spoonacular API Simulation • Updates every 24h';
        badge.parentElement.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
    }
}

// Initialize on load
console.log('🚀 Recipe API client initialized with simulated Spoonacular data');