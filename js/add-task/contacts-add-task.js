//Getting contacts from Firebase and render them

const BASE_URL =
  "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

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
let selectedContactsNames = [];
function selectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "#2a3647";
  document.getElementById(`${i}`).style.color = "white";
  document.getElementById(`btn-checkbox-${i}`).src =
    "./assets/icons/btn-checked.svg";
  //it check whether the contact (index) is already in our array
  if (!selectedContacts.includes(i)) {
    //if not then pushes into it
    selectedContacts.push(i);
    selectedContactsNames.push(contacts[i].name);
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
}

function removeUnSelectedAvatar(i) {
  document.getElementById(`avatar-${i}`).remove();
}
