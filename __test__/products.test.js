import {products, cart, wishlist, getProducts, addToCart, updateQuantity, deleteFromCart, deleteFromWishlist, toggleWishlist, calculateTotal, getProductById, registerUser, loginUser, checkout, saveCartToLocalStorage, saveWishlistToLocalStorage, filterCategories, searchFunctionality, loadCartFromLocalStorage } from "../js/products.js";

describe('[ products ]', () => {

    test('should be a valid array', () => { 
        expect(products).toBeDefined()
        expect(products).toBeInstanceOf(Array);
    })   
    
})

describe('[ cart ]', () => { 
    test('should be a valid array', () => { 
        expect(cart).toBeDefined()
        expect(cart).toBeInstanceOf(Array)
    })

 })

 describe('[ wishlist ]', () => {

    test('should be defined a valid array ', () => { 
        expect(wishlist).toBeDefined()
        expect(wishlist).toBeInstanceOf(Array)
    })
    
})

 describe('[ addToCartFn ]', () => { 
    test('should be a valid function', () => { 
        expect( addToCart ).toBeDefined()
        expect(typeof addToCart).toBe('function')
        expect(() => addToCart()).toThrow()
    })

    test('should add product to cart', () => {  
        const id = 1
        addToCart(id)

        expect(cart.length).toBe(1)
    })
  })

  describe('[ getProducts ]', () => {  

    test('should be a valid function', () => {  
        expect( getProducts ).toBeDefined()
        expect(typeof getProducts).toBe('function')
    })

    test('should return 30 elements', () => {  
        const items = getProducts()
        expect(items.length).toBe(30)
    })
  })

  describe('[ toggleWIshlist ]', () => { 
    test('should be a valid function', () => {  
        expect( toggleWishlist ).toBeDefined()
        expect(typeof toggleWishlist).toBe('function')
    })
  })

  describe('[ deleteFromWishlist ]', () => { 
    test('should be a valid function', () => {  
        expect( deleteFromWishlist ).toBeDefined()
        expect(typeof deleteFromWishlist).toBe('function')
    })
  })

  describe('[ updateQuantity ]', () => { 
    test('should be a valid function', () => {  
        expect( updateQuantity ).toBeDefined()
        expect(typeof updateQuantity).toBe('function')
    })
  })

  describe('[ deleteFromCart ]', () => { 
    test('should be a valid function', () => {  
        expect( deleteFromCart ).toBeDefined()
        expect(typeof deleteFromCart).toBe('function')
    })
  })

  describe('[ calculateTotal ]', () => { 
    test('should be a valid function', () => {  
        expect( calculateTotal ).toBeDefined()
        expect(typeof calculateTotal).toBe('function')
    })
  })

  describe('[ getProductById ]', () => { 
    test('should be a valid function', () => {  
        expect( getProductById ).toBeDefined()
        expect(typeof getProductById).toBe('function')
    })
  })

  describe('[ registerUser ]', () => { 
    test('should be a valid function', () => {  
        expect( registerUser ).toBeDefined()
        expect(typeof registerUser).toBe('function')
    })
  })

  describe('[ loginUser ]', () => { 
    test('should be a valid function', () => {  
        expect( loginUser ).toBeDefined()
        expect(typeof loginUser).toBe('function')
    })
  })

  describe('[ checkout ]', () => { 
    test('should be a valid function', () => {  
        expect( checkout ).toBeDefined()
        expect(typeof checkout).toBe('function')
    })
  })

  describe('[ saveCartToLocalStorage ]', () => { 
    test('should be a valid function', () => {  
        expect( saveCartToLocalStorage ).toBeDefined()
        expect(typeof saveCartToLocalStorage).toBe('function')
    })
  })

  describe('[ saveWishlistToLocalStorage ]', () => { 
    test('should be a valid function', () => {  
        expect( saveWishlistToLocalStorage ).toBeDefined()
        expect(typeof saveWishlistToLocalStorage).toBe('function')
    })
  })

  describe('[ filterCategories ]', () => { 
    test('should be a valid function', () => {  
        expect( filterCategories ).toBeDefined()
        expect(typeof filterCategories).toBe('function')
    })
  })

  describe('[ searchFunctionality ]', () => { 
    test('should be a valid function', () => {  
        expect( searchFunctionality ).toBeDefined()
        expect(typeof searchFunctionality).toBe('function')
    })
  })

  describe('[ loadCartFromLocalStorage ]', () => { 
    test('should be a valid function', () => {  
        expect( loadCartFromLocalStorage ).toBeDefined()
        expect(typeof loadCartFromLocalStorage).toBe('function')
    })

    test('should load the cart from local storage', () => {
        const localStorageCart = JSON.parse(localStorage.getItem('cart'))

        expect(localStorageCart.length).toBeEqual(cart.length)
    })
  })