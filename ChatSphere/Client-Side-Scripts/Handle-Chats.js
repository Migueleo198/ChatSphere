

// Function to initialize chat by calling PHP script (AJAX request)
window.onload = function() {
    // Create a new AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open("GET", "./Server-Side-Scripts/Handle-Chats.php", true);  // Make the request to the PHP script
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            console.log("Chat initialized.");
            // You could also process the response here if needed
        }
    };
    xhr.send();  // Send the request
};
