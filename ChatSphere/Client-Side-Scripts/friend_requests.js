function sendFriendRequest() {
    const username = document.getElementById("searchFriends").value;

    if (!username) {
        alert("Username is required!");
        return;
    }

    fetch('./Server-Side-Scripts/friendship_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `searchFriends=${encodeURIComponent(username)}`
    })
    .then(response => response.text())
    .then(result => {
       alert(result); // Log the server's response
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error sending friend request.");
    });
}


window.onload = function () {
    console.log(document.cookie)
    document.getElementById('searchFriendsBtn').addEventListener('click', () => {
        sendFriendRequest();
    });
};