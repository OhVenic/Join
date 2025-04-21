let originalContactData = {};

/**
 * Opens the modal for editing a contact and populates it with the contact's data.
 * @param {string} id - The ID of the contact to edit.
 */
function openEditContactModal(id) {
  let contact = getContactById(id);
  if (!contact) return;
  storeOriginalContactData(id, contact);
  populateEditModal(contact);
  showEditContactModal(id);
}

/**
 * Retrieves a contact by its ID.
 * @param {string} id - The ID of the contact.
 * @returns {Object|null} - The contact object or null if not found.
 */
function getContactById(id) {
  let contact = usersArr.find((user) => user.id === String(id));
  if (!contact) {
    console.error(`Contact with id ${id} not found.`);
  }
  return contact;
}

/**
 * Stores the original data of a contact before editing.
 * @param {string} id - The ID of the contact.
 * @param {Object} contact - The contact object.
 */
function storeOriginalContactData(id, contact) {
  originalContactData[id] = {
    name: contact.user.name,
    email: contact.user.email,
    phoneNumber: contact.user.phoneNumber,
  };
}

/**
 * Populates the edit modal with the contact's data.
 * @param {Object} contact - The contact object.
 */
function populateEditModal(contact) {
  document.getElementById("avatar-user").innerHTML = contact.user.avatar;
  document.getElementById("avatar-user").style.backgroundColor = contact.user.color;
  document.getElementById("edit-cont-name").value = contact.user.name;
  document.getElementById("edit-cont-email").value = contact.user.email;
  document.getElementById("edit-cont-phone").value = contact.user.phoneNumber;
}

/**
 * Displays the edit contact modal.
 * @param {string} id - The ID of the contact being edited.
 */
function showEditContactModal(id) {
  document.getElementById("modal-cont-edit").classList.remove("dp-none");
  document.getElementById("edit-contact-modal-btns").innerHTML = btnsTemplateEditContact(id);
  document.getElementById("overlay").classList.remove("dp-none");
}

/**
 * Closes the edit contact modal and resets input fields and error messages.
 * @param {string} id - The ID of the contact being edited.
 */
function closeEditContactModal(id) {
  removeEditContactErrorMsgs(id);
  document.getElementById("modal-cont-edit").classList.add("dp-none");
  document.getElementById("modal-cont-edit").classList.add("closing-edit");
  document.getElementById("overlay").classList.add("dp-none");
}

/**
 * Removes all error messages from the edit contact modal.
 */
function removeAllErrorMsgs() {
  removeErrorMsgs("error-name-edit", "edit-cont-name");
  removeErrorMsgs("error-name-exists-edit", "edit-cont-name");
  removeErrorMsgs("error-email-edit", "edit-cont-email");
  removeErrorMsgs("error-valid-email-edit", "edit-cont-email");
  removeErrorMsgs("error-phone-edit", "edit-cont-phone");
  removeErrorMsgs("error-valid-phone-edit", "edit-cont-phone");
}

/**
 * Removes error messages and resets input fields in the edit contact modal.
 * @param {string} id - The ID of the contact being edited.
 */
function removeEditContactErrorMsgs(id) {
  removeAllErrorMsgs();
  resetInputStyles("edit-cont-name");
  resetInputStyles("edit-cont-email");
  resetInputStyles("edit-cont-phone");
  if (originalContactData[id]) {
    document.getElementById("edit-cont-name").value = originalContactData[id].name;
    document.getElementById("edit-cont-email").value = originalContactData[id].email;
    document.getElementById("edit-cont-phone").value = originalContactData[id].phoneNumber;
  }
}

/**
 * Resets the input field styles to their default state.
 * @param {string} inputId - The ID of the input field.
 */
function resetInputStyles(inputId) {
  let inputElement = document.getElementById(inputId);
  if (inputElement) {
    inputElement.style.borderColor = "";
  }
}

/**
 * Saves the edited contact details.
 * @param {string} id - The ID of the contact being edited.
 */
function saveContact(id) {
  let contactIndex = findContactIndexById(id);
  if (contactIndex === -1) return;

  let { name, email, phone } = getContactInputsEdit();
  updateContactDetails(contactIndex, name, email, phone);

  if (validateContactEditInputs(name, email, phone)) {
    processValidContact(contactIndex, id);
  }
}

/**
 * Finds the index of a contact by its ID.
 * @param {string} id - The ID of the contact.
 * @returns {number} - The index of the contact or -1 if not found.
 */
function findContactIndexById(id) {
  let contactIndex = usersArr.findIndex((user) => user.id === String(id));
  if (contactIndex === -1) {
    console.error(`Contact with id ${id} not found.`);
  }
  return contactIndex;
}

/**
 * Updates the details of a contact in the users array.
 * @param {number} contactIndex - The index of the contact in the array.
 * @param {string} name - The updated name of the contact.
 * @param {string} email - The updated email of the contact.
 * @param {string} phone - The updated phone number of the contact.
 */
function updateContactDetails(contactIndex, name, email, phone) {
  usersArr[contactIndex].user.name = name;
  usersArr[contactIndex].user.email = email;
  usersArr[contactIndex].user.phoneNumber = phone;
  usersArr[contactIndex].user.avatar = createAvatar(name);
}

/**
 * Validates the input fields for editing a contact.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @param {string} phone - The phone number of the contact.
 * @returns {boolean} - Returns true if all validations pass, otherwise false.
 */
function validateContactEditInputs(name, email, phone) {
  if (areInputsEmpty(name, email, phone)) return showErrorMsgsEdit(), false;
  if (otherUserAlreadyExists(name, email))
    return showValidationError("error-name-exists-edit", "edit-cont-name"), false;
  if (!validateEmail(email)) return showValidationError("error-valid-email-edit", "edit-cont-email"), false;
  if (!validatePhone(phone)) return showValidationError("error-valid-phone-edit", "edit-cont-phone"), false;
  return true;
}

/**
 * Checks if another user with the same name or email already exists.
 * @param {string} name - The name of the contact.
 * @param {string} email - The email of the contact.
 * @returns {boolean} - Returns true if another user exists, otherwise false.
 */
function otherUserAlreadyExists(name, email) {
  let allOtherUser = usersArr.filter((user) => user.user.name !== name || user.user.email !== email);
  return allOtherUser.some((user) => user.user.name === name || user.user.email === email);
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
 * Processes a valid contact edit and updates the UI.
 * @param {number} contactIndex - The index of the contact in the array.
 * @param {string} id - The ID of the contact.
 */
function processValidContact(contactIndex, id) {
  let editedUser = editUser(contactIndex);
  saveUserToDatabase(editedUser);
  renderContacts();
  showContactDetails(id);
  closeEditContactModal();
  showLogEdit();
  hideLogEdit();
}

/**
 * Displays error messages for empty input fields in the edit modal.
 */
function showErrorMsgsEdit() {
  if (document.getElementById("edit-cont-name").value === "") {
    document.getElementById("error-name-edit").classList.remove("dp-none");
    document.getElementById("edit-cont-name").style.borderColor = "red";
  }
  if (document.getElementById("edit-cont-phone").value === "") {
    document.getElementById("error-phone-edit").classList.remove("dp-none");
    document.getElementById("edit-cont-phone").style.borderColor = "red";
  }
  if (document.getElementById("edit-cont-email").value === "") {
    document.getElementById("error-email-edit").classList.remove("dp-none");
    document.getElementById("edit-cont-email").style.borderColor = "red";
  }
}

/**
 * Creates an edited user object.
 * @param {number} index - The index of the user in the array.
 * @returns {Object} - The edited user object.
 */
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

/**
 * Retrieves the input values for editing a contact.
 * @returns {Object} - An object containing the name, email, and phone values.
 */
function getContactInputsEdit() {
  return {
    name: document.getElementById("edit-cont-name").value,
    email: document.getElementById("edit-cont-email").value,
    phone: document.getElementById("edit-cont-phone").value,
  };
}

/**
 * Displays a success log message for editing a contact.
 */
function showLogEdit() {
  document.getElementById("log-edit").innerHTML = `<div id="edited-contact-msg" class="edited-contact-msg">
      <p>Contact edited successfully</p>
    </div>`;
  document.getElementById("log-edit").classList.remove("closing");
}

/**
 * Hides the success log message after a delay.
 */
function hideLogEdit() {
  setTimeout(() => {
    document.getElementById("edited-contact-msg").classList.add("closing");
  }, 1700);
}
