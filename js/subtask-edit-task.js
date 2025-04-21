/** @type {{title: string, checked: boolean}[]} Die aktuell bearbeiteten Subtasks */
let editSubtasks = [];

/**
 * Initialisiert das Subtask-Inputfeld im Edit-Overlay, inklusive Eventlistener für Klick und Eingabe.
 * @param {Object} task - Die Aufgabe, deren Subtasks bearbeitet werden
 */
function setupEditSubtaskInput(task) {
  editSubtasks = task.subtasks || [];
  renderEditSubtasks();

  const input = document.getElementById("edit-subtask");
  const addBtn = document.getElementById("edit-Add-subtask-img");
  const cancelBtn = document.getElementById("edit-cancel-task-img");
  const acceptBtn = document.getElementById("edit-accept-task-img");
  const separator = document.getElementById("edit-small-separator");

  input.addEventListener("click", () => {
    addBtn.classList.add("dp-none");
    cancelBtn.classList.remove("dp-none");
    acceptBtn.classList.remove("dp-none");
    separator.classList.remove("dp-none");
  });

  input.addEventListener("input", () => {
    const hasText = input.value.trim().length > 0;
    // Hier könntest du visuelles Feedback einbauen, falls gewünscht
  });

  acceptBtn.onclick = () => {
    const value = input.value.trim();
    if (value) {
      editSubtasks.push({ title: value, checked: false });
      input.value = "";
      renderEditSubtasks();

      // UI zurücksetzen
      addBtn.classList.remove("dp-none");
      cancelBtn.classList.add("dp-none");
      acceptBtn.classList.add("dp-none");
      separator.classList.add("dp-none");
    }
  };

  cancelBtn.onclick = () => {
    input.value = "";

    // UI zurücksetzen
    addBtn.classList.remove("dp-none");
    cancelBtn.classList.add("dp-none");
    acceptBtn.classList.add("dp-none");
    separator.classList.add("dp-none");
  };
}

/**
 * Rendert alle aktuellen Subtasks im Edit-Overlay.
 */
function renderEditSubtasks() {
  const list = document.getElementById("edit-subtask-list");
  list.innerHTML = "";
  editSubtasks.forEach((subtask, index) => {
    list.innerHTML += getEditSubtaskTemplate(index, subtask);
  });
}

/**
 * Löscht ein Subtask-Element aus der Liste.
 * @param {number} index - Index des Subtasks im Array
 */
function deleteEditSubtask(index) {
  editSubtasks.splice(index, 1);
  renderEditSubtasks();
}

/**
 * Wechselt ein Subtask-Element in den Editiermodus und aktiviert Enter-Taste zur Bestätigung.
 * @param {number} index - Index des Subtasks im Array
 */
function editEditSubtaskItem(index) {
  const inputContainer = document.getElementById(`input-container-${index}`);
  const listItem = document.getElementById(`subtask-list-item-${index}`);
  const inputField = document.getElementById(`input-${index}`);

  inputContainer.classList.remove("dp-none");
  listItem.classList.add("dp-none");
  inputField.value = editSubtasks[index].title;

  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      editAcceptSubtaskItem(index);
    }
  });
}

/**
 * Speichert den neuen Text eines bearbeiteten Subtasks und rendert die Liste neu.
 * @param {number} index - Index des Subtasks im Array
 */
function editAcceptSubtaskItem(index) {
  const inputField = document.getElementById(`input-${index}`);
  const newValue = inputField.value.trim();

  if (newValue !== "") {
    editSubtasks[index].title = newValue;
    renderEditSubtasks();
  }
}

/**
 * Eventhandler, der beim Drücken der Enter-Taste im Subtask-Inputfeld
 * einen neuen Subtask erstellt.
 * @param {KeyboardEvent} event - Das Tastatur-Event
 */
function handleSubtaskEnter(event) {
  if (event.key === "Enter") {
    event.preventDefault();

    const input = document.getElementById("edit-subtask");
    const value = input.value.trim();

    if (value) {
      addEditSubtask(value);
      input.value = "";
    }
  }
}

/**
 * Fügt einen neuen Subtask dem Bearbeitungs-Array hinzu und rendert die Liste neu.
 * @param {string} subtaskText - Der Titel des neuen Subtasks
 */
function addEditSubtask(subtaskText) {
  editSubtasks.push({ title: subtaskText, done: false });
  renderEditSubtasks();
}

/**
 * (Optional, wird aktuell nicht genutzt)
 * Schaltet den Status eines Subtasks zwischen "checked" und "unchecked" um.
 * @param {number} index - Index des Subtasks im Array
 */
function toggleEditSubtask(index) {
  editSubtasks[index].checked = !editSubtasks[index].checked;
  renderEditSubtasks();
}