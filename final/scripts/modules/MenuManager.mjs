/**
 * MenuManager - Handles ONLY menu UI interactions
 * Single Responsibility: Menu visibility and mobile behavior
 */
export class MenuManager {
    constructor() {
        this.menuButton = null;
        this.mobileMenu = null;
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.menuButton = document.getElementById('menu-btn');
        this.mobileMenu = document.getElementById('mobile-menu');
        
        if (this.menuButton && this.mobileMenu) {
            this.setupEventListeners();
        }
    }

    setupEventListeners() {
        // Menu toggle
        this.menuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleMenu();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.mobileMenu.contains(e.target)) {
                this.closeMenu();
            }
        });

        // Close on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Close on window resize (when menu becomes desktop)
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768 && this.isMenuOpen) {
                this.closeMenu();
            }
        });

        // Handle menu item clicks
        this.mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                this.closeMenu();
            });
        });
    }

    toggleMenu() {
        if (this.isMenuOpen) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        this.isMenuOpen = true;
        this.mobileMenu.classList.add('active');
        this.menuButton.setAttribute('aria-expanded', 'true');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Focus management
        this.mobileMenu.focus();
        
        this.dispatchMenuEvent('opened');
    }

    closeMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.classList.remove('active');
        this.menuButton.setAttribute('aria-expanded', 'false');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        this.dispatchMenuEvent('closed');
    }

    // Custom event for extensibility
    dispatchMenuEvent(action) {
        const event = new CustomEvent('menuStateChanged', {
            detail: { action, isOpen: this.isMenuOpen }
        });
        document.dispatchEvent(event);
    }

    // Public API
    getMenuState() {
        return this.isMenuOpen;
    }

    forceClose() {
        if (this.isMenuOpen) {
            this.closeMenu();
        }
    }
}

// Global instance
window.menuManager = new MenuManager();