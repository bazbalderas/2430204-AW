const loginFormulario = document.getElementById('loginFormulario');

const name = document.getElementById('nombre').value;
const phone = document.getElementById('telefono').value;
const email = document.getElementById('correo').value;
const user = document.getElementById('usuario').value;
const pass = document.getElementById('contraseña').value;
const conf_pass = document.getElementById('conf_contraseña').value;

loginFormulario.addEventListener('submit', function(event){
    event.preventDefault();

if(pass.lenght < 5){
    alert("La contraseña debe ser mayor a 5 caracteres");
    return;
}

if(pass !== conf_pass){
    alert("Las contraseñas deben coincidir");
    return;
}

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

if(!validarEmail(email)){
    alert("El correo electrónico no es válido");
    return;
}

// Inicializar arreglo de usuarios
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

const newUser = {
    name: name,
    phone: phone,
    user: user,
    email: email,
    password: pass
};

usuarios.psuh(newUser);
localStorage.setItem('usuarios', JSON.stringify(usuarios));

alert("Se completo tu registro")
loginFormulario.reset();
window.location.href = "/Práctica 9/Index/index.html";

});