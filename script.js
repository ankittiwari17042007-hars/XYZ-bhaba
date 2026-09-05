/* =========================================
   XYZ DHABA - CUSTOMER JAVASCRIPT
========================================= */

/* SETTINGS */
const SHOP_LAT = 26.4941963;
const SHOP_LNG = 80.2847087;
const WHATSAPP_NUMBER = "919795521543";
const DELIVERY_RATE = 15;

/* STORAGE */
const CART_KEY = "xyzCart";

/* GLOBALS */
let cart = [];
let customerLocation = null;
let currentSlide = 0;


/* =========================================
   LOAD CART
========================================= */

function loadCart() {
    try {
        const savedCart = localStorage.getItem(CART_KEY);
        cart = savedCart ? JSON.parse(savedCart) : [];

        if (!Array.isArray(cart)) {
            cart = [];
        }
    } catch (error) {
        cart = [];
    }
}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {
    localStorage.setItem(
        CART_KEY,
        JSON.stringify(cart)
    );
}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(name, price) {

    const existingItem = cart.find(
        item => item.name === name
    );

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });
    }

    saveCart();
    updateCart();

    document
        .getElementById("order")
        ?.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQuantity(index, change) {

    if (!cart[index]) return;

    cart[index].quantity += change;

    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveCart();
    updateCart();
}


/* =========================================
   REMOVE ITEM
========================================= */

function removeItem(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();
    updateCart();
}


/* =========================================
   CLEAR CART
========================================= */

function clearCart() {

    if (cart.length === 0) return;

    const confirmClear = confirm(
        "Kya aap cart clear karna chahte hain?"
    );

    if (!confirmClear) return;

    cart = [];

    saveCart();
    updateCart();
}


/* =========================================
   CART SUBTOTAL
========================================= */

function getCartSubtotal() {

    return cart.reduce(
        (total, item) =>
            total +
            Number(item.price) *
            Number(item.quantity),
        0
    );
}


/* =========================================
   HAVERSINE DISTANCE
========================================= */

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const R = 6371;

    const dLat =
        (lat2 - lat1) *
        Math.PI / 180;

    const dLon =
        (lon2 - lon1) *
        Math.PI / 180;

    const a =
        Math.sin(dLat
