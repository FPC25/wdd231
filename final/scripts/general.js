import { MenuManager } from './modules/MenuManager.mjs';
import { NavigationManager } from './modules/NavigationManager.mjs';
import { DateManager } from './modules/DateManager.mjs';

// Initialize managers
const menuManager = new MenuManager();
const navigationManager = new NavigationManager();
const dateManager = new DateManager();

document.addEventListener('DOMContentLoaded', function() {
    // Update copyright year
    updateCopyrightYear();
    
    // Set up global event listeners
    setupGlobalEventListeners();
    
    // Initialize page-specific functionality
    initializePageFeatures();
});

function updateCopyrightYear() {
    const currentYear = dateManager.getCurrentYear();
    const copyrightElement = document.getElementById('current-year');
    if (copyrightElement) {
        copyrightElement.textContent = currentYear;
    }
}

function setupGlobalEventListeners() {
    // Menu state changes
    document.addEventListener('menuStateChanged', (e) => {
        const { action, isOpen } = e.detail;
        console.log(`Menu ${action}:`, isOpen);
        
        // Add any global menu-related logic here
        if (action === 'opened') {
            // Could pause videos, stop animations, etc.
        }
    });

    // Page changes
    document.addEventListener('pageChanged', (e) => {
        const { page } = e.detail;
        console.log('Page changed to:', page);
        
        // Add any global page-change logic here
        // Could update analytics, reset forms, etc.
    });

    // Search changes (if search is available)
    document.addEventListener('searchChanged', (e) => {
        const { searchTerm } = e.detail;
        console.log('Search changed to:', searchTerm);
        
        // Could update URL, save search history, etc.
    });
}

function initializePageFeatures() {
    // Back button functionality (if exists)
    const backButtons = document.querySelectorAll('[data-action="back"], .back-btn');
    backButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            navigationManager.goBack();
        });
    });

    // External link handling
    const externalLinks = document.querySelectorAll('a[href^="http"]');
    externalLinks.forEach(link => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
    });

    // Form validation helpers
    setupFormHelpers();
    
    // Accessibility improvements
    setupAccessibilityFeatures();
}

function setupFormHelpers() {
    // Auto-trim inputs
    const textInputs = document.querySelectorAll('input[type="text"], textarea');
    textInputs.forEach(input => {
        input.addEventListener('blur', () => {
            input.value = input.value.trim();
        });
    });

    // Prevent form double-submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        let isSubmitting = false;
        
        form.addEventListener('submit', (e) => {
            if (isSubmitting) {
                e.preventDefault();
                return false;
            }
            
            isSubmitting = true;
            
            // Reset after 3 seconds (safety net)
            setTimeout(() => {
                isSubmitting = false;
            }, 3000);
        });
    });
}

function setupAccessibilityFeatures() {
    // Skip to main content
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.querySelector('main');
    
    if (skipLink && mainContent) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView();
        });
    }

    // Focus management for dialogs/modals
    document.addEventListener('keydown', (e) => {
        // Escape key closes modals
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.active, .popup.active');
            if (activeModal) {
                const closeButton = activeModal.querySelector('.close, [data-action="close"]');
                if (closeButton) {
                    closeButton.click();
                }
            }
        }
    });
}

// Utility functions
window.GlobalUtils = {
    dateManager,
    navigationManager,
    menuManager,
    
    // Helper functions
    formatDate: (date, format) => dateManager.formatDate(date, format),
    goBack: () => navigationManager.goBack(),
    closeMenu: () => menuManager.forceClose(),
    
    // Debug helpers
    getCurrentPage: () => navigationManager.getActivePage(),
    getMenuState: () => menuManager.getMenuState()
};

// Export for modules that need it
export { menuManager, navigationManager, dateManager };