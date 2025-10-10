// Scroll behavior for explore page

import { getState, setState } from './explore-state.mjs';

export function throttle(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

export function handleScroll(bottomNav) {
    const { lastScrollTop, scrollTimeout } = getState();
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    clearTimeout(scrollTimeout);

    if (currentScroll <= 0) {
        bottomNav.classList.remove('hidden');
        setState({ lastScrollTop: 0 });
        return;
    }

    if (currentScroll > lastScrollTop) {
        bottomNav.classList.add('hidden');
    } else if (currentScroll < lastScrollTop) {
        bottomNav.classList.remove('hidden');
    }

    setState({ lastScrollTop: currentScroll });

    if (bottomNav.classList.contains('hidden')) {
        const timeout = setTimeout(() => {
            bottomNav.classList.remove('hidden');
        }, 2000);
        setState({ scrollTimeout: timeout });
    }
}

export function initializeScrollBehavior(bottomNav) {
    window.addEventListener('scroll', throttle(() => handleScroll(bottomNav), 100));
}