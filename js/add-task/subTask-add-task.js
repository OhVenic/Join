/*Add Subtask Section*/

function changeSubtaskButtons() {
  document.getElementById("add-subtask-img").classList.remove("dp-none");
  document.getElementById("accept-task-img").classList.add("dp-none");
  document.getElementById("cancel-task-img").classList.add("dp-none");
  document.getElementById("small-separator").classList.add("dp-none");
}
let subtasks = [];
function addSubtask() {
  let subtaskObj = {};
  let inputRef = document.getElementById("subtask");
  if (inputRef.value !== "") {
    let input = inputRef.value;
    subtaskObj.status = "undone";
    subtaskObj.title = input;
    subtasks.push(subtaskObj);
    // Render only the new subtask
    const subtaskList = document.getElementById("subtask-list");
    subtaskList.innerHTML += subtaskListTemplate(subtasks.length - 1);
    inputRef.value = "";
  }
  console.log(subtasks);
}

function subtaskListTemplate(i) {
  return `<div class="subtask-list-item" id="subtask-list-item-${i}" 
    onmouseover="showEditLayout(this)" 
    onmouseout="removeEditLayout(this)">
    <li id="title-${i}">${subtasks[i].title}</li>
    <div class="subtask-list-item-btns dp-none">
      <img class="subtask-edit-icons edit" onclick="editSubtaskItem(${i})" src="./assets/icons/edit.svg" alt="Edit Subtask Icon"/>
      <div class="subtask-list-item-separator"></div>
      <img class="subtask-edit-icons delete" onclick="deleteSubtaskItem(${i})" src="./assets/icons/delete.svg" alt="Delete Subtask Icon"/>
    </div>
  </div>
  <div id="input-container-${i}" class="change-input dp-none">
    <input id="input-${i}" type="text">
    <div class="subtask-list-item-btns-2">
      <img class="subtask-edit-icons delete-2" onclick="deleteSubtaskItem(${i})" src="./assets/icons/delete.svg" alt="Edit Subtask Icon"/>
      <div class="subtask-list-item-separator-2"></div>
      <img class="subtask-edit-icons accept" onclick="acceptSubtaskItem(${i})" src="./assets/icons/check.svg" alt="Delete Subtask Icon"/>
    </div>
  </div>`;
}

function acceptOrCancelSubtask() {
  document.getElementById("add-subtask-img").classList.add("dp-none");
  document.getElementById("accept-task-img").classList.remove("dp-none");
  document.getElementById("cancel-task-img").classList.remove("dp-none");
  document.getElementById("small-separator").classList.remove("dp-none");
}

function cancelSubTask() {
  document.getElementById("subtask").value = "";
}

function showEditLayout(element) {
  element.querySelector(".subtask-list-item-btns").classList.remove("dp-none");
}
function removeEditLayout(element) {
  element.querySelector(".subtask-list-item-btns").classList.add("dp-none");
}

function deleteSubtaskItem(index) {
  // Remove the subtask from the array
  subtasks.splice(index, 1);

  // Clear the current subtask list in the DOM
  const subtaskList = document.getElementById("subtask-list");
  subtaskList.innerHTML = ""; // Reset the list to an empty state

  // Re-render the subtask list using a for loop
  for (let i = 0; i < subtasks.length; i++) {
    subtaskList.innerHTML += subtaskListTemplate(i); // Generate and append each subtask's HTML
  }

  // Log the updated subtasks array for debugging purposes
  console.log("Updated subtasks:", subtasks);
}

function editSubtaskItem(id) {
  document.getElementById(`input-container-${id}`).classList.remove("dp-none");
  document.getElementById(`subtask-list-item-${id}`).classList.add("dp-none");
  document.getElementById(`input-${id}`).value = subtasks[id].title;
}

function acceptSubtaskItem(id) {
  if (document.getElementById(`input-${id}`).value !== "") {
    document.getElementById(`input-container-${id}`).classList.add("dp-none");
    document.getElementById(`subtask-list-item-${id}`).classList.remove("dp-none");
    subtasks[id].title = document.getElementById(`input-${id}`).value;
    console.log(document.getElementById(`input-${id}`).value);
    document.getElementById(`title-${id}`).innerHTML = document.getElementById(`input-${id}`).value;
  }
}
