let assignedContactNames = [];

async function loadContactsForDropdown() {
  const url = 'https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/contactList.json';
  const dropdown = document.getElementById("edit-drop-down-contact-list");

  const scrollPos = dropdown.scrollTop; // ⬅️ scroll position merken
  dropdown.innerHTML = "";

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data) {
      for (const id in data) {
        const contact = data[id];
        const isSelected = assignedContactNames.includes(contact.name);

        const contactElement = document.createElement("div");
        contactElement.classList.add("contactListElement");
        if (isSelected) contactElement.classList.add("selected");
        contactElement.onclick = () => toggleAssignContact(contact.name, contact.avatar);

        contactElement.innerHTML = `
           <div class="avatar-card-edit" style="background-color:${contact.color}">
             ${contact.avatar}
           </div>
           <p class="contact-list-name">${contact.name}</p>
         </div>
          <div>
            <img src="./assets/icons/${isSelected ? "btn-checked" : "btn-unchecked"}.svg" />
          </div>
        `;

        dropdown.appendChild(contactElement);
      }

      dropdown.scrollTop = scrollPos; // ⬅️ scroll position wiederherstellen
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

let editDropdownOpen = false;

function toggleEditContactDropdown(taskId) {
  const dropdown = document.getElementById("edit-drop-down-contact-list");
  const imgDown = document.getElementById("assigned-to-img-down");
  const imgUp = document.getElementById("assigned-to-img-up");

  if (!editDropdownOpen) {
    dropdown.classList.remove("dp-none");
    imgDown.classList.add("dp-none");
    imgUp.classList.remove("dp-none");
    loadContactsForDropdown(taskId); // Hier taskId übergeben
  } else {
    dropdown.classList.add("dp-none");
    imgDown.classList.remove("dp-none");
    imgUp.classList.add("dp-none");
  }

  editDropdownOpen = !editDropdownOpen;
}

async function loadAssignedContacts(taskId) {
  const url = `https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskId}.json`;
  const container = document.getElementById("edit-selected-avatars");
  container.innerHTML = "";

  try {
    const response = await fetch(url);
    const taskData = await response.json();

    if (!taskData || !taskData.assigned_to) return;

    const assignedNames = Object.values(taskData.assigned_to);
    assignedContactNames = assignedNames;
    const contactResponse = await fetch('https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/contactList.json');
    const allContacts = await contactResponse.json();

    for (const id in allContacts) {
      const contact = allContacts[id];
      if (assignedNames.includes(contact.name)) {
        const avatarDiv = document.createElement("div");
        avatarDiv.innerHTML = ` <div class="selected-avatar-card-s" style="background-color:${contact.color}">
            ${contact.avatar}
          </div>`;
        container.appendChild(avatarDiv);
      }
    }
  } catch (error) {
    console.error("Fehler beim Laden der zugewiesenen Kontakte:", error);
  }
 
}

function toggleAssignContact(name, avatar) {
  const index = assignedContactNames.indexOf(name);
  if (index > -1) {
    assignedContactNames.splice(index, 1);
  } else {
    assignedContactNames.push(name); 
  }

  renderAssignedAvatars();     
  loadContactsForDropdown();   
}

async function renderAssignedAvatars() {
  const container = document.getElementById("edit-selected-avatars");
  container.innerHTML = "";

  const response = await fetch('https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/contactList.json');
  const contacts = await response.json();

  for (const id in contacts) {
    const contact = contacts[id];
    if (assignedContactNames.includes(contact.name)) {
      container.innerHTML += `
       <div class="selected-avatar-card-s" style="background-color:${contact.color}">
             ${contact.avatar}
           </div>`;
  }
}}