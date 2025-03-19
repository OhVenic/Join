let draggedTask = null;
let searchTimeout = null;

function initializeBoard() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || getInitialTasks();
    localStorage.setItem('tasks', JSON.stringify(tasks));
    tasks.forEach(task => renderTask(task));
}

function getInitialTasks() {
    return [
        { id: '1', title: 'Website Design überarbeiten', description: 'Überarbeitung des UI/UX Designs für die Hauptseite', dueDate: '2025-04-15', priority: 'medium', assigned: 'Anna Berger', category: 'technical-task', status: 'todo', subtasks: [{ text: 'Layout anpassen', completed: false }, { text: 'Farben aktualisieren', completed: false }] },
        { id: '2', title: 'API-Integration testen', description: 'Integration und Tests der neuen API für Benutzerdaten', dueDate: '2025-03-20', priority: 'urgent', assigned: 'Max Schuster', category: 'technical-task', status: 'todo', subtasks: [] },
        { id: '3', title: 'Benutzer-Feedback sammeln', description: 'Feedback von Benutzern für die neue Funktion sammeln', dueDate: '2025-03-25', priority: 'medium', assigned: 'Lena Müller', category: 'user-story', status: 'in-progress', subtasks: [{ text: 'Umfrage erstellen', completed: true }, { text: 'Teilnehmer einladen', completed: false }] },
        { id: '4', title: 'Dokumentation schreiben', description: 'Dokumentation für die API-Integration erstellen', dueDate: '2025-04-01', priority: 'low', assigned: 'Jonas Weber', category: 'technical-task', status: 'awaiting-feedback', subtasks: [] },
        { id: '5', title: 'Initiales Setup abschließen', description: 'Server und Datenbank einrichten', dueDate: '2025-03-10', priority: 'medium', assigned: 'Sophie Klein', category: 'technical-task', status: 'done', subtasks: [{ text: 'Server einrichten', completed: true }, { text: 'Datenbank verbinden', completed: true }] }
    ];
}

function renderTask(task) {
    const column = document.querySelector(`.column[data-status="${task.status}"]`);
    if (column) {
        const div = document.createElement('div');
        div.className = 'task';
        div.draggable = true;
        div.dataset.taskId = task.id;
        div.setAttribute('ondragstart', 'drag(event)');
        div.innerHTML = getTaskHTML(task);
        renderSubtasks(task, div);
        column.appendChild(div);
        updateProgressByStatus(div, task.status);
    }
}

function getTaskHTML(task) {
    const initials = task.assigned.split(' ').map(word => word[0]).join('').toUpperCase();
    const descriptionPreview = task.description ? task.description.slice(0, 50) + (task.description.length > 50 ? '...' : '') : '';
    return `
        <h4>${task.title}</h4>
        <p class="description-preview">${descriptionPreview}</p>
        <p>Fällig: ${task.dueDate}</p>
        <p class="priority ${task.priority}">Priorität: ${task.priority === 'urgent' ? 'Dringend' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}</p>
        <p>Zugewiesen: ${task.assigned} <span class="initials">${initials}</span></p>
        <p>Kategorie: ${task.category === 'technical-task' ? 'Technical Task' : 'User Story'}</p>
        <div class="subtasks"></div>
        <button class="details-btn" onclick="showTaskDetails('${task.id}')">Details</button>
        <button class="edit-btn" onclick="openEditTaskModal('${task.id}', event)">Bearbeiten</button>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">Löschen</button>
        <button class="move-btn" onclick="openMoveTaskModal('${task.id}')">↕</button>
    `;
}

function renderSubtasks(task, taskElement) {
    const subtasksDiv = taskElement.querySelector('.subtasks');
    subtasksDiv.innerHTML = task.subtasks.map((subtask, index) => `<label><input type="checkbox" ${subtask.completed ? 'checked' : ''} onchange="updateSubtaskStatus('${task.id}', ${index})"> ${subtask.text} <span class="subtask-actions"><button onclick="editSubtask('${task.id}', ${index})">✏️</button><button onclick="deleteSubtask('${task.id}', ${index})">🗑️</button></span></label>`).join('');
    subtasksDiv.innerHTML += `<input type="text" class="subtask-input" placeholder="Subtask hinzufügen" onkeypress="addSubtask(event, '${task.id}')">`;
    const bar = document.createElement('div');
    bar.className = 'progress-bar';
    bar.dataset.progress = task.subtasks.length ? `0 von ${task.subtasks.length} Subtasks erledigt` : '';
    subtasksDiv.appendChild(bar);
}

function drag(event) {
    draggedTask = event.target;
    event.dataTransfer.setData('text/plain', draggedTask.dataset.taskId);
    draggedTask.style.opacity = '0.5';
    draggedTask.style.transform = 'rotate(5deg)';
}

function allowDrop(event) {
    event.preventDefault();
    event.currentTarget.style.background = '#e0e0e0';
    event.currentTarget.style.border = '2px dashed #2980b9';
}

function drop(event) {
    event.preventDefault();
    if (draggedTask) {
        const column = event.currentTarget;
        column.appendChild(draggedTask);
        if (column.querySelector('.no-tasks')) column.querySelector('.no-tasks').remove();
        updateTaskStatus(draggedTask.dataset.taskId, column.dataset.status);
        draggedTask.style.opacity = '1';
        draggedTask.style.transform = 'rotate(0deg)';
        column.style.background = '#f9f9f9';
        column.style.border = 'none';
        draggedTask = null;
        showToast('Task verschoben');
    }
}

function updateTaskStatus(taskId, status) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.status = status;
        localStorage.setItem('tasks', JSON.stringify(tasks));
        const taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);
        updateProgressByStatus(taskElement, status);
    }
}

function updateProgressByStatus(taskElement, status) {
    const bar = taskElement.querySelector('.progress-bar');
    const progressData = calculateProgress(taskElement, status);
    bar.style.width = progressData.finalProgress + '%';
    bar.style.background = progressData.finalProgress === 100 ? '#2ecc71' : '#3498db';
    bar.dataset.progress = progressData.progressText;
}

function calculateProgress(taskElement, status) {
    const baseProgress = { todo: 25, 'in-progress': 50, 'awaiting-feedback': 75, done: 100 }[status] || 0;
    const checkboxes = taskElement.querySelectorAll('.subtasks input[type="checkbox"]');
    const total = checkboxes.length;
    const done = total ? Array.from(checkboxes).filter(cb => cb.checked).length : 0;
    const subProgress = total ? (done / total) * 100 : 0;
    return { finalProgress: Math.max(baseProgress, subProgress), progressText: total ? `${done} von ${total} Subtasks erledigt` : '' };
}

function openAddTaskModal(columnStatus) {
    const modal = document.getElementById('add-task-modal');
    if (modal) {
        modal.dataset.columnStatus = columnStatus || 'todo';
        document.getElementById('add-title').value = '';
        document.getElementById('add-description').value = '';
        document.getElementById('add-due-date').value = '';
        document.getElementById('add-priority').value = 'medium';
        document.getElementById('add-assigned').value = 'Anna Berger';
        document.getElementById('add-category').value = 'technical-task';
        document.getElementById('add-subtask-input').value = '';
        document.getElementById('save-new-task-btn').disabled = true;
        document.getElementById('add-subtasks-list').innerHTML = '';
        modal.style.display = 'block';
        validateForm('add');
    }
}

function validateForm(formType) {
    const title = document.getElementById(`${formType}-title`)?.value.trim();
    const category = formType === 'add' ? document.getElementById('add-category')?.value : true;
    const dueDate = document.getElementById(`${formType}-due-date`)?.value;
    const isValid = formType === 'add' ? !!title && !!category : !!title && !!dueDate;
    document.getElementById(`${formType === 'add' ? 'save-new-task' : 'save-edit'}-btn`).disabled = !isValid;
    return isValid;
}

function saveNewTask() {
    const saveBtn = document.getElementById('save-new-task-btn');
    saveBtn.disabled = true;
    setTimeout(() => {
        if (validateForm('add')) {
            const taskData = getNewTaskData();
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(taskData);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTask(taskData);
            document.getElementById('add-task-modal').style.display = 'none';
            showToast('Task erstellt');
            saveBtn.disabled = false;
        } else {
            saveBtn.disabled = false;
        }
    }, 500);
}

function getNewTaskData() {
    const modal = document.getElementById('add-task-modal');
    const subtasks = Array.from(document.querySelectorAll('#add-subtasks-list label')).map(label => ({ text: label.textContent.trim(), completed: false }));
    return {
        id: Date.now().toString(),
        title: document.getElementById('add-title').value.trim(),
        description: document.getElementById('add-description').value.trim(),
        dueDate: document.getElementById('add-due-date').value || 'Nicht angegeben',
        priority: document.getElementById('add-priority').value,
        assigned: document.getElementById('add-assigned').value,
        category: document.getElementById('add-category').value,
        status: modal.dataset.columnStatus,
        subtasks
    };
}

function addSubtask(event, taskId) {
    if (event.key === 'Enter') {
        const input = event.target;
        const text = input.value.trim();
        if (text) {
            if (taskId) {
                const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
                const task = tasks.find(t => t.id === taskId);
                task.subtasks.push({ text, completed: false });
                localStorage.setItem('tasks', JSON.stringify(tasks));
                refreshTask(taskId);
            } else {
                document.getElementById('add-subtasks-list').innerHTML += `<label>${text}</label>`;
            }
            input.value = '';
        }
    }
}

function updateSubtaskStatus(taskId, index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    task.subtasks[index].completed = !task.subtasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTask(taskId);
}

function editSubtask(taskId, index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    const newText = prompt('Neuen Subtask-Text eingeben:', task.subtasks[index].text);
    if (newText) {
        task.subtasks[index].text = newText.trim();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        refreshTask(taskId);
    }
}

function deleteSubtask(taskId, index) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    task.subtasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    refreshTask(taskId);
}

function refreshTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    const oldTask = document.querySelector(`.task[data-task-id="${taskId}"]`);
    const newTask = document.createElement('div');
    newTask.className = 'task';
    newTask.draggable = true;
    newTask.dataset.taskId = task.id;
    newTask.setAttribute('ondragstart', 'drag(event)');
    newTask.innerHTML = getTaskHTML(task);
    renderSubtasks(task, newTask);
    oldTask.parentElement.replaceChild(newTask, oldTask);
    updateProgressByStatus(newTask, task.status);
}

function searchTasks() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        const term = document.getElementById('task-search')?.value.toLowerCase();
        const tasks = document.querySelectorAll('.task');
        let foundCount = 0;
        tasks.forEach(task => {
            const title = task.querySelector('h4')?.textContent.toLowerCase() || '';
            const matches = title.includes(term) && (task.style.display !== 'none' || filterTasks());
            task.style.display = matches ? 'block' : 'none';
            task.style.background = matches && term ? '#fff9e6' : 'white';
            foundCount += matches ? 1 : 0;
        });
        const message = document.getElementById('no-results-message') || document.createElement('p');
        message.id = 'no-results-message';
        message.textContent = foundCount === 0 && tasks.length > 0 ? 'Keine Ergebnisse gefunden' : '';
        document.querySelector('.search-bar').appendChild(message);
    }, 300);
}

function filterTasks() {
    const filter = document.getElementById('task-filter').value;
    const tasks = document.querySelectorAll('.task');
    let foundCount = 0;
    tasks.forEach(task => {
        const taskId = task.dataset.taskId;
        const tasksData = JSON.parse(localStorage.getItem('tasks')) || [];
        const taskData = tasksData.find(t => t.id === taskId);
        const [filterType, filterValue] = filter.split('-');
        const matches = filter === 'all' || (filterType === 'priority' && taskData.priority === filterValue) || (filterType === 'category' && taskData.category === filterValue) || (filterType === 'assigned' && taskData.assigned === filterValue);
        task.style.display = matches ? 'block' : 'none';
        foundCount += matches ? 1 : 0;
    });
    const message = document.getElementById('no-results-message') || document.createElement('p');
    message.id = 'no-results-message';
    message.textContent = foundCount === 0 && tasks.length > 0 ? 'Keine Ergebnisse gefunden' : '';
    document.querySelector('.search-bar').appendChild(message);
    return foundCount > 0;
}

function showTaskDetails(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('detail-title').textContent = `Titel: ${task.title}`;
        document.getElementById('detail-description').textContent = `Beschreibung: ${task.description || 'Nicht angegeben'}`;
        document.getElementById('detail-due-date').textContent = `Fällig: ${task.dueDate}`;
        document.getElementById('detail-priority').textContent = `Priorität: ${task.priority === 'urgent' ? 'Dringend' : task.priority === 'medium' ? 'Mittel' : 'Niedrig'}`;
        document.getElementById('detail-assigned').textContent = `Zugewiesen: ${task.assigned}`;
        document.getElementById('detail-category').textContent = `Kategorie: ${task.category === 'technical-task' ? 'Technical Task' : 'User Story'}`;
        document.getElementById('task-details').style.display = 'block';
    }
}

function closeTaskDetails() {
    document.getElementById('task-details').style.display = 'none';
}

function openEditTaskModal(taskId, event) {
    event.stopPropagation();
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-description').value = task.description || '';
        document.getElementById('edit-due-date').value = task.dueDate;
        document.getElementById('edit-priority').value = task.priority;
        document.getElementById('edit-assigned').value = task.assigned;
        openEditTaskModalPart2(task);
    }
}

function openEditTaskModalPart2(task) {
    document.getElementById('edit-category').textContent = task.category === 'technical-task' ? 'Technical Task' : 'User Story';
    document.getElementById('edit-task-modal').dataset.taskId = task.id;
    const subtasksDiv = document.getElementById('edit-subtasks');
    subtasksDiv.innerHTML = task.subtasks.map((subtask, index) => `<label><input type="checkbox" ${subtask.completed ? 'checked' : ''} onchange="updateSubtaskStatus('${task.id}', ${index})"> ${subtask.text} <span class="subtask-actions"><button onclick="editSubtask('${task.id}', ${index})">✏️</button><button onclick="deleteSubtask('${task.id}', ${index})">🗑️</button></span></label>`).join('') + `<input type="text" class="subtask-input" placeholder="Subtask hinzufügen" onkeypress="addSubtask(event, '${task.id}')">`;
    document.getElementById('edit-task-modal').style.display = 'block';
    validateForm('edit');
}

function saveEditedTask() {
    const saveBtn = document.getElementById('save-edit-btn');
    saveBtn.disabled = true;
    setTimeout(() => {
        if (validateForm('edit')) {
            const taskId = document.getElementById('edit-task-modal').dataset.taskId;
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const task = tasks.find(t => t.id === taskId);
            task.title = document.getElementById('edit-title').value.trim();
            task.description = document.getElementById('edit-description').value.trim();
            task.dueDate = document.getElementById('edit-due-date').value || 'Nicht angegeben';
            task.priority = document.getElementById('edit-priority').value;
            task.assigned = document.getElementById('edit-assigned').value;
            localStorage.setItem('tasks', JSON.stringify(tasks));
            refreshTask(taskId);
            document.getElementById('edit-task-modal').style.display = 'none';
            showToast('Task aktualisiert');
            saveBtn.disabled = false;
        }
    }, 500);
}

function openMoveTaskModal(taskId) {
    let modal = document.getElementById('move-task-modal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'move-task-modal';
        document.body.appendChild(modal);
    }
    modal.innerHTML = `
        <button onclick="moveTask('${taskId}', 'todo')">Zu erledigen</button>
        <button onclick="moveTask('${taskId}', 'in-progress')">In Bearbeitung</button>
        <button onclick="moveTask('${taskId}', 'awaiting-feedback')">Auf Rückmeldung</button>
        <button onclick="moveTask('${taskId}', 'done')">Erledigt</button>
    `;
    modal.style.display = 'block';
}

function moveTask(taskId, status) {
    const taskElement = document.querySelector(`.task[data-task-id="${taskId}"]`);
    const column = document.querySelector(`.column[data-status="${status}"]`);
    column.appendChild(taskElement);
    if (column.querySelector('.no-tasks')) column.querySelector('.no-tasks').remove();
    updateTaskStatus(taskId, status);
    document.getElementById('move-task-modal').style.display = 'none';
    showToast('Task verschoben');
}

function deleteTask(taskId) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const index = tasks.findIndex(t => t.id === taskId);
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const task = document.querySelector(`.task[data-task-id="${taskId}"]`);
    const column = task.parentElement;
    task.remove();
    if (!column.querySelector('.task')) column.innerHTML += '<p class="no-tasks">Keine Aufgaben vorhanden</p>';
    showToast('Task gelöscht');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => toast.style.display = 'none', 2000);
}