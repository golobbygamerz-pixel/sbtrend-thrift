/* =========================================================
   SB TREND THRIFT
========================================================= */


/* =========================================================
   NAVBAR SCROLL
========================================================= */

const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {

    if (window.scrollY > 70) {

        navbar.classList.add("scrolled");

    } else {

        navbar.classList.remove("scrolled");

    }

});


/* =========================================================
   MOBILE MENU
========================================================= */

const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector(".mobile-menu");
const mobileClose = document.querySelector(".mobile-close");

menuToggle.addEventListener("click", () => {

    mobileMenu.classList.add("active");

    document.body.classList.add("no-scroll");

});


mobileClose.addEventListener("click", () => {

    mobileMenu.classList.remove("active");

    document.body.classList.remove("no-scroll");

});


document.querySelectorAll(".mobile-menu-links a").forEach(link => {

    link.addEventListener("click", () => {

        mobileMenu.classList.remove("active");

        document.body.classList.remove("no-scroll");

    });

});


/* =========================================================
   SEARCH
========================================================= */

const searchOverlay = document.querySelector(".search-overlay");
const searchClose = document.querySelector(".search-close");
const searchButtons = document.querySelectorAll(".search-open");
const searchInput = document.getElementById("searchInput");


searchButtons.forEach(button => {

    button.addEventListener("click", () => {

        searchOverlay.classList.add("active");

        document.body.classList.add("no-scroll");

        setTimeout(() => {

            searchInput.focus();

        }, 400);

    });

});


searchClose.addEventListener("click", () => {

    searchOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

});


/* =========================================================
   SEARCH KEYWORDS
========================================================= */

document.querySelectorAll(".search-suggestions span").forEach(item => {

    item.addEventListener("click", () => {

        searchInput.value = item.textContent;

        searchInput.focus();

    });

});


/* =========================================================
   CART
========================================================= */

const cartDrawer = document.querySelector(".cart-drawer");
const cartOverlay = document.querySelector(".cart-overlay");
const cartClose = document.querySelector(".cart-close");
const cartButtons = document.querySelectorAll(".cart-open");

const cartCount = document.querySelector(".cart-count");

let cart = [];


function openCart() {

    cartDrawer.classList.add("active");

    cartOverlay.classList.add("active");

    document.body.classList.add("no-scroll");

}


function closeCart() {

    cartDrawer.classList.remove("active");

    cartOverlay.classList.remove("active");

    document.body.classList.remove("no-scroll");

}


cartButtons.forEach(button => {

    button.addEventListener("click", openCart);

});


cartClose.addEventListener("click", closeCart);

cartOverlay.addEventListener("click", closeCart);


/* =========================================================
   QUICK ADD
========================================================= */

const quickAddButtons = document.querySelectorAll(".quick-add");

quickAddButtons.forEach(button => {

    button.addEventListener("click", () => {

        const product = button.dataset.product;

        cart.push(product);

        cartCount.textContent = cart.length;

        button.textContent = "ADDED ✓";

        setTimeout(() => {

            button.textContent = "QUICK ADD";

        }, 1200);

        openCart();

    });

});


/* =========================================================
   WISHLIST
========================================================= */

document.querySelectorAll(".wishlist-btn").forEach(button => {

    button.addEventListener("click", () => {

        if (button.classList.contains("saved")) {

            button.classList.remove("saved");

            button.textContent = "♡";

        } else {

            button.classList.add("saved");

            button.textContent = "♥";

        }

    });

});


/* =========================================================
   NEWSLETTER
========================================================= */

const newsletterForm = document.querySelector(".newsletter-form");

newsletterForm.addEventListener("submit", event => {

    event.preventDefault();

    const input = newsletterForm.querySelector("input");

    const button = newsletterForm.querySelector("button");

    if (!input.value) return;

    button.innerHTML = "YOU'RE IN ✓";

    input.value = "";

});


/* =========================================================
   ESCAPE KEY
========================================================= */

document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

        mobileMenu.classList.remove("active");

        searchOverlay.classList.remove("active");

        cartDrawer.classList.remove("active");

        cartOverlay.classList.remove("active");

        document.body.classList.remove("no-scroll");

    }

});


/* =========================================================
   REVEAL ANIMATION
========================================================= */

const revealElements = document.querySelectorAll(
    ".intro-content, .collection-card, .product-card, .why-item, .review, .story-content"
);


const revealObserver = new IntersectionObserver(

    entries => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.style.opacity = "1";

                entry.target.style.transform = "translateY(0)";

                revealObserver.unobserve(entry.target);

            }

        });

    },

    {
        threshold: .1
    }

);


revealElements.forEach(element => {

    element.style.opacity = "0";

    element.style.transform = "translateY(30px)";

    element.style.transition =
        "opacity .8s ease, transform .8s cubic-bezier(.2,.6,.2,1)";

    revealObserver.observe(element);

});