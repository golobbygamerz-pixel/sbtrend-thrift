/* =========================================
   SB THRIFT
   MAIN JAVASCRIPT
========================================= */


/* PRODUCTS */

const products = [
  {
    id: 1,
    name: "Vintage Oversized Shirt",
    category: "VINTAGE / SHIRTS",
    price: 799,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=900&q=85",
    badge: "NEW"
  },

  {
    id: 2,
    name: "Classic Denim Jacket",
    category: "OUTERWEAR / DENIM",
    price: 1499,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=900&q=85",
    badge: "LIMITED"
  },

  {
    id: 3,
    name: "Relaxed Streetwear Tee",
    category: "STREETWEAR / TEES",
    price: 599,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=900&q=85",
    badge: "NEW"
  },

  {
    id: 4,
    name: "Vintage Utility Jacket",
    category: "VINTAGE / JACKETS",
    price: 1899,
    image: "https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=900&q=85",
    badge: "ONE OF ONE"
  }
];


let cart = [];
let wishlist = [];


/* PRODUCT RENDER */

const productsContainer = document.getElementById("products");

function renderProducts() {

  productsContainer.innerHTML = products.map(product => {

    const liked = wishlist.includes(product.id);

    return `
      <article class="product">

        <div class="product-image">

          <img
            src="${product.image}"
            alt="${product.name}"
            loading="lazy"
          >

          <span class="product-badge">
            ${product.badge}
          </span>

          <button
            class="product-heart ${liked ? "active" : ""}"
            onclick="toggleWishlist(${product.id})"
            aria-label="Wishlist"
          >
            ${liked ? "♥" : "♡"}
          </button>

          <button
            class="quick-add"
            onclick="addToCart(${product.id})"
          >
            QUICK ADD +
          </button>

        </div>

        <div class="product-info">

          <p class="product-category">
            ${product.category}
          </p>

          <h3 class="product-name">
            ${product.name}
          </h3>

          <p class="product-price">
            ₹${product.price.toLocaleString("en-IN")}
          </p>

        </div>

      </article>
    `;

  }).join("");

}

renderProducts();


/* WISHLIST */

function toggleWishlist(id) {

  if (wishlist.includes(id)) {

    wishlist = wishlist.filter(item => item !== id);

    showToast("REMOVED FROM WISHLIST");

  } else {

    wishlist.push(id);

    showToast("ADDED TO WISHLIST");

  }

  document.getElementById("wishlistCount").textContent =
    wishlist.length;

  renderProducts();

}


/* CART */

function addToCart(id) {

  const product = products.find(item => item.id === id);

  if (!product) return;

  const existing = cart.find(item => item.id === id);

  if (existing) {

    existing.quantity += 1;

  } else {

    cart.push({
      ...product,
      quantity: 1
    });

  }

  updateCart();

  openCart();

  showToast("ADDED TO BAG");

}


function removeFromCart(id) {

  cart = cart.filter(item => item.id !== id);

  updateCart();

}


function updateCart() {

  const cartItems = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const subtotalElement = document.getElementById("subtotal");

  const totalQuantity = cart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalQuantity;

  subtotalElement.textContent =
    `₹${subtotal.toLocaleString("en-IN")}`;


  if (!cart.length) {

    cartItems.innerHTML = `
      <div class="empty-cart">
        YOUR BAG IS EMPTY.
      </div>
    `;

  } else {

    cartItems.innerHTML = cart.map(item => {

      return `
        <div class="cart-item">

          <img src="${item.image}" alt="${item.name}">

          <div class="cart-item-info">

            <h4>${item.name}</h4>

            <p>
              ₹${item.price.toLocaleString("en-IN")}
              × ${item.quantity}
            </p>

          </div>

          <button
            class="remove-item"
            onclick="removeFromCart(${item.id})"
          >
            REMOVE
          </button>

        </div>
      `;

    }).join("");

  }


  /* FREE SHIPPING */

  const progress = Math.min(
    subtotal / 999,
    1
  ) * 100;

  document.getElementById("shippingBar").style.width =
    `${progress}%`;


  const shippingText =
    document.getElementById("shippingText");

  if (subtotal >= 999) {

    shippingText.textContent =
      "FREE SHIPPING UNLOCKED ✓";

  } else {

    shippingText.textContent =
      `Add ₹${(999 - subtotal).toLocaleString("en-IN")} to unlock free shipping.`;

  }

}


/* CART OPEN/CLOSE */

const cartDrawer =
  document.getElementById("cartDrawer");

const cartBackdrop =
  document.getElementById("cartBackdrop");

function openCart() {

  cartDrawer.classList.add("active");
  cartBackdrop.classList.add("active");

  document.body.classList.add("no-scroll");

}

function closeCart() {

  cartDrawer.classList.remove("active");
  cartBackdrop.classList.remove("active");

  document.body.classList.remove("no-scroll");

}

document
  .getElementById("cartOpen")
  .addEventListener("click", openCart);

document
  .getElementById("cartClose")
  .addEventListener("click", closeCart);

cartBackdrop.addEventListener(
  "click",
  closeCart
);


/* SEARCH */

const searchOverlay =
  document.getElementById("searchOverlay");

document
  .getElementById("searchOpen")
  .addEventListener("click", () => {

    searchOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

    setTimeout(() => {

      document
        .getElementById("searchInput")
        .focus();

    }, 300);

  });


document
  .getElementById("searchClose")
  .addEventListener("click", () => {

    searchOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

  });


/* SEARCH ENTER */

document
  .getElementById("searchInput")
  .addEventListener("keydown", event => {

    if (event.key === "Enter") {

      const query =
        event.target.value.trim();

      if (query) {

        showToast(`SEARCHING: ${query.toUpperCase()}`);

      }

    }

  });


/* POPULAR SEARCH */

document
  .querySelectorAll(".popular-searches button")
  .forEach(button => {

    button.addEventListener("click", () => {

      document
        .getElementById("searchInput")
        .value = button.textContent;

    });

  });


/* MOBILE MENU */

const mobileMenu =
  document.getElementById("mobileMenu");

document
  .getElementById("menuOpen")
  .addEventListener("click", () => {

    mobileMenu.classList.add("active");

    document.body.classList.add("no-scroll");

  });


document
  .getElementById("menuClose")
  .addEventListener("click", closeMobileMenu);


document
  .querySelectorAll(".mobile-links a")
  .forEach(link => {

    link.addEventListener("click", closeMobileMenu);

  });


function closeMobileMenu() {

  mobileMenu.classList.remove("active");

  document.body.classList.remove("no-scroll");

}


/* NAVBAR SCROLL */

const navbar =
  document.getElementById("navbar");

window.addEventListener(
  "scroll",
  () => {

    if (window.scrollY > 50) {

      navbar.classList.add("scrolled");

    } else {

      navbar.classList.remove("scrolled");

    }

  },
  { passive: true }
);


/* PRODUCT ARROWS */

let productOffset = 0;

document
  .getElementById("next")
  .addEventListener("click", () => {

    productOffset++;

    productsContainer.style.transform =
      `translateX(-${productOffset * 15}px)`;

  });


document
  .getElementById("previous")
  .addEventListener("click", () => {

    productOffset =
      Math.max(0, productOffset - 1);

    productsContainer.style.transform =
      `translateX(-${productOffset * 15}px)`;

  });


/* NEWSLETTER */

document
  .getElementById("newsletter")
  .addEventListener("submit", event => {

    event.preventDefault();

    const email =
      event.target.querySelector("input").value;

    if (!email) return;

    event.target.reset();

    showToast("WELCOME TO SB THRIFT");

  });


/* TOAST */

let toastTimer;

function showToast(message) {

  const toast =
    document.getElementById("toast");

  toast.textContent = message;

  toast.classList.add("active");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {

    toast.classList.remove("active");

  }, 2200);

}


/* ESC KEY */

document.addEventListener("keydown", event => {

  if (event.key !== "Escape") return;

  closeCart();

  mobileMenu.classList.remove("active");

  searchOverlay.classList.remove("active");

  document.body.classList.remove("no-scroll");

});


/* INITIAL CART */

updateCart();