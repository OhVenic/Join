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

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
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

//HELPER FUNCTIONS

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  let phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  return phoneRegex.test(phone);
}

function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

function generateUniqueId() {
  return String(Date.now());
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

function areInputsEmpty(name, email, phone) {
  return !name || !email || !phone;
}

function userAlreadyExists(usersArr, name, email) {
  return usersArr.some((user) => user.user.name === name || user.user.email === email);
}

function createRandomColor() {
  let rgb = "";
  let r = Math.floor(Math.random() * 255) + 1;
  let g = Math.floor(Math.random() * 255) + 1;
  let b = Math.floor(Math.random() * 255) + 1;
  rgb += `rgb(${r}, ${g},${b})`;
  return rgb;
}

// DELETE CONTACT

function deleteContact(id) {
  let index = usersArr.findIndex((user) => user.id === String(id));
  if (index === -1) {
    console.error(`Contact with id ${id} not found.`);
    return;
  }
  usersArr.splice(index, 1);
  removeSingleUser(id);
  closeEditContactModal();
  hideContactDetails();
  renderContacts();
  showLogDelete();
  hideLogDelete();
  hideContactDetailsFloating();
}

async function removeSingleUser(id) {
  deleteData(`contactList/${id}`);
}

function hideLogDelete() {
  setTimeout(() => {
    document.getElementById("deleted-contact-msg").classList.add("closing");
  }, 1700);
}

function showLogDelete() {
  document.getElementById("log-delete").innerHTML = `<div id="deleted-contact-msg" class="created-contact-msg">
    <p>Contact deleted</p>
  </div>`;
  document.getElementById("log-delete").classList.remove("closing");
}

// BUTTONS HOVER CHANGES

function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
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
