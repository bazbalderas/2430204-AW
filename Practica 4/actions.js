const inicioSesion = document.getElementById('btnInicioSesion'); //Hacemos una variable para llamar al boton de Ingresar, desde el html
const messageElement = document.getElementById('mensajito'); //Hacemos una variable para llamar al mensaje desde el HTML mediante el id

//Función que vi en: https://www.verificaremails.com/validar-formularios-javascript/ 
//Sirve para verificar que el email se escriba en orden correcto. Ejemplo: mario_es_genial@upv.edu.mx
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

//Evento cuando presionemos el botón de ingresar
inicioSesion.addEventListener('click', function(evento){
    evento.preventDefault(); // Evita que el formulario se envíe y recargue la página
    

    //Se crean variables para mandar llamar a los textareas del email y contraseña
    const email = document.getElementById('email').value;
    const contrasena = document.getElementById('password').value;

    //Se resume la funcion de validar email en una variable
    validacion = validarEmail(email);

    //Si validacion es verdadera entonces se pone en verde y se muestre un mensaje de exito, como lo que le falta a este trabajo
    if (validacion){
        messageElement.style.color = 'green';
        messageElement.textContent = '¡Cuenta registrada exitosamente! :D';
    }
    //Sino se cumple entonces manda a poner en rojo en campo y un mensaje de invalidez
    else{ 
        messageElement.style.color = 'red';
        messageElement.textContent = 'Correo inválido. intenta de nuevo poliamigo :(';
        
    }
});