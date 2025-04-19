async function loadContactsForDropdown(taskId) {
  const contactsUrl = 'https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/contactList.json';
  const taskUrl = `https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/taskList/${taskId}.json`;

  const dropdown = document.getElementById("edit-drop-down-contact-list");
  const avatarContainer = document.getElementById("edit-selected-avatars");

  dropdown.innerHTML = "";
  avatarContainer.innerHTML = "";

  try {
    const [contactsResponse, taskResponse] = await Promise.all([
      fetch(contactsUrl),
      fetch(taskUrl)
    ]);
    const contactsData = await contactsResponse.json();
    const taskData = await taskResponse.json();

    const assignedNames = taskData?.assigned_to || [];

    for (const id in contactsData) {
      const contact = contactsData[id];

      const contactElement = document.createElement("div");
      contactElement.innerHTML = `
        <div class="contactListElement" onclick="toggleEditContact('${contact.avatar}', '${contact.name}')">
          <div class="avatar-card-edit" style="background-color:${contact.color}">
            ${contact.avatar}
          </div>
          <span>${contact.name}</span>
        </div>
      `;
      dropdown.appendChild(contactElement);

      if (assignedNames.includes(contact.name)) {
        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("selected-avatar-card-s");
        avatarDiv.style = `background-color:${contact.color}`;
        avatarDiv.innerText = contact.avatar;
        avatarContainer.appendChild(avatarDiv);
      }
    }
  } catch (error) {
    console.error("Fehler beim Laden der Kontakte oder Task:", error);
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