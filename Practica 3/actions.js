// Sistema de registro de estudiantes para la UPV
// Código hecho por un estudiante de JavaScript básico

let estudiantes = []; // Esta variable guarda todos los estudiantes que se van registrando
let carreraSeleccionada = ''; // Esta variable guarda la carrera que el usuario selecciona del menú

// Esta función se activa cuando el usuario hace clic en una carrera del menú desplegable
function selectCarrera(carrera) {
    carreraSeleccionada = carrera; // Guarda la carrera que eligió el usuario
    document.getElementById('dropdownCarrera').textContent = carrera; // Cambia el texto del botón para mostrar la carrera elegida
}

// Esta función guarda un nuevo estudiante en el sistema
function guardarEstudiante() {
    // Busca todas las cajas de texto donde el usuario escribió los datos
    const textareas = document.querySelectorAll('textarea');
    
    // Crea un nuevo objeto estudiante con todos los datos que escribió el usuario
    const nuevoEstudiante = {
        matricula: textareas[0].value, // Toma el valor de la primera caja de texto (matrícula)
        nombre: textareas[1].value,    // Toma el valor de la segunda caja de texto (nombre)
        carrera: carreraSeleccionada,  // Usa la carrera que seleccionó del menú
        email: textareas[2].value,     // Toma el valor de la tercera caja de texto (email)
        telefono: textareas[3].value   // Toma el valor de la cuarta caja de texto (teléfono)
    };
    
    // Agrega el nuevo estudiante a la lista y actualiza lo que se ve en pantalla
    estudiantes.push(nuevoEstudiante);
    mostrarEstudiantes();
    limpiarFormulario();
}

// Esta función borra todos los datos del formulario para poder registrar otro estudiante
function limpiarFormulario() {
    // Borra el contenido de todas las cajas de texto
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    carreraSeleccionada = ''; // Quita la carrera seleccionada
    document.getElementById('dropdownCarrera').textContent = 'Seleccionar carrera'; // Regresa el texto original del botón
}

// Esta función muestra todos los estudiantes registrados en una tabla
function mostrarEstudiantes() {
    const tabla = document.querySelector('#tablaEstudiantes tbody');
    tabla.innerHTML = ''; // Limpia la tabla antes de mostrar los datos
    
    // Si no hay estudiantes registrados, muestra un mensaje
    if (estudiantes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6">No hay estudiantes registrados</td></tr>';
    } else {
        // Si hay estudiantes, crea una fila en la tabla para cada uno
        estudiantes.forEach((estudiante, index) => {
            tabla.innerHTML += `
                <tr>
                    <td>${estudiante.matricula}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.carrera}</td>
                    <td>${estudiante.email}</td>
                    <td>${estudiante.telefono}</td>
                    <td>
                        <button onclick="eliminarEstudiante(${index})" class="btn btn-danger btn-sm">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }
}

// Esta función elimina un estudiante específico de la lista
function eliminarEstudiante(index) {
    estudiantes.splice(index, 1); // Quita el estudiante de la posición indicada
    mostrarEstudiantes(); // Actualiza la tabla para que ya no aparezca el estudiante eliminado
}

// Este código se ejecuta automáticamente cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', function() {
    // Conecta el botón "Guardar" con la función para guardar estudiantes
    document.getElementById('guardar').addEventListener('click', guardarEstudiante);
    // Conecta el botón "Limpiar" con la función para limpiar el formulario
    document.getElementById('limpiar').addEventListener('click', limpiarFormulario);
    
    // Hace que funcione el menú desplegable de carreras
    document.querySelectorAll('.dropdown-item').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Evita que la página se recargue cuando hacen clic
            selectCarrera(this.textContent); // Llama la función para seleccionar la carrera
        });
    });
});   