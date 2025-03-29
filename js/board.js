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
}