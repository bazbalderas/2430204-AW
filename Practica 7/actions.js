// Base de datos de usuarios en localStorage
function inicializarUsuarios() {
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Crear usuario admin si no existe
    const adminExiste = usuarios.find(u => u.email === 'Dr_Mario_House@gmail.com');
    if (!adminExiste) {
        const admin = {
            id: 1,
            email: 'Dr_Mario_House@gmail.com',
            contrasena: 'Chivas_in_tha_house',
            tipo: 'admin',
            fechaRegistro: new Date().toISOString()
        };
        usuarios.push(admin);
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
    }
}

// Inicializar al cargar la página
inicializarUsuarios();

// Variables para el sistema de login
const inicioSesion = document.getElementById('btnInicioSesion'); 
const registroBtn = document.getElementById('btnRegistro');
const messageElement = document.getElementById('mensajito'); 

// Validar formato de email
function validarEmail(email) {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
}

// FUNCIONES DE AUTENTICACIÓN

// Buscar usuario por email y contraseña
function buscarUsuario(email, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    return usuarios.find(u => u.email === email && u.contrasena === contrasena);
}

// Registrar nuevo usuario
function registrarUsuario(email, contrasena) {
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    
    // Verificar si el email ya existe
    const usuarioExiste = usuarios.find(u => u.email === email);
    if (usuarioExiste) {
        return { exito: false, mensaje: 'Este email ya está registrado' };
    }
    
    // Crear nuevo usuario
    const nuevoUsuario = {
        id: usuarios.length + 1,
        email: email,
        contrasena: contrasena,
        tipo: 'usuario',
        fechaRegistro: new Date().toISOString()
    };
    
    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    
    return { exito: true, mensaje: 'Usuario registrado exitosamente' };
}

// Iniciar sesión del usuario
function iniciarSesionUsuario(email, contrasena) {
    const usuario = buscarUsuario(email, contrasena);
    
    if (usuario) {
        // Actualizar fecha de último login
        usuario.ultimoLogin = new Date().toISOString();
        
        // Guardar usuarios actualizados
        const usuarios = JSON.parse(localStorage.getItem('usuarios'));
        const index = usuarios.findIndex(u => u.id === usuario.id);
        usuarios[index] = usuario;
        localStorage.setItem('usuarios', JSON.stringify(usuarios));
        
        // Guardar usuario activo
        localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
        
        return { exito: true, usuario: usuario };
    } else {
        return { exito: false, mensaje: 'Email o contraseña incorrectos' };
    }
}

// EVENTOS DE LA INTERFAZ

// Función para mostrar/ocultar formularios
function mostrarFormulario(tipo) {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (tipo === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}

// Evento de login
if (inicioSesion) {
    inicioSesion.addEventListener('click', function(evento){
        evento.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const contrasena = document.getElementById('password').value;

        if (!validarEmail(email)) {
            messageElement.style.color = 'red';
            messageElement.textContent = 'Por favor ingresa un email válido';
            return;
        }

        if (contrasena.length === 0) {
            messageElement.style.color = 'red';
            messageElement.textContent = 'Por favor ingresa tu contraseña';
            return;
        }

        const resultado = iniciarSesionUsuario(email, contrasena);
        
        if (resultado.exito) {
            messageElement.style.color = 'green';
            messageElement.textContent = `¡Bienvenido! Redirigiendo...`;
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 2000);
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = resultado.mensaje;
        }
    });
}

// Evento de registro
if (registroBtn) {
    registroBtn.addEventListener('click', function(evento){
        evento.preventDefault();
        
        const email = document.getElementById('emailRegistro').value.trim();
        const contrasena = document.getElementById('passwordRegistro').value;
        const confirmarContrasena = document.getElementById('confirmarPassword').value;

        // Validaciones
        if (!validarEmail(email)) {
            messageElement.style.color = 'red';
            messageElement.textContent = 'Por favor ingresa un email válido';
            return;
        }

        if (contrasena.length < 4) {
            messageElement.style.color = 'red';
            messageElement.textContent = 'La contraseña debe tener al menos 4 caracteres';
            return;
        }

        if (contrasena !== confirmarContrasena) {
            messageElement.style.color = 'red';
            messageElement.textContent = 'Las contraseñas no coinciden';
            return;
        }

        const resultado = registrarUsuario(email, contrasena);
        
        if (resultado.exito) {
            messageElement.style.color = 'green';
            messageElement.textContent = resultado.mensaje + '. Ahora puedes iniciar sesión';
            setTimeout(() => {
                mostrarFormulario('login');
                // Limpiar formularios
                document.getElementById('emailRegistro').value = '';
                document.getElementById('passwordRegistro').value = '';
                document.getElementById('confirmarPassword').value = '';
                messageElement.textContent = '';
            }, 2000);
        } else {
            messageElement.style.color = 'red';
            messageElement.textContent = resultado.mensaje;
        }
    });
}