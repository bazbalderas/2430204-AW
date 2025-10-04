// Código JavaScript para manejar proyectos y tareas en el dashboard
// Este archivo maneja todas las funciones para agregar, mostrar y eliminar proyectos y tareas

// Vector global para almacenar los proyectos y sus tareas
let proyectos = [];

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

// Esta función actualiza la tabla para mostrar todos los proyectos
function mostrarProyectos() {
    const tablaProyectos = document.querySelector('#tablaTareas tbody');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    tablaProyectos.innerHTML = ''; // Limpiar la tabla
    dropdownMenu.innerHTML = ''; // Limpiar el menú desplegable

    if (proyectos.length === 0) {
        tablaProyectos.innerHTML = '<tr><td colspan="4" class="text-center">No hay proyectos creados</td></tr>';
        dropdownMenu.innerHTML = '<li><a class="dropdown-item">No hay proyectos</a></li>';
    } else {
        proyectos.forEach((proyecto, index) => {
            // Agregar proyectos a la tabla
            tablaProyectos.innerHTML += `
                <tr>
                    <td>${proyecto.nombre}</td>
                    <td>${proyecto.descripcion}</td>
                    <td>${proyecto.tareas.length} tareas</td>
                    <td>
                        <button onclick="mostrarTareasProyecto(${index})" class="btn-ver-tareas">Ver Tareas</button>
                        <button onclick="eliminarProyecto(${index})" class="btn-eliminar">Eliminar</button>
                    </td>
                </tr>
            `;

            // Agregar proyectos al menú desplegable
            dropdownMenu.innerHTML += `
                <li><a class="dropdown-item" href="#" onclick="seleccionarProyecto('${proyecto.nombre}')">${proyecto.nombre}</a></li>
            `;
        });
    }

    document.getElementById('contadorProyectos').textContent = `Proyectos creados: ${proyectos.length}`;
}

// Esta función actualiza la tabla para mostrar todas las tareas de un proyecto
function mostrarTareasProyecto(index) {
    const proyecto = proyectos[index];
    const tablaTareas = document.querySelector('#tablaTareas tbody');
    tablaTareas.innerHTML = ''; // Limpiar la tabla

    if (proyecto.tareas.length === 0) {
        tablaTareas.innerHTML = '<tr><td colspan="4" class="text-center">No hay tareas en este proyecto</td></tr>';
    } else {
        proyecto.tareas.forEach((tarea, tareaIndex) => {
            tablaTareas.innerHTML += `
                <tr>
                    <td>${tarea.nombre}</td>
                    <td>${tarea.descripcion}</td>
                    <td>${proyecto.nombre}</td>
                    <td>
                        <button onclick="eliminarTarea(${index}, ${tareaIndex})" class="btn-eliminar">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    document.getElementById('contadorTareas').textContent = `Tareas en "${proyecto.nombre}": ${proyecto.tareas.length}`;
}

// Esta función se ejecuta cuando el usuario presiona "Agregar Proyecto"
function agregarProyecto() {
    const nombreProyecto = document.getElementById('nombreProyecto').value.trim();
    const descripcionProyecto = document.getElementById('descripcionProyecto').value.trim();

    if (nombreProyecto && descripcionProyecto) {
        const nuevoProyecto = { nombre: nombreProyecto, descripcion: descripcionProyecto, tareas: [] };
        proyectos.push(nuevoProyecto);
        mostrarProyectos();

        document.getElementById('nombreProyecto').value = '';
        document.getElementById('descripcionProyecto').value = '';
    } else {
        alert('Por favor, completa todos los campos del proyecto.');
    }
}

// Esta función se ejecuta cuando el usuario presiona "Agregar Tarea"
function agregarTarea() {
    const nombreTarea = document.getElementById('nombreTarea').value.trim();
    const descripcionTarea = document.getElementById('descripcionTarea').value.trim();
    const proyectoSeleccionado = document.getElementById('proyectoSeleccionado').textContent;

    if (nombreTarea && descripcionTarea && proyectoSeleccionado !== 'Asignación al proyecto:') {
        const proyecto = proyectos.find(p => p.nombre === proyectoSeleccionado);
        if (proyecto) {
            proyecto.tareas.push({ nombre: nombreTarea, descripcion: descripcionTarea });
            mostrarTareasProyecto(proyectos.indexOf(proyecto));

            document.getElementById('nombreTarea').value = '';
            document.getElementById('descripcionTarea').value = '';
        }
    } else {
        alert('Por favor, completa todos los campos de la tarea.');
    }
}

// Esta función elimina un proyecto específico de la lista
function eliminarProyecto(index) {
    proyectos.splice(index, 1);
    mostrarProyectos();
}

// Esta función elimina una tarea específica de un proyecto
function eliminarTarea(proyectoIndex, tareaIndex) {
    proyectos[proyectoIndex].tareas.splice(tareaIndex, 1);
    mostrarTareasProyecto(proyectoIndex);
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

// Esta función se ejecuta automáticamente cuando la página termina de cargar
document.addEventListener('DOMContentLoaded', function() {
    // Llamar las funciones para mostrar el usuario y los proyectos
    mostrarUsuarioDashboard();
    mostrarProyectos();
    
    // Conectar los botones con sus funciones
    // .addEventListener() hace que cuando hagan clic, se ejecute la función
    document.getElementById('btnCrearProyecto').addEventListener('click', agregarProyecto);
    document.getElementById('btnAgregarTarea').addEventListener('click', agregarTarea);
    document.getElementById('btnCerrarSesion').addEventListener('click', cerrarSesion);
});