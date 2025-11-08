// Control de agenda - JS
document.addEventListener('DOMContentLoaded', function(){
const btnAgregar = document.getElementById('btnAgregarCita');
const btnCerrar = document.getElementById('btnCerrarFormulario');
const form = document.getElementById('formCita');
const formContainer = document.getElementById('formCitaContainer');
const tablaCitas = document.getElementById('tablaCitas');
let idCounter = JSON.parse(localStorage.getItem('citaIdCounter')) || 1;

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

// Guardar cita
form.addEventListener('submit', function(event){
    event.preventDefault();

    const fechaRegistro = new Date().toLocaleString('es-MX');

    const cita = {
        id: String(idCounter).padStart(3, '0'),
        idPaciente: document.getElementById('idPaciente').value,
        idMedico: document.getElementById('idMedico').value,
        fechaCita: document.getElementById('fechaCita').value,
        motivoConsulta: document.getElementById('motivoConsulta').value,
        estadoCita: document.getElementById('estadoCita').value,
        observaciones: document.getElementById('observaciones').value,
        fechaRegistro: fechaRegistro
    };

    // Guardar en localStorage
    let citas = JSON.parse(localStorage.getItem('citas')) || [];
    citas.push(cita);
    localStorage.setItem('citas', JSON.stringify(citas));

    idCounter++;
    localStorage.setItem('citaIdCounter', JSON.stringify(idCounter));

    Swal.fire({
        icon: 'success',
        title: 'Cita agendada',
        text: 'La cita se guardó correctamente'
    });
    
    form.reset();
    formContainer.classList.add('hidden');
    mostrarCitas();
});

// Mostrar citas en la tabla
function mostrarCitas(){
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    tablaCitas.innerHTML = '';

    citas.forEach((cita) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2">${cita.id}</td>
            <td class="border px-4 py-2">${cita.idPaciente}</td>
            <td class="border px-4 py-2">${cita.idMedico}</td>
            <td class="border px-4 py-2">${cita.fechaCita}</td>
            <td class="border px-4 py-2">${cita.motivoConsulta}</td>
            <td class="border px-4 py-2">${cita.estadoCita}</td>
            <td class="border px-4 py-2">${cita.observaciones}</td>
            <td class="border px-4 py-2">${cita.fechaRegistro}</td>
            <td class="border px-4 py-2">
                <button class="bg-red-800 text-white px-2 py-1 rounded font-bold" onclick="eliminarCita('${cita.id}')">Eliminar</button>
            </td>
        `;
        tablaCitas.appendChild(fila);
    }); 
}

// Eliminar cita
window.eliminarCita = function(id){
    Swal.fire({
        title: 'Advertencia',
        text: '¿Estás seguro que quieres eliminar la cita?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: 'green',
        cancelButtonColor: 'red',
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            let citas = JSON.parse(localStorage.getItem('citas')) || [];
            citas = citas.filter(c => c.id !== id);
            localStorage.setItem('citas', JSON.stringify(citas));
            mostrarCitas();
            Swal.fire('Eliminado', 'La cita fue eliminada', 'success');
        }
    });
};

mostrarCitas();
});