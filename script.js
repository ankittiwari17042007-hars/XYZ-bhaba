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
        Math.sin(dLat / 2) *
        Math.sin(dLat / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;
}


/* =========================================
   DELIVERY CHARGE
========================================= */

function getDeliveryCharge() {

    if (!customerLocation) {
        return 0;
    }

    const distance =
        calculateDistance(
            SHOP_LAT,
            SHOP_LNG,
            customerLocation.lat,
            customerLocation.lng
        );

    return Math.ceil(
        distance * DELIVERY_RATE
    );
}


/* =========================================
   ESCAPE HTML
========================================= */

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    const cartContainer =
        document.getElementById("cart-items");

    const countElement =
        document.getElementById("cart-count");

    const itemCountElement =
        document.getElementById("cart-items-count");

    const totalQuantity = cart.reduce(
        (total, item) =>
            total + Number(item.quantity),
        0
    );

    if (countElement) {
        countElement.textContent =
            totalQuantity;
    }

    if (itemCountElement) {
        itemCountElement.textContent =
            totalQuantity;
    }

    if (!cartContainer) {
        updateBill();
        return;
    }

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="empty-cart">
                <div class="empty-icon">🛒</div>

                <h3>Your cart is empty</h3>

                <p>
                    Menu se kuch delicious food add karein.
                </p>

                <a href="#menu">
                    Go to Menu →
                </a>
            </div>
        `;

        updateBill();
        return;
    }

    let html = `
        <div class="cart-table-wrapper">

            <table class="cart-table">

                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Price</th>
                        <th>Quantity</th>
                        <th>Total</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
    `;

    cart.forEach((item, index) => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        html += `
            <tr>

                <td>
                    ${escapeHTML(item.name)}
                </td>

                <td>
                    ₹${item.price}
                </td>

                <td>

                    <button
                        class="quantity-btn"
                        onclick="changeQuantity(${index}, -1)"
                    >
                        −
                    </button>

                    <strong style="margin:0 8px;">
                        ${item.quantity}
                    </strong>

                    <button
                        class="quantity-btn"
                        onclick="changeQuantity(${index}, 1)"
                    >
                        +
                    </button>

                </td>

                <td>
                    ₹${itemTotal}
                </td>

                <td>

                    <button
                        class="remove-btn"
                        onclick="removeItem(${index})"
                    >
                        Remove
                    </button>

                </td>

            </tr>
        `;
    });

    html += `
                </tbody>
            </table>

        </div>
    `;

    cartContainer.innerHTML = html;

    updateBill();
}


/* =========================================
   UPDATE BILL
========================================= */

function updateBill() {

    const subtotal =
        getCartSubtotal();

    const deliveryCharge =
        getDeliveryCharge();

    const grandTotal =
        subtotal + deliveryCharge;

    const foodTotal =
        document.getElementById("food-total");

    const deliveryPrice =
        document.getElementById("delivery-price");

    const distanceElement =
        document.getElementById("distance");

    const grandTotalElement =
        document.getElementById("grand-total");

    const deliveryChargeInput =
        document.getElementById("delivery-charge");

    const deliveryDistanceInput =
        document.getElementById("delivery-distance");

    if (foodTotal) {
        foodTotal.textContent =
            `₹${subtotal}`;
    }

    if (deliveryPrice) {
        deliveryPrice.textContent =
            customerLocation
                ? `₹${deliveryCharge}`
                : "₹0";
    }

    if (distanceElement) {

        if (customerLocation) {

            const distance =
                calculateDistance(
                    SHOP_LAT,
                    SHOP_LNG,
                    customerLocation.lat,
                    customerLocation.lng
                );

            distanceElement.textContent =
                `${distance.toFixed(2)} km`;

        } else {

            distanceElement.textContent =
                "0 km";
        }
    }

    if (grandTotalElement) {
        grandTotalElement.textContent =
            `₹${grandTotal}`;
    }

    if (deliveryChargeInput) {
        deliveryChargeInput.value =
            deliveryCharge;
    }

    if (deliveryDistanceInput) {

        const distance =
            customerLocation
                ? calculateDistance(
                    SHOP_LAT,
                    SHOP_LNG,
                    customerLocation.lat,
                    customerLocation.lng
                )
                : 0;

        deliveryDistanceInput.value =
            distance.toFixed(2);
    }
}


/* =========================================
   GET LOCATION
========================================= */

function getLocation() {

    const status =
        document.getElementById(
            "location-status"
        );

    const button =
        document.getElementById(
            "location-button"
        );

    if (!navigator.geolocation) {

        if (status) {
            status.textContent =
                "Geolocation is not supported.";
        }

        return;
    }

    if (status) {
        status.textContent =
            "📍 Getting your location...";
    }

    if (button) {

        button.disabled = true;

        button.textContent =
            "Getting Location...";
    }

    navigator.geolocation.getCurrentPosition(

        function(position) {

            customerLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            const distance =
                calculateDistance(
                    SHOP_LAT,
                    SHOP_LNG,
                    customerLocation.lat,
                    customerLocation.lng
                );

            if (status) {
                status.textContent =
                    `✅ Location selected • ${distance.toFixed(2)} km away`;
            }

            if (button) {

                button.disabled = false;

                button.textContent =
                    "📍 Location Updated";
            }

            updateBill();
        },

        function(error) {

            if (status) {
                status.textContent =
                    "❌ Location nahi mil saki. Please allow location permission.";
            }

            if (button) {

                button.disabled = false;

                button.textContent =
                    "📍 Get My Location";
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}


function getCustomerLocation() {
    getLocation();
}


/* =========================================
   GOOGLE MAPS LINK
========================================= */

function getGoogleMapsLink(lat, lng) {

    return `https://www.google.com/maps?q=${lat},${lng}`;
}


/* =========================================
   ORDER ON WHATSAPP
========================================= */

function orderOnWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Please cart mein food add karein."
        );

        return;
    }

    const name =
        document.getElementById(
            "customer-name"
        )?.value.trim();

    const phone =
        document.getElementById(
            "customer-phone"
        )?.value.trim();

    const address =
        document.getElementById(
            "customer-address"
        )?.value.trim();

    if (!name) {

        alert(
            "Please apna name enter karein."
        );

        return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {

        alert(
            "Please valid 10 digit phone number enter karein."
        );

        return;
    }

    if (!address) {

        alert(
            "Please delivery address enter karein."
        );

        return;
    }

    if (!customerLocation) {

        alert(
            "Please pehle apni location select karein."
        );

        return;
    }

    const subtotal =
        getCartSubtotal();

    const distance =
        calculateDistance(
            SHOP_LAT,
            SHOP_LNG,
            customerLocation.lat,
            customerLocation.lng
        );

    const deliveryCharge =
        Math.ceil(
            distance * DELIVERY_RATE
        );

    const grandTotal =
        subtotal + deliveryCharge;

    const orderId =
        "XYZ-" + Date.now();


    /* WHATSAPP MESSAGE */

    let message =
        `*🍽️ XYZ DHABA - NEW ORDER*%0A%0A`;

    message +=
        `*Order ID:* ${orderId}%0A`;

    message +=
        `*Customer:* ${encodeURIComponent(name)}%0A`;

    message +=
        `*Phone:* ${phone}%0A`;

    message +=
        `*Address:* ${encodeURIComponent(address)}%0A`;

    message +=
        `*Distance:* ${distance.toFixed(2)} km%0A%0A`;

    message +=
        `*ITEMS*%0A`;

    cart.forEach(item => {

        message +=
            `${encodeURIComponent(item.name)} × ${item.quantity} = ₹${item.price * item.quantity}%0A`;

    });

    message += `%0A`;

    message +=
        `Food Total: ₹${subtotal}%0A`;

    message +=
        `Delivery: ₹${deliveryCharge}%0A`;

    message +=
        `*Grand Total: ₹${grandTotal}*%0A%0A`;

    message +=
        `📍 *Customer Location:*%0A`;

    message +=
        encodeURIComponent(
            getGoogleMapsLink(
                customerLocation.lat,
                customerLocation.lng
            )
        );


    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );


    /* CLEAR CART */

    cart = [];

    saveCart();

    updateCart();


    alert(
        `Order ${orderId} successfully placed!`
    );
}


/* =========================================
   SLIDER
========================================= */

function showSlide(index) {

    const slides =
        document.querySelectorAll(
            ".slide"
        );

    const dots =
        document.querySelectorAll(
            ".dot"
        );

    if (!slides.length) return;

    if (
        index < 0 ||
        index >= slides.length
    ) {
        index = 0;
    }

    slides.forEach(
        slide =>
            slide.classList.remove(
                "active"
            )
    );

    dots.forEach(
        dot =>
            dot.classList.remove(
                "active"
            )
    );

    slides[index].classList.add(
        "active"
    );

    if (dots[index]) {

        dots[index].classList.add(
            "active"
        );
    }

    currentSlide = index;
}


/* =========================================
   START SLIDER
========================================= */

function startSlider() {

    setInterval(
        () => {

            const slides =
                document.querySelectorAll(
                    ".slide"
                );

            if (!slides.length) return;

            currentSlide =
                (currentSlide + 1) %
                slides.length;

            showSlide(currentSlide);

        },
        4000
    );
}


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCart();

        updateCart();

        startSlider();

    }
);
