function renderContactList() {
  document.getElementById("drop-down-contact-list").innerHTML += "";
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    document.getElementById("drop-down-contact-list").innerHTML += contactListDropDownTemplate(indexContact);
    if (selectedContacts.includes(indexContact)) {
      selectContact(indexContact);
    }
  }
}

function showContactList(event) {
  event.stopPropagation();
  if (document.getElementById("assigned-to-img-up").classList.contains("dp-none")) {
    document.getElementById("assigned-to-img-up").classList.remove("dp-none");
    document.getElementById("assigned-to-img-down").classList.add("dp-none");
    document.getElementById("drop-down-contact-list").classList.remove("dp-none");
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

let selectedContacts = [];
let selectedContactsNames = [];

function selectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "#2a3647";
  document.getElementById(`${i}`).style.color = "white";
  document.getElementById(`btn-checkbox-${i}`).src = "./assets/icons/btn-checked.svg";
  if (!selectedContacts.includes(i)) {
    selectedContacts.push(i);
    selectedContactsNames.push(contacts[i].name);
  }
  showSelectedAvatar(i);
}

function unselectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "white";
  document.getElementById(`${i}`).style.color = "black";
  document.getElementById(`${i}`).style.borderRadius = "10px";
  document.getElementById(`btn-checkbox-${i}`).src = "./assets/icons/btn-unchecked.svg";
  const index = selectedContacts.indexOf(i);
  if (index > -1) {
    selectedContacts.splice(index, 1);
  }
  removeUnSelectedAvatar(i);
}

function toggleContactSelection(i) {
  const contactElement = document.getElementById(i);
  contactElement.style.backgroundColor === "rgb(42, 54, 71)" ? unselectContact(i) : selectContact(i);
}

function showSelectedAvatar(i) {
  let element = document.getElementById(`avatar-${i}`);
  if (!element) {
    document.getElementById(
      "selected-avatars"
    ).innerHTML += `<div class="selected-avatar" style="background-color:${contacts[i].color};" id="avatar-${i}">${contacts[i].avatar}</div>`;
  }
}

function removeUnSelectedAvatar(i) {
  document.getElementById(`avatar-${i}`).remove();
}
