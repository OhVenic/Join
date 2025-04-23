/**
 * Displays the details of a task in an overlay.
 * @param {string} id - The ID of the task to display.
 */
function cardDetails(id) {
  const task = findTaskById(id);
  if (!task) return;
  const overlay = document.getElementById("card-details-overlay");
  const content = overlay.querySelector(".card-details-content");
  const initialsHTML = generateAssignedToHTML(task["assigned_to"]);
  content.innerHTML = getCardDetailsTemplate(task, initialsHTML);
  overlay.classList.remove("dp-none");
  document.body.style.overflow = "hidden";
}

/**
 * Finds a task by its ID.
 * @param {string} id - The ID of the task to find.
 * @returns {Object|null} The task object if found, otherwise null.
 */
function findTaskById(id) {
  const task = tasksArr.find((task) => String(task.id) === String(id));
  if (!task) {
    console.error(`Task with id ${id} not found in tasksArr`);
    return null;
  }
  return task;
}

/**
 * Generates HTML for the assigned contacts of a task.
 * @param {string[]} assignedTo - Array of names assigned to the task.
 * @returns {string} HTML string for the assigned contacts.
 */
function generateAssignedToHTML(assignedTo) {
  if (!assignedTo) return "";
  return assignedTo
    .map((name) => {
      const contact = contacts.find((c) => c.name === name);
      const color = contact?.color || "#999";
      const avatar = contact?.avatar || "G";
      return `
            <div class="task-overlay-contact">
              <div class="selected-avatar-card-s" style="background-color: ${color};">${avatar}</div>
              <p class="margin-left">${name}</p>
            </div>`;
    })
    .join(" ");
}

/**
 * Updates the status of a subtask and saves it to the database.
 * @param {string} taskId - The ID of the task containing the subtask.
 * @param {string} subtaskTitle - The title of the subtask to update.
 */
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

/**
 * Marks a task for deletion and displays the confirmation overlay.
 * @param {string} id - The ID of the task to delete.
 */
function deleteTask(id) {
  taskToDelete = id;
  document.getElementById("delete-confirmation-overlay").classList.remove("dp-none");
}

/**
 * Confirms the deletion of a task and removes it from the database.
 */
async function confirmDeleteTask() {
  if (taskToDelete) {
    await fetch(`https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskToDelete}.json`, {
      method: "DELETE",
    });
    taskToDelete = null;
    document.getElementById("delete-confirmation-overlay").classList.add("dp-none");
    closeCardDetails();
  }
}

/**
 * Cancels the deletion of a task and hides the confirmation overlay.
 */
function cancelDeleteTask() {
  taskToDelete = null;
  document.getElementById("delete-confirmation-overlay").classList.add("dp-none");
}

/**
 * Opens the edit task overlay and populates it with the task's details.
 * @param {string} id - The ID of the task to edit.
 */
function editTask(id) {
  const task = tasksArr.find((task) => String(task.id) === String(id));
  if (!task) return;
  const overlay = document.getElementById("card-details-overlay");
  const content = overlay.querySelector(".card-details-content");
  content.innerHTML = getEditTaskTemplate(task);
  document.getElementById("edit-priority-hidden").value = task.priority;
  selectPriorityEdit(task.priority);
  loadContactsForDropdown();
  loadAssignedContacts(task.id);
  overlay.classList.remove("dp-none");
  setupEditSubtaskInput(task);
}

function resetEditFormErrors() {
  const title = document.getElementById("edit-title");
  const date = document.getElementById("edit-date");
  const titleError = document.getElementById("edit-title-error");
  const [dateEmptyMsg, datePastMsg] = document.getElementById("edit-date-error").querySelectorAll("p");
  const dateWrapper = document.getElementById("edit-date-error");
  titleError.classList.add("dp-none");
  dateWrapper.classList.add("dp-none");
  dateEmptyMsg.classList.add("dp-none");
  datePastMsg.classList.add("dp-none");
  title.style.border = "1px solid #d1d1d1";
  date.style.border = "1px solid #d1d1d1";
}

function validateEditFormFields() {
  const title = document.getElementById("edit-title");
  const date = document.getElementById("edit-date");
  resetEditFormErrors();
  let hasError = false;
  if (!title.value.trim()) {
    document.getElementById("edit-title-error").classList.remove("dp-none");
    title.style.border = "1px solid red";
    hasError = true;
  }
  if (validateDate(date)) {
    hasError = true;
  }
  return hasError;
}

function validateDate(date) {
  const [dateEmptyMsg, datePastMsg] = document.getElementById("edit-date-error").querySelectorAll("p");
  const dateWrapper = document.getElementById("edit-date-error");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (!date.value) {
    dateWrapper.classList.remove("dp-none");
    dateEmptyMsg.classList.remove("dp-none");
    date.style.border = "1px solid red";
    return true;
  } else if (new Date(date.value) < today) {
    dateWrapper.classList.remove("dp-none");
    datePastMsg.classList.remove("dp-none");
    date.style.border = "1px solid red";
    return true;
  }
  return false;
}

/**
 * Saves the edited task to the database.
 * @param {Event} event - The form submission event.
 * @param {string} taskId - The ID of the task being edited.
 */
async function saveEditedTaskManual(taskId) {
  resetEditFormErrors(); // Reset errors before validation
  if (validateEditFormFields()) return; // Wenn Validierung fehlschlägt, abbrechen
  const updatedTask = {
    ...tasksArr.find((task) => String(task.id) === String(taskId)),
    title: document.getElementById("edit-title").value.trim(),
    description: document.getElementById("edit-description").value.trim(),
    date: document.getElementById("edit-date").value,
    priority: document.getElementById("edit-priority-hidden").value,
    assigned_to: assignedContactNames,
    subtasks: editSubtasks,
  };
  await fetch(`https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskId}.json`, {
    method: "PUT",
    body: JSON.stringify(updatedTask),
  });
  closeCardDetails();
}
/**
 * Updates the priority selection in the edit task overlay.
 * @param {string} prio - The selected priority (e.g., "low", "medium", "urgent").
 */
function selectPriorityEdit(prio) {
  document.getElementById("edit-priority-hidden").value = prio;
  const prioButtons = ["low", "medium", "urgent"];
  prioButtons.forEach((p) => {
    const btn = document.getElementById(`prio-${p}`);
    btn.classList.remove("prio-selected-low", "prio-selected-medium", "prio-selected-urgent");
    if (p === prio) {
      btn.classList.add(`prio-selected-${p}`);
    }
  });
}

/**
 * Closes the task details overlay and reloads the task list.
 */
async function closeCardDetails() {
  tasksArr = [];
  await loadTasks("taskList");
  document.getElementById("card-details-overlay").classList.add("dp-none");
  document.body.style.overflow = "";
}
