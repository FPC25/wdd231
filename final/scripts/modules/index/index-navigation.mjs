// Navigation handling for index page

export function performSearch(searchTerm) {
    if (searchTerm) {
        window.location.href = `./explore.html?search=${encodeURIComponent(searchTerm)}`;
    }
}