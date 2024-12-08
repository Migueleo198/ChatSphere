<?php
require_once("ConnectionDB.php");

// Get the logged-in userId from the cookie
$userId = $_COOKIE['userId'];

if ($userId) {
    try {
        // SQL query to get friends, excluding the logged-in user from the list
        $query = "
            SELECT 
                u.username, 
                u.id_user
            FROM user u
            INNER JOIN friendship_requests fr ON (u.id_user = fr.sender_id OR u.id_user = fr.receiver_id)
            WHERE (fr.sender_id = :userId OR fr.receiver_id = :userId) AND fr.status = 'accepted'
            AND u.id_user != :userId";  // Exclude the current user

        $stmt = $connection->prepare($query);
        $stmt->bindParam(':userId', $userId, PDO::PARAM_INT);

        // Execute the query
        $stmt->execute();

        // Fetch all results as an associative array
        $friends = $stmt->fetchAll(PDO::FETCH_ASSOC);

        if ($friends) {
            echo json_encode([
                'status' => 'success',
                'friends' => $friends,
                'currentUser' => [
                    'username' => $_COOKIE['userName'] // Sending the current logged-in user's name
                ]
            ]);
        } else {
            echo json_encode([
                'status' => 'error',
                'message' => 'No friends found'
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
