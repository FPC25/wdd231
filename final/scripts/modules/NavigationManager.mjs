/**
 * NavigationManager - Handles page navigation logic
 * Single Responsibility: Navigation and active page detection
 */
export class NavigationManager {
    constructor() {
        this.currentPage = this.getCurrentPage();
        this.init();
    }

    init() {
        this.updateActiveNavigation();
        this.setupNavigationListeners();
    }

    getCurrentPage() {
        const path = window.location.pathname;
        const page = path.split('/').pop() || 'index.html';
        
        // Normalize page names
        switch (page) {
            case '':
            case 'index.html':
                return 'home';
            case 'recipe.html':
                return 'create';
            case 'recipe-detail.html':
                return 'detail';
            case 'calculator.html':
                return 'calculator';
            default:
                return page.replace('.html', '');
        }
    }

    updateActiveNavigation() {
        // Update desktop navigation
        const desktopLinks = document.querySelectorAll('nav a[href]');
        desktopLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = this.getPageFromHref(href);
            
            if (linkPage === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        // Update mobile navigation
        const mobileLinks = document.querySelectorAll('#mobile-menu a[href]');
        mobileLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = this.getPageFromHref(href);
            
            if (linkPage === this.currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    getPageFromHref(href) {
        if (!href) return '';
        
        // Handle relative paths
        const page = href.split('/').pop() || 'index.html';
        
        switch (page) {
            case './':
            case './index.html':
            case 'index.html':
                return 'home';
            case './recipe.html':
            case 'recipe.html':
                return 'create';
            default:
                return page.replace('.html', '');
        }
    }

    setupNavigationListeners() {
        // Listen for page changes (for SPAs or programmatic navigation)
        window.addEventListener('popstate', () => {
            this.currentPage = this.getCurrentPage();
            this.updateActiveNavigation();
        });

        // Custom event for manual page changes
        document.addEventListener('pageChanged', (e) => {
            this.currentPage = e.detail.page;
            this.updateActiveNavigation();
        });
    }

    // Public API
    setActivePage(page) {
        this.currentPage = page;
        this.updateActiveNavigation();
        
        // Dispatch event for other components
        const event = new CustomEvent('pageChanged', {
            detail: { page }
        });
        document.dispatchEvent(event);
    }

    getActivePage() {
        return this.currentPage;
    }

    // Navigate programmatically
    navigateTo(href) {
        window.location.href = href;
    }

    // Go back
    goBack() {
        window.history.back();
    }
}

// Global instance
window.navigationManager = new NavigationManager();