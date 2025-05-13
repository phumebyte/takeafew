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

function loginUser(email, password) {
  if (!email || !password) {
      alert('Please enter both email and password');
      return false;
  }

  const userData = localStorage.getItem('user');
  if (!userData) {
      alert('No user found. Please register first.');
      return false;
  }

  try {
      const user = JSON.parse(userData);

      // Normalize email comparison
      if (user.email.toLowerCase() == email.trim().toLowerCase() && user.password == password) {
          localStorage.setItem('loggedIn', 'true');
          localStorage.setItem('currentUser', JSON.stringify(user));
          alert('Login successful!' + " "+ email.trim().toLowerCase() + " " + password);
          console.log(" "+ email.trim().toLowerCase() + " " + password);
          return user;
      } else {
          alert('Invalid email or password' + " "+ email.trim().toLowerCase() + " " + password);
          return false;
      }
  } catch (error) {
      console.error('Login error:', error);
      alert('Error during login. Please try again.');
      return false;
  }
}

function registerUser(firstName, lastName, email, password, confirmedPassword) {
  if (!firstName  || !lastName  || !email  || !password  || !confirmedPassword) {
      alert('Please fill in all fields');
      return false;
  }

  if (password !== confirmedPassword) {
      alert('Passwords do not match');
      return false;
  }

  if (password.length < 9) {
      alert('Password must be at least 9 characters');
      return false;
  }

  if (!email.includes('@') || !email.includes('.')) {
      alert('Please enter a valid email');
      return false;
  }

  // Create user object
  const user = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(), // Normalize email
      password: password // In production, you should hash this!
  };

  // Store user
  localStorage.setItem('user', JSON.stringify(user));
  alert('Registration successful! Please login.');
  return true;
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