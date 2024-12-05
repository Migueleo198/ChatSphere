<?php
require_once("ConnectionDB.php");

$userId = $_COOKIE['userId'];  // Assuming userId is stored in the cookie

// Get invites where the user is the receiver (and optionally the sender as well if needed)
$query = "
    SELECT invites.id, invites.status, sender.username AS sender, receiver.username AS receiver
    FROM invites
    JOIN user AS sender ON invites.sender_id = sender.id_user
    JOIN user AS receiver ON invites.receiver_id = receiver.id_user  -- Ensure this column exists in 'user' table
    WHERE invites.receiver_id = :userId  -- Check the receiver_id
    ORDER BY invites.invited_at DESC
";

$stmt = $connection->prepare($query);
$stmt->bindParam(':userId', $userId, PDO::PARAM_INT);
$stmt->execute();

// Check if there are any invites
$invites = $stmt->fetchAll(PDO::FETCH_ASSOC);

$response = [];

if (empty($invites)) {
    $response = ['success' => true, 'message' => 'You have no invites.', 'invites' => []];
} else {
    // Return invites in the format expected by the frontend
    $response = ['success' => true, 'invites' => []];

    foreach ($invites as $invite) {
        $response['invites'][] = [
            'id' => $invite['id'],
            'sender' => htmlspecialchars($invite['sender']),
            'receiver' => htmlspecialchars($invite['receiver']),
            'status' => htmlspecialchars($invite['status']),
        ];
    }
}

echo json_encode($response);
?>
