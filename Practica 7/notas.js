// Página: Notas
(function(){
  //Creamos una clase para manejar la aplicación de notas que es la principal
  class NotasApp {
    constructor() { // Inicializa estado y carga notas desde localStorage
      this.notas = JSON.parse(localStorage.getItem('notas')) || []; // Arreglo de notas

      // Normalizamos columnas antiguas (todo/doing/done) a español (porhacer/enprogreso/hecho)
      this.notas = this.notas.map(n => {
        const mapa = { todo: 'porhacer', doing: 'enprogreso', done: 'hecho' };
        return { ...n, columna: mapa[n.columna] || n.columna || 'porhacer' };
      });

      this.notaArrastrada = null;
      this.init(); // Configura eventos y renderiza notas
    }

    // Configura eventos y renderiza notas
    init() {
      this.bindEvents();
      this.renderizarNotas();
    }

    // Registra listeners de los botones y eventos de arrastre
    bindEvents() {
      document.getElementById('btn-agregar-nota').addEventListener('click', () => this.agregarNota());
      document.getElementById('nota-nueva-titulo').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.agregarNota();
      });

      // Eventos de arrastre para notas que es lo que mencionamos unas 7 lineas antes
      document.addEventListener('dragstart', (e) => this.inicioArrastre(e));
      document.addEventListener('dragover', (e) => this.mientrasArrastra(e));
      document.addEventListener('drop', (e) => this.soltar(e));
      document.addEventListener('dragend', (e) => this.finArrastre(e));
    }
    // Crea una nueva nota desde los campos del encabezado tomando los valores desde
    // los textarea del formulario html
    agregarNota() {
      const inputTitulo = document.getElementById('nota-nueva-titulo');
      const inputDescripcion = document.getElementById('nota-nueva-descripcion');
      const inputFecha = document.getElementById('nota-nueva-fecha');
      
      // Validar título no vacío
      const titulo = inputTitulo.value.trim();
      const descripcion = inputDescripcion.value.trim();
      const fecha = inputFecha.value || new Date().toISOString().split('T')[0]; //

      if (!titulo) {
        inputTitulo.focus();
        return;
      }

      const nota = {
        id: Date.now().toString(),
        titulo: titulo,
        descripcion: descripcion,
        fecha: fecha,
        columna: 'porhacer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.notas.push(nota);
      this.guardarNotas();
      this.renderizarNotas();
      
      inputTitulo.value = '';
      inputDescripcion.value = '';
      inputFecha.value = '';
      inputTitulo.focus();
    }

  // Elimina nota por id
  eliminarNota(notaId) {
      this.notas = this.notas.filter(n => n.id !== notaId);
      this.guardarNotas();
      this.renderizarNotas();
    }

  // Actualiza un campo de una nota y persiste
  actualizarNota(notaId, campo, valor) {
      const nota = this.notas.find(n => n.id === notaId);
      if (nota) {
        nota[campo] = valor;
        nota.updatedAt = new Date().toISOString();
        this.guardarNotas();
      }
    }

  // Cambia la columna de una nota y vuelve a renderizar
  moverNota(notaId, nuevaColumna) {
      const nota = this.notas.find(n => n.id === notaId);
      if (nota) {
        // valores esperados: porhacer | enprogreso | hecho
        const mapa = { todo: 'porhacer', doing: 'enprogreso', done: 'hecho' };
        nota.columna = mapa[nuevaColumna] || nuevaColumna || 'porhacer';
        nota.updatedAt = new Date().toISOString();
        this.guardarNotas();
        this.renderizarNotas();
      }
    }

  // Construye el elemento DOM de una nota desde la plantilla
  crearElementoNota(nota) {
      const template = document.getElementById('plantilla-nota');
      const fragmento = template.content.cloneNode(true);
      
      const articuloNota = fragmento.querySelector('.nota');
      articuloNota.dataset.noteId = nota.id;
      
      const elemTitulo = fragmento.querySelector('.nota-titulo');
      elemTitulo.textContent = nota.titulo;
      elemTitulo.addEventListener('blur', (e) => {
        this.actualizarNota(nota.id, 'titulo', e.target.textContent.trim());
      });
      
      const elemFecha = fragmento.querySelector('.nota-fecha-entrada');
      elemFecha.value = nota.fecha || new Date().toISOString().split('T')[0];
      elemFecha.addEventListener('change', (e) => {
        this.actualizarNota(nota.id, 'fecha', e.target.value);
      });
      
      const elemDescripcion = fragmento.querySelector('.nota-descripcion');
      elemDescripcion.textContent = nota.descripcion;
      elemDescripcion.addEventListener('blur', (e) => {
        this.actualizarNota(nota.id, 'descripcion', e.target.textContent.trim());
      });
      
      const btnEliminar = fragmento.querySelector('.btn-eliminar-nota');
      btnEliminar.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
          this.eliminarNota(nota.id);
        }
      });
      
      return fragmento;
    }

  // Limpia columnas y pinta todas las notas según su columna
  renderizarNotas() {
      // IDs en español
      const cPH = document.getElementById('col-porhacer');
      const cEP = document.getElementById('col-enprogreso');
      const cH = document.getElementById('col-hecho');
      if (cPH) cPH.innerHTML = '';
      if (cEP) cEP.innerHTML = '';
      if (cH) cH.innerHTML = '';
      
      this.notas.forEach(nota => {
        const col = nota.columna || 'porhacer';
        const columnaDestino = document.getElementById(`col-${col}`);
        if (columnaDestino) columnaDestino.appendChild(this.crearElementoNota(nota));
      });
    }

  // Marca inicio de arrastre de tarjeta
  inicioArrastre(e) {
      if (e.target.classList.contains('nota')) {
        this.notaArrastrada = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    }

  // Permite el drop en áreas válidas
  mientrasArrastra(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }

  // Mueve la nota a la columna de destino
  soltar(e) {
      e.preventDefault();
      
      if (!this.notaArrastrada) return;
      
      const columna = e.target.closest('.columna');
      if (columna) {
        const tipoColumna = columna.dataset.column; // porhacer | enprogreso | hecho
        const idNota = this.notaArrastrada.dataset.noteId;
        this.moverNota(idNota, tipoColumna);
      }
    }

  // Limpia estilos de arrastre
  finArrastre(e) {
      if (e.target.classList.contains('nota')) {
        e.target.classList.remove('dragging');
      }
      this.notaArrastrada = null;
    }

  // Persiste el arreglo de notas en localStorage
  guardarNotas() {
      localStorage.setItem('notas', JSON.stringify(this.notas));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new NotasApp();
  });
})();
