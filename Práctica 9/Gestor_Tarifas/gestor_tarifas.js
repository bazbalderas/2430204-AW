// Gestor de tarifas - JS
document.addEventListener('DOMContentLoaded', function(){
const btnAgregar = document.getElementById('btnAgregarTarifa');
const btnCerrar = document.getElementById('btnCerrarFormulario');
const form = document.getElementById('formTarifa');
const formContainer = document.getElementById('formTarifaContainer');
const tablaTarifas = document.getElementById('tablaTarifas');
let idCounter = JSON.parse(localStorage.getItem('tarifaIdCounter')) || 1;

btnAgregar.addEventListener('click', () => formContainer.classList.remove('hidden'));
btnCerrar.addEventListener('click', () => formContainer.classList.add('hidden'));
formContainer.addEventListener('click', (e) => { if(e.target === formContainer) formContainer.classList.add('hidden'); });

// Guardar tarifa
form.addEventListener('submit', function(event){
    event.preventDefault();

    const tarifa = {
        id: String(idCounter).padStart(3, '0'),
        descripcionServicio: document.getElementById('descripcionServicio').value,
        costoBase: parseFloat(document.getElementById('costoBase').value).toFixed(2),
        especialidadId: document.getElementById('especialidadId').value || null,
        estatus: document.querySelector('input[name="estatus"]:checked').value
    };

    let tarifas = JSON.parse(localStorage.getItem('tarifas')) || [];
    tarifas.push(tarifa);
    localStorage.setItem('tarifas', JSON.stringify(tarifas));

    idCounter++;
    localStorage.setItem('tarifaIdCounter', JSON.stringify(idCounter));

    Swal.fire({ icon: 'success', title: 'Tarifa guardada' });
    
    form.reset();
    formContainer.classList.add('hidden');
    mostrarTarifas();
});

// Mostrar tarifas
function mostrarTarifas(){
    const tarifas = JSON.parse(localStorage.getItem('tarifas')) || [];
    tablaTarifas.innerHTML = '';

    tarifas.forEach((tarifa) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2">${tarifa.id}</td>
            <td class="border px-4 py-2">${tarifa.descripcionServicio}</td>
            <td class="border px-4 py-2">$${tarifa.costoBase}</td>
            <td class="border px-4 py-2">${tarifa.especialidadId || 'N/A'}</td>
            <td class="border px-4 py-2">${tarifa.estatus === '1' ? 'Activo' : 'Inactivo'}</td>
            <td class="border px-4 py-2">
                <button class="bg-red-800 text-white px-2 py-1 rounded font-bold" onclick="eliminarTarifa('${tarifa.id}')">Eliminar</button>
            </td>
        `;
        tablaTarifas.appendChild(fila);
    }); 
}

// Eliminar tarifa
window.eliminarTarifa = function(id){
    Swal.fire({
        title: 'Advertencia',
        text: '¿Eliminar tarifa?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            let tarifas = JSON.parse(localStorage.getItem('tarifas')) || [];
            tarifas = tarifas.filter(t => t.id !== id);
            localStorage.setItem('tarifas', JSON.stringify(tarifas));
            mostrarTarifas();
            Swal.fire('Eliminado', 'Tarifa eliminada', 'success');
        }
    });
};

mostrarTarifas();
});