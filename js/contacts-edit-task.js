// Toggle für das Dropdown-Menü
function toggleEditDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("edit-contact-dropdown");
  dropdown.classList.toggle("dp-none");
  renderEditContactDropdown(); // Aktualisiere Dropdown-Inhalt
}

// Rendern des Dropdown-Menüs
function renderEditContactDropdown() {
  const container = document.getElementById("edit-contact-dropdown");
  container.innerHTML = "";

  contacts.forEach((contact, index) => {
    const selected = editSelectedContacts.includes(index);
    container.innerHTML += `
      <div class="contactListElement" onclick="toggleEditContactSelection(${index})">
        <div class="contact">
          <span class="avatar">${contact.avatar}</span>
          <span>${contact.name}</span>
        </div>
        <div>
          <img id="edit-check-${index}" src="./assets/icons/${selected ? "btn-checked" : "btn-unchecked"}.svg" />
        </div>
      </div>
    `;
  });
}

// Toggle für Kontakt-Auswahl im Dropdown
function toggleEditContactSelection(index) {
  const pos = editSelectedContacts.indexOf(index);
  if (pos > -1) {
    editSelectedContacts.splice(pos, 1);
  } else {
    editSelectedContacts.push(index);
  }
  renderEditContactDropdown(); // Aktualisiere Dropdown-Inhalt
  renderSelectedAvatars();     // Update Avatare unten
}

function renderSelectedAvatars() {
  const avatarContainer = document.getElementById("selected-avatars-edit");
  if (!avatarContainer) {
    console.error('Avatar container not found');
    return;  // Verhindert Fehler, wenn das Element nicht existiert
  }

  avatarContainer.innerHTML = "";
  
  editSelectedContacts.forEach((index) => {
    const contact = contacts[index];
    avatarContainer.innerHTML += `
      <div class="selected-avatar" style="background-color:${contact.color}">
        ${contact.avatar}
      </div>
    `;
  });
}

function toggleEditContactDropdown(event) {
  event.stopPropagation();
  const dropdown = document.getElementById("edit-contact-dropdown");
  dropdown.classList.toggle("dp-none");
}

async function addSubtask(taskId) {
  const input = document.getElementById("new-subtask");
  const text = input.value.trim();
  if (!text) return;

  const task = tasksArr.find(t => String(t.id) === String(taskId));
  if (!task.subtasks) task.subtasks = [];
  task.subtasks.push(text);

  await updateTaskInFirebase(taskId, task);
  editTask(taskId); // neu rendern
}

async function deleteSubtask(taskId, index) {
  const task = tasksArr.find(t => String(t.id) === String(taskId));
  if (!task || !task.subtasks) return;

  task.subtasks.splice(index, 1);
  await updateTaskInFirebase(taskId, task);
  editTask(taskId); // neu rendern
}
async function updateTaskInFirebase(task) {
  try {
    await fetch(`${BASE_URL}tasks/${task.id}.json`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    });
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tasks in Firebase:", error);
  }
}
