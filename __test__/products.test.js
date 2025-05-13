import { products, cart, wishlist, getProducts, addToCart, updateQuantity, deleteFromCart, deleteFromWishlist, toggleWishlist, calculateTotal, getProductById, filterCategories, searchFunctionality } from "../js/products.js";

// beforeEach(() => {
//   global.localStorage = {
//     store: {},
//     getItem(key) {
//       return this.store[key] || null;
//     },
//     setItem(key, value) {
//       this.store[key] = value.toString();
//     },
//     removeItem(key) {
//       delete this.store[key];
//     },
//     clear() {
//       this.store = {};
//     }
//   };
// });

beforeEach(() => {
  cart.length = 0;
  wishlist.length = 0;
  // localStorage.clear();
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

describe('[ addToCartFn ]', () => {
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
  // test('should increase quantity if the product is already in the cart', async () => {
  //   await getProducts();
  //   const id = products[0].id;
  //   addToCart(id);
  //   const initialQuantity = cart[0].quantity;
  //   addToCart(id);
  //   expect(cart[0].quantity).toBe(initialQuantity + 1);
  // });

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
    });
  })
  
  describe('[ deleteFromWishlist ]', () => {
    test('should be a valid function', () => {
      expect(deleteFromWishlist).toBeDefined()
      expect(typeof deleteFromWishlist).toBe('function')
    });
    test('should remove product from wishlist', async () => {
      await getProducts();
      const product = products[0]; 
      toggleWishlist(product.id); 
      const initialWishlistLength = wishlist.length;
      deleteFromWishlist(product.id);
      expect(wishlist.length).toBe(initialWishlistLength - 1);
    });
  })

  describe('[ updateQuantity ]', () => {
    test('should be a valid function', () => {
      expect(updateQuantity).toBeDefined()
      expect(typeof updateQuantity).toBe('function')
    })
  })

  describe('[ deleteFromCart ]', () => {
    test('should be a valid function', () => {
      expect(deleteFromCart).toBeDefined()
      expect(typeof deleteFromCart).toBe('function')
    })
  })

  describe('[ calculateTotal ]', () => {
    test('should be a valid function', () => {
      expect(calculateTotal).toBeDefined()
      expect(typeof calculateTotal).toBe('function')
    })
  })

  describe('[ getProductById ]', () => {
    test('should be a valid function', () => {
      expect(getProductById).toBeDefined()
      expect(typeof getProductById).toBe('function')
    })
  })

  // describe('[ registerUser ]', () => {
  //   test('should be a valid function', () => {
  //     expect(registerUser).toBeDefined()
  //     expect(typeof registerUser).toBe('function')
  //   })
  // })

  // describe('[ loginUser ]', () => {
  //   test('should be a valid function', () => {
  //     expect(loginUser).toBeDefined()
  //     expect(typeof loginUser).toBe('function')
  //   })
  // })

  // describe('[ checkout ]', () => {
  //   test('should be a valid function', () => {
  //     expect(checkout).toBeDefined()
  //     expect(typeof checkout).toBe('function')
  //   })
  // })

  // describe('[ saveCartToLocalStorage ]', () => {
  //   test('should be a valid function', () => {
  //     expect(saveCartToLocalStorage).toBeDefined()
  //     expect(typeof saveCartToLocalStorage).toBe('function')
  //   })
  // })

  // describe('[ saveWishlistToLocalStorage ]', () => {
  //   test('should be a valid function', () => {
  //     expect(saveWishlistToLocalStorage).toBeDefined()
  //     expect(typeof saveWishlistToLocalStorage).toBe('function')
  //   })
  // })

  describe('[ filterCategories ]', () => {
    test('should be a valid function', () => {
      expect(filterCategories).toBeDefined()
      expect(typeof filterCategories).toBe('function')
    })
  })

  describe('[ searchFunctionality ]', () => {
    test('should be a valid function', () => {
      expect(searchFunctionality).toBeDefined()
      expect(typeof searchFunctionality).toBe('function')
    })
  })
})

  // describe('[ loadCartFromLocalStorage ]', () => {
  //   test('should be a valid function', () => {
  //     expect(loadCartFromLocalStorage).toBeDefined()
  //     expect(typeof loadCartFromLocalStorage).toBe('function')
  //   })

//     test('should load the cart from local storage', () => {
//       localStorage.setItem('cart', JSON.stringify([{ id: 1, quantity: 2 }]))
//       loadCartFromLocalStorage()
//       expect(cart.length).toBe(1)
//       expect(cart[0].id).toBe(1)
//     })    
// })