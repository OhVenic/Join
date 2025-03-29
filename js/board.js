function allowDrop(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drag-over");
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text");
  const task = document.getElementById(taskId);
  const targetColumn = event.currentTarget.querySelector(".task-list");
  targetColumn.appendChild(task);
  event.currentTarget.classList.remove("drag-over");
  tasks[taskId].status = event.currentTarget.id;
}

function searchTasks() {
  const searchTerm = document
    .getElementById("search-input")
    .value.toLowerCase();
  const tasksElements = document.querySelectorAll(".task-card");
  tasksElements.forEach((task) => {
    const title = task.querySelector("h4").textContent.toLowerCase();
    if (title.includes(searchTerm)) {
      task.style.display = "block";
    } else {
      task.style.display = "none";
    }
  });
}

let currentStatus = "todo";
let subtasks = [];

function openAddTaskModal(status) {
  currentStatus = status;
  subtasks = [];
  document.getElementById("add-title").value = "";
  document.getElementById("add-description").value = "";
  document.getElementById("add-due-date").value = "";
  document.getElementById("add-priority").value = "medium";
  const assignedSelect = document.getElementById("add-assigned");
  Array.from(assignedSelect.options).forEach(
    (option) => (option.selected = false)
  );
  document.getElementById("add-category").value = "User Story";
  document.getElementById("subtask-list").innerHTML = "";
  document.getElementById("subtask-input").value = "";
  document.getElementById("add-task-modal").classList.remove("hidden");
}

function addSubtask() {
  const subtaskInput = document.getElementById("subtask-input");
  const subtaskText = subtaskInput.value.trim();
  if (subtaskText) {
    subtasks.push(subtaskText);
    const subtaskList = document.getElementById("subtask-list");
    const subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    subtaskItem.innerHTML = `
      <span>${subtaskText}</span>
      <button type="button" onclick="removeSubtask(${
        subtasks.length - 1
      })">Remove</button>
    `;
    subtaskList.appendChild(subtaskItem);
    subtaskInput.value = "";
  }
}

function removeSubtask(index) {
  subtasks.splice(index, 1);
  const subtaskList = document.getElementById("subtask-list");
  subtaskList.innerHTML = "";
  subtasks.forEach((subtask, i) => {
    const subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    subtaskItem.innerHTML = `
      <span>${subtask}</span>
      <button type="button" onclick="removeSubtask(${i})">Remove</button>
    `;
    subtaskList.appendChild(subtaskItem);
  });
}

function getTaskDataFromForm() {
  const title = document.getElementById("add-title").value;
  const description = document.getElementById("add-description").value;
  const dueDate = document.getElementById("add-due-date").value;
  const priority = document.getElementById("add-priority").value;
  const assignedSelect = document.getElementById("add-assigned");
  const assigned = Array.from(assignedSelect.selectedOptions).map(
    (option) => option.value
  );
  const category = document.getElementById("add-category").value;
  return { title, description, dueDate, priority, assigned, category };
}

function createTaskCard(taskId, taskData) {
  const taskList = document.getElementById(`${currentStatus}-list`);
  const taskCard = document.createElement("div");
  taskCard.className = "task-card";
  taskCard.draggable = true;
  taskCard.id = taskId;
  taskCard.setAttribute("ondragstart", "drag(event)");
  taskCard.addEventListener("click", () => openTaskModal(taskId));
  taskCard.innerHTML = `
    <div class="task-category">${taskData.category}</div>
    <h4>${taskData.title}</h4>
    <p>${taskData.description}</p>
    <div class="task-footer">
      <div class="subtask-progress">
        <span>0/${subtasks.length} Subtasks</span>
        <div class="progress-bar">
          <div class="progress" style="width: 0%;"></div>
        </div>
      </div>
      <div class="task-meta">
        <div class="user-badges">
          ${taskData.assigned
            .map(
              (person) =>
                `<div class="user-badge ${person
                  .charAt(0)
                  .toLowerCase()}">${person}</div>`
            )
            .join("")}
        </div>
        <div class="priority ${taskData.priority}"></div>
      </div>
    </div>
  `;
  return taskCard;
}

function addTask(event) {
  event.preventDefault();
  const taskData = getTaskDataFromForm();
  const taskId = `task-${Object.keys(tasks).length + 1}`;
  tasks[taskId] = {
    title: taskData.title,
    description: taskData.description,
    dueDate: taskData.dueDate,
    priority: taskData.priority,
    assigned: taskData.assigned,
    subtasks: [...subtasks],
    completedSubtasks: 0,
    status: currentStatus,
    category: taskData.category,
  };
  const taskCard = createTaskCard(taskId, taskData);
  const taskList = document.getElementById(`${currentStatus}-list`);
  taskList.appendChild(taskCard);
  removeNoTasksMessage(taskList);
  closeModal();
}

function removeNoTasksMessage(taskList) {
  const noTasks = taskList.querySelector(".no-tasks");
  if (noTasks) {
    noTasks.remove();
  }
}

let currentTaskId = null;

function updateTaskModalDetails(task) {
  document.getElementById("modal-title").textContent = task.title;
  document.getElementById("modal-description").textContent = task.description;
  document.getElementById("modal-due-date").textContent = task.dueDate;
  document.getElementById("modal-priority").textContent = task.priority;
}

function updateTaskModalAssigned(task) {
  const assignedBadges = document.getElementById("modal-assigned-badges");
  assignedBadges.innerHTML = task.assigned
    .map(
      (person) => `
    <div class="user-badge ${person.charAt(0).toLowerCase()}">
      ${person}
      <button class="remove-person" onclick="removePersonFromTask('${person}')">x</button>
    </div>
  `
    )
    .join("");
  document.getElementById("modal-add-assigned").value = "";
}

function updateTaskModalSubtasks(task) {
  const subtasksList = document.getElementById("modal-subtasks");
  subtasksList.innerHTML = "";
  task.subtasks.forEach((subtask, index) => {
    const li = document.createElement("li");
    li.textContent = subtask;
    if (index < task.completedSubtasks) {
      li.style.textDecoration = "line-through";
    }
    subtasksList.appendChild(li);
  });
}

function openTaskModal(taskId) {
  currentTaskId = taskId;
  const task = tasks[taskId];
  updateTaskModalDetails(task);
  updateTaskModalAssigned(task);
  updateTaskModalSubtasks(task);
  document.getElementById("task-modal").classList.remove("hidden");
}

function addPersonToTask(person) {
  if (!person) return;
  const task = tasks[currentTaskId];
  if (!task.assigned.includes(person)) {
    task.assigned.push(person);
    updateAssignedDisplay();
  }
  document.getElementById("modal-add-assigned").value = "";
}

function removePersonFromTask(person) {
  const task = tasks[currentTaskId];
  task.assigned = task.assigned.filter((p) => p !== person);
  updateAssignedDisplay();
}

function updateAssignedDisplay() {
  const task = tasks[currentTaskId];
  const assignedBadges = document.getElementById("modal-assigned-badges");
  assignedBadges.innerHTML = task.assigned
    .map(
      (person) => `
    <div class="user-badge ${person.charAt(0).toLowerCase()}">
      ${person}
      <button class="remove-person" onclick="removePersonFromTask('${person}')">x</button>
    </div>
  `
    )
    .join("");
  const taskCard = document.getElementById(currentTaskId);
  const userBadges = taskCard.querySelector(".user-badges");
  userBadges.innerHTML = task.assigned
    .map(
      (person) => `
    <div class="user-badge ${person.charAt(0).toLowerCase()}">${person}</div>
  `
    )
    .join("");
}

function populateEditSubtasks(task) {
  subtasks = [...task.subtasks];
  const subtaskList = document.getElementById("edit-subtask-list");
  subtaskList.innerHTML = "";
  subtasks.forEach((subtask, index) => {
    const subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    subtaskItem.innerHTML = `
      <input type="text" value="${subtask}" oninput="updateSubtask(${index}, this.value)">
      <button type="button" onclick="removeSubtaskInEdit(${index})">Remove</button>
    `;
    subtaskList.appendChild(subtaskItem);
  });
}

function openEditTaskModal() {
  const task = tasks[currentTaskId];
  document.getElementById("edit-title").value = task.title;
  document.getElementById("edit-description").value = task.description;
  document.getElementById("edit-due-date").value = task.dueDate;
  document.getElementById("edit-priority").value = task.priority;
  const assignedSelect = document.getElementById("edit-assigned");
  Array.from(assignedSelect.options).forEach((option) => {
    option.selected = task.assigned.includes(option.value);
  });
  populateEditSubtasks(task);
  document.getElementById("edit-subtask-input").value = "";
  document.getElementById("task-modal").classList.add("hidden");
  document.getElementById("edit-task-modal").classList.remove("hidden");
}

function addSubtaskInEdit() {
  const subtaskInput = document.getElementById("edit-subtask-input");
  const subtaskText = subtaskInput.value.trim();
  if (subtaskText) {
    subtasks.push(subtaskText);
    const subtaskList = document.getElementById("edit-subtask-list");
    const subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    subtaskItem.innerHTML = `
      <input type="text" value="${subtaskText}" oninput="updateSubtask(${
      subtasks.length - 1
    }, this.value)">
      <button type="button" onclick="removeSubtaskInEdit(${
        subtasks.length - 1
      })">Remove</button>
    `;
    subtaskList.appendChild(subtaskItem);
    subtaskInput.value = "";
  }
}

function updateSubtask(index, value) {
  subtasks[index] = value;
}

function removeSubtaskInEdit(index) {
  subtasks.splice(index, 1);
  const subtaskList = document.getElementById("edit-subtask-list");
  subtaskList.innerHTML = "";
  subtasks.forEach((subtask, i) => {
    const subtaskItem = document.createElement("div");
    subtaskItem.className = "subtask-item";
    subtaskItem.innerHTML = `
      <input type="text" value="${subtask}" oninput="updateSubtask(${i}, this.value)">
      <button type="button" onclick="removeSubtaskInEdit(${i})">Remove</button>
    `;
    subtaskList.appendChild(subtaskItem);
  });
}

function updateTaskCard(task) {
  const taskCard = document.getElementById(currentTaskId);
  taskCard.querySelector("h4").textContent = task.title;
  taskCard.querySelector("p").textContent = task.description;
  taskCard.querySelector(".priority").className = `priority ${task.priority}`;
  const userBadges = taskCard.querySelector(".user-badges");
  userBadges.innerHTML = task.assigned
    .map(
      (person) => `
    <div class="user-badge ${person.charAt(0).toLowerCase()}">${person}</div>
  `
    )
    .join("");
  taskCard.querySelector(
    ".subtask-progress span"
  ).textContent = `${task.completedSubtasks}/${task.subtasks.length} Subtasks`;
}

function saveTaskEdit(event) {
  event.preventDefault();
  const task = tasks[currentTaskId];
  task.title = document.getElementById("edit-title").value;
  task.description = document.getElementById("edit-description").value;
  task.dueDate = document.getElementById("edit-due-date").value;
  task.priority = document.getElementById("edit-priority").value;
  const assignedSelect = document.getElementById("edit-assigned");
  task.assigned = Array.from(assignedSelect.selectedOptions).map(
    (option) => option.value
  );
  task.subtasks = subtasks.filter((subtask) => subtask.trim() !== "");
  updateTaskCard(task);
  closeModal();
}

function addNoTasksMessage(taskList) {
  if (taskList.children.length === 0) {
    const noTasks = document.createElement("span");
    noTasks.className = "no-tasks";
    noTasks.textContent = `No tasks in ${taskList.id.replace("-list", "")}`;
    taskList.appendChild(noTasks);
  }
}

function deleteTask() {
  const taskCard = document.getElementById(currentTaskId);
  const taskList = taskCard.parentElement;
  taskCard.remove();
  delete tasks[currentTaskId];
  addNoTasksMessage(taskList);
  closeModal();
}

function closeModal() {
  document.getElementById("add-task-modal").classList.add("hidden");
  document.getElementById("task-modal").classList.add("hidden");
  document.getElementById("edit-task-modal").classList.add("hidden");
}

document.querySelectorAll(".task-card").forEach((task) => {
  task.addEventListener("click", () => openTaskModal(task.id));
});
