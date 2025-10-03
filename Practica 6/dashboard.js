// Código JavaScript para hacer funcionar el dashboard de tareas
// Este archivo maneja todas las funciones para agregar, mostrar y eliminar tareas

// Vector que guarda todas las tareas del usuario
// Cada tarea es un objeto con nombre y descripción
// Empieza vacío para que el usuario agregue sus propias tareas
let tareas = [];

// Esta función busca el nombre del usuario que se logueó y lo muestra en el dashboard
function mostrarUsuarioDashboard() {
    // localStorage.getItem() busca información guardada en el navegador
    const usuarioLogueado = localStorage.getItem('usuarioActivo');
    
    // Si encontró un usuario guardado
    if (usuarioLogueado) {
        // JSON.parse() convierte texto en un objeto JavaScript que podemos usar
        const usuario = JSON.parse(usuarioLogueado);
        // document.getElementById() busca un elemento en el HTML por su ID
        // textContent cambia el texto que aparece en ese elemento
        document.getElementById('nombreUsuario').textContent = `Dashboard - ${usuario.nombre}`;
    }
}

// Esta función actualiza la tabla para mostrar todas las tareas
function mostrarTareas() {
    // Buscar el cuerpo de la tabla (tbody) donde van las filas de datos
    const tablaTareas = document.querySelector('#tablaTareas tbody');
    // innerHTML = '' borra todo lo que había en la tabla
    tablaTareas.innerHTML = '';
    
    // Si no hay tareas en el array, mostrar un mensaje
    if (tareas.length === 0) {
        // colspan="3" hace que la celda ocupe 3 columnas
        tablaTareas.innerHTML = '<tr><td colspan="3" class="text-center">No hay tareas pendientes</td></tr>';
    } else {
        // forEach() recorre cada elemento del array de tareas
        // (tarea, index) => tarea es el elemento actual, index es su posición (0, 1, 2...)
        tareas.forEach((tarea, index) => {
            // += agrega contenido sin borrar lo que ya había
            // ${} permite insertar variables dentro de texto
            tablaTareas.innerHTML += `
                <tr>
                    <td>${tarea.nombre}</td>
                    <td>${tarea.descripcion}</td>
                    <td>
                        <button onclick="eliminarTarea(${index})" class="btn-eliminar">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }
    
    // Actualizar el contador que muestra cuántas tareas hay
    // .length nos dice cuántos elementos tiene el array
    document.getElementById('contadorTareas').textContent = `Tareas pendientes: ${tareas.length}`;
}

// Esta función se ejecuta cuando el usuario presiona "Agregar Tarea"
function agregarTarea() {
    // .value obtiene lo que el usuario escribió en cada campo
    const nombreTarea = document.getElementById('nombreTarea').value;
    const descripcionTarea = document.getElementById('descripcionTarea').value;
    const proyectoTarea = document.getElementById('proyectoTarea').value;
    
    // .trim() quita espacios en blanco al inicio y final
    // !== '' verifica que no esté vacío
    if (nombreTarea.trim() !== '' && descripcionTarea.trim() !== '') {
        // Crear un nuevo objeto tarea con los datos que escribió el usuario
        const nuevaTarea = {
            nombre: nombreTarea,
            descripcion: descripcionTarea,
            proyecto: proyectoTarea
        };
        
        // .push() agrega la nueva tarea al final del array
        tareas.push(nuevaTarea);
        // Llamar la función para actualizar la tabla y mostrar la nueva tarea
        mostrarTareas();
        
        // Limpiar los campos para que el usuario pueda escribir otra tarea
        document.getElementById('nombreTarea').value = '';
        document.getElementById('descripcionTarea').value = '';
    }
}

// Esta función elimina una tarea específica de la lista
function eliminarTarea(index) {
    // .splice(posición, cantidad) quita elementos del array
    // splice(index, 1) quita 1 elemento en la posición "index"
    tareas.splice(index, 1);
    // Actualizar la tabla para que ya no aparezca la tarea eliminada
    mostrarTareas();
}

// Esta función se ejecuta cuando el usuario presiona "Cerrar Sesión"
function cerrarSesion() {
    // Buscar la información del usuario en el localStorage
    const usuarioLogueado = localStorage.getItem('usuarioActivo');
    
    if (usuarioLogueado) {
        // Convertir el texto guardado en un objeto JavaScript
        const usuario = JSON.parse(usuarioLogueado);
        
        // Acceder al vector global usuarioActivo para limpiarlo
        if (typeof window.usuarioActivo !== 'undefined') {
            // .findIndex() busca un elemento en el array y devuelve su posición
            // u => u.email === usuario.email busca por email igual
            const indiceUsuario = window.usuarioActivo.findIndex(u => u.email === usuario.email);
            
            // Si encontró el usuario (índice diferente de -1)
            if (indiceUsuario !== -1) {
                // Quitarlo del array de usuarios activos
                window.usuarioActivo.splice(indiceUsuario, 1);
                // Mostrar en consola para verificar que se eliminó
                console.log('Usuario eliminado del vector usuarioActivo:', window.usuarioActivo);
            }
        }
        
        // .removeItem() borra la información guardada en el navegador
        localStorage.removeItem('usuarioActivo');
        
        console.log('Sesión cerrada correctamente');
    }
    
    // window.location.href redirige a otra página
    window.location.href = 'index.html';
}

// Este código se ejecuta automáticamente cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', function() {
    // Llamar las funciones para mostrar el usuario y las tareas
    mostrarUsuarioDashboard();
    mostrarTareas();
    
    // Conectar los botones con sus funciones
    // .addEventListener() hace que cuando hagan clic, se ejecute la función
    document.getElementById('btnAgregarTarea').addEventListener('click', agregarTarea);
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
});