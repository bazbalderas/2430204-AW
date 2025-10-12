let proyectos = [];

function mostrarProyectos() {
    const cuerpo = document.querySelector('#tablaProyectos tbody');
    const menu = document.querySelector('.dropdown-menu');
    
    cuerpo.innerHTML = '';
    menu.innerHTML = '';
    
    if (proyectos.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="3" class="text-center">No hay proyectos</td></tr>';
        menu.innerHTML = '<li><span class="item-desplegable">(vacío)</span></li>';
    } else {
        proyectos.forEach((p, i) => {
            cuerpo.innerHTML += `
            <tr>
                <td>${p.nombre}</td>
                <td>${p.descripcion}</td>
                <td>
                    <button onclick="mostrarTareas(${i})" class="btn-ver-tareas">Ver</button>
                    <button onclick="eliminarProyecto(${i})" class="btn-eliminar">Eliminar</button>
                </td>
            </tr>`;
            menu.innerHTML += `<li><a href="#" class="item-desplegable" onclick="seleccionarProyecto('${p.id}')">${p.nombre}</a></li>`;
        });
    }
    document.getElementById('contadorProyectos').textContent = `Proyectos creados: ${proyectos.length}`;
}

function agregarProyecto() {
    const nombre = document.getElementById('nombreProyecto').value.trim();
    const descripcion = document.getElementById('descripcionProyecto').value.trim();
    const fechaFin = document.getElementById('fechaFinProyecto').value.trim();
    
    const nuevo = {
        id: generarIdUnicoProyecto(),
        nombre: nombre || '',
        descripcion: descripcion || '',
        estado: 'activo',
        fecha_inicio: new Date().toISOString().split('T')[0],
        fecha_fin: fechaFin || '',
        tareas: []
    };
    
    proyectos.push(nuevo);
    mostrarProyectos();
    
    document.getElementById('nombreProyecto').value = '';
    document.getElementById('descripcionProyecto').value = '';
    document.getElementById('fechaFinProyecto').value = '';
}

function eliminarProyecto(i) {
    proyectos.splice(i, 1);
    mostrarProyectos();
    document.querySelector('#tablaTareas tbody').innerHTML = '';
    document.getElementById('tituloTareas').textContent = 'Tareas del proyecto: (ninguno)';
}

function mostrarTareas(indiceProyecto) {
    const proyecto = proyectos[indiceProyecto];
    const cuerpo = document.querySelector('#tablaTareas tbody');
    const titulo = document.getElementById('tituloTareas');
    
    titulo.textContent = `Tareas del proyecto: ${proyecto.nombre}`;
    cuerpo.innerHTML = '';
    
    if (proyecto.tareas.length === 0) {
        cuerpo.innerHTML = '<tr><td colspan="6" class="text-center">No hay tareas</td></tr>';
        return;
    }
    
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

function agregarTarea() {
    const botonProyecto = document.getElementById('proyectoSeleccionado');
    const idProyecto = botonProyecto.getAttribute('data-proyecto-id');
    
    if (!idProyecto) { 
        alert('Selecciona un proyecto'); 
        return;
    }
    
    const proyecto = proyectos.find(p => p.id === idProyecto);
    if (!proyecto) return;
    
    const titulo = document.getElementById('nombreTarea').value.trim();
    const desc = document.getElementById('descripcionTarea').value.trim();
    const estado = document.getElementById('estadoTarea').value;
    const prioridad = document.getElementById('prioridadTarea').value;
    const vence = document.getElementById('fechaVencimientoTarea').value.trim();
    
    proyecto.tareas.push({
        proyecto_id: proyecto.id,
        titulo: titulo || '',
        descripcion: desc || '',
        estado: estado,
        prioridad: prioridad,
        fecha_vencimiento: vence || ''
    });
    
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

function eliminarTarea(iProyecto, iTarea) {
    if (!proyectos[iProyecto]) return;
    proyectos[iProyecto].tareas.splice(iTarea, 1);
    mostrarTareas(iProyecto);
}

function seleccionarProyecto(id) {
    const proyecto = proyectos.find(p => p.id === id);
    if (!proyecto) return;
    
    const boton = document.getElementById('proyectoSeleccionado');
    boton.textContent = proyecto.nombre;
    boton.setAttribute('data-proyecto-id', id);
    
    const menu = document.querySelector('.dropdown-menu');
    if (menu) menu.style.display = 'none';
}

function alternarMenu() {
    const menu = document.querySelector('.dropdown-menu');
    if (!menu) return;
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}

function generarIdUnicoProyecto() {
    return 'proyecto-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
}

function cerrarSesion() {
    if (typeof window.usuarioActivo !== 'undefined') {
        const dato = localStorage.getItem('usuarioActivo');
        if (dato) {
            const u = JSON.parse(dato);
            const idx = window.usuarioActivo.findIndex(x => x.email === u.email);
            if (idx !== -1) window.usuarioActivo.splice(idx, 1);
        }
    }
    
    localStorage.removeItem('usuarioActivo');
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    mostrarProyectos();
    
    document.getElementById('btnCrearProyecto')?.addEventListener('click', agregarProyecto);
    document.getElementById('btnAgregarTarea')?.addEventListener('click', agregarTarea);
    document.getElementById('btnCerrarSesion')?.addEventListener('click', cerrarSesion);
    
    document.addEventListener('click', e => {
        if (!e.target.matches('.dropdown-btn')) {
            const menu = document.querySelector('.dropdown-menu');
            if (menu && menu.style.display === 'block') menu.style.display = 'none';
        }
    });
    
    const guardado = localStorage.getItem('usuarioActivo');
    if (guardado) {
        const u = JSON.parse(guardado);
        const titulo = document.getElementById('nombreUsuario');
        if (titulo) titulo.textContent = 'Dashboard - ' + u.nombre;
    }
});
