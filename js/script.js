// IMPORTS
import { cart, products, getProducts, removeFromWishlist, addToCartFromWishlist, wishlist, updateQuantity, addToCart, addToWishlist } from "./products.js";

document.addEventListener('DOMContentLoaded', () => {
  // Fetch cart from local storage
  const storedCart = localStorage.getItem('cart')
  if (storedCart) {
    cart.length = 0 // Clear the cart array before pushing new items
    const parsedCart = JSON.parse(storedCart)
    cart.push(...parsedCart)
  }

  getProducts();
  displayWishlist(wishlist);
  updateCartCount();
  updateUserManagement();

  // Use event delegation for product container
  const productContainer = document.getElementById('allproducts');
  if (productContainer) {
    productContainer.addEventListener('click', (event) => {
      const target = event.target;

      // Handle wishlist toggle
      if (target.classList.contains('wishlist-toggle') || target.closest('.wishlist-toggle')) {
        event.preventDefault();
        event.stopPropagation();

        const button = target.closest('.wishlist-toggle');
        const productId = parseInt(button.dataset.id);

        if (!isNaN(productId)) {
          toggleWishlist(productId, button);
        } else {
          console.error('Invalid product ID for wishlist toggle');
        }
      }

      // Handle add-to-cart
      if (target.classList.contains('add-to-cart') || target.closest('.add-to-cart')) {
        event.preventDefault();
        event.stopPropagation();

        const button = target.closest('.add-to-cart');
        const productId = parseInt(button.dataset.id);

        if (!isNaN(productId)) {
          addToCart(productId);
          button.classList.add('added-to-cart');
          button.innerHTML = 'Added!';
          setTimeout(() => {
            button.classList.remove('added-to-cart');
            button.innerHTML = 'Add to Cart';
          }, 1000);
        } else {
          console.error('Invalid product ID for add-to-cart');
        }
      }
    });
  }
})

function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart))
}

function displayProducts(products) {
  const productContainer = document.getElementById('allproducts');

  // Clear the container before adding products
  productContainer.innerHTML = '';

  for (let i = 0; i < products.length; i++) {
    const item = products[i];

    productContainer.innerHTML += `
      <div id="productDiv" class="product">
        <img class="product-image" id="product-image-${item.id}" src="${item.thumbnail}" alt="${item.title}">
        <div class="discount">${item.discountPercentage}%</div>
        <div class="details">
          <div class="reviews"><i class="bi bi-star-fill"></i> ${item.rating}</div>
          <div class="title">${item.title}</div>
          <div class="price-div">
            <div class="price">R${(item.price - (item.price * (item.discountPercentage / 100))).toFixed(2)}</div>
            <div class="higher-price">R${item.price}</div>
          </div>
          <div class="btn-group">
            <button class="btn-primary add-to-cart" data-id="${item.id}">Add to Cart</button>
            <button class="btn-primary wishlist-toggle" data-id="${item.id}"><i class="bi bi-heart"></i></button>
          </div>
        </div>
      </div>
    `;

  displayWishlist(wishlist);
}

  // Use event delegation to handle clicks on product images
  productContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('product-image')) {
      const productId = event.target.id.split('-')[2]; // Extract product ID from the image ID
      const product = products.find((item) => item.id == productId);

      console.log('is it me Jesus')
      if (product) {
        const viewProductDialog = document.getElementById('view-product-dialog');
        const productDetailsModal = document.getElementById('product-detail');

        
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

        
        // Populate the modal with product details
        productDetailsModal.innerHTML = `
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
            <div id="product-modal-btn-group" class="product-modal-btn-group">
              <button class="btn-primary add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
              <button class="btn-primary wishlist-toggle" id="addWishlistDetail" data-id="${product.id}">
                <i class="bi bi-heart"></i>
              </button>
            </div>
            <div class="reviews" id=reviews>
              ${reviewsHTML}
            </div>
            
          </div>
        `;

        // After populating the modal content
        const addToCartButton = document.querySelector('.btn-primary[onclick^="addToCart"]');

        // Remove any existing event listeners to prevent duplicate additions
        if (addToCartButton) {
          const newAddToCartButton = addToCartButton.cloneNode(true);
          addToCartButton.parentNode.replaceChild(newAddToCartButton, addToCartButton);

          // Add event listener for "Add to Cart" button
          newAddToCartButton.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = parseInt(newAddToCartButton.getAttribute('onclick').match(/\d+/)[0]);
            addToCart(productId);
            console.log(`Product with ID ${productId} added to cart`);
          });
        } else {
          console.error('Add to Cart button not found');
        }

        const addToWishlistButton = document.getElementById('addWishlistDetail')
        // Add event listener for "Add to Wishlist" button
        if (addToWishlistButton) {
          addToWishlistButton.addEventListener('click', (event) => {
            event.preventDefault();
            const productId = parseInt(addToWishlistButton.dataset.id); // Use the data-id attribute
            toggleWishlist(productId, addToWishlistButton); // Use the toggleWishlist function
            console.log(`Product with ID ${productId} wishlist state toggled`);
          });
        } else {
          console.error('Add to Wishlist button not found');
        }
    
      }
        // Show the modal
        viewProductDialog.showModal();
      }
    }
   });

  // Close the modal when the close button is clicked
  const closeProductDialog = document.getElementById('close-view-modal');
  closeProductDialog.addEventListener('click', () => {
    const viewProductDialog = document.getElementById('view-product-dialog');
    viewProductDialog.close();
  });
}

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0)
  const cartCounterDisplay = document.getElementById('numberCount')

  if (cartCounterDisplay) {
    cartCounterDisplay.textContent = totalItems;

    // Add or remove the 'empty' class based on the cart count
    if (totalItems === 0) {
      cartCounterDisplay.classList.add('empty')
      cartCounterDisplay.textContent = '0' // Set to 0 when empty
    } else {
      cartCounterDisplay.classList.remove('empty')
    }
  } else {
    console.error('Cart counter display element not found!')
  }
}

function displayWishlist() {
  const wishlistContainer = document.getElementById('wishlist-products');
  if (!wishlistContainer) {
    console.error("Wishlist container not found!");
    return;
  }
 
  wishlistContainer.innerHTML = '';
 
  if (wishlist.length === 0) {
    wishlistContainer.innerHTML = '<p style="text-align: center; margin-top: 50px;">Your wishlist is empty</p>';
    return;
  }
 
  wishlist.forEach(item => {
    const wishlistItem = document.createElement('div');
    wishlistItem.className = 'a-product-from-wishlist';
    wishlistItem.style.cssText = 'width: 100%; height: 100px; margin-top: 20px; display: flex; align-items: center;';
    
    wishlistItem.innerHTML = `
      <div class="wishlist-item-actions" style="width: 100px; text-align: center;">
        <i class="bi bi-trash wishlist-remove" data-id="${item.id}" style="cursor: pointer;"></i>
      </div>
      <div class="product-name-wishlist" style="display: flex; align-items: center; width: 400px;">
        <div class="product-wishlist-image" style="
          background: url('${item.thumbnail}');
          background-position: center;
          background-repeat: no-repeat;
          background-size: cover;
          height: 70px;
          width: 70px;
          margin-right: 20px;">
        </div>
        <p style="font-weight: bold;">${item.title}</p>
      </div>
      <div class="wishlist-unit-price" style="width: 400px; text-align: center;">
        <p>R ${item.price.toFixed(2)}</p>
      </div>
      <div class="wishlist-stock-status" style="width: 400px; text-align: center;">
        <p>${item.stock > 0 ? 'In Stock' : 'Out of Stock'}</p>
      </div>
      <div class="wishlist-add-to-cart" style="width: 100px; text-align: center;">
        <i class="bi bi-cart3 wishlist-add-cart" id="wishlist-add-cart" data-id="${item.id}" style="cursor: pointer;"></i>
      </div>
    `;
 
    wishlistContainer.appendChild(wishlistItem);
  });
 
  document.querySelectorAll('.wishlist-remove').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      removeFromWishlist(productId);
    });
  });
 
  document.querySelectorAll('.wishlist-add-cart').forEach(button => {
    button.addEventListener('click', (e) => {
      const productId = parseInt(e.target.dataset.id);
      if (!isNaN(productId)) {
        addToCartFromWishlist(productId);

        console.log('bounce target:', e.target)

        // Bounce animation
        const cartIcon = e.target
        cartIcon.classList.add('bounce');
        cartIcon.addEventListener('animationend', () => {
          cartIcon.classList.remove('bounce');
        }, { once: true }); 
      } else {
        console.error('Invalid product ID');
      }
    });
  });
}

function renderCheckoutDialog() {
  const checkoutContainer = document.querySelector('.checkout-products');
  if (!checkoutContainer) return;
 
  checkoutContainer.innerHTML = '';
 
  if (cart.length === 0) {
    checkoutContainer.innerHTML = '<p style="text-align: center; margin-top: 50px;">Your cart is empty</p>';
    document.querySelector('.priceTotal').textContent = `R 0`;
    return;
  }
 
  let total = 0;
 
  cart.forEach(product => {
    const itemTotal = product.price * product.quantity;
    total += itemTotal;
 
    const productHTML = `
      <div class="a-product" style="display: flex;">
        <div class="left-product" style="margin-top: 20px; height: 180px;">
          <div class="image-checkout" style="
            width: 120px;
            height: 140px;
            background: url('${product.thumbnail}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;">
          </div>
        </div>

        <div class="right-product" style="margin-top: 0px; padding: 20px;">
          <p><strong>${product.title}</strong></p>
          <div class="counterProduct" style="display: flex; padding-top: 30px;">
            <div class="decrementButton" data-id="${product.id}" style="border-radius: 100%; cursor: pointer; border: solid 1px black; padding: 10px; width: 40px; height: 40px;">
              <p style="margin-left: 5px">-</p>
            </div>
            <div class="crementedAmount" style="margin-left: 10px; padding: 10px; margin-right: 10px;">${product.quantity}</div>
            <div class="incrementButton" data-id="${product.id}" style="border-radius: 50%; cursor: pointer; border: solid 1px black; padding: 10px; width: 40px; height: 40px;">
              <p style="margin-left: 5px">+</p>
            </div>
          </div>
          <div style="display: flex; margin-top: 20px;">
            <p>R ${itemTotal.toFixed(2)}</p>
          </div>
        </div>
      </div>
    `;

    checkoutContainer.innerHTML += productHTML;
  });

  // Add event listeners for increment and decrement buttons
  checkoutContainer.querySelectorAll('.decrementButton').forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.dataset.id);
      updateQuantity(productId, -1);
    });
  });

  checkoutContainer.querySelectorAll('.incrementButton').forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.dataset.id);
      updateQuantity(productId, 1);
    });
  });
 
   // Update totals
   document.querySelector('.priceTotal').textContent = `R ${total.toFixed(2)}`;
 
}

function toggleWishlist(productId, button) {
  const product = products.find(p => p.id === productId);
  if (!product) return;

  // Check if the product is currently in the wishlist
  const isInWishlist = wishlist.some(item => item.id === productId);

  if (isInWishlist) {
    // Remove from wishlist 
    const index = wishlist.findIndex(item => item.id === productId);
    if (index !== -1) {
      wishlist.splice(index, 1); 
    }
  } else {
    // Add to wishlist
    wishlist.push({ ...product });
  }

  // Synchronise all the wishlist toggle buttons
  document.querySelectorAll(`.wishlist-toggle[data-id="${productId}"]`).forEach(btn => {
    const heartIcon = btn.querySelector('i');
    if (isInWishlist) {
      heartIcon.classList.remove('bi-heart-fill');
      heartIcon.classList.add('bi-heart');
    } else {
      heartIcon.classList.remove('bi-heart');
      heartIcon.classList.add('bi-heart-fill');
    }
  });

  // Update the wishlist button in the product detail modal
  const modalWishlistButton = document.getElementById('addWishlistDetail');
  if (modalWishlistButton && parseInt(modalWishlistButton.dataset.id) === productId) {
    const heartIcon = modalWishlistButton.querySelector('i');
    if (isInWishlist) {
      heartIcon.classList.remove('bi-heart-fill');
      heartIcon.classList.add('bi-heart');
    } else {
      heartIcon.classList.remove('bi-heart');
      heartIcon.classList.add('bi-heart-fill');
    }
  }

  displayWishlist(); // Update wishlist display
}

function updateUserManagement() {
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = localStorage.getItem('loggedIn') === 'true';
  const userManagement = document.getElementById('user-management');
  const loginDialogContent = document.getElementById('login-dialog-content');
  const viewLoginDialog = document.getElementById('login-dialog');
  const viewRegisterDialog = document.getElementById('register-dialog');
  const closeRegisterDialog = document.getElementById('register-back-btn');
  const closeLoginDialog = document.getElementById('login-back-btn');

  if (closeRegisterDialog) {
    closeRegisterDialog.addEventListener('click', () => {
      const viewRegisterDialog = document.getElementById('register-dialog');
      if (viewRegisterDialog) viewRegisterDialog.close();
    })
  }
  
  if (closeLoginDialog) {
    closeLoginDialog.addEventListener('click', () => {
      const viewLoginDialog = document.getElementById('login-dialog');
      if (viewLoginDialog) viewLoginDialog.close();
    })
  }

  if (isLoggedIn && user) {
    // Update the user management section for logged-in users
    userManagement.innerHTML = `
      <i class="bi bi-person-circle" id="user-icon"></i>
      <p>${user.firstName}</p>
    `;

    // Attach event listener to the user icon
    const userIcon = document.getElementById('user-icon');
    if (userIcon) {
      userIcon.addEventListener('click', () => {
        loginDialogContent.innerHTML = `
          <h2>Welcome back, ${user.firstName}! You are logged in!</h2>
          <button id="logout-btn" class="btn-primary">Logout</button>
        `;

        // Attach logout functionality
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
          logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loggedIn');
            localStorage.removeItem('user');
            alert('User successfully logged out');
            updateUserManagement(); // Refresh user management after logout
            viewLoginDialog.close();
          });
        }

        viewLoginDialog.showModal();
      });
    }
  } else {
    // Update the user management section for non-logged-in users
    userManagement.innerHTML = `
      <div>
        <a id="login">Login</a>
      </div>
      <div>
        <a id="register-btn">Register</a>
      </div>
    `;

    // Attach event listener to the login button
    const loginButton = document.getElementById('login');
    if (loginButton) {
      loginButton.addEventListener('click', () => {
        loginDialogContent.innerHTML = `
          <form>
            <label for="login-email">Email:</label>
            <input type="email" id="login-email" required>
            <label for="login-password">Password:</label>
            <input type="password" id="login-password" required>
            <button id="submit-login" class="btn-primary">Login</button>
          </form>
        `;

        // Attach login functionality
        const submitLogin = document.getElementById('submit-login');
        if (submitLogin) {
          submitLogin.addEventListener('click', (event) => {
            event.preventDefault();
            loginUser();
          });
        }

        viewLoginDialog.showModal();
      });
    }

    // Attach event listener to the register button
    const registerButton = document.getElementById('register-btn');
    if (registerButton) {
      registerButton.addEventListener('click', () => {
        viewRegisterDialog.showModal();
      });
    }
  }
}

// MODALS
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

  // REGISTER & LOGIN FUNCTIONALITY
  const submitRegister = document.getElementById('submit-register');
  if (submitRegister) {
    submitRegister.addEventListener('click', (event) => {
      event.preventDefault();
      registerUser();
    });
  }

  function registerUser() {
    const firstName = document.getElementById('name').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('register-email').value;
    const cellphone = document.getElementById('cellphone').value;
    const password = document.getElementById('register-password').value;
    const confirmedPassword = document.getElementById('confirmed-password').value;
  
    if (!email || !password) {
      alert('Please enter all fields');
      return;
    }
  
    if (firstName && lastName && email && cellphone && password && confirmedPassword) {
      localStorage.setItem("user", JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      }));
  
      alert('User successfully registered');
      const viewRegisterDialog = document.getElementById('register-dialog');
      viewRegisterDialog.close();
      updateUserManagement(); // Refresh user management after registration
    }
  }

  function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
  
    const user = JSON.parse(localStorage.getItem('user'));
  
    if (user && user.email === email && user.password === password) {
      localStorage.setItem('loggedIn', 'true');
      alert('User successfully logged in');
      updateUserManagement(); // Refresh user management after login
      const viewLoginDialog = document.getElementById('login-dialog');
      viewLoginDialog.close();
    } else {
      alert('Invalid email or password');
    }
  }

  // CHECKOUT FUNCTIONALITY
  const checkoutBtn = document.getElementById('checkout-btn')

  checkoutBtn.addEventListener('click', ()=> {
    const isLoggedIn = localStorage.getItem('loggedIn')

    if(isLoggedIn === 'true'){
      alert('Proceeding to checkout...')
      cart.length = 0

      saveCartToLocalStorage()
      updateCartCount()
      renderCheckoutDialog()
      alert('Checkout successful!')
    } else {
      alert('Please login to proceed to checkout')
    }
  })

  // CLEAR ALL FUNCTIONALITY
  const clearAllBtn = document.getElementById('clear-all-button')
  
  clearAllBtn.addEventListener('click', () => {
    cart.length = 0

    saveCartToLocalStorage()
    updateCartCount()
    renderCheckoutDialog()
  })


  // WISHLIST CLEAR ALL FUNCTIONALITY
  function saveWishlistToLocalStorage() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }
  const wishlistClearAllBtn = document.getElementById('wishlist-clear-all-btn');
  wishlistClearAllBtn.addEventListener('click' , () =>{
    wishlist.length = 0

    saveWishlistToLocalStorage(); 
    updateWishlistCount();
    removeFromWishlist();
  })

if (wishlistClearAllBtn) {
  wishlistClearAllBtn.addEventListener('click', () => {
    const confirmed = confirm('Are you sure you want to clear your entire wishlist?');
    
    if (confirmed) {
      wishlist.length = 0;
      console.log('Wishlist cleared:', wishlist);

      saveWishlistToLocalStorage(); 
      displayWishlist(); 
    }
  });
}



  // CATEGORY FILTERING
  document.addEventListener('DOMContentLoaded', () => {
    getProducts();
    displayWishlist(wishlist);

    const allCategoryBtn = document.getElementById('allCategoryBtn');
    if (allCategoryBtn) {
      allCategoryBtn.addEventListener('click', () => {
        displayProducts(products);
      });
    }
    const categories = [
      { id: 'beautyCategoryBtn', category: 'beauty' },
      { id: 'fragrancesCategoryBtn', category: 'fragrances' },
      { id: 'furnitureCategoryBtn', category: 'furniture' },
      { id: 'groceriesCategoryBtn', category: 'groceries' },
    ];

    categories.forEach(({ id, category }) => {
      const categoryBtn = document.getElementById(id);
      if (categoryBtn) {
        categoryBtn.addEventListener('click', () => {
          const filtered = products.filter(p => p.category === category);
          displayProducts(filtered);
        });
      }
    });
  })

  // SEARCH FUNCTIONALITY
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('search');

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim().toLowerCase();

    // Filter products based on the search query
    const filteredProducts = products.filter(product => 
      product.description.toLowerCase().includes(query) || 
      product.title.toLowerCase().includes(query)
    );

    const productContainer = document.getElementById('allproducts');

    if (filteredProducts.length > 0) {
      // Display only the filtered products
      displayProducts(filteredProducts);
    } else {
      // Display "No matches found" message
      productContainer.innerHTML = `
        <p style="text-align: center; margin-top: 50px;">No matches found for "${query}"</p>
      `;
    }
  });



export { renderCheckoutDialog, updateCartCount, displayWishlist, displayProducts, toggleWishlist, saveCartToLocalStorage };


