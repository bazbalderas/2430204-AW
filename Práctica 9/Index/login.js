const loginFormulario = document.getElementById('loginFormulario');

//Usuario por defecto
const ADMIN = 'admin';
const PASS = 'colofox';

loginFormulario.addEventListener('submit', function(event){
    event.preventDefault();

    //Obtenemos los valores de los campos desde el formulario
    const user = document.getElementById('usuario').value;
    const pass = document.getElementById('contraseña').value;

    //Validamos que el usuario y la contraseña coincidan con los del admin
    if((user === ADMIN && pass === PASS) ||
    (user === usuario && pass === contraseña)){
        alert("Bien venido al SCHSM");
        window.location.href = "/Práctica 9/Dashboard/dashboard.html";
                loginFormulario.reset();
    } else{
        alert("Usuario o contraseña incorrectos");
        loginFormulario.reset();
    }

    
});