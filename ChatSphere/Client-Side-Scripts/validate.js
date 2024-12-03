// Regular expressions for validation
const REGEX = {
    USER: /^[a-zA-Z0-9]+$/, // Allows letters and numbers only
    NAME: /^[a-zA-ZÀ-ÿ\s]{1,40}$/, // Allows letters, spaces, and accents
    PASSWORD: /^.{3,50}$/, // Between 3 and 50 characters
    EMAIL: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, // Basic email pattern
};

// Error messages for validation
const ERROR_MESSAGES = {
    USER_ERROR: 'Invalid username. Only letters and numbers are allowed.',
    NAME_ERROR: 'Invalid name. Only letters and spaces are allowed.',
    EMAIL_ERROR: 'Invalid email address.',
    PASSWORD_ERROR: 'Password must be between 3 and 50 characters.',
    CONFIRM_PASSWORD_ERROR: 'Passwords do not match.',
};

// Function to validate a single input field
function validateInput(input, regex, errorMessage) {
    const value = input.value.trim();
    if (value === '') {
        return `The field "${input.name}" is required.`; // Field is required
    } else if (!regex.test(value)) {
        return errorMessage; // Regex validation failed
    }
    return ''; // No errors
}

// Function to check if the passwords match
function validatePasswords(password, confirmPassword) {
    if (password !== confirmPassword) {
        return ERROR_MESSAGES.CONFIRM_PASSWORD_ERROR; // Passwords do not match
    }
    return ''; // No error
}

// Function to select validation based on input type
function validateField(input, inputName) {
    switch (inputName) {
        case 'user':
            return validateInput(input, REGEX.USER, ERROR_MESSAGES.USER_ERROR);
        case 'name':
            return validateInput(input, REGEX.NAME, ERROR_MESSAGES.NAME_ERROR);
        case 'email':
            return validateInput(input, REGEX.EMAIL, ERROR_MESSAGES.EMAIL_ERROR);
        case 'pass':
            return validateInput(input, REGEX.PASSWORD, ERROR_MESSAGES.PASSWORD_ERROR);
        case 'passConfirm':
            const password = document.getElementById('pass').value;
            return validatePasswords(password, input.value);
        default:
            return ''; // No validation for unknown fields
    }
}

// Function to validate the entire form
export function validateForm(form) {
    let isValid = true;
    let errorMessages = '';

    const inputs = form.querySelectorAll('input'); // Select all input fields in the form
    inputs.forEach(input => {
        let inputName = input.name;
        let messageError = validateField(input, inputName);

        if (messageError) {
            errorMessages += messageError + '\n'; // Accumulate error messages
            isValid = false;
        }
    });

    if (!isValid) {
        alert('Please correct the following errors:\n\n' + errorMessages); // Display all errors
    }

    return isValid; // Return validation status
}
