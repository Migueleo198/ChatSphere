<?php
require_once("ConnectionDB.php");  
// Ensure no output before the JSON response
ob_clean();  // Clear any prior output
ob_start();  // Start output buffering

header('Content-Type: application/json');  // Set header to JSON

// Get the raw POST data
$inputData = json_decode(file_get_contents('php://input'), true);

// Check if the JSON data was successfully decoded
if ($inputData === null) {
    echo json_encode(['error' => 'Invalid JSON data.']);
    exit;
}

// Retrieve form values from the decoded JSON
$email = $inputData['email'] ?? null;
$token = $inputData['token'] ?? null;
$newPassword = $inputData['password'] ?? null;

// Validate the input data
if (empty($email) || empty($token) || empty($newPassword)) {
    echo json_encode(['error' => 'El email, contraseña y token son requeridos']);
    exit;
}

// Include your database connection here

// Example of using prepared statements for database interaction
try {
    // Your SQL query to verify the token and update the password
    $stmt = $connection->prepare("SELECT id_user,token, token_exp FROM USER WHERE email = ?");
    $stmt->execute([$email]);
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        $_SESSION['user_id'] = $result['id_user'];
        $storedToken = $result['token'];
        $token_exp = $result['token_exp'];

        // Verify if the token matches and is not expired
        if ($storedToken === $token) {
            if (strtotime($token_exp) > time()) {
                // Hash the new password and update it
                $hashedPassword = password_hash($newPassword, PASSWORD_BCRYPT);
                $updateStmt = $connection->prepare("UPDATE USER SET passwd = ? WHERE email = ?");
                $updateStmt->execute([$hashedPassword, $email]);
                $url = "./login.html";
                // Return success message
                echo json_encode(['message' => 'La contraseña se ha actualizado correctamente','url' => $url]);
            } else {
                echo json_encode(['error' => 'El token ha expirado, por favor solicita un nuevo token']);
            }
        } else {
            echo json_encode(['error' => 'El token no coincide, por favor verifica el token recibido por mail']);
        }
    } else {
        echo json_encode(['error' => 'Mail no encontrado.']);
    }
} catch (Exception $e) {
    echo json_encode(['error' => 'Un error ha ocurrido: ' . $e->getMessage()]);
}

// Close the DB connection
$connection = null;
