async function init() {
  await loadContacts("contactList");
  await loadTasks("taskList");
  await showLoggedInInfo();
  selectPrio("medium");
}

async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");
  if (loginInfo[0].isGuestLoggedIn === true) {
    document.getElementById("initialLetter").innerHTML = "G";
  } else {
    document.getElementById("initialLetter").innerHTML = loginInfo[0].userLoggedIn.avatar;
  }
}

function clearTaskForm() {
  subtasks = [];
  clearInputs();
  changeSubtaskButtons();
  unselectPrio("urgent");
  unselectPrio("medium");
  unselectPrio("low");
  selectedContacts = [];
  removeFieldRequired();
}

function clearInputs() {
  document.getElementById("subtask-list").innerHTML = "";
  document.getElementById("subtask").value = "";
  document.getElementById("add-task-title").value = "";
  document.getElementById("add-task-due-date").value = "";
  document.getElementById("add-task-description").value = "";
  document.getElementById("selected-avatars").innerHTML = "";
  document.getElementById("category").value = "";
  document.getElementById("assigned-to").value = "";
}

function errorTaskAlreadyExists() {
  document.getElementById("task-already-exists").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
}

function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
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
  document.getElementById("add-task-due-date").style.border = "1px solid #d1d1d1";
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

async function loadTasks(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    for (let key in responseToJson) {
      tasksArr.push(responseToJson[key]);
    }
    updateHTML();
  } catch (error) {
    console.error("Response Failed");
  }
}

function canSaveTask() {
  const titleInput = document.getElementById("add-task-title").value;
  return !taskAlreadyExists(tasksArr, titleInput);
}

function saveTaskInputs() {
  if (canSaveTask()) {
    let id = generateUniqueId();
    const task = createTaskObject(id);
    tasksArr.push(task);
    console.log(tasksArr);
    addTaskToDatabase(id, task);
  } else {
    console.log("Task already exists or the input fields are empty");
  }
}

let selectedColumn = "to-do";

function createTaskObject(id) {
  return {
    id: id,
    column: selectedColumn,
    assigned_to: getAssignedTo(),
    category: getCategoryInput(),
    date: getDateInput(),
    description: getDescriptionInput(),
    priority: selectedPrio,
    subtasks: getSubtasks(),
    title: getTitleInput(),
  };
}

function getTitleInput() {
  return document.getElementById("add-task-title").value;
}

function getDateInput() {
  return document.getElementById("add-task-due-date").value;
}

function getCategoryInput() {
  return document.getElementById("category").value;
}

function getDescriptionInput() {
  return document.getElementById("add-task-description").value;
}

function getAssignedTo() {
  return mapArrayToObject(selectedContactsNames);
}

function getSubtasks() {
  return mapArrayToObject(subtasks);
}

function createTask() {
  if (areInputsEmpty()) {
    showFieldRequired();
  } else if (!canSaveTask()) {
    errorTaskAlreadyExists();
  } else {
    saveTaskInputs();
    showLog();
    goToBoards();
  }
}

async function addTaskToDatabase(id, task) {
  putData(`taskList/${id}`, task);
}

function areInputsEmpty() {
  let titleInput = document.getElementById("add-task-title");
  let dateInput = document.getElementById("add-task-due-date");
  let categoryInput = document.getElementById("category");
  if (titleInput.value === "" || dateInput.value === "" || categoryInput.value === "") {
    return true;
  }
}

function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some((task) => task.title === title);
}

async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/*Functions with Clear button - "Clear form" */

function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}

// Helper functions

function mapArrayToObject(array) {
  return array.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
}

function generateUniqueId() {
  return String(Date.now());
}
