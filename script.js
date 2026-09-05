/* =========================================
   XYZ DHABA - COMPLETE JAVASCRIPT
========================================= */


/* =========================================
   SETTINGS
========================================= */

const SHOP_LAT = 26.4941963;
const SHOP_LNG = 80.2847087;

const WHATSAPP_NUMBER = "919795521543";

const DELIVERY_RATE = 15;


/* =========================================
   STORAGE KEYS
========================================= */

const CART_KEY = "xyzCart";
const HISTORY_KEY = "xyzOrderHistory";
const LATEST_ORDER_KEY = "xyzLatestOrder";


/* =========================================
   GLOBAL VARIABLES
========================================= */

let cart = [];

let customerLocation = null;

let currentSlide = 0;

let currentFilter = "all";

let selectedRating = 0;


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

    if (!cart[index]) {
        return;
    }

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

    if (!cart[index]) {
        return;
    }

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


/* =========================================
   CLEAR CART
========================================= */

function clearCart() {

    if (cart.length === 0) {
        return;
    }

    const confirmClear = confirm(
        "Kya aap cart clear karna chahte hain?"
    );

    if (!confirmClear) {
        return;
    }

    cart = [];

    saveCart();

    updateCart();

}


/* =========================================
   CART SUBTOTAL
========================================= */

function getCartSubtotal() {

    return cart.reduce(
        (total, item) => {

            return total +
                Number(item.price) *
                Number(item.quantity);

        },
        0
    );

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

                <div class="empty-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

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

                        <th>
                            Item
                        </th>

                        <th>
                            Price
                        </th>

                        <th>
                            Quantity
                        </th>

                        <th>
                            Total
                        </th>

                        <th>
                            Action
                        </th>

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
   SAVE ORDER HISTORY
========================================= */

function saveOrderHistory(order) {

    let history = [];

    try {

        history =
            JSON.parse(
                localStorage.getItem(
                    HISTORY_KEY
                )
            ) || [];

    } catch {

        history = [];

    }


    history.unshift(order);

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );

}


/* =========================================
   GET HISTORY
========================================= */

function getOrderHistory() {

    try {

        const history =
            JSON.parse(
                localStorage.getItem(
                    HISTORY_KEY
                )
            ) || [];

        return Array.isArray(history)
            ? history
            : [];

    } catch {

        return [];

    }

}


/* =========================================
   SAVE LATEST ORDER
========================================= */

function saveOwnerOrder(order) {

    localStorage.setItem(
        LATEST_ORDER_KEY,
        JSON.stringify(order)
    );

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
        ).value.trim();


    const phone =
        document.getElementById(
            "customer-phone"
        ).value.trim();


    const address =
        document.getElementById(
            "customer-address"
        ).value.trim();


    if (!name) {

        alert("Please apna name enter karein.");

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
        "XYZ-" +
        Date.now();


    const order = {

        id: orderId,

        name: name,

        phone: phone,

        address: address,

        time: new Date().toISOString(),

        status: "pending",

        completedAt: null,

        rating: null,

        review: "",

        items: cart.map(item => ({

            name: item.name,

            price: Number(item.price),

            quantity: Number(item.quantity)

        })),

        subtotal: subtotal,

        deliveryCharge: deliveryCharge,

        grandTotal: grandTotal,

        distance: Number(
            distance.toFixed(2)
        ),

        location: getGoogleMapsLink(
            customerLocation.lat,
            customerLocation.lng
        )

    };


    /* SAVE */

    saveOwnerOrder(order);

    saveOrderHistory(order);


    /* UPDATE UI */

    showOwnerDashboard();

    showOrderHistory();

    updateDashboardStats();


    /* WHATSAPP MESSAGE */

    let message =
        `*🍽️ XYZ DHABA - NEW ORDER*%0A%0A`;

    message +=
        `*Order ID:* ${order.id}%0A`;

    message +=
        `*Customer:* ${order.name}%0A`;

    message +=
        `*Phone:* ${order.phone}%0A`;

    message +=
        `*Address:* ${order.address}%0A`;

    message +=
        `*Distance:* ${order.distance} km%0A%0A`;


    message +=
        `*ITEMS*%0A`;


    order.items.forEach(item => {

        message +=
            `${item.name} × ${item.quantity} = ₹${item.price * item.quantity}%0A`;

    });


    message += `%0A`;

    message +=
        `Food Total: ₹${order.subtotal}%0A`;

    message +=
        `Delivery: ₹${order.deliveryCharge}%0A`;

    message +=
        `*Grand Total: ₹${order.grandTotal}*%0A%0A`;

    message +=
        `📍 *Customer Location:*%0A${order.location}`;


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
        `Order ${order.id} successfully placed!`
    );


}


/* =========================================
   SHOW OWNER DASHBOARD
========================================= */

function showOwnerDashboard() {

    const container =
        document.getElementById(
            "owner-orders"
        );


    if (!container) {
        return;
    }


    let orders =
        getOrderHistory();


    if (currentFilter === "pending") {

        orders =
            orders.filter(
                order =>
                    order.status !== "completed"
            );

    }


    if (currentFilter === "completed") {

        orders =
            orders.filter(
                order =>
                    order.status === "completed"
            );

    }


    if (orders.length === 0) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <div>
                    ${
                        currentFilter === "pending"
                            ? "🟠"
                            : currentFilter === "completed"
                                ? "✅"
                                : "📦"
                    }
                </div>

                <h3>
                    No ${
                        currentFilter === "pending"
                            ? "pending"
                            : currentFilter === "completed"
                                ? "completed"
                                : ""
                    } orders
                </h3>

                <p>
                    Orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    orders.forEach(order => {

        const completed =
            order.status === "completed";


        html += `

            <div class="dashboard-order ${
                completed ? "completed" : ""
            }">

                <div class="order-card-top">

                    <div>

                        <div class="order-id">
                            ${escapeHTML(order.id)}
                        </div>

                        <div class="order-customer">
                            👤 ${escapeHTML(order.name)}
                        </div>

                    </div>

                    <span class="status-badge ${
                        completed
                            ? "status-completed"
                            : "status-pending"
                    }">

                        ${
                            completed
                                ? "✅ Completed"
                                : "🟠 Pending"
                        }

                    </span>

                </div>


                <div class="dashboard-order-info">


                    <div class="info-box">

                        <small>
                            Phone
                        </small>

                        <strong>
                            📱 ${escapeHTML(order.phone)}
                        </strong>

                    </div>


                    <div class="info-box">

                        <small>
                            Order Time
                        </small>

                        <strong>
                            ${formatDate(order.time)}
                        </strong>

                    </div>


                    <div class="info-box">

                        <small>
                            Distance
                        </small>

                        <strong>
                            📍 ${order.distance || 0} km
                        </strong>

                    </div>


                    <div class="info-box order-address">

                        <small>
                            Delivery Address
                        </small>

                        <strong>
                            🏠 ${escapeHTML(order.address)}
                        </strong>

                    </div>


                    <div class="info-box">

                        <small>
                            Location
                        </small>

                        <strong>

                            <a
                                class="location-link"
                                href="${escapeHTML(order.location || "#")}"
                                target="_blank"
                            >
                                📍 Open Map
                            </a>

                        </strong>

                    </div>


                    ${
                        completed && order.completedAt
                            ? `
                                <div class="info-box">

                                    <small>
                                        Completed At
                                    </small>

                                    <strong>
                                        ${formatDate(order.completedAt)}
                                    </strong>

                                </div>
                            `
                            : ""
                    }

                </div>


                <div class="dashboard-items">

                    <h4>
                        🍽️ Ordered Items
                    </h4>


                    ${
                        order.items
                            .map(item => `

                                <div class="dashboard-item">

                                    <span>
                                        ${escapeHTML(item.name)}
                                        × ${item.quantity}
                                    </span>

                                    <strong>
                                        ₹${item.price * item.quantity}
                                    </strong>

                                </div>

                            `)
                            .join("")
                    }

                </div>


                <div class="dashboard-total">

                    <span>
                        Grand Total
                    </span>

                    <strong>
                        ₹${order.grandTotal}
                    </strong>

                </div>


                ${
                    !completed
                        ? `
                            <button
                                class="complete-order-btn"
                                onclick="completeOrder('${order.id}')"
                            >
                                ✅ Mark Order as Completed
                            </button>
                        `
                        : `
                            <div class="rating-box">

                                <strong>
                                    ⭐ Customer Rating
                                </strong>

                                ${
                                    order.rating
                                        ? `
                                            <div class="rating-stars">
                                                ${"⭐".repeat(order.rating)}
                                            </div>

                                            ${
                                                order.review
                                                    ? `
                                                        <div class="review-text">
                                                            "${escapeHTML(order.review)}"
                                                        </div>
                                                    `
                                                    : ""
                                            }
                                        `
                                        : `
                                            <p style="color:#777;margin-top:5px;">
                                                Customer has not rated this order yet.
                                            </p>
                                        `
                                }

                            </div>
                        `
                }

            </div>

        `;

    });


    container.innerHTML = html;

}


/* =========================================
   COMPLETE ORDER
========================================= */

function completeOrder(orderId) {

    const confirmComplete =
        confirm(
            "Kya aap is order ko Completed mark karna chahte hain?"
        );


    if (!confirmComplete) {
        return;
    }


    let history =
        getOrderHistory();


    const order =
        history.find(
            item => item.id === orderId
        );


    if (!order) {

        alert(
            "Order nahi mila."
        );

        return;

    }


    order.status = "completed";

    order.completedAt =
        new Date().toISOString();


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );


    const latest =
        localStorage.getItem(
            LATEST_ORDER_KEY
        );


    if (latest) {

        try {

            const latestOrder =
                JSON.parse(latest);


            if (latestOrder.id === orderId) {

                localStorage.setItem(
                    LATEST_ORDER_KEY,
                    JSON.stringify(order)
                );

            }

        } catch {

            /* Ignore */

        }

    }


    showOwnerDashboard();

    showOrderHistory();

    updateDashboardStats();


    alert(
        "✅ Order successfully completed!"
    );

}


/* =========================================
   FILTER ORDERS
========================================= */

function filterOrders(filter) {

    currentFilter = filter;


    document
        .querySelectorAll(".filter-btn")
        .forEach(button => {

            button.classList.remove(
                "active"
            );


            if (
                button.dataset.filter === filter
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


    showOwnerDashboard();

}


/* =========================================
   DASHBOARD STATS
========================================= */

function updateDashboardStats() {

    const orders =
        getOrderHistory();


    const total =
        orders.length;


    const pending =
        orders.filter(
            order =>
                order.status !== "completed"
        ).length;


    const completed =
        orders.filter(
            order =>
                order.status === "completed"
        ).length;


    const sales =
        orders.reduce(
            (sum, order) =>
                sum + Number(order.grandTotal || 0),
            0
        );


    const ratedOrders =
        orders.filter(
            order =>
                Number(order.rating) > 0
        );


    const averageRating =
        ratedOrders.length
            ? (
                ratedOrders.reduce(
                    (sum, order) =>
                        sum + Number(order.rating),
                    0
                ) / ratedOrders.length
            ).toFixed(1)
            : "0.0";


    const totalElement =
        document.getElementById(
            "stat-total"
        );

    const pendingElement =
        document.getElementById(
            "stat-pending"
        );

    const completedElement =
        document.getElementById(
            "stat-completed"
        );

    const salesElement =
        document.getElementById(
            "stat-sales"
        );

    const ratingElement =
        document.getElementById(
            "stat-rating"
        );


    if (totalElement) {
        totalElement.textContent = total;
    }

    if (pendingElement) {
        pendingElement.textContent = pending;
    }

    if (completedElement) {
        completedElement.textContent = completed;
    }

    if (salesElement) {
        salesElement.textContent = `₹${sales}`;
    }

    if (ratingElement) {
        ratingElement.textContent =
            averageRating;
    }

}


/* =========================================
   SHOW ORDER HISTORY
========================================= */

function showOrderHistory() {

    const container =
        document.getElementById(
            "order-history"
        );


    if (!container) {
        return;
    }


    const history =
        getOrderHistory();


    if (history.length === 0) {

        container.innerHTML = `

            <div class="history-empty">

                <div class="empty-icon">
                    📋
                </div>

                <h3>
                    No order history
                </h3>

                <p>
                    Orders will appear here.
                </p>

            </div>

        `;

        return;

    }


    let html = "";


    history.forEach(order => {

        const completed =
            order.status === "completed";


        html += `

            <div class="history-card ${
                completed
                    ? "completed-history"
                    : ""
            }">

                <div class="history-top">


                    <div class="history-info">

                        <span class="history-label">
                            Order ID
                        </span>

                        <span class="history-value">
                            ${escapeHTML(order.id)}
                        </span>

                    </div>


                    <div class="history-info">

                        <span class="history-label">
                            Customer
                        </span>

                        <span class="history-value">
                            ${escapeHTML(order.name)}
                        </span>

                    </div>


                    <div class="history-info">

                        <span class="history-label">
                            Status
                        </span>

                        <span class="history-value">

                            ${
                                completed
                                    ? "✅ Completed"
                                    : "🟠 Pending"
                            }

                        </span>

                    </div>


                    <div class="history-info">

                        <span class="history-label">
                            Order Time
                        </span>

                        <span class="history-value">
                            ${formatDate(order.time)}
                        </span>

                    </div>


                    <div class="history-info">

                        <span class="history-label">
                            Phone
                        </span>

                        <span class="history-value">
                            ${escapeHTML(order.phone)}
                        </span>

                    </div>


                    <div class="history-info">

                        <span class="history-label">
                            Total
                        </span>

                        <span class="history-value">
                            ₹${order.grandTotal}
                        </span>

                    </div>


                </div>


                <div class="history-items-table-wrapper">

                    <table class="history-items-table">

                        <thead>

                            <tr>

                                <th>
                                    Item
                                </th>

                                <th>
                                    Qty
                                </th>

                                <th>
                                    Price
                                </th>

                                <th>
                                    Total
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            ${
                                order.items
                                    .map(item => `

                                        <tr>

                                            <td>
                                                ${escapeHTML(item.name)}
                                            </td>

                                            <td>
                                                ${item.quantity}
                                            </td>

                                            <td>
                                                ₹${item.price}
                                            </td>

                                            <td>
                                                ₹${item.price * item.quantity}
                                            </td>

                                        </tr>

                                    `)
                                    .join("")
                            }

                        </tbody>

                    </table>

                </div>


                <div class="history-total">

                    <span>
                        Grand Total
                    </span>

                    <strong>
                        ₹${order.grandTotal}
                    </strong>

                </div>


                ${
                    order.rating
                        ? `
                            <div class="rating-box">

                                <strong>
                                    Customer Rating
                                </strong>

                                <div class="rating-stars">
                                    ${"⭐".repeat(order.rating)}
                                </div>

                                ${
                                    order.review
                                        ? `
                                            <div class="review-text">
                                                "${escapeHTML(order.review)}"
                                            </div>
                                        `
                                        : ""
                                }

                            </div>
                        `
                        : ""
                }

            </div>

        `;

    });


    container.innerHTML = html;

}


/* =========================================
   CLEAR HISTORY
========================================= */

function clearHistory() {

    const history =
        getOrderHistory();


    if (history.length === 0) {

        return;

    }


    const confirmClear =
        confirm(
            "⚠️ Kya aap poori order history delete karna chahte hain?"
        );


    if (!confirmClear) {
        return;
    }


    localStorage.removeItem(
        HISTORY_KEY
    );

    localStorage.removeItem(
        LATEST_ORDER_KEY
    );


    showOwnerDashboard();

    showOrderHistory();

    updateDashboardStats();

}


/* =========================================
   FORMAT DATE
========================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
        return "-";
    }


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );

}


/* =========================================
   LOAD LATEST ORDER
========================================= */

function loadOwnerOrder() {

    showOwnerDashboard();

    showOrderHistory();

    updateDashboardStats();

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


    if (!slides.length) {
        return;
    }


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


            if (!slides.length) {
                return;
            }


            currentSlide =
                (currentSlide + 1) %
                slides.length;


            showSlide(currentSlide);

        },
        4000
    );

}


/* =========================================
   DEMO RATING FUNCTION
========================================= */

/*
   Is function ko baad mein customer-side
   rating system se connect kiya ja sakta hai.
*/

function rateOrder(
    orderId,
    rating,
    review = ""
) {

    let history =
        getOrderHistory();


    const order =
        history.find(
            item => item.id === orderId
        );


    if (!order) {
        return;
    }


    order.rating =
        Number(rating);


    order.review =
        review;


    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(history)
    );


    showOwnerDashboard();

    showOrderHistory();

    updateDashboardStats();

}


/* =========================================
   DOM READY
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCart();

        updateCart();

        loadOwnerOrder();

        startSlider();

    }
);
