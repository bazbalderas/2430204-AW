(function(){
  const INPUT = document.getElementById('new-note-input');
  const BTN_ADD = document.getElementById('add-note-btn');
  const COLS = {
    todo: document.getElementById('col-todo'),
    doing: document.getElementById('col-doing'),
    done: document.getElementById('col-done')
  };
  const TRASH = document.getElementById('trash');
  const TPL = document.getElementById('note-template');

  const STORAGE_KEY = 'p7_notas_v1';
  let state = loadState();

  // Render inicial
  renderAll();

  // Eventos creación
  BTN_ADD?.addEventListener('click', () => tryCreate());
  INPUT?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      tryCreate();
    }
  });

  function tryCreate(){
    const text = (INPUT?.value || '').trim();
    if(!text) return;
    const note = createNote(text, 'todo');
    INPUT.value = '';
    saveState();
  }

  function createNote(text, column){
    const id = cryptoRandomId();
    const node = instantiateNote({ id, text, column });
    state.push({ id, text, column });
    COLS[column].appendChild(node);
    return node;
  }

  function instantiateNote({ id, text, column }){
    const clone = TPL.content.firstElementChild.cloneNode(true);
    clone.dataset.id = id;
    const textDiv = clone.querySelector('.note-text');
    const delBtn = clone.querySelector('.delete-btn');
    textDiv.textContent = text;

    enableDragAndDrop(clone);

    // Editar texto inline
    textDiv.addEventListener('input', () => {
      const item = state.find(n => n.id === id);
      if(item){ item.text = textDiv.textContent || ''; saveState(); }
    });

    // Borrar por botón
    delBtn.addEventListener('click', () => removeNoteElement(clone));

    return clone;
  }

  function enableDragAndDrop(el){
    el.addEventListener('dragstart', (e) => {
      el.classList.add('dragging');
      e.dataTransfer.setData('text/plain', el.dataset.id);
      e.dataTransfer.effectAllowed = 'move';
    });
    el.addEventListener('dragend', () => {
      el.classList.remove('dragging');
    });
  }

  // Set up drop zones (columnas)
  Object.entries(COLS).forEach(([colKey, container]) => {
    container.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      container.classList.add('drag-over');
    });
    container.addEventListener('dragleave', () => container.classList.remove('drag-over'));
    container.addEventListener('drop', (e) => {
      e.preventDefault();
      container.classList.remove('drag-over');
      const id = e.dataTransfer.getData('text/plain');
      const noteEl = findNoteEl(id);
      if(noteEl){
        container.appendChild(noteEl);
        updateNoteColumn(id, colKey);
      }
    });
  });

  // Papelera
  TRASH.addEventListener('dragover', (e) => { e.preventDefault(); TRASH.classList.add('drag-over'); });
  TRASH.addEventListener('dragleave', () => TRASH.classList.remove('drag-over'));
  TRASH.addEventListener('drop', (e) => {
    e.preventDefault();
    TRASH.classList.remove('drag-over');
    const id = e.dataTransfer.getData('text/plain');
    const noteEl = findNoteEl(id);
    if(noteEl){ removeNoteElement(noteEl); }
  });

  function removeNoteElement(el){
    const id = el.dataset.id;
    el.remove();
    state = state.filter(n => n.id !== id);
    saveState();
  }

  function updateNoteColumn(id, column){
    const item = state.find(n => n.id === id);
    if(item){ item.column = column; saveState(); }
  }

  function renderAll(){
    // limpiar
    Object.values(COLS).forEach(c => c.innerHTML = '');
    // render
    state.forEach(n => {
      const node = instantiateNote(n);
      const container = COLS[n.column] || COLS.todo;
      container.appendChild(node);
    });
  }

  function saveState(){
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }
  function loadState(){
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) return [];
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed)) return parsed.filter(v => v && typeof v.id==='string');
      return [];
    } catch { return []; }
  }

  function findNoteEl(id){
    return document.querySelector(`.note[data-id="${id}"]`);
  }

  function cryptoRandomId(){
    if (window.crypto?.getRandomValues) {
      const buf = new Uint8Array(8);
      window.crypto.getRandomValues(buf);
      return [...buf].map(b => b.toString(16).padStart(2,'0')).join('');
    }
    return Math.random().toString(16).slice(2) + Date.now().toString(16);
  }
})();
