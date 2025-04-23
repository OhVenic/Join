/**
 * Opens the modal for adding a new contact and resets input fields.
 */
function openAddContactModal() {
  document.getElementById("add-cont-name").value = "";
  document.getElementById("add-cont-email").value = "";
  document.getElementById("add-cont-phone").value = "";
  document.getElementById("modal-cont").classList.remove("dp-none");
  document.getElementById("overlay").classList.remove("dp-none");
}

/**
 * Closes the modal for adding a new contact and removes error messages.
 */
function closeAddContactModal() {
  document.getElementById("modal-cont").classList.add("dp-none");
  document.getElementById("overlay").classList.add("dp-none");
  removeErrorMsgs("error-name", "add-cont-name");
  removeErrorMsgs("error-name-exists", "add-cont-name");
  removeErrorMsgs("error-email", "add-cont-email");
  removeErrorMsgs("error-valid-email", "add-cont-email");
  removeErrorMsgs("error-phone", "add-cont-phone");
  removeErrorMsgs("error-valid-phone", "add-cont-email");
}

/**
 * Creates a new contact if the input validation passes.
 */
function createContact() {
  let { name, email, phone } = getContactInputs();
  if (validateContactInputs(name, email, phone)) {
    processNewContact(name, email, phone);
  }
}

/**
 * Validates the contact input fields.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {boolean} - Returns true if all validations pass, otherwise false.
 */
function validateContactInputs(name, email, phone) {
  if (areInputsEmpty(name, email, phone)) return showErrorMsgsAdd(), false;
  if (userAlreadyExists(usersArr, name, email)) return showValidationError("error-name-exists", "add-cont-name"), false;
  if (!validateEmail(email)) return showValidationError("error-valid-email", "add-cont-email"), false;
  if (!validatePhone(phone)) return showValidationError("error-valid-phone", "add-cont-phone"), false;
  return true;
}

/**
 * Processes the creation of a new contact and updates the UI.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 */
function processNewContact(name, email, phone) {
  let newUser = createNewUser(name, email, phone);
  usersArr.push(newUser);
  saveUserToDatabase(newUser);
  renderContacts();
  showContactDetails(newUser.id);
  highlightSelected(newUser.id);
  scrollToNewContact(newUser.id);
  closeAddContactModal();
  showLog();
  hideLog();
}

/**
 * Creates a new user object.
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} phone - The phone number of the user.
 * @returns {Object} - The new user object.
 */
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

/**
 * Saves a user to the database.
 * @param {Object} user - The user object to save.
 */
function saveUserToDatabase(user) {
  let { id, user: userData } = user;
  addEditSingleUser(id, userData);
}

/**
 * Sends a PUT request to save or edit a single user in the database.
 * @param {string} id - The ID of the user.
 * @param {Object} user - The user data to save.
 */
async function addEditSingleUser(id, user) {
  putData(`contactList/${id}`, user);
}

/**
 * Scrolls to the newly created contact in the contact list.
 * @param {string} contactId - The ID of the new contact.
 */
function scrollToNewContact(contactId) {
  let newContactElement = document.getElementById(`contact-${contactId}`);
  if (newContactElement) {
    newContactElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

/**
 * Displays a validation error message for a specific input field.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} inputId - The ID of the input field.
 */
function showValidationError(errorId, inputId) {
  document.getElementById(errorId).classList.remove("dp-none");
  document.getElementById(inputId).style.borderColor = "red";
}

/**
 * Displays error messages for empty input fields.
 */
function showErrorMsgsAdd() {
  if (document.getElementById("add-cont-name").value === "") {
    document.getElementById("error-name").classList.remove("dp-none");
    document.getElementById("add-cont-name").style.borderColor = "red";
  }
  if (document.getElementById("add-cont-phone").value === "") {
    document.getElementById("error-email").classList.remove("dp-none");
    document.getElementById("add-cont-phone").style.borderColor = "red";
  }
  if (document.getElementById("add-cont-email").value === "") {
    document.getElementById("error-phone").classList.remove("dp-none");
    document.getElementById("add-cont-email").style.borderColor = "red";
  }
}

/**
 * Hides the success log message after a delay.
 */
function hideLog() {
  setTimeout(() => {
    document.getElementById("created-contact-msg").classList.add("closing");
  }, 1700);
}

/**
 * Displays a success log message for creating a contact.
 */
function showLog() {
  document.getElementById("log").innerHTML = `<div id="created-contact-msg" class="created-contact-msg">
        <p>Contact created successfully</p>
      </div>`;
  document.getElementById("log").classList.remove("closing");
}

/**
 * Retrieves the input values for creating a new contact.
 * @returns {Object} - An object containing the name, email, and phone values.
 */
function getContactInputs() {
  return {
    name: document.getElementById("add-cont-name").value,
    email: document.getElementById("add-cont-email").value,
    phone: document.getElementById("add-cont-phone").value,
  };
}
