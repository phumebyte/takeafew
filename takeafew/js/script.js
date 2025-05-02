// IMPORTS
import { toggleWishlist , updateCartCount} from "./products.js";

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

