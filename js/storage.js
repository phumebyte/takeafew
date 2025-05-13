import { products, cart, wishlist, getProducts, addToCart, updateQuantity, deleteFromCart, deleteFromWishlist, toggleWishlist, calculateTotal, getProductById, filterCategories, searchFunctionality} from "./products.js";

function loadCartFromLocalStorage(){
    const storedCart = localStorage.getItem('cart')
    if(storedCart){
      cart.length = 0
      cart.push(... JSON.parse(storedCart))
    }
}

function saveCartToLocalStorage(){
    localStorage.setItem('cart', JSON.stringify(cart))
}

function saveWishlistToLocalStorage(){
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
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
  
    if(!email.includes('@')){
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

export { loadCartFromLocalStorage, saveCartToLocalStorage, saveWishlistToLocalStorage, loginUser, registerUser, checkout }