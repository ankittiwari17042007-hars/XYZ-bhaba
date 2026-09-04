
// ===============================
// XYZ DHABA - CART SYSTEM
// ===============================

let cart = [];


// ===============================
// ADD TO CART
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

    // Cart section par le jana
    document.getElementById("cart").scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// DISPLAY CART
// ===============================

function displayCart() {

    const cartItems = document.getElementById("cart-items");

    cartItems.innerHTML = "";


    // Cart empty hai
    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty.
            </p>
        `;

        updateTotal();

        return;
    }


    // Cart items display
    cart.forEach((item, index) => {

        const itemTotal = item.price * item.quantity;

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p>₹${item.price} × ${item.quantity}</p>

                <strong>₹${itemTotal}</strong>

            </div>


            <div class="quantity-controls">

                <button onclick="decreaseQuantity(${index})">
                    −
                </button>

                <span>
                    ${item.quantity}
                </span>

                <button onclick="increaseQuantity(${index})">
                    +
                </button>

            </div>


            <button
                class="remove-button"
                onclick="removeItem(${index})"
            >
                Remove
            </button>

        `;

        cartItems.appendChild(cartItem);

    });


    updateTotal();
}


// ===============================
// INCREASE QUANTITY
// ===============================

function increaseQuantity(index) {

    cart[index].quantity++;

    displayCart();
}


// ===============================
// DECREASE QUANTITY
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
// REMOVE ITEM
// ===============================

function removeItem(index) {

    cart.splice(index, 1);

    displayCart();
}


// ===============================
// CALCULATE TOTAL
// ===============================

function updateTotal() {

    let foodTotal = 0;

    let totalThalis = 0;


    // Food total
    cart.forEach(item => {

        foodTotal += item.price * item.quantity;

        totalThalis += item.quantity;

    });


    // Packing = ₹10 per thali
    const packingCharge = totalThalis * 10;


    // Abhi delivery default ₹0
    const deliveryCharge = 0;


    // Grand total
    const grandTotal =
        foodTotal +
        packingCharge +
        deliveryCharge;


    document.getElementById("food-total").textContent =
        "₹" + foodTotal;


    document.getElementById("packing-total").textContent =
        "₹" + packingCharge;


    document.getElementById("delivery-total").textContent =
        "₹" + deliveryCharge;


    document.getElementById("grand-total").textContent =
        "₹" + grandTotal;
}


// ===============================
// PLACE ORDER
// ===============================

function placeOrder() {

    const name =
        document.getElementById("customer-name").value.trim();

    const phone =
        document.getElementById("customer-phone").value.trim();

    const address =
        document.getElementById("customer-address").value.trim();


    // Cart check
    if (cart.length === 0) {

        alert("Please add a thali to your cart first.");

        return;
    }


    // Name check
    if (name === "") {

        alert("Please enter your name.");

        return;
    }


    // Phone check
    if (phone === "") {

        alert("Please enter your mobile number.");

        return;
    }


    // Address check
    if (address === "") {

        alert("Please enter your delivery address.");

        return;
    }


    // Total calculate
    let foodTotal = 0;

    let totalThalis = 0;


    cart.forEach(item => {

        foodTotal += item.price * item.quantity;

        totalThalis += item.quantity;

    });


    const packingCharge =
        totalThalis * 10;


    const deliveryCharge = 0;


    const grandTotal =
        foodTotal +
        packingCharge +
        deliveryCharge;


    // Order confirmation
    alert(
        "🎉 Order Placed Successfully!\n\n" +

        "Customer: " + name + "\n" +

        "Phone: " + phone + "\n\n" +

        "Food Total: ₹" + foodTotal + "\n" +

        "Packing: ₹" + packingCharge + "\n" +

        "Delivery: FREE\n\n" +

        "Total: ₹" + grandTotal
    );


    // Cart clear
    cart = [];

    displayCart();


    // Form clear
    document.getElementById("customer-name").value = "";

    document.getElementById("customer-phone").value = "";

    document.getElementById("customer-address").value = "";

}
