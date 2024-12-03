<?php
require_once("ConnectionDB.php");
session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $idUser = htmlspecialchars(trim($_POST['user'] ?? ''));
    $passUser = htmlspecialchars(trim($_POST['pass'] ?? ''));

    // Initialize error array
    $errores = [];

    // Validate username format (alphanumeric only)
    if (!preg_match('/^[A-Za-z0-9]+$/', $idUser)) {
        $errores[] = "Username contains invalid characters.";
    }

    // Validate password format (min 3 characters)
    if (!preg_match('/^.{3,50}$/', $passUser)) {
        $errores[] = "Password contains invalid characters.";
    }

    // If no validation errors, proceed to check user in the database
    if (empty($errores)) {
        // SQL query to get user data based on the provided username
        $sql = "SELECT * FROM user WHERE id_user = :idUser";
        $stmt = $connection->prepare($sql);
        $stmt->bindParam(':idUser', $idUser, PDO::PARAM_STR);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Check if the user is inactive
            if ($user['status'] == 'inactive') {
                echo json_encode(['status' => false, 'error' => 'Banned or inactive user.']);
                exit;
            }

            // Verify the password using password_verify() if passwords are hashed
            if ($passUser == $user['passwd']) {
                // Determine the page based on user type
                $url = ($user['user_type'] == 1) ? './adminPage.html' : './userPage.html';

                // Set cookies for user session
                setcookie('emailUser', $user['email'], [
                    'expires' => time() + 3600 * 24 * 30,
                    'path' => '/',
                    'secure' => isset($_SERVER['HTTPS']),
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);

                setcookie('userType', $user['user_type'], [
                    'expires' => time() + 3600 * 24 * 30,
                    'path' => '/',
                    'secure' => isset($_SERVER['HTTPS']),
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);

                // Store session variables
                $_SESSION['userName'] = $user['username'];
                $_SESSION['userId'] = $user['id_user'];
                $_SESSION['email'] = $user['email'];

                setcookie('userId', $user['id_user'], [
                    'expires' => time() + 3600 * 24 * 30,
                    'path' => '/',
                    'secure' => isset($_SERVER['HTTPS']),
                    'httponly' => true,
                    'samesite' => 'Lax'
                ]);

                // Return success response
                echo json_encode(['status' => true, 'message' => 'Welcome ' . $user['name'], 'url' => $url]);
                exit;
            } else {
                // Return error for incorrect password
                echo json_encode(['status' => false, 'error' => 'Incorrect username or password.']);
                exit;
            }
        } else {
            // Return error for non-existent username
            echo json_encode(['status' => false, 'error' => 'Incorrect username or password.']);
            exit;
        }
    } else {
        // Return validation errors
        echo json_encode(['status' => false, 'error' => 'Validation errors.', 'errors' => $errores]);
        exit;
    }
} else {
    // Return error for invalid request method
    echo json_encode(['status' => false, 'error' => 'Invalid request method.']);
    exit;
}
?>
