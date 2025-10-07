// State management for index page

let currentSearch = '';

export function getState() {
    return { currentSearch };
}

export function setState(newState) {
    if (newState.currentSearch !== undefined) currentSearch = newState.currentSearch;
}