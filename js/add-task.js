
function preventBubbling(event) {
  event.stopPropagation();
}

/*Functions with Clear button - clear form */

function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}

function clearTaskForm() {
  document.getElementById("subtask-list").innerHTML = "";
  document.getElementById("subtask").value = "";
  document.getElementById("add-task-title").value = "";
  document.getElementById("add-task-due-date").value = "";
  document.getElementById("add-task-description").value = "";
  changeSubtaskButtons();
  document.getElementById("category").value = "";
  document.getElementById("assigned-to").value = "";
  unselectPrio("urgent");
  unselectPrio("medium");
  unselectPrio("low");
  selectedContacts = [];
  document.getElementById("selected-avatars").innerHTML = "";
  removeFieldRequired();
}

/*Create Task button- create task functions */

function createTask() {
  let titleInput = document.getElementById("add-task-title");
  let dateInput = document.getElementById("add-task-due-date");
  let categoryInput = document.getElementById("category");
  if (
    titleInput.value === "" ||
    dateInput.value === "" ||
    categoryInput.value === ""
  ) {
    showFieldRequired();
  } else {
    showLog();
    goToBoards();
  }
}

function showFieldRequired() {
  document.getElementById("required-title").classList.remove("dp-none");
  document.getElementById("required-date").classList.remove("dp-none");
  document.getElementById("required-category").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
  document.getElementById("add-task-due-date").style.border = "1px solid red";
  document.getElementById("category").style.border = "1px solid red";
}

function removeFieldRequired() {
  document.getElementById("required-title").classList.add("dp-none");
  document.getElementById("required-date").classList.add("dp-none");
  document.getElementById("required-category").classList.add("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid #d1d1d1";
  document.getElementById("add-task-due-date").style.border =
    "1px solid #d1d1d1";
  document.getElementById("category").style.border = "1px solid #d1d1d1";
}

function showLog() {
  document.getElementById("log").innerHTML = `<div class="added-to-board-msg">
        <p>Task added to board</p>
        <img src="./assets/icons/added-to-board.svg" alt="Board image" />
      </div>`;
}

function goToBoards() {
  setTimeout(() => {
    window.location.href = "./board.html";
  }, 1000);
}
