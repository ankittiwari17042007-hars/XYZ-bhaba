/* =========================================
   XYZ DHABA
   ORDERING SYSTEM
========================================= */


/* =========================================
   SETTINGS
========================================= */

const SHOP_LAT = 26.4941963;
const SHOP_LNG = 80.2847087;

const WHATSAPP_NUMBER = "919795521543";

const DELIVERY_RATE = 15;


/* =========================================
   VARIABLES
========================================= */

let cart = [];

let deliveryDistance = 0;

// Customer ki Google Maps location
let customerLocationLink = "";


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

    if (slides[index]) {
        slides[index].classList.add("active");
    }

    if (dots[index]) {
        dots[index].classList.add("active");
    }

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

    if (!orderSection) {
        return;
    }

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

    if (!cart[index]) {
        return;
    }

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
        document.getElementById("cart-items-count");


    if (!cartContainer) {
        return;
    }


    let totalQuantity = 0;


    cart.forEach(item => {

        totalQuantity += item.quantity;

    });


    if (cartCount) {

        cartCount.innerText =
            totalQuantity;

    }


    if (itemCount) {

        itemCount.innerText =
            `${totalQuantity} items`;

    }


    /* =================================
       EMPTY CART
    ================================= */

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


    /* =================================
       CART ITEMS
    ================================= */

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


    const foodTotalElement =
        document.getElementById("food-total");

    const deliveryPriceElement =
        document.getElementById("delivery-price");

    const deliveryChargeElement =
        document.getElementById("delivery-charge");

    const grandTotalElement =
        document.getElementById("grand-total");

    const distanceElement =
        document.getElementById("distance");

    const deliveryDistanceElement =
        document.getElementById("delivery-distance");


    if (foodTotalElement) {

        foodTotalElement.innerText =
            `₹${foodTotal}`;

    }


    if (deliveryPriceElement) {

        deliveryPriceElement.innerText =
            `₹${deliveryCharge}`;

    }


    if (deliveryChargeElement) {

        deliveryChargeElement.innerText =
            `₹${deliveryCharge}`;

    }


    if (grandTotalElement) {

        grandTotalElement.innerText =
            `₹${grandTotal}`;

    }


    if (distanceElement) {

        distanceElement.innerText =
            `${deliveryDistance} km`;

    }


    if (deliveryDistanceElement) {

        deliveryDistanceElement.innerText =
            `${deliveryDistance} km`;

    }

}


/* =========================================
   CLEAR CART
========================================= */

function clearCart() {

    cart = [];

    updateCart();

}


/* =========================================
   CUSTOMER LOCATION
========================================= */

function getLocation() {

    const status =
        document.getElementById(
            "location-status"
        );


    const locationButton =
        document.getElementById(
            "location-button"
        );


    if (!navigator.geolocation) {

        if (status) {

            status.innerText =
                "❌ Browser location support nahi karta.";

        }

        return;

    }


    if (status) {

        status.innerText =
            "📍 Location detect ho rahi hai...";

    }


    if (locationButton) {

        locationButton.disabled = true;

        locationButton.innerText =
            "📍 Detecting Location...";

    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const userLat =
                position.coords.latitude;


            const userLng =
                position.coords.longitude;


            /* =================================
               GOOGLE MAPS LOCATION LINK
            ================================= */

            customerLocationLink =
                `https://www.google.com/maps?q=${userLat},${userLng}`;


            /* =================================
               DISTANCE
            ================================= */

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


            /* =================================
               UPDATE BILL
            ================================= */

            const deliveryDistanceElement =
                document.getElementById(
                    "delivery-distance"
                );


            const distanceElement =
                document.getElementById(
                    "distance"
                );


            const deliveryChargeElement =
                document.getElementById(
                    "delivery-charge"
                );


            if (deliveryDistanceElement) {

                deliveryDistanceElement.innerText =
                    `${deliveryDistance} km`;

            }


            if (distanceElement) {

                distanceElement.innerText =
                    `${deliveryDistance} km`;

            }


            if (deliveryChargeElement) {

                deliveryChargeElement.innerText =
                    `₹${charge}`;

            }


            /* =================================
               LOCATION SUCCESS
            ================================= */

            if (status) {

                status.innerText =
                    `✅ Location added • ${deliveryDistance} km away`;

            }


            if (locationButton) {

                locationButton.disabled = false;

                locationButton.innerText =
                    "✅ Location Added";

            }


            updateBill();

        },


        function(error) {

            customerLocationLink = "";

            deliveryDistance = 0;

            updateBill();


            if (locationButton) {

                locationButton.disabled = false;

                locationButton.innerText =
                    "📍 Use My Location";

            }


            if (error.code === 1) {

                if (status) {

                    status.innerText =
                        "❌ Location permission denied. Location allow karo.";

                }

            }

            else if (error.code === 2) {

                if (status) {

                    status.innerText =
                        "❌ Location unavailable. Dobara try karo.";

                }

            }

            else {

                if (status) {

                    status.innerText =
                        "❌ Location detect nahi ho payi. Dobara try karo.";

                }

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

    /* =================================
       CART CHECK
    ================================= */

    if (cart.length === 0) {

        alert(
            "Pehle menu se food add karo."
        );

        return;

    }


    /* =================================
       CUSTOMER DETAILS
    ================================= */

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


    /* =================================
       NAME CHECK
    ================================= */

    if (!name) {

        alert(
            "Apna naam enter karo."
        );

        return;

    }


    /* =================================
       PHONE CHECK
    ================================= */

    if (!phone) {

        alert(
            "Mobile number enter karo."
        );

        return;

    }


    /* =================================
       ADDRESS CHECK
    ================================= */

    if (!address) {

        alert(
            "Delivery address enter karo."
        );

        return;

    }


    /* =================================
       LOCATION MANDATORY
    ================================= */

    if (!customerLocationLink) {

        alert(
            "📍 Order place karne se pehle 'Use My Location' button press karke location allow karo."
        );


        const status =
            document.getElementById(
                "location-status"
            );


        if (status) {

            status.innerText =
                "❌ Location required. Please use 'Use My Location'.";

        }


        const locationButton =
            document.getElementById(
                "location-button"
            );


        if (locationButton) {

            locationButton.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

        }


        return;

    }


    /* =================================
       TOTALS
    ================================= */

    const foodTotal =
        getFoodTotal();


    const deliveryCharge =
        getDeliveryCharge();


    const grandTotal =
        foodTotal +
        deliveryCharge;


    /* =================================
       ORDER ID
    ================================= */

    const orderId =
        "XYZ" +
        Date.now().toString().slice(-6);


    /* =================================
       CURRENT TIME
    ================================= */

    const orderTime =
        new Date().toLocaleString(
            "en-IN"
        );


    /* =================================
       WHATSAPP MESSAGE
    ================================= */

    let message =
        `🍛 *XYZ DHABA - NEW ORDER*%0A`;


    message +=
        `━━━━━━━━━━━━━━━━━━%0A`;


    message +=
        `🆔 Order ID: ${orderId}%0A`;


    message +=
        `🕐 Time: ${orderTime}%0A%0A`;


    /* =================================
       CUSTOMER DETAILS
    ================================= */

    message +=
        `👤 *CUSTOMER DETAILS*%0A`;


    message +=
        `Name: ${name}%0A`;


    message +=
        `Phone: ${phone}%0A`;


    message +=
        `Address: ${address}%0A%0A`;


    /* =================================
       CUSTOMER LOCATION
    ================================= */

   
