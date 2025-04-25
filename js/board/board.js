let filteredTasks = [];

/**
 * Initializes the application by loading contacts, tasks, and login info, then updates the UI.
 */

async function init() {
  await loadContacts("contactList");
  await getTasksFromDatabase();
  await loadTasks("taskList");
  await showLoggedInInfo();
  updateHTML();
  loadLoginInfo("whoIsLoggedIn");
  highlightMenuActual();
}

//CARD ELEMENTS

/**
 * Gets the background color for a given category.
 * @param {string} category - The category of the task (e.g., "Technical Task", "User Story").
 * @returns {string} The background color associated with the category.
 */
function getCategoryColor(category) {
  let catBgColor = "";
  if (category === "Technical Task") {
    catBgColor = "rgba(31, 215, 193, 1)";
  } else if (category === "User Story") {
    catBgColor = "rgba(0, 56, 255, 1)";
  }
  return catBgColor;
}

/**
 * Renders HTML for contact avatars based on the provided contact names and contact list.
 * @param {string[]} displayedContacts - Array of contact names to display.
 * @param {Object[]} contacts - Array of contact objects, each containing `name`, `color`, and `avatar` properties.
 * @returns {string} HTML string for the rendered contact avatars.
 */
function renderContactAvatars(displayedContacts, contacts) {
  return displayedContacts
    .map((name) => {
      let contact = contacts.find((c) => c.name === name);
      if (!contact) return "";
      let color = contact && contact.color ? contact.color : "#999";
      let avatar = contact && contact.avatar ? contact.avatar : "G";
      return `<div class="selected-avatar-card-s" style="background-color: ${color};">${avatar}</div>`;
    })
    .filter((html) => html !== "")
    .join("");
}

/**
 * Generates HTML for the initials of assigned contacts, including a "more" indicator if there are additional contacts.
 * Filters out missing contacts from the `contacts` array.
 * @param {Object} element - The task element containing the `assigned_to` property.
 * @param {Object[]} contacts - Array of contact objects, each containing `name`, `color`, and `avatar` properties.
 * @returns {string} HTML string for the initials of assigned contacts.
 */
function getInitials(element, contacts) {
  if (!element["assigned_to"]) return "";
  // Filter out assigned contacts that no longer exist in the contacts array
  let assignedContacts = element["assigned_to"].filter((name) => contacts.some((contact) => contact.name === name));
  let displayedContacts = assignedContacts.slice(0, 4);
  let remainingCount = assignedContacts.length - 4;
  let initials = renderContactAvatars(displayedContacts, contacts);
  if (remainingCount > 0) {
    initials += `<div class="selected-avatar-card-s more-avatars" style="background-color: #ccc;">+${remainingCount}</div>`;
  }
  return initials;
}

/**
 * Shortens a given description to a maximum of 5 words and appends ellipsis if it exceeds the limit.
 * @param {string} description - The full description to be shortened.
 * @returns {string} The shortened description with ellipsis if applicable.
 */
function getShortenedDescription(description) {
  let descriptionArr = description.split(" ");
  if (descriptionArr.length > 5) {
    let newDescriptionArr = descriptionArr.slice(0, 5);
    let shortDescription = newDescriptionArr.join(" ");
    return shortDescription + "...";
  }
  return description;
}

function goToAddTask() {
  window.location.href = "./add-task.html";
}
/**
 * Generates HTML for the progress bar of subtasks.
 * @param {Object[]} subtasksArr - Array of subtasks.
 * @returns {string} HTML string for the subtask progress bar.
 */
function subtaskProgress(subtasksArr) {
  let subtaskHTML = "";
  if (subtasksArr) {
    let maxAmount = subtasksArr.length;
    let doneSubtasks = subtasksArr.filter((st) => st.status === "done");
    let percent = doneSubtasks.length / maxAmount;
    percent = Math.round(percent * 100);
    subtaskHTML += `<div class="subtask-progbar-s"><div class="progress-bar-filling" style="width:${percent}%"></div></div>
        <div class="subtask-nr-s">${doneSubtasks.length}/${maxAmount}</div>`;
  } else {
    subtaskHTML = "";
  }
  return subtaskHTML;
}

/**
 * Generates HTML for displaying the priority of a task.
 * @param {string} priority - The priority level (e.g., "low", "medium", "urgent").
 * @returns {string} HTML string for the priority icon.
 */
function showPriority(priority) {
  let prioHTML = "";
  if (priority) {
    prioHTML += `<img class="prio-img-card-s" src="./assets/icons/priority-${priority}.svg" alt="Prio Btn">`;
  } else {
    prioHTML = "";
  }
  return prioHTML;
}

//SEARCH TASK

/**
 * Filters tasks based on the search input and updates the UI.
 */
function findTask() {
  let inputValueRef = document.getElementById("searchfield");
  let inputValue = inputValueRef.value.trim();
  let taskNotFoundElement = document.getElementById("task-not-found");
  if (inputValue.length > 2) {
    searchTaskTitles();
  } else {
    filteredTasks = [];
    updateHTML();
    if (taskNotFoundElement) {
      taskNotFoundElement.classList.add("dp-none");
    }
    inputValueRef.style.borderColor = "";
  }
}

/**
 * Searches for tasks by their titles or descriptions and updates the UI.
 */
function searchTaskTitles() {
  const searchValue = document.getElementById("searchfield").value.toLowerCase();
  const taskNotFoundElement = document.getElementById("task-not-found");
  filteredTasks =
    searchValue.length > 2
      ? tasksArr.filter((task) =>
          [task.title, task.description].some((field) => field?.toLowerCase().includes(searchValue))
        )
      : [];
  updateHTML();
  const noTasksFound = filteredTasks.length === 0;
  taskNotFoundElement?.classList.toggle("dp-none", !noTasksFound);
  document.getElementById("searchfield").style.borderColor = noTasksFound ? "red" : "";
}

/**
 * Displays the logged-in user's information in the UI.
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
 * Updates the HTML content for all task columns.
 */
function updateHTML() {
  renderToDo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

/**
 * Renders tasks in the "To Do" column.
 */
function renderToDo() {
  let actualToDoList = filteredTasks.length > 0 ? filteredTasks : tasksArr;
  let toDo = actualToDoList.filter((t) => t["column"] == "to-do");
  document.getElementById("to-do").innerHTML = "";
  for (let i = 0; i < toDo.length; i++) {
    const element = toDo[i];
    document.getElementById("to-do").innerHTML += cardTemplate(element, contacts);
  }
  checkForEmptyColumn(toDo, "To do", "to-do");
}

/**
 * Renders tasks in the "In Progress" column.
 */
function renderInProgress() {
  let actualInProgressList = filteredTasks.length > 0 ? filteredTasks : tasksArr;
  let inProgress = actualInProgressList.filter((t) => t["column"] == "in-progress");
  document.getElementById("in-progress").innerHTML = "";
  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    document.getElementById("in-progress").innerHTML += cardTemplate(element, contacts);
  }
  checkForEmptyColumn(inProgress, "In Progress", "in-progress");
}

/**
 * Renders tasks in the "Await Feedback" column.
 */
function renderAwaitFeedback() {
  let actualAwaitFeedbackList = filteredTasks.length > 0 ? filteredTasks : tasksArr;
  let awaitFeedBack = actualAwaitFeedbackList.filter((t) => t["column"] == "await-feedback");
  document.getElementById("await-feedback").innerHTML = "";
  for (let i = 0; i < awaitFeedBack.length; i++) {
    const element = awaitFeedBack[i];
    document.getElementById("await-feedback").innerHTML += cardTemplate(element, contacts);
  }
  checkForEmptyColumn(awaitFeedBack, "Await Feedback", "await-feedback");
}

/**
 * Renders tasks in the "Done" column.
 */
function renderDone() {
  let actualDoneList = filteredTasks.length > 0 ? filteredTasks : tasksArr;
  let done = actualDoneList.filter((t) => t["column"] == "done");
  document.getElementById("done").innerHTML = "";
  for (let i = 0; i < done.length; i++) {
    const element = done[i];
    document.getElementById("done").innerHTML += cardTemplate(element, contacts);
  }
  checkForEmptyColumn(done, "Done", "done");
}

/**
 * Checks if a column is empty and displays a placeholder message if necessary.
 * @param {Object[]} col - The list of tasks in the column.
 * @param {string} colName - The name of the column.
 * @param {string} id - The ID of the column element.
 */
function checkForEmptyColumn(col, colName, id) {
  if (col.length === 0) {
    document.getElementById(`${id}`).innerHTML = `<div class="no-task" id="no-task">No Tasks ${colName}</div>`;
  } else if (col.length < 0) {
    document.getElementById("no-task").remove();
  }
}

/**
 * Selects the column for a new task based on the clicked element.
 * @param {string} column - The ID of the clicked column element.
 * @returns {string} The selected column name.
 */
function selectColumnForTask(column) {
  openFloatingAddTask();
  if (column.includes("main")) {
    let regex1 = /main-add-/;
    selectedColumn = column.replace(regex1, "");
  } else if (column.includes("add")) {
    let regex2 = /add-/;
    selectedColumn = column.replace(regex2, "");
  } else {
    selectedColumn = "to-do";
  }
  return selectedColumn;
}

/**
 * Changes the edit icon to a blue version.
 */
function changeToBlueIconEdit() {
  document.getElementById("edit-icon-b").classList.remove("dp-none");
  document.getElementById("edit-icon-n").classList.add("dp-none");
}
/**
 * Changes the edit icon back to a black version.
 */
function changeToBlackIconEdit() {
  document.getElementById("edit-icon-b").classList.add("dp-none");
  document.getElementById("edit-icon-n").classList.remove("dp-none");
}

/**
 * Changes the delete icon to a blue version.
 */
function changeToBlueIconDelete() {
  document.getElementById("delete-icon-b").classList.remove("dp-none");
  document.getElementById("delete-icon-n").classList.add("dp-none");
}

/**
 * Changes the delete icon back to a black version.
 */
function changeToBlackIconDelete() {
  document.getElementById("delete-icon-b").classList.add("dp-none");
  document.getElementById("delete-icon-n").classList.remove("dp-none");
}
