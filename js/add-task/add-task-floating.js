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

let scrollerElement = document.querySelector(".scroller");

if (scrollerElement) {
  /**
   * Handles click events within the "scroller" element to manage subtask editing and saving.
   * Closes the editing mode if the user clicks outside the input field.
   * @param {MouseEvent} event - The click event object.
   */
  scrollerElement.addEventListener("click", function (event) {
    if (!isEditingSubtask || justOpenedEdit) return;
    let openInput = document.querySelector('[id^="input-container-"]:not(.dp-none)');
    if (!openInput) return;
    let clickedInsideInput = openInput.contains(event.target);
    let clickedEditButton = event.target.closest(".edit-button");
    if (clickedInsideInput || clickedEditButton) return;

    let value = document.getElementById(`input-${openInput.id.split("input-container-")[1]}`).value.trim();
    if (value !== "") {
      acceptSubtaskItem(openInput.id.split("input-container-")[1]);
    } else {
      deleteSubtaskItem(openInput.id.split("input-container-")[1]);
    }
    isEditingSubtask = false;
  });
}
