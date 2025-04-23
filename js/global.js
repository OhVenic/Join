/**
 * Base URL for the Firebase database.
 * @constant {string}
 */
const BASE_URL = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Array to store contacts.
 * @type {Array<Object>}
 */
let contacts = [];
/**
 * Array to store login information.
 * @type {Array<Object>}
 */
let loginInfo = [];

/**
 * Array to store tasks.
 * @type {Array<Object>}
 */
let tasksArr = [];
/**
 * Toggles the visibility of the logged-in submenu.
 */
function showSubMenuLoggedIn() {
  if (document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.remove("dp-none");
    document.getElementById("subMenu").innerHTML = `
                      <a href="./privacy-policy.html"><div class="subMenu-btns">Privacy Policy</div></a>
                      <a href="./legal-notice.html"><div class="subMenu-btns">Legal Notice</div></a>
                      <div onclick="logOut()" class="subMenu-btns">Log Out</div>`;
  } else {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

/**
 * Closes the logged-in submenu if it is visible.
 */
function closeSubMenu() {
  if (!document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

/**
 * Loads login information from the database.
 * @param {string} [path=""] - The path to the login information in the database.
 */
async function loadLoginInfo(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    loginInfo.push(responseToJson);
  } catch (error) {
    console.error("Response Failed");
  }
}

/**
 * Updates login information in the database.
 * @param {string} [path=""] - The path to update the login information in the database.
 * @param {Object} data - The data to update.
 * @returns {Object} - The updated login information.
 */
async function putLoginInfo(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Logs out the current user and redirects to the login page.
 */
async function logOut() {
  await putLoginInfo("whoIsLoggedIn", { isGuestLoggedIn: false, userLoggedIn: { name: "", avatar: "" } });
  window.location.href = "index.html";
}

/**
 * Logs in as a guest user and redirects to the dashboard.
 */
async function loginGuest() {
  await putLoginInfo("whoIsLoggedIn", { isGuestLoggedIn: true, userLoggedIn: { name: "", avatar: "" } });
  window.location.href = "./dashboard.html";
}

/**
 * Loads tasks from the database.
 * @param {string} [path=""] - The path to the tasks in the database.
 */
async function loadTasks(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    for (let key in responseToJson) {
      tasksArr.push(responseToJson[key]);
    }
  } catch (error) {
    console.error("Response Failed");
  }
}

/**
 * Loads contacts from the database.
 * @param {string} [path=""] - The path to the contacts in the database.
 */
async function loadContacts(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();

    for (let key in responseToJson) {
      contacts.push(responseToJson[key]);
    }
  } catch (error) {
    console.error("Response Failed");
  }
}

/**
 * Updates data in the database.
 * @param {string} [path=""] - The path to update the data in the database.
 * @param {Object} data - The data to update.
 * @returns {Object} - The updated data.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Deletes data from the database.
 * @param {string} [path=""] - The path to delete the data from the database.
 * @returns {Object} - The response after deletion.
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * Prevents event bubbling.
 * @param {Event} event - The event to stop propagation.
 */
function preventBubbling(event) {
  event.stopPropagation();
}
