<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once('ConnectionDB.php');

$serverId = isset($_GET['server_id']) ? $_GET['server_id'] : '';  // Get the server ID from the request

if ($serverId) {
    try {
        $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Fetch messages for the specified server
        $stmt = $connection->prepare("SELECT id, message, username, timestamp FROM messages WHERE server_id = :server_id ORDER BY timestamp ASC");
        $stmt->bindParam(':server_id', $serverId);
        $stmt->execute();
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Return the messages in JSON format
        echo json_encode($messages);
    } catch (PDOException $e) {
        echo json_encode(['error' => 'Database connection failed: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['error' => 'Server ID not provided']);
}
?>
