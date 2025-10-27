//VErificar que el usuario ingrese un número válido
document.getElementById('ingresar').addEventListener('click', function() {
    // Obtener el valor del textarea y convertirlo a número
    var num = parseInt(document.getElementById('numCalif').value);
    if (isNaN(num) || num <= 0) {
        alert('Ingrese un número válido mayor a 0');
        return;
    }

    // Guardar el número de materias
    localStorage.setItem('numMaterias', num);

    // Redirigir a la página de ingreso de calificaciones
    window.location.href = 'calculadora.html';
});
