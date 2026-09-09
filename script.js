document.addEventListener("DOMContentLoaded", () => {

    const cart = [];
    let currentProduct = null;
    let quantity = 1;
    let selectedSize = null;


    /* ================= MENU ================= */

    const menuBtn = document.getElementById("menuBtn");
    const mobileMenu = document.getElementById("mobileMenu");
    const closeMenu = document.getElementById("closeMenu");

    menuBtn.addEventListener("click", () => {
        mobileMenu.classList.add("active");
    });

    closeMenu.addEventListener("click", () => {
        mobileMenu.classList.remove("active");
    });

    document.querySelectorAll(".mobile-links a").forEach(link => {
        link.addEventListener("click", () => {
            mobileMenu.classList.remove("active");
        });
    });


    /* ================= SEARCH ================= */

    const searchBtn = document.getElementById("searchBtn");
    const searchPanel = document.getElementById("searchPanel");
    const closeSearch = document.getElementById("closeSearch");
    const searchInput = document.getElementById("searchInput");

    searchBtn.addEventListener("click", () => {
        searchPanel.classList.add("active");
        setTimeout(() => searchInput.focus(), 200);
    });

    closeSearch.addEventListener("click", () => {
        searchPanel.classList.remove("active");
    });

    searchInput.addEventListener("input", () => {

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".product").forEach(product => {

            const name = product.dataset.name.toLowerCase();

            product.style.display =
                name.includes(value) ? "" : "none";

        });

    });


    document.querySelectorAll(".suggestions button").forEach(btn => {

        btn.addEventListener("click", () => {

            searchInput.value = btn.textContent;

            searchInput.dispatchEvent(new Event("input"));

        });

    });


    /* ================= FILTER ================= */

    const filterBtn = document.getElementById("filterBtn");
    const filters = document.getElementById("filters");

    filterBtn.addEventListener("click", () => {
        filters.classList.toggle("show");
    });

    document.querySelectorAll(".filter").forEach(button => {

        button.addEventListener("click", () => {

            document.querySelectorAll(".filter")
                .forEach(x => x.classList.remove("active"));

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


    /* ================= PRODUCT MODAL ================= */

    const modal = document.getElementById("productModal");
    const modalClose = document.getElementById("modalClose");

    const modalImage = document.getElementById("modalImage");
    const modalName = document.getElementById("modalName");
    const modalPrice = document.getElementById("modalPrice");
    const modalTotal = document.getElementById("modalTotal");

    const quantityText = document.getElementById("quantity");

    document.querySelectorAll(".quick-add").forEach(button => {

        button.addEventListener("click", e => {

            const product = e.target.closest(".product");

            currentProduct = {
                name: product.dataset.name,
                price: Number(product.dataset.price.replace(",", "")),
                image: product.dataset.image
            };

            quantity = 1;
            selectedSize = null;

            quantityText.textContent = quantity;

            modalImage.src = currentProduct.image;
            modalName.textContent = currentProduct.name;
            modalPrice.textContent =
                "₹" + currentProduct.price.toLocaleString("en-IN");

            modalTotal.textContent =
                "₹" + currentProduct.price.toLocaleString("en-IN");

            document.querySelectorAll(".size")
                .forEach(x => x.classList.remove("selected"));

            modal.classList.add("active");

        });

    });


    modalClose.addEventListener("click", closeModal);

    modal.addEventListener("click", e => {

        if (e.target === modal) {
            closeModal();
        }

    });

    function closeModal(){
        modal.classList.remove("active");
    }


    /* ================= SIZE ================= */

    document.querySelectorAll(".size").forEach(size => {

        size.addEventListener("click", () => {

            document.querySelectorAll(".size")
                .forEach(x => x.classList.remove("selected"));

            size.classList.add("selected");

            selectedSize = size.textContent;

        });

    });


    /* ================= QUANTITY ================= */

    document.getElementById("minus").addEventListener("click", () => {

        if(quantity > 1){
            quantity--;
            updateQuantity();
        }

    });

    document.getElementById("plus").addEventListener("click", () => {

        quantity++;
        updateQuantity();

    });

    function updateQuantity(){

        quantityText.textContent = quantity;

        const total =
            currentProduct.price * quantity;

        modalTotal.textContent =
            "₹" + total.toLocaleString("en-IN");

    }


    /* ================= ADD CART ================= */

    document.getElementById("addCart").addEventListener("click", () => {

        if(!selectedSize){

            alert("Please select a size.");

            return;

        }

        cart.push({

            name: currentProduct.name,
            price: currentProduct.price,
            image: currentProduct.image,
            size: selectedSize,
            quantity: quantity

        });

        updateCartCount();

        closeModal();

        openCart();

        renderCart();

    });


    /* ================= CART ================= */

    const cartPanel = document.getElementById("cart");
    const cartOverlay = document.getElementById("cartOverlay");

    document.getElementById("cartBtn")
        .addEventListener("click", openCart);

    document.getElementById("closeCart")
        .addEventListener("click", closeCart);

    cartOverlay.addEventListener("click", closeCart);

    function openCart(){

        cartPanel.classList.add("active");
        cartOverlay.classList.add("active");

    }

    function closeCart(){

        cartPanel.classList.remove("active");
        cartOverlay.classList.remove("active");

    }


    function updateCartCount(){

        const count =
            cart.reduce((sum,item) => sum + item.quantity, 0);

        document.getElementById("cartCount")
            .textContent = count;

    }


    function renderCart(){

        const container =
            document.getElementById("cartItems");

        if(cart.length === 0){

            container.innerHTML = `
                <div class="empty">
                    <span>00</span>
                    <p>YOUR CART IS EMPTY.</p>
                    <a href="#shop" id="continueShopping">
                        SHOP NOW
                    </a>
                </div>
            `;

            return;

        }

        container.innerHTML = "";

        cart.forEach((item,index) => {

            const element = document.createElement("div");

            element.className = "cart-product";

            element.innerHTML = `

                <img src="${item.image}" alt="${item.name}">

                <div>
                    <h4>${item.name}</h4>

                    <p>
                        SIZE ${item.size} · QTY ${item.quantity}
                    </p>

                    <p>
                        ₹${(item.price * item.quantity)
                        .toLocaleString("en-IN")}
                    </p>
                </div>

                <button class="remove">
                    ×
                </button>
            `;

            element.querySelector(".remove")
                .addEventListener("click", () => {

                    cart.splice(index,1);

                    updateCartCount();
                    renderCart();
                    updateTotal();

                });

            container.appendChild(element);

        });

        updateTotal();

    }


    function updateTotal(){

        const total =
            cart.reduce(
                (sum,item) =>
                sum + item.price * item.quantity,
                0
            );

        document.getElementById("cartTotal")
            .textContent =
            "₹" + total.toLocaleString("en-IN");

    }


    /* ================= CHECKOUT ================= */

    document.getElementById("checkout")
        .addEventListener("click", () => {

            if(cart.length === 0){

                alert("Your cart is empty.");

                return;

            }

            alert(
                "Checkout is ready to connect with your payment gateway."
            );

        });


    /* ================= NEWSLETTER ================= */

    document.getElementById("newsletterForm")
        .addEventListener("submit", e => {

            e.preventDefault();

            const input =
                e.target.querySelector("input");

            alert(
                "You're on the list. Welcome to SB THRIFT."
            );

            input.value = "";

        });


    /* ================= ESCAPE KEY ================= */

    document.addEventListener("keydown", e => {

        if(e.key === "Escape"){

            closeModal();
            closeCart();
            searchPanel.classList.remove("active");
            mobileMenu.classList.remove("active");

        }

    });

});