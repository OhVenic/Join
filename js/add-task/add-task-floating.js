let scrollerElement = document.querySelector(".scroller");

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
  document.querySelector("body").style.overflow = "auto";
}

/**
 * Opens the floating "Add Task" modal by displaying the overlay and enabling the modal content.
 */
function openFloatingAddTask() {
  document.getElementById("overlay").classList.remove("dp-none");
  document.getElementById("add-task-content").classList.remove("dp-none");
  document.getElementById("add-task-content").classList.remove("closing");
  document.documentElement.style.overflow = "hidden";
  document.querySelector("body").style.overflow = "hidden";
}

/**
 * Handles click events within the "scroller" element to manage subtask editing and saving.
 * Closes the editing mode if the user clicks outside the input field.
 * @param {MouseEvent} event - The click event object.
 */
if (scrollerElement) {
  scrollerElement.addEventListener("click", function (event) {
    if (!isEditingSubtask || justOpenedEdit) return;
    const openInput = document.querySelector('[id^="input-container-"]:not(.dp-none)');
    if (!openInput || openInput.contains(event.target) || event.target.closest(".edit-button")) return;
    const subtaskId = openInput.id.split("input-container-")[1];
    const value = document.getElementById(`input-${subtaskId}`).value.trim();
    value ? acceptSubtaskItem(subtaskId) : deleteSubtaskItem(subtaskId);
    isEditingSubtask = false;
  });
}
