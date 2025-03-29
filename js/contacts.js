<<<<<<< HEAD
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3000);
}


function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

let currentContactId = null;

function showContactDetails(contactId) {
  currentContactId = contactId;
  const contact = contacts[contactId];
  document.getElementById('contact-name').textContent = contact.name;
  document.getElementById('contact-email').textContent = contact.email;
  document.getElementById('contact-email').href = `mailto:${contact.email}`;
  document.getElementById('contact-phone').textContent = contact.phone;
  const badge = document.querySelector('.user-badge.large');
  badge.textContent = contactId.split('-')[0].charAt(0).toUpperCase() + contactId.split('-')[1]?.charAt(0).toUpperCase() || '';
  badge.className = `user-badge large ${contact.name.charAt(0).toLowerCase()}`;
  document.getElementById('contact-details').classList.remove('hidden');
}

function openAddContactModal() {
  document.getElementById('add-contact-modal').classList.remove('hidden');
}

function openEditContactModal() {
  const contact = contacts[currentContactId];
  document.getElementById('edit-name').value = contact.name;
  document.getElementById('edit-email').value = contact.email;
  document.getElementById('edit-phone').value = contact.phone;
  document.getElementById('edit-contact-modal').classList.remove('hidden');
}

function getContactDataFromForm(formId) {
  const name = document.getElementById(`${formId}-name`).value.trim();
  const email = document.getElementById(`${formId}-email`).value.trim();
  const phone = document.getElementById(`${formId}-phone`).value.trim();
  return { name, email, phone };
}

function createLetterSection(firstLetter) {
  const letterSection = document.createElement('div');
  letterSection.className = 'letter-section';
  letterSection.innerHTML = `
    <h2 data-letter="${firstLetter}">${firstLetter}</h2>
    <hr class="section-divider" />
  `;
  return letterSection;
}

function insertLetterSection(letterSection, firstLetter) {
  const sections = document.querySelectorAll('.letter-section');
  let inserted = false;
  for (let section of sections) {
    if (section.querySelector('h2').textContent > firstLetter) {
      section.before(letterSection);
      inserted = true;
      break;
    }
  }
  if (!inserted) {
    document.querySelector('.contacts-list').appendChild(letterSection);
  }
}

function createContactCard(contactId, contact) {
  const contactCard = document.createElement('div');
  contactCard.className = 'contact-card';
  contactCard.setAttribute('onclick', `showContactDetails('${contactId}')`);
  contactCard.innerHTML = `
    <div class="user-badge ${contact.name.charAt(0).toLowerCase()}">${contact.name.charAt(0).toUpperCase()}${contact.name.split(' ')[1]?.charAt(0).toUpperCase() || ''}</div>
    <div class="contact-info">
      <p>${contact.name}</p>
      <p class="email">${contact.email}</p>
    </div>
  `;
  return contactCard;
}

function addContact(event) {
  event.preventDefault();
  const contactData = getContactDataFromForm('add');
  if (!validateEmail(contactData.email)) {
    showToast('Please enter a valid email address.');
    return;
  }
  const contactId = contactData.name.toLowerCase().replace(' ', '-');
  contacts[contactId] = contactData;
  const firstLetter = contactData.name.charAt(0).toUpperCase();
  let letterSection = document.querySelector(`.letter-section h2[data-letter="${firstLetter}"]`)?.parentElement;
  if (!letterSection) {
    letterSection = createLetterSection(firstLetter);
    insertLetterSection(letterSection, firstLetter);
  }
  const contactCard = createContactCard(contactId, contactData);
  letterSection.appendChild(contactCard);
  showToast('Contact added successfully!');
  closeModal();
}

function updateContactCard(contact) {
  const contactCard = document.querySelector(`.contact-card[onclick="showContactDetails('${currentContactId}')"]`);
  contactCard.querySelector('p').textContent = contact.name;
  contactCard.querySelector('.email').textContent = contact.email;
  const badge = contactCard.querySelector('.user-badge');
  badge.textContent = contact.name.charAt(0).toUpperCase() + (contact.name.split(' ')[1]?.charAt(0).toUpperCase() || '');
  badge.className = `user-badge ${contact.name.charAt(0).toLowerCase()}`;
}

function handleLetterSectionChange(contact, oldFirstLetter) {
  const contactCard = document.querySelector(`.contact-card[onclick="showContactDetails('${currentContactId}')"]`);
  const letterSection = contactCard.parentElement;
  const newFirstLetter = contact.name.charAt(0).toUpperCase();
  if (oldFirstLetter !== newFirstLetter) {
    contactCard.remove();
    if (letterSection.querySelectorAll('.contact-card').length === 0) {
      letterSection.remove();
    }
    addContact({ preventDefault: () => {} });
  }
}

function saveContactEdit(event) {
  event.preventDefault();
  const contact = contacts[currentContactId];
  const oldFirstLetter = contact.name.charAt(0).toUpperCase();
  const contactData = getContactDataFromForm('edit');
  if (!validateEmail(contactData.email)) {
    showToast('Please enter a valid email address.');
    return;
  }
  contact.name = contactData.name;
  contact.email = contactData.email;
  contact.phone = contactData.phone;
  updateContactCard(contact);
  handleLetterSectionChange(contact, oldFirstLetter);
  showContactDetails(currentContactId);
  showToast('Contact updated successfully!');
  closeModal();
}

function removeContactFromTasks() {
  Object.values(tasks).forEach(task => {
    task.assigned = task.assigned.filter(person => person !== currentContactId.split('-')[0].toUpperCase() + currentContactId.split('-')[1]?.charAt(0).toUpperCase());
    const taskCard = document.querySelector(`.task-card[id="${task.id}"]`);
    if (taskCard) {
      const userBadges = taskCard.querySelector('.user-badges');
      userBadges.innerHTML = task.assigned.map(person => `
        <div class="user-badge ${person.charAt(0).toLowerCase()}">${person}</div>
      `).join('');
    }
  });
}

function deleteContact() {
  const contactCard = document.querySelector(`.contact-card[onclick="showContactDetails('${currentContactId}')"]`);
  const letterSection = contactCard.parentElement;
  contactCard.remove();
  if (letterSection.querySelectorAll('.contact-card').length === 0) {
    letterSection.remove();
  }
  removeContactFromTasks();
  delete contacts[currentContactId];
  document.getElementById('contact-details').classList.add('hidden');
  showToast('Contact deleted successfully!');
}

function closeModal() {
  document.getElementById('add-contact-modal').classList.add('hidden');
  document.getElementById('edit-contact-modal').classList.add('hidden');
=======
function openAddContactModal() {
    const modal = document.getElementById('add-contact-modal');
    modal.style.display = 'block';
}

function closeAddContactModal() {
    const modal = document.getElementById('add-contact-modal');
    modal.style.display = 'none';
    clearInputs(['new-name', 'new-email', 'new-phone']);
}

function clearInputs(ids) {
    ids.forEach(id => document.getElementById(id).value = '');
}

function saveNewContact() {
    const [name, email, phone] = ['new-name', 'new-email', 'new-phone']
        .map(id => document.getElementById(id).value);
    if (name && email && phone) {
        const section = getOrCreateSection(getFirstLetter(name));
        section.appendChild(createContact(name, email, phone));
        sortSections();
        closeAddContactModal();
    }
}

function getFirstLetter(name) {
    const words = name.trim().split(' ');
    return words.length > 1 ? words[1][0].toUpperCase() : name[0].toUpperCase();
}

function getOrCreateSection(letter) {
    let section = document.querySelector(`.contact-section[data-letter="${letter}"]`);
    if (!section) section = createContactSection(letter);
    return section;
}

function createContactSection(letter) {
    const section = document.createElement('div');
    section.className = 'contact-section';
    section.dataset.letter = letter;
    section.innerHTML = `<h3>${letter}</h3>`;
    document.querySelector('.contacts-list').appendChild(section);
    return section;
}

function sortSections() {
    const sections = Array.from(document.querySelector('.contacts-list').children);
    sections.sort((a, b) => a.dataset.letter.localeCompare(b.dataset.letter));
    sections.forEach(s => document.querySelector('.contacts-list').appendChild(s));
}

function createContact(name, email, phone) {
    const contact = document.createElement('div');
    contact.className = 'contact';
    contact.dataset.contactId = Date.now().toString();
    contact.setAttribute('onclick', `showContactDetails('${contact.dataset.contactId}')`);
    contact.innerHTML = `
        <h4>${name}</h4><p>${email}</p><p>${phone}</p>
        <button class="edit-btn" onclick="editContact('${contact.dataset.contactId}', event)">Bearbeiten</button>
        <button class="delete-btn" onclick="openDeleteModal('${contact.dataset.contactId}')">Löschen</button>
    `;
    return contact;
}

function showContactDetails(contactId) {
    const contact = document.querySelector(`.contact[data-contact-id="${contactId}"]`);
    if (contact) alert(`
        Name: ${contact.querySelector('h4').textContent}
        E-Mail: ${contact.querySelector('p:nth-child(2)').textContent}
        Telefon: ${contact.querySelector('p:nth-child(3)').textContent}
    `);
}

function editContact(contactId, event) {
    event.stopPropagation();
    const contact = document.querySelector(`.contact[data-contact-id="${contactId}"]`);
    const editDiv = document.getElementById('contact-edit');
    setFormValues(editDiv, contact);
    editDiv.dataset.contactId = contactId;
    editDiv.style.display = 'block';
}

function setFormValues(div, contact) {
    ['edit-name', 'edit-email', 'edit-phone'].forEach((id, i) => 
        document.getElementById(id).value = contact.children[i].textContent);
}

function saveEdit() {
    const contactId = document.getElementById('contact-edit').dataset.contactId;
    const contact = document.querySelector(`.contact[data-contact-id="${contactId}"]`);
    const [name, email, phone] = ['edit-name', 'edit-email', 'edit-phone']
        .map(id => document.getElementById(id).value);
    if (name && email && phone) updateContact(contact, name, email, phone);
    closeEdit();
}

function updateContact(contact, name, email, phone) {
    const firstLetter = getFirstLetter(name);
    contact.innerHTML = `
        <h4>${name}</h4><p>${email}</p><p>${phone}</p>
        <button class="edit-btn" onclick="editContact('${contact.dataset.contactId}', event)">Bearbeiten</button>
        <button class="delete-btn" onclick="openDeleteModal('${contact.dataset.contactId}')">Löschen</button>
    `;
    if (contact.parentElement.dataset.letter !== firstLetter) {
        const newSection = getOrCreateSection(firstLetter);
        newSection.appendChild(contact);
        if (!contact.parentElement.querySelector('.contact')) contact.parentElement.remove();
        sortSections();
    }
}

function closeEdit() {
    document.getElementById('contact-edit').style.display = 'none';
}

function openDeleteModal(contactId) {
    const modal = document.getElementById('delete-modal');
    modal.dataset.contactId = contactId;
    modal.style.display = 'block';
}

function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
}

function confirmDelete() {
    const contactId = document.getElementById('delete-modal').dataset.contactId;
    const contact = document.querySelector(`.contact[data-contact-id="${contactId}"]`);
    if (contact) deleteContactElement(contact);
    closeDeleteModal();
}

function deleteContactElement(contact) {
    const section = contact.parentElement;
    contact.remove();
    if (section.querySelectorAll('.contact').length === 0) section.remove();
    sortSections();
}

function deleteContact(contactId) {
    openDeleteModal(contactId);
>>>>>>> ad071c240897b35ae4f201df2352990bf9f6a8d6
}