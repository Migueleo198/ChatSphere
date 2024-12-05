const form = document.getElementById('recoverForm');

form.addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent default form submission

    // Collect the form data
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });

    console.log(formObject); // Log the form data as an object

    // Perform the fetch request
    fetch('./Server-Side-Scripts/CheckRecoveryToken.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json' // Set the request header to JSON
        },
        body: JSON.stringify(formObject) // Convert the form data to JSON
    })
    .then(response => {
        if (!response.ok) {
            console.error(`HTTP error! Status: ${response.status}`);
            throw new Error('Network response was not ok');
        }

        return response.json(); // Parse the response as JSON
    })
    .then(data => {
        console.log('Response data:', data); // Log the response from PHP

        // Handle errors from the server response
        if (data.error) {
            alert(data.error); // Show error from PHP
        } else {
            window.location.href = data.url;
            alert(data.message); // Success message
        }
    })
    .catch(error => {
        // Handle any errors during fetch or JSON parsing
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    });
});
