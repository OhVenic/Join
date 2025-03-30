/*Add Subtask Section*/

function changeSubtaskButtons() {
  document.getElementById("add-subtask-img").classList.remove("dp-none");
  document.getElementById("accept-task-img").classList.add("dp-none");
  document.getElementById("cancel-task-img").classList.add("dp-none");
  document.getElementById("small-separator").classList.add("dp-none");
}

function addSubtask() {
  let inputRef = document.getElementById("subtask");
  if (inputRef.value !== "") {
    let input = inputRef.value;
    document.getElementById("subtask-list").innerHTML += `<li>${input}</li>`;
    inputRef.value = "";
  }
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
