let selectedContacts = [];
let selectedContactsNames = [];

/**
 * Renders the contact list dropdown by populating it with contact items.
 */
function renderContactList() {
  document.getElementById("drop-down-contact-list").innerHTML += "";
  for (let indexContact = 0; indexContact < contacts.length; indexContact++) {
    document.getElementById("drop-down-contact-list").innerHTML += contactListDropDownTemplate(indexContact);
    if (selectedContacts.includes(indexContact)) {
      selectContact(indexContact);
    }
  }
}

/**
 * Toggles the visibility of the contact dropdown list.
 * @param {Event} event - The event object to stop propagation.
 */
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
  closeCategoryList();
}

/**
 * Closes the contact dropdown list and resets its visibility state.
 */
function closeContactList() {
  document.getElementById("drop-down-contact-list").classList.add("dp-none");
  document.getElementById("assigned-to-img-up").classList.add("dp-none");
  document.getElementById("assigned-to-img-down").classList.remove("dp-none");
  document.getElementById("drop-down-contact-list").innerHTML = "";
}

/**
 * Selects a contact from the dropdown list.
 * @param {number} i - The index of the contact in the array.
 */
function selectContact(i) {
  document.getElementById(`${i}`).style.backgroundColor = "#2a3647";
  document.getElementById(`${i}`).style.color = "white";
  document.getElementById(`btn-checkbox-${i}`).src = "./assets/icons/btn-checked.svg";
  if (!selectedContacts.includes(i)) {
    selectedContacts.push(i);
    if (!selectedContactsNames.includes(contacts[i].name)) {
      selectedContactsNames.push(contacts[i].name);
    }
  }
  showSelectedAvatar(i);
}

/**
 * Unselects a contact from the dropdown list.
 * @param {number} i - The index of the contact in the array.
 */
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

/**
 * Toggles the selection state of a contact.
 * @param {number} i - The index of the contact in the array.
 */
function toggleContactSelection(i) {
  const contactElement = document.getElementById(i);
  contactElement.style.backgroundColor === "rgb(42, 54, 71)" ? unselectContact(i) : selectContact(i);
}

/**
 * Displays the avatar of a selected contact.
 * Shows only up to 4 avatars, and if there are more, displays a "+X" bubble.
 * @param {number} i - The index of the contact in the array.
 */
function showSelectedAvatar(i) {
  const container = document.getElementById("selected-avatars");
  const element = document.getElementById(`avatar-${i}`);
  if (!element) {
    container.innerHTML += `<div class="selected-avatar" style="background-color:${contacts[i].color};" id="avatar-${i}">${contacts[i].avatar}</div>`;
  }
  const selectedAvatars = selectedContacts
    .slice(0, 4)
    .map(
      (index) =>
        `<div class="selected-avatar" style="background-color:${contacts[index].color};">${contacts[index].avatar}</div>`
    )
    .join("");
  const extraCount = selectedContacts.length - 4;
  container.innerHTML =
    selectedAvatars + (extraCount > 0 ? `<div class="selected-avatar extra-avatar">+${extraCount}</div>` : "");
}

/**
 * Removes the avatar of an unselected contact.
 * @param {number} i - The index of the contact in the array.
 */
function removeUnSelectedAvatar(i) {
  document.getElementById(`avatar-${i}`).remove();
}
