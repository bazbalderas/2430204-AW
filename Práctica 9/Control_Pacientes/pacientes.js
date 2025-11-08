//Mostrar y ocultar el formulario
document.addEventListener('DOMContentLoaded', function(){
const btnAgregar = document.getElementById('btnAgregarPaciente');
const btnCerrar = document.getElementById('btnCerrarFormulario');
const form = document.getElementById('formPaciente');
const formContainer = document.getElementById('formPacienteContainer');
const tablaPacientes = document.getElementById('tablaPacientes');
let idCounter = JSON.parse(localStorage.getItem('pacienteIdCounter')) || 1;

//Mostrar Formulario
btnAgregar.addEventListener('click', function(){
    formContainer.classList.remove('hidden');
});

//Cerrar Formulario
btnCerrar.addEventListener('click', function(){
    formContainer.classList.add('hidden');
});

// Cerrar al hacer clic fuera del formulario
formContainer.addEventListener('click', function(e){
    if(e.target === formContainer){
        formContainer.classList.add('hidden');
    }
});

//Guardar paciente
form.addEventListener('submit', function(event){
    event.preventDefault();

    const fechaRegistro = new Date().toLocaleDateString('es-MX');

    const paciente={
        id: String(idCounter).padStart(3, '0'),
        nombre: document.getElementById('nombre').value,
        curp: document.getElementById('curp').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        sexo: document.getElementById('sexo').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
        direccion: document.getElementById('direccion').value,
        contactoEmergencia: document.getElementById('contactoEmergencia').value,
        telefonoEmergencia: document.getElementById('telefonoEmergencia').value,
        alergias: document.getElementById('alergias').value,
        antecedentes: document.getElementById('antecedentes').value,
        fechaRegistro: fechaRegistro,
        estatus: document.querySelector('input[name="estatus"]:checked').value
    };

    //Guardar en localStorage
    let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    pacientes.push(paciente);
    localStorage.setItem('pacientes', JSON.stringify(pacientes));

    idCounter++;
    localStorage.setItem('pacienteIdCounter', JSON.stringify(idCounter));

    Swal.fire({
        icon: 'success',
        title: 'Paciente guardado',
        text: 'El paciente se guardó correctamente'
    });
    
    form.reset();
    formContainer.classList.add('hidden');
    mostrarPacientes();
});

//Mostrar pacientes en la tabla
function mostrarPacientes(){
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    tablaPacientes.innerHTML = '';

    pacientes.forEach((paciente) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
                <td class="border px-4 py-2">${paciente.id}</td>
                <td class="border px-4 py-2">${paciente.nombre}</td>
                <td class="border px-4 py-2">${paciente.curp}</td>
                <td class="border px-4 py-2">${paciente.fechaNacimiento}</td>
                <td class="border px-4 py-2">${paciente.sexo}</td>
                <td class="border px-4 py-2">${paciente.telefono}</td>
                <td class="border px-4 py-2">${paciente.email}</td>
                <td class="border px-4 py-2">${paciente.direccion}</td>
                <td class="border px-4 py-2">${paciente.contactoEmergencia}</td>
                <td class="border px-4 py-2">${paciente.telefonoEmergencia}</td>
                <td class="border px-4 py-2">${paciente.alergias}</td>
                <td class="border px-4 py-2">${paciente.antecedentes}</td>
                <td class="border px-4 py-2">${paciente.fechaRegistro}</td>
                <td class="border px-4 py-2">${paciente.estatus}</td>
                <td class="border px-4 py-2">
                <button class="bg-red-800 text-white px-2 py-1 rounded font-bold" onclick="eliminarPaciente('${paciente.id}')">Eliminar</button>
                </td>
        `;
        tablaPacientes.appendChild(fila);
    }); 
}

//Eliminar paciente
window.eliminarPaciente = function(id){
    Swal.fire({
        title : 'Advertencia',
        text: '¿Estás seguro que quieres eliminarlo?, no podrás recuperarlo',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            let pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
            pacientes = pacientes.filter(p => p.id !== id);
            localStorage.setItem('pacientes', JSON.stringify(pacientes));
            mostrarPacientes();
            Swal.fire('Eliminado', 'La acción fue realizada correctamente', 'success');
        }
    });
};

mostrarPacientes();
});