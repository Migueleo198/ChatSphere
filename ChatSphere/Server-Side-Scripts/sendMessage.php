<?php
require_once("ConnectionDB.php");
session_start();

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Retrieve and sanitize inputs
    $username = htmlspecialchars(trim($_COOKIE['userName'] ?? ''));
    $serverId = htmlspecialchars(trim($_POST['server_id'] ?? ''));
    $message = htmlspecialchars(trim($_POST['message'] ?? ''));

    // Initialize error array
    $errors = [];

    // Validate inputs
    if (empty($username)) {
        $errors[] = "Username is missing.";
    }
    if (empty($serverId)) {
        $errors[] = "Server ID is missing.";
    }
    if (empty($message)) {
        $errors[] = "Message cannot be empty.";
    }
    if (strlen($message) > 500) {
        $errors[] = "Message is too long.";
    }

    // Return errors if any
    if (!empty($errors)) {
        echo json_encode(['status' => false, 'errors' => $errors]);
        exit;
    }

    // Verify if the server ID exists in the database
    $serverCheckSql = "SELECT * FROM servers WHERE server_id = :serverId";
    $serverCheckStmt = $connection->prepare($serverCheckSql);
    $serverCheckStmt->bindParam(':serverId', $serverId, PDO::PARAM_INT);
    $serverCheckStmt->execute();

    if ($serverCheckStmt->rowCount() == 0) {
        echo json_encode(['status' => false, 'error' => 'Invalid server ID.']);
        exit;
    }

    // Insert the message into the database
    $sql = "INSERT INTO messages (username, message, server_id) VALUES (:username, :message, :serverId)";
    $stmt = $connection->prepare($sql);
    $stmt->bindParam(':username', $username, PDO::PARAM_STR);
    $stmt->bindParam(':message', $message, PDO::PARAM_STR);
    $stmt->bindParam(':serverId', $serverId, PDO::PARAM_INT);

    // Execute and handle result
    if ($stmt->execute()) {
        echo json_encode(['status' => true, 'message' => 'Message sent successfully']);
    } else {
        $errorInfo = $stmt->errorInfo();
        echo json_encode(['status' => false, 'error' => 'Failed to send message. DB Error: ' . $errorInfo[2]]);
    }
} else {
    // Invalid request method
    echo json_encode(['status' => false, 'error' => 'Invalid request method.']);
}
?>
