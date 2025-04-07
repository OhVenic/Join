function cardTemplate(element, contacts) {
  return `
    <div class="card-s grab" draggable="true" ondragstart="startDragging(${element["id"]})">
      <div class="category-card-s"  style="background-color: ${getCategoryColor(element["category"])}">${
    element["category"]
  }</div>
      <div class="title-card-s">${element["title"]}</div>
      <div class="description-card-s">${element["description"]}</div>
      <div class="subtask-card-s" id="subtask-card-s">${subtaskProgress(element["subtasks"])}</div>
      <div class="footer-card-s">
        <div class="assigned-to-card-s">
          <div class="selected-avatars">${getInitials(element, contacts)}</div>
        </div>
        <div class="prio-card-s">${showPriority(element["priority"])}
        </div>
      </div>
    </div>
  `;
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
        let color = contact && contact.color ? contact.color : "#999";
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
  await loadTasks("taskList");
  updateHTML();
}

let currentDraggedElement;

function startDragging(id) {
  currentDraggedElement = id;
}

async function editColumnChange(id, tasksArr) {
  putData(`taskList/${id}`, tasksArr[currentDraggedElement]);
}

function allowDrop(ev) {
  ev.preventDefault();
}

function moveTo(column) {
  tasksArr[currentDraggedElement]["column"] = column;
  editColumnChange(currentDraggedElement, tasksArr);
  updateHTML();
}

function updateHTML() {
  renderToDo();
  renderInProgress();
  renderAwaitFeedback();
  renderDone();
}

function renderToDo() {
  let toDo = tasksArr.filter((t) => t["column"] == "to-do");
  document.getElementById("to-do").innerHTML = "";
  for (let i = 0; i < toDo.length; i++) {
    const element = toDo[i];
    document.getElementById("to-do").innerHTML += cardTemplate(element, contacts);
  }

  checkForEmptyColumn(toDo, "To do", "to-do");
}

function renderInProgress() {
  let inProgress = tasksArr.filter((t) => t["column"] == "in-progress");
  document.getElementById("in-progress").innerHTML = "";
  for (let i = 0; i < inProgress.length; i++) {
    const element = inProgress[i];
    document.getElementById("in-progress").innerHTML += cardTemplate(element, contacts);
  }
  checkForEmptyColumn(inProgress, "In Progress", "in-progress");
}

function renderAwaitFeedback() {
  let awaitFeedBack = tasksArr.filter((t) => t["column"] == "await-feedback");
  document.getElementById("await-feedback").innerHTML = "";
  for (let i = 0; i < awaitFeedBack.length; i++) {
    const element = awaitFeedBack[i];
    document.getElementById("await-feedback").innerHTML += cardTemplate(element, contacts);
  }
  checkForEmptyColumn(awaitFeedBack, "Await Feedback", "await-feedback");
}

function renderDone() {
  let done = tasksArr.filter((t) => t["column"] == "done");
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
