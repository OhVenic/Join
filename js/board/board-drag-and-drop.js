let currentDraggedElement;

/**
 * Sets the ID of the currently dragged element.
 * @param {string|number} id - The ID of the element being dragged.
 */
function startDragging(id) {
  currentDraggedElement = String(id);
}

/**
 * Allows an element to be dropped by preventing the default behavior.
 * @param {DragEvent} ev - The drag event.
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Moves a task to a specified column and updates the UI and database.
 * @param {string} column - The target column to move the task to.
 */
function moveTo(column) {
  const task = tasksArr.find((task) => String(task.id) === currentDraggedElement);
  if (task) {
    task["column"] = column;
    editColumnChange(currentDraggedElement, tasksArr);
    updateHTML();
  } else {
    console.error(`Task with ID ${currentDraggedElement} not found.`);
  }
}

/**
 * Updates the column of a task in the database.
 * @param {string|number} id - The ID of the task to update.
 * @param {Array} tasksArr - The array of tasks.
 * @returns {Promise<void>} A promise that resolves when the update is complete.
 */
async function editColumnChange(id, tasksArr) {
  const task = tasksArr.find((task) => String(task.id) === String(id));
  if (!task) {
    console.error(`Task with ID ${id} not found.`);
    return;
  }
  try {
    await fetch(`https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${id}.json`, {
      method: "PUT",
      body: JSON.stringify(task),
    });
    console.log(`Task with ID ${id} successfully updated in Firebase.`);
  } catch (error) {
    console.error(`Failed to update task with ID ${id} in Firebase:`, error);
  }
}

/**
 * Moves a task to a specified column and updates the UI and database.
 * @param {string|number} taskId - The ID of the task to move.
 * @param {string} targetColumn - The target column to move the task to.
 */
function moveToColumn(taskId, targetColumn) {
  const task = tasksArr.find((task) => String(task.id) === String(taskId));
  if (!task) {
    console.error(`Task with ID ${taskId} not found.`);
    return;
  }
  task.column = targetColumn;
  editColumnChange(taskId, tasksArr);
  updateHTML();
}

// Add this event listener to close the menu when clicking outside
document.addEventListener("click", (event) => {
  const menus = document.querySelectorAll(".card-s-move-resp-menu");
  menus.forEach((menu) => {
    if (!menu.classList.contains("dp-none") && !menu.contains(event.target)) {
      menu.classList.add("dp-none");
    }
  });
});

/**
 * Opens the responsive move-to-column menu for a specific task.
 * @param {string|number} id - The ID of the task.
 * @param {Event} event - The event triggering the menu.
 */
function moveTaskRespMenu(id, event) {
  event.stopPropagation(); // Prevent the click from propagating to the document
  const menuElement = document.getElementById(`card-s-move-resp-menu-${id}`);
  if (!menuElement) {
    console.error(`Menu element with ID card-s-move-resp-menu-${id} not found.`);
    return;
  }
  menuElement.classList.remove("dp-none");
  const currentColumn = tasksArr.find((task) => String(task.id) === String(id))?.column;
  if (!currentColumn) {
    console.error(`Task with ID ${id} not found or column is undefined.`);
    return;
  }
  const columnOptions = getColumnOptions(currentColumn);
  updateMenuOptions(id, columnOptions);
}
/**
 * Retrieves the available column options excluding the current column.
 * @param {string} currentColumn - The current column of the task.
 * @returns {Array} An array of column options.
 */
function getColumnOptions(currentColumn) {
  const allColumns = [
    { text: "To Do", column: "to-do" },
    { text: "In Progress", column: "in-progress" },
    { text: "Await Feedback", column: "await-feedback" },
    { text: "Done", column: "done" },
  ];
  return allColumns.filter((col) => col.column !== currentColumn);
}

/**
 * Updates the menu options for moving a task to a different column.
 * @param {string|number} id - The ID of the task.
 * @param {Array} options - The available column options.
 */
function updateMenuOptions(id, options) {
  options.forEach((option, i) => {
    const el = document.getElementById(`column-${i + 1}-${id}`);
    if (!el) return console.error(`Element with ID column-${i + 1}-${id} not found.`);
    const p = el.querySelector("p");
    if (p) p.innerHTML = option.text;
    el.onclick = function (e) {
      e.stopPropagation();
      moveToColumn(id, option.column);
    };
  });
}

/**
 * Highlights a drag area by adding a CSS class.
 * @param {string} id - The ID of the element to highlight.
 */
function highlight(id) {
  document.getElementById(id).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight from a drag area by removing a CSS class.
 * @param {string} id - The ID of the element to remove the highlight from.
 */
function removeHighlight(id) {
  document.getElementById(id).classList.remove("drag-area-highlight");
}
