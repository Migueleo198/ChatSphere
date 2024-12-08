<?php
require_once("ConnectionDB.php");

// Get the userId from the cookie
$userId = $_COOKIE['userId'];

if ($userId) {
    try {
        // SQL query to join friendship_requests with the users table
        $query = "
            SELECT 
                fr.sender_id, 
                u.username AS senderUsername, 
                fr.requested_at
            FROM friendship_requests AS fr
            INNER JOIN user u ON fr.sender_id = u.id_user
            WHERE fr.receiver_id = :receiver AND fr.status = 'pending'
        ";  // Make sure the query is properly closed

        $stmt = $connection->prepare($query);

        // Bind the receiver_id parameter to userId
        $stmt->bindParam(':receiver', $userId, PDO::PARAM_INT);

        // Execute the query
        $stmt->execute();

        // Fetch all results as an associative array
        $requests = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($requests) {
            echo json_encode([
                'status' => 'success',
                'requests' => $requests
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'No friend requests found'
            ]);
        }
    } catch (PDOException $e) {
        echo json_encode([
            'status' => 'error',
            'message' => 'Database error: ' . $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid user ID'
    ]);
}
?>
