<?php
header('Content-Type: application/json');
session_start();

// Ensure this is a GET request
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!isset($_GET['username']) || empty($_GET['username'])) {
        echo json_encode(['success' => false, 'message' => 'Username is required.']);
        exit();
    }

    $username = htmlspecialchars($_GET['username']);

    require_once("ConnectionDB.php");

    try {
        // Fetch the user's ID based on the username
        $stmt = $connection->prepare('SELECT id_user FROM user WHERE username = :username');
        $stmt->bindParam(':username', $username);
        $stmt->execute();

        if ($stmt->rowCount() > 0) {
            $user = $stmt->fetch(PDO::FETCH_ASSOC);
            $userId = $user['id_user'];

            // Fetch servers linked to the user from the server_users table, including owner_id
            $stmt = $connection->prepare('
                SELECT 
                    servers.server_id AS serverId, 
                    servers.server_name AS serverName,
                    servers.owner_id AS ownerId 
                FROM servers
                LEFT JOIN server_users ON servers.server_id = server_users.server_id
                WHERE server_users.id_user = :id_user OR servers.owner_id = :id_user
                GROUP BY servers.server_id
            ');
            $stmt->bindParam(':id_user', $userId);
            $stmt->execute();

            // Fetch all servers that match the criteria
            $servers = $stmt->fetchAll(PDO::FETCH_ASSOC);

            if (empty($servers)) {
                echo json_encode(['success' => false, 'message' => 'No servers found.']);
            } else {
                echo json_encode($servers);  // Return the list of servers with owner information
            }

        } else {
            echo json_encode(['success' => false, 'message' => 'User not found.']);
        }
    } catch (PDOException $e) {
        // Handle database error
        echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
    }

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method.']);
}
?>
