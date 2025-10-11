// Lazy loading utility - KISS implementation
// Simple and effective lazy loading for all images

/**
 * Initialize lazy loading for all images
 */
export function initLazyLoading() {
    // Use Intersection Observer if available, fallback to immediate loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    observer.unobserve(img);
                }
            });
        });

        // Observe all lazy images
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for older browsers
        document.querySelectorAll('img[data-src]').forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
        });
    }
}

/**
 * Create lazy loading image HTML
 */
export function createLazyImage(src, alt, className = '', additionalAttrs = '') {
    return `<img 
        data-src="${src}" 
        alt="${alt}" 
        class="lazy ${className}"
        loading="lazy"
        ${additionalAttrs}
        src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23f0f0f0'/%3E%3C/svg%3E"
    >`;
}

/**
 * Update existing images to use lazy loading
 */
export function makeLazy(img, src) {
    if (img) {
        img.dataset.src = src;
        img.classList.add('lazy');
        img.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1' height='1'%3E%3Crect width='1' height='1' fill='%23f0f0f0'/%3E%3C/svg%3E";
    }
}