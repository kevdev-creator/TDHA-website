/* script.js */
// Store form data
let formData = {};

function nextStep(currentStep) {
    if (!validateStep(currentStep)) return; // Stop if invalid

    // Save data from current step
    saveData(currentStep);

    // Update UI
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep + 1}`).classList.add('active');
    updateProgress(currentStep + 1);

    if (currentStep === 2) showSummary();
}

function prevStep(currentStep) {
    document.getElementById(`step${currentStep}`).classList.remove('active');
    document.getElementById(`step${currentStep - 1}`).classList.add('active');
    updateProgress(currentStep - 1);
}

function updateProgress(step) {
    const progressBar = document.getElementById('progressBar');
    const percentage = (step / 3) * 100;
    progressBar.style.width = `${percentage}%`;
    progressBar.setAttribute('aria-valuenow', percentage);
}

function validateStep(step) {
    let isValid = true;
    const currentFieldset = document.getElementById(`step${step}`);
    const inputs = currentFieldset.querySelectorAll('input[required], select[required]');

    inputs.forEach(input => {
        const errorSpan = document.getElementById(`error-${input.id}`);
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('invalid');
            if (errorSpan) errorSpan.textContent = "This field is required.";
        } else {
            // Basic Email Regex for client-side check
            if (input.type === 'email' && !/\S+@\S+\.\S+/.test(input.value)) {
                isValid = false;
                input.classList.add('invalid');
                if (errorSpan) errorSpan.textContent = "Please enter a valid email.";
            } else {
                input.classList.remove('invalid');
                if (errorSpan) errorSpan.textContent = "";
            }
        }
    });

    return isValid;
}

function saveData(step) {
    const currentFieldset = document.getElementById(`step${step}`);
    const inputs = currentFieldset.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        formData[input.name] = escapeHtml(input.value); // Sanitize here
    });
}

function showSummary() {
    const summaryDiv = document.getElementById('summary');
    summaryDiv.innerHTML = `
        <p><strong>Name:</strong> ${formData.fullName}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Product:</strong> ${formData.product}</p>
        <p><strong>Notes:</strong> ${formData.notes || 'None'}</p>
    `;
}

// Security: Basic XSS Prevention (Sanitization)
function escapeHtml(text) {
    if (!text) return text;
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Handle Submit
document.getElementById('orderForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Check Honeypot (Bot protection)
    if (document.getElementById('honeypot').value !== "") {
        console.warn("Bot detected!");
        return;
    }

    alert("Order Submitted Securely! (In a real app, this sends data to the server)");
    // Here you would use fetch() to send 'formData' to your backend API
});