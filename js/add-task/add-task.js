/**
 * Initializes the application by loading contacts, tasks, and user info.
 */
async function init() {
  await loadContacts("contactList");
  await loadTasks("taskList");
  await showLoggedInInfo();
  selectPrio("medium");
  highlightMenuActual();
}

/**
 * Displays logged-in user information.
 */
async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");
  if (loginInfo[0].isGuestLoggedIn === true) {
    document.getElementById("initialLetter").innerHTML = "G";
  } else {
    document.getElementById("initialLetter").innerHTML = loginInfo[0].userLoggedIn.avatar;
  }
}

/**
 * Clears the task form and resets all inputs and selections.
 */
function clearTaskForm() {
  subtasks = [];
  clearInputs();
  changeSubtaskButtons();
  unselectPrio("urgent");
  unselectPrio("low");
  selectedContacts = [];
  removeFieldRequired();
}

/**
 * Clears all input fields in the task form.
 */
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

/**
 * Displays an error message if the task already exists.
 */
function errorTaskAlreadyExists() {
  document.getElementById("task-already-exists").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
}

/**
 * Removes error messages and resets input field styles.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} inputId - The ID of the input field element.
 */
function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

/**
 * Displays required field error messages.
 */
function showFieldRequired() {
  document.getElementById("required-title").classList.remove("dp-none");
  document.getElementById("required-date").classList.remove("dp-none");
  document.getElementById("required-category").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
  document.getElementById("add-task-due-date").style.border = "1px solid red";
  document.getElementById("category").style.border = "1px solid red";
}

/**
 * Removes required field error messages.
 */
function removeFieldRequired() {
  document.getElementById("required-title").classList.add("dp-none");
  document.getElementById("required-date").classList.add("dp-none");
  document.getElementById("required-category").classList.add("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid #d1d1d1";
  document.getElementById("add-task-due-date").style.border = "1px solid #d1d1d1";
  document.getElementById("category").style.border = "1px solid #d1d1d1";
}

/**
 * Displays a log message indicating the task was added to the board.
 */
function showLog() {
  document.getElementById("log").innerHTML = `<div class="added-to-board-msg">
        <p>Task added to board</p>
        <img src="./assets/icons/added-to-board.svg" alt="Board image" />
      </div>`;
}

/**
 * Redirects the user to the boards page after a delay.
 */
function goToBoards() {
  setTimeout(() => {
    window.location.href = "./board.html";
  }, 1000);
}

/**
 * Loads tasks from the database.
 * @param {string} [path=""] - The path to the tasks in the database.
 */
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

/**
 * Checks if a task can be saved by ensuring it doesn't already exist.
 * @returns {boolean} - True if the task can be saved, false otherwise.
 */
function canSaveTask() {
  const titleInput = document.getElementById("add-task-title").value;
  return !taskAlreadyExists(tasksArr, titleInput);
}

/**
 * Saves the task inputs to the database.
 */
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
/**
 * Creates a task object with the provided ID.
 * @param {string} id - The unique ID for the task.
 * @returns {Object} - The task object.
 */
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

/**
 * Gets the title input value.
 * @returns {string} - The title input value.
 */
function getTitleInput() {
  return document.getElementById("add-task-title").value;
}

/**
 * Gets the date input value.
 * @returns {string} - The date input value.
 */
function getDateInput() {
  return document.getElementById("add-task-due-date").value;
}

/**
 * Gets the category input value.
 * @returns {string} - The category input value.
 */
function getCategoryInput() {
  return document.getElementById("category").value;
}

/**
 * Gets the description input value.
 * @returns {string} - The description input value.
 */
function getDescriptionInput() {
  return document.getElementById("add-task-description").value;
}

/**
 * Gets the assigned contacts as an object.
 * @returns {Object} - The assigned contacts.
 */
function getAssignedTo() {
  return mapArrayToObject(selectedContactsNames);
}

/**
 * Gets the subtasks as an object.
 * @returns {Object} - The subtasks.
 */
function getSubtasks() {
  return mapArrayToObject(subtasks);
}

/**
 * Creates a task if inputs are valid and the task doesn't already exist.
 */
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

/**
 * Adds a task to the database.
 * @param {string} id - The unique ID of the task.
 * @param {Object} task - The task object to add.
 */
async function addTaskToDatabase(id, task) {
  putData(`taskList/${id}`, task);
}

/**
 * Checks if required input fields are empty.
 * @returns {boolean} - True if any required input field is empty, false otherwise.
 */
function areInputsEmpty() {
  let titleInput = document.getElementById("add-task-title");
  let dateInput = document.getElementById("add-task-due-date");
  let categoryInput = document.getElementById("category");
  if (titleInput.value === "" || dateInput.value === "" || categoryInput.value === "") {
    return true;
  }
}

/**
 * Checks if a task with the given title already exists in the task array.
 * @param {Array} tasksArr - The array of tasks.
 * @param {string} title - The title to check.
 * @returns {boolean} - True if the task already exists, false otherwise.
 */
function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some((task) => task.title === title);
}

/**
 * Changes the clear button icon to blue.
 */
function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

/**
 * Changes the clear button icon to black.
 */
function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}

/**
 * Maps an array to an object with indices as keys.
 * @param {Array} array - The array to map.
 * @returns {Object} - The resulting object.
 */
function mapArrayToObject(array) {
  return array.reduce((obj, item, index) => {
    obj[index] = item;
    return obj;
  }, {});
}

/**
 * Generates a unique ID based on the current timestamp.
 * @returns {string} - The unique ID.
 */
function generateUniqueId() {
  return String(Date.now());
}
