/**
 * Initialisiert die Anwendung, lädt Daten und zeigt die Login-Informationen an.
 * @returns {Promise<void>}
 */
async function init() {
  await loadData();
  await showLoggedInInfo();
}

/**
 * Zeigt den aktuell eingeloggten Nutzer im Dashboard an und passt den Begrüßungstext je nach Uhrzeit an.
 * @returns {Promise<void>}
 */
async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");

  const now = new Date();
  const hour = now.getHours();
  let greeting = "Good Morning";

  if (hour >= 12 && hour < 17) {
    greeting = "Good Afternoon";
  } else if (hour >= 17) {
    greeting = "Good Evening";
  }

  if (loginInfo[0].isGuestLoggedIn === true) {
    document.getElementById("initialLetter").innerHTML = "G";
    document.getElementById("dashboard-name").innerHTML = "";
    document.getElementById("dashboard-time").innerHTML = greeting;
    document.getElementById("dashboard-name-greeting").innerHTML = `
      <p class="dashboard-greeting-p">${greeting}</p>`;
  } else {
    document.getElementById("initialLetter").innerHTML = loginInfo[0].userLoggedIn.avatar;
    document.getElementById("dashboard-name").innerHTML = loginInfo[0].userLoggedIn.name;
    document.getElementById("dashboard-time").innerHTML = greeting;
    document.getElementById("dashboard-name-greeting").innerHTML = `
      <p class="dashboard-greeting-p">${greeting}</p>
      <p class="dashboard-name" id="dashboard-name">${loginInfo[0].userLoggedIn.name}</p>`;
  }
}

/**
 * Lädt alle Tasks aus der Datenbank, berechnet Statistiken und zeigt sie im Dashboard an.
 * @returns {Promise<void>}
 */
async function loadData() {
  const response = await fetch(BASE_URL + ".json");
  const data = await response.json();
  const tasks = Object.values(data.taskList || {});

  updateTaskCount("task-all", tasks.length);
  updateTaskCount("task-to-do", tasks.filter(t => t.column === "to-do").length);
  updateTaskCount("task-done", tasks.filter(t => t.column === "done").length);
  updateTaskCount("task-in-progress", tasks.filter(t => t.column === "in-progress").length);
  updateTaskCount("task-awaiting-feedback", tasks.filter(t => t.column === "await-feedback").length);
  updateTaskCount("task-urgent", tasks.filter(t => t.priority === "urgent").length);

  updateDeadline(tasks);
}

/**
 * Setzt den Textinhalt eines Elements anhand der ID und einer Anzahl.
 * @param {string} id - Die ID des Elements.
 * @param {number} count - Die Anzahl, die angezeigt werden soll.
 */
function updateTaskCount(id, count) {
  document.getElementById(id).innerHTML = count;
}

/**
 * Bestimmt und zeigt die früheste Deadline unter den Aufgaben an.
 * @param {Array} tasks - Alle Aufgabenobjekte.
 */
function updateDeadline(tasks) {
  const datedTasks = tasks.filter(t => !!t.date);
  if (datedTasks.length === 0) {
    document.getElementById("task-deadline").innerHTML = "No date found";
    return;
  }

  const earliest = datedTasks.sort((a, b) => new Date(a.date) - new Date(b.date))[0].date;
  document.getElementById("task-deadline").innerHTML = formatDateToEnglish(earliest);
}

/**
 * Formatiert ein Datum im Format "YYYY-MM-DD" zu einem lesbaren englischen Datum.
 * @param {string} dateStr - Datum als String im Format "YYYY-MM-DD"
 * @returns {string} - Formatierter Datumsstring z.B. "April 18, 2025"
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
 * Blendet das Begrüßungs-Overlay nach dem Laden der Seite aus.
 */
window.addEventListener("load", () => {
  const greeting = document.querySelector(".greeting");

  setTimeout(() => {
    greeting.classList.add("hide");
  }, 1000);
});