# Handmade Store - Project Study Guide 📚

Welcome to the **Handmade Store** project! This documentation is designed to help students and developers understand the internal working, structure, and key concepts used in this Next.js e-commerce application.

## 🚀 Project Overview

This is a modern, responsive e-commerce web application built for selling handmade jewelry. It features a product catalog, a shopping cart with local storage persistence, and a secure checkout process integrated with Razorpay for payments.

### Key Features
- **Product Browsing**: View featured and all products.
- **Shopping Cart**: Add/remove items, update quantities, auto-save to local storage.
- **Checkout**: User details form and order summary.
- **Payments**: 
  - **Razorpay**: Real-time online payments.
  - **COD**: Cash on Delivery support.
- **Responsive Design**: Works seamlessly on mobile and desktop.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router) - For routing and server/client components.
- **Language**: JavaScript (React).
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
- **UI Library**: [shadcn/ui](https://ui.shadcn.com/) (based on Radix UI) - For accessible, reusable components.
- **Icons**: [Lucide React](https://lucide.dev/).
- **State Management**: React Context API (`CartContext`).
- **Form Handling**: React Hook Form.
- **Payments**: Razorpay SDK.

---

## 📂 Project Structure

Here is a breakdown of the key directories and files:

```
anu.handmadestore/
├── app/                        # Next.js App Router (Main Application Logic)
│   ├── api/                    # Backend API Routes
│   │   └── razorpay/           # Razorpay payment integration endpoints
│   ├── checkout/               # Checkout page route
│   ├── layout.js               # Root layout (fonts, global providers)
│   └── page.js                 # Homepage (Landing page)
├── components/                 # React Components
│   ├── ui/                     # Reusable UI elements (Buttons, Inputs, Dialogs)
│   ├── CartDrawer.js           # Slide-out shopping cart component
│   ├── ProductCard.js          # Individual product display
│   ├── Header.js               # Navigation bar
│   └── ...                     # Other feature-specific components
├── context/                    # Global State Management
│   └── CartContext.js          # Logic for Cart (Add, Remove, Persist)
├── lib/                        # Utilities and Data
│   ├── productsData.js         # Static "Database" of products
│   └── utils.js                # Helper functions (class merging)
└── public/                     # Static Assets
    └── assets/                 # Product images
```

---

## 🧠 Key Modules Explained

### 1. Data Source (`lib/productsData.js`)
Instead of a complex database, this project uses a static file to store product information. This is great for learning as it keeps the data easy to read and modify.
- **Structure**: An array of objects, where each object represents a product (ID, name, price, image, etc.).
- **Usage**: Components import this array to display products.

### 2. State Management (`context/CartContext.js`)
This is the "brain" of the shopping cart. It uses **React Context** to allow any component in the app (Header, ProductCard, CartDrawer) to access and modify the cart state.
- **`items`**: State variable holding the array of products in the cart.
- **`useEffect`**:
  - **Load**: On startup, it checks `localStorage` to restore previous cart items.
  - **Save**: Whenever `items` change, it saves the new list to `localStorage`.
- **`addToCart` / `removeFromCart`**: Functions exposed to the rest of the app to modify the state.

### 3. The Checkout Flow (`app/checkout/page.js`)
This page handles the final steps of the purchase.
- **Form**: Collects user details (Name, Address, Phone).
- **Payment Selection**: Users can choose between "Online Payment" (Razorpay) or "Cash on Delivery".
- **Razorpay Integration**:
  1. Calls internal API (`/api/razorpay/create-order`) to generate an order ID.
  2. Opens the Razorpay Modal on the frontend using the order ID.
  3. Handles success/failure responses.

### 4. UI Components (`components/ui/`)
The project uses a modular UI approach. Instead of writing raw CSS, we import pre-built, accessible components like `<Button />` or `<Input />`. These are located in `components/ui` and are styled using Tailwind CSS classes.

---

## 🎓 Learning Exercises for Students

If you want to practice and improve your skills, try these tasks:

1.  **Add a New Product**: 
    - Open `lib/productsData.js`.
    - Add a new object to the array with a unique ID and image.
    - Check if it appears on the homepage.
2.  **Change Currency**:
    - The store currently uses INR (₹). Try finding where the currency symbol is displayed (hint: `ProductCard.js` or `CartDrawer.js`) and change it.
3.  **Form Validation**:
    - In `checkout/page.js`, try adding a validation rule that requires the phone number to be exactly 10 digits.

---

## 🏃‍♂️ How to Run the Project

1.  **Install Dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

2.  **Start Development Server**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```

3.  **Open in Browser**:
    Visit [http://localhost:3000](http://localhost:3000).

---

