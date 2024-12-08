document.addEventListener('DOMContentLoaded', () => {
    const friendListItems = document.getElementById('friendListItems');
    const chatFriendName = document.getElementById('chatFriendName');
    const privateChatArea = document.getElementById('privateChatArea');
    const privateMessageInput = document.getElementById('privateMessageInput');
    const sendPrivateMessageBtn = document.getElementById('sendPrivateMessageBtn');

    let friends = [];

    // Function to get the value of a cookie by its name
    function getCookie(name) {
        let value = "; " + document.cookie;
        let parts = value.split("; " + name + "=");
        if (parts.length == 2) {
            let cookieValue = parts.pop().split(";").shift();
            return cookieValue;
        }
        return null;
    }

    // Function to load the list of friends
    function loadFriends() {
        const userId = getCookie('userId'); // Get the current userId from cookie

        fetch('./Server-Side-Scripts/get_friends.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: `userId=${userId}` // Send the userId to the server
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                friends = data.friends;

                // Exclude the logged-in user from the friend list (i.e., don't display yourself)
                const currentUser = data.currentUser;
                friends = friends.filter(friend => friend.username !== currentUser.username);

                displayFriends(friends);
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("An unexpected error occurred while loading friends.");
        });
    }

    // Function to display friends in the list
    function displayFriends(friends) {
        friendListItems.innerHTML = '';  // Clear existing list

        friends.forEach(friend => {
            const friendItem = document.createElement('li');
            friendItem.classList.add('friend-item');
            friendItem.dataset.username = friend.username;

            // Adding friend status indicator (Mocked as 'online' for now)
            friendItem.innerHTML = `
                <div class="friend-avatar"></div>
                <span class="friend-name">${friend.username}</span>
                <span class="friend-status online"></span> <!-- Status dot -->
            `;

            // Adding event listener for each friend to initiate a chat
            friendItem.addEventListener('click', () => {
                selectFriend(friend); // When a friend is clicked, select them for chat
            });

            friendListItems.appendChild(friendItem);
        });
    }

    // Function to select a friend to chat with
    function selectFriend(friend) {
        chatFriendName.textContent = friend.username;
        privateChatArea.innerHTML = ''; // Clear previous messages
        loadPrivateMessages(friend.username); // Load mock messages for now
    }

    // Mock private messages (for testing)
    function loadPrivateMessages(username) {
        // Example messages
        const messages = [
            { sender: username, text: 'Hello!' },
            { sender: 'me', text: 'Hi there!' },
        ];

        messages.forEach(message => {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('message', message.sender === 'me' ? 'sender' : 'receiver');
            messageDiv.textContent = message.text;
            privateChatArea.appendChild(messageDiv);
        });
    }

    // Send private message
    sendPrivateMessageBtn.addEventListener('click', () => {
        const messageText = privateMessageInput.value.trim();
        if (!messageText) return;

        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', 'sender');
        messageDiv.textContent = messageText;
        privateChatArea.appendChild(messageDiv);

        privateMessageInput.value = '';
        privateChatArea.scrollTop = privateChatArea.scrollHeight; // Scroll to the bottom
    });

    // Load the friends list when the page loads
    loadFriends();
});
