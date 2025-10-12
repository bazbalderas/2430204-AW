/*
  Página: Notas (lógica)
  Descripción: CRUD + Drag & Drop de tarjetas de notas tipo Kanban.
  Almacenamiento: localStorage key "notas".
  Estructura de nota:
    {
      id: string,
      titulo: string,
      descripcion: string,
      fecha: YYYY-MM-DD,
      columna: 'todo' | 'doing' | 'done',
      createdAt: ISOString,
      updatedAt: ISOString
    }
*/
(function(){
  class NotasApp {
    constructor() {
      this.notas = JSON.parse(localStorage.getItem('notas')) || [];
      this.notaArrastrada = null;
      this.init();
    }

    init() {
      this.bindEvents();
      this.renderizarNotas();
    }

    /** Registra listeners de UI y DnD */
    bindEvents() {
      document.getElementById('btn-agregar-nota').addEventListener('click', () => this.agregarNota());
      document.getElementById('nota-nueva-titulo').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.agregarNota();
      });

      document.addEventListener('dragstart', (e) => this.inicioArrastre(e));
      document.addEventListener('dragover', (e) => this.mientrasArrastra(e));
      document.addEventListener('drop', (e) => this.soltar(e));
      document.addEventListener('dragend', (e) => this.finArrastre(e));
    }
    /** Crea una nueva nota desde los campos del encabezado */
    agregarNota() {
      const titleInput = document.getElementById('nota-nueva-titulo');
      const descriptionInput = document.getElementById('nota-nueva-descripcion');
      const dateInput = document.getElementById('nota-nueva-fecha');
      
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();
      const date = dateInput.value || new Date().toISOString().split('T')[0];

      if (!title) {
        titleInput.focus();
        return;
      }

      const nota = {
        id: Date.now().toString(),
        titulo: title,
        descripcion: description,
        fecha: date,
        columna: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.notas.push(nota);
      this.guardarNotas();
      this.renderizarNotas();
      
      titleInput.value = '';
      descriptionInput.value = '';
      dateInput.value = '';
      titleInput.focus();
    }

  /** Elimina nota por id */
  eliminarNota(notaId) {
      this.notas = this.notas.filter(n => n.id !== notaId);
      this.guardarNotas();
      this.renderizarNotas();
    }

  /** Actualiza un campo de una nota y persiste */
  actualizarNota(notaId, campo, valor) {
      const nota = this.notas.find(n => n.id === notaId);
      if (nota) {
        nota[campo] = valor;
        nota.updatedAt = new Date().toISOString();
        this.guardarNotas();
      }
    }

  /** Cambia la columna de una nota y vuelve a renderizar */
  moverNota(notaId, nuevaColumna) {
      const nota = this.notas.find(n => n.id === notaId);
      if (nota) {
        nota.columna = nuevaColumna;
        nota.updatedAt = new Date().toISOString();
        this.guardarNotas();
        this.renderizarNotas();
      }
    }

  /** Construye el elemento DOM de una nota desde la plantilla */
  crearElementoNota(nota) {
      const template = document.getElementById('plantilla-nota');
      const noteElement = template.content.cloneNode(true);
      
      const noteArticle = noteElement.querySelector('.nota');
      noteArticle.dataset.noteId = nota.id;
      
      const titleElement = noteElement.querySelector('.nota-titulo');
      titleElement.textContent = nota.titulo;
      titleElement.addEventListener('blur', (e) => {
        this.actualizarNota(nota.id, 'titulo', e.target.textContent.trim());
      });
      
      const dateElement = noteElement.querySelector('.nota-fecha-entrada');
      dateElement.value = nota.fecha || new Date().toISOString().split('T')[0];
      dateElement.addEventListener('change', (e) => {
        this.actualizarNota(nota.id, 'fecha', e.target.value);
      });
      
      const descriptionElement = noteElement.querySelector('.nota-descripcion');
      descriptionElement.textContent = nota.descripcion;
      descriptionElement.addEventListener('blur', (e) => {
        this.actualizarNota(nota.id, 'descripcion', e.target.textContent.trim());
      });
      
      const deleteBtn = noteElement.querySelector('.btn-eliminar-nota');
      deleteBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
          this.eliminarNota(nota.id);
        }
      });
      
      return noteElement;
    }

  /** Limpia columnas y pinta todas las notas según su columna */
  renderizarNotas() {
      document.getElementById('col-todo').innerHTML = '';
      document.getElementById('col-doing').innerHTML = '';
      document.getElementById('col-done').innerHTML = '';
      
      this.notas.forEach(nota => {
        const noteElement = this.crearElementoNota(nota);
        const columnElement = document.getElementById(`col-${nota.columna}`);
        columnElement.appendChild(noteElement);
      });
    }

  /** Marca inicio de arrastre de tarjeta */
  inicioArrastre(e) {
      if (e.target.classList.contains('nota')) {
        this.notaArrastrada = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    }

  /** Permite el drop en áreas válidas */
  mientrasArrastra(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }

  /** Mueve la nota a la columna de destino */
  soltar(e) {
      e.preventDefault();
      
      if (!this.notaArrastrada) return;
      
      const column = e.target.closest('.columna');
      if (column) {
        const columnType = column.dataset.column;
        const noteId = this.notaArrastrada.dataset.noteId;
        this.moverNota(noteId, columnType);
      }
    }

  /** Limpia estilos de arrastre */
  finArrastre(e) {
      if (e.target.classList.contains('nota')) {
        e.target.classList.remove('dragging');
      }
      this.notaArrastrada = null;
    }

  /** Persiste el arreglo de notas en localStorage */
  guardarNotas() {
      localStorage.setItem('notas', JSON.stringify(this.notas));
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    new NotasApp();
  });
})();
