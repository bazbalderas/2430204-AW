// Gestión de reportes - JS
document.addEventListener('DOMContentLoaded', function(){
const btnGenerar = document.getElementById('btnGenerarReporte');
const btnCerrar = document.getElementById('btnCerrarFormulario');
const form = document.getElementById('formReporte');
const formContainer = document.getElementById('formReporteContainer');
const tablaReportes = document.getElementById('tablaReportes');
let idCounter = JSON.parse(localStorage.getItem('reporteIdCounter')) || 1;

btnGenerar.addEventListener('click', () => formContainer.classList.remove('hidden'));
btnCerrar.addEventListener('click', () => formContainer.classList.add('hidden'));
formContainer.addEventListener('click', (e) => { if(e.target === formContainer) formContainer.classList.add('hidden'); });

// Generar reporte
form.addEventListener('submit', function(event){
    event.preventDefault();

    const fechaGeneracion = new Date().toLocaleString('es-MX');

    const reporte = {
        id: String(idCounter).padStart(3, '0'),
        tipoReporte: document.getElementById('tipoReporte').value,
        idPaciente: document.getElementById('idPaciente').value || null,
        idMedico: document.getElementById('idMedico').value || null,
        fechaGeneracion: fechaGeneracion,
        rutaArchivo: document.getElementById('rutaArchivo').value,
        descripcion: document.getElementById('descripcion').value,
        generadoPor: document.getElementById('generadoPor').value
    };

    let reportes = JSON.parse(localStorage.getItem('reportes')) || [];
    reportes.push(reporte);
    localStorage.setItem('reportes', JSON.stringify(reportes));

    idCounter++;
    localStorage.setItem('reporteIdCounter', JSON.stringify(idCounter));

    Swal.fire({ icon: 'success', title: 'Reporte generado', text: 'El reporte se guardó correctamente' });
    
    form.reset();
    formContainer.classList.add('hidden');
    mostrarReportes();
});

// Mostrar reportes
function mostrarReportes(){
    const reportes = JSON.parse(localStorage.getItem('reportes')) || [];
    tablaReportes.innerHTML = '';

    reportes.forEach((reporte) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2">${reporte.id}</td>
            <td class="border px-4 py-2">${reporte.tipoReporte}</td>
            <td class="border px-4 py-2">${reporte.idPaciente || 'N/A'}</td>
            <td class="border px-4 py-2">${reporte.idMedico || 'N/A'}</td>
            <td class="border px-4 py-2">${reporte.fechaGeneracion}</td>
            <td class="border px-4 py-2">${reporte.rutaArchivo}</td>
            <td class="border px-4 py-2">${reporte.descripcion}</td>
            <td class="border px-4 py-2">${reporte.generadoPor}</td>
            <td class="border px-4 py-2">
                <button class="bg-red-800 text-white px-2 py-1 rounded font-bold" onclick="eliminarReporte('${reporte.id}')">Eliminar</button>
            </td>
        `;
        tablaReportes.appendChild(fila);
    }); 
}

// Eliminar reporte
window.eliminarReporte = function(id){
    Swal.fire({
        title: 'Advertencia',
        text: '¿Eliminar reporte?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            let reportes = JSON.parse(localStorage.getItem('reportes')) || [];
            reportes = reportes.filter(r => r.id !== id);
            localStorage.setItem('reportes', JSON.stringify(reportes));
            mostrarReportes();
            Swal.fire('Eliminado', 'Reporte eliminado', 'success');
        }
    });
};

mostrarReportes();
});