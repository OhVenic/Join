/**
 * Closes the "Add Task" modal by adding a closing animation and hiding the overlay.
 */
function closeAddTaskModal() {
  const addTaskContent = document.getElementById("add-task-content");
  addTaskContent.classList.add("closing");
  setTimeout(() => {
    addTaskContent.classList.add("dp-none");
  }, 300);
  document.getElementById("overlay").classList.add("dp-none");
}

/**
 * Opens the floating "Add Task" modal by displaying the overlay and enabling the modal content.
 */
function openFloatingAddTask() {
  document.getElementById("overlay").classList.remove("dp-none");
  document.getElementById("add-task-content").classList.remove("dp-none");
  document.getElementById("add-task-content").classList.remove("closing");
  document.documentElement.style.overflow = "hidden";
}
