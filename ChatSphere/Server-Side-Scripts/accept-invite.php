<?php
session_start();

// Check if the user is logged in
if (!isset($_COOKIE['userId'])) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to accept invites.']);
    exit();
}

// Get the POST body and decode the JSON
$inputData = json_decode(file_get_contents('php://input'), true);

// Check if the inviteId exists in the request
if (!isset($inputData['inviteId'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid invite ID.']);
    exit();
}

$inviteId = $inputData['inviteId'];
$userId = $_COOKIE['userId'];

require_once("ConnectionDB.php");

// Start a transaction to handle multiple queries
$connection->beginTransaction();

try {
    // Step 1: Update invite status to 'accepted'
    $query = "UPDATE invites SET status = 'accepted' WHERE id = :inviteId AND receiver_id = :userId";
    $stmt = $connection->prepare($query);
    $stmt->bindParam(':inviteId', $inviteId, PDO::PARAM_INT);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $stmt->execute();

    // Step 2: Get the server ID from the invite
    $query = "SELECT server_id FROM invites WHERE id = :inviteId";
    $stmt = $connection->prepare($query);
    $stmt->bindParam(':inviteId', $inviteId, PDO::PARAM_INT);
    $stmt->execute();
    $server = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$server) {
        throw new Exception("Invite not found or invalid.");
    }

    $serverId = $server['server_id'];

    // Step 3: Add the user to the server_users table
    $query = "INSERT INTO server_users (id_user, server_id) VALUES (:userId, :serverId)";
    $stmt = $connection->prepare($query);
    $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
    $stmt->bindParam(':serverId', $serverId, PDO::PARAM_INT);
    $stmt->execute();

    // Step 4: Commit the transaction
    $connection->commit();

    // Send success response
    echo json_encode(['success' => true, 'message' => 'Invite accepted and user added to the server.']);
} catch (Exception $e) {
    // Rollback the transaction in case of error
    $connection->rollBack();
    echo json_encode(['success' => false, 'message' => 'Error accepting invite: ' . $e->getMessage()]);
}
?>
