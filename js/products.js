let wishlist = []
let cart = []
let products = []

/**
 * Fetches products from DummyJSON API.
 * @returns {Promise<Array>} List of products.
 * @throws {Error} If products can't be found
 */
async function getProducts(){
  try {
    const serverData = await fetch('https://dummyjson.com/products')
    const data = await serverData.json()
    products = data.products
    return products
  } catch (error) {
    console.error(error)
  }
}


/**
 * Adds a product to the cart by ID.
 * Increases quantity if already in cart.
 * @param {number} productId
 * @returns {Array} Updated cart.
 * @throws {Error} If product not found.
 */
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  if (!product) throw new Error('Product not found')
 
  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      ...product,
      quantity: 1
    });
  }

  return cart
 
}


/**
 *
 * @param productId
 * @param button
 * @returns {boolean}
 */
function toggleWishlist(productId, button) {
  const product = products.find(item => item.id === productId)
  if (!product) throw new Error('Invalid product ID')
  
    const index = wishlist.findIndex(item => item.id === productId)
    if(index > -1){
      wishlist.splice(index,1)
      return false
    } else {
      wishlist.push({
        ...product
      })
      return true
    }
}


/**
 * Removes a product from the wishlist by ID.
 * @param {string|number} productId - ID of the product to remove.
 * @returns {Array} Updated wishlist.
 */
function deleteFromWishlist(productId){
  wishlist = wishlist.filter(item => item.id !== productId)
  return wishlist
}

/**
 * @param productId - id of the product to update
 * @param change - quantity to change by
 * @returns {Array} New cart array with updated quantities
 */
function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) throw new Error('Item not in cart')
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
  }
  
  return cart
}


/**
 *
 * @param deleteId - product Id to delete by
 * @return products - updated products
 */
function deleteFromCart(deleteId) {
  cart = cart.filter(item => item.id !== deleteId)
}


/**
 * Calculates the total cost of all items in the cart, accounting for discounts.
 * @returns {number} Total cart value.
 */
function calculateTotal(){
  return cart.reduce((total, item) => total + (((item.price - (item.price * item.discountPercentage/100)) * item.quantity)), 0)
}

/**
 * Gets a product by its ID.
 * @param {number} productId - ID of the product to retrieve.
 * @returns {Object} The matched product.
 * @throws {Error} If the product is not found.
 */
function getProductById(productId){
  const product = products.find(item => item.id === productId)
  if(!product) throw new Error('Product not found')
  return product
}


/**
 * Filters products by category.
 * @param {string} category - The category to filter by. Returns all products if 'all' or empty.
 * @returns {Array} Filtered list of products.
 */
function filterCategories(category){
  if (!category || category.toLowerCase() === 'all') {
    return products; 
  }
  
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}


/**
 * Searches products by a query string in title or description.
 * @param {string} query - The search keyword.
 * @returns {Array} Filtered list of products matching the query.
 */
function searchFunctionality(query){
  if(!query){
    return products
  }

  return products.filter(product =>
    product.description.toLowerCase().includes(query.toLowerCase()) ||
    product.title.toLowerCase().includes(query.toLowerCase())
  )
}

export { products, cart, wishlist, getProducts, addToCart, updateQuantity, deleteFromCart, deleteFromWishlist, toggleWishlist, calculateTotal, getProductById, filterCategories, searchFunctionality };