<?php
    $host = "localhost";
    $user = "root";
    $pass = "";
    $db = "hospital";
    $con = new mysqli($host, $user, $pass, $db);
    
    if (con -> con_error){
        die("Error de conexión: " . $con -> con_error);
    }
    ?>