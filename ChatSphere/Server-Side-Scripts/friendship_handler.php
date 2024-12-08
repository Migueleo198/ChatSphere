<?php
session_start();
require_once("ConnectionDB.php");

class FriendshipHandler {
    private $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function addFriend($senderID, $username) {
        // First, check if the sender is not trying to send a request to themselves
        if ($senderID == $this->getUserIDByUsername($username)) {
            return "You cannot send a friend request to yourself.";
        }

        $stmt = $this->connection->prepare("SELECT id_user FROM user WHERE username = :username");
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            $receiverID = $result['id_user'];

            // Check if the sender and receiver are not the same
            if ($senderID == $receiverID) {
                return "You cannot send a friend request to yourself.";
            }

            // Prepare the query to send the friend request
            $sendRequest = $this->connection->prepare("INSERT INTO friendship_requests (sender_id, receiver_id, status, requested_at) 
            VALUES (:sender_id, :receiver_id, 'pending', NOW())");

            $sendRequest->bindParam(':sender_id', $senderID, PDO::PARAM_INT);
            $sendRequest->bindParam(':receiver_id', $receiverID, PDO::PARAM_INT);

            if ($sendRequest->execute()) {
                return "Friend Request sent!";
            } else {
                return "Error: " . $sendRequest->errorInfo()[2];
            }
        } else {
            return "User not found.";
        }
    }

    // Helper function to get user ID by username
    private function getUserIDByUsername($username) {
        $stmt = $this->connection->prepare("SELECT id_user FROM user WHERE username = :username");
        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result ? $result['id_user'] : null;
    }
}

// Debugging: Print all cookies
echo "Cookies received: ";
print_r($_COOKIE);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $senderID = $_COOKIE['userId'];
    $username = $_POST['searchFriends'];

    echo "DEBUG: POST Data: ";
    print_r($_POST);
    echo $username;

    if (isset($senderID) && isset($username)) {

        $friendshipHandler = new FriendshipHandler($connection);
        $result = $friendshipHandler->addFriend($senderID, $username);
        
        echo $result;  // Send result back to JavaScript
    } else {
        echo "Missing senderId or username.";
    }
}
?>
