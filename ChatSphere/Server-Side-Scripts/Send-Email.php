<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php';  // Ensure this path is correct
require_once("ConnectionDB.php");  // Include your DB connection script

function sendMail($emailAccount) {
    global $connection;
     
    $mail = new PHPMailer(true);

    try {
        // **1. Check if email exists in the database**
        $stmt = $connection->prepare("SELECT * FROM USER WHERE email = ?");
        $stmt->execute([$emailAccount]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result) {
            // **2. Generate a unique token**
            $token = bin2hex(random_bytes(6));  // 6-character token
            $expiry = date('Y-m-d H:i:s', strtotime('+1 hour'));  // Token expires in 1 hour

            // **3. Store the token in the database**
            $updateStmt = $connection->prepare("UPDATE USER SET token = ?, token_exp = ? WHERE email = ?");
            if (!$updateStmt->execute([$token, $expiry, $emailAccount])) {
                return "Error al actualizar el token.";
            }

            // **4. Construct the reset URL**
            $resetUrl = "http://26.154.96.167/ChatSphere/ChatSphere-Miguel/RecoverPassword.html?token=" . urlencode($token);

            // **5. Configure email settings**
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'radiusprogramajoxm@gmail.com';
            $mail->Password = 'qcqd tkwe llki srgi';  // Consider using environment variables for security
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            // **6. Set recipient and content**
            $mail->setFrom('radiusprogramajoxm@gmail.com', 'Tech Support Chatsphere');
            $mail->addAddress($emailAccount);

            $mail->isHTML(true);
            $mail->Subject = 'Restablece tu contraseña';
            $mail->Body = "
               <p>To recover your password please follow this link:</p>
                <p>Using this recovery key:<strong> $token </strong></p>
                <p><a href='$resetUrl'>Recover Password</a></p>
                <p>This link will expire in 1 hour.</p>
            ";

            // **7. Send the email**
            $mail->send();
            return true;  // Success
        } else {
            return "Correo electrónico no encontrado.";
        }
    } catch (Exception $e) {
        return "Error al enviar el correo: {$mail->ErrorInfo}";  // Return error message
    }
}
?>
