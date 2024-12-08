// Function to get the value of a cookie by its name
function getCookie(name) {
    let value = "; " + document.cookie;
    let parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
    return null;
}

function loadFriendRequests(userId) {
    const friendRequestList = document.getElementById('friendRequestList');
    friendRequestList.innerHTML = ""; // Clear the current friend requests

    const requestData = new URLSearchParams();
    requestData.append("userId", userId); // Add the user ID to the POST body

    fetch('./Server-Side-Scripts/load_friend_requests.php', {
        method: 'POST', // Sending POST request to fetch friend requests
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestData // Include the data in the request body
    })
    .then(response => {
        if (!response.ok) {
            alert("Error loading friend requests");
            return response.json(); // Parse the response as JSON
        }
        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        if (data.status === "success") {
            // Display each friend request
            data.requests.forEach(request => {
                const requestCard = document.createElement('div');
                requestCard.classList.add('friend-request-card');
                requestCard.innerHTML = `
                    <h4>${request.senderUsername}</h4> <!-- Corrected key -->
                    <p>Sent on: ${request.requested_at}</p>
                    <button onclick="acceptFriendRequest(${request.sender_id}, ${userId})">Accept</button>
                    <button onclick="rejectFriendRequest(${request.sender_id}, ${userId})">Reject</button>
                `;
                friendRequestList.appendChild(requestCard);
            });
        } else {
            alert(data.message); // Show error message
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
    });
}


// Function to accept a friend request
function acceptFriendRequest(senderId, receiverId) {
    const requestData = new URLSearchParams();
    requestData.append("senderId", senderId);
    requestData.append("receiverId", receiverId);

    fetch('./Server-Side-Scripts/accept-friend-request.php', {
        method: 'POST', // Sending POST request to accept the friend request
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestData // Include the data in the request body
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Friend request accepted!");
            loadFriendRequests(receiverId); // Reload friend requests
        } else {
            alert(data.message); // Show error message
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
    });
}

// Function to reject a friend request
function rejectFriendRequest(senderId, receiverId) {
    const requestData = new URLSearchParams();
    requestData.append("senderId", senderId);
    requestData.append("receiverId", receiverId);

    fetch('./Server-Side-Scripts/reject_friend_request.php', {
        method: 'POST', // Sending POST request to reject the friend request
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: requestData // Include the data in the request body
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            alert("Friend request rejected.");
            loadFriendRequests(receiverId); // Reload friend requests
        } else {
            alert(data.message); // Show error message
        }
    })
    .catch(error => {
        console.error("Error:", error);
        alert("An unexpected error occurred.");
    });
}

// Toggle mailbox visibility and load friend requests
document.getElementById('toggleMailboxBtn').addEventListener('click', () => {
    const mailbox = document.getElementById('friendMailbox');
    if (mailbox.style.display === 'none' || mailbox.style.display === '') {
        mailbox.style.display = 'block';
        const currentUserId = getCookie('userId');  // Get the current user ID from cookie
        loadFriendRequests(currentUserId); // Load the friend requests
    } else {
        mailbox.style.display = 'none';
    }
});

    

