import { validateForm } from './validate.js'; // Import the validation function

// Function to handle form submission via fetch
function fetchForm(URL, FORM_SELECTOR) {
    const form = document.querySelector(FORM_SELECTOR);
    
    if (!form) {
        console.error(`Form not found: ${FORM_SELECTOR}`);
        return;
    }

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        if (validateForm(form)) { // Check if form validation passes
            const formData = new FormData(form);
            
            fetch(URL, {
                method: 'POST',
                body: formData,
            })
            .then(response => {
                if (!response.ok) { // Handle HTTP errors
                    throw new Error(`Network response was not ok: ${response.statusText}`);
                }
                return response.json(); // Parse JSON response
            })
            .then(result => {
                if (result.status) {
                    alert(result.message); // Display success message
                    form.reset(); // Reset the form
                    if (result.url) {
                        window.location.href = result.url; // Redirect if URL provided
                    }
                } else {
                    alert('Error: ' + (result.error || 'Unknown error occurred.'));
                }
            })
            .catch(error => {
                alert('Connection error: ' + error.message);
                console.error('Fetch error:', error);
            });
        } else {
            alert('Form validation failed. Please check the fields.');
        }
    });
}

// Validate login form submission
export function validateLogin() {
    const LOGIN_URL = './Server-Side-Scripts/ValidateLogin.php';
    const LOGIN_FORM_SELECTOR = '#loginForm'; // Updated selector for clarity
    fetchForm(LOGIN_URL, LOGIN_FORM_SELECTOR);
}

// Validate user form submission
export function validateUserForm() {
    const USER_URL = './asset/verificationUser.php';
    const USER_FORM_SELECTOR = '#userForm'; // Updated selector for clarity
    loadUserTypes(); // Load user types for dropdown
    fetchForm(USER_URL, USER_FORM_SELECTOR);
}

// Load user types for a select dropdown
function loadUserTypes() {
    const USER_TYPE_URL = './asset/selectUserType.php';
    const userTypeSelect = document.querySelector('#userType');

    if (!userTypeSelect) {
        console.error("User type select element not found.");
        return;
    }

    fetch(USER_TYPE_URL)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(result => {
            if (result.error) {
                console.error("Error:", result.error);
                return;
            }

            // Populate dropdown with user types
            result.forEach(type => {
                const option = document.createElement('option');
                option.value = type.id_type;
                option.textContent = type.name;

                if (type.name.toLowerCase() === 'standard') {
                    option.setAttribute('selected', ''); // Default to 'standard'
                }

                userTypeSelect.append(option);
            });
        })
        .catch(error => {
            console.error("There was a problem with the request:", error);
        });
}
