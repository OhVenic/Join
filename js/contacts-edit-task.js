function editRenderContactList() {
  console.log(contacts);
  document.getElementById("drop-down-contact-list").innerHTML += "";
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    document.getElementById("drop-down-contact-list").innerHTML += editContactListDropDownTemplate(indexContact);
    if (editSelectedContacts.includes(indexContact)) {
      editSelectContact(indexContact);
    }
  }
}

function editContactListDropDownTemplate(i) {
  return `<div class="contactListElement" id="${i}" onclick="editToggleContactSelection(${i})">
            <div class="contact">
            <span class="avatar">${contacts[i].avatar}</span>
            <span>${contacts[i].name}</span>
            </div>
            <div><img id="btn-checkbox-${i}" src="./assets/icons/btn-unchecked.svg" alt="Button Unchecked"/></div>
            </div>`;
}

function editShowContactList(event) {
  event.stopPropagation();
  if (document.getElementById("assigned-to-img-up").classList.contains("dp-none")) {
    document.getElementById("assigned-to-img-up").classList.remove("dp-none");
    document.getElementById("assigned-to-img-down").classList.add("dp-none");
    document.getElementById("drop-down-contact-list").classList.remove("dp-none");
    editRenderContactList();
  } else {
    editCloseContactList();
  }
}

function editCloseContactList() {
  document.getElementById("drop-down-contact-list").classList.add("dp-none");
  document.getElementById("assigned-to-img-up").classList.add("dp-none");
  document.getElementById("assigned-to-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-contact-list").innerHTML = "";
}

//to keep track of the selected elements in the dropdown List
//we need to create an array, to somewhere save these elements
let editSelectedContacts = [];
let editSelectedContactsNames = [];
function editSelectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "#2a3647";
  document.getElementById(`${i}`).style.color = "white";
  document.getElementById(`btn-checkbox-${i}`).src = "./assets/icons/btn-checked.svg";
  //it check whether the contact (index) is already in our array
  if (!editSelectedContacts.includes(i)) {
    //if not then pushes into it
    editSelectedContacts.push(i);
    editSelectedContactsNames.push(contacts[i].name);
  }
  editShowSelectedAvatar(i);
}

function editUnselectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "white";
  document.getElementById(`${i}`).style.color = "black";
  document.getElementById(`${i}`).style.borderRadius = "10px";
  document.getElementById(`btn-checkbox-${i}`).src = "./assets/icons/btn-unchecked.svg";
  //we need to save the index of our value
  // (which is also the index, but not the same!)
  const index = editSelectedContacts.indexOf(i);
  // If the contact is found in the selectedContacts array, remove it
  if (index > -1) {
    editSelectedContacts.splice(index, 1);
  }
  editRemoveUnSelectedAvatar(i);
}

function editToggleContactSelection(i) {
  const contactElement = document.getElementById(i);
  contactElement.style.backgroundColor === "rgb(42, 54, 71)" ? editUnselectContact(i) : editSelectContact(i);
}

/*Showing the avatar of the selected contact*/

function editShowSelectedAvatar(i) {
  let element = document.getElementById(`avatar-${i}`);
  if (!element) {
    document.getElementById(
      "selected-avatars"
    ).innerHTML += `<div class="selected-avatar" style="background-color:${contacts[i].color};" id="avatar-${i}">${contacts[i].avatar}</div>`;
  }
  console.log(contacts[i].avatar);
}

function editRemoveUnSelectedAvatar(i) {
  document.getElementById(`avatar-${i}`).remove();
}