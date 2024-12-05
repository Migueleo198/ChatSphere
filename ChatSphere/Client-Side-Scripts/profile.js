// Function to get a cookie value by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        return parts.pop().split(';').shift();
    }
    return null;
}

export function displayUserProfile() {
    // Function to create the modal with user information
    const createModal = () => {
        const userId = getCookie('userName');



        // Ensure the user is logged in
        if (!userId) {
            alert("SESSION NOT VALID OR EXPIRED, REDIRECTING TO LOGIN...");
            window.location.href = './login.html';
            return;
        }



        // Create a background overlay for the modal
        const overlay = document.createElement('div');
        overlay.id = 'modal-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overlay.style.zIndex = '999';  // Ensure it's above the page content
        overlay.style.display = 'flex';
        overlay.style.justifyContent = 'center';
        overlay.style.alignItems = 'center';


        // Create modal content container
        const modalContent = document.createElement('div');
        modalContent.style.padding = '20px';
        modalContent.style.border = '1px solid #ccc';
        modalContent.style.borderRadius = '10px';
        modalContent.style.backgroundColor = '#fff';
        modalContent.style.maxWidth = '400px';
        modalContent.style.textAlign = 'center';
        modalContent.style.transform = 'scale(0.7)'; // Start scaled down
        modalContent.style.opacity = '0'; // Start with opacity 0
        modalContent.style.backgroundColor = '#1e1e2f';

        // Add CSS transition for animation
        modalContent.style.transition = 'transform 0.25s ease, opacity 0.25s ease';

        // Create elements for user information
        const title = document.createElement('h2');
        title.textContent = 'User Profile';

        const userIdElement = document.createElement('p');
        userIdElement.textContent = `User ID: ${userId}`;



        // Create a "Return" button with conditional action
        const returnButton = document.createElement('button');
        returnButton.textContent = 'Volver';
        returnButton.style.marginTop = '20px';
        returnButton.style.padding = '10px 20px';
        returnButton.style.backgroundColor = '#007BFF';
        returnButton.style.color = '#fff';
        returnButton.style.border = 'none';
        returnButton.style.borderRadius = '5px';
        returnButton.style.cursor = 'pointer';

        // Add event listener to the button
        returnButton.addEventListener('click', () => {

            window.location.href = './chat.html';
            
        });

        // Append elements to the modal content
        modalContent.appendChild(title);
        modalContent.appendChild(userIdElement);
        modalContent.appendChild(returnButton);

        // Append modal content to the overlay
        overlay.appendChild(modalContent);

        // Append the overlay to the body
        document.body.appendChild(overlay);

        // Trigger the animation by changing the modal's transform and opacity
        setTimeout(() => {
            modalContent.style.transform = 'scale(1)';
            modalContent.style.opacity = '1';
        }, 10); // Slight delay to ensure the transition happens

        // Close the modal if user clicks outside of the modal content
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    };

    // Display the modal when the "Perfil" link is clicked
    const profileLink = document.querySelector('#profileLink'); // Ensure this element exists in the DOM

    if (profileLink) {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent default link behavior
            createModal(); // Call the function to display the modal
        });
    }
}

document.addEventListener('DOMContentLoaded', displayUserProfile);
