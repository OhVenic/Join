//OPEN EDIT CONTACT MODAL

function openEditContactModal(id) {
  let contact = usersArr.find((user) => user.id === String(id));
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
  let contactIndex = findContactIndexById(id);
  if (contactIndex === -1) return;

  let { name, email, phone } = getContactInputsEdit();
  updateContactDetails(contactIndex, name, email, phone);

  if (validateContactEditInputs(name, email, phone)) {
    processValidContact(contactIndex, id);
  }
}

function findContactIndexById(id) {
  const contactIndex = usersArr.findIndex((user) => user.id === String(id));
  if (contactIndex === -1) {
    console.error(`Contact with id ${id} not found.`);
  }
  return contactIndex;
}

function updateContactDetails(contactIndex, name, email, phone) {
  usersArr[contactIndex].user.name = name;
  usersArr[contactIndex].user.email = email;
  usersArr[contactIndex].user.phoneNumber = phone;
  usersArr[contactIndex].user.avatar = createAvatar(name);
}

function validateContactEditInputs(name, email, phone) {
  if (areInputsEmpty(name, email, phone)) return showErrorMsgsEdit(), false;
  if (!validateEmail(email)) return showValidationError("error-valid-email-edit", "edit-cont-email"), false;
  if (!validatePhone(phone)) return showValidationError("error-valid-phone-edit", "edit-cont-phone"), false;
  return true;
}

function showValidationError(errorId, inputId) {
  document.getElementById(errorId).classList.remove("dp-none");
  document.getElementById(inputId).style.borderColor = "red";
}

function processValidContact(contactIndex, id) {
  const editedUser = editUser(contactIndex);
  saveUserToDatabase(editedUser);
  renderContacts();
  showContactDetails(id);
  closeEditContactModal();
  showLogEdit();
  hideLogEdit();
}

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

function getContactInputsEdit() {
  return {
    name: document.getElementById("edit-cont-name").value,
    email: document.getElementById("edit-cont-email").value,
    phone: document.getElementById("edit-cont-phone").value,
  };
}

function showLogEdit() {
  document.getElementById("log-edit").innerHTML = `<div id="edited-contact-msg" class="edited-contact-msg">
      <p>Contact edited successfully</p>
    </div>`;
  document.getElementById("log-edit").classList.remove("closing");
}

function hideLogEdit() {
  setTimeout(() => {
    document.getElementById("edited-contact-msg").classList.add("closing");
  }, 1700);
}
