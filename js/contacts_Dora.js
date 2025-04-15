async function init() {
  await getUsersFromDatabase();
  renderContacts();
  loadLoginInfo("whoIsLoggedIn");
  await showLoggedInInfo();
}
async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");
  if (loginInfo[0].isGuestLoggedIn === true) {
    document.getElementById("initialLetter").innerHTML = "G";
  } else {
    document.getElementById("initialLetter").innerHTML = loginInfo[0].userLoggedIn.avatar;
  }
}
let usersArr = [];

function contactListItemTemplate(contact) {
  return `<div class="contact-list-item">
            <div id="contact-separation"></div>
            <div class="contact-data" id="contact-${contact.id}" onclick='showContactDetails("${contact.id}")'>
              <div class="contact-avatar" style="background-color:${contact.user.color};" id="avatar-${contact.id}">${contact.user.avatar}</div>
              <div class="contact-right">
                <p class="list-contact-name">${contact.user.name}</p>
                <span class="list-contact-email">${contact.user.email}</span>
              </div>
            </div>
          </div>`;
}

function contactAlphabetTemplate(contact) {
  return `<div class="alphabet-letter">${getFirstLetter(contact.user.name)}</div>
  <div class="separator"></div>`;
}
async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("contactList");
  let UserKeysArray = Object.keys(userResponse);
  for (let index = 0; index < UserKeysArray.length; index++) {
    let user = userResponse[UserKeysArray[index]];
    // Validate the user object before adding it to the array
    if (user && user.name && user.email) {
      usersArr.push({
        id: UserKeysArray[index],
        user: user,
      });
    } else {
      console.warn(`Invalid user data at key ${UserKeysArray[index]}:`, user);
    }
  }
  console.log(usersArr);
}

function renderContacts() {
  // Create a sorted copy of the array to avoid modifying the original
  let sortedContactArr = [...usersArr].sort((a, b) => a.user.name.localeCompare(b.user.name));
  const contactsContainer = document.getElementById("contacts");
  contactsContainer.innerHTML = ""; // Clear the container
  let lastLetter = ""; // Keep track of the last rendered letter
  for (let i = 0; i < sortedContactArr.length; i++) {
    const contact = sortedContactArr[i];
    // Skip rendering if the contact name is "Guest"
    if (contact.user.name === "Guest") {
      continue;
    }
    let currentLetter = getFirstLetter(contact.user.name);
    // Render the letter and separator only if it's different from the last one
    if (currentLetter !== lastLetter) {
      contactsContainer.innerHTML += contactAlphabetTemplate(contact);
      lastLetter = currentLetter; // Update the last rendered letter
    }
    // Render the contact item
    contactsContainer.innerHTML += contactListItemTemplate(contact);
  }
}

function getFirstLetter(name) {
  let firstLetter = name.slice(0, 1);
  return firstLetter;
}

// CONTACT DETAILS, WHEN SELECTED, ON THE RIGHT SIDE

function showContactDetails(id) {
  // Find the contact by matching the id
  const contact = usersArr.find((user) => user.id === String(id));
  if (!contact) {
    console.error(`Contact with id ${id} not found.`);
    return;
  }
  document.getElementById("contact-display-contact-data").innerHTML = contactDetailTemplate(contact);
  highlightSelected(id);
}

function highlightSelected(id) {
  // Step 1: Find the previously selected contact
  const previouslySelected = document.querySelector(".contact-data.highlighted");
  if (previouslySelected) {
    // Step 2: Remove the 'highlighted' class and reset styles
    previouslySelected.classList.remove("highlighted");
    previouslySelected.style.backgroundColor = "transparent"; // Reset background color
    previouslySelected.style.borderRadius = "10px"; // Reset border radius
    previouslySelected.style.color = "black"; // Reset text color
  }

  // Step 3: Find the newly selected contact by its ID
  const selectedContact = document.getElementById(`contact-${id}`);

  // Step 4: Add the 'highlighted' class and apply highlight styles
  if (selectedContact) {
    selectedContact.classList.add("highlighted");
    selectedContact.style.backgroundColor = "rgba(42, 54, 71, 1)"; // Highlight background color
    selectedContact.style.borderRadius = "10px"; // Rounded corners
    selectedContact.style.color = "white"; // Highlight text color
  }
}

function hideContactDetails() {
  document.getElementById("contact-display-contact-data").innerHTML = "";
}

function contactDetailTemplate(contact) {
  return `<div class="contact-data-1">
              <div class="avatar-m" id="avatar-detail-${contact.id}" style="background-color:${contact.user.color}">${contact.user.avatar}</div>
              <div class="contact-disp-main">
                <div class="contact-name-m">${contact.user.name}</div>
                <div class="contact-edit-delete">
                  <div class="contact-change edit" id="${contact.id}" onclick="openEditContactModal('${contact.id}')" onmouseover="changeToBlueIconEdit()" onmouseout="changeToBlackIconEdit()">
                    <img id="edit-icon-n" class="icon" src="./assets/icons/edit.svg" alt="Edit Icon Normal">
                    <img id="edit-icon-b" class="dp-none icon" src="./assets/icons/edit-blue.svg" alt="Edit Icon Hover">
                    <p>Edit</p>
                  </div>
                  <div class="contact-change delete-display" id="${contact.id}" onclick="deleteContact('${contact.id}')" onmouseover="changeToBlueIconDelete()" onmouseout="changeToBlackIconDelete()">
                    <img id="delete-icon-n" class="icon" src="./assets/icons/delete.svg" alt="Delete Icon Normal">
                    <img id="delete-icon-b" class="dp-none icon" src="./assets/icons/delete-blue.svg" alt="Delete Icon Hover">
                    <p>Delete</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="contact-data-2">
              <p class="contact-data-2-title">Contact information</p>
              <div class="email-phone">
                <span class="email-title">Email</span>
                <p class="email blue">${contact.user.email}</p>
                <span class="phone-title">Phone</span>
                <p class="phone">${contact.user.phoneNumber}</p>
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

// ADD CONTACT MODAL

function openAddContactModal() {
  // Clear the input fields
  document.getElementById("add-cont-name").value = "";
  document.getElementById("add-cont-email").value = "";
  document.getElementById("add-cont-phone").value = "";
  // Show the modal
  document.getElementById("modal-cont").classList.remove("dp-none");
  document.getElementById("overlay").classList.remove("dp-none");
}

function closeAddContactModal() {
  document.getElementById("modal-cont").classList.add("dp-none");
  document.getElementById("overlay").classList.add("dp-none");
  hideLog();
}

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

//refactored
function createContact() {
  const { name, email, phone } = getContactInputs();
  if (areInputsEmpty(name, email, phone)) return console.log("inputs are empty");
  if (userAlreadyExists(usersArr, name, email)) return console.log("already exists");
  const newUser = createNewUser(name, email, phone);
  usersArr.push(newUser);
  saveUserToDatabase(newUser);
  renderContacts();
  showContactDetails(newUser.id);
  // Highlight the newly created contact
  highlightSelected(newUser.id);
  // Scroll to the newly created contact
  const newContactElement = document.getElementById(`contact-${newUser.id}`);
  if (newContactElement) {
    newContactElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  closeAddContactModal();
  showLog();
}

function hideLog() {
  setTimeout(() => {
    document.getElementById("created-contact-msg").classList.add("closing");
  }, 1700);
}

function showLog() {
  document.getElementById("log").innerHTML = `<div id="created-contact-msg" class="created-contact-msg">
    <p>Contact created successfully</p>
  </div>`;
  document.getElementById("log").classList.remove("closing");
}

function getContactInputs() {
  return {
    name: document.getElementById("add-cont-name").value,
    email: document.getElementById("add-cont-email").value,
    phone: document.getElementById("add-cont-phone").value,
  };
}

function areInputsEmpty(name, email, phone) {
  return !name || !email || !phone;
}

function createNewUser(name, email, phone) {
  return {
    id: generateUniqueId(), // Generate a unique ID
    user: {
      color: createRandomColor(),
      email,
      name,
      password: "",
      avatar: createAvatar(name),
      phoneNumber: phone,
    },
  };
}

function generateUniqueId() {
  return String(Date.now()); // Use the current timestamp as a unique ID
}

function saveUserToDatabase({ id, user }) {
  addEditSingleUser(id, { ...user });
}

function createAvatar(str) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[A-Z]/)) {
      newStr += str[i];
    }
  }
  return newStr;
}
function areInputsEmpty() {
  let name = document.getElementById("add-cont-name");
  let email = document.getElementById("add-cont-email");
  let phone = document.getElementById("add-cont-phone");
  if (email.value === "" || phone.value === "" || name.value === "") {
    return true;
  }
}
function userAlreadyExists(usersArr, name, email) {
  return usersArr.some((user) => user.user.name === name && user.user.email === email);
}

function createRandomColor() {
  let rgb = "";
  let r = Math.floor(Math.random() * 255) + 1;
  let g = Math.floor(Math.random() * 255) + 1;
  let b = Math.floor(Math.random() * 255) + 1;
  rgb += `rgb(${r}, ${g},${b})`;
  return rgb;
}

//EDIT CONTACT MODAL

function openEditContactModal(id) {
  const contact = usersArr.find((user) => user.id === String(id));
  if (!contact) {
    console.error(`Contact with id ${id} not found.`);
    return;
  }

  document.getElementById("modal-cont-edit").classList.remove("dp-none");
  console.log(`${id} clicked`);
  console.log(contact.user.avatar);

  document.getElementById("avatar-user").innerHTML = `${contact.user.avatar}`;
  document.getElementById("avatar-user").style.backgroundColor = `${contact.user.color}`;
  document.getElementById("edit-cont-name").value = `${contact.user.name}`;
  document.getElementById("edit-cont-email").value = `${contact.user.email}`;
  document.getElementById("edit-cont-phone").value = `${contact.user.phoneNumber}`;
  document.getElementById("edit-contact-modal-btns").innerHTML = btnsTemplateEditContact(id);
  document.getElementById("overlay").classList.remove("dp-none");
}

function closeEditContactModal() {
  document.getElementById("modal-cont-edit").classList.add("dp-none");
  document.getElementById("modal-cont-edit").classList.add("closing-edit");
  document.getElementById("overlay").classList.add("dp-none");
}

function saveContact(id) {
  const contactIndex = usersArr.findIndex((user) => user.id === String(id));
  if (contactIndex === -1) {
    console.error(`Contact with id ${id} not found.`);
    return;
  }
  let name = document.getElementById("edit-cont-name");
  let email = document.getElementById("edit-cont-email");
  let phone = document.getElementById("edit-cont-phone");
  console.log(name.value, email.value, phone.value);

  usersArr[contactIndex].user.name = name.value;
  usersArr[contactIndex].user.email = email.value;
  usersArr[contactIndex].user.phoneNumber = phone.value;
  usersArr[contactIndex].user.avatar = createAvatar(name.value);
  console.log(usersArr);

  let editedUser = editUser(contactIndex);
  saveUserToDatabase(editedUser);
  renderContacts();
  showContactDetails(id);
  closeEditContactModal();
}

function editUser(index) {
  return {
    id: usersArr[index].id,
    user: {
      color: usersArr[index].user.color,
      email: usersArr[index].user.email,
      name: usersArr[index].user.name,
      password: usersArr[index].user.password,
      avatar: usersArr[index].user.avatar,
      phoneNumber: usersArr[index].user.phoneNumber,
    },
  };
}

function saveUserToDatabase(user) {
  const { id, user: userData } = user;
  addEditSingleUser(id, userData);
}
async function addEditSingleUser(id, user) {
  putData(`contactList/${id}`, user);
}

function btnsTemplateEditContact(index) {
  return `<div class="delete btn" onclick="deleteContact(${index})">Delete</div>
          <div class="save-contact btn" onclick="saveContact(${index})"><p>Save</p>
          <img src="./assets/icons/check-white.svg" alt="Check White Icon">
          </div>`;
}

function deleteContact(id) {
  const index = usersArr.findIndex((user) => user.id === String(id));
  if (index === -1) {
    console.error(`Contact with id ${id} not found.`);
    return;
  }
  usersArr.splice(index, 1); // Remove the contact from the usersArr array
  removeSingleUser(id);
  closeEditContactModal();
  hideContactDetails();
  renderContacts();
}

async function removeSingleUser(id) {
  deleteData(`contactList/${id}`);
}

function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}
