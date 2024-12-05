<?php
header('Content-Type: application/json');
session_start();

// Ensure this is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);

    // Validate input and session
    if (!isset($data['username']) || empty($data['username'])) {
        echo json_encode(['success' => false, 'message' => 'Recipient username is required.']);
        exit();
    }

    if (!isset($data['serverId']) || empty($data['serverId'])) {
        echo json_encode(['success' => false, 'message' => 'Server ID is required.']);
        exit();
    }

    if (!isset($_COOKIE['userName'])) { // Ensure the sender is logged in
        echo json_encode(['success' => false, 'message' => 'You must be logged in to send invites.']);
        exit();
    }

    $recipientUsername = htmlspecialchars($data['username']);
    $serverId = $data['serverId']; // Get the server ID from the request
    $senderUsername = $_COOKIE['userName']; // Get sender's username from the cookie

    require_once("ConnectionDB.php");

    // Fetch sender's user ID based on the username from the cookie
    $stmt = $connection->prepare('SELECT id_user FROM user WHERE username = :username');
    $stmt->bindParam(':username', $senderUsername);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $sender = $stmt->fetch(PDO::FETCH_ASSOC);
        $senderId = $sender['id_user']; // Get sender's user ID

        // Fetch recipient's user ID
        $stmt = $connection->prepare('SELECT id_user FROM user WHERE username = :username');
        $stmt->bindParam(':username', $recipientUsername);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $recipient = $stmt->fetch(PDO::FETCH_ASSOC);
            $recipientId = $recipient['id_user']; // Get recipient's user ID

            // Insert the invite with server_id
            $inviteStmt = $connection->prepare('INSERT INTO invites (sender_id, receiver_id, status, server_id) VALUES (:sender_id, :receiver_id, "pending", :server_id)');
            $inviteStmt->bindParam(':sender_id', $senderId);
            $inviteStmt->bindParam(':receiver_id', $recipientId);
            $inviteStmt->bindParam(':server_id', $serverId);
            $inviteStmt->execute();

            echo json_encode(['success' => true, 'message' => 'Invitation sent successfully.']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Recipient user not found.']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Sender user not found.']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
