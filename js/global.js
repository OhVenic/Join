const BASE_URL = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

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

function closeSubMenu() {
  if (!document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

let loginInfo = [];

async function loadLoginInfo(path = "") {
  try {
    let response = await fetch(BASE_URL + path + ".json");
    let responseToJson = await response.json();
    loginInfo.push(responseToJson);
  } catch (error) {
    console.error("Response Failed");
  }
}
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

async function logOut() {
  await putLoginInfo("whoIsLoggedIn", { isGuestLoggedIn: false, userLoggedIn: { name: "", avatar: "" } });
  window.location.href = "index.html";
}

async function loginGuest() {
  console.log("guest logged in");
  await putLoginInfo("whoIsLoggedIn", { isGuestLoggedIn: true, userLoggedIn: { name: "", avatar: "" } });
  window.location.href = "./dashboard.html";
}

let tasksArr = [];
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
}

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

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

function preventBubbling(event) {
  event.stopPropagation();
}
