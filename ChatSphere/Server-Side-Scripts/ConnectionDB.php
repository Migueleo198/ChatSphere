<?php require_once("ConfigConnectionDB.php");?>

<?php

//DATABASE CONNECTION VARIABLE 
if(!$connection = new PDO('mysql:host='.$host.'; dbname='.$dbName, $user, $password)){
echo "ERROR CONNECTING";
exit;
}

?>