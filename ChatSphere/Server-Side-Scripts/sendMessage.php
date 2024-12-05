<?php
// Database connection
$host = '26.154.96.167';  // Database host
$dbname = 'chatsphere';  // Database name
$username = 'root';    // Database username
$password = 'Miguel4.0';        // Database password

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user = $_POST['username'];  // User's username
    $message = $_POST['message'];  // Message text

    if (empty($user) || empty($message)) {
        echo json_encode(["error" => "Username or message cannot be empty"]);
        exit;
    }

    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Insert message into the database with prepared statement
        $stmt = $pdo->prepare("INSERT INTO messages (username, message, timestamp) VALUES (:username, :message, NOW())");
        $stmt->bindParam(':username', $user);
        $stmt->bindParam(':message', $message);
        $stmt->execute();

        // Return success response
        echo json_encode(["success" => "Message sent successfully!"]);
    } catch (PDOException $e) {
        // Return error message
        echo json_encode(["error" => "Error: " . $e->getMessage()]);
    }
}
?>
