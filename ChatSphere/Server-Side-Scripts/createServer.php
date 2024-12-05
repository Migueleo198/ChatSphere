<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once __DIR__ . '/../vendor/autoload.php';
require_once ('ConnectionDB.php');


$serverName = isset($_POST['server_name']) ? $_POST['server_name'] : '';
$ownerName = isset($_POST['owner_name']) ? $_POST['owner_name'] : '';

// Ensure that the required parameters are present
if ($serverName && $ownerName) {
    try {
       
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Get the user ID of the owner
        $stmt = $connection->prepare("SELECT id_user FROM user WHERE username = :username");
        $stmt->bindParam(':username', $ownerName);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Insert the new server
            $stmt = $connection->prepare("INSERT INTO servers (server_name, owner_id) VALUES (:server_name, :owner_id)");
            $stmt->bindParam(':server_name', $serverName);
            $stmt->bindParam(':owner_id', $user['id_user']);
            $stmt->execute();

            echo json_encode(['success' => 'Server created successfully']);
        } else {
            echo json_encode(['error' => 'User not found']);
        }
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Server name and owner name are required']);
}
