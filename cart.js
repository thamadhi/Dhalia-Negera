let cart = [];

function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

function updateCartDisplay() {
    const cartContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const serviceChargeElement = document.getElementById("service-charge");
    const totalPriceElement = document.getElementById("cart-total");
    const cartItemCount = document.querySelector(".cart-item-count");

    if (!cartContainer) return;

    cartContainer.innerHTML = "";
    let subtotal = 0;
    let totalItems = 0;

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity;

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-details">
                <h4>${item.name}</h4>
                <p>Rs ${item.price}.00</p>
                <div class="cart-controls">
                    <button class="decrease-qty" data-id="${item.id}">-</button>
                    <span>${item.quantity}</span>
                    <button class="increase-qty" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="remove-from-cart" data-id="${item.id}" aria-label="remove">
                <i class="fas fa-trash"></i>
            </button>
        `;
        cartContainer.appendChild(cartItem);
    });

    let serviceCharge = subtotal * 0.075;
    let total = subtotal + serviceCharge;

    if (subtotalElement) {
        subtotalElement.innerHTML = `<strong>Subtotal:</strong> <span>Rs ${subtotal.toFixed(2)}</span>`;
    }
    if (serviceChargeElement) {
        serviceChargeElement.innerHTML = `<strong>Service Charges (7.50%):</strong> <span>Rs ${serviceCharge.toFixed(2)}</span>`;
    }
    if (totalPriceElement) {
        totalPriceElement.innerHTML = `<strong>Total:</strong> <span>Rs ${total.toFixed(2)}</span>`;
    }
    
    if (cartItemCount) cartItemCount.textContent = totalItems > 0 ? totalItems : "";

    document.querySelectorAll(".remove-from-cart").forEach(button => {
        button.addEventListener("click", removeFromCart);
    });
    document.querySelectorAll(".increase-qty").forEach(button => {
        button.addEventListener("click", increaseQuantity);
    });
    document.querySelectorAll(".decrease-qty").forEach(button => {
        button.addEventListener("click", decreaseQuantity);
    });
}

function removeFromCart(event) {
    const itemId = event.target.closest("button").getAttribute("data-id");
    cart = cart.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function increaseQuantity(event) {
    const itemId = event.target.getAttribute("data-id");
    const item = cart.find(item => item.id === itemId);
    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartDisplay();
    }
}

function decreaseQuantity(event) {
    const itemId = event.target.getAttribute("data-id");
    const item = cart.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
        item.quantity -= 1;
    } else {
        cart = cart.filter(cartItem => cartItem.id !== itemId);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}

document.addEventListener("DOMContentLoaded", () => {
    loadCartFromLocalStorage();
    updateCartDisplay();
    document.getElementById('icon-cart').addEventListener('click', toggleCart);
    document.getElementById('close-cart').addEventListener('click', toggleCart);

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", function () {
            localStorage.setItem("cart", JSON.stringify(cart));
            window.location.href = "form.html"; // or next checkout step
        });
    }
});
