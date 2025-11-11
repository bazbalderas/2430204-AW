<?php
include 'conexion.php';

$usuario = $_POST['usuario'];
$contrasena = $_password_hash($_POST['contrasenaHash']) ? $_POST[idMedico] : null;
$rol = $_POST['rol'];
$idMedico = !empty($_POST['idMedico']) ? $_POST['idMedico'] : null;
$activo = $_POST['activo'];
$ultimoAcceso = date('Y-m-d H:i:s');

$stmt = $conn->prepare("INSERT INTO usuarios (usuario, contrasena, rol, idMedico, activo, ultimoAcceso) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssiss", $usuario, $contrasena, $rol, $idMedico, $activo, $ultimoAcceso);

if ($stmt->execute()) {
    echo "Usuario guardado correctamente";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
    ?>