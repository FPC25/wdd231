// Navigation handling for calculator page

export function preselectRecipeFromUrl(recipeId) {
    const select = document.getElementById('recipe-select');
    const loadBtn = document.getElementById('load-recipe-btn');
    if (!select || !loadBtn) return;

    const option = select.querySelector(`option[value="${recipeId}"]`);
    if (!option) return;

    select.value = recipeId;
    loadBtn.disabled = false;
}