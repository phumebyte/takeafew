// IMPORTS
import { products } from "./products.js";

// MODALS
const viewProductDialog = document.getElementById("view-product-dialog");
const closeProductDialog = document.getElementById("close-view-modal");

const viewCartModalBtn = document.getElementById('cart')
const viewCartDialog = document.getElementById('cart-dialog')
const closeCartDialog = document.getElementById('cart-close-btn')

  viewCartModalBtn.addEventListener('click', () => {
    viewCartDialog.showModal()
  })

  closeCartDialog.addEventListener('click', () => {
    viewCartDialog.close()
  })

  const viewWishlistBtn = document.getElementById('wishlist-btn')
  const viewWishlostDialog = document.getElementById('wishlist-dialog')
  const closeWishlistBtn = document.getElementById('close-wishlist-btn')

  viewWishlistBtn.addEventListener('click', () => {
    viewWishlostDialog.showModal()
  })

  closeWishlistBtn.addEventListener('click', () => {
    viewWishlostDialog.close()
  })

  const viewLoginBtn = document.getElementById('login')
  const viewLoginDialog = document.getElementById('login-dialog')
  const closeLoginBtn = document.getElementById('login-back-btn')

  viewLoginBtn.addEventListener('click', () => {
    viewLoginDialog.showModal()
  })

  closeLoginBtn.addEventListener('click', () => {
    viewLoginDialog.close()
  })

  const viewRegisterBtn = document.getElementById('register')
  const viewRegisterDialog = document.getElementById('register-dialog')
  const closeRegisterBtn = document.getElementById('register-back-btn')

  viewRegisterBtn.addEventListener('click', () => {
    viewRegisterDialog.showModal()
  })

  closeRegisterBtn.addEventListener('click', () => {
    viewRegisterDialog.close()
  })

// DISPLAYING MAIN CONTENT - PRODUCTS
const allProductsDiv = document.getElementById('allproducts');

products.forEach(product => {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  productDiv.innerHTML = `
    <img class="product-image" src="${product.thumbnail}" alt="${product.title}">
    <div class="discount">${product.discountPercentage}%</div>
    <div class="details">
      <div class="reviews"><i class="bi bi-star-fill"></i> ${product.rating}</div>
      <div class="title">${product.title}</div>
      <div class="price-div">
        <div class="price">R${product.price}</div>
        <div class="higher-price">${product.higherPrice}</div>
      </div>
      <div class="btn-group">
        <button class="btn-primary">Add to Cart</button>
      </div>
    </div>
  `;

  // View product modal when clicking on the product image
  const viewProductModalBtn = productDiv.querySelector('.product-image');
  viewProductModalBtn.addEventListener('click', () => {
    viewProductDialog.showModal();
  });

  allProductsDiv.appendChild(productDiv);
});

// Close product details view dialog
closeProductDialog.addEventListener('click', () => {
  viewProductDialog.close();
});