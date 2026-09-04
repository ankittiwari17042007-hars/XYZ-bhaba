/* =========================================
   XYZ DHABA - SCRIPT
========================================= */


/* =========================================
   SETTINGS
========================================= */

const SHOP_LAT = 26.4941963;
const SHOP_LNG = 80.2847087;

const WHATSAPP_NUMBER = "919795521543";

const DELIVERY_RATE = 15;


/* =========================================
   CART
========================================= */

let cart = [];

let deliveryDistance = 0;

let customerLocation = null;


/* =========================================
   LOAD CART
========================================= */

function loadCart() {

    const savedCart =
        localStorage.getItem("xyzCart");

    if (savedCart) {

        try {

            cart = JSON.parse(savedCart);

            if (!Array.isArray(cart)) {
                cart = [];
            }

        } catch {

            cart = [];

        }

    }

}


/* =========================================
   SAVE CART
========================================= */

function saveCart() {

    localStorage.setItem(
        "xyzCart",
        JSON.stringify(cart)
    );

}


/* =========================================
   ADD TO CART
========================================= */

function addToCart(name, price) {

    const existingItem =
        cart.find(item => item.name === name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: Number(price),
            quantity: 1
        });

    }

    saveCart();

    updateCart();

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

function removeFromCart(index) {

    if (!cart[index]) return;

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


/* =========================================
   CLEAR CART
========================================= */

function clearCart() {

    if (cart.length === 0) {

        alert("Your cart is already empty.");

        return;

    }

    const confirmClear =
        confirm("Are you sure you want to clear your cart?");

    if (!confirmClear) return;

    cart = [];

    saveCart();

    updateCart();

}


/* =========================================
   CALCULATE CART TOTAL
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
   DELIVERY CHARGE
========================================= */

function getDeliveryCharge() {

    if (deliveryDistance <= 0) {

        return 0;

    }

    return Math.ceil(
        deliveryDistance * DELIVERY_RATE
    );

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    const cartContainer =
        document.getElementById("cart-items");

    const countElement =
        document.getElementById("cart-items-count");

    if (!cartContainer) return;


    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <div class="history-empty">
                <div class="empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Add some delicious food from our menu.</p>
            </div>
        `;

        if (countElement) {
            countElement.textContent = "0 items";
        }

        updateSummary();

        return;

    }


    let html = `

        <table class="cart-table">

            <thead>
                <tr>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Qty</th>
                    <th>Total</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
    `;


    cart.forEach((item, index) => {

        const total =
            Number(item.price) *
            Number(item.quantity);

        html += `

            <tr>

                <td>
                    <strong>${item.name}</strong>
                </td>

                <td>
                    ₹${item.price}
                </td>

                <td>

                    <button
                        class="quantity-btn"
                        onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <strong style="margin:0 8px;">
                        ${item.quantity}
                    </strong>

                    <button
                        class="quantity-btn"
                        onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </td>

                <td>
                    ₹${total}
                </td>

                <td>

                    <button
                        class="remove-btn"
                        onclick="removeFromCart(${index})">
                        Remove
                    </button>

                </td>

            </tr>

        `;

    });


    html += `
            </tbody>
        </table>
    `;


    cartContainer.innerHTML = html;


    if (countElement) {

        const totalItems =
            cart.reduce(
                (sum, item) =>
                    sum + Number(item.quantity),
                0
            );

        countElement.textContent =
            `${totalItems} item${totalItems !== 1 ? "s" : ""}`;

    }


    updateSummary();

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateSummary() {

    const subtotal =
        getCartSubtotal();

    const delivery =
        getDeliveryCharge();

    const grandTotal =
        subtotal + delivery;


    const subtotalElement =
        document.getElementById("cart-subtotal");

    const deliveryElement =
        document.getElementById("delivery-charge");

    const totalElement =
        document.getElementById("grand-total");


    if (subtotalElement) {

        subtotalElement.textContent =
            `₹${subtotal}`;

    }

    if (deliveryElement) {

        deliveryElement.textContent =
            `₹${delivery}`;

    }

    if (totalElement) {

        totalElement.textContent =
            `₹${grandTotal}`;

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
   GET CUSTOMER LOCATION
========================================= */

function getCustomerLocation() {

    if (!navigator.geolocation) {

        alert(
            "Your browser does not support location."
        );

        return;

    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const lat =
                position.coords.latitude;

            const lng =
                position.coords.longitude;


            customerLocation = {
                lat: lat,
                lng: lng
            };


            deliveryDistance =
                calculateDistance(
                    SHOP_LAT,
                    SHOP_LNG,
                    lat,
                    lng
                );


            updateSummary();


            const locationText =
                document.getElementById(
                    "location-status"
                );


            if (locationText) {

                locationText.textContent =
                    `Location detected • ${deliveryDistance.toFixed(2)} km away`;

            }


            alert(
                `Location detected!\nDistance: ${deliveryDistance.toFixed(2)} km`
            );

        },

        function() {

            alert(
                "Please allow location permission to place the order."
            );

        }

    );

}


/* =========================================
   GOOGLE MAPS LOCATION
========================================= */

function getGoogleMapsLink() {

    if (!customerLocation) {

        return "Location not available";

    }

    return `https://www.google.com/maps?q=${customerLocation.lat},${customerLocation.lng}`;

}


/* =========================================
   SAVE OWNER ORDER
========================================= */

function saveOwnerOrder(order) {

    localStorage.setItem(
        "xyzLatestOrder",
        JSON.stringify(order)
    );

}


/* =========================================
   SAVE ORDER HISTORY
========================================= */

function saveOrderHistory(order) {

    let history = [];

    const savedHistory =
        localStorage.getItem(
            "xyzOrderHistory"
        );


    if (savedHistory) {

        try {

            history =
                JSON.parse(savedHistory);

        } catch {

            history = [];

        }

    }


    if (!Array.isArray(history)) {

        history = [];

    }


    const alreadyExists =
        history.some(
            item => item.id === order.id
        );


    if (!alreadyExists) {

        history.unshift(order);

    }


    localStorage.setItem(
        "xyzOrderHistory",
        JSON.stringify(history)
    );


    showOrderHistory();

}


/* =========================================
   SHOW ORDER HISTORY
========================================= */

function showOrderHistory() {

    const container =
        document.getElementById(
            "order-history"
        );


    if (!container) return;


    const savedHistory =
        localStorage.getItem(
            "xyzOrderHistory"
        );


    if (!savedHistory) {

        showEmptyHistory();

        return;

    }


    let history = [];


    try {

        history =
            JSON.parse(savedHistory);

    } catch {

        showEmptyHistory();

        return;

    }


    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

        showEmptyHistory();

        return;

    }


    let historyHTML = "";


    history.forEach(order => {

        let itemsHTML = "";


        if (Array.isArray(order.items)) {

            order.items.forEach(item => {

                const subtotal =
                    Number(item.price || 0) *
                    Number(item.quantity || 0);


                itemsHTML += `

                    <tr>

                        <td>
                            ${item.name}
                        </td>

                        <td>
                            ${item.quantity}
                        </td>

                        <td>
                            ₹${item.price}
                        </td>

                        <td>
                            ₹${subtotal}
                        </td>

                    </tr>

                `;

            });

        }


        historyHTML += `

            <div class="history-card">

                <div class="history-top">

                    <div class="history-info">

                        <span class="history-label">
                            Customer Name
                        </span>

                        <span class="history-value">
                            ${order.name || "Customer"}
                        </span>

                    </div>


                    <div class="history-info">

                        <span class="history-label">
                            Date
                        </span>

                        <span class="history-value">
                            ${order.time || "Date not available"}
                        </span>

                    </div>

                </div>


                <div class="history-items-table-wrapper">

                    <table class="history-items-table">

                        <thead>

                            <tr>
                                <th>Item</th>
                                <th>Qty</th>
                                <th>Price</th>
                                <th>Total</th>
                            </tr>

                        </thead>


                        <tbody>

                            ${itemsHTML}

                        </tbody>

                    </table>

                </div>


                <div class="history-total">

                    <span>
                        Grand Total
                    </span>

                    <strong>
                        ₹${order.grandTotal || 0}
                    </strong>

                </div>

            </div>

        `;

    });


    container.innerHTML =
        historyHTML;

}


/* =========================================
   EMPTY HISTORY
========================================= */

function showEmptyHistory() {

    const container =
        document.getElementById(
            "order-history"
        );


    if (!container) return;


    container.innerHTML = `

        <div class="history-empty">

            <div class="empty-icon">
                📜
            </div>

            <h3>
                No order history yet
            </h3>

            <p>
                Your previous orders will appear here.
            </p>

        </div>

    `;

}


/* =========================================
   CLEAR HISTORY
========================================= */

function clearHistory() {

    const savedHistory =
        localStorage.getItem(
            "xyzOrderHistory"
        );


    if (!savedHistory) {

        alert(
            "No order history to clear."
        );

        return;

    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear all order history?"
        );


    if (!confirmClear) return;


    localStorage.removeItem(
        "xyzOrderHistory"
    );


    showEmptyHistory();


    alert(
        "Order history cleared successfully."
    );

}


/* =========================================
   LOAD LAST ORDER + MIGRATE
========================================= */

function loadOwnerOrder() {

    const saved =
        localStorage.getItem(
            "xyzLatestOrder"
        );


    if (!saved) {

        showOrderHistory();

        return;

    }


    try {

        const order =
            JSON.parse(saved);


        if (
            typeof showOwnerOrder ===
            "function"
        ) {

            showOwnerOrder(order);

        }


        /* =================================
           OLD ORDER MIGRATION
        ================================= */

        let history = [];


        const savedHistory =
            localStorage.getItem(
                "xyzOrderHistory"
            );


        if (savedHistory) {

            try {

                history =
                    JSON.parse(savedHistory);

            } catch {

                history = [];

            }

        }


        if (!Array.isArray(history)) {

            history = [];

        }


        const alreadyExists =
            history.some(
                item => item.id === order.id
            );


        if (!alreadyExists) {

            history.unshift(order);


            localStorage.setItem(
                "xyzOrderHistory",
                JSON.stringify(history)
            );

        }


        showOrderHistory();

    } catch {

        console.log(
            "Unable to load saved order."
        );


        showOrderHistory();

    }

}


/* =========================================
   PLACE ORDER ON WHATSAPP
========================================= */

function orderOnWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Please add at least one item to your cart."
        );

        return;

    }


    const nameInput =
        document.getElementById("customer-name");

    const phoneInput =
        document.getElementById("customer-phone");

    const addressInput =
        document.getElementById("customer-address");


    const name =
        nameInput ?
        nameInput.value.trim() :
        "";

    const phone =
        phoneInput ?
        phoneInput.value.trim() :
        "";

    const address =
        addressInput ?
        addressInput.value.trim() :
        "";


    if (!name) {

        alert("Please enter your name.");

        return;

    }


    if (!phone) {

        alert("Please enter your phone number.");

        return;

    }


    if (!address) {

        alert("Please enter your address.");

        return;

    }


    if (!customerLocation) {

        alert(
            "Please click the location button and allow location access."
        );

        return;

    }


    const subtotal =
        getCartSubtotal();

    const delivery =
        getDeliveryCharge();

    const grandTotal =
        subtotal + delivery;


    const orderId =
        "XYZ-" +
        Date.now();


    const orderTime =
        new Date().toLocaleString(
            "en-IN",
            {
                dateStyle: "medium",
                timeStyle: "short"
            }
        );


    const order = {

        id: orderId,

        name: name,

        phone: phone,

        address: address,

        time: orderTime,

        items: cart.map(item => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity
        })),

        subtotal: subtotal,

        deliveryCharge: delivery,

        grandTotal: grandTotal,

        distance:
            Number(
                deliveryDistance.toFixed(2)
            ),

        location:
            getGoogleMapsLink()

    };


    /* SAVE ORDER */

    saveOwnerOrder(order);

    saveOrderHistory(order);


    /* WHATSAPP MESSAGE */

    let message =
        `*XYZ DHABA ORDER*%0A%0A`;

    message +=
        `Order ID: ${order.id}%0A`;

    message +=
        `Customer: ${name}%0A`;

    message +=
        `Phone: ${phone}%0A`;

    message +=
        `Address: ${address}%0A%0A`;

    message +=
        `*Items:*%0A`;


    cart.forEach(item => {

        const itemTotal =
            Number(item.price) *
            Number(item.quantity);

        message +=
            `${item.name} x ${item.quantity} = ₹${itemTotal}%0A`;

    });


    message +=
        `%0ASubtotal: ₹${subtotal}%0A`;

    message +=
        `Delivery: ₹${delivery}%0A`;

    message +=
        `*Grand Total: ₹${grandTotal}*%0A%0A`;

    message +=
        `Distance: ${deliveryDistance.toFixed(2)} km%0A`;

    message +=
        `Location: ${getGoogleMapsLink()}`;


    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =========================================
   INITIALIZE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadCart();

        updateCart();

        loadOwnerOrder();

        showOrderHistory();

    }
);
