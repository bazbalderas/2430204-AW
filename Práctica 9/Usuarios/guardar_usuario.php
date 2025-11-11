<?php
include 'base_datos.php';

// Recibir datos del formulario
$usuario = $_POST['usuario'];
$contrasena = password_hash($_POST['contrasena'], PASSWORD_DEFAULT);
$rol = $_POST['rol'];
$idMedico = !empty($_POST['idMedico']) ? $_POST['idMedico'] : null;
$activo = $_POST['activo'];
$ultimoAcceso = date('Y-m-d H:i:s');

// Preparar y ejecutar consulta
$stmt = $conn->prepare("INSERT INTO usuarios (usuario, contrasena, rol, idMedico, activo, ultimoAcceso) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssiss", $usuario, $contrasena, $rol, $idMedico, $activo, $ultimoAcceso);

if ($stmt->execute()) {
    echo "Usuario guardado correctamente en MySQL";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>