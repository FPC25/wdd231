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
