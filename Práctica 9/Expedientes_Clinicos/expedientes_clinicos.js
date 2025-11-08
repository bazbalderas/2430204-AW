// Expedientes clínicos - JS
document.addEventListener('DOMContentLoaded', function(){
const btnAgregar = document.getElementById('btnAgregarExpediente');
const btnCerrar = document.getElementById('btnCerrarFormulario');
const form = document.getElementById('formExpediente');
const formContainer = document.getElementById('formExpedienteContainer');
const tablaExpedientes = document.getElementById('tablaExpedientes');
let idCounter = JSON.parse(localStorage.getItem('expedienteIdCounter')) || 1;

btnAgregar.addEventListener('click', () => formContainer.classList.remove('hidden'));
btnCerrar.addEventListener('click', () => formContainer.classList.add('hidden'));
formContainer.addEventListener('click', (e) => { if(e.target === formContainer) formContainer.classList.add('hidden'); });

// Guardar expediente
form.addEventListener('submit', function(event){
    event.preventDefault();

    const expediente = {
        id: String(idCounter).padStart(3, '0'),
        idPaciente: document.getElementById('idPaciente').value,
        idMedico: document.getElementById('idMedico').value,
        fechaConsulta: document.getElementById('fechaConsulta').value,
        sintomas: document.getElementById('sintomas').value,
        diagnostico: document.getElementById('diagnostico').value,
        tratamiento: document.getElementById('tratamiento').value,
        recetaMedica: document.getElementById('recetaMedica').value,
        notasAdicionales: document.getElementById('notasAdicionales').value,
        proximaCita: null
    };

    let expedientes = JSON.parse(localStorage.getItem('expedientes')) || [];
    expedientes.push(expediente);
    localStorage.setItem('expedientes', JSON.stringify(expedientes));

    idCounter++;
    localStorage.setItem('expedienteIdCounter', JSON.stringify(idCounter));

    Swal.fire({ icon: 'success', title: 'Expediente guardado', text: 'El expediente se guardó correctamente' });
    
    form.reset();
    formContainer.classList.add('hidden');
    mostrarExpedientes();
});

// Mostrar expedientes
function mostrarExpedientes(){
    const expedientes = JSON.parse(localStorage.getItem('expedientes')) || [];
    tablaExpedientes.innerHTML = '';

    expedientes.forEach((exp) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2">${exp.id}</td>
            <td class="border px-4 py-2">${exp.idPaciente}</td>
            <td class="border px-4 py-2">${exp.idMedico}</td>
            <td class="border px-4 py-2">${exp.fechaConsulta}</td>
            <td class="border px-4 py-2">${exp.sintomas}</td>
            <td class="border px-4 py-2">${exp.diagnostico}</td>
            <td class="border px-4 py-2">${exp.tratamiento}</td>
            <td class="border px-4 py-2">${exp.proximaCita || 'N/A'}</td>
            <td class="border px-4 py-2">
                <button class="bg-red-800 text-white px-2 py-1 rounded font-bold" onclick="eliminarExpediente('${exp.id}')">Eliminar</button>
            </td>
        `;
        tablaExpedientes.appendChild(fila);
    }); 
}

// Eliminar expediente
window.eliminarExpediente = function(id){
    Swal.fire({
        title: 'Advertencia',
        text: '¿Eliminar expediente?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            let expedientes = JSON.parse(localStorage.getItem('expedientes')) || [];
            expedientes = expedientes.filter(e => e.id !== id);
            localStorage.setItem('expedientes', JSON.stringify(expedientes));
            mostrarExpedientes();
            Swal.fire('Eliminado', 'Expediente eliminado', 'success');
        }
    });
};

mostrarExpedientes();
});