document.addEventListener("DOMContentLoaded", () => {

    /* ================= STATE ================= */

    let cart = JSON.parse(localStorage.getItem("sbCart")) || [];
    let wishlist = JSON.parse(localStorage.getItem("sbWishlist")) || [];

    let currentProduct = null;
    let quantity = 1;
    let selectedSize = null;


    /* ================= ELEMENTS ================= */

    const body = document.body;

    const header = document.querySelector(".header");

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenu = document.getElementById("closeMenu");

    const searchBtn = document.getElementById("searchBtn");
    const mobileSearchBtn = document.getElementById("mobileSearchBtn");

    const searchPanel = document.getElementById("searchPanel");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    const filterBtn = document.getElementById("filterBtn");
    const filters = document.getElementById("filters");

    const modal = document.getElementById("productModal");
    const modalClose = document.getElementById("modalClose");

    const modalImage = document.getElementById("modalImage");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalTotal = document.getElementById("modalTotal");

    const quantityText = document.getElementById("quantity");

    const cartPanel = document.getElementById("cart");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItems = document.getElementById("cartItems");

    const cartCount = document.getElementById("cartCount");
    const cartTotal = document.getElementById("cartTotal");


    /* ================= HEADER ================= */

    window.addEventListener("scroll", () => {

        if (window.scrollY > 80) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

    });


    /* ================= MOBILE MENU ================= */

    menuBtn?.addEventListener("click", () => {
        mobileMenu.classList.add("active");
        body.style.overflow = "hidden";
    });

    closeMenu?.addEventListener("click", closeMobileMenu);

    document.querySelectorAll(".mobile-links a").forEach(link => {

        link.addEventListener("click", closeMobileMenu);

    });

    function closeMobileMenu() {

        mobileMenu.classList.remove("active");
        body.style.overflow = "";

    }


    /* ================= SEARCH ================= */

    function openSearch() {

        searchPanel.classList.add("active");
        body.style.overflow = "hidden";

        setTimeout(() => {
            searchInput.focus();
        }, 250);

        renderSearchResults("");

    }

    function closeSearchPanel() {

        searchPanel.classList.remove("active");
        body.style.overflow = "";

    }

    searchBtn?.addEventListener("click", openSearch);
    mobileSearchBtn?.addEventListener("click", openSearch);

    closeSearch?.addEventListener("click", closeSearchPanel);

    searchInput?.addEventListener("input", () => {

        renderSearchResults(searchInput.value);

    });


    document.querySelectorAll(".suggestions button").forEach(button => {

        button.addEventListener("click", () => {

            searchInput.value = button.textContent;

            renderSearchResults(button.textContent);

        });

    });


    function renderSearchResults(query) {

        const products = [...document.querySelectorAll(".product")];

        const value = query.trim().toLowerCase();

        const matches = products.filter(product => {

            const name = product.dataset.name.toLowerCase();
            const category = product.dataset.category.toLowerCase();

            return !value ||
                   name.includes(value) ||
                   category.includes(value);

        });

        searchResults.innerHTML = "";

        matches.forEach(product => {

            const result = document.createElement("button");

            result.className = "search-result";

            result.innerHTML = `
                <span>${product.dataset.name}</span>
                <strong>₹${Number(product.dataset.price).toLocaleString("en-IN")}</strong>
            `;

            result.addEventListener("click", () => {

                closeSearchPanel();

                document.getElementById("shop").scrollIntoView({
                    behavior: "smooth"
                });

                setTimeout(() => {

                    openProduct(product);

                }, 500);

            });

            searchResults.appendChild(result);

        });

        if (!matches.length) {

            searchResults.innerHTML = `
                <div class="search-result">
                    <span>No pieces found.</span>
                </div>
            `;

        }

    }


    /* ================= FILTER ================= */

    filterBtn?.addEventListener("click", () => {

        filters.classList.toggle("show");

    });


    document.querySelectorAll(".filter").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".filter")
                .forEach(item => item.classList.remove("active"));

            button.classList.add("active");

            const category = button.dataset.filter;

            document.querySelectorAll(".product").forEach(product => {

                if (
                    category === "all" ||
                    product.dataset.category === category
                ) {

                    product.style.display = "";

                } else {

                    product.style.display = "none";

                }

            });

        });

    });


    /* ================= WISHLIST ================= */

    function saveWishlist() {

        localStorage.setItem(
            "sbWishlist",
            JSON.stringify(wishlist)
        );

    }


    function updateWishlistButtons() {

        document.querySelectorAll(".product").forEach(product => {

            const name = product.dataset.name;

            const button = product.querySelector(".heart");

            if (!button) return;

            if (wishlist.includes(name)) {

                button.classList.add("liked");
                button.textContent = "♥";

            } else {

                button.classList.remove("liked");
                button.textContent = "♡";

            }

        });

    }


    document.querySelectorAll(".heart").forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            const product = button.closest(".product");

            const name = product.dataset.name;

            if (wishlist.includes(name)) {

                wishlist = wishlist.filter(item => item !== name);

            } else {

                wishlist.push(name);

            }

            saveWishlist();
            updateWishlistButtons();

        });

    });


    document.getElementById("wishlistBtn")
        ?.addEventListener("click", () => {

            const likedProducts = wishlist.length;

            if (!likedProducts) {

                alert("Your wishlist is empty.");

            } else {

                alert(
                    `${likedProducts} item${likedProducts > 1 ? "s" : ""} saved in your wishlist.`
                );

            }

        });


    document.getElementById("mobileWishlistBtn")
        ?.addEventListener("click", () => {

            document.getElementById("wishlistBtn").click();

        });


    /* ================= PRODUCT MODAL ================= */

    document.querySelectorAll(".quick-add").forEach(button => {

        button.addEventListener("click", event => {

            event.stopPropagation();

            const product = button.closest(".product");

            openProduct(product);

        });

    });


    document.querySelectorAll(".product-image").forEach(image => {

        image.addEventListener("click", event => {

            if (
                event.target.classList.contains("heart") ||
                event.target.classList.contains("quick-add")
            ) {
                return;
            }

            const product = image.closest(".product");

            openProduct(product);

        });

    });


    function openProduct(product) {

        if (!product) return;

        currentProduct = {

            name: product.dataset.name,

            price: Number(product.dataset.price),

            image: product.dataset.image,

            category: product.dataset.category

        };

        quantity = 1;
        selectedSize = null;

        quantityText.textContent = "1";

        modalImage.src = currentProduct.image;
        modalImage.alt = currentProduct.name;

        modalName.textContent = currentProduct.name;

        modalPrice.textContent =
            "₹" +
            currentProduct.price.toLocaleString("en-IN");

        modalTotal.textContent =
            "₹" +
            currentProduct.price.toLocaleString("en-IN");

        document.querySelectorAll(".size")
            .forEach(size => size.classList.remove("selected"));

        modal.classList.add("active");

        body.style.overflow = "hidden";

    }


    function closeModal() {

        modal.classList.remove("active");

        if (
            !cartPanel.classList.contains("active") &&
            !searchPanel.classList.contains("active")
        ) {
            body.style.overflow = "";
        }

    }


    modalClose?.addEventListener("click", closeModal);


    modal?.addEventListener("click", event => {

        if (event.target === modal) {

            closeModal();

        }

    });


    /* ================= SIZE ================= */

    document.querySelectorAll(".size").forEach(size => {

        size.addEventListener("click", () => {

            document.querySelectorAll(".size")
                .forEach(item => item.classList.remove("selected"));

            size.classList.add("selected");

            selectedSize = size.textContent;

        });

    });


    /* ================= QUANTITY ================= */

    document.getElementById("minus")
        ?.addEventListener("click", () => {

            if (quantity > 1) {

                quantity--;

                updateQuantity();

            }

        });


    document.getElementById("plus")
        ?.addEventListener("click", () => {

            if (quantity < 10) {

                quantity++;

                updateQuantity();

            }

        });


    function updateQuantity() {

        quantityText.textContent = quantity;

        if (!currentProduct) return;

        const total =
            currentProduct.price * quantity;

        modalTotal.textContent =
            "₹" +
            total.toLocaleString("en-IN");

    }


    /* ================= ADD CART ================= */

    document.getElementById("addCart")
        ?.addEventListener("click", () => {

            if (!currentProduct) return;

            if (!selectedSize) {

                alert("Please select a size.");

                return;

            }

            const existing = cart.find(item =>
                item.name === currentProduct.name &&
                item.size === selectedSize
            );

            if (existing) {

                existing.quantity += quantity;

            } else {

                cart.push({

                    name: currentProduct.name,

                    price: currentProduct.price,

                    image: currentProduct.image,

                    size: selectedSize,

                    quantity: quantity

                });

            }

            saveCart();

            updateCartCount();

            renderCart();

            closeModal();

            openCart();

        });


    /* ================= CART ================= */

    document.getElementById("cartBtn")
        ?.addEventListener("click", openCart);

    document.getElementById("mobileCartBtn")
        ?.addEventListener("click", openCart);

    document.getElementById("closeCart")
        ?.addEventListener("click", closeCart);

    cartOverlay?.addEventListener("click", closeCart);


    function openCart() {

        cartPanel.classList.add("active");

        cartOverlay.classList.add("active");

        body.style.overflow = "hidden";

        renderCart();

    }


    function closeCart() {

        cartPanel.classList.remove("active");

        cartOverlay.classList.remove("active");

        if (!modal.classList.contains("active")) {

            body.style.overflow = "";

        }

    }


    function saveCart() {

        localStorage.setItem(
            "sbCart",
            JSON.stringify(cart)
        );

    }


    function updateCartCount() {

        const count = cart.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        cartCount.textContent = count;

    }


    function renderCart() {

        if (!cart.length) {

            cartItems.innerHTML = `
                <div class="empty">
                    <span>00</span>
                    <p>YOUR CART IS EMPTY.</p>
                    <a href="#shop" id="continueShopping">
                        SHOP NOW
                    </a>
                </div>
            `;

            updateCartTotal();

            document.getElementById("continueShopping")
                ?.addEventListener("click", closeCart);

            return;

        }


        cartItems.innerHTML = "";


        cart.forEach((item, index) => {

            const product = document.createElement("div");

            product.className = "cart-product";

            product.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}">

                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        SIZE ${item.size} · QTY ${item.quantity}
                    </p>

                    <p>
                        ₹${(
                            item.price *
                            item.quantity
                        ).toLocaleString("en-IN")}
                    </p>

                </div>

                <button
                    class="remove"
                    aria-label="Remove">

                    ×

                </button>

            `;


            product.querySelector(".remove")
                .addEventListener("click", () => {

                    cart.splice(index, 1);

                    saveCart();

                    updateCartCount();

                    renderCart();

                });


            cartItems.appendChild(product);

        });


        updateCartTotal();

    }


    function updateCartTotal() {

        const total = cart.reduce(
            (sum, item) =>
                sum +
                item.price *
                item.quantity,
            0
        );

        cartTotal.textContent =
            "₹" +
            total.toLocaleString("en-IN");

    }


    /* ================= CHECKOUT ================= */

    document.getElementById("checkout")
        ?.addEventListener("click", () => {

            if (!cart.length) {

                alert("Your cart is empty.");

                return;

            }

            let message =
                "Hello SB Trend Thrift!%0A%0A" +
                "I want to place an order:%0A%0A";

            cart.forEach(item => {

                message +=
                    `${item.name} - Size ${item.size} - Qty ${item.quantity} - ₹${item.price * item.quantity}%0A`;

            });

            message +=
                `%0ASubtotal: ${cartTotal.textContent}`;

            const whatsappURL =
                "https://wa.me/?text=" +
                message;

            window.open(
                whatsappURL,
                "_blank"
            );

        });


    /* ================= NEWSLETTER ================= */

    document.getElementById("newsletterForm")
        ?.addEventListener("submit", event => {

            event.preventDefault();

            const input =
                event.target.querySelector("input");

            alert(
                "You're on the list. Welcome to SB THRIFT."
            );

            input.value = "";

        });


    /* ================= ESCAPE ================= */

    document.addEventListener("keydown", event => {

        if (event.key !== "Escape") return;

        closeModal();
        closeCart();
        closeSearchPanel();
        closeMobileMenu();

    });


    /* ================= INITIALIZE ================= */

    updateCartCount();

    renderCart();

    updateWishlistButtons();

});