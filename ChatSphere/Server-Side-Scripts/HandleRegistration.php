<?php
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
    $usernameDB = "root";
    $passwordDB = "Miguel4.0"; // Your correct database password
    $dbname = "chatsphere"; // Ensure this matches your database name

    // Create a connection using mysqli
    $conn = new mysqli($servername, $usernameDB, $passwordDB, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO user (username, passwd, email, name, user_type, status) VALUES (?, ?, ?, ?, 0, 'active')");
    $stmt->bind_param("ssss", $username, $hashedPassword, $email, $name);

    // Execute the statement
    if ($stmt->execute()) {
        header("Location: ../login.html");
        echo "New user created successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close the connection
    $stmt->close();
    $conn->close();
}
?>
