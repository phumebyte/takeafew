
// FETCHING FROM API
async function getProducts(){
  try {
    const serverData = await fetch('https://dummyjson.com/products')
    const data = await serverData.json()
    const {products} = data
    console.log(products)

    displayProducts(products)
  } catch (error) {
    console.log(error)
  }
}

getProducts()

function displayProducts(products) {
  const productContainer = document.getElementById('allproducts');

  // Clear the container before adding products
  productContainer.innerHTML = '';

  for (let i = 0; i < products.length; i++) {
    const item = products[i];

    productContainer.innerHTML += `

      <div id="productDiv" class="product">
        <img class="product-image" id="product-image-${item.id}" src="${item.thumbnail}" alt="${item.title}">
        <div class="discount">${item.discountPercentage}%</div>
        <div class="details">
          <div class="reviews"><i class="bi bi-star-fill"></i> ${item.rating}</div>
          <div class="title">${item.title}</div>
          <div class="price-div">
            <div class="price">R${item.price}</div>
            <div class="higher-price">${item.higherPrice}</div>
          </div>
          <div class="btn-group">
            <button class="btn-primary">Add to Cart</button>
            <button class="btn-primary">Add to Wishlist</button>
          </div>
        </div>
      </div>

    `;
  }

  // Use event delegation to handle clicks on product images
  productContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('product-image')) {
      const productId = event.target.id.split('-')[2]; // Extract product ID from the image ID
      const product = products.find((item) => item.id == productId);

      console.log('is it me Jesus')
      if (product) {
        const viewProductDialog = document.getElementById('view-product-dialog');
        const productDetailsModal = document.getElementById('product-detail');

        
      let reviewsHTML = '<h3>Reviews</h3>'

      for (let i = 0; i < product.reviews.length; i++) {
        const item = product.reviews;
       reviewsHTML +=`
              <div class="reviews" id=reviews>
                <p>${item[i].reviewerName}  (<strong>${item[i].reviewerEmail}</strong>)</p> 
                <p>Rating: ${item[i].rating}/5 STARS</p>
                <p>Comment: ${item[i].comment}</p>
                <div>
                  <br>
                </div>
              </div>`

        
        // Populate the modal with product details
        productDetailsModal.innerHTML = `
          <img class="product-image" src="${product.thumbnail}" alt="${product.title}">
          <div class="details">
            <div class="title"><h2>${product.title}</h2></div>
            <div class="price">R${product.price}</div>
            <div class="description">${product.description}</div>
            <div class="categoryName"><strong>Category: </strong>${product.category}</div>
            <div class="discount"><strong>Discount: </strong>${product.discountPercentage}%</div>
            <div class="rating"><strong>Rating: </strong>${product.rating} Stars</div>
            <div class="return-policy"><strong>Return Policy: </strong>${product.returnPolicy}</div>
            <div class="warrantyInformation"><strong>Warranty: </strong>${product.warrantyInformation}</div>
            <div class="stock"><strong>Product in Stock: </strong>${product.stock}</div>
            <div class="minimumOrderQuantity"><strong>Minimum Order Quantity: </strong>${product.minimumOrderQuantity}</div>
            <button class="btn-primary">Add to Cart</button>
            <div class="reviews" id=reviews>
              ${reviewsHTML}
            </div>
            
          </div>
        `;
    
      }
        // Show the modal
        viewProductDialog.showModal();
      }
    }
  });

  // Close the modal when the close button is clicked
  const closeProductDialog = document.getElementById('close-view-modal');
  closeProductDialog.addEventListener('click', () => {
    const viewProductDialog = document.getElementById('view-product-dialog');
    viewProductDialog.close();
  });
}

//console.log({ products });

let cart = [];

function addToCart(productId) {
  let product = null;

  if(!productId){
    throw new Error('Error: No Product ID found')
  }

  for (let i = 0; i < products.length; i++) {
    let item = products[i];

    if (productId === item.id) {
      product = item;
    }

    if (product !== null) {
      for (let t = 0; t < cart.length; t++) {
        if (cart[t].product.id == productId) {
          cart[t].count++;
          //console.log(product)
          //extending to check if the count is greater than the stock, cannot more add items to cart if stock is less than the count
          if (cart[t].count > product.stock) {
            console.log("No more stock available");
            cart[t].count = product.stock;
          }
          return;
        }
      }

      let id = Math.floor(Math.random() * 30);

      let cartProduct = {
        id: id,
        count: 0,
        product,
      };

      cart.push(cartProduct);
    }
  }
}

function deleteFromCart(deleteId) {
  for (let i = 0; i < cart.length; i++) {
    //console.log(cart[i].product.id)
    if (cart[i].product.id == deleteId) {
      if (cart[i].count > 1) {
        cart[i].count -= 1;
      } else {
        cart.splice(i, 1);
      }
      return;
    }
  }
}

function updateName(updatedId, newName) {
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == updatedId) {
      products[i].title = newName;
      console.log(products[i]);
    }
  }
}

function updateStock(updatedId, newStock) {
  for (let i = 0; i < products.length; i++) {
    if (updatedId === products[i].id) {
      products[i].stock = newStock;
      console.log(products[i]);
    }
  }
}

function totalPrice([cart]) {
  let total = 0;
  for (let i = 0; i < cart.length; i++) {
    if (cart[i].product.minimumOrderQuantity < cart[i].count) {
      total +=
        cart[i].product.price *
        cart[i].count *
        (cart[i].product.discountPercentage / 100);
    } else {
      total += cart[i].product.price * cart[i].count;
    }
  }
  console.log("R" + Math.ceil(total));
}

function reviewAccount(email) {
  let count = 0;
  let reviewedProducts = [];

  for (let i = 0; i < products.length; i++) {
    for (let o = 0; o < products[i].reviews.length; o++) {
      if (products[i].reviews[o].reviewerEmail === email) {
        count++;
        reviewedProducts.push(products[i]);
      }
    }
  }

  let reviewer = {
    totalReviews: count,
    reviewedProducts: reviewedProducts,
  };

  console.log(reviewer);
  return count;
}

function discountAmount(productId) {
  let total = 0;
  for (let i = 0; i < products.length; i++) {
    if (products[i].id == productId) {
      total =
        products[i].price -
        (products[i].price * products[i].discountPercentage) / 100;
    }
  }
  console.log(total);
}

let twoMonthWarranty = [];

function warranty() {
  for (let i = 0; i < products.length; i++) {
    if (products[i].warrantyInformation) {
      let warrantyInfo = products[i].warrantyInformation.split(" ");
      let duration = parseInt(warrantyInfo[0]);
      let unit = warrantyInfo[1];

      if (
        (unit === "months" && duration < 10) ||
        (unit === "year" && duration < 1)
      ) {
        twoMonthWarranty.push(products[i]);
      }
    }
  }

  console.log(twoMonthWarranty);
}

let fiveStarArray = [];

function fiveStarRating() {
  for (let i = 0; i < products.length; i++) {
    for (let j = 0; j < products[i].reviews.length; j++) {
      if (products[i].reviews[j].rating == 5) {
        //console.log(products[i].reviews[j])
        fiveStarArray.push(products[i]);
        break;
      }
    }
  }

  console.log(fiveStarArray);
}

function dimensionsCalculation() {
  let dimensionsArray = [];

  for (let i = 0; i < products.length; i++) {
    let dimensions = products[i].dimensions;
    if (dimensions.width > 20 && dimensions.height > 20) {
      dimensionsArray.push(products[i]);
    }
  }

  console.log(dimensionsArray);
}

export { getProducts, cart, addToCart, deleteFromCart, updateName, updateStock, totalPrice, reviewAccount, discountAmount, warranty, fiveStarRating, dimensionsCalculation };