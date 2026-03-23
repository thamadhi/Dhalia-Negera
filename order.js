function setupFilterButtons() {
    const filterButtons = document.querySelectorAll(".button-value");
    filterButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            const category = event.target.getAttribute("data-filter");
            filterItems(category);
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    loadMenu(); // Load the menu when the page is ready
    setupFilterButtons(); // Set up the filter buttons
    applyFilterFromUrl();

    document.getElementById("checkout-btn").addEventListener("click", function() {
        localStorage.setItem("cartItems", JSON.stringify(cart));
        console.log("Cart saved:",cart);
        window.location.href = "form.html"; // Replace with your actual checkout page URL
    });
});

let menuItems = [];
let cart = [];
// Function to load menu from XML
function loadMenu() {
    fetch("order.xml") // Fetch the XML data
        .then(response => response.text())
        .then(xmlText => {
            const parser = new DOMParser();
            const xmlDoc = parser.parseFromString(xmlText, "application/xml"); // Parse XML

            // Get all the items in the XML
            const items = xmlDoc.getElementsByTagName("item");

            // Loop through the XML items and store them in the menuItems array
            menuItems = Array.from(items);

            // Initially, display all items
            displayItems(menuItems);

            const urlParams = new URLSearchParams(window.location.search);
            const filter = urlParams.get("filter");

            if (filter) {
                 const upper = filter.toUpperCase();
                 console.log("Filter from URL:", upper);

            filterItems(upper);

            // Highlight the filter button
            const targetButton = document.querySelector(`.button-value[data-filter="${upper}"]`);
            if (targetButton) {
                targetButton.classList.add("active");
            } else {
                console.log("No matching button for filter:", upper);
            }
        } else {
            displayItems(menuItems);
        }
        })
        .catch(error => console.error("Error loading XML:", error));
}

function loadCartFromLocalStorage(){
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log("cart loaded from localstorage:",cart);
        updateCartDisplay();
    }
}

// Function to attach event listeners to the "Add to Cart" buttons
/*function attachEventListeners() {
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", addToCart);
    });
}*/

// Function to display items in the menu container
function displayItems(items) {


    const menuContainer = document.getElementById("menu-container");
    menuContainer.innerHTML = ""; // Clear existing menu items

    // Loop through the filtered items and display them
    items.forEach(item => {
        const id = item.getElementsByTagName("id")[0].textContent;
        const name = item.getElementsByTagName("name")[0].textContent;
        const price = item.getElementsByTagName("price")[0].textContent;
        const image = item.getElementsByTagName("image")[0].textContent;
        const ingredients = item.getElementsByTagName("ingredients")[0].textContent;

        // Create a card for each item
        const card = document.createElement("div");
        card.classList.add("card");
        card.id =`${id}`;
        

        card.innerHTML = `
            <img src="${image}" alt="${name}">
            <h3>${name}</h3>
            <p>${ingredients}</p>
            <p class="price">Rs ${price}.00</p>
            <button class="add-to-cart" data-id="${id}">
                <i class="fas fa-plus"></i> Add to Cart
            </button>
        `;

        menuContainer.appendChild(card);
    });

    // Reattach event listeners to the "Add to Cart" buttons
    attachEventListeners();
}

function attachEventListeners(){
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click",addToCart);
    });
}

function updateCartDisplay() {
    const cartContainer = document.getElementById("cart-items");
    const subtotalElement = document.getElementById("subtotal");
    const serviceChargeElement = document.getElementById("service-charge");
    const totalPriceElement = document.getElementById("cart-total");
    const cartItemCount = document.querySelector(".cart-item-count"); // Select cart count span
    if(!cartContainer) {
        console.error("cartContainer not found in the DOM");
        return;
    }
    
    cartContainer.innerHTML="";

    let subtotal = 0;
    let totalItems = 0; // Variable to count total items

    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalItems += item.quantity; // Update total items count

        console.log(`display cart item with ID: ${item.id}`);

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
            <button class="remove-from-cart" data-id="${item.id}" aria-label="Remove item from cart">
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
    

    if (cartItemCount) {
        cartItemCount.textContent = totalItems > 0 ? totalItems : "";
    }

    // Attach event listeners for remove buttons
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



function addToCart(event) {
    const itemId = event.target.getAttribute("data-id");
    const item = menuItems.find(item => item.getElementsByTagName("id")[0].textContent === itemId);

    if (!item) return;

    const name = item.getElementsByTagName("name")[0].textContent;
    const price = parseFloat(item.getElementsByTagName("price")[0].textContent);
    const image = item.getElementsByTagName("image")[0].textContent;

    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id:itemId,
            name: name,
            price:price,
            image: image,
            quantity:1
        });
    }
     console.log("Cart after adding item:",cart)

    localStorage.setItem('cart',JSON.stringify(cart));

    updateCartDisplay();
}

function removeFromCart(event) {
    const button = event.target.closest("button.remove-from-cart");
    if (!button) return; // If no button is found, exit

    const itemId = button.getAttribute("data-id"); // Get item ID from the button
    cart = cart.filter(item => item.id !== itemId); // Remove item from cart

    // Save the updated cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartDisplay(); // Refresh cart UI
}

function increaseQuantity(event) {
    const itemId = event.target.getAttribute("data-id");
    const item = cart.find(item => item.id === itemId);

    if (item) {
        item.quantity += 1;
        localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
        updateCartDisplay(); // Refresh cart UI
    }
}

function decreaseQuantity(event) {
    const itemId = event.target.getAttribute("data-id");
    const item = cart.find(item => item.id === itemId);

    if (item && item.quantity > 1) {
        item.quantity -= 1;
    } else {
        // If quantity is 1, remove the item from cart
        cart = cart.filter(cartItem => cartItem.id !== itemId);
    }

    localStorage.setItem('cart', JSON.stringify(cart)); // Save updated cart
    updateCartDisplay(); // Refresh cart UI
}

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}

// Attach event listeners for cart icon and close button
document.addEventListener("DOMContentLoaded", () => {
    updateCartDisplay();
    loadCartFromLocalStorage(); // Load the cart from localStorage on page load
    loadMenu(); // Load the menu when the page is ready

    document.getElementById('icon-cart').addEventListener('click', toggleCart);
    document.getElementById('close-cart').addEventListener('click', toggleCart);
});

// Filter items by category
function filterItems(category) {
    if (category === "ALL") {
        // If the category is "ALL", show all items
        displayItems(menuItems);
    } else {
        // Filter the items based on the type
        const filteredItems = menuItems.filter(item => {
            const type = item.getElementsByTagName("type")[0].textContent.toUpperCase();
            return type === category.toUpperCase(); // Match the category
        });

        // Display the filtered items
        displayItems(filteredItems);
    }
}

function applyFilterFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get("filter");

    if (filter) {
        filterItems(filter.toUpperCase()); // ✅ apply correct filter
        const targetButton = document.querySelector(`.button-value[data-filter="${filter.toUpperCase()}"]`);
        if (targetButton) {
            targetButton.classList.add('active');
        }
    } else {
        // If no filter is in URL, show all
        displayItems(menuItems);
    }
}




document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');

    if (filter) {
        const filterUpper = filter.toUpperCase();

        const targetButton = document.querySelector(`.button-value[data-filter="${filterUpper}"]`);
        if (targetButton) {
            targetButton.classList.add('active'); // Optional: styling
             // Apply the filter
        } else {
            console.warn("No button found for filter:", filterUpper);
        }
    }
});






