// Vector global donde guardamos todos los proyectos y sus tareas
let proyectos = []; // Array que funciona como una lista de proyectos

// Función que actualiza visualmente los proyectos en pantalla
// Lo que hace: busca el cuerpo de la tabla y el menú desplegable del HTML
function mostrarProyectos() {
    // querySelector() busca elementos del HTML por su id o clase
    const cuerpo = document.querySelector('#tablaProyectos tbody'); // Cuerpo de la tabla
    const menu = document.querySelector('.menu-desplegable'); // Menú donde seleccionas proyecto para tareas
    
    // innerHTML = '' limpia todo lo que había dentro de esos elementos
    cuerpo.innerHTML = '';
    menu.innerHTML = '';
    
    // length es una propiedad que te dice cuántos elementos tiene un array
    if (proyectos.length === 0) {
        // Si no hay proyectos, mostramos un mensaje
        cuerpo.innerHTML = '<tr><td colspan="3" class="text-center">No hay proyectos</td></tr>';
        menu.innerHTML = '<li><span class="item-desplegable">(vacío)</span></li>';
    } else {
        // forEach() recorre cada elemento del array proyectos
        // (p, i) significa: p = proyecto actual, i = posición del proyecto en el array
        proyectos.forEach((p, i) => {
            // += significa "agregar al final"
            // Las comillas `` (backticks) permiten usar ${variable} dentro del texto
            cuerpo.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>
                    <button onclick="mostrarTareas(${i})" class="btn-ver-tareas">Ver</button>
                    <button onclick="eliminarProyecto(${i})" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>`;
            // Agregamos cada proyecto al menú desplegable también
            menu.innerHTML += `<li><a href="#" class="item-desplegable" onclick="seleccionarProyecto('${p.id}')">${p.nombre}</a></li>`;
        });
    }
    // textContent cambia solo el texto de un elemento HTML
    document.getElementById('contadorProyectos').textContent = `Proyectos creados: ${proyectos.length}`;
}

// Función para crear un nuevo proyecto cuando presionas el botón
function agregarProyecto() {
    // .value obtiene lo que escribió el usuario en los campos de texto
    // .trim() quita espacios al inicio y final
    const nombre = document.getElementById('nombreProyecto').value.trim();
    const descripcion = document.getElementById('descripcionProyecto').value.trim();
    const fechaFin = document.getElementById('fechaFinProyecto').value.trim();
    
    // Creamos un objeto (como una ficha) del proyecto con toda su información
    const nuevo = {
        id: generarIdUnicoProyecto(), // Función que crea un ID único
        nombre: nombre || '', // Si nombre está vacío, usa '' (texto vacío)
        descripcion: descripcion || '',
        estado: 'activo', // Siempre inicia como activo
        fecha_inicio: new Date().toISOString().split('T')[0], // Fecha de hoy en formato YYYY-MM-DD
        fecha_fin: fechaFin || '',
        tareas: [] // Array vacío para guardar las tareas de este proyecto
    };
    
    // push() agrega el nuevo proyecto al final del array proyectos
    proyectos.push(nuevo);
    
    // Llamamos la función para que se vea el nuevo proyecto en pantalla
    mostrarProyectos();
    
    // Limpiamos los campos del formulario (los dejamos en blanco)
    document.getElementById('nombreProyecto').value = '';
    document.getElementById('descripcionProyecto').value = '';
    document.getElementById('fechaFinProyecto').value = '';
}

// Función que elimina un proyecto del array cuando presionas "Eliminar"
function eliminarProyecto(i) {
    // splice(posición, cantidad) quita elementos del array
    // splice(i, 1) significa: quita 1 elemento en la posición i
    proyectos.splice(i, 1);
    
    // Actualizamos la pantalla para que ya no aparezca el proyecto eliminado
    mostrarProyectos();
    
    // Como eliminamos un proyecto, limpiamos la tabla de tareas por si las moscas
    document.querySelector('#tablaTareas tbody').innerHTML = '';
    document.getElementById('tituloTareas').textContent = 'Tareas del proyecto: (ninguno)';
}

// Función que muestra las tareas de un proyecto cuando presionas "Ver"
function mostrarTareas(indiceProyecto) {
    // proyectos[indiceProyecto] obtiene el proyecto en esa posición del array
    const proyecto = proyectos[indiceProyecto];
    const cuerpo = document.querySelector('#tablaTareas tbody');
    const titulo = document.getElementById('tituloTareas');
    
    // Cambiamos el título para mostrar de qué proyecto son las tareas
    titulo.textContent = `Tareas del proyecto: ${proyecto.nombre}`;
    cuerpo.innerHTML = '';
    
    // Si el proyecto no tiene tareas, mostramos un mensaje
    if (proyecto.tareas.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="6" class="text-center">No hay tareas</td></tr>';
        return; // return sale de la función aquí mismo
    }
    
    // Recorremos cada tarea del proyecto y la mostramos en la tabla
    // (t, j) significa: t = tarea actual, j = posición de la tarea
    proyecto.tareas.forEach((t, j) => {
        cuerpo.innerHTML += `
        <tr>
            <td>${t.titulo || ''}</td>
            <td>${t.descripcion || ''}</td>
            <td>${t.estado || ''}</td>
            <td>${t.prioridad || ''}</td>
            <td>${t.fecha_vencimiento || ''}</td>
            <td><button class="btn-eliminar" onclick="eliminarTarea(${indiceProyecto}, ${j})">X</button></td>
        </tr>`;
    });
}

// Función para agregar una nueva tarea a un proyecto específico
function agregarTarea() {
    // getAttribute() obtiene un atributo especial que guardamos en el botón
    // data-proyecto-id es donde guardamos qué proyecto seleccionó el usuario
    const botonProyecto = document.getElementById('proyectoSeleccionado');
    const idProyecto = botonProyecto.getAttribute('data-proyecto-id');
    
    // Si no hay proyecto seleccionado, mostramos un mensaje y nos salimos
    if (!idProyecto) { 
        alert('Selecciona un proyecto'); 
        return; // return termina la función aquí
    }
    
    // find() busca en el array proyectos el que tenga el ID que necesitamos
    // p => p.id === idProyecto es una función que dice "busca el proyecto cuyo id sea igual al idProyecto"
    const proyecto = proyectos.find(p => p.id === idProyecto);
    if (!proyecto) return; // Si no lo encuentra, salimos
    
    // Obtenemos todos los datos que escribió el usuario en el formulario de tarea
    const titulo = document.getElementById('nombreTarea').value.trim();
    const desc = document.getElementById('descripcionTarea').value.trim();
    const estado = document.getElementById('estadoTarea').value;
    const prioridad = document.getElementById('prioridadTarea').value;
    const vence = document.getElementById('fechaVencimientoTarea').value.trim();
    
    // Creamos el objeto tarea y lo agregamos al array de tareas del proyecto
    proyecto.tareas.push({
        proyecto_id: proyecto.id,
        titulo: titulo || '',
        descripcion: desc || '',
        estado: estado,
        prioridad: prioridad,
        fecha_vencimiento: vence || ''
    });
    
    // Limpiamos todos los campos del formulario
    document.getElementById('nombreTarea').value = '';
    document.getElementById('descripcionTarea').value = '';
    // selectedIndex = 0 pone el select en la primera opción
    document.getElementById('estadoTarea').selectedIndex = 0;
    document.getElementById('prioridadTarea').selectedIndex = 0;
    document.getElementById('fechaVencimientoTarea').value = '';
    
    // Regresamos el botón a su estado original
    botonProyecto.textContent = 'Seleccionar proyecto';
    botonProyecto.removeAttribute('data-proyecto-id');
    
    // Actualizamos la tabla de tareas para mostrar la nueva tarea
    // findIndex() busca la posición del proyecto en el array
    const indice = proyectos.findIndex(p => p.id === proyecto.id);
    mostrarTareas(indice);
}

// Función que elimina una tarea específica cuando presionas "X"
function eliminarTarea(iProyecto, iTarea) {
    // Verificamos que el proyecto existe
    if (!proyectos[iProyecto]) return;
    
    // splice(iTarea, 1) quita la tarea en esa posición del array de tareas
    proyectos[iProyecto].tareas.splice(iTarea, 1);
    
    // Refrescamos la tabla para que ya no aparezca la tarea eliminada
    mostrarTareas(iProyecto);
}

// Función que se ejecuta cuando seleccionas un proyecto del menú desplegable
function seleccionarProyecto(id) {
    // find() busca el proyecto que tiene ese ID
    const proyecto = proyectos.find(p => p.id === id);
    if (!proyecto) return; // Si no lo encuentra, salimos
    
    // Cambiamos el texto del botón para mostrar qué proyecto seleccionaste
    const boton = document.getElementById('proyectoSeleccionado');
    boton.textContent = proyecto.nombre;
    
    // setAttribute() guarda información especial en el botón (el ID del proyecto)
    // Esto es como poner una etiqueta invisible al botón para recordar qué proyecto elegiste
    boton.setAttribute('data-proyecto-id', id);
    
    // Escondemos el menú después de seleccionar
    const menu = document.querySelector('.menu-desplegable');
    if (menu) menu.style.display = 'none';
}

// Función que abre o cierra el menú de proyectos
function alternarMenu() {
    const menu = document.querySelector('.menu-desplegable');
    if (!menu) return; // Si no encuentra el menú, salimos
    
    // style.display controla si algo se ve o no
    // Si está visible ('block'), lo escondemos ('none')
    // Si está escondido, lo mostramos
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Función que crea un ID único para cada proyecto
// Es importante porque así podemos diferenciar un proyecto de otro
function generarIdUnicoProyecto() {
    // Date.now() da el tiempo actual en números
    // Math.random() da un número aleatorio
    // toString(36) convierte números a letras y números
    // slice(2, 8) toma solo una parte del texto generado
    return 'proyecto-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

// Función para cerrar la sesión y regresar al login
function cerrarSesion() {
    // Verificamos si existe el vector global usuarioActivo
    if (typeof window.usuarioActivo !== 'undefined') {
        // Obtenemos los datos guardados en localStorage
        const dato = localStorage.getItem('usuarioActivo');
        if (dato) {
            // JSON.parse() convierte texto a objeto JavaScript
            const u = JSON.parse(dato);
            
            // findIndex() busca la posición del usuario en el array
            const idx = window.usuarioActivo.findIndex(x => x.email === u.email);
            
            // Si lo encontramos, lo quitamos del array
            if (idx !== -1) window.usuarioActivo.splice(idx, 1);
        }
    }
    
    // removeItem() borra la información guardada
    localStorage.removeItem('usuarioActivo');
    
    // window.location.href cambia a otra página
    window.location.href = 'index.html';
}

// Este evento se ejecuta cuando la página termina de cargar
// DOMContentLoaded significa "cuando todo el HTML esté listo"
document.addEventListener('DOMContentLoaded', () => {
    // Llamamos esta función para mostrar los proyectos (aunque inicialmente estará vacío)
    mostrarProyectos();
    
    // addEventListener() conecta botones con funciones
    // El ? verifica que el elemento exista antes de conectar el evento
    document.getElementById('btnCrearProyecto')?.addEventListener('click', agregarProyecto);
    document.getElementById('btnAgregarTarea')?.addEventListener('click', agregarTarea);
    document.getElementById('btnCerrarSesion')?.addEventListener('click', cerrarSesion);
    
    // Este evento cierra el menú si haces clic en cualquier otra parte
    document.addEventListener('click', e => {
        // matches() verifica si el elemento clickeado tiene esa clase
        if (!e.target.matches('.boton-desplegable')) {
            const menu = document.querySelector('.menu-desplegable');
            if (menu && menu.style.display === 'block') menu.style.display = 'none';
        }
    });
    
    // Aquí recuperamos y mostramos el nombre del usuario que se logueó
    const guardado = localStorage.getItem('usuarioActivo');
    if (guardado) {
        // Convertimos el texto guardado de vuelta a un objeto
        const u = JSON.parse(guardado);
        const titulo = document.getElementById('nombreUsuario');
        
        // Cambiamos el texto del título para mostrar el nombre del usuario
        if (titulo) titulo.textContent = 'Dashboard - ' + u.nombre;
    }
});