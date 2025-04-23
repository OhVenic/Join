/**
 * Array to store subtasks.
 * @type {Array<Object>}
 */
let subtasks = [];
let isEditingSubtask = false;
let justOpenedEdit = false;

/**
 * Resets the subtask buttons to their default state.
 */
function changeSubtaskButtons() {
  document.getElementById("add-subtask-img").classList.remove("dp-none");
  document.getElementById("accept-task-img").classList.add("dp-none");
  document.getElementById("cancel-task-img").classList.add("dp-none");
  document.getElementById("small-separator").classList.add("dp-none");
}

/**
 * Adds a new subtask to the list.
 */
function addSubtask() {
  let subtaskObj = {};
  let inputRef = document.getElementById("subtask");
  if (inputRef.value !== "") {
    let input = inputRef.value;
    subtaskObj.status = "undone";
    subtaskObj.title = input;
    subtasks.push(subtaskObj);
    const subtaskList = document.getElementById("subtask-list");
    subtaskList.innerHTML += subtaskListTemplate(subtasks.length - 1);
    inputRef.value = "";
  }
}

/**
 * Handles the Enter key event to add a subtask.
 */
document.getElementById("subtask").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let inputRef = document.getElementById("subtask");
    if (inputRef.value.trim() !== "") {
      addSubtask();
    }
  }
});

/**
 * Displays the accept or cancel buttons for subtasks.
 */
function acceptOrCancelSubtask() {
  document.getElementById("add-subtask-img").classList.add("dp-none");
  document.getElementById("accept-task-img").classList.remove("dp-none");
  document.getElementById("cancel-task-img").classList.remove("dp-none");
  document.getElementById("small-separator").classList.remove("dp-none");
}

/**
 * Cancels the current subtask input.
 */
function cancelSubTask() {
  document.getElementById("subtask").value = "";
}

/**
 * Shows the edit layout for a subtask item.
 * @param {HTMLElement} element - The subtask list item element.
 */
function showEditLayout(element) {
  element.querySelector(".subtask-list-item-btns").classList.remove("dp-none");
}

/**
 * Hides the edit layout for a subtask item.
 * @param {HTMLElement} element - The subtask list item element.
 */
function removeEditLayout(element) {
  element.querySelector(".subtask-list-item-btns").classList.add("dp-none");
}

/**
 * Deletes a subtask from the list.
 * @param {number} index - The index of the subtask to delete.
 */
function deleteSubtaskItem(index) {
  subtasks.splice(index, 1);
  let subtaskList = document.getElementById("subtask-list");
  subtaskList.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    subtaskList.innerHTML += subtaskListTemplate(i);
  }
}

/**
 * Enables editing mode for a specific subtask item.
 * @param {number} id - The ID of the subtask to edit.
 */
function editSubtaskItem(id) {
  document.getElementById(`input-container-${id}`).classList.remove("dp-none");
  document.getElementById(`subtask-list-item-${id}`).classList.add("dp-none");
  document.getElementById(`input-${id}`).value = subtasks[id].title;
  isEditingSubtask = true;
  justOpenedEdit = true;
  setTimeout(() => {
    justOpenedEdit = false;
  }, 0);
  document.getElementById(`input-${id}`).onkeydown = function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      acceptSubtaskItem(id);
    }
  };
}

/**
 * Handles click events to manage subtask editing and saving.
 * Closes the editing mode if the user clicks outside the input field.
 * @param {MouseEvent} event - The click event object.
 */
document.addEventListener("click", function (event) {
  if (!isEditingSubtask || justOpenedEdit) return;
  const openInput = document.querySelector('[id^="input-container-"]:not(.dp-none)');
  if (!openInput || openInput.contains(event.target) || event.target.closest(".edit-button")) return;
  if (document.querySelector("main").contains(event.target)) {
    const subtaskId = openInput.id.split("input-container-")[1];
    const value = document.getElementById(`input-${subtaskId}`).value.trim();
    value ? acceptSubtaskItem(subtaskId) : deleteSubtaskItem(subtaskId);
    isEditingSubtask = false;
  }
});

/**
 * Accepts the changes made to a subtask item.
 * @param {number} id - The ID of the subtask to update.
 */
function acceptSubtaskItem(id) {
  let inputField = document.getElementById(`input-${id}`);
  if (inputField.value.trim() !== "") {
    let inputContainer = document.getElementById(`input-container-${id}`);
    let listItem = document.getElementById(`subtask-list-item-${id}`);
    let titleElement = document.getElementById(`title-${id}`);
    inputContainer.classList.add("dp-none");
    listItem.classList.remove("dp-none");
    subtasks[id].title = inputField.value.trim();
    titleElement.innerHTML = inputField.value.trim();
  }
}
