// Dashboard - Cargar estadísticas
document.addEventListener('DOMContentLoaded', function(){
    cargarEstadisticas();
});

// Cargar estadísticas desde localStorage
function cargarEstadisticas(){
    const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];
    const medicos = JSON.parse(localStorage.getItem('medicos')) || [];
    const citas = JSON.parse(localStorage.getItem('citas')) || [];
    const pagos = JSON.parse(localStorage.getItem('pagos')) || [];
    
    document.getElementById('totalPacientes').textContent = pacientes.length;
    document.getElementById('totalMedicos').textContent = medicos.length;
    document.getElementById('totalCitas').textContent = citas.length;
    document.getElementById('totalPagos').textContent = pagos.length;
}

// Cerrar sesión
function cerrarSesion(){
    window.location.href = '/Práctica 9/Index/index.html';
}