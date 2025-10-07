import { PageManager } from './modules/PageManager.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Index page loaded');
    
    try {
        // Inicializar gerenciador da página
        window.indexPageManager = new PageManager();
        
        console.log('Index page initialized successfully');
    } catch (error) {
        console.error('Error initializing index page:', error);
        // Show user-friendly error message
        const mainContent = document.querySelector('main');
        if (mainContent) {
            const errorPara = document.createElement('p');
            errorPara.className = 'error-message';
            errorPara.textContent = 'Failed to initialize page. Please refresh.';
            errorPara.setAttribute('role', 'alert');
            errorPara.setAttribute('aria-live', 'assertive');
            mainContent.replaceChildren(errorPara);
        }
    }
});