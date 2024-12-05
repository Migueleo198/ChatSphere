<?php
require_once("ConnectionDB.php");

session_start();


if(empty($_SESSION['userName']) || empty($_SESSION['userName']) && empty($_COOKIE['userName'])){
    header('Location: ../login.php');
}


/*

<?php
require_once("ConnectionDB.php");

session_start();

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


//porsiaca

if(empty($_SESSION['userId'])){
    header('Location: ../login.html');
}




if (isset($_SESSION['userId'])) {
    echo json_encode([
        'status' => true,
        'userName' =>$_SESSION['userName']
    ]);
    exit;
} else {
    echo json_encode([
        'status' => false,
        'error' => 'No has iniciado sesión'
    ]);
    exit;
}
*/