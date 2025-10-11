// DOM manipulation functions for recipes

// Opções de quantidade para ingredientes
export const quantityOptions = [
    'to taste',
    '1/8', '1/4', '1/3', '3/8', '1/2', '2/3', '5/8', '3/4', '7/8',
    '1', '1 1/4', '1 1/3', '1 1/2', '1 2/3', '1 3/4',
    '2', '2 1/4', '2 1/3', '2 1/2', '2 2/3', '2 3/4',
    '3', '4', '5', '6', '7', '8', '9', '10'
];

// Opções de unidades para ingredientes (SINCRONIZADAS com calculator)
export const unitOptions = [
    // Peso
    { value: 'g', text: 'gram(s)' },
    { value: 'kg', text: 'kg' },
    { value: 'lb', text: 'pound(s)' },
    { value: 'oz', text: 'ounce(s)' },
    
    // Volume
    { value: 'ml', text: 'ml' },
    { value: 'l', text: 'liter(s)' },
    { value: 'cup', text: 'cup(s)' },
    { value: 'tbsp', text: 'tablespoon(s)' },
    { value: 'tsp', text: 'teaspoon(s)' },
    { value: 'fl oz', text: 'fl oz' },
    { value: 'pint', text: 'pint(s)' },
    { value: 'quart', text: 'quart(s)' },
    { value: 'gallon', text: 'gallon(s)' },
    
    // Unidade
    { value: 'piece', text: 'piece(s)' }
];

// Atualiza todos os botões de uma receita específica
export function updateAllButtons(recipeId, isFavorite, isSaved) {
    const favoriteButtons = document.querySelectorAll(`[data-recipe-id="${recipeId}"][data-action="favorite"]`);
    const saveButtons = document.querySelectorAll(`[data-recipe-id="${recipeId}"][data-action="save"]`);
    
    favoriteButtons.forEach(btn => {
        btn.classList.toggle('active', isFavorite);
    });
    
    saveButtons.forEach(btn => {
        btn.classList.toggle('active', isSaved);
        const img = btn.querySelector('img');
        if (img) {
            img.src = isSaved ? './images/check.svg' : './images/plus.svg';
            img.alt = isSaved ? 'Saved' : 'Save';
        }
    });
}

// Inicializa o formulário com valores padrão
export function initializeForm() {
    document.getElementById('serves').value = 1;
    document.getElementById('cook-time').value = 30;
    document.getElementById('time-unit').value = 'minutes';
    
    setupImagePreviewClick();
}

// Configura comportamento do select de dificuldade
export function setupDifficultySelect() {
    const difficultySelect = document.getElementById('difficulty');
    
    difficultySelect.addEventListener('change', function() {
        const defaultOption = this.querySelector('option[value=""]');
        
        if (this.value !== '') {
            defaultOption.disabled = true;
            defaultOption.style.display = 'none';
        }
    });
}

// Configura clique na área de preview da imagem
export function setupImagePreviewClick() {
    const preview = document.getElementById('image-preview');
    const fileInput = document.getElementById('cover-image');
    
    if (preview && fileInput) {
        preview.addEventListener('click', function(e) {
            if (!preview.classList.contains('has-image')) {
                fileInput.click();
            }
        });
    }
}

// Adiciona nova linha de ingrediente
export function addIngredientRow() {
    const container = document.getElementById('ingredients-container');
    
    const unitOptionsHTML = unitOptions.map(option => 
        `<option value="${option.value}">${option.text}</option>`
    ).join('');

    const ingredientRow = document.createElement('div');
    ingredientRow.className = 'ingredient-row';
    ingredientRow.innerHTML = `
        <div class="quantity-container">
            <label>Quantity</label>
            <div class="quantity-input-group">
                <input type="number" class="quantity-input" placeholder="Amount" step="0.25" min="0">
                <button type="button" class="to-taste-btn" data-active="false">To Taste</button>
            </div>
        </div>
        <div>
            <label>Unit</label>
            <select class="unit-input">
                ${unitOptionsHTML}
            </select>
        </div>
        <div>
            <label>Ingredient</label>
            <input type="text" class="ingredient-input" placeholder="e.g., flour, sugar">
        </div>
        <button type="button" class="remove-ingredient btn btn-danger flex-center" onclick="removeIngredientRow(this)">×</button>
    `;

    container.appendChild(ingredientRow);

    // Setup quantity input behavior
    setupQuantityInputBehavior(ingredientRow);
}

// Setup quantity input behavior for numeric/to taste toggle
function setupQuantityInputBehavior(ingredientRow) {
    const quantityInput = ingredientRow.querySelector('.quantity-input');
    const toTasteBtn = ingredientRow.querySelector('.to-taste-btn');
    const unitSelect = ingredientRow.querySelector('.unit-input');
    
    // Handle "To Taste" button click
    toTasteBtn.addEventListener('click', function() {
        const isActive = this.dataset.active === 'true';
        
        if (!isActive) {
            // Activate "to taste" mode
            this.dataset.active = 'true';
            this.classList.add('active');
            this.textContent = '✓ To Taste';
            quantityInput.value = '';
            quantityInput.disabled = true;
            quantityInput.placeholder = 'To taste selected';
            unitSelect.value = '';
            unitSelect.disabled = true;
            unitSelect.classList.add('disabled-gray');
        } else {
            // Deactivate "to taste" mode
            this.dataset.active = 'false';
            this.classList.remove('active');
            this.textContent = 'To Taste';
            quantityInput.disabled = false;
            quantityInput.placeholder = 'Amount';
            unitSelect.disabled = false;
            unitSelect.classList.remove('disabled-gray');
            quantityInput.focus();
        }
    });
    
    // Handle numeric input changes
    quantityInput.addEventListener('input', function() {
        if (this.value && toTasteBtn.dataset.active === 'true') {
            // If user types in input while "to taste" is active, deactivate it
            toTasteBtn.dataset.active = 'false';
            toTasteBtn.classList.remove('active');
            toTasteBtn.textContent = 'To Taste';
            unitSelect.disabled = false;
            unitSelect.classList.remove('disabled-gray');
        }
    });
    
    // Validate numeric input
    quantityInput.addEventListener('blur', function() {
        if (this.value && isNaN(this.value) && this.value !== 'to taste') {
            alert('Please enter a valid number or use "To Taste" button');
            this.focus();
        }
    });
}

// Remove linha de ingrediente
export function removeIngredientRow(button) {
    const row = button.closest('.ingredient-row');
    row.remove();
}

// Manipula upload de imagem
export function handleImageUpload(event) {
    event.preventDefault();
    event.stopPropagation();
    
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
            <img src="${e.target.result}" alt="Recipe preview"  loading="lazy" style="
                width: 100%; 
                height: 100%; 
                object-fit: cover; 
                border-radius: 8px;
                position: relative;
                
            ">
            <button type="button" class="remove-image-btn" onclick="removeImageSimple()" style="
                position: absolute;
                top: 8px;
                right: 8px;
                background: rgba(255, 0, 0, 0.8);
                color: white;
                border: none;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                cursor: pointer;
                z-index: 3;
                font-weight: bold;
            ">×</button>
        `;
        
        preview.classList.add('has-image');
        
        setTimeout(() => {
            event.target.value = '';
        }, 100);
    };
    
    reader.onerror = function() {
        alert('Error reading the image file');
        event.target.value = '';
    };
    
    reader.readAsDataURL(file);
}

// Remove imagem de forma simples
export function removeImageSimple() {
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

// Popula formulário com dados da receita
export function populateForm(recipeData) {
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
    
    document.getElementById('ingredients-container').innerHTML = '';
    recipeData.ingredients.forEach(ingredient => {
        addIngredientRow();
        const lastRow = document.querySelector('.ingredient-row:last-child');
        const quantityInput = lastRow.querySelector('.quantity-input');
        const toTasteBtn = lastRow.querySelector('.to-taste-btn');
        const unitSelect = lastRow.querySelector('.unit-input');
        
        // Set ingredient name
        lastRow.querySelector('.ingredient-input').value = ingredient.item;
        
        // Handle quantity - check if it's "to taste"
        if (ingredient.quantity === 'to taste') {
            // Activate "to taste" mode
            toTasteBtn.dataset.active = 'true';
            toTasteBtn.classList.add('active');
            toTasteBtn.textContent = '✓ To Taste';
            quantityInput.value = '';
            quantityInput.disabled = true;
            quantityInput.placeholder = 'To taste selected';
            unitSelect.value = '';
            unitSelect.disabled = true;
            unitSelect.classList.add('disabled-gray');
        } else {
            // Set numeric quantity
            quantityInput.value = ingredient.quantity;
            unitSelect.value = ingredient.unit || '';
        }
    });
    
    // UPDATED: Remove inline styles from image preview
    if (recipeData.cover && recipeData.cover !== "image" && recipeData.cover.startsWith('data:')) {
        const preview = document.getElementById('image-preview');
        preview.innerHTML = `
            <img src="${recipeData.cover}" alt="Recipe preview"  class="recipe-preview-img"  loading="lazy">
            <button type="button" class="remove-image-btn" onclick="removeImageSimple()">×</button>
        `;
        preview.classList.add('has-image');
    }
}

// Mostra estado de erro - FIX: melhor gerenciamento de estados
export function showError() {
    // Esconder loading e mostrar erro
    const loadingState = document.getElementById('loading-state');
    const errorState = document.getElementById('error-state');
    const recipeContent = document.getElementById('recipe-content');
    const pageTitle = document.getElementById('page-title');
    const headerTitle = document.getElementById('recipe-header-title');
    
    if (loadingState) {
        loadingState.style.display = 'none';
    }
    if (recipeContent) {
        recipeContent.style.display = 'none';
        recipeContent.classList.remove('show');
    }
    if (errorState) {
        errorState.style.display = 'block';
        errorState.classList.add('show');
    }
    if (pageTitle) {
        pageTitle.textContent = 'Recipe Not Found - Flavorfy';
    }
    if (headerTitle) {
        headerTitle.textContent = 'Recipe Not Found';
    }
}
