import { displayUserProfile } from './profile.js';  // Ensure this path is correct

export function createMenuLog() {
    const menuHTML = `
        <div id="userTab" style="cursor: pointer;">
            <div id="userMenu" style="display: none; border: 1px solid #ccc; padding: 10px; position: absolute; background-color: white;">
                <form action="./Server-Side-Scripts/logout.php" method="POST" id="formLogOut"></form>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <a href="#" id="profileLink" style="text-decoration: none; color: black;"><li>Profile</li></a>
                    <li style="cursor: pointer;">Settings</li>
                    <li id="desconect" style="cursor: pointer; color: red;">Logout</li>
                </ul>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', menuHTML);

    // Select elements
    const userTab = document.querySelector('#userTab');
    const userMenu = document.querySelector('#userMenu');
    const buttonDesc = document.querySelector('#desconect');
    const formDesc = document.querySelector('#formLogOut');
    const profileLink = document.querySelector('#profileLink');

    // Toggle visibility of the user menu
    userTab.addEventListener('click', function (event) {
        event.stopPropagation();  // Prevent clicks from closing the menu immediately
        userMenu.style.display = (userMenu.style.display === 'block') ? 'none' : 'block';
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function(event) {
        if (!userTab.contains(event.target)) {
            userMenu.style.display = 'none';
        }
    });

    // Handle logout button click
    buttonDesc.addEventListener('click', function () {
        formDesc.submit();  // This submits the logout form
    });

    // Handle 'Perfil' link click
    profileLink.addEventListener('click', function (event) {
        event.preventDefault();  // Prevent default link behavior
        displayUserProfile();    // Call the imported function to handle profile display
    });
}
