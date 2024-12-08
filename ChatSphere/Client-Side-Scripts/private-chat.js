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
        document.querySelector('#chatFriendName').textContent = 'Select a Friend';
    } else {
        document.querySelector('#chatFriendName').textContent = 'Guest'; // Default if no username cookie found
    }

    // Select friend from the friends list
    const friendListItems = document.querySelectorAll('.friend-item');

    friendListItems.forEach(friend => {
        friend.addEventListener('click', function () {
            const friendUsername = friend.getAttribute('data-username');
            document.querySelector('#chatFriendName').textContent = friend.querySelector('.friend-name').textContent;
            loadMessages(friendUsername);
        });
    });

    // Function to send a private message
    async function sendMessage() {
        const inputField = document.querySelector("#privateMessageInput");
        const messageText = inputField.value.trim();
        const recipientUsername = document.querySelector("#chatFriendName").textContent;

        if (messageText !== "" && recipientUsername !== 'Select a Friend') {
            const messageObj = {
                username: username,
                message: messageText,
                recipient: recipientUsername  // Include the recipient username
            };
            console.log("Message text:", messageText);

            try {
                const response = await fetch("./Server-Side-Scripts/sendPrivateMessage.php", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                    body: `username=${encodeURIComponent(messageObj.username)}&message=${encodeURIComponent(messageObj.message)}&recipient=${encodeURIComponent(messageObj.recipient)}`
                });

                if (response.ok) {
                    console.log('Message sent successfully');
                    inputField.value = "";  // Clear the input field after sending
                    loadMessages(recipientUsername);  // Reload messages for the selected recipient
                } else {
                    console.error("Error sending message. Status:", response.status);
                }
            } catch (error) {
                console.error("Error sending message:", error);
            }
        } else {
            alert("Please enter a message before sending and select a friend.");
        }
    }

    // Attach event listener to the send message button
    document.querySelector("#sendPrivateMessageBtn").addEventListener("click", sendMessage);

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

        const chatArea = document.querySelector("#privateChatArea");
        chatArea.appendChild(messageElement);

        // Auto-scroll to the bottom of the chat area, if the user is at the bottom
        const isAtBottom = chatArea.scrollHeight - chatArea.scrollTop === chatArea.clientHeight;
        if (isAtBottom) {
            chatArea.scrollTop = chatArea.scrollHeight;
        }
    }

    // Fetch and display messages for the selected private chat
    async function loadMessages(recipientUsername) {
        try {
            const response = await fetch(`./Server-Side-Scripts/fetch-PrivateMessages.php?recipient=${recipientUsername}`);
            const messages = await response.json();

            const messageContainer = document.querySelector("#privateChatArea");
            messageContainer.innerHTML = "";  // Clear current chat messages

            if (Array.isArray(messages)) {
                messages.forEach(function (message) {
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

    // Automatically reload messages every second for the private chat
    setInterval(function () {
        const recipientUsername = document.querySelector('#chatFriendName').textContent;
        if (recipientUsername !== 'Select a Friend') {
            loadMessages(recipientUsername);  // Load messages for the selected recipient
        }
    }, 1000); // Update interval in milliseconds (1000 ms = 1 second)

    // Initialize friend list and click events
    const friendListItemsElement = document.querySelector("#friendListItems");

    async function loadFriends() {
        try {
            const response = await fetch('./Server-Side-Scripts/fetchFriends.php?username=' + encodeURIComponent(username));
            const friends = await response.json();

            friendListItemsElement.innerHTML = ''; // Clear the friend list

            friends.forEach(friend => {
                const friendItem = document.createElement("li");
                friendItem.classList.add("friend-item");
                friendItem.setAttribute("data-username", friend.username);

                const friendAvatar = document.createElement("div");
                friendAvatar.classList.add("friend-avatar");

                const friendName = document.createElement("span");
                friendName.classList.add("friend-name");
                friendName.textContent = friend.name;

                friendItem.appendChild(friendAvatar);
                friendItem.appendChild(friendName);
                friendListItemsElement.appendChild(friendItem);

                // Add click event for selecting a friend
                friendItem.addEventListener('click', function () {
                    document.querySelector('#chatFriendName').textContent = friend.name;
                    loadMessages(friend.username);
                });
            });
        } catch (error) {
            console.error("Error loading friends:", error);
        }
    }

    // Initial load of friends
    loadFriends();
});
