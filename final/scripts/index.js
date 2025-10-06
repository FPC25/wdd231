import { PageManager } from './modules/PageManager.mjs';

document.addEventListener('DOMContentLoaded', async function() {
    console.log('Index page loaded');
    
    try {
        // Inicializar gerenciador da página
        window.indexPageManager = new PageManager();
        
        console.log('Index page initialized successfully');
    } catch (error) {
        console.error('Error initializing index page:', error);
    }
});