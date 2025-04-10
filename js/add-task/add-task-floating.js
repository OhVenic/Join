function closeAddTaskModal() {
  const addTaskContent = document.getElementById("add-task-content");
  addTaskContent.classList.add("closing");

  setTimeout(() => {
    addTaskContent.classList.add("dp-none");
  }, 300);

  document.getElementById("overlay").classList.add("dp-none");
}

function openFloatingAddTask() {
  document.getElementById("overlay").classList.remove("dp-none");
  document.getElementById("add-task-content").innerHTML = addTaskTemplate();
  document.getElementById("add-task-content").classList.remove("dp-none");
  document.getElementById("add-task-content").classList.remove("closing");
  document.documentElement.style.overflow = "hidden";
}
