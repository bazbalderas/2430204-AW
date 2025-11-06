const loginFormulario = document.getElementById('loginFormulario');

//Usuario por defecto
const ADMIN = 'admin';
const PASS = 'colofox';

loginFormulario.addEventListener('submit', function(event){
    event.preventDefault();

    //Obtenemos los valores de los campos desde el formulario
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('contraseña').value;

    //Traemos los valores del localStorage
    const usuarioRegistrado = localStorage.getItem('usuarioRegistrado');
    const passRegistrado = localStorage.getItem('passRegistrado');

    //Validamos que el usuario y la contraseña coincidan con los del admin
    if((user === ADMIN && pass === PASS) ||
    (user === usuarioRegistrado && pass === passRegistrado)){
        Swal.fire({
            icon: 'success',
            title: '¡Bien venido!',
            text: 'Te estamos redireccionando...' 
        }).then(()=> {
        window.location.href = "/Práctica 9/Dashboard/dashboard.html";
                loginFormulario.reset();
    });

    } else{
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Contraseña o Correo inválidos, porfavor verifica tus credenciales' 
        });
                loginFormulario.reset();
    }
});