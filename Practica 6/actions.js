// Vector global para almacenar el usuario activo
window.usuarioActivo = [];

// Variables para el sistema de login
const inicioSesion = document.getElementById('btnInicioSesion'); 
const messageElement = document.getElementById('mensajito'); 

//Función que vi en: https://www.verificaremails.com/validar-formularios-javascript/ 
//Sirve para verificar que el email se escriba en orden correcto. Ejemplo: mario_es_genial@upv.edu.mx
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

// Función para guardar usuario activo y redirigir al dashboard
function iniciarSesionUsuario(email, contrasena) {
    // Crear objeto del usuario que se logea
    const usuario = {
        email: email,
        contrasena: contrasena,
        fechaLogin: new Date(),
        nombre: email.split('@')[0] // Usar la parte antes del @ como nombre
    };
    
    // Agregar al vector de usuario activo
    window.usuarioActivo.push(usuario);
    
    // Guardar en localStorage para poder acceder desde el dashboard
    localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    
    // Mostrar en consola para verificar
    console.log('Usuario activo:', window.usuarioActivo);
    
    // Redirigir al dashboard después de 2 segundos
    setTimeout(() => {
        window.location.href = 'dashboard.htm';
    }, 2000);
}

//Evento cuando presionemos el botón de ingresar
if (inicioSesion) {
    inicioSesion.addEventListener('click', function(evento){
        evento.preventDefault(); // Evita que el formulario se envíe y recargue la página
        
        //Se crean variables para mandar llamar a los textareas del email y contraseña
        const email = document.getElementById('email').value;
        const contrasena = document.getElementById('password').value;

        //Se resume la funcion de validar email en una variable
        validacion = validarEmail(email);

        //Si validacion es verdadera entonces se inicia sesión
        if (validacion && contrasena.length > 0){
            messageElement.style.color = 'green';
            messageElement.textContent = '¡Ingresando al sistema! Redirigiendo...';
            iniciarSesionUsuario(email, contrasena);
        }
        //Sino se cumple entonces manda mensaje de error
        else{ 
            messageElement.style.color = 'red';
            messageElement.textContent = 'Datos inválidos. Verifica tu email y contraseña :(';
        }
    });
}