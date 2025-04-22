/** @type {string[]} List of currently assigned contact names */
let assignedContactNames = [];

/**
 * Loads the contacts from the Firebase database and renders them in the dropdown menu.
 * If contacts are already selected, it marks them in the UI.
 */
function loadContactsForDropdown() {
  const url = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/contactList.json";
  const dropdown = document.getElementById("edit-drop-down-contact-list");

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      dropdown.innerHTML = ""; // Zuerst leeren wir den Inhalt
      Object.values(data || {}).forEach((contact) => {
        const isSelected = assignedContactNames.includes(contact.name);
        const contactElement = createContactElement(contact, isSelected);
        dropdown.appendChild(contactElement); // Füge das Element hinzu
      });
      dropdown.scrollTop = dropdown.scrollTop; // Behalte die Scrollposition bei
    })
    .catch(console.error);
}

/** @type {boolean} Indicates whether the dropdown menu is open */
let editDropdownOpen = false;

/**
 * Opens or closes the contact selection dropdown menu.
 * @param {string|number} taskId - The ID of the task to load assigned contacts for.
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
 * Closes the contact dropdown menu if clicked outside of it.
 * @param {MouseEvent} event - The click event.
 */
function checkAndCloseEditDropdown(event) {
  const dropdown = document.getElementById("edit-drop-down-contact-list");
  const input = document.getElementById("edit-assigned-to");

  if (!editDropdownOpen) return;

  if (dropdown.contains(event.target) || input.contains(event.target)) return;

  closeEditContactDropdown();
}

/**
 * Closes the contact selection dropdown menu.
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
 * Loads the assigned contacts for a task from the Firebase database
 * and renders their avatars in the edit overlay.
 * @param {string|number} taskId - The ID of the task.
 */
function loadAssignedContacts(taskId) {
  const container = document.getElementById("edit-selected-avatars");
  container.innerHTML = "";
  fetch(`https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskId}.json`)
    .then((res) => res.json())
    .then((taskData) => taskData?.assigned_to || [])
    .then((assignedNames) => {
      assignedContactNames = assignedNames;
      return fetch("https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/contactList.json").then((res) =>
        res.json()
      );
    })
    .then((allContacts) => {
      Object.values(allContacts || {}).forEach((contact) => {
        if (assignedContactNames.includes(contact.name)) {
          container.innerHTML += `
            <div class="selected-avatar-card-s" style="background-color:${contact.color}">
              ${contact.avatar}
            </div>`;
        }
      });
      renderAssignedAvatars();
    })
    .catch(console.error);
}

/**
 * Toggles the assignment of a contact to a task, updates the avatar UI,
 * and reloads the dropdown.
 * @param {string} name - The name of the contact.
 * @param {string} avatar - The avatar character of the contact.
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
 * Renders the avatars of assigned contacts in the UI.
 * Fetches contacts from the database, categorizes them into visible and extra,
 * and updates the DOM accordingly.
 * @async
 * @returns {Promise<void>} Resolves when rendering is complete.
 */
async function renderAssignedAvatars() {
  const container = document.getElementById("edit-selected-avatars");
  container.innerHTML = "";
  const contacts = await fetchContacts();
  const { visibleContacts, extraContacts } = categorizeContacts(contacts);
  renderVisibleContacts(container, visibleContacts);
  renderExtraContacts(container, extraContacts);
}

/**
 * Fetches the list of contacts from the Firebase database.
 * @async
 * @returns {Promise<Object>} A promise that resolves to the list of contacts.
 */
async function fetchContacts() {
  const response = await fetch("https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/contactList.json");
  return await response.json();
}

/**
 * Categorizes contacts into visible and extra based on the assigned contact names.
 * @param {Object} contacts - The list of all contacts.
 * @returns {Object} An object containing `visibleContacts` and `extraContacts` arrays.
 */
function categorizeContacts(contacts) {
  const visibleContacts = [];
  const extraContacts = [];
  for (const id in contacts) {
    const contact = contacts[id];
    if (assignedContactNames.includes(contact.name)) {
      if (visibleContacts.length < 4) {
        visibleContacts.push(contact);
      } else {
        extraContacts.push(contact);
      }
    }
  }
  return { visibleContacts, extraContacts };
}

/**
 * Renders the visible contacts' avatars in the specified container.
 * @param {HTMLElement} container - The DOM element to render the avatars in.
 * @param {Object[]} visibleContacts - The list of visible contacts to render.
 */
function renderVisibleContacts(container, visibleContacts) {
  visibleContacts.forEach((contact) => {
    container.innerHTML += `
      <div class="selected-avatar-card-s" style="background-color:${contact.color}">
        ${contact.avatar}
      </div>`;
  });
}

/**
 * Renders a summary card for extra contacts if there are more than 4 assigned contacts.
 * @param {HTMLElement} container - The DOM element to render the summary card in.
 * @param {Object[]} extraContacts - The list of extra contacts.
 */
function renderExtraContacts(container, extraContacts) {
  if (extraContacts.length > 0) {
    container.innerHTML += `
      <div class="selected-avatar-card-s" style="background-color:#ccc; color:white; display:flex; align-items:center; justify-content:center;">
        +${extraContacts.length}
      </div>`;
  }
}
