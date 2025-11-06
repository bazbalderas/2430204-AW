const loginFormulario = document.getElementById('loginFormulario');

loginFormulario.addEventListener('submit', function(event){
    event.preventDefault();

    // Obtener los valores dentro del evento
    const name = document.getElementById('nombre').value.trim();
    const phone = document.getElementById('telefono').value.trim();
    const email = document.getElementById('correo').value.trim();
    const user = document.getElementById('usuario').value.trim();
    const pass = document.getElementById('contraseña').value;
    const conf_pass = document.getElementById('conf_contraseña').value;

    document.getElementById('contraseñaError').textContent = "";
    document.getElementById('confPassError').textContent = "";
    document.getElementById('correoError').textContent = "";

    // Validación de longitud de contraseña
    if(pass.length < 5){
        document.getElementById('contraseñaError').textContent = "La contraseña debe ser mayor a 5 caracteres";
        return;
    }

    // Validación de coincidencia de contraseñas
    if(pass !== conf_pass){
        document.getElementById('confPassError').textContent = "Las contraseñas deben coincidir";
        return;
    }

    // Validación de email
    function validarEmail(email) {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    }

    if(!validarEmail(email)){
        document.getElementById('correoError').textContent = "El correo electrónico no es válido";
        return;
    }

    // Guardar en localStorage DESPUÉS de validar
    localStorage.setItem('usuarioRegistrado', user);
    localStorage.setItem('passRegistrado', pass);

    // Inicializar arreglo de usuarios
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const nuevoUsuario = {
        name: name,
        phone: phone,
        user: user,
        email: email,
        password: pass
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    Swal.fire({
        icon: 'success',
        title: '¡Registro completado!',
        text: 'Ahora puedes acceder a nuestro sitio web',
    }).then(() => {
        loginFormulario.reset();
        window.location.href = "/Práctica 9/Index/index.html";
    });
});