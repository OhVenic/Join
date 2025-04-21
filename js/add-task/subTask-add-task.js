/**
 * Array to store subtasks.
 * @type {Array<Object>}
 */
let subtasks = [];

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
 * Enables editing of a subtask item.
 * @param {number} id - The ID of the subtask to edit.
 */
function editSubtaskItem(id) {
  let inputContainer = document.getElementById(`input-container-${id}`);
  let listItem = document.getElementById(`subtask-list-item-${id}`);
  let inputField = document.getElementById(`input-${id}`);
  inputContainer.classList.remove("dp-none");
  listItem.classList.add("dp-none");
  inputField.value = subtasks[id].title;
  inputField.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      acceptSubtaskItem(id);
    }
  });
}

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
    console.log("Updated subtask:", subtasks[id]);
  }
}
