/** @type {{title: string, checked: boolean}[]} The currently edited subtasks */
let editSubtasks = [];

/**
 * Initializes the subtask input field in the edit overlay, including event listeners for click and input.
 * @param {Object} task - The task whose subtasks are being edited.
 */
function setupEditSubtaskInput(task) {
  editSubtasks = task.subtasks || [];
  renderEditSubtasks();
  const $ = id => document.getElementById(id), input = $("edit-subtask"),
    btns = ["edit-Add-subtask-img", "edit-cancel-task-img", "edit-accept-task-img", "edit-small-separator"]
    .map(id => $(id)), toggle = showAdd => btns.forEach((b, i) => b.classList.toggle("dp-none", showAdd ? i !== 0 : i === 0));

  input.onclick = () => toggle(false);
  btns[1].onclick = () => { input.value = ""; toggle(true); };
  btns[2].onclick = () => {
    const v = input.value.trim();
    if (!v) return;
    editSubtasks.push({ title: v, checked: false });
    input.value = ""; renderEditSubtasks(); toggle(true);
  };
}
/**
 * Renders all current subtasks in the edit overlay.
 */
function renderEditSubtasks() {
  const list = document.getElementById("edit-subtask-list");
  list.innerHTML = "";
  editSubtasks.forEach((subtask, index) => {
    list.innerHTML += getEditSubtaskTemplate(index, subtask);
  });
}

/**
 * Deletes a subtask item from the list.
 * @param {number} index - The index of the subtask in the array.
 */
function deleteEditSubtask(index) {
  editSubtasks.splice(index, 1);
  renderEditSubtasks();
}

/**
 * Switches a subtask item into edit mode and enables the Enter key for confirmation.
 * @param {number} index - The index of the subtask in the array.
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
 * Saves the new text of an edited subtask and re-renders the list.
 * @param {number} index - The index of the subtask in the array.
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
 * Event handler that creates a new subtask when the Enter key is pressed in the subtask input field.
 * @param {KeyboardEvent} event - The keyboard event.
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
 * Adds a new subtask to the edit array and re-renders the list.
 * @param {string} subtaskText - The title of the new subtask.
 */
function addEditSubtask(subtaskText) {
  editSubtasks.push({ title: subtaskText, done: false });
  renderEditSubtasks();
}

/**
 * (Optional, not currently in use)
 * Toggles the status of a subtask between "checked" and "unchecked".
 * @param {number} index - The index of the subtask in the array.
 */
function toggleEditSubtask(index) {
  editSubtasks[index].checked = !editSubtasks[index].checked;
  renderEditSubtasks();
}
