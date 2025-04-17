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

async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("contactList");
  let UserKeysArray = Object.keys(userResponse);
  for (let index = 0; index < UserKeysArray.length; index++) {
    let user = userResponse[UserKeysArray[index]];
    if (user && user.name && user.email) {
      usersArr.push({
        id: UserKeysArray[index],
        user: user,
      });
    } else {
      console.warn(`Invalid user data at key ${UserKeysArray[index]}:`, user);
    }
  }
}

function renderContacts() {
  let sortedContactArr = [...usersArr].sort((a, b) => a.user.name.localeCompare(b.user.name));
  const contactsContainer = document.getElementById("contacts");
  contactsContainer.innerHTML = "";
  let lastLetter = "";
  for (let i = 0; i < sortedContactArr.length; i++) {
    const contact = sortedContactArr[i];
    if (contact.user.name === "Guest") {
      continue;
    }
    let currentLetter = getFirstLetter(contact.user.name);
    if (currentLetter !== lastLetter) {
      contactsContainer.innerHTML += contactAlphabetTemplate(contact);
      lastLetter = currentLetter;
    }
    contactsContainer.innerHTML += contactListItemTemplate(contact);
  }
}

function getFirstLetter(name) {
  let firstLetter = name.slice(0, 1);
  return firstLetter;
}

// CONTACT DETAILS, WHEN SELECTED, ON THE RIGHT SIDE

function showContactDetails(id) {
  const contact = usersArr.find((user) => user.id === String(id));
  if (!contact) {
    console.error(`Contact with id ${id} not found.`);
    return;
  }
  document.getElementById("contact-display-contact-data").innerHTML = contactDetailTemplate(contact);
  if (window.innerWidth < 900) {
    document.getElementById("contact-display-container").style.display = "block";
  }
  highlightSelected(id);
}

function hideContactDetailsFloating() {
  if (window.innerWidth < 900) {
    document.getElementById("contact-display-container").style.display = "none";
  } else if (window.innerWidth > 900) {
    document.getElementById("contact-display-container").style.display = "block";
  }
  const previouslySelected = document.querySelector(".contact-data.highlighted");
  if (previouslySelected) {
    previouslySelected.classList.remove("highlighted");
    previouslySelected.style.backgroundColor = "transparent";
    previouslySelected.style.borderRadius = "10px";
    previouslySelected.style.color = "black";
  }
}

function highlightSelected(id) {
  let previouslySelected = document.querySelector(".contact-data.highlighted");
  if (previouslySelected) {
    previouslySelected.classList.remove("highlighted");
    previouslySelected.style.backgroundColor = "transparent";
    previouslySelected.style.borderRadius = "10px";
    previouslySelected.style.color = "black";
  }
  let selectedContact = document.getElementById(`contact-${id}`);
  if (selectedContact) {
    selectedContact.classList.add("highlighted");
    selectedContact.style.backgroundColor = "rgba(42, 54, 71, 1)";
    selectedContact.style.borderRadius = "10px";
    selectedContact.style.color = "white";
  }
  if (window.innerWidth > 900) {
    document.getElementById("contact-display-container").style.display = "block";
  }
}

function hideContactDetails() {
  document.getElementById("contact-display-contact-data").innerHTML = "";
}

function openEditMenu() {
  document.getElementById("contact-edit-delete").classList.add("open-menu");
  document.getElementById("contact-edit-delete").classList.remove("close-menu");
}

function closeEditMenu() {
  document.getElementById("contact-edit-delete").classList.remove("open-menu");
  document.getElementById("contact-edit-delete").classList.add("close-menu");
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
  document.getElementById("add-cont-name").value = "";
  document.getElementById("add-cont-email").value = "";
  document.getElementById("add-cont-phone").value = "";
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

function createContact() {
  let { name, email, phone } = getContactInputs();
  if (areInputsEmpty(name, email, phone)) return console.log("inputs are empty");
  if (userAlreadyExists(usersArr, name, email)) return console.log("already exists");
  let newUser = createNewUser(name, email, phone);
  usersArr.push(newUser);
  saveUserToDatabase(newUser);
  renderContacts();
  showContactDetails(newUser.id);
  highlightSelected(newUser.id);
  let newContactElement = document.getElementById(`contact-${newUser.id}`);
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

function createNewUser(name, email, phone) {
  return {
    id: generateUniqueId(),
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
  return String(Date.now());
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
  usersArr[contactIndex].user.name = name.value;
  usersArr[contactIndex].user.email = email.value;
  usersArr[contactIndex].user.phoneNumber = phone.value;
  usersArr[contactIndex].user.avatar = createAvatar(name.value);
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

function deleteContact(id) {
  const index = usersArr.findIndex((user) => user.id === String(id));
  if (index === -1) {
    console.error(`Contact with id ${id} not found.`);
    return;
  }
  usersArr.splice(index, 1);
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
