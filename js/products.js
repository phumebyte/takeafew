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
  if (!product) throw new Error('Product not found')
  
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

function registerUser(firstName, lastName, email, password, confirmedPassword){
  if(!firstName || !lastName || !email || !password || !confirmedPassword){
    alert('Please enter all fields')
    return
  }

  if(password !== confirmedPassword){
    alert('Passwords do not match')
    return
  }

  if(password.length < 9){
    alert('Password is too short')
    return
  }

  if(!email.containt('@')){
    alert('Email is invalid')
    return
  }

  if(firstName && lastName && email && password && confirmedPassword){
    localStorage.setItem('user', JSON.stringify({
      name: firstName,
      surname: lastName,
      email: email,
      password: password
    }))

    alert('User successfully registered')
  }

}

function loginUser(email, password){
  if(!email || !password){
    throw new Error('Please enter all fields')
    return
  } 

  const user  = JSON.parse(localStorage.getItem('user'))

  if(user && user.email === email && user.password === password){
    localStorage.setItem('loggedIn', 'true')
    alert('User successfully logged in')
  } else {
    alert('Invald email or password')
  }
}

function checkout(){
  const isLoggedIn = localStorage.getItem('loggedIn')

  if(isLoggedIn === 'true'){
    alert('Proceeding to Checkout')
    cart.length = 0
    alert('Checkout successful!')
  } else {
    alert('Please login to checkout')
  }
}

function saveCartToLocalStorage(){
  localStorage.setItem('cart', JSON.stringify(cart))
}

function saveWishlistToLocalStorage(){
  localStorage.setItem('wishlist', JSON.stringify(wishlist))
}

function filterCategories(category){
  if(!category){
    return products
  }

  return products,filter(product => product.category)
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

export { products, cart, wishlist, getProducts, addToCart, updateQuantity, deleteFromCart, deleteFromWishlist, toggleWishlist, calculateTotal, getProductById, registerUser, loginUser, checkout, saveCartToLocalStorage, saveWishlistToLocalStorage, filterCategories, searchFunctionality };