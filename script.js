// ===============================
// XYZ DHABA - COMPLETE CART + DELIVERY SYSTEM
// ===============================

// ===============================
// 1. DHABA LOCATION
// ===============================

// Demo location
// Baad mein apne Dhaba ki location ke coordinates yahan change kar dena.
const DHABA_LATITUDE = 26.4499;
const DHABA_LONGITUDE = 80.3319;


// ===============================
// 2. DELIVERY RULES
// ===============================

const FREE_DELIVERY_DISTANCE = 1; // 1 KM tak FREE
const DELIVERY_RATE_PER_KM = 15;   // ₹15 per KM


// ===============================
// 3. CART
// ===============================

let cart = [];


// ===============================
// 4. CUSTOMER DISTANCE
// ===============================

let customerDistance = null;


// ===============================
// 5. ADD TO CART
// ===============================

function addToCart(name, price) {

    const existingItem = cart.find(item => item.name === name);

    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            name: name,
            price: price,
            quantity: 1
        });

    }

    displayCart();

    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// 6. DISPLAY CART
// ===============================

function displayCart() {

    const cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        updateTotal();

        return;
    }


    cart.forEach((item, index) => {

        const itemTotal =
            item.price * item.quantity;


        const cartItem =
            document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>
                    ₹${item.price} × ${item.quantity}
                </p>

                <strong>
                    ₹${itemTotal}
                </strong>

            </div>


            <div class="quantity-controls">

                <button
                    onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button
                    onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>


            <button
                class="remove-button"
                onclick="removeItem(${index})">

                Remove

            </button>

        `;


        cartItems.appendChild(cartItem);

    });


    updateTotal();
}


// ===============================
// 7. INCREASE QUANTITY
// ===============================

function increaseQuantity(index) {

    cart[index].quantity++;

    displayCart();
}


// ===============================
// 8. DECREASE QUANTITY
// ===============================

function decreaseQuantity(index) {

    if (cart[index].quantity > 1) {

        cart[index].quantity--;

    } else {

        cart.splice(index, 1);

    }

    displayCart();
}


// ===============================
// 9. REMOVE ITEM
// ===============================

function removeItem(index) {

    cart.splice(index, 1);

    displayCart();
}


// ===============================
// 10. DISTANCE CALCULATION
// ===============================

function calculateDistance(
    lat1,
    lon1,
    lat2,
    lon2
) {

    const earthRadius = 6371;


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


    return earthRadius * c;
}


// ===============================
// 11. GET CUSTOMER LOCATION
// ===============================

function getCustomerLocation() {

    if (!navigator.geolocation) {

        alert(
            "Your browser does not support location."
        );

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const customerLatitude =
                position.coords.latitude;


            const customerLongitude =
                position.coords.longitude;


            customerDistance =
                calculateDistance(

                    DHABA_LATITUDE,
                    DHABA_LONGITUDE,

                    customerLatitude,
                    customerLongitude

                );


            customerDistance =
                Number(customerDistance.toFixed(2));


            calculateDeliveryCharge();


            alert(
                "📍 Location detected!\n\n" +
                "Distance from XYZ Dhaba: " +
                customerDistance +
                " KM"
            );

        },


        function(error) {

            alert(
                "Unable to get your location.\n" +
                "Please allow location permission."
            );

        }

    );
}


// ===============================
// 12. DELIVERY CHARGE
// ===============================

function calculateDeliveryCharge() {

    if (customerDistance === null) {

        return 0;
    }


    // 1 KM tak FREE

    if (
        customerDistance <=
        FREE_DELIVERY_DISTANCE
    ) {

        return 0;
    }


    // More than 1 KM

    return Math.ceil(customerDistance)
        * DELIVERY_RATE_PER_KM;
}


// ===============================
// 13. UPDATE TOTAL
// ===============================

function updateTotal() {

    let foodTotal = 0;

    let totalThalis = 0;


    cart.forEach(item => {

        foodTotal +=
            item.price *
            item.quantity;


        totalThalis +=
            item.quantity;

    });


    // ₹10 packing per thali

    const packingCharge =
        totalThalis * 10;


    // Delivery charge

    const deliveryCharge =
        calculateDeliveryCharge();


    // Grand total

    const grandTotal =
        foodTotal +
        packingCharge +
        deliveryCharge;


    document.getElementById(
        "food-total"
    ).textContent =
        "₹" + foodTotal;


    document.getElementById(
        "packing-total"
    ).textContent =
        "₹" + packingCharge;


    document.getElementById(
        "delivery-total"
    ).textContent =
        "₹" + deliveryCharge;


    document.getElementById(
        "grand-total"
    ).textContent =
        "₹" + grandTotal;
}


// ===============================
// 14. PLACE ORDER
// ===============================

function placeOrder() {

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


    // Cart check

    if (cart.length === 0) {

        alert(
            "Please add a thali to your cart first."
        );

        return;
    }


    // Name check

    if (name === "") {

        alert(
            "Please enter your name."
        );

        return;
    }


    // Phone check

    if (phone === "") {

        alert(
            "Please enter your mobile number."
        );

        return;
    }


    // Address check

    if (address === "") {

        alert(
            "Please enter your delivery address."
        );

        return;
    }


    // Location check

    if (customerDistance === null) {

        alert(
            "Please detect your location first."
        );

        return;
    }


    let foodTotal = 0;

    let totalThalis = 0;


    cart.forEach(item => {

        foodTotal +=
            item.price *
            item.quantity;


        totalThalis +=
            item.quantity;

    });


    const packingCharge =
        totalThalis * 10;


    const deliveryCharge =
        calculateDeliveryCharge();


    const grandTotal =
        foodTotal +
        packingCharge +
        deliveryCharge;


    let deliveryMessage;


    if (deliveryCharge === 0) {

        deliveryMessage =
            "FREE";

    } else {

        deliveryMessage =
            "₹" + deliveryCharge;

    }


    // Order confirmation

    alert(

        "🎉 ORDER PLACED SUCCESSFULLY!\n\n" +

        "Customer: " +
        name +
        "\n" +

        "Phone: " +
        phone +
        "\n\n" +

        "Distance: " +
        customerDistance +
        " KM\n\n" +

        "Food Total: ₹" +
        foodTotal +
        "\n" +

        "Packing: ₹" +
        packingCharge +
        "\n" +

        "Delivery: " +
        deliveryMessage +
        "\n\n" +

        "GRAND TOTAL: ₹" +
        grandTotal

    );


    // Clear cart

    cart = [];

    customerDistance = null;


    displayCart();


    // Clear form

    document.getElementById(
        "customer-name"
    ).value = "";


    document.getElementById(
        "customer-phone"
    ).value = "";


    document.getElementById(
        "customer-address"
    ).value = "";

}
