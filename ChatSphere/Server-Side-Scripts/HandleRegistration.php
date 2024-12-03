<?php
// handleRegistration.php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $_POST['user'];
    $email = $_POST['email'];
    $name = $_POST['name'];
    $password = $_POST['pass'];
    $passwordConfirm = $_POST['passConfirm'];

    // Check if passwords match
    if ($password !== $passwordConfirm) {
        die("Passwords do not match.");
    }

    // Hash the password
    $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

    // Database connection details
    $servername = "localhost";
    $usernameDB = "root";  // Your database username
    $passwordDB = "";      // Your database password
    $dbname = "your_database_name"; // Your database name

    // Create a connection
    $conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // SQL query to insert the new user
    $sql = "INSERT INTO user (username, passwd, email, name, user_type, status) 
            VALUES ('$username', '$hashedPassword', '$email', '$name', 0, 'active')";

    if ($conn->query($sql) === TRUE) {
        echo "New user created successfully!";
    } else {
        echo "Error: " . $sql . "<br>" . $conn->error;
    }

    // Close the connection
    $conn->close();
}
?>
