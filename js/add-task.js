const BASE_URL =
  "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

let category = ["Technical Task", "User Story"];

function init() {
  loadData("contactList");
}
let contacts = [];
async function loadData(path = "") {
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

function renderContactList() {
  document.getElementById("drop-down-contact-list").innerHTML += "";
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    document.getElementById("drop-down-contact-list").innerHTML +=
      contactListDropDownTemplate(indexContact);
    if (selectedContacts.includes(indexContact)) {
      selectContact(indexContact);
    }
  }
}

function contactListDropDownTemplate(i) {
  return `<div class="contactListElement" id="${i}" onclick="toggleContactSelection(${i})">
          <div class="contact">
          <span class="avatar">${contacts[i].avatar}</span>
          <span>${contacts[i].name}</span>
          </div>
          <div><img id="btn-checkbox-${i}" src="./assets/icons/btn-unchecked.svg" alt="Button Unchecked"/></div>
          </div>`;
}

function preventBubbling(event) {
  event.stopPropagation();
}
/* Functions with the Priority Buttons*/

function selectPrio(prio) {
  const prios = ["urgent", "medium", "low"];
  prios.forEach((p) => unselectPrio(p));
  document.getElementById(
    `prio-img-${prio}`
  ).src = `./assets/icons/priority-${prio}-white.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor =
    getPrioColor(prio);
  document.getElementById(`prio-btn-${prio}`).style.color = "white";
}

function unselectPrio(prio) {
  document.getElementById(
    `prio-img-${prio}`
  ).src = `./assets/icons/priority-${prio}.svg`;
  document.getElementById(`prio-btn-${prio}`).style.backgroundColor = "white";
  document.getElementById(`prio-btn-${prio}`).style.color = "black";
}

function togglePrio(prio) {
  if (document.getElementById(`prio-btn-${prio}`).style.color === "white") {
    unselectPrio(prio);
  } else {
    selectPrio(prio);
  }
}

function getPrioColor(prio) {
  switch (prio) {
    case "urgent":
      return "#FF3D00";
    case "medium":
      return "#FFA800";
    case "low":
      return "#7AE229";
    default:
      return "white";
  }
}

function showContactList(event) {
  event.stopPropagation();
  if (
    document.getElementById("assigned-to-img-up").classList.contains("dp-none")
  ) {
    document.getElementById("assigned-to-img-up").classList.remove("dp-none");
    document.getElementById("assigned-to-img-down").classList.add("dp-none");
    document
      .getElementById("drop-down-contact-list")
      .classList.remove("dp-none");
    renderContactList();
  } else {
    closeContactList();
  }
}

function closeContactList() {
  document.getElementById("drop-down-contact-list").classList.add("dp-none");
  document.getElementById("assigned-to-img-up").classList.add("dp-none");
  document.getElementById("assigned-to-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-contact-list").innerHTML = "";
}

//to keep track of the selected elements in the dropdown List
//we need to create an array, to somewhere save these elements
let selectedContacts = [];
function selectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "#2a3647";
  document.getElementById(`${i}`).style.color = "white";
  document.getElementById(`btn-checkbox-${i}`).src =
    "./assets/icons/btn-checked.svg";
  //it check whether the contact (index) is already in our array
  if (!selectedContacts.includes(i)) {
    //if not then pushes into it
    selectedContacts.push(i);
  }
  showSelectedAvatar(i);
}

function unselectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "white";
  document.getElementById(`${i}`).style.color = "black";
  document.getElementById(`${i}`).style.borderRadius = "10px";
  document.getElementById(`btn-checkbox-${i}`).src =
    "./assets/icons/btn-unchecked.svg";
  //we need to save the index of our value
  // (which is also the index, but not the same!)
  const index = selectedContacts.indexOf(i);
  // If the contact is found in the selectedContacts array, remove it
  if (index > -1) {
    selectedContacts.splice(index, 1);
  }
  removeUnSelectedAvatar(i);
}

function toggleContactSelection(i) {
  const contactElement = document.getElementById(i);
  contactElement.style.backgroundColor === "rgb(42, 54, 71)"
    ? unselectContact(i)
    : selectContact(i);
}

/*Showing the avatar of the selected contact*/

function showSelectedAvatar(i) {
  let element = document.getElementById(`avatar-${i}`);
  if (!element) {
    document.getElementById(
      "selected-avatars"
    ).innerHTML += `<div class="selected-avatar" id="avatar-${i}">${contacts[i].avatar}</div>`;
  }
  s;
}

function removeUnSelectedAvatar(i) {
  document.getElementById(`avatar-${i}`).remove();
}

/*Category Section */

function showCategoryList(event) {
  event.stopPropagation();
  if (
    document.getElementById("add-category-img-up").classList.contains("dp-none")
  ) {
    document.getElementById("add-category-img-up").classList.remove("dp-none");
    document.getElementById("add-category-img-down").classList.add("dp-none");
    document
      .getElementById("drop-down-category-list")
      .classList.remove("dp-none");
    renderCategoryList();
  } else {
    closeCategoryList();
  }
}

function renderCategoryList() {
  document.getElementById("drop-down-category-list").innerHTML = "";
  for (let i = 0; i < category.length; i++) {
    document.getElementById("drop-down-category-list").innerHTML +=
      categoryDropDownTemplate(i);
  }
}

function categoryDropDownTemplate(indexCategory) {
  return `<div class="categoryListElement" onclick="selectCategory(${indexCategory})">
          <span class="category">${category[indexCategory]}</span>
          </div>`;
}

function selectCategory(i) {
  document.getElementById("category").value = category[i];
  closeCategoryList();
}

function closeCategoryList() {
  document.getElementById("drop-down-category-list").classList.add("dp-none");
  document.getElementById("add-category-img-up").classList.add("dp-none");
  document.getElementById("add-category-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-category-list").innerHTML = "";
}

/*Add Subtask Section*/

function changeSubtaskButtons() {
  document.getElementById("add-subtask-img").classList.remove("dp-none");
  document.getElementById("accept-task-img").classList.add("dp-none");
  document.getElementById("cancel-task-img").classList.add("dp-none");
  document.getElementById("small-separator").classList.add("dp-none");
}

function addSubtask() {
  let inputRef = document.getElementById("subtask");
  if (inputRef.value !== "") {
    let input = inputRef.value;
    document.getElementById("subtask-list").innerHTML += `<li>${input}</li>`;
    inputRef.value = "";
  }
}

function acceptOrCancelSubtask() {
  document.getElementById("add-subtask-img").classList.add("dp-none");
  document.getElementById("accept-task-img").classList.remove("dp-none");
  document.getElementById("cancel-task-img").classList.remove("dp-none");
  document.getElementById("small-separator").classList.remove("dp-none");
}

function cancelSubTask() {
  document.getElementById("subtask").value = "";
}

/*Functions with Clear button - clear form */

function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}

function clearTaskForm() {
  document.getElementById("subtask-list").innerHTML = "";
  document.getElementById("subtask").value = "";
  document.getElementById("add-task-title").value = "";
  document.getElementById("add-task-due-date").value = "";
  document.getElementById("add-task-description").value = "";
  changeSubtaskButtons();
  document.getElementById("category").value = "";
  document.getElementById("assigned-to").value = "";
  unselectPrio("urgent");
  unselectPrio("medium");
  unselectPrio("low");
  selectedContacts = [];
  document.getElementById("selected-avatars").innerHTML = "";
  removeFieldRequired();
}

/*Create Task button- create task functions */

function createTask() {
  let titleInput = document.getElementById("add-task-title");
  let dateInput = document.getElementById("add-task-due-date");
  let categoryInput = document.getElementById("category");
  if (
    titleInput.value === "" ||
    dateInput.value === "" ||
    categoryInput.value === ""
  ) {
    showFieldRequired();
  } else {
    showLog();
    goToBoards();
  }
}

function showFieldRequired() {
  document.getElementById("required-title").classList.remove("dp-none");
  document.getElementById("required-date").classList.remove("dp-none");
  document.getElementById("required-category").classList.remove("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid red";
  document.getElementById("add-task-due-date").style.border = "1px solid red";
  document.getElementById("category").style.border = "1px solid red";
}

function removeFieldRequired() {
  document.getElementById("required-title").classList.add("dp-none");
  document.getElementById("required-date").classList.add("dp-none");
  document.getElementById("required-category").classList.add("dp-none");
  document.getElementById("add-task-title").style.border = "1px solid #d1d1d1";
  document.getElementById("add-task-due-date").style.border =
    "1px solid #d1d1d1";
  document.getElementById("category").style.border = "1px solid #d1d1d1";
}

function showLog() {
  document.getElementById("log").innerHTML += `<div class="added-to-board-msg">
        <p>Task added to board</p>
        <img src="./assets/icons/added-to-board.svg" alt="Board image" />
      </div>`;
}

function goToBoards() {
  setTimeout(() => {
    window.location.href = "./board.html";
  }, 700);
}
