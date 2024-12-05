<?php
session_start();

// Destruye la sesión
session_destroy();

// Elimina la cookie 'userId'
if (isset($_COOKIE['userId'])) {
    setcookie('userName', '', time() - 3600 * 24 * 31, '/'); // Expira en el pasado, asegúrate de ajustar la ruta si es necesario
  
}

// Redirige a la página de inicio de sesión
header('Location: ../login.html');
exit(); // Asegura que no se ejecute más código después de la redirección
?>
