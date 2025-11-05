//Traemos los IDs necesarios para poder hacer funcionar el registro (me falló todo)
const loginFormulario = document.getElementById('loginFormulario');

const name = document.getElementById('nombre').value;
const phone = document.getElementById('telefono').value;
const email = document.getElementById('correo').value;
const user = document.getElementById('usuario').value;
const pass = document.getElementById('contraseña').value;
const conf_pass = document.getElementById('conf_contraseña').value;

//Al clickear el botón de enviar inician las funciones del evento
loginFormulario.addEventListener('registrar', function(event){
    event.preventDefault();

    //Si la contraseña es menor a 5 caracteres
if(pass.lenght < 5){
    alert("La contraseña debe ser mayor a 5 caracteres");
    return;
}

//SI la contraseña y la confirmación de contraseña es diferente
if(pass !== conf_pass){
    alert("Las contraseñas deben coincidir");
    return;
}

//Función para validar que el email tenga la nomenclatura correcta
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

//VAlidar que el email sea válido
if(!validarEmail(email)){
    alert("El correo electrónico no es válido");
    return;
}

// Inicializar arreglo de usuarios para ir agregandolos, hacerles push al localStorage y enviar un mensaje antes de redireccionarlos hacia el inicio de sesion
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