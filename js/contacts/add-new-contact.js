// OPEN ADD CONTACT MODAL

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
}

function createContact() {
  let { name, email, phone } = getContactInputs();

  if (validateContactInputs(name, email, phone)) {
    processNewContact(name, email, phone);
  }
}

function validateContactInputs(name, email, phone) {
  if (areInputsEmpty(name, email, phone)) return showErrorMsgsAdd(), false;
  if (userAlreadyExists(usersArr, name, email)) return showValidationError("error-name-exists", "add-cont-name"), false;
  if (!validateEmail(email)) return showValidationError("error-valid-email", "add-cont-email"), false;
  if (!validatePhone(phone)) return showValidationError("error-valid-phone", "add-cont-phone"), false;
  return true;
}

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

function saveUserToDatabase(user) {
  let { id, user: userData } = user;
  addEditSingleUser(id, userData);
}
async function addEditSingleUser(id, user) {
  putData(`contactList/${id}`, user);
}

function scrollToNewContact(contactId) {
  let newContactElement = document.getElementById(`contact-${contactId}`);
  if (newContactElement) {
    newContactElement.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

function showValidationError(errorId, inputId) {
  document.getElementById(errorId).classList.remove("dp-none");
  document.getElementById(inputId).style.borderColor = "red";
}

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
