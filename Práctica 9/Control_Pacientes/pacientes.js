//Mostrar y ocultar el formulario
document.addEventListener('DOMContentLoaded', function(){
const btnAgregar = document.getElementById('btnAgregarPaciente');
const btnCerrar = document.getElementById('');
const btn = document.getElementById('btnAgregarPaciente');
const form = document.getElementById('formPaciente');

//Mostrar Formulario
btn.addEventListener('click', function(){
    form.classList.remove('hidden');
});

//Cerrar Formulario
btn.addEventListener('click', function(){
    form.classList.add('hidden');
});

//Guardar paciente
form.addEventListener('submit', function(event){
    event.preventDefault();

    const paciente={

        id: String(idCounter).padStart(3, '0'),
        nombre: document.getElementById('nombre').value,
        curp: document.getElementById('curp').value,
        fechaNacimiento: document.getElementById('fechaNacimiento').value,
        sexo: document.getElementById('sexo').value,
        telefono: document.getElementById('telefono').value,
        email: document.getElementById('email').value,
    }

});

});