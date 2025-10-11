(function(){
  class NotesApp {
    constructor() {
      this.notes = JSON.parse(localStorage.getItem('notes')) || [];
      this.draggedNote = null;
      this.init();
    }

    init() {
      this.bindEvents();
      this.renderNotes();
    }

    bindEvents() {
      // Agregar nota
      document.getElementById('add-note-btn').addEventListener('click', () => this.addNote());
      document.getElementById('new-note-title').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') this.addNote();
      });

      // Eventos de drag and drop
      document.addEventListener('dragstart', (e) => this.handleDragStart(e));
      document.addEventListener('dragover', (e) => this.handleDragOver(e));
      document.addEventListener('drop', (e) => this.handleDrop(e));
      document.addEventListener('dragend', (e) => this.handleDragEnd(e));

      // Papelera
      const trash = document.getElementById('trash');
      trash.addEventListener('dragover', (e) => this.handleTrashDragOver(e));
      trash.addEventListener('drop', (e) => this.handleTrashDrop(e));
      trash.addEventListener('dragleave', () => trash.classList.remove('drag-over'));
    }

    addNote() {
      const titleInput = document.getElementById('new-note-title');
      const descriptionInput = document.getElementById('new-note-description');
      
      const title = titleInput.value.trim();
      const description = descriptionInput.value.trim();

      if (!title) {
        titleInput.focus();
        return;
      }

      const note = {
        id: Date.now().toString(),
        title: title,
        description: description,
        column: 'todo',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      this.notes.push(note);
      this.saveNotes();
      this.renderNotes();
      
      // Limpiar campos
      titleInput.value = '';
      descriptionInput.value = '';
      titleInput.focus();
    }

    deleteNote(noteId) {
      this.notes = this.notes.filter(note => note.id !== noteId);
      this.saveNotes();
      this.renderNotes();
    }

    updateNote(noteId, field, value) {
      const note = this.notes.find(n => n.id === noteId);
      if (note) {
        note[field] = value;
        note.updatedAt = new Date().toISOString();
        this.saveNotes();
      }
    }

    moveNote(noteId, newColumn) {
      const note = this.notes.find(n => n.id === noteId);
      if (note) {
        note.column = newColumn;
        note.updatedAt = new Date().toISOString();
        this.saveNotes();
        this.renderNotes();
      }
    }

    formatDate(dateString) {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = now - date;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 0) {
        return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
      } else if (diffDays === 1) {
        return 'Ayer';
      } else if (diffDays < 7) {
        return `${diffDays} días`;
      } else {
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' });
      }
    }

    createNoteElement(note) {
      const template = document.getElementById('note-template');
      const noteElement = template.content.cloneNode(true);
      
      const noteArticle = noteElement.querySelector('.note');
      noteArticle.dataset.noteId = note.id;
      
      const titleElement = noteElement.querySelector('.note-title');
      titleElement.textContent = note.title;
      titleElement.addEventListener('blur', (e) => {
        this.updateNote(note.id, 'title', e.target.textContent.trim());
      });
      
      const dateElement = noteElement.querySelector('.note-date');
      dateElement.textContent = this.formatDate(note.createdAt);
      
      const descriptionElement = noteElement.querySelector('.note-description');
      descriptionElement.textContent = note.description;
      descriptionElement.addEventListener('blur', (e) => {
        this.updateNote(note.id, 'description', e.target.textContent.trim());
      });
      
      const deleteBtn = noteElement.querySelector('.delete-btn');
      deleteBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
          this.deleteNote(note.id);
        }
      });
      
      return noteElement;
    }

    renderNotes() {
      // Limpiar columnas - Borra todas las notas antes de renderizar nuevamente
      document.getElementById('col-todo').innerHTML = '';
      document.getElementById('col-doing').innerHTML = '';
      document.getElementById('col-done').innerHTML = '';
      
      // Renderizar notas por columna - Agregar cada nota a su columna correspondiente
      this.notes.forEach(note => {
        const noteElement = this.createNoteElement(note);
        const columnElement = document.getElementById(`col-${note.column}`);
        columnElement.appendChild(noteElement);
      });
    }

    handleDragStart(e) {
      if (e.target.classList.contains('note')) {
        this.draggedNote = e.target;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
      }
    }

    handleDragOver(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
    }

    handleDrop(e) {
      e.preventDefault();
      
      if (!this.draggedNote) return;
      
      const column = e.target.closest('.column');
      if (column) {
        const columnType = column.dataset.column;
        const noteId = this.draggedNote.dataset.noteId;
        this.moveNote(noteId, columnType);
      }
    }

    handleDragEnd(e) {
      if (e.target.classList.contains('note')) {
        e.target.classList.remove('dragging');
      }
      this.draggedNote = null;
    }

    handleTrashDragOver(e) {
      e.preventDefault();
      e.target.classList.add('drag-over');
    }

    handleTrashDrop(e) {
      e.preventDefault();
      const trash = e.target;
      trash.classList.remove('drag-over');
      
      if (this.draggedNote) {
        const noteId = this.draggedNote.dataset.noteId;
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
          this.deleteNote(noteId);
        }
      }
    }

    saveNotes() {
      localStorage.setItem('notes', JSON.stringify(this.notes));
    }
  }

  // Inicializar la aplicación
  document.addEventListener('DOMContentLoaded', () => {
    new NotesApp();
  });
})();
