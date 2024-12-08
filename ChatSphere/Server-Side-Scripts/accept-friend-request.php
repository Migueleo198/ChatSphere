<?php

require_once('ConnectionDB.php');

// Enable error reporting for development
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Get the sender's userId and the receiver's userId from POST request
if (isset($_POST['senderId']) && isset($_POST['receiverId'])) {
    $senderUserId = $_POST['senderId'];
    $receiverUserId = $_POST['receiverId'];

    // Validate inputs to ensure they are numeric
    if (!is_numeric($senderUserId) || !is_numeric($receiverUserId)) {
        echo json_encode(['status' => 'error', 'message' => 'Invalid user IDs.']);
        exit;
    }

    // Query to update the status of the friendship request to 'accepted'
    $updateQuery = "UPDATE friendship_requests SET status = 'accepted' WHERE sender_id = :sender_id AND receiver_id = :receiver_id";
    $stmt = $connection->prepare($updateQuery);

    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Failed to prepare SQL query.']);
        exit;
    }

    // Use bindParam to bind the parameters
    $stmt->bindParam(':sender_id', $senderUserId, PDO::PARAM_INT);
    $stmt->bindParam(':receiver_id', $receiverUserId, PDO::PARAM_INT);

    // Execute the query
    if ($stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Friend request accepted!']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Failed to accept friend request. ' . $stmt->errorInfo()[2]]);
    }

    // Optional: Explicitly set the statement to null (to release resources)
    $stmt = null;

} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request parameters.']);
}

?>
