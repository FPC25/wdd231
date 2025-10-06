import { RecipeManager } from './modules/RecipeManager.mjs';

let recipeManager;

document.addEventListener('DOMContentLoaded', async function() {
    recipeManager = new RecipeManager();
    await recipeManager.loadRecipes();
    
    initializeForm();
    addEventListeners();
    loadDraftIfExists();
});

function initializeForm() {
    const container = document.getElementById('ingredients-container');
    recipeManager.addIngredientRow(container);
    
    document.getElementById('serves').value = 1;
    document.getElementById('cook-time').value = 30;
    document.getElementById('time-unit').value = 'minutes';
    
    setupImagePreviewClick();
}

function addEventListeners() {
    document.getElementById('back-btn').addEventListener('click', () => window.history.back());
    document.getElementById('add-ingredient-btn').addEventListener('click', () => {
        const container = document.getElementById('ingredients-container');
        recipeManager.addIngredientRow(container);
    });
    
    document.getElementById('recipe-form').addEventListener('submit', handleFormSubmit);
    document.getElementById('save-draft-btn').addEventListener('click', saveDraft);
    
    const imageInput = document.getElementById('cover-image');
    if (imageInput) {
        imageInput.addEventListener('change', handleImageUpload);
    }
}

function handleFormSubmit(event) {
    event.preventDefault();
    
    if (!validateForm()) return;
    
    const recipeData = recipeManager.collectFormData();
    
    try {
        recipeManager.saveRecipe(recipeData);
        recipeManager.dataService.deleteDraft(); // Clear draft
        alert('Recipe saved successfully!');
        window.location.href = './index.html';
    } catch (error) {
        console.error('Error saving recipe:', error);
        alert('Error saving recipe. Please try again.');
    }
}

function saveDraft() {
    if (!document.getElementById('recipe-name').value.trim()) {
        alert('Please enter at least a recipe name before saving draft');
        return;
    }
    
    const draftData = recipeManager.collectFormData();
    recipeManager.saveDraft(draftData);
    alert('Draft saved successfully!');
}

function loadDraftIfExists() {
    const draft = recipeManager.getDraft();
    if (draft) {
        if (confirm('You have a saved draft. Would you like to continue editing it?')) {
            populateForm(draft);
        } else {
            recipeManager.dataService.deleteDraft();
        }
    }
}

function validateForm() {
    const name = document.getElementById('recipe-name').value.trim();
    const difficulty = document.getElementById('difficulty').value;
    const cookTime = document.getElementById('cook-time').value;
    const instructions = document.getElementById('instructions').value.trim();
    
    if (!name) return alert('Please enter a recipe name'), false;
    if (!difficulty) return alert('Please select a difficulty level'), false;
    if (!cookTime || cookTime <= 0) return alert('Please enter a valid cook time'), false;
    if (!instructions) return alert('Please enter cooking instructions'), false;
    
    const ingredientRows = document.querySelectorAll('.ingredient-row');
    let hasValidIngredient = false;
    
    ingredientRows.forEach(row => {
        const quantity = row.querySelector('.quantity-input').value.trim();
        const item = row.querySelector('.ingredient-input').value.trim();
        if (quantity && item) hasValidIngredient = true;
    });
    
    if (!hasValidIngredient) return alert('Please add at least one ingredient'), false;
    return true;
}

function populateForm(recipeData) {
    document.getElementById('recipe-name').value = recipeData.name;
    document.getElementById('source').value = recipeData.source;
    document.getElementById('difficulty').value = recipeData.difficulty;
    document.getElementById('serves').value = recipeData.serves;
    document.getElementById('cook-time').value = recipeData.cookTime.time;
    document.getElementById('time-unit').value = recipeData.cookTime.unit;
    document.getElementById('mark-favorite').checked = recipeData.isFavorite || false;
    
    recipeData.filters.forEach(filter => {
        const checkbox = document.querySelector(`#filters-group input[value="${filter}"]`);
        if (checkbox) checkbox.checked = true;
    });
    
    document.getElementById('instructions').value = recipeData.instructions.join('\n');
    
    const container = document.getElementById('ingredients-container');
    container.innerHTML = '';
    recipeData.ingredients.forEach(ingredient => {
        recipeManager.addIngredientRow(container);
        const lastRow = container.querySelector('.ingredient-row:last-child');
        lastRow.querySelector('.quantity-input').value = ingredient.quantity;
        lastRow.querySelector('.ingredient-input').value = ingredient.item;
        lastRow.querySelector('.unit-input').value = ingredient.unit || '';
    });
    
    if (recipeData.cover && recipeData.cover !== "image" && recipeData.cover.startsWith('data:')) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `
            <img src="${recipeData.cover}" alt="Recipe preview" class="recipe-preview-img" loading="lazy">
            <button type="button" class="remove-image-btn" onclick="removeImageSimple()">×</button>
        `;
        preview.classList.add('has-image');
    }
}

function setupImagePreviewClick() {
    const preview = document.getElementById('image-preview');
    const fileInput = document.getElementById('cover-image');
    
    preview.addEventListener('click', function(e) {
        if (!preview.classList.contains('has-image')) {
            fileInput.click();
        }
    });
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('image-preview');
    
    if (!file) return;
    
    const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validFormats.includes(file.type)) {
        alert('Please upload a valid image format (JPG, PNG, or WebP)');
        event.target.value = '';
        return;
    }
    
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
        alert('Image size must be less than 5MB');
        event.target.value = '';
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `
            <img src="${e.target.result}" alt="Recipe preview" class="recipe-preview-img" loading="lazy">
            <button type="button" class="remove-image-btn" onclick="removeImageSimple()">×</button>
        `;
        preview.classList.add('has-image');
        event.target.value = '';
    };
    reader.readAsDataURL(file);
}

function removeImageSimple() {
    const imagePreview = document.querySelector('.image-preview');
    const imageInput = document.getElementById('cover-image');
    
    if (imagePreview) {
        imagePreview.innerHTML = `
            <img src="./images/camera.svg" alt="camera icon" id="camera-icon">
            <span>Upload cover image</span>
            <small>JPG, PNG up to 5MB</small>
        `;
        imagePreview.classList.remove('has-image');
    }
    
    if (imageInput) {
        imageInput.value = '';
    }
}