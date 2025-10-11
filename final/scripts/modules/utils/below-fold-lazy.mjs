// Simple lazy loading for images below the fold - KISS implementation
// Uses existing placeholder.svg

/**
 * Initialize lazy loading only for images below the fold
 */
export function initBelowFoldLazyLoading() {
    // Only target images that are below the viewport initially
    const images = document.querySelectorAll('img[src*="recipes/"], img[src*="placeholder.svg"]');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '50px' // Load 50px before entering viewport
        });

        images.forEach(img => {
            // Only apply to images below the fold
            if (img.getBoundingClientRect().top > window.innerHeight) {
                const originalSrc = img.src;
                img.dataset.src = originalSrc;
                img.src = 'https://fpc25.github.io/wdd231/final/images/placeholder.svg';
                observer.observe(img);
            }
        });
    }
}

/**
 * Apply lazy loading to recipe images
 */
export function makeBelowFoldLazy(imgElement, realSrc) {
    if (!imgElement) return;
    
    // Check if image is below the fold
    if (imgElement.getBoundingClientRect().top > window.innerHeight) {
        imgElement.dataset.src = realSrc;
        imgElement.src = 'https://fpc25.github.io/wdd231/final/images/placeholder.svg';
        
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        observer.unobserve(img);
                    }
                });
            });
            observer.observe(imgElement);
        }
    } else {
        // Image is above the fold, load immediately
        imgElement.src = realSrc;
    }
}