document.addEventListener('DOMContentLoaded', () => {

    // Send Invite functionality
    document.getElementById('inviteUserBtn').addEventListener('click', () => {
        const inviteUserName = document.getElementById('inviteUserName').value.trim();
        const serverSelect = document.getElementById('serverSelect');
        const selectedOption = serverSelect.options[serverSelect.selectedIndex].text; // Get the selected option's text

        if (inviteUserName === '') {
            alert('Please enter a username to invite.');
            return;
        }

        // Extract the server ID from the selected option text
        const serverId = extractServerId(selectedOption);

        if (!serverId) {
            alert('Server ID could not be found.');
            return;
        }

        // Send invite request
        sendInvite(inviteUserName, serverId);
    });

    // Function to extract server ID from text like "MyServer (ID: 1)"
    function extractServerId(text) {
        console.log('Extracting from:', text); // Log the server text to verify the content
        const regex = /\(ID:\s*(\d+)\)/;  // Regular expression to capture the ID number
        const match = text.match(regex);
        if (match) {
            return match[1];  // Return the ID if matched
        } else {
            console.error('Server ID not found in text:', text);
            return null;  // Return null if not found
        }
    }

    function sendInvite(username, serverId) {
        // Example of sending invite data to the server using fetch
        fetch('./Server-Side-Scripts/sendInvite.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username: username, serverId: serverId })  // Include serverId in the request body
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(`Invitation sent to ${username}!`);
            } else {
                alert(`Error: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while sending the invite.');
        });
    }

    // Mail Visibility Toggle functionality
    const showMailsBtn = document.getElementById('showMailsBtn');
    const mailsList = document.getElementById('mailsList');
    const invitesList = document.getElementById('invite-container');

    // Initially hide the mails list
    mailsList.classList.add('hidden');

    // Toggle mails visibility
    showMailsBtn.addEventListener('click', () => {
        mailsList.classList.toggle('hidden');
    });

    let iterator = 0;

    // Fetch invites and populate the invites list
    function fetchInvites() {
        iterator = 0;
        console.log('Fetching invites...'); // Log message to confirm the function is being executed
        fetch('./Server-Side-Scripts/check-invites.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then(response => response.json())  // Parse JSON response
        .then(data => {
            console.log('Invites fetched:', data); // Log the response data
            if (data.success) {
                invitesList.innerHTML = '';  // Clear existing list
                if (data.invites.length === 0) {
                    invitesList.innerHTML = '<li>You have no invites.</li>';
                } else {
                    data.invites.forEach((invite) => {
                        const inviteItem = document.createElement('li');
                       
                        inviteItem.innerHTML = `${invite.sender} invited you to a server! <strong>Status: ${invite.status}</strong>`;

                        if (invite.status === 'pending') {
                            // Update the message count badge dynamically
                            iterator += 1;
                            updateMessageCount(iterator); 
                            inviteItem.innerHTML += ` 
                                <button class="acceptInvite" data-invite-id="${invite.id}">Accept</button>
                                <button class="declineInvite" data-invite-id="${invite.id}">Decline</button>
                            `;
                        }

                        if(invite.status == "pending"){
                            invitesList.appendChild(inviteItem);
                        } else {
                            if(invitesList.innerHTML === '') {
                                const noInvitesItem = document.createElement('li');
                                noInvitesItem.innerHTML = 'You have no invites.';
                                invitesList.appendChild(noInvitesItem);
                            }
                        }
                    });
                }
            } else {
                invitesList.innerHTML = `<li>${data.message}</li>`;
            }
        })
        .catch(error => {
            console.error('Error fetching invites:', error);
            invitesList.innerHTML = '<li>There was an error fetching your invites.</li>';
        });
    }

    // Call fetchInvites to load the invites when the page loads
    fetchInvites();

    // Handle Accept and Decline Invite actions
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('acceptInvite')) {
            const inviteId = e.target.getAttribute('data-invite-id');
            acceptInvite(inviteId);
        } else if (e.target.classList.contains('declineInvite')) {
            const inviteId = e.target.getAttribute('data-invite-id');
            declineInvite(inviteId);
        }
    });

    // Accept invite function (example)
    function acceptInvite(inviteId) {
        fetch('./Server-Side-Scripts/accept-invite.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inviteId: inviteId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                iterator -= 1;
                alert(`Invite with ID: ${inviteId} accepted`);
                fetchInvites();  // Refresh invites list after accepting
            } else {
                alert(`Error accepting invite: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error accepting invite:', error);
            alert('An error occurred while accepting the invite.');
        });
    }

    // Decline invite function (example)
    function declineInvite(inviteId) {
        fetch('./Server-Side-Scripts/decline-invite.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ inviteId: inviteId })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                iterator -= 1;
                alert(`Invite with ID: ${inviteId} declined`);
                fetchInvites();  // Refresh invites list after declining
            } else {
                alert(`Error declining invite: ${data.message}`);
            }
        })
        .catch(error => {
            console.error('Error declining invite:', error);
            alert('An error occurred while declining the invite.');
        });
    }

    function updateMessageCount(count) {
        const badge = document.getElementById('messageCountBadge');
        badge.textContent = count;
    }

    // Set interval to refresh the fetchInvites every 10 seconds
    setInterval(fetchInvites, 1000);  // Refresh invites every 1 second

});
