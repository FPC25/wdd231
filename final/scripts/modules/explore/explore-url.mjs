// URL parameter handling for explore page

export function parseUrlParameters() {
    const urlParams = new URLSearchParams(window.location.search);
    return {
        searchParam: urlParams.get('search'),
        filterParam: urlParams.get('filter')
    };
}

export function updateUrl(search, filter) {
    const urlParams = new URLSearchParams(window.location.search);
    if (search !== undefined) urlParams.set('search', search);
    if (filter !== undefined) urlParams.set('filter', filter);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
}

export function getStateFromURL() {
    const { searchParam, filterParam } = parseUrlParameters();
    
    // Apply search parameter if exists
    if (searchParam) {
        const searchInput = document.getElementById('recipe-search');
        if (searchInput) {
            searchInput.value = searchParam;
        }
    }
    
    // Apply filter parameter if exists
    if (filterParam) {
        const filterSelect = document.getElementById('recipe-filter');
        if (filterSelect) {
            filterSelect.value = filterParam;
        }
    }
}
