let wishlist = []
let cart = []
let products = []

// FETCHING FROM API
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

function deleteFromWishlist(productId){
  wishlist = wishlist.filter(item => item.id !== productId)
  return wishlist
}

function updateQuantity(productId, change) {
  const item = cart.find(item => item.id === productId);
  if (!item) throw new Error('Item not in cart')
  
  item.quantity += change;
  
  if (item.quantity <= 0) {
      cart = cart.filter(item => item.id !== productId);
  }
  
  return cart
}

function deleteFromCart(deleteId) {
  cart = cart.filter(item => item.id !== deleteId)
}

function calculateTotal(){
  return cart.reduce((total, item) => total + (((item.price - (item.price * item.discountPercentage/100)) * item.quantity)), 0)
}

function getProductById(productId){
  const product = products.find(item => item.id === productId)
  if(!product) throw new Error('Product not found')
  return product
}

function filterCategories(category){
  if (!category || category.toLowerCase() === 'all') {
    return products; 
  }
  
  return products.filter(product => product.category.toLowerCase() === category.toLowerCase());
}

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