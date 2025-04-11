async function init() {
  await loadContacts("contactList");
  renderContacts();
}

function contactListItemTemplate(indexContact) {
  return `<div class="contact-list-item">
              
              <div id="contact-separation"></div>
              <div class="contact-data" id="${indexContact}" onclick='showContactDetails(${indexContact})'>
              <div class="contact-avatar" style="background-color:${contacts[indexContact]["color"]};" id="avatar-${indexContact}">${contacts[indexContact]["avatar"]}</div>
                <div class="contact-right">
                  <p class="list-contact-name">${contacts[indexContact]["name"]}</p>
                  <span class="list-contact-email">${contacts[indexContact]["email"]}</span>
                </div>
              </div>
            </div>`;
}

function contactAlphabetTemplate(indexContact) {
  return `<div class="alphabet-letter">${getFirstLetter(contacts[indexContact]["name"])}</div>
    <div class="separator"></div>`;
}

function renderContacts() {
  let sortedContactArr = contacts.sort((a, b) => a.name.localeCompare(b.name));
  document.getElementById("contacts").innerHTML = "";

  let lastLetter = ""; // Keep track of the last rendered letter
  for (let i = 0; i < sortedContactArr.length; i++) {
    if (sortedContactArr[i].name !== "Guest") {
      let currentLetter = getFirstLetter(sortedContactArr[i].name);

      // Render the letter and separator only if it's different from the last one
      if (currentLetter !== lastLetter) {
        document.getElementById("contacts").innerHTML += contactAlphabetTemplate(i);
        lastLetter = currentLetter; // Update the last rendered letter
      }

      // Render the contact item
      document.getElementById("contacts").innerHTML += contactListItemTemplate(i);
    }
  }
}

function getFirstLetter(name) {
  let firstLetter = name.slice(0, 1);
  return firstLetter;
}

function showContactDetails(id) {
  document.getElementById("contact-display-contact-data").innerHTML = contactDetailTemplate(id);
}

function contactDetailTemplate(indexContact) {
  return `<div class="contact-data-1">
                <div class="avatar-m"id="avatar-${indexContact}" style="background-color:${contacts[indexContact]["color"]}">${contacts[indexContact]["avatar"]}</div>
                <div class="contact-disp-main">
                  <div class="contact-name-m">${contacts[indexContact]["name"]}</div>
                  <div class="contact-edit-delete">
                    <div class="contact-change edit" onmouseover="changeToBlueIconEdit()" onmouseout="changeToBlackIconEdit()" onclick="openEditContactModal()">
                    <img id="edit-icon-n" class="icon" src="./assets/icons/edit.svg" alt="Edit Icon Normal">
                    <img id="edit-icon-b" class="dp-none icon" src="./assets/icons/edit-blue.svg" alt="Edit Icon Hover">
                    <p>Edit</p></div>
                    <div class="contact-change delete" onmouseover="changeToBlueIconDelete()" onmouseout="changeToBlackIconDelete()" onclick="deleteContact()">
                    <img id="delete-icon-n" class="icon"  src="./assets/icons/delete.svg" alt="Delete Icon Normal">
                    <img id="delete-icon-b" class="dp-none icon"  src="./assets/icons/delete-blue.svg" alt="Delete Icon Hover">
                    <p>Delete</p></div>
                  </div>
                </div>
              </div>
              <div class="contact-data-2">
                <p class="contact-data-2-title">Contact information</p>
                <div class="email-phone">
                <span class="email-title">Email</span>
                <p class="email blue">${contacts[indexContact]["email"]}</p>
                <span class="phone-title">Phone</span>
                <p class="phone">${contacts[indexContact]["phoneNumber"]}</p>
              </div>
              </div>`;
}

function changeToBlueIconEdit() {
  document.getElementById("edit-icon-b").classList.remove("dp-none");
  document.getElementById("edit-icon-n").classList.add("dp-none");
}
function changeToBlackIconEdit() {
  document.getElementById("edit-icon-b").classList.add("dp-none");
  document.getElementById("edit-icon-n").classList.remove("dp-none");
}

function changeToBlueIconDelete() {
  document.getElementById("delete-icon-b").classList.remove("dp-none");
  document.getElementById("delete-icon-n").classList.add("dp-none");
}

function changeToBlackIconDelete() {
  document.getElementById("delete-icon-b").classList.add("dp-none");
  document.getElementById("delete-icon-n").classList.remove("dp-none");
}
