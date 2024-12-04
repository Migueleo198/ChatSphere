
 // Function to get the value of a cookie by its name
 function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
    return null;
}

// Get the 'userName' cookie and display it in the <h1>
let username = getCookie('userName');
console.log('userName cookie:', username);  // Log the cookie value for debugging

if (username) {
    document.getElementById('username').textContent = username;
} else {
    document.getElementById('username').textContent = 'Guest';  // Default if no username cookie found
}

// WebSocket client setup
const socket = new WebSocket('ws://localhost:8080/chat');

socket.onopen = function () {
    console.log("Connected to WebSocket server!");
};

// Handle incoming messages from the server
socket.onmessage = function (event) {
    const message = JSON.parse(event.data);
    console.log("Received message:", message);
    displayMessage(message);
};

// Handle WebSocket error
socket.onerror = function (error) {
    console.error('WebSocket Error:', error);
};

// Send message function
document.getElementById("sendMessageBtn").addEventListener("click", sendMessage);

function sendMessage() {
    const inputField = document.getElementById("messageInput");
    const messageText = inputField.value.trim();

    if (messageText !== "") {
        const messageObj = {
            username: username,
            message: messageText
        };
        socket.send(JSON.stringify(messageObj));
        inputField.value = "";  // Clear the input field
    }
}

// Display received messages in the chat area
function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    const userElement = document.createElement("strong");
    userElement.textContent = message.username + ": ";

    const textElement = document.createElement("p");
    textElement.classList.add("text");
    textElement.textContent = message.message;

    messageElement.appendChild(userElement);
    messageElement.appendChild(textElement);

    const chatArea = document.getElementById("chat-area"); // Correct ID selection
    chatArea.appendChild(messageElement);

    chatArea.scrollTop = chatArea.scrollHeight; // Auto-scroll to bottom
}
