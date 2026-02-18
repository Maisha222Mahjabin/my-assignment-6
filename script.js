// Global Variables
let products = [];
let categories = [];
let cart = [];
let currentCategory = 'all';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const trendingGrid = document.getElementById('trendingGrid');
const categoryButtons = document.getElementById('categoryButtons');
const loading = document.getElementById('loading');
const modal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const cartSidebar = document.getElementById('cartSidebar');
const cartBtn = document.getElementById('cartBtn');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');

// API Base URL
const API_BASE = 'https://fakestoreapi.com';

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    initializeApp();
});

// Initialize Application
async function initializeApp() {
    try {
        await Promise.all([
            loadCategories(),
            loadProducts()
        ]);
        setupEventListeners();
        hideLoading();
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to load products. Please try again later.');
    }
}

// Load Categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_BASE}/products/categories`);
        categories = await response.json();
        renderCategories();
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load Products
async function loadProducts(category = 'all') {
    showLoading();
    try {
        const url = category === 'all' 
            ? `${API_BASE}/products` 
            : `${API_BASE}/products/category/${category}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        products = data;
        renderProducts();
        renderTrendingProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Failed to load products. Please try again.');
    } finally {
        hideLoading();
    }
}

// Render Categories
function renderCategories() {
    const categoriesHTML = ['all', ...categories].map(category => 
        `<button class="category-btn" data-category="${category}">
            ${category === 'all' ? 'All' : capitalizeFirst(category)}
        </button>`
    ).join('');
    
    categoryButtons.innerHTML = categoriesHTML;
}

// Render Products
function renderProducts() {
    if (products.length === 0) {
        productsGrid.innerHTML = '<p class="no-products">No products found.</p>';
        return;
    }
    
    const productsHTML = products.map(product => createProductCard(product)).join('');
    productsGrid.innerHTML = productsHTML;
    addProductEventListeners();
}

// Render Trending Products
function renderTrendingProducts() {
    const trendingProducts = products
        .sort((a, b) => b.rating.rate - a.rating.rate)
        .slice(0, 8);
    
    const trendingHTML = trendingProducts.map(product => createProductCard(product)).join('');
    trendingGrid.innerHTML = trendingHTML;
    addTrendingEventListeners();
}

// Create Product Card HTML
function createProductCard(product) {
    return `
        <div class="product-card" data-id="${product.id}">
            <div class="image-container">
                <img src="${product.image}" alt="${product.title}" class="product-image">
            </div>
            <div class="product-info">
                <div class="meta-row">
                    <div class="product-category">${capitalizeFirst(product.category)}</div>
                    <div class="product-rating">
                        <span>⭐</span> <span>${product.rating.rate}</span> <span>(${product.rating.count})</span>
                    </div>
                </div>
                <h3 class="product-title">${product.title}</h3>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="button-group">
                    <button class="btn-details" data-id="${product.id}"><i class="fas fa-eye"></i> Details</button>
                    <button class="btn-add" data-id="${product.id}"><i class="fas fa-shopping-cart"></i> Add</button>
                </div>
            </div>
        </div>
    `;
}

// Add Event Listeners
function addProductEventListeners() {
    productsGrid.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', () => showProductDetails(btn.dataset.id));
    });
    
    productsGrid.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });
}

function addTrendingEventListeners() {
    trendingGrid.querySelectorAll('.btn-details').forEach(btn => {
        btn.addEventListener('click', () => showProductDetails(btn.dataset.id));
    });
    
    trendingGrid.querySelectorAll('.btn-add').forEach(btn => {
        btn.addEventListener('click', () => addToCart(btn.dataset.id));
    });
}

// Show Product Details
async function showProductDetails(productId) {
    try {
        const response = await fetch(`${API_BASE}/products/${productId}`);
        const product = await response.json();
        
        modalBody.innerHTML = `
            <div class="modal-body">
                <img src="${product.image}" alt="${product.title}" class="modal-image">
                <div class="modal-info">
                    <h3>${product.title}</h3>
                    <div class="modal-price">$${product.price.toFixed(2)}</div>
                    <div class="modal-category">${capitalizeFirst(product.category)}</div>
                    <div class="modal-rating">
                        <span>⭐</span> <span>${product.rating.rate}</span> <span>(${product.rating.count} reviews)</span>
                    </div>
                    <div class="modal-description">${product.description}</div>
                    <div class="modal-actions">
                        <button class="btn btn-primary" onclick="addToCart(${product.id})"><i class="fas fa-shopping-cart"></i> Add</button>
                        <button class="btn btn-secondary" onclick="buyNow(${product.id})">Buy Now</button>
                    </div>
                </div>
            </div>
        `;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error loading product details:', error);
        showError('Failed to load product details.');
    }
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id == productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id == productId);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    updateCart();
    saveCartToStorage();
    showNotification(`${product.title} added to cart!`);
}

// Update Cart
function updateCart() {
    cartItems.innerHTML = '';
    let total = 0;
    let count = 0;
    
    cart.forEach(item => {
        total += item.price * item.quantity;
        count += item.quantity;
        
        const cartItemHTML = `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="remove-btn" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
        cartItems.innerHTML += cartItemHTML;
    });
    
    cartTotal.textContent = `$${total.toFixed(2)}`;
    cartCount.textContent = count;
}

// Update Quantity
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id == productId);
    if (!item) return;
    
    item.quantity += change;
    
    if (item.quantity <= 0) {
        removeFromCart(productId);
    } else {
        updateCart();
        saveCartToStorage();
    }
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id != productId);
    updateCart();
    saveCartToStorage();
}

// Setup Event Listeners
function setupEventListeners() {
    // Category buttons
    categoryButtons.addEventListener('click', (e) => {
        if (e.target.classList.contains('category-btn')) {
            const category = e.target.dataset.category;
            
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            currentCategory = category;
            loadProducts(category);
            
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Modal close
    modalClose.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    
    // Cart sidebar
    cartBtn.addEventListener('click', openCartSidebar);
    cartClose.addEventListener('click', closeCartSidebar);
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Cart Functions
function openCartSidebar() {
    cartSidebar.classList.add('open');
}

function closeCartSidebar() {
    cartSidebar.classList.remove('open');
}

function buyNow(productId) {
    addToCart(productId);
    openCartSidebar();
}

// Storage Functions
function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Utility Functions
function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        background: #5D3CF3;
        color: white;
        padding: 1rem;
        text-align: center;
        margin: 1rem 0;
        border-radius: 5px;
    `;
    
    document.querySelector('.container').appendChild(errorDiv);
    setTimeout(() => errorDiv.remove(), 3000);
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #5D3CF3;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 5px;
        z-index: 4000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
