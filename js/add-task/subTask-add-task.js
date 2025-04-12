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
    document.getElementById("subtask-list").innerHTML += `<ul class="subtask-list-item" id="subtask-list-item">
    <li>${input}</li>
    <div class="subtask-list-item-btns">
    <img class="subtask-edit-icons edit" src="./assets/icons/edit.svg" alt="Edit Subtask Icon"/>
    <div class="subtask-list-item-separator"></div>
    <img class="subtask-edit-icons delete"  src="./assets/icons/delete.svg" alt="Delete Subtask Icon"/>
    </div>
    </ul>`;
    inputRef.value = "";
  }
  subtasks.push(subtaskObj);
  console.log(subtasks);
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
