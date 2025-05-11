import { products, cart, wishlist, addToCart } from "../js/products.js";

describe('[ products ]', () => {

    test('should be defined', () => { 
        expect( products ).toBeDefined()
    })
    test('products should be an array', () => {
        expect(Array.isArray(products)).toBe(true);
    });
    
    test('products should have a length greater than 0', () => {
        expect(products.length).toBeGreaterThan(0);
    });
    
})

describe(' [ cart ]', () => { 
    test('should be defined', () => { 
        expect( cart ).toBeDefined()
    })
    test('should be an array', () => { 
        expect(Array.isArray(cart)).toBe(true)
    })

 })

 describe('[ wishlist ]', () => {

    test('should be defined', () => { 
        expect( wishlist ).toBeDefined()
    })
    test('products should be an array', () => {
        expect(Array.isArray(wishlist)).toBe(true);
    });
    
})

 describe(' [ addToCartFn ]', () => { 
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