<?php
session_start();

// Check if the user is logged in
if (!isset($_COOKIE['userId'])) {
    echo json_encode(['success' => false, 'message' => 'You must be logged in to decline invites.']);
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

// Update invite status to 'declined'
$query = "UPDATE invites SET status = 'declined' WHERE id = :inviteId AND receiver_id = :userId";
$stmt = $connection->prepare($query);
$stmt->bindParam(':inviteId', $inviteId, PDO::PARAM_INT);
$stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Invite declined successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error declining the invite.']);
}
?>
