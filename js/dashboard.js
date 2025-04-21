/**
 * Initializes the application, loads data, and displays the login information.
 * @returns {Promise<void>}
 */
async function init() {
  await loadData();
  await showLoggedInInfo();
}

/**
 * Returns a greeting message based on the current time of day.
 * @returns {string} - A greeting message ("Good Morning", "Good Afternoon", "Good Evening", or "Good Night").
 */
function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 17) return "Good Evening";
  if (hour >= 12) return "Good Afternoon";
  if (hour >= 6) return "Good Morning"; // "Good Morning" is shown from 6 AM onwards
  return "Good Night"; // "Good Night" is shown before 6 AM
}

/**
 * Displays the logged-in user information on the dashboard and adjusts the greeting based on the time of day.
 * @returns {Promise<void>}
 */
async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");

  const greeting = getGreeting();
  const isGuest = loginInfo[0].isGuestLoggedIn;
  const user = isGuest ? { avatar: "G", name: "" } : loginInfo[0].userLoggedIn;

  document.getElementById("initialLetter").innerHTML = user.avatar;
  document.getElementById("dashboard-name").innerHTML = user.name;
  document.getElementById("dashboard-time").innerHTML = greeting;
  document.getElementById("dashboard-name-greeting").innerHTML = isGuest 
    ? `<p class="dashboard-greeting-p">${greeting}</p>` 
    : `<p class="dashboard-greeting-p">${greeting}</p><p class="dashboard-name">${user.name}</p>`;
}

/**
 * Loads all tasks from the database, calculates statistics, and displays them on the dashboard.
 * @returns {Promise<void>}
 */
async function loadData() {
  const response = await fetch(BASE_URL + ".json");
  const data = await response.json();
  const tasks = Object.values(data.taskList || {});

  updateTaskCount("task-all", tasks.length);
  updateTaskCount("task-to-do", tasks.filter((t) => t.column === "to-do").length);
  updateTaskCount("task-done", tasks.filter((t) => t.column === "done").length);
  updateTaskCount("task-in-progress", tasks.filter((t) => t.column === "in-progress").length);
  updateTaskCount("task-awaiting-feedback", tasks.filter((t) => t.column === "await-feedback").length);
  updateTaskCount("task-urgent", tasks.filter((t) => t.priority === "urgent").length);

  updateDeadline(tasks);
}

/**
 * Sets the text content of an element based on its ID and a count.
 * @param {string} id - The ID of the element.
 * @param {number} count - The count to display.
 */
function updateTaskCount(id, count) {
  document.getElementById(id).innerHTML = count;
}

/**
 * Determines and displays the earliest deadline among the tasks.
 * @param {Array} tasks - Array of task objects.
 */
function updateDeadline(tasks) {
  const datedTasks = tasks.filter((t) => !!t.date);
  if (datedTasks.length === 0) {
    document.getElementById("task-deadline").innerHTML = "No date found";
    return;
  }

  const earliest = datedTasks.sort((a, b) => new Date(a.date) - new Date(b.date))[0].date;
  document.getElementById("task-deadline").innerHTML = formatDateToEnglish(earliest);
}

/**
 * Formats a date string in "YYYY-MM-DD" format to a readable English date.
 * @param {string} dateStr - A date string in "YYYY-MM-DD" format.
 * @returns {string} - The formatted date string (e.g., "April 18, 2025").
 */
function formatDateToEnglish(dateStr) {
  let date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * Hides the greeting overlay after the page has loaded.
 */
window.addEventListener("load", () => {
  const greeting = document.querySelector(".greeting");

  setTimeout(() => {
    greeting.classList.add("hide");
  }, 1000);
});