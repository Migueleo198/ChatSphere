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

    async function sendMessage() {
        const inputField = document.getElementById("messageInput");
        const messageText = inputField.value.trim();
        const serverId = document.getElementById("serverSelect").value;  // Get the selected server ID

        if (messageText !== "" && serverId) {
            const messageObj = {
                username: username,
                message: messageText,
                server_id: serverId  // Include the server_id in the request
            };
            console.log("Message text:", messageText);

            try {
                const response = await fetch("./Server-Side-Scripts/sendMessage.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `username=${encodeURIComponent(messageObj.username)}&message=${encodeURIComponent(messageObj.message)}&server_id=${encodeURIComponent(messageObj.server_id)}`
                });

                if (response.ok) {
                    console.log('Message sent successfully');
                    inputField.value = "";  // Clear the input field after sending
                    loadMessages(serverId);  // Reload messages for the selected server
                } else {
                    console.error("Error sending message. Status:", response.status);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        } else {
            alert("Please enter a message before sending and select a server.");
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

        // Auto-scroll to the bottom of the chat area, if the user is at the bottom
        const isAtBottom = chatArea.scrollHeight - chatArea.scrollTop === chatArea.clientHeight;
        if (isAtBottom) {
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    // Show the modal for creating a server
    document.getElementById('createServerBtn').addEventListener('click', function () {
        document.getElementById('createServerModal').style.display = 'block';
    });

    // Cancel server creation
    document.getElementById('cancelCreateServerBtn').addEventListener('click', function () {
        document.getElementById('createServerModal').style.display = 'none';
    });

    // Handle server creation
    document.getElementById('submitCreateServerBtn').addEventListener('click', function () {
        const newServerName = document.getElementById('newServerName').value.trim();
        if (newServerName !== "") {
            createServer(newServerName);
        } else {
            alert("Please enter a valid server name.");
        }
    });

    async function createServer(serverName) {
        try {
            const response = await fetch("./Server-Side-Scripts/createServer.php", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `server_name=${encodeURIComponent(serverName)}&owner_name=${encodeURIComponent(username)}`
            });

            const result = await response.json();

            if (result.success) {
                alert("Server created successfully!");
                loadServers(username); // Reload servers
                document.getElementById('createServerModal').style.display = 'none';
            } else {
                alert("Failed to create server: " + result.error);
            }
        } catch (error) {
            console.error("Error creating server:", error);
        }
    }

    async function loadServers(username) {
        try {
            const response = await fetch(`./Server-Side-Scripts/fetch-Servers.php?username=${encodeURIComponent(username)}`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch servers. Status: ${response.status}`);
            }
    
            const servers = await response.json();
    
            const serverSelect = document.getElementById("serverSelect");
            serverSelect.innerHTML = ""; // Clear current options
    
            if (Array.isArray(servers) && servers.length > 0) {
                servers.forEach(function (server) {
                    const option = document.createElement("option");
                    option.value = server.serverId;  // serverId from the backend
                    option.textContent = `${server.serverName} (ID: ${server.serverId})`;  // Show server name with server ID
                    serverSelect.appendChild(option);
                });
            } else {
                const option = document.createElement("option");
                option.textContent = "No servers found.";
                serverSelect.appendChild(option);
            }
            
        } catch (error) {
            console.error("Error fetching servers:", error);
        }
    }

    // Fetch and display messages for the selected server
    let selectedServerId = null;  // Variable to store the selected server ID

    async function loadMessages(serverId) {
        try {
            const response = await fetch(`./Server-Side-Scripts/fetch-Messages.php?server_id=${serverId}`);
            const messages = await response.json();
    
            // Debug: log the messages to verify content
            console.log(messages);  
    
            const messageContainer = document.getElementById("chat-area");
            messageContainer.innerHTML = "";
    
            if (Array.isArray(messages)) {
                messages.forEach(function (message) {
                    // Ensure you reference the correct property names
                    const messageDiv = document.createElement("div");
                    messageDiv.classList.add("message");
                    messageDiv.innerHTML = `<strong>${message.username}:</strong> ${message.message}<br><small>${message.timestamp}</small>`;
                    messageContainer.appendChild(messageDiv);
                });
            } else {
                console.error("Invalid data structure:", messages);
            }
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    }

    // Event listener for server selection
    document.getElementById("serverSelect").addEventListener("change", function () {
        selectedServerId = this.value;  // Update selected server ID
        if (selectedServerId) {
            loadMessages(selectedServerId); // Load messages for the selected server
        }
    });

    // Initial server load
    loadServers(username);

    // Automatically reload messages every second
    setInterval(function () {
        const selectedServerId = document.getElementById('serverSelect').value;  // Get the selected server ID
        if (selectedServerId) {
            loadMessages(selectedServerId);  // Load messages for the selected server
        }
    }, 1000); // Update interval in milliseconds (1000 ms = 1 second)

    // Load messages immediately when the page loads if a server is already selected
    const initialServerId = document.getElementById('serverSelect').value;
    if (initialServerId) {
        loadMessages(initialServerId);
    }

    document.addEventListener("keydown", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();  // Prevent form submission
            sendMessage();  // Send the message
        }
    });

    document.getElementById('showMailsBtn').addEventListener('click', () => {
        const mailsList = document.getElementById('mailsList');
        mailsList.classList.toggle('show'); // Toggles the display of mails
    });
    

});
