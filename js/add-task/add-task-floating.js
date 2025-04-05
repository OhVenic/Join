async function loadTasks(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    for (let key in responseToJson) {
      tasksArr.push(responseToJson[key]);
    }

    updateHTML();
  } catch (error) {
    console.error("Response Failed");
  }
}

function closeAddTaskModal() {
  document.getElementById("overlay").classList.add("dp-none");
  document.getElementById("add-task-content").classList.add("closing");
}

function openFloatingAddTask() {
  document.getElementById("overlay").classList.remove("dp-none");
  document.getElementById("add-task-content").classList.remove("dp-none");
  document.getElementById("add-task-content").classList.remove("closing");
}
