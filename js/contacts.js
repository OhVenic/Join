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
}