// Simple API client
// KISS implementation without mock delays

let dailyRecipes = [];
let lastFetchDate = null;

// Simple recipe data
const RECIPES = [
    {
        id: 1001,
        name: "Grilled Chicken Breast",
        description: "Tender grilled chicken breast with herbs",
        image: "https://images.unsplash.com/photo-1532636054994-587b76bc9f3e?w=400",
        cover: "https://images.unsplash.com/photo-1532636054994-587b76bc9f3e?w=400",
        ingredients: ["Chicken breast", "Olive oil", "Garlic", "Rosemary"],
        instructions: ["Season chicken", "Grill for 6-7 minutes per side", "Let rest before serving"],
        type: "Main Dish",
        difficulty: 'Medium',
        prepTime: "15",
        cookTime: "25 min",
        servings: "4",
        nutrition: { calories: "231", protein: "43.5g", carbs: "0g", fat: "5.0g" },
        isApiRecipe: true
    },
    {
        id: 1002,
        name: "Mediterranean Quinoa Salad",
        description: "Fresh quinoa salad with Mediterranean flavors",
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        cover: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400",
        ingredients: ["Quinoa", "Cucumber", "Tomatoes", "Feta cheese"],
        instructions: ["Cook quinoa", "Dice vegetables", "Mix ingredients", "Add dressing"],
        type: "Side Dish",
        difficulty: 'Easy',
        prepTime: "15",
        cookTime: "20 min",
        servings: "6",
        nutrition: { calories: "285", protein: "12.0g", carbs: "39.0g", fat: "10.5g" },
        isApiRecipe: true
    },
    {
        id: 1003,
        name: "Blueberry Pancakes",
        description: "Fluffy pancakes with fresh blueberries",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        cover: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        ingredients: ["Flour", "Milk", "Eggs", "Blueberries"],
        instructions: ["Mix dry ingredients", "Add wet ingredients", "Fold in blueberries", "Cook on griddle"],
        type: "Breakfast",
        difficulty: 'Easy',
        prepTime: "10",
        cookTime: "15 min",
        servings: "4",
        nutrition: { calories: "342", protein: "8.5g", carbs: "52.0g", fat: "12.0g" },
        isApiRecipe: true
    },
    {
        id: 1004,
        name: "Beef Tacos",
        description: "Savory ground beef tacos with fresh toppings",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        cover: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        ingredients: ["Ground beef", "Taco shells", "Lettuce", "Cheese"],
        instructions: ["Brown ground beef", "Season with spices", "Warm taco shells", "Assemble tacos"],
        type: "Main Dish",
        difficulty: 'Medium',
        prepTime: "15",
        cookTime: "30 min",
        servings: "4",
        nutrition: { calories: "356", protein: "22.0g", carbs: "28.0g", fat: "18.0g" },
        isApiRecipe: true
    },
    {
        id: 1005,
        name: "Caesar Salad",
        description: "Classic Caesar salad with crispy croutons",
        image: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400",
        cover: "https://images.unsplash.com/photo-1551248429-40975aa4de74?w=400",
        ingredients: ["Romaine lettuce", "Parmesan", "Croutons", "Caesar dressing"],
        instructions: ["Wash lettuce", "Make croutons", "Toss with dressing", "Top with parmesan"],
        type: "Side Dish",
        difficulty: 'Easy',
        prepTime: "10",
        cookTime: "15 min",
        servings: "4",
        nutrition: { calories: "189", protein: "7.5g", carbs: "12.0g", fat: "14.0g" },
        isApiRecipe: true
    }
];

// Get daily recipes (30 recipes that refresh daily)
export async function getDailyRecipes() {
    const today = new Date().toDateString();
    
    if (lastFetchDate === today && dailyRecipes.length > 0) {
        console.log('Using cached daily recipes');
        return dailyRecipes;
    }

    console.log('Generating daily recipes...');
    
    // Generate 30 recipes by repeating and varying base recipes
    const expandedRecipes = [];
    for (let i = 0; i < 30; i++) {
        const baseRecipe = RECIPES[i % RECIPES.length];
        expandedRecipes.push({
            ...baseRecipe,
            id: `daily_${i + 1}`
        });
    }
    
    // Shuffle for variety
    dailyRecipes = expandedRecipes.sort(() => 0.5 - Math.random());
    lastFetchDate = today;
    
    console.log(`Generated ${dailyRecipes.length} daily recipes`);
    return dailyRecipes;
}

// Search recipes
export async function searchRecipes(query) {
    if (!query || query.trim().length < 2) {
        return [];
    }

    console.log(`Searching for: ${query}`);
    
    const searchTerm = query.toLowerCase();
    const results = RECIPES.filter(recipe => 
        recipe.name.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.type.toLowerCase().includes(searchTerm) ||
        recipe.ingredients.some(ing => ing.toLowerCase().includes(searchTerm))
    );
    
    console.log(`Found ${results.length} results`);
    return results.map(recipe => ({
        ...recipe,
        id: `search_${recipe.id}`
    }));
}

// Get recipe details by ID
export async function getRecipeDetails(id) {
    console.log(`Getting details for recipe: ${id}`);
    
    // Extract base ID
    const baseId = parseInt(id.toString().replace(/\D/g, '')) || 1001;
    const recipe = RECIPES.find(r => r.id === baseId) || RECIPES[0];
    
    if (recipe) {
        console.log(`Found recipe: ${recipe.name}`);
        return {
            ...recipe,
            id: id // Keep original ID
        };
    }

    console.log('Recipe not found');
    return null;
}