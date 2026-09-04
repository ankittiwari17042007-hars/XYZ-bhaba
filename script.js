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
   SLIDER
========================================= */

let currentSlide = 0;

function showSlide(index) {

    const slides =
        document.querySelectorAll(".slide");

    const dots =
        document.querySelectorAll(".dot");

    if (!slides.length) return;

    if (index >= slides.length) {
        index = 0;
    }

    if (index < 0) {
        index = slides.length - 1;
    }

    currentSlide = index;

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    slides[index].classList.add("active");

    if (dots[index]) {
        dots[index].classList.add("active");
    }
}


function startSlider() {

    setInterval(() => {

        currentSlide++;

        showSlide(currentSlide);

    }, 4000);

}


/* =========================================
   LOAD CART
========================================= */

function loadCart() {

    const savedCart =
        localStorage.getItem("xyzCart");

    if (!savedCart) return;

    try {

        cart = JSON.parse(savedCart);

        if (!Array.isArray(cart)) {
            cart = [];
        }

    } catch {

        cart = [];

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

    if (
        !confirm(
            "Are you sure you want to clear your cart?"
        )
    ) return;

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

    const container =
        document.getElementById("cart-items");

    const count =
        document.getElementById("cart-count");

    const itemCount =
        document.getElementById(
            "cart-items-count"
        );

    if (!container) return;


    if (cart.length === 0) {

        container.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Menu se apna favourite
                    food add karein.
                </p>

                <a href="#menu">
                    Explore Menu →
                </a>

            </div>

        `;

    } else {

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
                        <strong>
                            ${item.name}
                        </strong>
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

                        <strong style="margin:0 7px;">
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
                        ₹${total}
                    </td>

                    <td>

                        <button
                            class="remove-btn"
                            onclick="removeFromCart(${index})"
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

        `;

        container.innerHTML = html;

    }


    const totalItems =
        cart.reduce(
            (sum, item) =>
                sum + Number(item.quantity),
            0
        );


    if (count) {
        count.textContent = totalItems;
    }


    if (itemCount) {

        itemCount.textContent =
            `${totalItems} item${totalItems !== 1 ? "s" : ""}`;

    }


    updateBill();

}


/* =========================================
   UPDATE BILL
========================================= */

function updateBill() {

    const foodTotal =
        getCartSubtotal();

    const delivery =
        getDeliveryCharge();

    const grandTotal =
        foodTotal + delivery;


    const foodElement =
        document.getElementById("food-total");

    const deliveryElement =
        document.getElementById(
            "delivery-price"
        );

    const distanceElement =
        document.getElementById(
            "distance"
        );

    const totalElement =
        document.getElementById(
            "grand-total"
        );


    if (foodElement) {
        foodElement.textContent =
            `₹${foodTotal}`;
    }

    if (deliveryElement) {
        deliveryElement.textContent =
            `₹${delivery}`;
    }

    if (distanceElement) {

        distanceElement.textContent =
            `${deliveryDistance.toFixed(2)} km`;

    }

    if (totalElement) {

        totalElement.textContent =
            `₹${grandTotal}`;

    }


    const hiddenDelivery =
        document.getElementById(
            "delivery-charge"
        );

    if (hiddenDelivery) {

        hiddenDelivery.textContent =
            `₹${delivery}`;

    }

}


/* =========================================
   DISTANCE
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
        Math.sin(dLat / 2) ** 2 +

        Math.cos(
            lat1 * Math.PI / 180
        ) *

        Math.cos(
            lat2 * Math.PI / 180
        ) *

        Math.sin(dLon / 2) ** 2;

    const c =
        2 *
        Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );

    return R * c;

}


/* =========================================
   LOCATION
========================================= */

function getLocation() {

    if (!navigator.geolocation) {

        alert(
            "Your browser does not support location."
        );

        return;

    }


    const button =
        document.getElementById(
            "location-button"
        );

    const status =
        document.getElementById(
            "location-status"
        );


    if (button) {
        button.textContent =
            "📍 Detecting Location...";
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


            if (status) {

                status.textContent =
                    `✅ Location detected • ${deliveryDistance.toFixed(2)} km away`;

            }


            if (button) {

                button.textContent =
                    "✅ Location Detected";

            }


            updateBill();


            alert(
                `Location detected!\nDistance: ${deliveryDistance.toFixed(2)} km`
            );

        },

        function() {

            if (button) {

                button.textContent =
                    "📍 Use My Location";

            }


            alert(
                "Please allow location permission to place the order."
            );

        },

        {
            enableHighAccuracy: true,
            timeout: 10000
        }

    );

}


/* Keep old function working too */

function getCustomerLocation() {

    getLocation();

}


/* =========================================
   GOOGLE MAP
========================================= */

function getGoogleMapsLink() {

    if (!customerLocation) {

        return "Location not available";

    }

    return `https://www.google.com/maps?q=${customerLocation.lat},${customerLocation.lng}`;

}


/* =========================================
   OWNER ORDER
========================================= */

function saveOwnerOrder(order) {

    localStorage.setItem(
        "xyzLatestOrder",
        JSON.stringify(order)
    );

}


/* =========================================
   SHOW OWNER ORDER
========================================= */

function showOwnerOrder(order) {

    const container =
        document.getElementById(
            "owner-order"
        );

    if (!container) return;


    let itemsHTML = "";


    order.items.forEach(item => {

        itemsHTML += `

            <p>
                ${item.name}
                × ${item.quantity}
                = ₹${item.price * item.quantity}
            </p>

        `;

    });


    container.innerHTML = `

        <div class="owner-order-card">

            <h3>
                📦 ${order.id}
            </h3>

            <div class="owner-row">
                <span>Customer</span>
                <strong>
                    ${order.name}
                </strong>
            </div>

            <div class="owner-row">
                <span>Phone</span>
                <strong>
                    ${order.phone}
                </strong>
            </div>

            <div class="owner-row">
                <span>Date</span>
                <strong>
                    ${order.time}
                </strong>
            </div>

            <div class="owner-row">
                <span>Address</span>
                <strong>
                    ${order.address}
                </strong>
            </div>

            <div class="owner-items">

                <strong>
                    Items
                </strong>

                ${itemsHTML}

            </div>

            <div class="owner-row">

                <span>
                    Grand Total
                </span>

                <strong>
                    ₹${order.grandTotal}
                </strong>

            </div>

        </div>

    `;

}


/* =========================================
   SAVE HISTORY
========================================= */

function saveOrderHistory(order) {

    let history = [];

    const saved =
        localStorage.getItem(
            "xyzOrderHistory"
        );


    if (saved) {

        try {

            history = JSON.parse(saved);

        } catch {

            history = [];

        }

    }


    if (!Array.isArray(history)) {
        history = [];
    }


    const exists =
        history.some(
            item => item.id === order.id
        );


    if (!exists) {

        history.unshift(order);

    }


    localStorage.setItem(
        "xyzOrderHistory",
        JSON.stringify(history)
    );


    showOrderHistory();

}


/* =========================================
   SHOW HISTORY
========================================= */

function showOrderHistory() {

    const container =
        document.getElementById(
            "order-history"
        );

    if (!container) return;


    const saved =
        localStorage.getItem(
            "xyzOrderHistory"
        );


    if (!saved) {

        showEmptyHistory();

        return;

    }


    let history = [];


    try {

        history = JSON.parse(saved);

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


    let html = "";


    history.forEach(order => {

        let items = "";


        if (Array.isArray(order.items)) {

            order.items.forEach(item => {

                const subtotal =
                    Number(item.price) *
                    Number(item.quantity);


                items += `

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


        html += `

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
                            ${order.time || "Not available"}
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

                            ${items}

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


    container.innerHTML = html;

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
                Your previous orders
                will appear here.
            </p>

        </div>

    `;

}


/* =========================================
   CLEAR HISTORY
========================================= */

function clearHistory() {

    const saved =
        localStorage.getItem(
            "xyzOrderHistory"
        );


    if (!saved) {

        alert(
            "No order history to clear."
        );

        return;

    }


    let history = [];


    try {

        history = JSON.parse(saved);

    } catch {

        history = [];

    }


    if (
        !Array.isArray(history) ||
        history.length === 0
    ) {

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
   LOAD OWNER ORDER
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


        showOwnerOrder(order);


        /*
         * Old latest order ko history
         * me automatically add karega.
         */

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


        const exists =
            history.some(
                item => item.id === order.id
            );


        if (!exists) {

            history.unshift(order);

            localStorage.setItem(
                "xyzOrderHistory",
                JSON.stringify(history)
            );

        }


        showOrderHistory();

    } catch {

        showOrderHistory();

    }

}


/* =========================================
   PLACE ORDER
========================================= */

function orderOnWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Please add at least one item to your cart."
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

        alert("Please enter your name.");

        return;

    }


    if (!phone) {

        alert(
            "Please enter your mobile number."
        );

        return;

    }


    if (!address) {

        alert(
            "Please enter your delivery address."
        );

        return;

    }


    if (!customerLocation) {

        alert(
            "Please click 'Use My Location' first."
        );

        return;

    }


    const subtotal =
        getCartSubtotal();


    const delivery =
        getDeliveryCharge();


    const grandTotal =
        subtotal + delivery;


    const order = {

        id:
            "XYZ-" +
            Date.now(),

        name: name,

        phone: phone,

        address: address,

        time:
            new Date().toLocaleString(
                "en-IN",
                {
                    dateStyle: "medium",
                    timeStyle: "short"
                }
            ),

        items:
            cart.map(item => ({

                name: item.name,

                price: Number(item.price),

                quantity:
                    Number(item.quantity)

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


    /* Save order */

    saveOwnerOrder(order);

    saveOrderHistory(order);


    /* =================================
       WHATSAPP MESSAGE
    ================================= */

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
        `%0AFood Total: ₹${subtotal}%0A`;

    message +=
        `Delivery: ₹${delivery}%0A`;

    message +=
        `Distance: ${deliveryDistance.toFixed(2)} km%0A`;

    message +=
        `*Grand Total: ₹${grandTotal}*%0A%0A`;

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

        showSlide(0);

        startSlider();

    }
);1
