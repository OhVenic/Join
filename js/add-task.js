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
  subtasks = [];
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
  saveTaskInputs();
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

//Getting tasks from Firebase

function init() {
  loadContacts("contactList");
  loadTasks("taskList");
}

let tasksArr = [];
async function loadTasks(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    for (let key in responseToJson) {
      tasksArr.push(responseToJson[key]);
    }
    console.log(tasksArr);
  } catch (error) {
    console.error("Response Failed");
  }
}
//Save the taskList from Firebase

function saveTaskInputs() {
  if (canSaveTask()) {
    const task = createTaskObject();
    tasksArr.push(task);
    console.log(tasksArr);
    addTaskToDatabase(tasksArr.length - 1, task);
  } else {
    console.log("Task already exists or the input fields are empty");
  }
}

function canSaveTask() {
  const titleInput = document.getElementById("add-task-title").value;
  return !taskAlreadyExists(tasksArr, titleInput) && !areInputsEmpty();
}

function createTaskObject() {
  const titleInput = document.getElementById("add-task-title").value;
  const dateInput = document.getElementById("add-task-due-date").value;
  const categoryInput = document.getElementById("category").value;
  const descriptionInput = document.getElementById(
    "add-task-description"
  ).value;
  const assignedTo = mapArrayToObject(selectedContactsNames);
  const subtasksObj = mapArrayToObject(subtasks);
  return {
    assigned_to: assignedTo,
    category: categoryInput,
    date: dateInput,
    description: descriptionInput,
    priority: selectedPrio,
    subtasks: subtasksObj,
    title: titleInput,
  };
}

//I have to create Objects from Arrays because Firebase is not supporting Arrays

function mapArrayToObject(array) {
  return array.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
}

async function addTaskToDatabase(id, task) {
  putData(`taskList/${id}`, task);
}

function areInputsEmpty() {
  let titleInput = document.getElementById("add-task-title");
  let dateInput = document.getElementById("add-task-due-date");
  let categoryInput = document.getElementById("category");
  if (
    titleInput.value === "" ||
    dateInput.value === "" ||
    categoryInput.value === ""
  ) {
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
