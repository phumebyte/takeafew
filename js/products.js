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

let wishlist = []
let cart = []
let products = []


// FETCHING FROM API
async function getProducts(){
  try {
    const serverData = await fetch('https://dummyjson.com/products')
    const data = await serverData.json()
    products = data.products

    displayProducts(products)
  } catch (error) {
    console.log(error)
  }
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

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) return false;
 
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
   
  }
 
  updateCartCount();
  renderCheckoutDialog();
  return true;
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
        <i class="bi bi-cart3 wishlist-add-cart" data-id="${item.id}" style="cursor: pointer;"></i>
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
      addToCartFromWishlist(productId);
    });
  });
}

function removeFromWishlist(productId){
  wishlist = wishlist.filter(item => item.id !== productId)
  displayWishlist()
}

function addToWishlist(productId){
  const product = products.find(p => p.id === productId)
  
  if (!product) return false;
 
  const existingItem = wishlist.find(item => item.id === productId);
  if (!existingItem) {
    wishlist.push({...product});
    return true
  }
  return false
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) return;
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
  }
  
  updateCartCount();
  renderCheckoutDialog();
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
            <div class="decrementButton" onclick="updateQuantity(${product.id}, -1)" style="border-radius: 100%; cursor: pointer; border: solid 1px black; padding: 10px; width: 40px; height: 40px;">
              <p style="margin-left: 5px">-</p>
            </div>
            <div class="crementedAmount" style="margin-left: 10px; padding: 10px; margin-right: 10px;">${product.quantity}</div>
            <div class="incrementButton" onclick="updateQuantity(${product.id}, 1)" style="border-radius: 50%; cursor: pointer; border: solid 1px black; padding: 10px; width: 40px; height: 40px;">
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
 
   // Update totals
   document.querySelector('.priceTotal').textContent = `R ${total.toFixed(2)}`;
 
   
}

function deleteFromCart(deleteId) {
  for (let i = 0; i < cart.length; i++) {
    //console.log(cart[i].product.id)
    if (cart[i].product.id == deleteId) {
      if (cart[i].count > 1) {
        cart[i].count -= 1;
      } else {
        cart.splice(i, 1);
      }
      return;
    }
  }
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

// --------------------------------------------

function updateName(updatedId, newName) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == updatedId) {
      products[i].title = newName;
      console.log(products[i]);
    }
  }
}

function updateStock(updatedId, newStock) {
  for (let i = 0; i < products.length; i++) {
    if (updatedId === products[i].id) {
      products[i].stock = newStock;
      console.log(products[i]);
    }
  }
}

function totalPrice(cart) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].product.minimumOrderQuantity < cart[i].count) {
      total +=
        cart[i].product.price *
        cart[i].count *
        (cart[i].product.discountPercentage / 100);
    } else {
      total += cart[i].product.price * cart[i].count;
    }
  }
  console.log("R" + Math.ceil(total));
}

function reviewAccount(email) {
  let count = 0;
  let reviewedProducts = [];

  for (let i = 0; i < products.length; i++) {
    for (let o = 0; o < products[i].reviews.length; o++) {
      if (products[i].reviews[o].reviewerEmail === email) {
        count++;
        reviewedProducts.push(products[i]);
      }
    }
  }

  let reviewer = {
    totalReviews: count,
    reviewedProducts: reviewedProducts,
  };

  console.log(reviewer);
  return count;
}

function discountAmount(productId) {
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == productId) {
      total =
        products[i].price -
        (products[i].price * products[i].discountPercentage) / 100;
    }
  }
  console.log(total);
}

let twoMonthWarranty = [];

function warranty() {
  for (let i = 0; i < products.length; i++) {
    if (products[i].warrantyInformation) {
      let warrantyInfo = products[i].warrantyInformation.split(" ");
      let duration = parseInt(warrantyInfo[0]);
      let unit = warrantyInfo[1];

      if (
        (unit === "months" && duration < 10) ||
        (unit === "year" && duration < 1)
      ) {
        twoMonthWarranty.push(products[i]);
      }
    }
  }

  console.log(twoMonthWarranty);
}

let fiveStarArray = [];

function fiveStarRating() {
  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < products[i].reviews.length; j++) {
      if (products[i].reviews[j].rating == 5) {
        //console.log(products[i].reviews[j])
        fiveStarArray.push(products[i]);
        break;
      }
    }
  }

  console.log(fiveStarArray);
}

function dimensionsCalculation() {
  let dimensionsArray = [];

  for (let i = 0; i < products.length; i++) {
    let dimensions = products[i].dimensions;
    if (dimensions.width > 20 && dimensions.height > 20) {
      dimensionsArray.push(products[i]);
    }
  }

  console.log(dimensionsArray);
}


export { updateQuantity , displayWishlist, removeFromWishlist, updateCartCount, wishlist, displayProducts, toggleWishlist, getProducts, cart, addToCart, deleteFromCart, updateName, updateStock, totalPrice, reviewAccount, discountAmount, warranty, fiveStarRating, dimensionsCalculation };