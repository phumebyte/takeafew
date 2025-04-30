# 🛒 Takeafew – Sprint Review

This project is a fully functional **E-Commerce web application** built using **Vanilla JavaScript**, **HTML**, **CSS**, and **TailwindCSS**, with **Jest** for testing. The app allows users to browse products, manage a shopping cart, and simulate the checkout experience, with a focus on testing business logic and preserving user data with `localStorage`.

---

## 🚀 Features

### 🔐 Authentication
- **User Registration** – Register a new user using a simple form. Data is stored in `localStorage`.
- **User Login** – Authenticated access to specific features (e.g., checkout).

### 🛍️ Product Display
- **Product List** – Fetch and display products from [DummyJSON API](https://dummyjson.com/products).
- **Product Details** – View detailed information including:
  - Title
  - Category Name
  - Description
  - Discount
  - Additional Images
  - Price
  - Rating
  - Return Policy
  - Reviews
  - Warranty Information

### 🛒 Cart Functionality
- Add products to cart
- Remove products from cart
- Clear the cart
- **Total price** updates automatically when cart is modified

### ✅ Checkout
- **Authenticated Users** – See a success message upon checkout
- **Unauthenticated Users** – Receive an error message

---

## 💾 Local Storage Usage
- Store **registered accounts** in `localStorage`
- (Bonus) Save **cart data** in `localStorage` to persist across sessions

---

## 🧪 Testing

### ✅ Unit Testing with Jest
- Test **all pure JavaScript functions**
- ❌ *Do not test DOM manipulation or localStorage interactions*

---

## 🎯 Bonus Features

- 🔍 **Search functionality** – Filter products by keyword
- 📂 **Filter by Category** – Dynamically show only selected categories
- 🧾 **Checkout Modal** – Allow users to input cart & address info before confirming

---

## 🛠️ Tech Stack

| Tech          | Description                   |
|---------------|-------------------------------|
| JavaScript    | Vanilla JS (ES6+)             |
| HTML/CSS      | Semantic HTML & custom styling|
| TailwindCSS   | Utility-first CSS framework   |
| Jest          | Unit testing framework        |
| localStorage  | Browser storage for state     |

---

## 📦 Setup Instructions

1. **Clone the repository**  
   ```bash
   git clone https://github.com/your-username/ecommerce-app.git
   ```

2. **Install dependancies**
   ```bash
    npm install
   ```

 3. **Run Tests**
   ```bash
    npm test
   ```
4. Run index.html on your browser

## 📌 Notes

 - Ensure all state changes are reflected instantly in the UI.
 - Avoid overengineering—stick to simple, clean Vanilla JS logic.
 - Emphasize accessibility and responsive design using Tailwind.
