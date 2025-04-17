let subtasks = [];

function changeSubtaskButtons() {
  document.getElementById("add-subtask-img").classList.remove("dp-none");
  document.getElementById("accept-task-img").classList.add("dp-none");
  document.getElementById("cancel-task-img").classList.add("dp-none");
  document.getElementById("small-separator").classList.add("dp-none");
}

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

document.getElementById("subtask").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let inputRef = document.getElementById("subtask");
    if (inputRef.value.trim() !== "") {
      addSubtask();
    }
  }
});

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
  subtasks.splice(index, 1);
  let subtaskList = document.getElementById("subtask-list");
  subtaskList.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    subtaskList.innerHTML += subtaskListTemplate(i);
  }
}

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
