/**
 * Generates the HTML template for a contact list item.
 *
 * @param {Object} contact - The contact object containing details about the contact.
 * @param {string} contact.id - The unique ID of the contact.
 * @param {Object} contact.user - The user details of the contact.
 * @param {string} contact.user.color - The background color for the contact's avatar.
 * @param {string} contact.user.avatar - The avatar text or image for the contact.
 * @param {string} contact.user.name - The name of the contact.
 * @param {string} contact.user.email - The email address of the contact.
 * @returns {string} The HTML string for the contact list item.
 */

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

/**
 * Generates the HTML template for an alphabet letter separator in the contact list.
 *
 * @param {Object} contact - The contact object containing details about the contact.
 * @param {Object} contact.user - The user details of the contact.
 * @param {string} contact.user.name - The name of the contact.
 * @returns {string} The HTML string for the alphabet letter separator.
 */
function contactAlphabetTemplate(contact) {
  return `<div class="alphabet-letter">${getFirstLetter(contact.user.name)}</div>
    <div class="separator"></div>`;
}

/**
 * Generates the HTML template for the detailed view of a contact.
 *
 * @param {Object} contact - The contact object containing details about the contact.
 * @param {string} contact.id - The unique ID of the contact.
 * @param {Object} contact.user - The user details of the contact.
 * @param {string} contact.user.color - The background color for the contact's avatar.
 * @param {string} contact.user.avatar - The avatar text or image for the contact.
 * @param {string} contact.user.name - The name of the contact.
 * @param {string} contact.user.email - The email address of the contact.
 * @param {string} contact.user.phoneNumber - The phone number of the contact.
 * @returns {string} The HTML string for the detailed contact view.
 */
function contactDetailTemplate(contact) {
  return `<div class="contact-data-1">
                <div class="edit-resp-menu" onclick="openEditMenu();preventBubbling(event)"><img src="./assets/icons/more_vert.svg" alt="Edit-Delete Responsive Button"></div>
                <div class="edit-delete-menu" id="edit-delete-menu"></div>
                <div class="avatar-m" id="avatar-detail-${contact.id}" style="background-color:${contact.user.color}">${contact.user.avatar}</div>
                <div class="contact-disp-main">
                  <div class="contact-name-m">${contact.user.name}</div>
                  <div class="contact-edit-delete" id="contact-edit-delete">
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
                  <p class="email-info blue">${contact.user.email}</p>
                  <span class="phone-title">Phone</span>
                  <p class="phone-info">${contact.user.phoneNumber}</p>
                </div>
              </div>`;
}

function btnsTemplateEditContact(index) {
  return `<div class="delete btn" onclick="deleteContact(${index})">Delete</div>
            <div class="save-contact btn" onclick="saveContact(${index})"><p>Save</p>
            <img src="./assets/icons/check-white.svg" alt="Check White Icon">
            </div>`;
}
