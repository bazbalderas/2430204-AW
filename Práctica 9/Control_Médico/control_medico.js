// Control de médicos - JS
document.addEventListener('DOMContentLoaded', function(){
const btnAgregar = document.getElementById('btnAgregarMedico');
const btnCerrar = document.getElementById('btnCerrarFormulario');
const form = document.getElementById('formMedico');
const formContainer = document.getElementById('formMedicoContainer');
const tablaMedicos = document.getElementById('tablaMedicos');
let idCounter = JSON.parse(localStorage.getItem('medicoIdCounter')) || 1;

// Mostrar formulario
btnAgregar.addEventListener('click', function(){
    formContainer.classList.remove('hidden');
});

// Cerrar formulario
btnCerrar.addEventListener('click', function(){
    formContainer.classList.add('hidden');
});

// Cerrar al hacer clic fuera
formContainer.addEventListener('click', function(e){
    if(e.target === formContainer){
        formContainer.classList.add('hidden');
    }
});

// Guardar médico
form.addEventListener('submit', function(event){
    event.preventDefault();

    const fechaIngreso = new Date().toLocaleDateString('es-MX');

    const medico = {
        id: String(idCounter).padStart(3, '0'),
        nombreCompleto: document.getElementById('nombreCompleto').value,
        cedula: document.getElementById('cedula').value,
        especialidadId: document.getElementById('especialidadId').value,
        telefono: document.getElementById('telefono').value,
        correo: document.getElementById('correo').value,
        horario: document.getElementById('horario').value,
        fechaIngreso: fechaIngreso,
        estatus: document.querySelector('input[name="estatus"]:checked').value
    };

    // Guardar en localStorage
    let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    medicos.push(medico);
    localStorage.setItem('medicos', JSON.stringify(medicos));

    idCounter++;
    localStorage.setItem('medicoIdCounter', JSON.stringify(idCounter));

    Swal.fire({
        icon: 'success',
        title: 'Médico guardado',
        text: 'El médico se guardó correctamente'
    });
    
    form.reset();
    formContainer.classList.add('hidden');
    mostrarMedicos();
});

// Mostrar médicos en la tabla
function mostrarMedicos(){
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    tablaMedicos.innerHTML = '';

    medicos.forEach((medico) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2">${medico.id}</td>
            <td class="border px-4 py-2">${medico.nombreCompleto}</td>
            <td class="border px-4 py-2">${medico.cedula}</td>
            <td class="border px-4 py-2">${medico.especialidadId}</td>
            <td class="border px-4 py-2">${medico.telefono}</td>
            <td class="border px-4 py-2">${medico.correo}</td>
            <td class="border px-4 py-2">${medico.horario}</td>
            <td class="border px-4 py-2">${medico.fechaIngreso}</td>
            <td class="border px-4 py-2">${medico.estatus === '1' ? 'Activo' : 'Inactivo'}</td>
            <td class="border px-4 py-2">
                <button class="bg-red-800 text-white px-2 py-1 rounded font-bold" onclick="eliminarMedico('${medico.id}')">Eliminar</button>
            </td>
        `;
        tablaMedicos.appendChild(fila);
    }); 
}

// Eliminar médico
window.eliminarMedico = function(id){
    Swal.fire({
        title: 'Advertencia',
        text: '¿Estás seguro que quieres eliminarlo?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            let medicos = JSON.parse(localStorage.getItem('medicos')) || [];
            medicos = medicos.filter(m => m.id !== id);
            localStorage.setItem('medicos', JSON.stringify(medicos));
            mostrarMedicos();
            Swal.fire('Eliminado', 'El médico fue eliminado', 'success');
        }
    });
};

mostrarMedicos();
});