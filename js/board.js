function cardTemplate(element, contacts) {
  return `
    <div class="card-s grab" draggable="true" ondragstart="startDragging(${element.id})" onclick="cardDetails(${
    element.id
  })">
      <div class="category-card-s" style="background-color: ${getCategoryColor(element.category)}">${
    element.category
  }</div>
      <div class="title-card-s">${element.title}</div>
      <div class="description-card-s">${element.description}</div>
      <div class="subtask-card-s" id="subtask-card-s">${subtaskProgress(element.subtasks)}</div>
      <div class="footer-card-s">
        <div class="assigned-to-card-s">
          <div class="selected-avatars">${getInitials(element, contacts)}</div>
        </div>
        <div class="prio-card-s">${showPriority(element.priority)}</div>
      </div>
    </div>
  `;
}

function cardDetails(id) {
  const task = tasksArr.find((task) => String(task.id) === String(id));
  if (!task) {
    console.error(`Task with id ${id} not found in tasksArr`);
    return;
  }
  const overlay = document.getElementById("card-details-overlay");
  const content = overlay.querySelector(".card-details-content");

  let initialsHTML = "";
  if (task["assigned_to"]) {
    initialsHTML = task["assigned_to"]
      .map((name) => {
        let contact = contacts.find((c) => c.name === name);
        let color = contact && contact.color ? contact.color : "#999";
        let avatar = contact && contact.avatar ? contact.avatar : "G";
        return `<div class="task-overlay-contact"><div class="selected-avatar-card-s" style="background-color: ${color};">${avatar}</div>
        <p class="margin-left">${name}</p></div>`;
      })
      .join(" ");
  }

  content.innerHTML = `
    <div class="card-overlay-header-flex">
      <p class="category-card-s">${task.category}</p>
      <img onclick="closeCardDetails()" class="add-task-close-btn" src="./assets/icons/cancel.svg" alt="">
    </div>
    <h2 class="task-title">${task.title}</h2>
    <p class="task-description">${task.description}</p>
    <p class="task-date">Due Date: ${task.date}</p>
    <div class="flex-priority">
      <p class="task-priority">Priority: ${task.priority}</p>
      <div class="prio-card-s">${showPriority(task.priority)}</div>
    </div>
    <p>Assigned to:</p>
    <div class="selected-avatars-overlay">${initialsHTML}</div>
    <p class="task-subtask">Subtasks:</p>
    <ul class="margin-bottom">
      ${
        task.subtasks
          ?.map(
            (st) => `
        <li class="task-list">
          <input type="checkbox" ${st.status === "done" ? "checked" : ""} 
            onchange="updateSubtaskStatus(${task.id}, '${st.title}')"> 
          ${st.title}
        </li>
      `
          )
          .join("") || "<li>No Subtasks</li>"
      }
    </ul>
    <div class="overlay-footer">
    <div class="task-overlay-footer">
     <div class="contact-change edit" onclick="editTask(${task.id})"  onmouseover="changeToBlueIconEdit()" onmouseout="changeToBlackIconEdit()">
                    <img id="edit-icon-n" class="icon" src="./assets/icons/edit.svg" alt="Edit Icon Normal">
                    <img id="edit-icon-b" class="dp-none icon" src="./assets/icons/edit-blue.svg" alt="Edit Icon Hover">
                    <p>Edit</p>
                  </div>
                  <div class="contact-change delete-display" onclick="deleteTask(${task.id})" onmouseover="changeToBlueIconDelete()" onmouseout="changeToBlackIconDelete()">
                    <img id="delete-icon-n" class="icon" src="./assets/icons/delete.svg" alt="Delete Icon Normal">
                    <img id="delete-icon-b" class="dp-none icon" src="./assets/icons/delete-blue.svg" alt="Delete Icon Hover">
                    <p>Delete</p>
                  </div></div></div>
  `;

  overlay.classList.remove("dp-none");
}
async function updateSubtaskStatus(taskId, subtaskTitle) {
  const response = await fetch(
    `https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskId}.json`
  );
  const task = await response.json();

  const subtask = task.subtasks.find((st) => st.title === subtaskTitle);
  if (subtask) {
    subtask.status = subtask.status === "done" ? "undone" : "done";

    await fetch(`https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskId}.json`, {
      method: "PUT",
      body: JSON.stringify(task),
    });

    updateHTML();
  }
}

let taskToDelete = null;

function deleteTask(id) {
  taskToDelete = id;
  document.getElementById("delete-confirmation-overlay").classList.remove("dp-none");
}

async function confirmDeleteTask() {
  if (taskToDelete) {
    await fetch(`https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskToDelete}.json`, {
      method: "DELETE"
    });
    taskToDelete = null;
    document.getElementById("delete-confirmation-overlay").classList.add("dp-none");
    closeCardDetails();
  }
}

function cancelDeleteTask() {
  taskToDelete = null;
  document.getElementById("delete-confirmation-overlay").classList.add("dp-none");
}

let editSelectedContacts = [];
let editSelectedContactsNames = [];

function editTask(id) {
  const task = tasksArr.find((task) => String(task.id) === String(id));
  if (!task) return;

  const overlay = document.getElementById("card-details-overlay");
  const content = overlay.querySelector(".card-details-content");

  content.innerHTML = `
    <div class="card-overlay-header-flex-right">
      <img onclick="closeCardDetails()" class="add-task-close-btn" src="./assets/icons/cancel.svg" alt="Close">
    </div>
    <form onsubmit="saveEditedTask(event, '${task.id}')">
      <label>Title:</label>
      <input required name="title" value="${task.title}" class="edit-input" />
      
      <label>Description:</label>
      <textarea name="description" class="edit-textarea">${task.description}</textarea>
      
      <label>Due Date:</label>
      <input required name="date" type="date" value="${task.date}" class="edit-input" />

      <label>Priority:</label>
      <div class="priority-btn-group">
        <button type="button" class="prio-btn" id="prio-low" onclick="selectPriorityEdit('low')">
          Low <img src="./assets/icons/priority-low.svg" class="prio-icon" alt="Low">
        </button>
        <button type="button" class="prio-btn" id="prio-medium" onclick="selectPriorityEdit('medium')">
          Medium <img src="./assets/icons/priority-medium.svg" class="prio-icon" alt="Medium">
        </button>
        <button type="button" class="prio-btn" id="prio-urgent" onclick="selectPriorityEdit('urgent')">
          Urgent <img src="./assets/icons/priority-urgent.svg" class="prio-icon" alt="Urgent">
        </button>
      </div>
      <input type="hidden" name="priority" id="edit-priority-hidden" />
      
      <div class="assigned-to-section frame-39">
        <label for="assigned-to">Assigned to</label>
        <input
          type="text"
          id="assigned-to"
          class="selection"
          placeholder="Select contacts to assign"
          onclick="editShowContactList(event)"
        />
        <img
          id="assigned-to-img-down"
          class="assigned-to-img dropdown-img"
          src="./assets/icons/arrow_drop_down.svg"
          alt="Select contact dropdown arrow"
          onclick="editShowContactList(event)"
        />
        <img
          id="assigned-to-img-up"
          class="assigned-to-img dropdown-img dp-none"
          src="./assets/icons/arrow_drop_down_up.svg"
          alt="Select contact dropdown arrow"
          onclick="editShowContactList(event)"
        />
        <div
          class="drop-down-contact-list dp-none"
          id="drop-down-contact-list"
          onclick="preventBubbling(event)"
        ></div>
        <div id="selected-avatars"></div>
      </div>

      <div class="edit-btn-row">
        <button type="submit" class="task-btn">
          Ok <svg class="white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
          </svg>
        </button>
        <button type="button" class="btn btn-cancel" onclick="cardDetails('${task.id}')">Abbrechen</button>
      </div>
    </form>
  `;

  // Set priority
  document.getElementById('edit-priority-hidden').value = task.priority;
  selectPriorityEdit(task.priority);

  // Reset & prepare contact selections
  editSelectedContacts = [];
  editSelectedContactsNames = [];

  // assigned_to sind Kontakt-Indizes (z. B. [0, 1])
  if (Array.isArray(task.assigned_to)) {
    editSelectedContacts = [...task.assigned_to];
    editSelectedContactsNames = task.assigned_to.map(i => contacts[i]?.name);
  }

  // Render Kontaktliste
  editRenderContactList();

  // Visuell selektieren
  for (let i of editSelectedContacts) {
    editSelectContact(i);
  }

  overlay.classList.remove("dp-none");
}

async function saveEditedTask(event, taskId) {
  event.preventDefault();
  const form = event.target;

  const updatedTask = {
    ...tasksArr.find((task) => String(task.id) === String(taskId)),
    title: form.title.value.trim(),
    description: form.description.value.trim(),
    date: form.date.value,
    priority: form.priority.value,
    assigned_to: [...editSelectedContacts], // <- das hier!
  };

  await fetch(`https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskId}.json`, {
    method: "PUT",
    body: JSON.stringify(updatedTask),
  });

  closeCardDetails();
}

function selectPriorityEdit(prio) {
  document.getElementById("edit-priority-hidden").value = prio;

  const prioButtons = ["low", "medium", "urgent"];
  prioButtons.forEach(p => {
    const btn = document.getElementById(`prio-${p}`);
    btn.classList.remove("prio-selected-low", "prio-selected-medium", "prio-selected-urgent");

    if (p === prio) {
      btn.classList.add(`prio-selected-${p}`);
    }
  });
}
let tasksArr2 = [];

async function getTasksFromDatabase() {
  let userResponse = await getAllUsers("taskList");
  let UserKeysArray = Object.keys(userResponse);
  tasksArr = UserKeysArray.map((key) => ({
    id: key,
    ...userResponse[key],
  }));
  console.log("tasksArr:", tasksArr);
}

async function getAllTasks(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

async function closeCardDetails() {
  tasksArr = [];
  await loadTasks("taskList");
  document.getElementById("card-details-overlay").classList.add("dp-none");
}

function getCategoryColor(category) {
  let catBgColor = "";
  if (category === "Technical Task") {
    catBgColor = "rgba(31, 215, 193, 1)";
  } else if (category === "User Story") {
    catBgColor = "rgba(0, 56, 255, 1)";
  }
  return catBgColor;
}

function getInitials(element, contacts) {
  let initials = "";
  if (element["assigned_to"]) {
    initials = element["assigned_to"]
      .map((name) => {
        let contact = contacts.find((c) => c.name === name);
        let color = contact.color;
        let avatar = contact && contact.avatar ? contact.avatar : "G";
        return `<div class="selected-avatar-card-s" style="background-color: ${color};">${avatar}</div>`;
      })
      .join("");
  } else {
    initials = "";
  }
  return initials;
}

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

function findTask() {
  let inputValueRef = document.getElementById("searchfield");
  let inputValue = inputValueRef.value.trim();
  if (inputValue.length > 2) {
    searchTaskTitles();
  } else {
    filteredTasks = [];
    updateHTML();
  }
}
let filteredTasks = [];
function searchTaskTitles() {
  let searchFieldRef = document.getElementById("searchfield");
  if (searchFieldRef.value.length > 2) {
    filteredTasks = tasksArr.filter((task) => task["title"].toLowerCase().includes(searchFieldRef.value.toLowerCase()));
    console.log(filteredTasks);
    updateHTML();
  }
}

function showPriority(priority) {
  let prioHTML = "";
  if (priority) {
    prioHTML += `<img class="prio-img-card-s" src="./assets/icons/priority-${priority}.svg" alt="Prio Btn">`;
  } else {
    prioHTML = "";
  }
  return prioHTML;
}

async function init() {
  await loadContacts("contactList");
  await getTasksFromDatabase();
  await loadTasks("taskList");
  await showLoggedInInfo();
  updateHTML();
  loadLoginInfo("whoIsLoggedIn");
}

async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");
  if (loginInfo[0].isGuestLoggedIn === true) {
    document.getElementById("initialLetter").innerHTML = "G";
  } else {
    document.getElementById("initialLetter").innerHTML = loginInfo[0].userLoggedIn.avatar;
  }
}

let currentDraggedElement;

function startDragging(id) {
  currentDraggedElement = String(id);
}

async function editColumnChange(id, tasksArr) {
  await putData(
    `taskList/${id}`,
    tasksArr.find((task) => String(task.id) === id)
  );
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(column) {
  const task = tasksArr.find((task) => String(task.id) === currentDraggedElement);
  if (task) {
    task["column"] = column;
    editColumnChange(currentDraggedElement, tasksArr);
    updateHTML();
  }
}

function updateHTML() {
  renderToDo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

function renderToDo() {
  let actualToDoList = filteredTasks.length > 0 ? filteredTasks : tasksArr;
  let toDo = actualToDoList.filter((t) => t["column"] == "to-do");
  document.getElementById("to-do").innerHTML = "";
  for (let i = 0; i < toDo.length; i++) {
    const element = toDo[i];
    document.getElementById("to-do").innerHTML += cardTemplate(element, contacts);
  }
  console.log(tasksArr);

  checkForEmptyColumn(toDo, "To do", "to-do");
}

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

function checkForEmptyColumn(col, colName, id) {
  if (col.length === 0) {
    document.getElementById(`${id}`).innerHTML = `<div class="no-task" id="no-task">No Tasks ${colName}</div>`;
  } else if (col.length < 0) {
    document.getElementById("no-task").remove();
  }
}

function selectColumnForTask(column) {
  openFloatingAddTask();
  if (column.includes("main")) {
    let regex1 = /main-add-/;
    selectedColumn = column.replace(regex1, "");
    // console.log(selectedColumn);
  } else if (column.includes("add")) {
    let regex2 = /add-/;
    selectedColumn = column.replace(regex2, "");
    // console.log(selectedColumn);
  } else {
    selectedColumn = "to-do";
  }
  return selectedColumn;
}

function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}

function changeToBlueIconEdit() {
  document.getElementById("edit-icon-b").classList.remove("dp-none");
  document.getElementById("edit-icon-n").classList.add("dp-none");
}
function changeToBlackIconEdit() {
  document.getElementById("edit-icon-b").classList.add("dp-none");
  document.getElementById("edit-icon-n").classList.remove("dp-none");
}

function changeToBlueIconDelete() {
  document.getElementById("delete-icon-b").classList.remove("dp-none");
  document.getElementById("delete-icon-n").classList.add("dp-none");
}

function changeToBlackIconDelete() {
  document.getElementById("delete-icon-b").classList.add("dp-none");
  document.getElementById("delete-icon-n").classList.remove("dp-none");
}
