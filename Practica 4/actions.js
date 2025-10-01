const inicioSesion = document.getElementById('btnInicioSesion');
const messageElement = document.getElementById('mensajito');

function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

inicioSesion.addEventListener('click', function(evento){
    evento.preventDefault();

    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;

    validacion = validarEmail(email);

    if (validacion){
        messageElement.style.color = 'green';
        messageElement.textContent = '¡Cuenta registrada exitosamente! :D';
    }
    else{
        messageElement.style.color = 'red';
        messageElement.textContent = 'Correo inválido. intenta de nuevo poliamigo :(';
        
    }
});