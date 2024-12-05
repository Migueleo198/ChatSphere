// Wait for the DOM to fully load before initializing the WebSocket connection
document.addEventListener("DOMContentLoaded", function () {
    console.log("Chat client loaded!");

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

    // WebSocket client setup to connect to the server
    const socket = new WebSocket('ws://192.168.0.5:8080/chat');  // Replace with your WebSocket server's IP or localhost

    // Handle WebSocket connection opened
    socket.onopen = function () {
        console.log("Connected to WebSocket server!");
    };

    // Handle incoming messages from the server
    socket.onmessage = function (event) {
        console.log('Message received:', event.data);
        try {
            const message = JSON.parse(event.data);
            displayMessage(message);
        } catch (e) {
            console.error('Error parsing message:', e);
        }
    };

    // Handle WebSocket errors
    socket.onerror = function (error) {
        console.log('WebSocket Error:', error);
    };

    // Handle WebSocket connection close
    socket.onclose = function () {
        console.log('WebSocket connection closed');
    };

    // Function to send a message to the WebSocket server
    function sendMessage() {
        const inputField = document.getElementById("messageInput");
        const messageText = inputField.value.trim();

        if (messageText !== "") {
            const messageObj = {
                username: username, // Use the username stored in the cookie
                message: messageText
            };
            console.log("Message text:", messageText);

            // Send the message to the WebSocket server as a JSON object
            socket.send(JSON.stringify(messageObj));

            // Clear the input field after sending
            inputField.value = "";
        } else {
            alert("Please enter a message before sending.");
        }
    }

    // Attach event listener to the send message button
    document.getElementById("sendMessageBtn").addEventListener("click", sendMessage);

    // Function to display received message in the chat area
    function displayMessage(messageData) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        const userElement = document.createElement("strong");
        userElement.textContent = messageData.username + ": ";

        const textElement = document.createElement("p");
        textElement.classList.add("text");
        textElement.textContent = messageData.message;

        messageElement.appendChild(userElement);
        messageElement.appendChild(textElement);

        const chatArea = document.getElementById("chat-area");
        chatArea.appendChild(messageElement);

        // Auto-scroll to the bottom of the chat area
        chatArea.scrollTop = chatArea.scrollHeight;
    }
});
