import { renderCheckoutDialog, updateCartCount, displayWishlist, displayProducts, saveCartToLocalStorage} from "./script.js";

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
  saveCartToLocalStorage();
  return true;
}

function addToCartFromWishlist(productId) {
  const product = wishlist.find(item => item.id === productId);
  if (!product) {
    console.error('Product not found in wishlist');
    return;
  }

  // Add the product to the cart
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  // Update the cart count and render the checkout dialog
  updateCartCount();
  renderCheckoutDialog();

  console.log(`Product with ID ${productId} added to cart from wishlist`);
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
  
  saveCartToLocalStorage();
  updateCartCount();
  renderCheckoutDialog();
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

export { addToCartFromWishlist, updateQuantity, removeFromWishlist, wishlist, displayProducts, getProducts, cart, addToCart, deleteFromCart, products, addToWishlist };