  //Inicializacion de variables para traerlas desde el html
  const usuario = document.getElementById('name');
   const correo = document.getElementById('email');
   const contra = document.getElementById('pass');
   const confcontra = document.getElementById('confpass');
   const mensaje = document.getElementById('messageError');

   //Función al darle click al botón registrarse
    addEventListener('click'(button('registrar'))){
    evento.preventDefault();

    //Caso if para verificar que la contraseña sea mayor a 6 caracteres
    const usuariovalue = document.getElementById('name').value;
   const correovalue = document.getElementById('email').value;
   const contravalue = document.getElementById('pass').value;
   const confcontravalue = document.getElementById('confpass').value;
   const mensajevalue = document.getElementById('messageError').value;
    
    if(contravalue >= 6){
        console.log("La contraseña debe ser con un mínimo de 6 caracteres");
    } else{
            if(confcontra === contravalue){ //verificar que las contraseñas coincidan
                    messageElement.textContent('Registro realizado exitosamente :D');
        }
    
    }
}

