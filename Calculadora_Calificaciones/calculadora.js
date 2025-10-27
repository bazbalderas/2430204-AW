// Generarlos campos de materias y unidades
window.onload = function() {
    // Obtiene el número de materias desde localStorage
    const numMaterias = parseInt(localStorage.getItem('numMaterias'));
    const container = document.getElementById('materiasContainer');
    // Si no hay número válido, muestra mensaje
    if (!numMaterias || numMaterias <= 0) {
        container.innerHTML = '<p>No se especificó número de materias.</p>';
        return;
    }
    // Genera los campos para cada materia y sus 4 unidades
    for (let i = 1; i <= numMaterias; i++) {
        const div = document.createElement('div');
        div.className = 'materia';
        div.innerHTML = `<h3>Materia ${i}</h3>
            <label>Unidad 1: <input type="number" min="0" max="100" id="m${i}u1"></label>
            <label>Unidad 2: <input type="number" min="0" max="100" id="m${i}u2"></label>
            <label>Unidad 3: <input type="number" min="0" max="100" id="m${i}u3"></label>
            <label>Unidad 4: <input type="number" min="0" max="100" id="m${i}u4"></label>`;
        container.appendChild(div);
    }
}

// Función para calcular el promedio y mostrar el resultado por materia
function calcularPromedios() {
    // Obtiene el número de materias
    const numMaterias = parseInt(localStorage.getItem('numMaterias'));
    let resultados = '';
    // Recorre cada materia
    for (let i = 1; i <= numMaterias; i++) {
        let califs = [];
        let menorA70 = false;
        // Recorre cada unidad
        for (let u = 1; u <= 4; u++) {
            let val = parseFloat(document.getElementById(`m${i}u${u}`).value);
            // Valida que la calificación sea válida
            if (isNaN(val) || val < 0 || val > 100) {
                resultados += `<p>Materia ${i}: Calificación inválida en unidad ${u}</p>`;
                menorA70 = true;
                break;
            }
            if (val < 70) menorA70 = true;
            califs.push(val);
        }
        let promedio = 0;
        let estatus = '';
        // Si alguna unidad es menor a 70, el promedio es 60 y no aprobado
        if (menorA70) {
            promedio = 60;
            estatus = 'No aprobado';
        } else {
            promedio = califs.reduce((a,b)=>a+b,0)/4;
            estatus = promedio >= 70 ? 'Aprobado' : 'No aprobado';
        }
        resultados += `<p>Materia ${i}: Promedio = ${promedio.toFixed(2)} - ${estatus}</p>`;
    }
    // Muestra los resultados en el div correspondiente
    document.getElementById('resultados').innerHTML = resultados;
}

// Evento para calcular los promedios
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('calif').addEventListener('click', calcularPromedios);
});
