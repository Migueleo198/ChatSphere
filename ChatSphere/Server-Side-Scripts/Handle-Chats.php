<?php

require_once __DIR__ . '/../vendor/autoload.php';
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;
use PDO;

class ChatServer implements MessageComponentInterface {
    protected $clients;
    private $pdo;

    public function __construct() {
        $this->clients = new \SplObjectStorage;

        // Set up the database connection
        try {
            $this->pdo = new PDO('mysql:host=localhost;dbname=chatsphere', 'root', 'Miguel4.0');
            $this->pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            echo 'Connection failed: ' . $e->getMessage();
        }
    }

    public function onOpen(ConnectionInterface $conn) {
        $this->clients->attach($conn);
        echo "New connection: " . $conn->resourceId . "\n";

        // Send previous messages to the new client
        $this->sendPreviousMessages($conn);
    }

    public function onMessage(ConnectionInterface $from, $msg) {
        echo "Message received from {$from->resourceId}: {$msg}\n";
    
        // Decode message into an associative array
        $messageData = json_decode($msg, true);
    
        // Check if the message is valid JSON
        if (json_last_error() === JSON_ERROR_NONE && isset($messageData['username']) && isset($messageData['message'])) {
            // Save the message to the database
            $this->saveMessage($messageData['username'], $messageData['message']);
    
            // Broadcast the message to all connected clients
            foreach ($this->clients as $client) {
                try {
                    $client->send(json_encode($messageData)); // Send the message as JSON
                } catch (\Exception $e) {
                    echo "Error sending message to client {$client->resourceId}: " . $e->getMessage() . "\n";
                    $this->clients->detach($client);  // Detach the client if there's an error
                }
            }
        } else {
            // Log invalid message format
            echo "Invalid message format received from {$from->resourceId}: {$msg}\n";
        }
    }

    public function onClose(ConnectionInterface $conn) {
        $this->clients->detach($conn);
        echo "Connection {$conn->resourceId} has disconnected\n";
    }

    public function onError(ConnectionInterface $conn, \Exception $e) {
        echo "Error: {$e->getMessage()}\n";
        $conn->close();
    }

    // Save the message to the database
    private function saveMessage($username, $message) {
        $stmt = $this->pdo->prepare("INSERT INTO messages (username, message) VALUES (:username, :message)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':message', $message);
        $stmt->execute();
    }

    // Send previous messages to the new client
    private function sendPreviousMessages(ConnectionInterface $conn) {
        $stmt = $this->pdo->query("SELECT * FROM messages ORDER BY timestamp ASC LIMIT 20"); // Retrieve last 20 messages
        $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

        foreach ($messages as $message) {
            $messageData = [
                'username' => $message['username'],
                'message' => $message['message']
            ];
            $conn->send(json_encode($messageData));
        }
    }
}

// Create and run the WebSocket server
$server = new Ratchet\App('0.0.0.0', 8080); // Allow access from all IPs
$server->route('/chat', new ChatServer, ['*']);
$server->run();

