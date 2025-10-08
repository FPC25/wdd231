/**
 * Recipe Management Test File
 * Test the new recipe management functionality
 */

// Test 1: Check if recipe management module loads correctly
async function testRecipeManagement() {
    try {
        const management = await import('./scripts/modules/recipe-management.mjs');
        console.log('✅ Recipe management module loaded successfully');
        
        // Test helper functions
        console.log('Testing isUserRecipe function:');
        console.log('User recipe (source: "user"):', management.isUserRecipe({source: "user"}));
        console.log('User recipe (isUserCreated: true):', management.isUserRecipe({isUserCreated: true}));
        console.log('API recipe (source: "Mother"):', management.isUserRecipe({source: "Mother"}));
        
        return true;
    } catch (error) {
        console.error('❌ Error loading recipe management:', error);
        return false;
    }
}

// Test 2: Check recipe data differentiation
async function testRecipeData() {
    try {
        const { loadRecipes, getRecipesData } = await import('./scripts/modules/recipe-data.mjs');
        await loadRecipes();
        const recipes = getRecipesData();
        
        console.log('📊 Recipe Data Analysis:');
        console.log('Total recipes:', recipes.length);
        
        const apiRecipes = recipes.filter(r => !r.isUserCreated && r.source !== "user");
        const userRecipes = recipes.filter(r => r.isUserCreated || r.source === "user");
        
        console.log('API recipes:', apiRecipes.length);
        console.log('User recipes:', userRecipes.length);
        
        if (apiRecipes.length > 0) {
            console.log('Sample API recipe:', apiRecipes[0].name, '- Source:', apiRecipes[0].source);
        }
        
        if (userRecipes.length > 0) {
            console.log('Sample user recipe:', userRecipes[0].name, '- Source:', userRecipes[0].source);
        }
        
        return true;
    } catch (error) {
        console.error('❌ Error testing recipe data:', error);
        return false;
    }
}

// Test 3: Check enhanced rendering
async function testEnhancedRendering() {
    try {
        const { createEnhancedRecipeCard } = await import('./scripts/modules/recipe-renderer.mjs');
        
        // Test with API recipe
        const apiRecipe = {
            id: 1,
            name: "Test API Recipe",
            source: "External API",
            difficulty: "easy",
            cookTime: {time: 30, unit: "minutes"},
            serves: 4,
            cover: "image",
            isFavorite: false,
            isSaved: false
        };
        
        // Test with user recipe
        const userRecipe = {
            id: 2,
            name: "My Test Recipe", 
            source: "user",
            difficulty: "medium",
            cookTime: {time: 45, unit: "minutes"},
            serves: 6,
            cover: "image",
            isFavorite: true,
            isSaved: true,
            isUserCreated: true
        };
        
        const apiCard = createEnhancedRecipeCard(apiRecipe);
        const userCard = createEnhancedRecipeCard(userRecipe);
        
        console.log('✅ Enhanced cards created successfully');
        console.log('API card contains copy button:', apiCard.includes('copy-btn'));
        console.log('User card is marked as user-recipe:', userCard.includes('user-recipe'));
        
        return true;
    } catch (error) {
        console.error('❌ Error testing enhanced rendering:', error);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🧪 Starting Recipe Management Tests...\n');
    
    const test1 = await testRecipeManagement();
    const test2 = await testRecipeData(); 
    const test3 = await testEnhancedRendering();
    
    console.log('\n📋 Test Results:');
    console.log('Recipe Management Module:', test1 ? '✅ PASS' : '❌ FAIL');
    console.log('Recipe Data Analysis:', test2 ? '✅ PASS' : '❌ FAIL');
    console.log('Enhanced Rendering:', test3 ? '✅ PASS' : '❌ FAIL');
    
    const allPassed = test1 && test2 && test3;
    console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
    
    return allPassed;
}

// Export for use in browser console
window.testRecipeManagement = runTests;

// Auto-run tests if not in production
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(runTests, 1000); // Run after page loads
    });
}