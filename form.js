document.addEventListener("DOMContentLoaded", function () {
    // Handle cart summary
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const orderSummaryContainer = document.getElementById("order-summary");
    const subtotalElement = document.getElementById("subtotal");
    const serviceChargeElement = document.getElementById("service-charge");
    const totalElement = document.getElementById("total");

    orderSummaryContainer.innerHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
        const itemDiv = document.createElement("div");
        itemDiv.classList.add("order-item");

        subtotal += item.price * item.quantity;

        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}" width="50">
            <p><strong>${item.name}</strong></p>
            <p>Price: Rs ${item.price}.00</p>
            <p>Quantity: ${item.quantity}</p>
            <p>Total: Rs ${(item.price * item.quantity).toFixed(2)}</p>
            <hr>
        `;
        orderSummaryContainer.appendChild(itemDiv);
    });

    const serviceCharge = subtotal * 0.075;
    const total = subtotal + serviceCharge;

    subtotalElement.innerHTML = `<span class="label">Subtotal:</span><span class="amount">Rs ${subtotal.toFixed(2)}</span>`;
serviceChargeElement.innerHTML = `<span class="label">Service Charge (7.50%):</span><span class="amount">Rs ${serviceCharge.toFixed(2)}</span>`;
totalElement.innerHTML = `<span class="label">Total:</span><span class="amount">Rs ${total.toFixed(2)}</span>`;

    // Toggle delivery fields
    const deliveryRadio = document.getElementById("delivery");
    const pickupRadio = document.getElementById("pickup");
    const deliveryDetails = document.getElementById("delivery-details");

    if (deliveryRadio && pickupRadio && deliveryDetails) {
        deliveryRadio.addEventListener("change", () => {
            deliveryDetails.classList.remove("hidden");
            deliveryDetails.style.display = "grid";
        });
        pickupRadio.addEventListener("change", () => {
            deliveryDetails.classList.add("hidden");
            deliveryDetails.style.display = "none";
        });
    }

    // Copy billing to delivery
    const copyCheckbox = document.getElementById("copyBilling");
    const billingFirstName = document.getElementById("firstName");
    const billingLastName = document.getElementById("lastName");
    const billingPhone = document.getElementById("phone");
    const billingEmail = document.getElementById("email");

    const deliveryFirstName = document.getElementById("deliveryFirstName");
    const deliveryLastName = document.getElementById("deliveryLastName");
    const deliveryPhone = document.getElementById("deliveryPhone");
    const deliveryEmail = document.getElementById("deliveryEmail");

    copyCheckbox.addEventListener("change", function () {
        if (copyCheckbox.checked) {
            deliveryFirstName.value = billingFirstName.value;
            deliveryLastName.value = billingLastName.value;
            deliveryPhone.value = billingPhone.value;
            deliveryEmail.value = billingEmail.value;
        } else {
            deliveryFirstName.value = "";
            deliveryLastName.value = "";
            deliveryPhone.value = "";
            deliveryEmail.value = "";
        }
    });

    // Form validation setup
    const billingForm = document.querySelector(".billing-container");
    const deliveryForm = document.querySelector(".delivery-form");

    const validateField = (element, message, pattern = null) => {
        const errorSpan = element.nextElementSibling;
        const value = element.value.trim();

        if (value === "") {
            if (errorSpan && errorSpan.classList.contains("error")) {
                errorSpan.innerText = message;
            }
            return false;
        } else if (pattern && !pattern.test(value)) {
            if (errorSpan && errorSpan.classList.contains("error")) {
                errorSpan.innerText = "Invalid input";
            }
            return false;
        } else {
            if (errorSpan && errorSpan.classList.contains("error")) {
                errorSpan.innerText = "";
            }
            return true;
        }
    };

    const addRealTimeValidation = (element, message, pattern = null) => {
        element.addEventListener("input", () => validateField(element, message, pattern));
    };

    function initValidation(form) {
        const requiredInputs = form.querySelectorAll("input[required], select[required]");
        requiredInputs.forEach(input => {
            if (!input.nextElementSibling || !input.nextElementSibling.classList.contains("error")) {
                const errorSpan = document.createElement("span");
                errorSpan.className = "error";
                input.insertAdjacentElement("afterend", errorSpan);
            }
            const labelText = input.previousElementSibling?.innerText || "Field";
            const requiredMsg = `${labelText} is required`;
            addRealTimeValidation(input, requiredMsg, input.type === "tel" ? /^[0-9]{10}$/ : null);
        });
    }

    initValidation(billingForm);
    initValidation(deliveryForm);

    // Payment method handling
    const paymentOptions = document.querySelectorAll('input[name="payment-method"]');
    const cashOption = document.createElement('div');
    cashOption.className = 'card-option';
    cashOption.innerHTML = `
        <input type="radio" name="card" id="cash">
        <label for="cash">Cash</label>
        <img src="page/cash.png" alt="Cash">
    `;

    paymentOptions.forEach(option => {
        option.addEventListener('change', function () {
            if (this.id === 'pay-delivery') {
                document.querySelector('.card-options').appendChild(cashOption);
            } else {
                if (cashOption.parentNode) {
                    cashOption.parentNode.removeChild(cashOption);
                }
            }
        });
    });

    // Final order placement
    const placeOrderButton = document.querySelector('.pay-container button');
    placeOrderButton?.addEventListener("click", function (e) {
        e.preventDefault();

        const termsCheckbox = document.getElementById("terms");
        const errorMessage = document.getElementById("terms-error");

        if (!termsCheckbox.checked) {
            errorMessage.style.display = "inline";
            return; 
        } else {
            errorMessage.style.display = "none";
        }

        const allFields = [...billingForm.querySelectorAll("input[required], select[required]")];
        if (!pickupRadio.checked) {
            allFields.push(...deliveryForm.querySelectorAll("input[required], select[required]"));
        }

        let valid = true;
        allFields.forEach(field => {
            const labelText = field.previousElementSibling?.innerText || "Field";
            const requiredMsg = `${labelText} is required`;
            const isValid = validateField(field, requiredMsg, field.type === "tel" ? /^[0-9]{10}$/ : null);
            if (!isValid) valid = false;
        });

        if (!termsCheckbox.checked) {
            errorMessage.style.display = "inline";
            valid = false;
        } else {
            errorMessage.style.display = "none";
        }
        if (!valid) return;

        // Show success screen
        const successMessage = document.getElementById("success-message");
        successMessage.classList.add("show");

        const step3 = document.getElementById("step3");
        if (step3) {
            step3.classList.add("active");
        }

    });

    
});
