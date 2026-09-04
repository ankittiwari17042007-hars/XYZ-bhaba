/* =========================================
   XYZ DHABA
   ORDERING SYSTEM
========================================= */


/* =========================================
   SETTINGS
========================================= */

/*
    XYZ Dhaba location

    Baad mein apne actual Dhaba ke
    coordinates yahan change karna.
*/

const SHOP_LAT = 26.4499;
const SHOP_LNG = 80.3319;


/*
    WhatsApp number

    Example:

    919795521543 

    + ya spaces mat lagana.
*/

const WHATSAPP_NUMBER = "919XXXXXXXXX";


/*
    Delivery rate
*/

const DELIVERY_RATE = 15;


/* =========================================
   VARIABLES
========================================= */

let cart = [];

let deliveryDistance = 0;


/* =========================================
   HOME IMAGE SLIDER
========================================= */

const slides =
    document.querySelectorAll(".slide");

const dots =
    document.querySelectorAll(".dot");

let currentSlide = 0;


function showSlide(index) {

    slides.forEach(slide => {

        slide.classList.remove("active");

    });

    dots.forEach(dot => {

        dot.classList.remove("active");

    });


    slides[index].classList.add("active");

    dots[index].classList.add("active");

}


function nextSlide() {

    currentSlide++;

    if (currentSlide >= slides.length) {

        currentSlide = 0;

    }

    showSlide(currentSlide);

}


setInterval(nextSlide, 4500);


/* =========================================
   ADD TO CART
========================================= */

function addToCart(name, price) {

    const existing =
        cart.find(item => item.name === name);


    if (existing) {

        existing.quantity++;

    } else {

        cart.push({

            name: name,

            price: price,

            quantity: 1

        });

    }


    updateCart();

    scrollToOrder();

}


/* =========================================
   SCROLL TO ORDER
========================================= */

function scrollToOrder() {

    const orderSection =
        document.getElementById("order");

    /*
       Small delay so cart updates
       before scrolling.
    */

    setTimeout(() => {

        orderSection.scrollIntoView({
            behavior: "smooth"
        });

    }, 150);

}


/* =========================================
   CHANGE QUANTITY
========================================= */

function changeQuantity(index, amount) {

    cart[index].quantity += amount;


    if (cart[index].quantity <= 0) {

        cart.splice(index, 1);

    }


    updateCart();

}


/* =========================================
   REMOVE ITEM
========================================= */

function removeItem(index) {

    cart.splice(index, 1);

    updateCart();

}


/* =========================================
   UPDATE CART
========================================= */

function updateCart() {

    const cartContainer =
        document.getElementById("cart-items");


    const cartCount =
        document.getElementById("cart-count");


    const itemCount =
        document.getElementById(
            "cart-items-count"
        );


    /*
       Total quantity
    */

    let totalQuantity = 0;


    cart.forEach(item => {

        totalQuantity += item.quantity;

    });


    cartCount.innerText =
        totalQuantity;


    itemCount.innerText =
        `${totalQuantity} items`;


    /*
       Empty cart
    */

    if (cart.length === 0) {

        cartContainer.innerHTML = `

            <div class="empty-cart">

                <div class="empty-icon">
                    🛒
                </div>

                <h3>Your cart is empty</h3>

                <p>
                    Menu se apna favourite food add karein.
                </p>

                <a href="#menu">
                    Explore Menu →
                </a>

            </div>

        `;

    }

    else {

        cartContainer.innerHTML = "";


        cart.forEach((item, index) => {

            const subtotal =
                item.price *
                item.quantity;


            const div =
                document.createElement("div");


            div.className =
                "cart-item";


            div.innerHTML = `

                <div>

                    <div class="cart-item-name">
                        ${item.name}
                    </div>

                    <div class="cart-item-price">
                        ₹${item.price} × ${item.quantity}
                    </div>

                </div>


                <div class="quantity">

                    <button
                        onclick="changeQuantity(${index}, -1)">
                        −
                    </button>

                    <strong>
                        ${item.quantity}
                    </strong>

                    <button
                        onclick="changeQuantity(${index}, 1)">
                        +
                    </button>

                </div>


                <strong>
                    ₹${subtotal}
                </strong>


                <button
                    class="remove-item"
                    onclick="removeItem(${index})">

                    ✕

                </button>

            `;


            cartContainer.appendChild(div);

        });

    }


    updateBill();

}


/* =========================================
   FOOD TOTAL
========================================= */

function getFoodTotal() {

    let total = 0;


    cart.forEach(item => {

        total +=
            item.price *
            item.quantity;

    });


    return total;

}


/* =========================================
   DELIVERY CHARGE
========================================= */

function getDeliveryCharge() {

    if (deliveryDistance <= 0) {

        return 0;

    }


    /*
       ₹15 per km

       Decimal distance ko
       next rupee tak round karenge.
    */

    return Math.ceil(
        deliveryDistance *
        DELIVERY_RATE
    );

}


/* =========================================
   UPDATE BILL
========================================= */

function updateBill() {

    const foodTotal =
        getFoodTotal();


    const deliveryCharge =
        getDeliveryCharge();


    const grandTotal =
        foodTotal +
        deliveryCharge;


    document.getElementById(
        "food-total"
    ).innerText =
        `₹${foodTotal}`;


    document.getElementById(
        "delivery-price"
    ).innerText =
        `₹${deliveryCharge}`;


    document.getElementById(
        "delivery-charge"
    ).innerText =
        `₹${deliveryCharge}`;


    document.getElementById(
        "grand-total"
    ).innerText =
        `₹${grandTotal}`;


    document.getElementById(
        "distance"
    ).innerText =
        `${deliveryDistance} km`;


    document.getElementById(
        "delivery-distance"
    ).innerText =
        `${deliveryDistance} km`;

}


/* =========================================
   CLEAR CART
========================================= */

function clearCart() {

    cart = [];

    updateCart();

}


/* =========================================
   LOCATION
========================================= */

function getLocation() {

    const status =
        document.getElementById(
            "location-status"
        );


    if (!navigator.geolocation) {

        status.innerText =
            "❌ Browser location support nahi karta.";

        return;

    }


    status.innerText =
        "📍 Location detect ho rahi hai...";


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const userLat =
                position.coords.latitude;


            const userLng =
                position.coords.longitude;


            deliveryDistance =
                calculateDistance(
                    SHOP_LAT,
                    SHOP_LNG,
                    userLat,
                    userLng
                );


            /*
               1 decimal place
            */

            deliveryDistance =
                Math.round(
                    deliveryDistance * 10
                ) / 10;


            const charge =
                getDeliveryCharge();


            document.getElementById(
                "delivery-distance"
            ).innerText =
                `${deliveryDistance} km`;


            document.getElementById(
                "distance"
            ).innerText =
                `${deliveryDistance} km`;


            document.getElementById(
                "delivery-charge"
            ).innerText =
                `₹${charge}`;


            status.innerText =
                `✅ Location detected • ${deliveryDistance} km away`;


            updateBill();

        },


        function(error) {

            if (error.code === 1) {

                status.innerText =
                    "❌ Location permission denied.";

            }

            else if (error.code === 2) {

                status.innerText =
                    "❌ Location unavailable.";

            }

            else {

                status.innerText =
                    "❌ Location detect nahi ho payi.";

            }

        },


        {

            enableHighAccuracy: true,

            timeout: 10000,

            maximumAge: 0

        }

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
        toRadians(lat2 - lat1);


    const dLon =
        toRadians(lon2 - lon1);


    const a =
        Math.sin(dLat / 2) ** 2 +

        Math.cos(
            toRadians(lat1)
        ) *

        Math.cos(
            toRadians(lat2)
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


function toRadians(value) {

    return value *
        Math.PI /
        180;

}


/* =========================================
   WHATSAPP ORDER
========================================= */

function orderOnWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Pehle menu se food add karo."
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

        alert("Apna naam enter karo.");

        return;

    }


    if (!phone) {

        alert("Mobile number enter karo.");

        return;

    }


    if (!address) {

        alert("Delivery address enter karo.");

        return;

    }


    const foodTotal =
        getFoodTotal();


    const deliveryCharge =
        getDeliveryCharge();


    const grandTotal =
        foodTotal +
        deliveryCharge;


    /*
       Order ID
    */

    const orderId =
        "XYZ" +
        Date.now().toString().slice(-6);


    /*
       Current time
    */

    const orderTime =
        new Date().toLocaleString(
            "en-IN"
        );


    /*
       WhatsApp message
    */

    let message =
        `🍛 *XYZ DHABA - NEW ORDER*%0A`;

    message +=
        `━━━━━━━━━━━━━━━━━━%0A`;


    message +=
        `🆔 Order ID: ${orderId}%0A`;


    message +=
        `🕐 Time: ${orderTime}%0A%0A`;


    message +=
        `👤 *CUSTOMER DETAILS*%0A`;


    message +=
        `Name: ${name}%0A`;


    message +=
        `Phone: ${phone}%0A`;


    message +=
        `Address: ${address}%0A%0A`;


    message +=
        `🍽️ *FOOD ORDER*%0A`;


    message +=
        `━━━━━━━━━━━━━━━━━━%0A`;


    cart.forEach(item => {

        const subtotal =
            item.price *
            item.quantity;


        message +=
            `• ${item.name}%0A`;


        message +=
            `  Qty: ${item.quantity} × ₹${item.price} = ₹${subtotal}%0A`;

    });


    message +=
        `━━━━━━━━━━━━━━━━━━%0A`;


    message +=
        `🍽️ Food Total: ₹${foodTotal}%0A`;


    message +=
        `🚚 Delivery: ₹${deliveryCharge}%0A`;


    message +=
        `📏 Distance: ${deliveryDistance} km%0A`;


    message +=
        `💰 *GRAND TOTAL: ₹${grandTotal}*%0A`;


    message +=
        `━━━━━━━━━━━━━━━━━━%0A`;


    message +=
        `🙏 Thank you for ordering from XYZ Dhaba!`;


    /*
       Save order for Malik
    */

    saveOwnerOrder({

        id: orderId,

        time: orderTime,

        name: name,

        phone: phone,

        address: address,

        items: [...cart],

        foodTotal: foodTotal,

        delivery: deliveryCharge,

        distance: deliveryDistance,

        grandTotal: grandTotal

    });


    /*
       Open WhatsApp
    */

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;


    window.open(
        whatsappURL,
        "_blank"
    );

}


/* =========================================
   OWNER ORDER
========================================= */

function saveOwnerOrder(order) {

    localStorage.setItem(
        "xyzLatestOrder",
        JSON.stringify(order)
    );


    showOwnerOrder(order);

}


/* =========================================
   SHOW OWNER ORDER
========================================= */

function showOwnerOrder(order) {

    const container =
        document.getElementById(
            "owner-order"
        );


    let itemsHTML = "";


    order.items.forEach(item => {

        const subtotal =
            item.price *
            item.quantity;


        itemsHTML += `

            <div class="owner-item">

                <span>
                    ${item.name}
                    × ${item.quantity}
                </span>

                <strong>
                    ₹${subtotal}
                </strong>

            </div>

        `;

    });


    container.innerHTML = `

        <div class="owner-order-card">

            <div class="owner-order-top">

                <div>

                    <small>
                        ORDER ID
                    </small>

                    <strong>
                        ${order.id}
                    </strong>

                </div>

                <div>
                    ${order.time}
                </div>

            </div>


            <div class="owner-customer">

                <div>

                    <small>
                        Customer
                    </small>

                    ${order.name}

                </div>


                <div>

                    <small>
                        Phone
                    </small>

                    ${order.phone}

                </div>


                <div>

                    <small>
                        Address
                    </small>

                    ${order.address}

                </div>

            </div>


            <div class="owner-items">

                ${itemsHTML}

            </div>


            <div class="owner-total">

                <span>
                    Total
                </span>

                <strong>
                    ₹${order.grandTotal}
                </strong>

            </div>

        </div>

    `;

}


/* =========================================
   LOAD LAST ORDER
========================================= */

function loadOwnerOrder() {

    const saved =
        localStorage.getItem(
            "xyzLatestOrder"
        );


    if (!saved) {

        return;

    }


    try {

        const order =
            JSON.parse(saved);


        showOwnerOrder(order);

    }

    catch {

        console.log(
            "Unable to load saved order."
        );

    }

}


/* =========================================
   INITIALIZE
========================================= */

updateCart();

loadOwnerOrder();
