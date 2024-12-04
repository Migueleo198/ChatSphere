// Initialize WebSocket connection
const socket = new WebSocket('ws://localhost:8080/chat');

// On WebSocket connection open
socket.onopen = function() {
    console.log("Connected to WebSocket server!");
};

// On receiving a message from the server
socket.onmessage = function(event) {
    const message = event.data;
    displayMessage(message);
};

// Function to send message to the server
document.getElementById("sendMessageBtn").addEventListener("click", sendMessage);

function sendMessage() {
    const inputField = document.getElementById("messageInput");
    const messageText = inputField.value.trim();

    if (messageText !== "") {
        // Send the message to the WebSocket server
        socket.send(messageText);

        // Clear the input field
        inputField.value = "";
    }
}

// Function to display the message in the chat area
function displayMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    
    const textElement = document.createElement("p");
    textElement.classList.add("text");
    textElement.textContent = message;
    
    messageElement.appendChild(textElement);

    const chatArea = document.getElementById("chat-area");
    chatArea.appendChild(messageElement);
    
    // Scroll to the bottom of the chat area
    chatArea.scrollTop = chatArea.scrollHeight;
}
