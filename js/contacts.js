// ✅ Firebase wird initialisiert (öffentlich, keine geheimen Daten nötig)
firebase.initializeApp({
  databaseURL:
    "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app",
});

const database = firebase.database();
let currentEditKey = null; // ✅ Für Bearbeiten merken wir uns den Schlüssel
let allContacts = []; // ✅ Speichert alle geladenen Kontakte zum Filtern
let currentEditingContact = null;

const avatarColors = [
  "#FF6F61",
  "#6B5B95",
  "#88B04B",
  "#F7CAC9",
  "#92A8D1",
  "#955251",
  "#B565A7",
  "#009B77",
  "#DD4124",
  "#45B8AC",
  "#EFC050",
  "#5B5EA6",
  "#9B2335",
  "#DFCFBE",
  "#55B4B0",
  "#E15D44",
  "#7FCDCD",
  "#BC243C",
  "#C3447A",
  "#98B4D4",
  "#D65076",
  "#6C4F3D",
  "#FFA07A",
  "#AFEEEE",
  "#40E0D0",
  "#9370DB",
  "#3CB371",
  "#4682B4",
  "#FFD700",
  "#FF8C00",
];

function getInitials(name) {
  const parts = name.trim().split(" ");
  return parts
    .map((p) => p[0].toUpperCase())
    .join("")
    .slice(0, 2);
}

function getRandomColor() {
  const index = Math.floor(Math.random() * avatarColors.length);
  return avatarColors[index];
}

// ✅ Kontakte aus Firebase laden & alphabetisch gruppiert anzeigen (inkl. Speicherung für Filter)
function loadContacts() {
  const container = document.getElementById("contact-list");
  container.innerHTML = "<p class='loading'>⏳ Kontakte werden geladen...</p>";

  const ref = database.ref("contactList");
  ref.once("value").then((snapshot) => {
    const contactList = snapshot.val();
    if (!contactList || Object.keys(contactList).length === 0) {
      document.getElementById("contact-list").innerHTML =
        "<p class='no-contacts'>Noch keine Kontakte vorhanden.</p>";
      return;
    }
    allContacts = Object.entries(contactList); // Speichern für Filter
    renderContactList(allContacts);
  });
}

// ✅ Anzeige der Kontakte (alphabetisch gruppiert)
function renderContactList(data) {
  const container = document.getElementById("contact-list");
  container.innerHTML = "";
  let currentLetter = "";

  const sorted = data.sort(([, a], [, b]) => a.name.localeCompare(b.name));

  sorted.forEach(([key, c]) => {
    const firstLetter = c.name[0].toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      container.innerHTML += `<div class="letter-group">${currentLetter}</div>`;
    }
    container.innerHTML += buildContactHTML(c, key);
  });
}

// ✅ Suchfeld-Funktion (live filtern mit Hinweis bei keinen Treffern)
function filterContacts(event) {
  const search = event.target.value.toLowerCase();
  const filtered = allContacts.filter(([, c]) =>
    c.name.toLowerCase().includes(search)
  );
  if (filtered.length === 0) {
    document.getElementById("contact-list").innerHTML =
      "<p class='no-contacts'>Keine Treffer gefunden.</p>";
    return;
  }
  renderContactList(filtered);
}

function buildContactHTML(c, key) {
  return `
        <div class="contact-item" data-key="${key}" onclick="showContactDetail('${key}', '${c.name}', '${c.email}', '${c.phoneNumber}', '${c.avatar}', '${c.color}')">
          <div class="avatar" style="background-color:${c.color}">${c.avatar}</div>
          <div class="info">
            <p class="name">${c.name}</p>
            <p class="email">${c.email}</p>
          </div>
        </div>
      `;
}

function showContactDetail(key, name, email, phone, avatar, color) {
  currentEditKey = key;
  const html = `
        <div class="avatar avatar-large" style="background-color:${color}">${avatar}</div>
        <h2>${name}</h2>
        <p data-icon="✉️"><strong>Email:</strong> ${email}</p>
        <p data-icon="📞"><strong>Telefon:</strong> ${phone}</p>
        <button onclick="editContact()" class="btn edit">Bearbeiten</button>
        <button onclick="deleteContact()" class="btn delete">Löschen</button>`;
  document.getElementById("contact-detail").innerHTML = html;
  // Markiere aktives Element
  const items = document.querySelectorAll(".contact-item");
  items.forEach((i) => i.classList.remove("active"));
  const clickedItem = document.querySelector(
    `.contact-item[data-key="${key}"]`
  );
  if (clickedItem) clickedItem.classList.add("active");
}

function openAddContact() {
  document.getElementById("add-contact-overlay").classList.remove("dp-none");
}

function closeAddContact() {
  document.getElementById("add-contact-overlay").classList.add("dp-none");
  document.querySelector("form").reset();
  currentEditKey = null;
}

function saveNewContact(event) {
  event.preventDefault();
  const name = document.getElementById("name-input").value;
  const email = document.getElementById("email-input").value;
  const phone = document.getElementById("phone-input").value;
  const avatar = getInitials(name);
  const color = getRandomColor();
  const contact = { name, email, phoneNumber: phone, avatar, color };

  if (currentEditKey) {
    database
      .ref("contactList/" + currentEditKey)
      .set(contact)
      .then(() => {
        closeAddContact();
        loadContacts();
      });
  } else {
    database
      .ref("contactList")
      .push(contact)
      .then(() => {
        closeAddContact();
        loadContacts();
      });
  }
}

function editContact() {
  const ref = database.ref("contactList/" + currentEditKey);
  ref.once("value").then((snapshot) => {
    const c = snapshot.val();
    document.getElementById("edit-name").value = c.name;
    document.getElementById("edit-email").value = c.email;
    document.getElementById("edit-phone").value = c.phoneNumber;
    document.getElementById("edit-avatar").innerText = getInitials(c.name);
    document.getElementById("edit-contact-overlay").style.display = "flex";
    currentEditingContact = { ...c, key: currentEditKey }; // für Speicherung
  });
}

function deleteContact() {
  if (confirm("Möchten Sie diesen Kontakt wirklich löschen?")) {
    database
      .ref("contactList/" + currentEditKey)
      .remove()
      .then(() => {
        document.getElementById("contact-detail").innerHTML =
          "<p>Kontakt wurde gelöscht.</p>";
        loadContacts();
      });
  }
}
function openOverlay(name = "", email = "", phone = "") {
  document.getElementById("overlay-name").value = name;
  document.getElementById("overlay-email").value = email;
  document.getElementById("overlay-phone").value = phone;
  document.getElementById("contact-overlay").style.display = "flex";
}

function closeOverlay() {
  document.getElementById("contact-overlay").style.display = "none";
}

function saveContact() {
  const name = document.getElementById("overlay-name").value;
  const email = document.getElementById("overlay-email").value;
  const phone = document.getElementById("overlay-phone").value;

  // Hier kannst du deine Kontakt-Logik einbauen (Firebase, Array, etc.)
  console.log("Speichern:", name, email, phone);
  closeOverlay();
}
function openEditOverlay(contact) {
  document.getElementById("edit-contact-overlay").style.display = "flex";
  document.getElementById("edit-name").value = contact.name;
  document.getElementById("edit-email").value = contact.email;
  document.getElementById("edit-phone").value = contact.phone;
  document.getElementById("edit-avatar").innerText = getInitials(contact.name);
  // Optional: aktuelle ID merken, um später zu speichern
  currentEditingContact = contact;
}

function closeEditOverlay() {
  document.getElementById("edit-contact-overlay").style.display = "none";
}

function saveEditedContact() {
  let newName = document.getElementById("edit-name").value;
  let newEmail = document.getElementById("edit-email").value;
  let newPhone = document.getElementById("edit-phone").value;

  if (currentEditingContact) {
    const updatedContact = {
      name: newName,
      email: newEmail,
      phoneNumber: newPhone,
      avatar: getInitials(newName),
      color: currentEditingContact.color || getRandomColor(),
    };

    database
      .ref("contactList/" + currentEditingContact.key)
      .set(updatedContact)
      .then(() => {
        closeEditOverlay();
        loadContacts();
      });
  }
}

// ✅ OPTIONAL: HTML: <input type="text" oninput="filterContacts(event)" placeholder="Suche..." /> über die Kontaktliste einbauen
