const form = document.getElementById("reservationForm");
const username = document.getElementById("name");
const phone = document.getElementById("phone");
const persons = document.getElementById("persons");
const date = document.getElementById("date");
const time = document.getElementById("time");
const message = document.getElementById("message");
const successMessage = document.getElementById("successMessage");

// Listen for form submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const isValid = validateInputs();

    if (isValid) {
        successMessage.style.display = "block"; // Show success message
        successMessage.textContent = "Reservation successful! We will contact you soon.";
        form.reset(); // Clear the form after successful submission

        // Clear validation errors after submission
        document.querySelectorAll(".error").forEach((error) => (error.innerText = ""));
    }
});

// Real-time validation (removes errors while typing)
username.addEventListener("input", () => validateField(username, "Username is required"));
phone.addEventListener("input", () => validateField(phone, "Phone number is required", /^[0-9]{10}$/));
persons.addEventListener("change", () => validateField(persons, "Please select the number of people"));
date.addEventListener("input", () => validateField(date, "Please select a date"));
time.addEventListener("input", () => validateField(time, "Please select a time"));

// Display error message
const setError = (element, message) => {
    const errorDisplay = element.nextElementSibling; // Get the <span class="error"> right after input
    if (errorDisplay && errorDisplay.classList.contains("error")) {
        errorDisplay.innerText = message;
    }
};

const setSuccess = (element) => {
    const errorDisplay = element.nextElementSibling;
    if (errorDisplay && errorDisplay.classList.contains("error")) {
        errorDisplay.innerText = ""; // Clears the error
    }
};


// Validate individual field
const validateField = (element, message, pattern = null) => {
    const value = element.value.trim();
    if (value === "") {
        setError(element, message);
        return false;
    } else if (pattern && !pattern.test(value)) {
        setError(element, "Invalid input");
        return false;
    } else {
        setSuccess(element);
        return true;
    }
};

// Validate all fields on form submission
const validateInputs = () => {
    let valid = true;
    if (!validateField(username, "Name is required")) valid = false;
    if (!validateField(phone, "Phone number is required", /^[0-9]{10}$/)) valid = false;
    if (!validateField(persons, "Please select the number of persons")) valid = false;
    if (!validateField(date, "Please select a date")) valid = false;
    if (!validateField(time, "Please select a time")) valid = false;
    
    return valid;
};

document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const filter = urlParams.get('filter');

    if (filter) {
        // Assuming you have a function to filter menu items
        filterMenuItems(filter);
    }
});

function filterMenuItems(filter) {
    const menuItems = document.querySelectorAll('.menu-item'); // Adjust selector as needed

    menuItems.forEach(item => {
        if (item.dataset.category === filter) {
            item.style.display = 'block'; // Show matching items
        } else {
            item.style.display = 'none'; // Hide non-matching items
        }
    });
}

