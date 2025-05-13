import { products, cart, wishlist, getProducts, addToCart, updateQuantity, deleteFromCart, deleteFromWishlist, toggleWishlist, calculateTotal, getProductById, filterCategories, searchFunctionality } from "../js/products.js";

beforeEach(() => {
  cart.length = 0;
  wishlist.length = 0;
});

describe('[ products ]', () => {
  test('should be a valid array', () => {
    expect(products).toBeDefined()
    expect(products).toBeInstanceOf(Array);
  })

})

describe('[ cart ]', () => {
  test('should be start empty', () => {
    expect(cart.length).toBe(0)
  });
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

describe('[ addToCart ]', () => {
  test('should be a valid function', () => {
    expect(addToCart).toBeDefined()
    expect(typeof addToCart).toBe('function')
    expect(() => addToCart()).toThrow()
  })

  test('should add product to cart', async () => {
    await getProducts()
    const id = products[0].id
    addToCart(id)

    expect(cart.length).toBe(1)
    expect(cart[0].id).toBe(id)
    expect(cart[0].quantity).toBe(1)
  })

  test('should increase quanitity if already in cart', async () => {
    await getProducts()
    const id = products[0].id
    addToCart(id)
    addToCart(id)

    expect(cart.length).toBe(1)
    expect(cart[0].id).toBe(id)
    expect(cart[0].quantity).toBe(2)
  })

  test('should throw an error if product is not found', () => {
    expect(() => addToCart(9999)).toThrow('Product not found');
  });
})

describe('[ getProducts ]', () => {

  test('should be a valid function', () => {
    expect(getProducts).toBeDefined()
    expect(typeof getProducts).toBe('function')
  })

  test('should return 30 elements', async () => {
    const items = await getProducts()
    expect(items.length).toBe(30)
  })
})

describe('[ toggleWIshlist ]', () => {
    test('should be a valid function', () => {
      expect(toggleWishlist).toBeDefined()
      expect(typeof toggleWishlist).toBe('function')
    })

    test('should add product to wishlist', async () => {
      await getProducts();
      const product = products[0];
      toggleWishlist(product.id);
      expect(wishlist.length).toBe(1);
      expect(wishlist[0].id).toBe(product.id);
    })

    test('should remove product from wishlist if toggled again', async () => {
        await getProducts();
        const id = products[0].id;
        toggleWishlist(id);
        toggleWishlist(id);
        expect(wishlist.length).toBe(0);
    })
    
    test('should throw an error if invalid product ID is passed to toggleWishlist', () => {
        expect(() => toggleWishlist('invalid-id')).toThrow('Invalid product ID');
    })
})
  
describe('[ deleteFromWishlist ]', () => {

    test('should be a valid function', () => {
      expect(deleteFromWishlist).toBeDefined()
      expect(typeof deleteFromWishlist).toBe('function')
    })

    test('should remove product from wishlist', async () => {
      await getProducts();
      const product = products[0]; 
      toggleWishlist(product.id); 
      const initialWishlistLength = wishlist.length;
      deleteFromWishlist(product.id);
      expect(wishlist.length).toBe(initialWishlistLength - 1);
    })

    test('should not throw an error when deleting a product that was never added', async () => {
        await getProducts();
        const id = products[0].id;
        expect(() => deleteFromCart(id)).not.toThrow();
    })
})

describe('[ updateQuantity ]', () => {
    test('should be a valid function', () => {
      expect(updateQuantity).toBeDefined()
      expect(typeof updateQuantity).toBe('function')
    })

    test('should update the quantity of a product in the cart', async () => {
        await getProducts()
        const id = products[0].id
        addToCart(id)
        updateQuantity(id, 1)
        expect(cart[0].quantity).toBe(2)
  })

    test('should remove the product from the cart if quantity is zero or less', async () =>{
        await getProducts()
        const id = products[0].id
        addToCart(id)
        updateQuantity(id, -1)
        expect(cart.length).toBe(0)
    })

    test('should throw an error if product is not found in the cart', () => {
        expect(() => updateQuantity(9999, 1)).toThrow('Item not in cart')
    })

})

describe('[ deleteFromCart ]', () => {
    test('should be a valid function', () => {
      expect(deleteFromCart).toBeDefined()
      expect(typeof deleteFromCart).toBe('function')
    })

    test('should remove product from cart', async () => {
      await getProducts()
      const id = products[0].id
      addToCart(id)
      deleteFromCart(id)
      expect(cart.length).toBe(0)
    })

    test('should not throw an error if the product is not in the cart', () => {
        expect(() => deleteFromCart(9999)).not.toThrow();
    })
})

describe('[ calculateTotal ]', () => {
    test('should be a valid function', () => {
      expect(calculateTotal).toBeDefined()
      expect(typeof calculateTotal).toBe('function')
    })

    test('should calculate the total price of items in the cart', async () => {
        await getProducts()
        const id1 = products[0].id
        const id2 = products[1].id
        addToCart(id1)
        addToCart(id2)
        updateQuantity(id1, 1)
        const total = calculateTotal()
        const expectedTotal =
        (products[0].price - (products[0].price * products[0].discountPercentage) / 100) * 2 +
        (products[1].price - (products[1].price * products[1].discountPercentage) / 100);  
        expect(total).toBe(expectedTotal)
    })

    test('should return 0 if the cart is empty', () => {
        const total = calculateTotal()
        expect(total).toBe(0)
    })
})

describe('[ getProductById ]', () => {
    test('should be a valid function', () => {
        expect(getProductById).toBeDefined()
        expect(typeof getProductById).toBe('function')
    })

    test('should return a product by its ID', async () => {
        await getProducts()
        const id = products[0].id
        const product = getProductById(id)
        expect(product).toBeDefined()
        expect(product.id).toBe(id)
        expect(product).toEqual(products[0])
    })

    test('should throw an error if the product is not found', () => {
        expect(() => getProductById(9999)).toThrow('Product not found')
    })

    test('should throw an error if product ID is invalid', () => {
        expect(() => getProductById('invalid-id')).toThrow('Product not found');
    })
    
})

describe('[ filterCategories ]', () => {
    test('should be a valid function', () => {
        expect(filterCategories).toBeDefined()
        expect(typeof filterCategories).toBe('function')
    })

    test('should return products that match the category filter', async () => {
        await getProducts()
        const category = products[0].category
        const filteredProducts = filterCategories(category)
        expect(filteredProducts.length).toBeGreaterThan(1) // at least one product matches the category
        expect(filteredProducts[0].category).toBe(category) // first one matches the category
        expect(filteredProducts.every(product => product.category === category)).toBe(true) // all products match the category
    })
})

describe('[ searchFunctionality ]', () => {
    test('should be a valid function', () => {
        expect(searchFunctionality).toBeDefined()
        expect(typeof searchFunctionality).toBe('function')
    })

    test('should return products that match the search term', async () => {
        await getProducts()
        const searchTerm = products[0].title.split(' ')[0]
        const filteredProducts = searchFunctionality(searchTerm)
        expect(filteredProducts.length).toBe(1)
        expect(filteredProducts[0].title).toContain(searchTerm)
    })

    test('should return products with partial matches in title or description', async () => {
        await getProducts();
        const searchTerm = products[0].title.substring(0, 3); // Partial match
        const results = searchFunctionality(searchTerm);
        expect(results.length).toBeGreaterThan(0);
        expect(
            results.every(
                product =>
                    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
        ).toBe(true);
    })
    
    test('should handle special characters in search term', async () => {
        await getProducts();
        const results = searchFunctionality('!@#$%^&*()');
        expect(results.length).toBe(0);
    })
})