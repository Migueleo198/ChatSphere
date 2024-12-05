<?php
session_start();

$error = isset($_GET['error']) ? $_GET['error'] : '';
$timeRemaining = isset($_GET['timeRemaining']) ? $_GET['timeRemaining'] : (isset($_SESSION['timeRemaining']) ? $_SESSION['timeRemaining'] : 0);
$message = '';

switch ($error) {
    case 'wait':
        $message = "Debes esperar antes de mandar otro email.";
        $_SESSION['timeRemaining'] = $timeRemaining;
        break;
    case 'email_failed':
        $message = "Hubo un problema al enviar el correo. Intenta nuevamente más tarde.";
        break;
    case 'invalid_email':
        $message = "El correo ingresado es inválido.";
        break;
    case 'invalid_request':
        $message = "Solicitud no válida.";
        break;
    default:
        $message = "Debes esperar {$_SESSION['timeRemaining']} segundos antes de mandar otro email.";
        $_SESSION['timeRemaining'] -= 1;
        break;
}
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Error - Correo</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f7f7f7;
            text-align: center;
            padding: 50px;
        }
        .error-container {
            background-color: #ffcccc;
            border: 1px solid #ff0000;
            padding: 20px;
            border-radius: 5px;
            color: #d9534f;
            margin-bottom: 20px;
        }
        .btn {
            background-color: #5bc0de;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            font-size: 16px;
        }
        .btn:hover {
            background-color: #31b0d5;
        }
        .timer {
            font-weight: bold;
            font-size: 1.5em;
            color: #d9534f;
        }
    </style>
</head>
<body>

<div class="error-container">
    <h2>Error</h2>
    <p><?php echo $message; ?></p>

    <!-- Displaying Timer for the remaining wait time -->
    <?php if ($timeRemaining > 0): ?>
        <p class="timer" id="timer"><?php echo $timeRemaining; ?> segundos restantes...</p>
    <?php endif; ?>

</div>

<!-- Go Back Button -->
<a href="javascript:history.back()" class="btn">Volver</a>

<script>
    // If there is a remaining time, start a countdown
    <?php if ($timeRemaining > 0): ?>
        var timeRemaining = <?php echo $timeRemaining; ?>;
        var timerElement = document.getElementById('timer');

        function updateTimer() {
            timeRemaining--;
            timerElement.textContent = timeRemaining + ' segundos restantes...';

            if (timeRemaining <= 0) {
                // When the time is over, you can reload the page or redirect
                window.location.href = "../login.html";  // Redirect to login page after waiting time
            }
        }

        // Update the timer every second
        setInterval(updateTimer, 1000);
    <?php endif; ?>
</script>

</body>
</html>


