const BASE_URL = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/"

async function loadData() {
    let response = await fetch(BASE_URL + ".json");
    let responseToJson = await response.json();

    let taskListObj = responseToJson.taskList;
    let taskArray = Object.values(taskListObj);

    document.getElementById("task-all").innerHTML = taskArray.length;

    let todoTasks = taskArray.filter(task => task.column === "to-do");
    document.getElementById("task-to-do").innerHTML = todoTasks.length;

    let doneTasks = taskArray.filter(task => task.column === "done");
    document.getElementById("task-done").innerHTML = doneTasks.length;

    let inProgressTasks = taskArray.filter(task => task.column === "in-progress");
    document.getElementById("task-in-progress").innerHTML = inProgressTasks.length;

    let awaitingFeedbackTasks = taskArray.filter(task => task.column === "awaiting-feedback");
    document.getElementById("task-awaiting-feedback").innerHTML = awaitingFeedbackTasks.length;

    let urgentTasks = taskArray.filter(task => task.priority === "urgent");
    document.getElementById("task-urgent").innerHTML = urgentTasks.length;

    let datedTasks = taskArray.filter(task => !!task.date);
    let sortedByDate = datedTasks.sort(
        (a, b) => new Date(a.date) - new Date(b.date) // Datum sortieren
    );

    if (sortedByDate.length > 0) {
        // Frühestes Datum formatieren
        let formatted = formatDateToEnglish(sortedByDate[0].date);
        document.getElementById("task-deadline").innerHTML = formatted;
    } else {
        document.getElementById("task-deadline").innerHTML = "No date found";
    }
}

// Funktion zum Formatieren des Datums zu "Month day, year" (z. B. "March 4, 2025")
function formatDateToEnglish(dateStr) {
    let date = new Date(dateStr); // "YYYY-MM-DD"
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric"
    });
}
