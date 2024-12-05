// Function to get cookie value by name
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to set a cookie
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Check for language preference cookie
let preferredLang = getCookie('preferredLanguage');

// If no cookie, use the browser's language or default to English
if (!preferredLang) {
    preferredLang = navigator.language.startsWith('es') ? 'es' : 'en';
    setCookie('preferredLanguage', preferredLang, 30); // Set cookie for 30 days
}

// Set the document's language attribute
document.documentElement.lang = preferredLang;

// Function to change language
function changeLanguage(lang) {
    document.documentElement.lang = lang; // Update language attribute
    setCookie('preferredLanguage', lang, 30); // Save the new language in a cookie
    location.reload(); // Optional: Reload to apply the change
}
