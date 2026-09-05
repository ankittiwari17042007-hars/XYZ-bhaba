/* =========================================
   XYZ DHABA - OWNER JS
========================================= */

const HISTORY_KEY = "xyzOrderHistory";

let currentFilter = "all";
let selectedOrderId = null;
let selectedRating = 0;


/* =========================================
   OWNER LOGIN
========================================= */

function loginOwner(){

    const username = document.getElementById("owner-username").value.trim();
    const password = document.getElementById("owner-password").value;

    const message = document.getElementById("login-message");

    /*
       TEMPORARY LOGIN
       Backend aane par ise secure authentication
       se replace karenge.
    */

    if(username === "owner" && password === "xyz123"){

        sessionStorage.setItem("xyzOwnerLogin","true");

        showDashboard();

        message.textContent = "";

    }else{

        message.textContent = "❌ Wrong username or password";

    }
}


/* =========================================
   SHOW DASHBOARD
========================================= */

function showDashboard(){

    document.getElementById("owner-login").style.display = "none";
    document.getElementById("owner-dashboard").style.display = "block";

    loadOwnerOrders();
}


/* =========================================
   LOGOUT
========================================= */

function logoutOwner(){

    sessionStorage.removeItem("xyzOwnerLogin");

    document.getElementById("owner-dashboard").style.display = "none";
    document.getElementById("owner-login").style.display = "flex";

    document.getElementById("owner-username").value = "";
    document.getElementById("owner-password").value = "";
}


/* =========================================
   GET ORDERS
========================================= */

function getOrders(){

    try{

        const orders =
            JSON.parse(localStorage.getItem(HISTORY_KEY)) || [];

        return Array.isArray(orders) ? orders : [];

    }catch(error){

        console.error("Order loading error:",error);

        return [];

    }
}


/* =========================================
   SAVE ORDERS
========================================= */

function saveOrders(orders){

    localStorage.setItem(
        HISTORY_KEY,
        JSON.stringify(orders)
    );

}


/* =========================================
   LOAD ORDERS
========================================= */

function loadOwnerOrders(){

    const orders = getOrders();

    displayOrders(orders);

    displayHistory(orders);

    updateDashboardStats(orders);
}


/* =========================================
   DISPLAY ORDERS
========================================= */

function displayOrders(orders){

    const container =
        document.getElementById("owner-orders");

    if(!container) return;

    let filtered = orders;

    if(currentFilter === "pending"){

        filtered = orders.filter(
            order => order.status === "pending"
        );

    }

    if(currentFilter === "completed"){

        filtered = orders.filter(
            order => order.status === "completed"
        );

    }


    if(filtered.length === 0){

        container.innerHTML = `
            <div class="dashboard-empty">
                <div>📦</div>
                <h3>No Orders Found</h3>
                <p>There are no orders in this category.</p>
            </div>
        `;

        return;

    }


    container.innerHTML = filtered
        .slice()
        .reverse()
        .map(createOrderCard)
        .join("");

}


/* =========================================
   ORDER CARD
========================================= */

function createOrderCard(order){

    const items = Array.isArray(order.items)
        ? order.items
        : [];

    const itemHTML = items.map(item => {

        return `
            <div class="dashboard-item">
                <span>
                    ${escapeHTML(item.name || "Item")}
                    × ${item.quantity || 1}
                </span>

                <strong>
                    ₹${Number(item.price || 0) *
                    Number(item.quantity || 1)}
                </strong>
            </div>
        `;

    }).join("");


    const status =
        order.status === "completed"
        ? "completed"
        : "pending";


    const completeButton =
        status === "pending"
        ? `
            <button
                class="complete-order-btn"
                onclick="completeOrder('${order.id}')">
                ✅ Complete Order
            </button>
          `
        : "";


    const ratingHTML =
        status === "completed"
        ? `
            <div class="rating-box">

                <strong>Customer Rating</strong>

                ${
                    order.rating
                    ? `
                        <div class="rating-stars">
                            ${"★".repeat(Number(order.rating))}
                            ${"☆".repeat(5-Number(order.rating))}
                        </div>

                        ${
                            order.review
                            ? `<p class="review-text">
                                ${escapeHTML(order.review)}
                               </p>`
                            : ""
                        }
                    `
                    : `
                        <button
                            class="complete-order-btn"
                            onclick="openRatingModal('${order.id}')">
                            ⭐ Add Rating
                        </button>
                    `
                }

            </div>
          `
        : "";


    return `
        <div class="dashboard-order ${status === "completed" ? "completed" : ""}">

            <div class="order-card-top">

                <div>
                    <div class="order-id">
                        Order #${escapeHTML(String(order.id || "N/A"))}
                    </div>

                    <div class="order-customer">
                        ${escapeHTML(order.name || "Customer")}
                    </div>
                </div>

                <span class="status-badge status-${status}">
                    ${status === "completed" ? "Completed" : "Pending"}
                </span>

            </div>


            <div class="dashboard-order-info">

                <div class="info-box">
                    <strong>PHONE</strong>
                    ${escapeHTML(order.phone || "N/A")}
                </div>

                <div class="info-box">
                    <strong>ORDER TIME</strong>
                    ${formatDate(order.time)}
                </div>

                <div class="info-box order-address">
                    <strong>ADDRESS</strong>
                    ${escapeHTML(order.address || "N/A")}

                    ${
                        order.location
                        ? `
                            <br>
                            <a
                                class="location-link"
                                href="https://www.google.com/maps?q=${order.location.lat},${order.location.lng}"
                                target="_blank">
                                📍 Open Location
                            </a>
                          `
                        : ""
                    }

                </div>

            </div>


            <div class="dashboard-items">

                ${itemHTML}

                <div class="dashboard-total">
                    <span>Total</span>
                    <strong>
                        ₹${Number(order.grandTotal || 0)}
                    </strong>
                </div>

            </div>

            ${completeButton}

            ${ratingHTML}

        </div>
    `;

}


/* =========================================
   COMPLETE ORDER
========================================= */

function completeOrder(orderId){

    const orders = getOrders();

    const order = orders.find(
        item => String(item.id) === String(orderId)
    );

    if(!order) return;

    order.status = "completed";
    order.completedAt = new Date().toISOString();

    saveOrders(orders);

    loadOwnerOrders();

}


/* =========================================
   FILTER ORDERS
========================================= */

function filterOrders(filter,button){

    currentFilter = filter;

    document
        .querySelectorAll(".filter-btn")
        .forEach(btn => btn.classList.remove("active"));

    if(button){

        button.classList.add("active");

    }

    displayOrders(getOrders());

}


/* =========================================
   DASHBOARD STATS
========================================= */

function updateDashboardStats(orders){

    const pending =
        orders.filter(
            order => order.status === "pending"
        ).length;


    const completed =
        orders.filter(
            order => order.status === "completed"
        ).length;


    const sales =
        orders
        .filter(order => order.status === "completed")
        .reduce(
            (total,order) =>
                total + Number(order.grandTotal || 0),
            0
        );


    const ratings =
        orders
        .filter(
            order =>
                order.rating &&
                Number(order.rating) > 0
        )
        .map(
            order => Number(order.rating)
        );


    const average =
        ratings.length
        ? (
            ratings.reduce(
                (a,b) => a+b,
                0
            ) / ratings.length
          ).toFixed(1)
        : "0.0";


    document.getElementById("pending-count").textContent =
        pending;

    document.getElementById("completed-count").textContent =
        completed;

    document.getElementById("total-sales").textContent =
        `₹${sales}`;

    document.getElementById("average-rating").textContent =
        average;

}


/* =========================================
   ORDER HISTORY
========================================= */

function displayHistory(orders){

    const container =
        document.getElementById("order-history");

    if(!container) return;

    const completed =
        orders.filter(
            order => order.status === "completed"
        );


    if(completed.length === 0){

        container.innerHTML = `
            <div class="history-empty">
                <div>📋</div>
                <h3>No Completed Orders</h3>
                <p>Completed orders will appear here.</p>
            </div>
        `;

        return;

    }


    container.innerHTML =
        completed
        .slice()
        .reverse()
        .map(order => {

            const items =
                Array.isArray(order.items)
                ? order.items
                : [];


            const rows =
                items.map(item => {

                    return `
                        <tr>
                            <td>
                                ${escapeHTML(item.name || "Item")}
                            </td>

                            <td>
                                ${item.quantity || 1}
                            </td>

                            <td>
                                ₹${Number(item.price || 0)}
                            </td>

                            <td>
                                ₹${
                                    Number(item.price || 0) *
                                    Number(item.quantity || 1)
                                }
                            </td>
                        </tr>
                    `;

                }).join("");


            return `
                <div class="history-card completed-history">

                    <div class="history-top">

                        <div>
                            <strong>
                                Order #${escapeHTML(String(order.id || "N/A"))}
                            </strong>

                            <div class="history-value">
                                ${escapeHTML(order.name || "Customer")}
                            </div>
                        </div>

                        <span class="status-badge status-completed">
                            Completed
                        </span>

                    </div>


                    <div class="history-info">

                        <div>
                            <span class="history-label">
                                PHONE
                            </span>

                            <span class="history-value">
                                ${escapeHTML(order.phone || "N/A")}
                            </span>
                        </div>

                        <div>
                            <span class="history-label">
                                COMPLETED
                            </span>

                            <span class="history-value">
                                ${formatDate(order.completedAt)}
                            </span>
                        </div>

                        <div>
                            <span class="history-label">
                                ADDRESS
                            </span>

                            <span class="history-value">
                                ${escapeHTML(order.address || "N/A")}
                            </span>
                        </div>

                        <div>
                            <span class="history-label">
                                RATING
                            </span>

                            <span class="history-value">
                                ${
                                    order.rating
                                    ? "⭐".repeat(Number(order.rating))
                                    : "Not Rated"
                                }
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
                                ${rows}
                            </tbody>

                        </table>

                    </div>


                    <div class="history-total">
                        Total: ₹${Number(order.grandTotal || 0)}
                    </div>

                </div>
            `;

        })
        .join("");

}


/* =========================================
   CLEAR HISTORY
========================================= */

function clearOrderHistory(){

    const orders = getOrders();

    const completed =
        orders.filter(
            order => order.status === "completed"
        );


    if(completed.length === 0){

        alert("No completed orders to clear.");

        return;

    }


    const confirmClear =
        confirm(
            "Are you sure you want to clear completed order history?"
        );


    if(!confirmClear) return;


    const pending =
        orders.filter(
            order => order.status !== "completed"
        );


    saveOrders(pending);

    loadOwnerOrders();

}


/* =========================================
   RATING MODAL
========================================= */

function openRatingModal(orderId){

    selectedOrderId = orderId;
    selectedRating = 0;

    document
        .getElementById("rating-modal")
        .style.display = "flex";


    document
        .querySelectorAll(".rating-stars button")
        .forEach(btn =>
            btn.classList.remove("selected")
        );


    document.getElementById("rating-review").value = "";

}


function closeRatingModal(){

    document
        .getElementById("rating-modal")
        .style.display = "none";

}


function selectRating(rating){

    selectedRating = rating;

    document
        .querySelectorAll(".rating-stars button")
        .forEach((btn,index) => {

            btn.classList.toggle(
                "selected",
                index < rating
            );

        });

}


function submitRating(){

    if(!selectedOrderId || selectedRating === 0){

        alert("Please select a rating.");

        return;

    }


    const review =
        document
        .getElementById("rating-review")
        .value
        .trim();


    const orders = getOrders();

    const order =
        orders.find(
            item =>
                String(item.id) ===
                String(selectedOrderId)
        );


    if(!order) return;


    order.rating = selectedRating;
    order.review = review;

    saveOrders(orders);

    closeRatingModal();

    loadOwnerOrders();

}


/* =========================================
   DATE FORMAT
========================================= */

function formatDate(date){

    if(!date) return "N/A";

    const d = new Date(date);

    if(isNaN(d.getTime())) return "N/A";

    return d.toLocaleString("en-IN",{
        dateStyle:"medium",
        timeStyle:"short"
    });

}


/* =========================================
   BASIC HTML SECURITY
========================================= */

function escapeHTML(value){

    return String(value)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#039;");

}


/* =========================================
   PAGE LOAD
========================================= */

document.addEventListener("DOMContentLoaded",()=>{

    const loggedIn =
        sessionStorage.getItem("xyzOwnerLogin") === "true";


    if(loggedIn){

        showDashboard();

    }else{

        document.getElementById("owner-login").style.display = "flex";
        document.getElementById("owner-dashboard").style.display = "none";

    }

});
