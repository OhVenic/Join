/** @type {string[]} Liste der aktuell zugewiesenen Kontaktnamen */
let assignedContactNames = [];

/**
 * Lädt die Kontakte aus der Firebase-Datenbank und rendert sie im Dropdown-Menü.
 * Wenn Kontakte bereits ausgewählt sind, wird das im UI markiert.
 */
async function loadContactsForDropdown() {
  const url = 'https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/contactList.json';
  const dropdown = document.getElementById("edit-drop-down-contact-list");

  const scrollPos = dropdown.scrollTop;
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

      dropdown.scrollTop = scrollPos;
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte:", error);
  }
}

/** @type {boolean} Gibt an, ob das Dropdown-Menü geöffnet ist */
let editDropdownOpen = false;

/**
 * Öffnet oder schließt das Dropdown-Menü zur Kontaktauswahl.
 * @param {string|number} taskId - Die ID der Aufgabe, um zugewiesene Kontakte zu laden.
 */
function toggleEditContactDropdown(taskId) {
  const dropdown = document.getElementById("edit-drop-down-contact-list");
  const imgDown = document.getElementById("assigned-to-img-down");
  const imgUp = document.getElementById("assigned-to-img-up");

  if (!editDropdownOpen) {
    dropdown.classList.remove("dp-none");
    imgDown.classList.add("dp-none");
    imgUp.classList.remove("dp-none");
    loadContactsForDropdown(taskId);
  } else {
    dropdown.classList.add("dp-none");
    imgDown.classList.remove("dp-none");
    imgUp.classList.add("dp-none");
  }

  editDropdownOpen = !editDropdownOpen;
}

/**
 * Schließt das Dropdown-Menü, wenn außerhalb davon geklickt wurde.
 * @param {MouseEvent} event - Das Klick-Event
 */
function checkAndCloseEditDropdown(event) {
  const dropdown = document.getElementById("edit-drop-down-contact-list");
  const input = document.getElementById("edit-assigned-to");

  if (!editDropdownOpen) return;

  if (dropdown.contains(event.target) || input.contains(event.target)) return;

  closeEditContactDropdown();
}

/**
 * Schließt das Dropdown-Menü zur Kontaktauswahl.
 */
function closeEditContactDropdown() {
  const dropdown = document.getElementById("edit-drop-down-contact-list");
  const imgDown = document.getElementById("assigned-to-img-down");
  const imgUp = document.getElementById("assigned-to-img-up");

  dropdown.classList.add("dp-none");
  imgDown.classList.remove("dp-none");
  imgUp.classList.add("dp-none");
  editDropdownOpen = false;
}

/**
 * Lädt die zugewiesenen Kontakte einer Aufgabe aus der Firebase-Datenbank
 * und rendert deren Avatare im Edit-Overlay.
 * @param {string|number} taskId - Die ID der Aufgabe
 */
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
        avatarDiv.innerHTML = `
          <div class="selected-avatar-card-s" style="background-color:${contact.color}">
            ${contact.avatar}
          </div>`;
        container.appendChild(avatarDiv);
      }
    }
  } catch (error) {
    console.error("Fehler beim Laden der zugewiesenen Kontakte:", error);
  }
}

/**
 * Fügt einen Kontakt zur Auswahl hinzu oder entfernt ihn,
 * aktualisiert anschließend das Avatar-UI und lädt das Dropdown neu.
 * @param {string} name - Der Name des Kontakts
 * @param {string} avatar - Das Avatar-Zeichen
 */
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

/**
 * Rendert die aktuell zugewiesenen Kontakte mit ihren Avataren im Edit-Overlay.
 */
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
  }
}