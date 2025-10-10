// State management for explore page

let lastScrollTop = 0;
let scrollTimeout;
let currentFilter = 'all';
let currentSearch = '';

export function getState() {
    return { lastScrollTop, scrollTimeout, currentFilter, currentSearch };
}

export function setState(newState) {
    if (newState.lastScrollTop !== undefined) lastScrollTop = newState.lastScrollTop;
    if (newState.scrollTimeout !== undefined) scrollTimeout = newState.scrollTimeout;
    if (newState.currentFilter !== undefined) currentFilter = newState.currentFilter;
    if (newState.currentSearch !== undefined) currentSearch = newState.currentSearch;
}

export function resetState() {
    lastScrollTop = 0;
    scrollTimeout = null;
    currentFilter = 'all';
    currentSearch = '';
}
