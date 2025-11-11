// Gestión de usuarios - JS
document.addEventListener('DOMContentLoaded', function(){
const btnAgregar = document.getElementById('btnAgregarUsuario');
const btnCerrar = document.getElementById('btnCerrarFormulario');
const form = document.getElementById('formUsuario');
const formContainer = document.getElementById('formUsuarioContainer');
const tablaUsuarios = document.getElementById('tablaUsuarios');
let idCounter = JSON.parse(localStorage.getItem('usuarioIdCounter')) || 1;

btnAgregar.addEventListener('click', () => formContainer.classList.remove('hidden'));
btnCerrar.addEventListener('click', () => formContainer.classList.add('hidden'));
formContainer.addEventListener('click', (e) => { if(e.target === formContainer) formContainer.classList.add('hidden'); });

// Guardar usuario (en localStorage Y en MySQL)
form.addEventListener('submit', function(event){
    event.preventDefault();

    const ultimoAcceso = new Date().toLocaleString('es-MX');

    const usuario = {
        id: String(idCounter).padStart(3, '0'),
        usuario: document.getElementById('usuario').value,
        contrasena: document.getElementById('contrasena').value,
        rol: document.getElementById('rol').value,
        idMedico: document.getElementById('idMedico').value || null,
        activo: document.querySelector('input[name="activo"]:checked').value,
        ultimoAcceso: ultimoAcceso
    };

    // 1. Guardar en localStorage para mostrar en tabla HTML
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(usuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    idCounter++;
    localStorage.setItem('usuarioIdCounter', JSON.stringify(idCounter));

    // 2. Enviar a PHP para guardar en MySQL
    const formData = new FormData();
    formData.append('usuario', usuario.usuario);
    formData.append('contrasena', usuario.contrasena);
    formData.append('rol', usuario.rol);
    formData.append('idMedico', usuario.idMedico);
    formData.append('activo', usuario.activo);

    fetch('guardar_usuario.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log('Respuesta de PHP:', data);
        Swal.fire({ 
            icon: 'success', 
            title: 'Usuario guardado',
            text: 'Se guardó en la tabla HTML y en MySQL'
        });
    })
    .catch(error => {
        console.error('Error:', error);
        Swal.fire({ 
            icon: 'warning', 
            title: 'Guardado en tabla HTML',
            text: 'Hubo un error al guardar en MySQL'
        });
    });
    
    form.reset();
    formContainer.classList.add('hidden');
    mostrarUsuarios();
});

// Mostrar usuarios
function mostrarUsuarios(){
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    tablaUsuarios.innerHTML = '';

    usuarios.forEach((usuario) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2">${usuario.id}</td>
            <td class="border px-4 py-2">${usuario.usuario}</td>
            <td class="border px-4 py-2">${usuario.rol}</td>
            <td class="border px-4 py-2">${usuario.idMedico || 'N/A'}</td>
            <td class="border px-4 py-2">${usuario.activo === '1' ? 'Sí' : 'No'}</td>
            <td class="border px-4 py-2">${usuario.ultimoAcceso}</td>
            <td class="border px-4 py-2">
                <button class="bg-red-800 text-white px-2 py-1 rounded font-bold" onclick="eliminarUsuario('${usuario.id}')">Eliminar</button>
            </td>
        `;
        tablaUsuarios.appendChild(fila);
    }); 
}

// Eliminar usuario
window.eliminarUsuario = function(id){
    Swal.fire({
        title: 'Advertencia',
        text: '¿Eliminar usuario?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
            usuarios = usuarios.filter(u => u.id !== id);
            localStorage.setItem('usuarios', JSON.stringify(usuarios));
            mostrarUsuarios();
            Swal.fire('Eliminado', 'Usuario eliminado', 'success');
        }
    });
};

mostrarUsuarios();
});