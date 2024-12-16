document.addEventListener("DOMContentLoaded", () => {
    // Update the cart item counter on page load
    updateCartCounter();

    /**
     * Fetching the search button and input value.
     */
    const searchButton = document.getElementById("searchButton");
    const searchInput = document.getElementById("searchInput");

    /**
     * Adding a click event on searchButton.
     */
    searchButton.addEventListener("click", () => {
        const query = searchInput.value.toLowerCase().trim();

        /**
         * Redirects to the specified page.
         */
        if (query === "mens") {
            window.location.href = "mens.html";
        } else if (query === "womens") {
            window.location.href = "women.html";
        } else if (query === "kids") {
            window.location.href = "kids.html";
        } else if (query === "beauty") {
            window.location.href = "beauty.html";
        } else if (query === "accessories") {
            window.location.href = "accessories.html";
        } else {
            alert("Category is not available yet.");
        }
    });

    /**
     * Adds sorting functionality for the product names.
     */
    document.getElementById("sortProductName")?.addEventListener("click", () => {
        const table = document.getElementById("cartTable");
        const rows = Array.from(table.querySelectorAll("tbody tr"));

        /**
         * Sorts the rows by product name.
         */
        rows.sort((rowA, rowB) => {
            const nameA = rowA.cells[0].textContent.trim().toLowerCase();
            const nameB = rowB.cells[0].textContent.trim().toLowerCase();
            return nameA.localeCompare(nameB);
        });

        /**
         * Append sorted rows back to the table.
         */
        rows.forEach(row => table.querySelector("tbody").appendChild(row));
    });

    /**
     * Handles Add to Cart functionality.
     */
    const addToCartButtons = document.querySelectorAll(".add-to-cart");

    addToCartButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const card = event.target.closest(".card");

            /**
             * Extract product details dynamically.
             */
            const title = card.dataset.title;
            const description = card.dataset.description;
            const price = card.dataset.price;

            /**
             * Calling addToCart function.
             */
            addToCart(title, description, price);
        });
    });

    /**
     * Add the item to the cart.
     */
    function addToCart(title, description, price) {
        /**
         * Retrieve existing cart items from localStorage.
         */
        const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

        /**
         * Add the new item to the cart.
         */
        cart.push({ title, description, price });

        /**
         * Save the updated cart back to localStorage.
         */
        localStorage.setItem("cartItems", JSON.stringify(cart));

        /**
         * Update the cart item count.
         */
        updateCartCounter();

        /**
         * Redirect to Add to Cart page.
         */
        window.location.href = "add-to-cart.html";
    }

    /**
     * Update the cart counter on the bag icon.
     */
    function updateCartCounter() {
        const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        const itemCount = cart.length;

        const bagIcon = document.querySelector(".user-actions .bag");
        const counter = document.createElement("span");
        counter.classList.add("cart-counter");
        counter.textContent = itemCount;

        // Remove previous counter if it exists
        const existingCounter = bagIcon.querySelector(".cart-counter");
        if (existingCounter) {
            existingCounter.remove();
        }

        // Add the new counter
        bagIcon.appendChild(counter);
    }
});

/**
 * Function to display cart items and total price.
 */
function displayCartItems() {
    /**
     * Retrieve cart items from localStorage.
     */
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    /**
     * Get the table body.
     */
    const tableBody = document.querySelector("#cartTable tbody");
    tableBody.innerHTML = "";

    let totalPrice = 0;

    /**
     * Populate table rows with cart items.
     */
    cart.forEach((item, index) => {
        const row = document.createElement("tr");
        const price = parseFloat(item.price);
        if (isNaN(price)) {
            console.error("Invalid price value:", item.price);
        }

        row.innerHTML = `
            <td>${item.title}</td>
            <td>${item.description}</td>
            <td>${item.price}</td>
            <td><button onclick="deleteItem(${index})">Delete</button></td>
            <td><button class="btn btn-success pay-now" data-index="${index}">Pay Now</button></td>
        `;
        tableBody.appendChild(row);
        totalPrice += price;
    });

    /**
     * Handle empty cart case.
     */
    if (cart.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4">Your cart is empty</td></tr>`;
        totalPrice = 0;
    }

    /**
     * Add event listeners to "Pay Now" buttons.
     */
    const payNowButtons = document.querySelectorAll(".pay-now");
    payNowButtons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const index = event.target.dataset.index;
            openPaymentForm(index);
        });
    });
}

/**
 * Function to open the payment form.
 */
function openPaymentForm(index) {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const item = cart[index];

    if (!item) {
        alert("Item not found in cart.");
        return;
    }

    /**
     * Display the payment form.
     */
    const paymentFormContainer = document.getElementById("paymentFormContainer");
    paymentFormContainer.style.display = "block";
}

/**
 * Handle payment form submission.
 */
const paymentForm = document.getElementById("paymentForm");
paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();

    /**
     * Retrieve the index from the form.
     */
    const index = paymentForm.dataset.index;

    /**
     * Hide the payment form after submission.
     */
    const paymentFormContainer = document.getElementById("paymentFormContainer");
    paymentFormContainer.style.display = "none";

    /**
     * Show a confirmation alert.
     */
    alert("Payment submitted successfully!");

    /**
     * Remove the item from the cart after payment.
     */
    removeItemFromCart(index);

    /**
     * Clear the form.
     */
    paymentForm.reset();
});

/**
 * Function to remove an item from the cart after payment.
 */
function removeItemFromCart(index) {
    /**
     * Retrieve cart items from localStorage.
     */
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    /**
     * Remove the selected item.
     */
    cart.splice(index, 1);

    /**
     * Update localStorage.
     */
    localStorage.setItem("cartItems", JSON.stringify(cart));

    /**
     * Refresh the cart display.
     */
    displayCartItems();

    /**
     * Update the cart counter.
     */
    updateCartCounter();
}

/**
 * Function to delete an item from the cart.
 */
function deleteItem(index) {
    /**
     * Retrieve cart items from localStorage.
     */
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];

    /**
     * Remove the selected item.
     */
    cart.splice(index, 1);

    /**
     * Update localStorage.
     */
    localStorage.setItem("cartItems", JSON.stringify(cart));
    displayCartItems();

    /**
     * Update the cart counter.
     */
    updateCartCounter();
}

/**
 * Function to clear the cart.
 */
function clearCart() {
    localStorage.removeItem("cartItems");
    displayCartItems();
    alert("Your cart has been cleared!");

    /**
     * Update the cart counter.
     */
    updateCartCounter();
}

/**
 * Event listener for Clear Cart button.
 */
document.addEventListener("DOMContentLoaded", () => {
    const clearCartButton = document.getElementById("clearCartButton");
    clearCartButton?.addEventListener("click", clearCart);
});

document.addEventListener("DOMContentLoaded", displayCartItems);
