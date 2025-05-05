// IMPORTS
import { toggleWishlist , updateCartCount, updateQuantity} from "./products.js";

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


