<?php
require 'conexion.php';
session_start();

$d = json_decode(file_get_contents('php://input'), true);
$correo = trim($d['correo'] ?? '');
$pass   = $d['contrasena'] ?? '';

$stmt = $conn->prepare("SELECT id, nombre, contrasena, puntos FROM usuarios WHERE correo = ?");
$stmt->bind_param('s', $correo);
$stmt->execute();
$u = $stmt->get_result()->fetch_assoc();

if ($u && password_verify($pass, $u['contrasena'])) {
    $_SESSION['usuario_id'] = $u['id'];
    echo json_encode(['ok' => true, 'nombre' => $u['nombre'], 'puntos' => $u['puntos']]);
} else {
    echo json_encode(['ok' => false, 'mensaje' => 'Correo o contraseña incorrectos']);
}