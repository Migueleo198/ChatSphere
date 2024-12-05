<?php
session_start();

require_once('Send-Email.php');  

$minTimeBetweenEmails = 60; // 1 minute time limit between email requests

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['email'])) {
    $emailAccount = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    
    if (filter_var($emailAccount, FILTER_VALIDATE_EMAIL)) {

        if (isset($_SESSION['last_email_sent'])) {
            $lastEmailSent = $_SESSION['last_email_sent'];
            $timeElapsed = time() - $lastEmailSent;

            if ($timeElapsed < $minTimeBetweenEmails) {
                $timeRemaining = $minTimeBetweenEmails - $timeElapsed;
                // Redirect to error page with message
                header("Location: errorPage.php?error=wait&timeRemaining=$timeRemaining");
                exit;
            }
        }

        $result = sendMail($emailAccount);

        if ($result === true) {
            $_SESSION['last_email_sent'] = time();
            
            header("Location: ../EmailSent.html");
            echo json_encode(['status' => true, 'message' => 'Correo enviado correctamente.']);
        } else {
            header("Location: errorPage.php?error=email_failed");
            exit;
        }
    } else {
        header("Location: errorPage.php?error=invalid_email");
        exit;
    }
} else {
    header("Location: errorPage.php?error=invalid_request");
    exit;
}
?>



