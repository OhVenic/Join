function logout() {
  localStorage.removeItem("user");
  window.location.href = "index.html";
}

function showSubMenu() {
  if (document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.remove("dp-none");
    document.getElementById("subMenu").innerHTML = `
                      <a href="./privacy-policy.html"><div class="subMenu-btns">Privacy Policy</div></a>
                      <a href="./legal-notice.html"><div class="subMenu-btns">Legal Notice</div></a>
                      <a href="#"><div class="subMenu-btns">Log Out</div></a>`;
  } else {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

function closeSubMenu() {
  if (!document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

function preventBubbling(event) {
  event.stopPropagation();
}

const BASE_URL = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

let tasksArr = [];
async function loadTasks(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    console.log(responseToJson);
    for (let key in responseToJson) {
      tasksArr.push(responseToJson[key]);
    }
    console.log(tasksArr);
    console.log(tasksArr.length);
  } catch (error) {
    console.error("Response Failed");
  }
}

let contacts = [];
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
  console.log(contacts);
}
