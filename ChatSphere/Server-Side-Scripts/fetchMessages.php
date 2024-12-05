<?php
// Database connection
$host = '26.154.96.167';  // Database host
$dbname = 'chatsphere';  // Database name
$username = 'root';    // Database username
$password = 'Miguel4.0';        // Database password

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Fetch messages from the database
    $stmt = $pdo->query(// Example fetchMessages.php
        $sql = "SELECT username, message, timestamp FROM messages ORDER BY timestamp ASC");
    $messages = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the messages as a JSON array
    echo json_encode($messages);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
