
<?php
header('Content-Type: application/json');
include 'conexion.php';

// Ejemplo: Consultar los datos del usuario de la base de datos
$sql = "SELECT * FROM usuario WHERE id = 1";
$resultado = $conn->query($sql);
$usuario = $resultado->fetch_assoc();

// Empaquetar todo en un JSON para JavaScript
$datosFinales = [
    "usuario" => $usuario
];

echo json_encode($datosFinales);
?>


