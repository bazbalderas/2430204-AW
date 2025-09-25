// Sistema de Gestión de Estudiantes - JavaScript
// Variables globales para almacenar datos
let estudiantes = []; // Array que almacena todos los estudiantes registrados
let carreraSeleccionada = ''; // Variable que guarda la carrera seleccionada del dropdown

// Función para mostrar/ocultar el menú desplegable de carreras
function toggleMenu() {
    const menu = document.getElementById("dropdown-content");
    if (menu.style.display === "block") {
        menu.style.display = "none"; // Si está visible, lo oculta
    } else {
        menu.style.display = "block"; // Si está oculto, lo muestra
    }
}

// Función para seleccionar una carrera del menú desplegable
function selectCarrera(carrera) {
    carreraSeleccionada = carrera; // Guarda la carrera seleccionada
    document.querySelector('.dropdown-button').textContent = carrera; // Cambia el texto del botón
    document.getElementById("dropdown-content").style.display = "none"; // Oculta el menú
}

// Función para guardar un nuevo estudiante
function guardarEstudiante() {
    // Obtiene todos los campos de texto del formulario
    const textareas = document.querySelectorAll('textarea');
    
    // Crea un objeto con los datos del estudiante
    const nuevoEstudiante = {
        matricula: textareas[0].value, // Primera textarea: matrícula
        nombre: textareas[1].value,    // Segunda textarea: nombre
        carrera: carreraSeleccionada,  // Carrera del dropdown
        email: textareas[2].value,     // Tercera textarea: email
        telefono: textareas[3].value   // Cuarta textarea: teléfono
    };
    
    // Agrega el estudiante al array y actualiza la vista
    estudiantes.push(nuevoEstudiante);
    mostrarEstudiantes();
    limpiarFormulario();
}

// Función para limpiar todos los campos del formulario
function limpiarFormulario() {
    // Borra el contenido de todas las textareas
    document.querySelectorAll('textarea').forEach(textarea => textarea.value = '');
    carreraSeleccionada = ''; // Resetea la carrera seleccionada
    document.querySelector('.dropdown-button').textContent = 'Seleccionar carrera';
}

// Función para mostrar los estudiantes en la tabla
function mostrarEstudiantes() {
    const tabla = document.querySelector('#tablaEstudiantes tbody');
    tabla.innerHTML = ''; // Limpia la tabla
    
    // Si no hay estudiantes, muestra mensaje
    if (estudiantes.length === 0) {
        tabla.innerHTML = '<tr><td colspan="6">No hay estudiantes registrados</td></tr>';
    } else {
        // Recorre cada estudiante y crea una fila en la tabla
        estudiantes.forEach((estudiante, index) => {
            tabla.innerHTML += `
                <tr>
                    <td>${estudiante.matricula}</td>
                    <td>${estudiante.nombre}</td>
                    <td>${estudiante.carrera}</td>
                    <td>${estudiante.email}</td>
                    <td>${estudiante.telefono}</td>
                    <td>
                        <button onclick="eliminarEstudiante(${index})" class="btn-eliminar">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }
}

// Función para eliminar un estudiante de la lista
function eliminarEstudiante(index) {
    estudiantes.splice(index, 1); // Remueve el estudiante del array
    mostrarEstudiantes(); // Actualiza la tabla
}

// Configuración inicial cuando la página carga
document.addEventListener('DOMContentLoaded', function() {
    // Conecta los botones con sus funciones
    document.getElementById('guardar').addEventListener('click', guardarEstudiante);
    document.getElementById('limpiar').addEventListener('click', limpiarFormulario);
    
    // Configura los enlaces del dropdown de carreras
    document.querySelectorAll('#dropdown-content a').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Previene el comportamiento por defecto del enlace
            selectCarrera(this.textContent); // Selecciona la carrera
        });
    });
});   