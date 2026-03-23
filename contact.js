const form = document.getElementById("contactForm");
const username = document.getElementById("name");
const email = document.getElementById("email");
const subject = document.getElementById("subject");
const message = document.getElementById("message");
const successMessage = document.getElementById("successMessage");

// Handle form submit
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

// Real-time validation
username.addEventListener("input", () => validateField(username, "Name is required"));
email.addEventListener("input", () => validateField(email, "Email is required", /^[^\s@]+@[^\s@]+\.[^\s@]+$/));
message.addEventListener("input", () => validateField(message, "Message is required"));
subject.addEventListener("input", () => validateField(subject, "subject is required"));



const setError = (element, msg) => {
    const errorDisplay = element.nextElementSibling;
    if (errorDisplay && errorDisplay.classList.contains("error")) {
        errorDisplay.innerText = msg;
    }
};

const setSuccess = (element) => {
    const errorDisplay = element.nextElementSibling;
    if (errorDisplay && errorDisplay.classList.contains("error")) {
        errorDisplay.innerText = "";
    }
};

const validateField = (element, msg, pattern = null) => {
    const value = element.value.trim();
    if (value === "") {
        setError(element, msg);
        return false;
    } else if (pattern && !pattern.test(value)) {
        setError(element, "Invalid input");
        return false;
    } else {
        setSuccess(element);
        return true;
    }
};

const validateInputs = () => {
    let valid = true;
    if (!validateField(username, "Name is required")) valid = false;
    if (!validateField(email, "Email is required", /^[^\s@]+@[^\s@]+\.[^\s@]+$/)) valid = false;
    if (!validateField(message, "Message is required")) valid = false;
    if (!validateField(subject, "Subject is required")) valid = false;

    return valid;
};

// If all inputs are valid, show success message
if (isValid) {
    document.getElementById('successMessage').style.display = 'block';
    
    // Optional: clear form
    document.querySelector('form').reset();
}

