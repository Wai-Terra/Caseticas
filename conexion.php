php
<?php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "caseticas";

$conn = new mysqli($host, $user, $password, $dbname);

// Verificar conexión
if ($conn->connect_error) {
    die("Error de conexión: " . $conn->connect_error);
}
?>