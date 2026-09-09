document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       SB TREND THRIFT — MAIN SCRIPT
       ========================================================= */

    const cart = [];
    let currentProduct = null;
    let quantity = 1;
    let selectedSize = null;


    /* =========================================================
       PRODUCT IMAGES
       ========================================================= */

    const uploadedImages = [
        "IMG_0602.jpeg",
        "IMG_0604.jpeg",
        "IMG_0605.jpeg"
    ];

    const productDetails = [
        {
            description:
                "A clean utility-inspired denim with a relaxed streetwear silhouette. Easy to style with oversized tees, hoodies and sneakers.",
            condition: "Excellent",
            sizes: ["30", "32", "34", "36"]
        },
        {
            description:
                "Relaxed wide-fit denim with a classic washed-blue finish. A versatile everyday piece designed for effortless streetwear styling.",
            condition: "Excellent",
            sizes: ["28", "30", "32", "34"]
        },
        {
            description:
                "Pre-loved washed denim with a vintage-inspired finish. Designed for a relaxed silhouette and everyday streetwear looks.",
            condition: "Very Good",
            sizes: ["28", "30", "32", "34"]
        }
    ];


    /*
       Automatically connect uploaded images
       to the first 3 product cards.
    */

    const products = document.querySelectorAll(".product");

    products.forEach((product, index) => {

        if (uploadedImages[index]) {

            product.dataset.image = uploadedImages[index];

            const image = product.querySelector("img");

            if (image) {
                image.src = uploadedImages[index];
            }
        }

        if (productDetails[index]) {

            product.dataset.description =
                productDetails[index].description;

            product.dataset.condition =
                productDetails[index].condition;

            product.dataset.sizes =
                productDetails[index].sizes.join(",");
        }

    });


    /* =========================================================
       MENU
       ========================================================= */

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenu = document.getElementById("closeMenu");

    if (menuBtn && mobileMenu) {

        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.add("active");
        });

    }

    if (closeMenu && mobileMenu) {

        closeMenu.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });

    }

    document.querySelectorAll(".mobile-links a").forEach(link => {

        link.addEventListener("click", () => {

            if (mobileMenu) {
                mobileMenu.classList.remove("active");
            }

        });

    });


    /* =========================================================
       SEARCH
       ========================================================= */

    const searchBtn = document.getElementById("searchBtn");
    const searchPanel = document.getElementById("searchPanel");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    if (searchBtn && searchPanel) {

        searchBtn.addEventListener("click", () => {

            searchPanel.classList.add("active");

            if (searchInput) {

                setTimeout(() => {
                    searchInput.focus();
                }, 200);

            }

        });

    }

    if (closeSearch && searchPanel) {

        closeSearch.addEventListener("click", () => {

            searchPanel.classList.remove("active");

        });

    }


    if (searchInput) {

        searchInput.addEventListener("input", () => {

            const value =
                searchInput.value.toLowerCase().trim();

            document.querySelectorAll(".product").forEach(product => {

                const name =
                    (product.dataset.name || "").toLowerCase();

                const category =
                    (product.dataset.category || "").toLowerCase();

                const matches =
                    name.includes(value) ||
                    category.includes(value);

                product.style.display =
                    matches ? "" : "none";

            });

        });

    }


    document.querySelectorAll(".suggestions button").forEach(btn => {

        btn.addEventListener("click", () => {

            if (!searchInput) return;

            searchInput.value =
                btn.textContent.trim();

            searchInput.dispatchEvent(
                new Event("input")
            );

        });

    });


    /* =========================================================
       FILTER
       ========================================================= */

    const filterBtn =
        document.getElementById("filterBtn");

    const filters =
        document.getElementById("filters");

    if (filterBtn && filters) {

        filterBtn.addEventListener("click", () => {

            filters.classList.toggle("show");

        });

    }


    document.querySelectorAll(".filter").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".filter")
                .forEach(x =>
                    x.classList.remove("active")
                );

            button.classList.add("active");

            const category =
                button.dataset.filter;

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


    /* =========================================================
       WISHLIST
       ========================================================= */

    document.querySelectorAll(".heart").forEach(button => {

        button.addEventListener("click", e => {

            e.stopPropagation();

            button.classList.toggle("liked");

            button.textContent =
                button.classList.contains("liked")
                    ? "♥"
                    : "♡";

        });

    });


    /* =========================================================
       PRODUCT MODAL
       ========================================================= */

    const modal =
        document.getElementById("productModal");

    const modalClose =
        document.getElementById("modalClose");

    const modalImage =
        document.getElementById("modalImage");

    const modalName =
        document.getElementById("modalName");

    const modalPrice =
        document.getElementById("modalPrice");

    const modalTotal =
        document.getElementById("modalTotal");

    const quantityText =
        document.getElementById("quantity");

    /*
       Optional elements.
       If they exist in HTML, they will be filled.
    */

    const modalDescription =
        document.getElementById("modalDescription");

    const modalCondition =
        document.getElementById("modalCondition");

    const modalSizes =
        document.getElementById("modalSizes");


    /* =========================================================
       OPEN PRODUCT
       ========================================================= */

    document.querySelectorAll(".quick-add").forEach(button => {

        button.addEventListener("click", e => {

            const product =
                e.target.closest(".product");

            if (!product) return;


            /* PRODUCT DATA */

            const rawPrice =
                product.dataset.price || "0";

            const cleanPrice =
                rawPrice
                    .replace(/[₹,]/g, "")
                    .trim();


            currentProduct = {

                name:
                    product.dataset.name ||
                    "SB Trend Thrift Product",

                price:
                    Number(cleanPrice) || 0,

                image:
                    product.dataset.image ||
                    product.querySelector("img")?.src ||
                    "",

                description:
                    product.dataset.description ||
                    "Curated pre-loved fashion piece selected by SB Trend Thrift.",

                condition:
                    product.dataset.condition ||
                    "Very Good",

                sizes:
                    product.dataset.sizes
                        ? product.dataset.sizes.split(",")
                        : ["28", "30", "32", "34"]

            };


            quantity = 1;
            selectedSize = null;


            /* QUANTITY */

            if (quantityText) {
                quantityText.textContent =
                    quantity;
            }


            /* IMAGE */

            if (modalImage) {

                modalImage.src =
                    currentProduct.image;

                modalImage.alt =
                    currentProduct.name;

            }


            /* NAME */

            if (modalName) {

                modalName.textContent =
                    currentProduct.name;

            }


            /* PRICE */

            if (modalPrice) {

                modalPrice.textContent =
                    "₹" +
                    currentProduct.price
                        .toLocaleString("en-IN");

            }


            /* TOTAL */

            if (modalTotal) {

                modalTotal.textContent =
                    "₹" +
                    currentProduct.price
                        .toLocaleString("en-IN");

            }


            /* DESCRIPTION */

            if (modalDescription) {

                modalDescription.textContent =
                    currentProduct.description;

            }


            /* CONDITION */

            if (modalCondition) {

                modalCondition.textContent =
                    currentProduct.condition;

            }


            /* SIZE BUTTONS */

            if (modalSizes) {

                modalSizes.innerHTML = "";

                currentProduct.sizes.forEach(size => {

                    const button =
                        document.createElement("button");

                    button.className =
                        "size";

                    button.textContent =
                        size;

                    button.addEventListener(
                        "click",
                        () => {

                            document
                                .querySelectorAll(".size")
                                .forEach(x =>
                                    x.classList.remove(
                                        "selected"
                                    )
                                );

                            button.classList.add(
                                "selected"
                            );

                            selectedSize =
                                size;

                        }
                    );

                    modalSizes.appendChild(
                        button
                    );

                });

            } else {

                /*
                   If your existing HTML already has
                   .size buttons, use those.
                */

                document
                    .querySelectorAll(".size")
                    .forEach(x =>
                        x.classList.remove(
                            "selected"
                        )
                    );

            }


            /* OPEN MODAL */

            if (modal) {

                modal.classList.add("active");

                document.body.classList.add(
                    "modal-open"
                );

            }

        });

    });


    /* =========================================================
       CLOSE MODAL
       ========================================================= */

    function closeModal() {

        if (modal) {
            modal.classList.remove("active");
        }

        document.body.classList.remove(
            "modal-open"
        );

    }


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeModal
        );

    }


    if (modal) {

        modal.addEventListener("click", e => {

            if (e.target === modal) {
                closeModal();
            }

        });

    }


    /* =========================================================
       EXISTING SIZE BUTTONS
       ========================================================= */

    document.querySelectorAll(".size").forEach(size => {

        size.addEventListener("click", () => {

            document
                .querySelectorAll(".size")
                .forEach(x =>
                    x.classList.remove(
                        "selected"
                    )
                );

            size.classList.add("selected");

            selectedSize =
                size.textContent.trim();

        });

    });


    /* =========================================================
       QUANTITY
       ========================================================= */

    const minus =
        document.getElementById("minus");

    const plus =
        document.getElementById("plus");


    if (minus) {

        minus.addEventListener("click", () => {

            if (quantity > 1) {

                quantity--;

                updateQuantity();

            }

        });

    }


    if (plus) {

        plus.addEventListener("click", () => {

            quantity++;

            updateQuantity();

        });

    }


    function updateQuantity() {

        if (quantityText) {

            quantityText.textContent =
                quantity;

        }


        if (
            currentProduct &&
            modalTotal
        ) {

            const total =
                currentProduct.price *
                quantity;

            modalTotal.textContent =
                "₹" +
                total.toLocaleString(
                    "en-IN"
                );

        }

    }


    /* =========================================================
       ADD TO CART
       ========================================================= */

    const addCart =
        document.getElementById("addCart");


    if (addCart) {

        addCart.addEventListener(
            "click",
            () => {

                if (!currentProduct) return;


                if (!selectedSize) {

                    alert(
                        "Please select a size."
                    );

                    return;

                }


                cart.push({

                    name:
                        currentProduct.name,

                    price:
                        currentProduct.price,

                    image:
                        currentProduct.image,

                    size:
                        selectedSize,

                    quantity:
                        quantity

                });


                updateCartCount();

                closeModal();

                openCart();

                renderCart();

            }
        );

    }


    /* =========================================================
       CART
       ========================================================= */

    const cartPanel =
        document.getElementById("cart");

    const cartOverlay =
        document.getElementById(
            "cartOverlay"
        );


    const cartBtn =
        document.getElementById(
            "cartBtn"
        );


    const closeCartBtn =
        document.getElementById(
            "closeCart"
        );


    if (cartBtn) {

        cartBtn.addEventListener(
            "click",
            openCart
        );

    }


    if (closeCartBtn) {

        closeCartBtn.addEventListener(
            "click",
            closeCart
        );

    }


    if (cartOverlay) {

        cartOverlay.addEventListener(
            "click",
            closeCart
        );

    }


    function openCart() {

        if (cartPanel) {

            cartPanel.classList.add(
                "active"
            );

        }

        if (cartOverlay) {

            cartOverlay.classList.add(
                "active"
            );

        }

    }


    function closeCart() {

        if (cartPanel) {

            cartPanel.classList.remove(
                "active"
            );

        }

        if (cartOverlay) {

            cartOverlay.classList.remove(
                "active"
            );

        }

    }


    /* =========================================================
       CART COUNT
       ========================================================= */

    function updateCartCount() {

        const count =
            cart.reduce(
                (sum, item) =>
                    sum + item.quantity,
                0
            );


        const countElement =
            document.getElementById(
                "cartCount"
            );


        if (countElement) {

            countElement.textContent =
                count;

        }

    }


    /* =========================================================
       RENDER CART
       ========================================================= */

    function renderCart() {

        const container =
            document.getElementById(
                "cartItems"
            );


        if (!container) return;


        if (cart.length === 0) {

            container.innerHTML = `

                <div class="empty">

                    <span>00</span>

                    <p>
                        YOUR CART IS EMPTY.
                    </p>

                    <a
                        href="#shop"
                        id="continueShopping">
                        SHOP NOW
                    </a>

                </div>

            `;

            updateTotal();

            return;

        }


        container.innerHTML = "";


        cart.forEach((item, index) => {

            const element =
                document.createElement(
                    "div"
                );


            element.className =
                "cart-product";


            element.innerHTML = `

                <img
                    src="${item.image}"
                    alt="${item.name}">

                <div>

                    <h4>
                        ${item.name}
                    </h4>

                    <p>
                        SIZE ${item.size}
                        · QTY ${item.quantity}
                    </p>

                    <p>
                        ₹${(
                            item.price *
                            item.quantity
                        ).toLocaleString(
                            "en-IN"
                        )}
                    </p>

                </div>

                <button
                    class="remove"
                    aria-label="Remove product">
                    ×
                </button>

            `;


            const remove =
                element.querySelector(
                    ".remove"
                );


            if (remove) {

                remove.addEventListener(
                    "click",
                    () => {

                        cart.splice(
                            index,
                            1
                        );

                        updateCartCount();

                        renderCart();

                        updateTotal();

                    }
                );

            }


            container.appendChild(
                element
            );

        });


        updateTotal();

    }


    /* =========================================================
       CART TOTAL
       ========================================================= */

    function updateTotal() {

        const total =
            cart.reduce(
                (sum, item) =>
                    sum +
                    item.price *
                    item.quantity,
                0
            );


        const totalElement =
            document.getElementById(
                "cartTotal"
            );


        if (totalElement) {

            totalElement.textContent =
                "₹" +
                total.toLocaleString(
                    "en-IN"
                );

        }

    }


    /* =========================================================
       CHECKOUT
       ========================================================= */

    const checkout =
        document.getElementById(
            "checkout"
        );


    if (checkout) {

        checkout.addEventListener(
            "click",
            () => {

                if (cart.length === 0) {

                    alert(
                        "Your cart is empty."
                    );

                    return;

                }


                /*
                   WhatsApp checkout.
                   No payment gateway needed yet.
                */

                let message =
                    "Hello SB Trend Thrift 👋\n\n";

                message +=
                    "I want to order:\n\n";


                cart.forEach(item => {

                    message +=
                        `${item.name} | Size ${item.size} | Qty ${item.quantity}\n`;

                });


                const total =
                    cart.reduce(
                        (sum, item) =>
                            sum +
                            item.price *
                            item.quantity,
                        0
                    );


                message +=
                    `\nTotal: ₹${total}`;


                const whatsappURL =
                    "https://wa.me/?text=" +
                    encodeURIComponent(
                        message
                    );


                window.open(
                    whatsappURL,
                    "_blank"
                );

            }
        );

    }


    /* =========================================================
       NEWSLETTER
       ========================================================= */

    const newsletterForm =
        document.getElementById(
            "newsletterForm"
        );


    if (newsletterForm) {

        newsletterForm.addEventListener(
            "submit",
            e => {

                e.preventDefault();


                const input =
                    e.target.querySelector(
                        "input"
                    );


                alert(
                    "You're on the list. Welcome to SB THRIFT."
                );


                if (input) {
                    input.value = "";
                }

            }
        );

    }


    /* =========================================================
       ESCAPE KEY
       ========================================================= */

    document.addEventListener(
        "keydown",
        e => {

            if (e.key === "Escape") {

                closeModal();

                closeCart();


                if (searchPanel) {

                    searchPanel.classList.remove(
                        "active"
                    );

                }


                if (mobileMenu) {

                    mobileMenu.classList.remove(
                        "active"
                    );

                }

            }

        }
    );


    /* =========================================================
       INITIAL STATE
       ========================================================= */

    updateCartCount();

    renderCart();

});