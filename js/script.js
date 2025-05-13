// IMPORTS
import { products, cart, wishlist, getProducts, addToCart, updateQuantity, deleteFromCart, deleteFromWishlist, toggleWishlist, calculateTotal, getProductById, filterCategories, searchFunctionality} from "./products.js";
import { loadCartFromLocalStorage, saveCartToLocalStorage, saveWishlistToLocalStorage, loginUser, registerUser, checkout } from './storage.js'

// DOM ELEMENTS
const elements = {
  productContainer: document.getElementById('allproducts'),
  wishlistContainer: document.getElementById('wishlist-products'),
  cartCount: document.getElementById('numberCount'),
  cartDialog: document.getElementById('cart-dialog'),
  wishlistDialog: document.getElementById('wishlist-dialog'),
  loginDialog: document.getElementById('login-dialog'),
  registerDialog: document.getElementById('register-dialog'),
  productDialog: document.getElementById('view-product-dialog'),
  productDetail: document.getElementById('product-detail'),
  submitRegister: document.getElementById('submit-register'),
  submitLogin: document.getElementById('submit-login'),
  registerName: document.getElementById('name'),
  registerSurname: document.getElementById('lastName'),
  registerEmail: document.getElementById('register-email'),
  registerPassword: document.getElementById('register-password'),
  confirmedPassword: document.getElementById('confirmed-password'),
  loginEmail: document.querySelector('#login-email'),
  loginPassword: document.querySelector('#login-password'),
  clearAllBtn: document.getElementById('clear-all-button'), 
  wishlistClearAllBtn: document.getElementById('wishlist-clear-all-btn'),
  searchInput: document.getElementById('searchInput'),
  searchBtn: document.getElementById('search')
};

function handleEventListeners() {
  // Cart modal
  document.getElementById('cart')?.addEventListener('click', () => {
    elements.cartDialog.showModal();
    renderCart();
  });

  // Wishlist modal
  document.getElementById('wishlist-btn')?.addEventListener('click', () => {
    elements.wishlistDialog.showModal();
    renderWishlist();
  });

  // Login modal
  document.getElementById('login')?.addEventListener('click', () => {
    elements.loginDialog.showModal();
  });

  // Register modal
  document.getElementById('register')?.addEventListener('click', () => {
    elements.registerDialog.showModal();
  });

  // Close buttons
  document.getElementById('close-view-modal')?.addEventListener('click', () => {
    elements.productDialog.close();
  });

  document.getElementById('cart-close-btn')?.addEventListener('click', () => {
    elements.cartDialog.close();
  });

  document.getElementById('close-wishlist-btn')?.addEventListener('click', () => {
    elements.wishlistDialog.close();
  });

  document.getElementById('register-back-btn')?.addEventListener('click', () => {
    elements.registerDialog.close();
  });

  document.getElementById('login-back-btn')?.addEventListener('click', () => {
    elements.loginDialog.close();
  });

  // Submit - login & register
  elements.submitRegister?.addEventListener('click', (event) => {
    event.preventDefault();
    registerUser(
      elements.registerName.value,
      elements.registerSurname.value,
      elements.registerEmail.value,
      elements.registerPassword.value,
      elements.confirmedPassword.value
    );
    elements.registerDialog.close();
  });

  elements.submitLogin?.addEventListener('click', (event) => {
    event.preventDefault();
    loginUser(elements.loginEmail.value, elements.loginPassword.value);

  });

  // Checkout
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    checkout();
  });

  // Clear - cart & wishlist
  elements.clearAllBtn?.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to clear your entire cart?');
    if (confirmed) {
      cart.length = 0;
      alert('Cart cleared');
      renderCart();
      updateCartCount()
    }
  });

  elements.wishlistClearAllBtn?.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to clear your entire wishlist?');
    if (confirmed) {
      wishlist.length = 0;
      alert('Wishlist cleared');
      renderWishlist();
    }
  });

  // Search
  elements.searchBtn?.addEventListener('click', () => {
    const query = elements.searchInput.value.trim();
    const filteredProducts = searchFunctionality(query);

    if (filteredProducts.length === 0) {
      elements.productContainer.innerHTML = `<p style="text-align: center; margin-top: 50px;">No matches found for "${query}"</p>`;
    } else {
      renderProducts(filteredProducts);
    }
  });

  // Category filter buttons
  document.getElementById('allCategoryBtn')?.addEventListener('click', () => {
    renderProducts(products); // Show all products
  });

  document.getElementById('furnitureCategoryBtn')?.addEventListener('click', () => {
    const filtered = filterCategories('furniture');
    renderProducts(filtered);
  });

  document.getElementById('beautyCategoryBtn')?.addEventListener('click', () => {
    const filtered = filterCategories('beauty');
    renderProducts(filtered);
  });

  document.getElementById('groceriesCategoryBtn')?.addEventListener('click', () => {
    const filtered = filterCategories('groceries');
    renderProducts(filtered);
  });

  document.getElementById('fragrancesCategoryBtn')?.addEventListener('click', () => {
    const filtered = filterCategories('fragrances');
    renderProducts(filtered);
  });
}

function renderProducts(productList = products) {
  if (!elements.productContainer) return;

  elements.productContainer.innerHTML = '';

  productList.forEach((item) => {
    const productElement = document.createElement('div');
    productElement.className = 'product';
    productElement.innerHTML = `
      <div class="product-image-container">
        <img class="product-image"
              id="product-image-${item.id}"
              src="${item.thumbnail}"
              alt="${item.title}"
              data-id="${item.id}"
              onerror="this.src='fallback-image.jpg';">
        <div class="discount">${item.discountPercentage}% OFF</div>
      </div>
      <div class="details">
        <div class="reviews"><i class="bi bi-star-fill"></i> ${item.rating}</div>
        <div class="title">${item.title}</div>
        <div class="price">R${(item.price - (item.price * item.discountPercentage/100)).toFixed(2)}</div>
        <div class="higher-price">R${item.price}</div>
      </div>
      <div class="btn-group">
        <button class="btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
        <button class="btn-primary wishlist-toggle" data-id="${item.id}">
          <i class="bi bi-heart${wishlist.some((p) => p.id === item.id) ? '-fill' : ''}"></i>
        </button>
      </div>
    `;

    elements.productContainer.appendChild(productElement);
  });

  elements.productContainer.addEventListener('click', handleProductClicks);
}

function renderProductDetails(productId) {
  if (!elements.productDetail) return;

  const product = getProductById(productId);
  if (!product) return; 

  let reviewsHTML = '<h3>Reviews</h3>'

      for (let i = 0; i < product.reviews.length; i++) {
        const item = product.reviews[i];
        reviewsHTML += `
          <div class="reviews" id=reviews>
            <p>${item.reviewerName}  (<strong>${item.reviewerEmail}</strong>)</p> 
            <p>Rating: ${item.rating}/5 STARS</p>
            <p>Comment: ${item.comment}</p>
            <div>
              <br>
            </div>
          </div>`
        }

        // Populate the modal with product details
        elements.productDetail.innerHTML = `
          <img class="product-image" src="${product.thumbnail}" alt="${product.title}">
          <div class="details">
            <div class="title"><h2>${product.title}</h2></div>
            <div class="price">R${(product.price - (product.price * (product.discountPercentage / 100))).toFixed(2)}</div>
            <div class="description">${product.description}</div>
            <div class="categoryName"><strong>Category: </strong>${product.category}</div>
            <div class="discount"><strong>Discount: </strong>${product.discountPercentage}%</div>
            <div class="rating"><strong>Rating: </strong>${product.rating} Stars</div>
            <div class="return-policy"><strong>Return Policy: </strong>${product.returnPolicy}</div>
            <div class="warrantyInformation"><strong>Warranty: </strong>${product.warrantyInformation}</div>
            <div class="stock"><strong>Product in Stock: </strong>${product.stock}</div>
            <div class="minimumOrderQuantity"><strong>Minimum Order Quantity: </strong>${product.minimumOrderQuantity}</div>
            <div class="btn-group">
              <button class="btn-primary add-to-cart" data-id="${product.id}">Add to Cart</button>
              <button class="btn-primary wishlist-toggle" data-id="${product.id}">
                <i class="bi bi-heart${wishlist.some((p) => p.id === product.id) ? '-fill' : ''}"></i>
              </button>
            </div>
            <div class="reviews" id=reviews>
              ${reviewsHTML}
            </div>
            
          </div>
        `;

  elements.productDialog.showModal(); // Show the product detail modal

  elements.productDetail.addEventListener('click', handleProductDetailClicks);
}

function renderCart() {
  const container = document.querySelector('.checkout-products');
  if (!container) return;

  container.innerHTML = cart.length === 0
    ? '<p style="text-align: center; margin-top: 50px;">Your cart is empty</p>'
    : cart.map(item => `
      <div class="a-product">
        <div class="left-product">
          <img src="${item.thumbnail}" style="width: 100px; height: 100px;" alt="${item.title}">
        </div>
        <div class="right-product">
          <p><strong>${item.title}</strong></p>
          <p>R ${((item.price - (item.price * item.discountPercentage/100)) * item.quantity).toFixed(2)}</p>
          <div class="counterProduct">
            <button class="decrementButton" style="border-radius:50%; padding: 0.75rem 1rem;" data-id="${item.id}">-</button>
            <span>${item.quantity}</span>
            <button class="incrementButton" style="border-radius:50%; padding: 0.75rem 1rem;" data-id="${item.id}">+</button>
          </div>
        </div>
      </div>
    `).join('');

  document.querySelectorAll('.decrementButton').forEach(btn => {
    btn.addEventListener('click', (event) => {
      updateQuantity(parseInt(event.currentTarget.dataset.id), -1);
      renderCart();
      updateCartUI();
      updateCartCount();
    });
  });

  document.querySelectorAll('.incrementButton').forEach(btn => {
    btn.addEventListener('click', (event) => {
      updateQuantity(parseInt(event.currentTarget.dataset.id), 1);
      renderCart();
      updateCartUI();
      updateCartCount();
    });
  });

  document.querySelector('.priceTotal').textContent = `R ${calculateTotal().toFixed(2)}`;
}

function renderWishlist() {
  if (!elements.wishlistContainer) return;

  elements.wishlistContainer.innerHTML = wishlist.length === 0
    ? '<p style="text-align: center; margin-top: 50px;">Your wishlist is empty</p>'
    : wishlist.map(item => `
      <div class="a-product-from-wishlist">
        <div class="wishlist-item-actions">
          <i class="bi bi-trash wishlist-remove" data-id="${item.id}"></i>
        </div>
        <img src="${item.thumbnail}" style="width: 100px; height: 100px;" alt="${item.title}">
        <div class="product-name-wishlist">
          <p>${item.title}</p>
        </div>
        <div class="wishlist-unit-price">
          <p>R ${(item.price - (item.price * item.discountPercentage/100)).toFixed(2)}</p>
        </div>
        <div class="wishlist-stock-status">
          <p>${item.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
        </div>
        <div class="wishlist-add-to-cart">
          <i class="bi bi-cart-plus wishlist-add-cart" data-id="${item.id}"></i>
        </div>
      </div>
    `).join('');

  document.querySelectorAll('.wishlist-remove').forEach(btn => {
    btn.addEventListener('click', (event) => {
      deleteFromWishlist(parseInt(event.currentTarget.dataset.id));
      renderWishlist();
      saveWishlistToLocalStorage()
    });
  });

  document.querySelectorAll('.wishlist-add-cart').forEach(btn => {
    btn.addEventListener('click', (event) => {
      addToCart(parseInt(event.currentTarget.dataset.id));
      updateCartUI();
    });
  });
}

function handleProductClicks(event) {
  const target = event.target.closest('[data-id]');
  if (!target) return;

  const productId = parseInt(target.dataset.id);

  if (target.classList.contains('add-to-cart')) {
    addToCart(productId);
    updateCartUI();
  } else if (target.classList.contains('wishlist-toggle')) {
    const added = toggleWishlist(productId);
    updateWishlistUI(target, added);
  } else if (target.classList.contains('product-image')) {
    renderProductDetails(productId);
  }
}

function handleProductDetailClicks(event){
  const target = event.target.closest('[data-id]');
  if (!target) return;

  const productId = parseInt(target.dataset.id);

  if (target.classList.contains('add-to-cart')) {
    addToCart(productId);
    updateCartUI();
  } else if (target.classList.contains('wishlist-toggle')) {
    const added = toggleWishlist(productId);
    updateWishlistUI(event.target, added);
  }
}

function updateCartUI() {
  if (elements.cartCount) {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    elements.cartCount.textContent = count;
  }
  saveCartToLocalStorage()
  updateCartCount();
}

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0); // Calculate total items in the cart
  const cartCounterDisplay = document.getElementById('numberCount'); // Get the cart counter display element

  if (cartCounterDisplay) {
    cartCounterDisplay.textContent = totalItems;

    if (totalItems === 0) {
      cartCounterDisplay.classList.add('empty'); 
      cartCounterDisplay.textContent = '0'; 
    } else {
      cartCounterDisplay.classList.remove('empty');
    }
  } else {
    console.error('Cart counter display element not found!');
  }
}

function updateWishlistUI(button, added) {
  const icon = button.querySelector('i');
  if (icon) {
    icon.classList.toggle('bi-heart', !added);
    icon.classList.toggle('bi-heart-fill', added);
  }
}

function userManagement() {
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const user = isLoggedIn ? JSON.parse(localStorage.getItem('currentUser')) : null;
  const userManagementElement = document.getElementById('user-management');
  const loginDialogContent = document.getElementById('login-dialog-content');
  const viewLoginDialog = document.getElementById('login-dialog');
  const viewRegisterDialog = document.getElementById('register-dialog');

  if (!userManagementElement) return;

  if (isLoggedIn && user) {
    // User is logged in
    userManagementElement.innerHTML = 
      `<i class="bi bi-person-circle" id="user-icon"></i>
      <p>${user.firstName}</p>`
    ;

    const userIcon = document.getElementById('user-icon');
    if (userIcon) {
      userIcon.addEventListener('click', () => {
        loginDialogContent.innerHTML = 
          `<h2>Welcome back, ${user.firstName}!</h2>
          <button id="logout-btn" class="btn-primary">Logout</button>`
        ;

        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('currentUser');
            alert('User successfully logged out');
            userManagement(); // Refresh UI
            viewLoginDialog.close();
          });
        }

        viewLoginDialog.showModal();
      });
}
  } else {
    // User is not logged in
    userManagementElement.innerHTML = 
      `<div>
        <a id="login">Login</a>
      </div>
      <div>
        <a id="register-btn">Register</a>
      </div>`
    ;

    // Handle login button click
    const loginButton = document.getElementById('login');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        loginDialogContent.innerHTML = 
          `<form id="login-form">
            <label for="login-email">Email:</label>
            <input type="email" id="login-email" required>
            <label for="login-password">Password:</label>
            <input type="password" id="login-password" required>
            <button type="submit" id="submit-login" class="btn-primary">Login</button>
          </form>`
        ;

        const loginForm = document.getElementById('login-form');
        if (loginForm) {
          loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const user = await loginUser(email, password);
            if (user) {
              userManagement(); // Update UI
              viewLoginDialog.close();
            }
          });
        }

        viewLoginDialog.showModal();
      });
    }

    // Handle register button click
    const registerButton = document.getElementById('register-btn');
    if (registerButton) {
      registerButton.addEventListener('click', () => {
        viewRegisterDialog.showModal();
      });
    }
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  try {
    loadCartFromLocalStorage();
    await getProducts();
    renderProducts();
    handleEventListeners();
    updateCartUI();
    userManagement();
  } catch (error) {
    console.error('Initialization error:', error);
  }
});