// Define the MenuManager class to manage the behavior of a hamburger menu
export class MenuManager {
    constructor() {
        // Get references to DOM elements
        this.hamburger = document.getElementById('hamburger'); // The hamburger button
        this.hamburgerMenu = document.querySelector('.hamburger-menu'); // The menu container
        this.menuOverlay = document.querySelector('.menu-overlay'); // The overlay behind the menu
        this.menuCloseBtn = null; // Placeholder for the close button (created dynamically)
        
        // Initialize the menu manager
        this.init();
    }

    init() {
        // If the menu container doesn't exist, exit early
        if (!this.hamburgerMenu) return;
        
        // Create the menu header and set up event listeners
        this.createMenuHeader();
        this.setupEventListeners();
    }

    createMenuHeader() {
        // If the menu header already exists, do nothing
        if (this.hamburgerMenu.querySelector('.menu-header')) return;

        // Create a new menu header element
        const menuHeader = document.createElement('div');
        menuHeader.className = 'menu-header'; // Add a class for styling
        menuHeader.innerHTML = `
            <span class="menu-title">Menu</span>
            <button class="menu-close-btn" id="menu-close-btn" aria-label="Close menu">×</button>
        `;

        // Insert the menu header before the menu list
        const menuList = this.hamburgerMenu.querySelector('ul');
        this.hamburgerMenu.insertBefore(menuHeader, menuList);

        // Store a reference to the close button
        this.menuCloseBtn = document.getElementById('menu-close-btn');
    }

    setupEventListeners() {
        // Add a click event listener to the hamburger button to toggle the menu
        this.hamburger?.addEventListener('click', () => this.toggleMenu());
        
        // Add a click event listener to the close button to close the menu
        this.menuCloseBtn?.addEventListener('click', () => this.closeMenu());
        
        // Add a click event listener to the overlay to close the menu
        this.menuOverlay?.addEventListener('click', () => this.closeMenu());
        
        // Add a keydown event listener to close the menu when the ESC key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen()) {
                this.closeMenu();
            }
        });
    }

    toggleMenu() {
        // Toggle the menu open or closed based on its current state
        if (this.isMenuOpen()) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    openMenu() {
        // Add classes to open the menu and activate the overlay
        this.hamburgerMenu.classList.add('open');
        this.menuOverlay?.classList.add('active');
        document.body.classList.add('menu-open');
        
        // Focus on the close button for accessibility after a short delay
        setTimeout(() => this.menuCloseBtn?.focus(), 300);
    }

    closeMenu() {
        // Remove classes to close the menu and deactivate the overlay
        this.hamburgerMenu.classList.remove('open');
        this.menuOverlay?.classList.remove('active');
        document.body.classList.remove('menu-open');
        
        // Return focus to the hamburger button for accessibility
        this.hamburger?.focus();
    }

    isMenuOpen() {
        // Check if the menu is currently open
        return this.hamburgerMenu?.classList.contains('open') || false;
    }
}