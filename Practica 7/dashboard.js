// Estado global de la sesión del Dashboard
let proyectos = [];

// Pinta la tabla de proyectos y el menú desplegable.
// - Muestra mensaje vacío cuando no hay proyectos.
// - Actualiza el contador de proyectos.

// Usamos el querySSelector para buscar el primer elemento
function mostrarProyectos() {
    const cuerpo = document.querySelector('#tablaProyectos tbody');
    const menu = document.querySelector('.menu-desplegable');
    
    // Se vacian todas las secciones
    cuerpo.innerHTML = '';
    menu.innerHTML = '';
    
    // Si no hay proyectos, mostramos un mensaje vacío
    if (proyectos.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="4" class="text-center">No hay proyectos</td></tr>';
        menu.innerHTML = '<li><span class="item-desplegable">(vacío)</span></li>';
    } else {
        // Si hay proyectos, los recorremos llenando los espacios que estaban en blanco
        proyectos.forEach((p, i) => {
            cuerpo.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>${p.fecha_fin || ''}</td>
                <td>
                    <button onclick="mostrarTareas(${i})" class="btn-ver-tareas">Ver</button>
                    <button onclick="eliminarProyecto(${i})" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>`;
            menu.innerHTML += `<li><a href="#" class="item-desplegable" onclick="seleccionarProyecto('${p.id}')">${p.nombre}</a></li>`;
        });
    }
    // Se incrementa el contador por cada proyecto más que haya
    document.getElementById('contadorProyectos').textContent = `Proyectos: ${proyectos.length}`;
}

// Crea un nuevo proyecto con datos del formulario y lo agrega a la lista.
// Limpia el formulario al finalizar.
function agregarProyecto() {

    // Tomamos los valores dentro de los text areas usando trim para eliminar los espacios en blanco
    const nombre = document.getElementById('nombreProyecto').value.trim();
    const descripcion = document.getElementById('descripcionProyecto').value.trim();
    const fechaFin = document.getElementById('fechaFinProyecto').value.trim();
    
    const nuevo = { // Agrega los valores dentro de un objeto sin importar si estan llenos o vacios
        id: generarIdUnicoProyecto(),
        nombre: nombre || '',
        descripcion: descripcion || '',
        estado: 'activo',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: fechaFin || '',
        tareas: []
    };
    // Manda el objeto al arreglo de proyectos
    proyectos.push(nuevo);
    
    mostrarProyectos();

    // Limpiar formulario
    document.getElementById('nombreProyecto').value = '';
    document.getElementById('descripcionProyecto').value = '';
    document.getElementById('fechaFinProyecto').value = '';
}

// Elimina un proyecto por índice y refresca las tablas.
// También limpia la sección de tareas visible si pertenecía al proyecto eliminado.
function eliminarProyecto(i) {
    // con el .splice buscamos en el arreglo con base a la posición del proyecto, eliminando el que seleccionanmos
    proyectos.splice(i, 1);
    
    mostrarProyectos();
    
    document.querySelector('#tablaTareas tbody').innerHTML = '';
    document.getElementById('tituloTareas').textContent = 'Tareas del proyecto: (ninguno)';
}

// Pinta la tabla de tareas del proyecto seleccionado.
// @param {number} indiceProyecto - Índice del proyecto en el arreglo.

// Funcion que muestra las tareas bsucando en con base a la posicion del arreglo de proyectos, y plasmando la informacion
// de las tareas en la tabla, camibando el titulo por el nombre del proyecto seleccionado
function mostrarTareas(indiceProyecto) {
    const proyecto = proyectos[indiceProyecto];
    const cuerpo = document.querySelector('#tablaTareas tbody');
    const titulo = document.getElementById('tituloTareas');
    
    titulo.textContent = `Tareas del proyecto: ${proyecto.nombre}`;
    cuerpo.innerHTML = '';
    
    // Si el proyecto seleccionado no tiene tareas, mostraremos un mensaje que dira que no hay tareas disponibles
    if (proyecto.tareas.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="6" class="text-center">No hay tareas</td></tr>';
        return;
    }
    
    // COn un forEach lo que hacemos es recorrer todas las tareas que tenga el proyecto seleccionado y las vamos
    // plasmando en la tabla
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

// Agrega una tarea al proyecto actualmente seleccionado en el botón desplegable.
// Valida selección de proyecto y limpia el formulario al terminar.

// Funcion que agrega tareas al array del proyecto seleccionado, basandose de la opción escogida en el menú desplegable
function agregarTarea() {
    const botonProyecto = document.getElementById('proyectoSeleccionado');
    const idProyecto = botonProyecto.getAttribute('data-proyecto-id');
    
    // SI el proyecto no existe o no se escoge ningun proyecto, mandamos alerta para
    // que el usuario seleccione un proyecto
    if (!idProyecto) { 
        alert('Selecciona un proyecto'); 
        return;
    }

    // Buscamos el proyecto en el arreglo de proyectos
    const proyecto = proyectos.find(p => p.id === idProyecto);
    if (!proyecto) return;

    // Tomamos los valores del formulario de tareas
    const titulo = document.getElementById('nombreTarea').value.trim();
    const desc = document.getElementById('descripcionTarea').value.trim();
    const estado = document.getElementById('estadoTarea').value;
    const prioridad = document.getElementById('prioridadTarea').value;
    const vence = document.getElementById('fechaVencimientoTarea').value.trim();
    
    // Agregamos la nueva tarea al arreglo de tareas del proyecto
    proyecto.tareas.push({
        proyecto_id: proyecto.id,
        titulo: titulo || '',
        descripcion: desc || '',
        estado: estado,
        prioridad: prioridad,
        fecha_vencimiento: vence || ''
    });
    
    // Dejamos como antes el formulario
    document.getElementById('nombreTarea').value = '';
    document.getElementById('descripcionTarea').value = '';
    document.getElementById('estadoTarea').selectedIndex = 0;
    document.getElementById('prioridadTarea').selectedIndex = 0;
    document.getElementById('fechaVencimientoTarea').value = '';
    
    botonProyecto.textContent = 'Seleccionar proyecto';
    botonProyecto.removeAttribute('data-proyecto-id');
    
    const indice = proyectos.findIndex(p => p.id === proyecto.id);
    mostrarTareas(indice);
}

// Funcion para eliminar tareas
// Elimina una tarea por índices de proyecto y tarea, y refresca la tabla.
function eliminarTarea(iProyecto, iTarea) {
    if (!proyectos[iProyecto]) return;

    proyectos[iProyecto].tareas.splice(iTarea, 1); // Eliminamos la tarea del arreglo con base a su posición en el arreglo

    mostrarTareas(iProyecto); 
}

// Selecciona un proyecto en el botón personalizado y cierra el menú.
// @param {string} id - ID único del proyecto.

// funcion que selecciona el proyecto con base al id unico que se le asigna al momento de crear el proyecto
function seleccionarProyecto(id) {
    const proyecto = proyectos.find(p => p.id === id);
    if (!proyecto) return;
    
    // Actualiza el botón con el nombre del proyecto seleccionado
    const boton = document.getElementById('proyectoSeleccionado');
    boton.textContent = proyecto.nombre;
    
    // Guarda el ID del proyecto en un atributo data- del botón para referencia futura
    boton.setAttribute('data-proyecto-id', id);
    
    // Cerramos
    const menu = document.querySelector('.menu-desplegable');
    if (menu) menu.style.display = 'none';
}

// Alterna la visibilidad del menú desplegable de proyectos.
function alternarMenu() {
    const menu = document.querySelector('.menu-desplegable');
    if (!menu) return;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

// Genera un identificador único básico para nuevos proyectos.
function generarIdUnicoProyecto() {
    return 'proyecto-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

// Cierra la sesión actual:
// - Limpia usuarioActivo de localStorage y del arreglo global opcional window.usuarioActivo.
// - Redirige a index.html.
function cerrarSesion() {
    if (typeof window.usuarioActivo !== 'undefined') {
        const dato = localStorage.getItem('usuarioActivo'); // Obtener el usuario activo del localStorage
        if (dato) {
            const u = JSON.parse(dato); // Obtener el usuario activo
            const idx = window.usuarioActivo.findIndex(x => x.email === u.email);
            if (idx !== -1) window.usuarioActivo.splice(idx, 1); // Eliminar el usuario del arreglo global
        }
    }
    
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
}

// Inicio: enlaza eventos de la UI y saluda al usuario si existe en localStorage
document.addEventListener('DOMContentLoaded', () => {
    mostrarProyectos();
    
    // Enlazamos eventos a botones
    document.getElementById('btnCrearProyecto')?.addEventListener('click', agregarProyecto);
    document.getElementById('btnAgregarTarea')?.addEventListener('click', agregarTarea);
    document.getElementById('btnCerrarSesion')?.addEventListener('click', cerrarSesion);
    
    // boton para el menu desplegable
    document.addEventListener('click', e => {
        if (!e.target.matches('.btn-desplegable')) {
            const menu = document.querySelector('.menu-desplegable');
            if (menu && menu.style.display === 'block') menu.style.display = 'none';
        }
    });
    
    // usuario ingresado
    const guardado = localStorage.getItem('usuarioActivo');
    if (guardado) {
        const u = JSON.parse(guardado);
        const titulo = document.getElementById('nombreUsuario');
        if (titulo) titulo.textContent = 'Dashboard - ' + u.nombre;
    }
});