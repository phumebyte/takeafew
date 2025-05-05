// IMPORTS
import { cart, products, getProducts, removeFromWishlist, addToCartFromWishlist, wishlist, updateQuantity, addToCart, addToWishlist} from "./products.js";


document.addEventListener('DOMContentLoaded', () => {
  getProducts();
  displayWishlist(wishlist);
  updateCartCount();

  const cartButtons = document.querySelectorAll('.add-to-cart');
  cartButtons.forEach(button => {
    button.addEventListener('click', (event) => {
      const productId = parseInt(event.target.dataset.id);
      addToCart(productId);
    });
  });
});

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
            <button class="btn-primary" onclick="addToCart(${product.id})">Add to Cart</button>
            <button class="btn-primary" id="addWishlistDetail" onclick="addToWishlist(${product.id})">Add to Wishlist</button>
            <div class="reviews" id=reviews>
              ${reviewsHTML}
            </div>
            
          </div>
        `;
    
      }
        // Show the modal
        viewProductDialog.showModal();

        const addWishlistDetailButton = document.getElementById('addWishlistDetail')

        if(addWishlistDetailButton){
          addWishlistDetailButton.addEventListener('click', () => {
            console.log(wishlist)
            addToWishlist(product.id)
            displayWishlist()
          })
        } else {
          console.error('addWishList detail button not found')
        }
      }
    }

    const target = event.target

    if(target.classList.contains('add-to-cart') || target.closest('.add-to-cart')){
      event.preventDefault();
      event.stopPropagation();

      const button = target.classList.contains('add-to-cart') ? target : target.closest(".add-to-cart");
      const productId = parseInt(button.dataset.id);

      if(addToCart(productId)){
        button.classList.add('added-to-cart');
        button.innerHTML = 'Added!';
        setTimeout(() => {
          button.classList.remove('added-to-cart');
          button.innerHTML = 'Add to Cart';
        }, 1000);
      }
    }
    if (target.classList.contains('wishlist-toggle') || target.classList.contains('bi-heart') || target.closest('.wishlist-toggle')) {
      console.log(wishlist);
      event.preventDefault();
      event.stopPropagation();

      const button = target.closest('.wishlist-toggle');
      const productId = parseInt(button.dataset.id);
      toggleWishlist(productId, button);

    }

    if (target.classList.contains('product-image')){
      const productId = parseInt(target.id.split('-')[2]);
      viewProductDialog(productId);
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
            width: 160px;
            height: 180px;
            background: url('${product.thumbnail}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;">
          </div>
        </div>

        <div class="right-product" style="margin-top: 0px; padding: 30px;">
          <p>${product.title}</p>
          <div class="counterProduct" style="display: flex; padding-top: 30px;">
            <div class="decrementButton" data-id="${product.id}" style="border-radius: 100%; cursor: pointer; border: solid 1px black; padding: 10px; width: 40px; height: 40px;">
              <p style="margin-left: 5px">-</p>
            </div>
            <div class="crementedAmount" style="margin-left: 10px; padding: 10px; margin-right: 10px;">${product.quantity}</div>
            <div class="incrementButton" data-id="${product.id}" style="border-radius: 50%; cursor: pointer; border: solid 1px black; padding: 10px; width: 40px; height: 40px;">
              <p style="margin-left: 5px">+</p>
            </div>s
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
 
  const heartIcon = button.querySelector('i');
  const isInWishlist = wishlist.some(item => item.id === productId);
 
  if (isInWishlist) {
    // Remove from wishlist
    wishlist = wishlist.filter(item => item.id !== productId);
    heartIcon.classList.remove('bi-heart-fill');
    heartIcon.classList.add('bi-heart');
  } else {
    // Add to wishlist using the addToWishlist function
    addToWishlist(productId);
    heartIcon.classList.remove('bi-heart');
    heartIcon.classList.add('bi-heart-fill');
  }
 
  displayWishlist();
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

  const viewLoginBtn = document.getElementById('login')
  const viewLoginDialog = document.getElementById('login-dialog')
  const closeLoginBtn = document.getElementById('login-back-btn')

  viewLoginBtn.addEventListener('click', () => {
    const user = JSON.parse(localStorage.getItem('user'))
    const isLoggedIn = localStorage.getItem('loggedIn') === 'true'

    if(isLoggedIn && user){
      const loginDialogContent = document.getElementById('login-dialog-content')
      loginDialogContent.innerHTML = `
        <h2>Welcome back, ${user.firstName}! You are logged in!</h2>
        <button id="logout-btn" class="btn-primary">Logout</button>
      `

      //Logout button functionality
      const logoutBtn = document.getElementById('logout-btn')
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedIn')
        localStorage.removeItem('user')
        alert('User successfully logged out')
        viewLoginDialog.close()
      })
    } else {
      // Reset to the default login form if not logged in
    const loginDialogContent = document.getElementById('login-dialog-content');
    loginDialogContent.innerHTML = `
      <form>
        <label for="login-email">Email:</label>
        <input type="email" id="login-email" required>
        <label for="login-password">Password:</label>
        <input type="password" id="login-password" required>
        <button id="submit-login" class="btn-primary">Login</button>
      </form>
    `;

    // Reattach the login event listener
    const submitLogin = document.getElementById('submit-login');
    submitLogin.addEventListener('click', (event) => {
      event.preventDefault();
      loginUser();
    });
    }
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

  // REGISTER & LOGIN FUNCTIONALITY

  const submitRegister = document.getElementById('submit-register')

  submitRegister.addEventListener('click', (event) => {
    event.preventDefault()

    registerUser()
  })

  function registerUser(){
    const firstName = document.getElementById('name').value
    const lastName = document.getElementById('lastName').value
    const email = document.getElementById('register-email').value
    const cellphone = document.getElementById('cellphone').value
    const password = document.getElementById('register-password').value
    const confirmedPassword = document.getElementById('confirmed-password').value

    if(!email || !password){
      alert('Please enter all fields')
      return
    }

    console.log(firstName + " " + lastName + " " + email + " " + password + " " + cellphone) 

    if(firstName && lastName && email && email && cellphone && password && confirmedPassword){
      localStorage.setItem("user", JSON.stringify({
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      }))

      viewRegisterDialog.close()
    }
  }

  const submitLogin = document.getElementById('submit-login')
  
  submitLogin.addEventListener('click', (event) => {
    event.preventDefault()

    loginUser()
  })

  function loginUser(){
    const email = document.getElementById('login-email').value
    const password = document.getElementById('login-password').value

    let user = JSON.parse(localStorage.getItem('user'))

    if(user.email === email && user.password){
      localStorage.setItem('loggedIn', true)
      alert('User successfully logged in')
      viewLoginDialog.close()
    } else {
      alert('Something went wrong')
    }
  }

  export { renderCheckoutDialog, updateCartCount, displayWishlist, displayProducts, toggleWishlist };


