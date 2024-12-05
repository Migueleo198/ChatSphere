// Detect browser language
const userLang = navigator.language || navigator.userLanguage;

// Check if the language preference is already stored in local storage
let preferredLang = localStorage.getItem('preferredLanguage');

// If there's no stored preference, use the browser's default language
if (!preferredLang) {
    preferredLang = userLang.startsWith('es') ? 'es' : 'en'; // Default to Spanish or English
}

// Set the document's language based on the preference
document.documentElement.lang = preferredLang;

// Save the user's language preference to local storage
localStorage.setItem('preferredLanguage', preferredLang);

// Function to change the language
function changeLanguage(lang) {
    document.documentElement.lang = lang; // Change the lang attribute of the HTML
    localStorage.setItem('preferredLanguage', lang); // Store the new preference
    // Optionally, you can reload the page or dynamically change content here
    location.reload(); // This is optional; it will reload the page to apply language changes
}

// Example of changing language to Spanish
// changeLanguage('es');
