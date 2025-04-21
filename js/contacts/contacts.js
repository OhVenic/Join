/**
 * Initializes the application by fetching users, rendering contacts, and showing logged-in user info.
 */
async function init() {
  await getUsersFromDatabase();
  renderContacts();
  loadLoginInfo("whoIsLoggedIn");
  await showLoggedInInfo();
}

/**
 * Displays the logged-in user's information or a guest avatar.
 */
async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");
  if (loginInfo[0].isGuestLoggedIn === true) {
    document.getElementById("initialLetter").innerHTML = "G";
  } else {
    document.getElementById("initialLetter").innerHTML = loginInfo[0].userLoggedIn.avatar;
  }
}

let usersArr = [];

/**
 * Fetches users from the database and populates the `usersArr` array.
 */
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

/**
 * Fetches all users from the specified path in the database.
 * @param {string} path - The path to fetch users from.
 * @returns {Promise<Object>} The response data as a JSON object.
 */
async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

/**
 * Renders the contact list by sorting and displaying users.
 */
function renderContacts() {
  const sortedContacts = [...usersArr].sort((a, b) => a.user.name.localeCompare(b.user.name));
  const container = document.getElementById("contacts");
  container.innerHTML = "";
  renderContactListWithLetters(sortedContacts, container);
}

/**
 * Renders the contact list grouped by the first letter of the contact's name.
 * @param {Array} contactArr - The array of contacts to render.
 * @param {HTMLElement} container - The container element to render the contacts into.
 */
function renderContactListWithLetters(contactArr, container) {
  let lastLetter = "";
  contactArr.forEach((contact) => {
    if (contact.user.name === "Guest") return;
    const currentLetter = getFirstLetter(contact.user.name);
    if (currentLetter !== lastLetter) {
      container.innerHTML += contactAlphabetTemplate(contact);
      lastLetter = currentLetter;
    }
    container.innerHTML += contactListItemTemplate(contact);
  });
}

/**
 * Gets the first letter of a given name.
 * @param {string} name - The name to extract the first letter from.
 * @returns {string} The first letter of the name.
 */
function getFirstLetter(name) {
  let firstLetter = name.slice(0, 1);
  return firstLetter;
}

/**
 * Displays the details of a selected contact.
 * @param {string} id - The ID of the contact to display.
 */
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

/**
 * Hides the floating contact details container on smaller screens.
 */
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

/**
 * Highlights the selected contact and displays its details.
 * @param {string} id - The ID of the contact to highlight.
 */
function highlightSelected(id) {
  clearHighlightedContact();
  applyHighlightToContact(id);
  showContactDetailsOnWideScreen();
}

/**
 * Clears the highlight from the previously selected contact.
 */
function clearHighlightedContact() {
  const prev = document.querySelector(".contact-data.highlighted");
  if (!prev) return;
  prev.classList.remove("highlighted");
  Object.assign(prev.style, {
    backgroundColor: "transparent",
    borderRadius: "10px",
    color: "black",
  });
}

/**
 * Applies highlight styles to the selected contact.
 * @param {string} id - The ID of the contact to highlight.
 */
function applyHighlightToContact(id) {
  const contact = document.getElementById(`contact-${id}`);
  if (!contact) return;
  contact.classList.add("highlighted");
  Object.assign(contact.style, {
    backgroundColor: "rgba(42, 54, 71, 1)",
    borderRadius: "10px",
    color: "white",
  });
}

/**
 * Displays the contact details container on wide screens.
 */
function showContactDetailsOnWideScreen() {
  if (window.innerWidth > 900) {
    document.getElementById("contact-display-container").style.display = "block";
  }
}

/**
 * Hides the contact details container.
 */
function hideContactDetails() {
  document.getElementById("contact-display-contact-data").innerHTML = "";
}

/**
 * Validates an email address.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, otherwise false.
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates a phone number.
 * @param {string} phone - The phone number to validate.
 * @returns {boolean} True if the phone number is valid, otherwise false.
 */
function validatePhone(phone) {
  let phoneRegex = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g;
  return phoneRegex.test(phone);
}

/**
 * Removes error messages and resets input styles.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} inputId - The ID of the input element.
 */
function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

/**
 * Generates a unique ID based on the current timestamp.
 * @returns {string} A unique ID.
 */
function generateUniqueId() {
  return String(Date.now());
}

/**
 * Creates an avatar string from the uppercase letters in a given string.
 * @param {string} str - The string to extract uppercase letters from.
 * @returns {string} The avatar string.
 */
function createAvatar(str) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[A-Z]/)) {
      newStr += str[i];
    }
  }
  return newStr;
}

/**
 * Checks if any of the input fields are empty.
 * @param {string} name - The name input.
 * @param {string} email - The email input.
 * @param {string} phone - The phone input.
 * @returns {boolean} True if any input is empty, otherwise false.
 */
function areInputsEmpty(name, email, phone) {
  return !name || !email || !phone;
}

/**
 * Checks if a user with the given name or email already exists.
 * @param {Array} usersArr - The array of existing users.
 * @param {string} name - The name to check.
 * @param {string} email - The email to check.
 * @returns {boolean} True if the user already exists, otherwise false.
 */
function userAlreadyExists(usersArr, name, email) {
  return usersArr.some((user) => user.user.name === name || user.user.email === email);
}

/**
 * Generates a random RGB color string.
 * @returns {string} The RGB color string.
 */
function createRandomColor() {
  let rgb = "";
  let r = Math.floor(Math.random() * 255) + 1;
  let g = Math.floor(Math.random() * 255) + 1;
  let b = Math.floor(Math.random() * 255) + 1;
  rgb += `rgb(${r}, ${g},${b})`;
  return rgb;
}

/**
 * Deletes a contact by ID and updates the UI.
 * @param {string} id - The ID of the contact to delete.
 */
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

/**
 * Removes a single user from the database by ID.
 * @param {string} id - The ID of the user to remove.
 */
async function removeSingleUser(id) {
  deleteData(`contactList/${id}`);
}

/**
 * Hides the delete log message after a delay.
 */
function hideLogDelete() {
  setTimeout(() => {
    document.getElementById("deleted-contact-msg").classList.add("closing");
  }, 1700);
}

/**
 * Displays a log message indicating a contact was deleted.
 */
function showLogDelete() {
  document.getElementById("log-delete").innerHTML = `<div id="deleted-contact-msg" class="created-contact-msg">
    <p>Contact deleted</p>
  </div>`;
  document.getElementById("log-delete").classList.remove("closing");
}

/**
 * Changes the clear icon to a blue version.
 */
function changeToBlueIcon() {
  document.getElementById("clear").classList.add("dp-none");
  document.getElementById("clear-hover").classList.remove("dp-none");
}

/**
 * Changes the clear icon back to a black version.
 */
function changeToBlackIcon() {
  document.getElementById("clear").classList.remove("dp-none");
  document.getElementById("clear-hover").classList.add("dp-none");
}

/**
 * Opens the edit menu for a contact.
 */
function openEditMenu() {
  document.getElementById("contact-edit-delete").classList.add("open-menu");
  document.getElementById("contact-edit-delete").classList.remove("close-menu");
}

/**
 * Changes the edit icon to a blue version.
 */
function changeToBlueIconEdit() {
  document.getElementById("edit-icon-b").classList.remove("dp-none");
  document.getElementById("edit-icon-n").classList.add("dp-none");
}

/**
 * Changes the edit icon back to a black version.
 */
function changeToBlackIconEdit() {
  document.getElementById("edit-icon-b").classList.add("dp-none");
  document.getElementById("edit-icon-n").classList.remove("dp-none");
}

/**
 * Changes the delete icon to a blue version.
 */
function changeToBlueIconDelete() {
  document.getElementById("delete-icon-b").classList.remove("dp-none");
  document.getElementById("delete-icon-n").classList.add("dp-none");
}

/**
 * Changes the delete icon back to a black version.
 */
function changeToBlackIconDelete() {
  document.getElementById("delete-icon-b").classList.add("dp-none");
  document.getElementById("delete-icon-n").classList.remove("dp-none");
}
