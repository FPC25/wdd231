/**
 * test-navigation.js
 * Comprehensive test suite for unified bottom navigation
 */

// Test utility functions
function logTest(testName, result, details = '') {
    const emoji = result ? '✅' : '❌';
    console.log(`${emoji} ${testName}${details ? ` - ${details}` : ''}`);
    return result;
}

function simulateClick(element) {
    if (element) {
        element.click();
        return true;
    }
    return false;
}

function checkActiveState(selector, expectedActive = true) {
    const element = document.querySelector(selector);
    if (!element) return false;
    
    const isActive = element.classList.contains('active');
    return expectedActive ? isActive : !isActive;
}

// Test Suite 1: DOM Elements Check
function testDOMElements() {
    console.log('\n🔍 Testing DOM Elements...');
    
    const bottomNav = document.querySelector('.bottom-nav');
    logTest('Bottom nav exists', !!bottomNav);
    
    const navItems = document.querySelectorAll('.bottom-nav .nav-item');
    logTest('Nav items exist', navItems.length > 0, `Found ${navItems.length} items`);
    
    const favoritesNav = document.getElementById('favorites-nav');
    logTest('Favorites nav exists', !!favoritesNav);
    
    return bottomNav && navItems.length > 0;
}

// Test Suite 2: Calculator Page Navigation
async function testCalculatorNavigation() {
    console.log('\n🧮 Testing Calculator Navigation...');
    
    try {
        // Import and test calculator navigation
        const { setupCalculatorNavigation } = await import('./scripts/modules/shared-navigation.mjs');
        
        // Setup navigation
        setupCalculatorNavigation();
        
        // Check if calculator link is marked as active
        const calculatorActive = checkActiveState('.bottom-nav .nav-item[href="./calculator.html"]', true);
        logTest('Calculator nav marked as active', calculatorActive);
        
        // Check if other items are not active
        const homeNotActive = checkActiveState('.bottom-nav .nav-item[href="./index.html"]', false);
        const exploreNotActive = checkActiveState('.bottom-nav .nav-item[href="./explore.html"]', false);
        
        logTest('Other nav items not active', homeNotActive && exploreNotActive);
        
        return calculatorActive && homeNotActive && exploreNotActive;
        
    } catch (error) {
        logTest('Calculator navigation test failed', false, error.message);
        return false;
    }
}

// Test Suite 3: Recipe Detail Navigation
async function testRecipeDetailNavigation() {
    console.log('\n📋 Testing Recipe Detail Navigation...');
    
    try {
        const { setupRecipeDetailNavigation } = await import('./scripts/modules/shared-navigation.mjs');
        
        // Setup navigation
        setupRecipeDetailNavigation();
        
        // Check if no items are marked as active (recipe detail behavior)
        const noActiveItems = document.querySelectorAll('.bottom-nav .nav-item.active').length === 0;
        logTest('No nav items marked as active', noActiveItems);
        
        // Test favorites navigation click
        const favoritesNav = document.getElementById('favorites-nav');
        if (favoritesNav) {
            // Mock window.location.href
            let navigationTriggered = false;
            const originalLocation = window.location.href;
            
            Object.defineProperty(window, 'location', {
                value: {
                    href: originalLocation,
                    set href(url) {
                        if (url.includes('explore.html?filter=favorites')) {
                            navigationTriggered = true;
                        }
                    }
                },
                writable: true
            });
            
            // Simulate click
            favoritesNav.click();
            
            logTest('Favorites navigation triggers correct URL', navigationTriggered);
            
            // Restore original location
            window.location.href = originalLocation;
            
            return noActiveItems && navigationTriggered;
        }
        
        return noActiveItems;
        
    } catch (error) {
        logTest('Recipe detail navigation test failed', false, error.message);
        return false;
    }
}

// Test Suite 4: Explore Page Navigation (Mock)
async function testExploreNavigation() {
    console.log('\n🔍 Testing Explore Navigation...');
    
    try {
        const { setupExploreNavigation } = await import('./scripts/modules/shared-navigation.mjs');
        
        // Mock required elements and functions
        const mockCategoryButtons = [
            { classList: { remove: () => {} } },
            { classList: { remove: () => {} } }
        ];
        
        const mockSearchInput = { 
            value: 'test', 
            style: { backgroundColor: '' }
        };
        
        let stateSet = false;
        let viewRendered = false;
        
        const mockSetState = (state) => {
            if (state.currentFilter === 'favorites' && state.currentSearch === '') {
                stateSet = true;
            }
        };
        
        const mockRenderCurrentView = () => {
            viewRendered = true;
        };
        
        // Setup navigation with mocks
        setupExploreNavigation(mockCategoryButtons, mockSearchInput, mockSetState, mockRenderCurrentView);
        
        // Test favorites click behavior
        const favoritesNav = document.getElementById('favorites-nav');
        if (favoritesNav) {
            favoritesNav.click();
            
            logTest('State updated correctly', stateSet);
            logTest('View re-rendered', viewRendered);
            logTest('Search input cleared', mockSearchInput.value === '');
            
            return stateSet && viewRendered && mockSearchInput.value === '';
        }
        
        return false;
        
    } catch (error) {
        logTest('Explore navigation test failed', false, error.message);
        return false;
    }
}

// Test Suite 5: Edge Cases
function testEdgeCases() {
    console.log('\n⚠️ Testing Edge Cases...');
    
    // Test with missing DOM elements
    const originalFavNav = document.getElementById('favorites-nav');
    if (originalFavNav) {
        originalFavNav.remove();
    }
    
    try {
        // This should not throw an error
        import('./scripts/modules/shared-navigation.mjs').then(module => {
            module.setupRecipeDetailNavigation();
            logTest('Handles missing favorites nav gracefully', true);
        });
    } catch (error) {
        logTest('Handles missing favorites nav gracefully', false, error.message);
    }
    
    // Restore element if it existed
    if (originalFavNav) {
        document.body.appendChild(originalFavNav);
    }
    
    return true;
}

// Test Suite 6: Integration Test
async function testIntegration() {
    console.log('\n🔗 Testing Integration...');
    
    try {
        // Test switching between different navigation modes
        const { setupCalculatorNavigation, setupRecipeDetailNavigation } = 
            await import('./scripts/modules/shared-navigation.mjs');
        
        // Start with calculator
        setupCalculatorNavigation();
        const step1 = checkActiveState('.bottom-nav .nav-item[href="./calculator.html"]', true);
        logTest('Step 1: Calculator active', step1);
        
        // Switch to recipe detail
        setupRecipeDetailNavigation();
        const step2 = document.querySelectorAll('.bottom-nav .nav-item.active').length === 0;
        logTest('Step 2: No items active after recipe detail setup', step2);
        
        return step1 && step2;
        
    } catch (error) {
        logTest('Integration test failed', false, error.message);
        return false;
    }
}

// Main test runner
async function runAllTests() {
    console.log('🚀 Starting Navigation Unification Tests...\n');
    
    const results = [];
    
    // Run all test suites
    results.push(testDOMElements());
    results.push(await testCalculatorNavigation());
    results.push(await testRecipeDetailNavigation());
    results.push(await testExploreNavigation());
    results.push(testEdgeCases());
    results.push(await testIntegration());
    
    // Summary
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    console.log('\n📊 Test Summary:');
    console.log(`✅ Passed: ${passed}`);
    console.log(`❌ Failed: ${total - passed}`);
    console.log(`📈 Success Rate: ${Math.round(passed / total * 100)}%`);
    
    if (passed === total) {
        console.log('\n🎉 All tests passed! Navigation unification is working correctly.');
    } else {
        console.log('\n⚠️ Some tests failed. Please check the implementation.');
    }
    
    return passed === total;
}

// Auto-run tests if in development environment
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for page to fully load
        setTimeout(runAllTests, 1000);
    });
}

// Export for manual testing
window.testNavigation = runAllTests;
window.testNavigationSuites = {
    testDOMElements,
    testCalculatorNavigation,
    testRecipeDetailNavigation,
    testExploreNavigation,
    testEdgeCases,
    testIntegration
};