document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed!");

    // Function to get the value of a cookie by its name
    function getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
        return null;
    }

    // Get the 'userName' cookie and display it in the <h3> inside the header
    let username = getCookie('userName');
    console.log('userName cookie:', username);

    if (username) {
        document.getElementById('username').textContent = username;
    } else {
        document.getElementById('username').textContent = 'Guest';  // Default if no username cookie found
    }

    // Fetch and display existing messages from the database
    function loadMessages() {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", "./Server-Side-Scripts/fetchMessages.php", true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                try {
                    const messages = JSON.parse(xhr.responseText);
                    messages.forEach(function (message) {
                        displayMessage(message);
                    });
                } catch (error) {
                    console.error("Error parsing response:", error);
                }
            } else if (xhr.readyState === 4) {
                console.error("Error fetching messages. Status:", xhr.status);
            }
        };
        xhr.send();
    }

    // Function to send a message to the server
    function sendMessage() {
        const inputField = document.getElementById("messageInput");
        const messageText = inputField.value.trim();

        if (messageText !== "") {
            const messageObj = {
                username: username,
                message: messageText
            };
            console.log("Message text:", messageText);

            const xhr = new XMLHttpRequest();
            xhr.open("POST", "./Server-Side-Scripts/sendMessage.php", true);
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    console.log('Message sent successfully');
                    inputField.value = "";  // Clear the input field after sending
                    loadMessages();  // Reload messages after sending
                } else if (xhr.readyState === 4) {
                    console.error("Error sending message. Status:", xhr.status);
                }
            };
            xhr.send(`username=${encodeURIComponent(messageObj.username)}&message=${encodeURIComponent(messageObj.message)}`);
        } else {
            alert("Please enter a message before sending.");
        }
    }

    // Attach event listener to the send message button
    document.getElementById("sendMessageBtn").addEventListener("click", sendMessage);

    // Display received message in the chat area
    function displayMessage(messageData) {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        const userElement = document.createElement("strong");
        userElement.textContent = messageData.username + ": ";

        const textElement = document.createElement("p");
        textElement.classList.add("text");
        textElement.textContent = messageData.message;

        const timeElement = document.createElement("span");
        timeElement.classList.add("time");
        timeElement.textContent = messageData.timestamp;  // Display the timestamp from the database

        messageElement.appendChild(userElement);
        messageElement.appendChild(textElement);
        messageElement.appendChild(timeElement);

        const chatArea = document.getElementById("chat-area");
        chatArea.appendChild(messageElement);

        // Auto-scroll to the bottom of the chat area
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    // Load existing messages when the page is loaded
    loadMessages();

    setInterval(loadMessages, 1000);  // Fetch new messages every 1 second
});
