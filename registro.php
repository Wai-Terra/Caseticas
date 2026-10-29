<?php
require 'conexion.php';

$d = json_decode(file_get_contents('php://input'), true);
$nombre = trim($d['nombre'] ?? '');
$correo = trim($d['correo'] ?? '');
$pass   = $d['contrasena'] ?? '';

if (!$nombre || !filter_var($correo, FILTER_VALIDATE_EMAIL) || strlen($pass) < 6) {
    echo json_encode(['ok' => false, 'mensaje' => 'Datos inválidos (contraseña mínimo 6 caracteres)']);
    exit;
}

$hash = password_hash($pass, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)");
$stmt->bind_param('sss', $nombre, $correo, $hash);

if ($stmt->execute()) {
    echo json_encode(['ok' => true, 'mensaje' => 'Cuenta creada correctamente']);
} else {
    echo json_encode(['ok' => false, 'mensaje' => 'Ese correo ya está registrado']);
}