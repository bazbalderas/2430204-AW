// Gestor de pagos - JS
document.addEventListener('DOMContentLoaded', function(){
const btnAgregar = document.getElementById('btnAgregarPago');
const btnCerrar = document.getElementById('btnCerrarFormulario');
const form = document.getElementById('formPago');
const formContainer = document.getElementById('formPagoContainer');
const tablaPagos = document.getElementById('tablaPagos');
let idCounter = JSON.parse(localStorage.getItem('pagoIdCounter')) || 1;

btnAgregar.addEventListener('click', () => formContainer.classList.remove('hidden'));
btnCerrar.addEventListener('click', () => formContainer.classList.add('hidden'));
formContainer.addEventListener('click', (e) => { if(e.target === formContainer) formContainer.classList.add('hidden'); });

// Guardar pago
form.addEventListener('submit', function(event){
    event.preventDefault();

    const fechaPago = new Date().toLocaleString('es-MX');

    const pago = {
        id: String(idCounter).padStart(3, '0'),
        idCita: document.getElementById('idCita').value,
        idPaciente: document.getElementById('idPaciente').value,
        monto: parseFloat(document.getElementById('monto').value).toFixed(2),
        metodoPago: document.getElementById('metodoPago').value,
        fechaPago: fechaPago,
        referencia: document.getElementById('referencia').value,
        estatusPago: document.getElementById('estatusPago').value
    };

    let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    pagos.push(pago);
    localStorage.setItem('pagos', JSON.stringify(pagos));

    idCounter++;
    localStorage.setItem('pagoIdCounter', JSON.stringify(idCounter));

    Swal.fire({ icon: 'success', title: 'Pago registrado' });
    
    form.reset();
    formContainer.classList.add('hidden');
    mostrarPagos();
});

// Mostrar pagos
function mostrarPagos(){
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    tablaPagos.innerHTML = '';

    pagos.forEach((pago) => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td class="border px-4 py-2">${pago.id}</td>
            <td class="border px-4 py-2">${pago.idCita}</td>
            <td class="border px-4 py-2">${pago.idPaciente}</td>
            <td class="border px-4 py-2">$${pago.monto}</td>
            <td class="border px-4 py-2">${pago.metodoPago}</td>
            <td class="border px-4 py-2">${pago.fechaPago}</td>
            <td class="border px-4 py-2">${pago.referencia}</td>
            <td class="border px-4 py-2">${pago.estatusPago}</td>
            <td class="border px-4 py-2">
                <button class="bg-red-800 text-white px-2 py-1 rounded font-bold" onclick="eliminarPago('${pago.id}')">Eliminar</button>
            </td>
        `;
        tablaPagos.appendChild(fila);
    }); 
}

// Eliminar pago
window.eliminarPago = function(id){
    Swal.fire({
        title: 'Advertencia',
        text: '¿Eliminar pago?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Eliminar'
    }).then((result) => {
        if(result.isConfirmed){
            let pagos = JSON.parse(localStorage.getItem('pagos')) || [];
            pagos = pagos.filter(p => p.id !== id);
            localStorage.setItem('pagos', JSON.stringify(pagos));
            mostrarPagos();
            Swal.fire('Eliminado', 'Pago eliminado', 'success');
        }
    });
};

mostrarPagos();
});