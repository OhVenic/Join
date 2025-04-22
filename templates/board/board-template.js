/**
 * Generates the HTML template for a task card.
 *
 * @param {Object} element - The task object containing details about the task.
 * @param {Array} contacts - An array of contact objects assigned to the task.
 * @returns {string} The HTML string for the task card.
 */
function cardTemplate(element, contacts) {
  return `
    <div class="card-s grab" draggable="true" ondragstart="startDragging(${element.id})" onclick="cardDetails(${
    element.id
  })">
      <div class="card-s-header">
        <div class="category-card-s" style="background-color: ${getCategoryColor(element.category)}">
          ${element.category}
        </div>
        <div class="card-s-move-resp-menu dp-none" id="card-s-move-resp-menu-${element.id}">
          <p class="move-resp-menu-title">Move to</p>
          <div class="move-1 move" id="column-1-${element.id}" onclick="moveToColumn(${element.id}, 'in-progress')">
            <img class="add-to-column-icon" src="./assets/icons/add.svg" alt="Icon">
            <p>In Progress</p>
          </div>
          <div class="move-2 move" id="column-2-${element.id}" onclick="moveToColumn(${element.id}, 'await-feedback')">
            <img class="add-to-column-icon" src="./assets/icons/add.svg" alt="Icon">
            <p>Await Feedback</p>
          </div>
          <div class="move-3 move" id="column-3-${element.id}" onclick="moveToColumn(${element.id}, 'done')">
            <img class="add-to-column-icon" src="./assets/icons/add.svg" alt="Icon">
            <p>Done</p>
          </div>
        </div>
        <img onclick="moveTaskRespMenu(${
          element.id
        }, event)" class="card-s-move-resp" id="card-s-move-resp" src="./assets/icons/move-card-resp.svg" alt="Icon Responsive Drag and Drop">
      </div>
      <div class="title-card-s">${element.title}</div>
      <div class="description-card-s">${getShortenedDescription(element.description)}</div>
      <div class="subtask-card-s" id="subtask-card-s">${subtaskProgress(element.subtasks)}</div>
      <div class="footer-card-s">
        <div class="assigned-to-card-s">
          <div class="selected-avatars">${getInitials(element, contacts)}</div>
        </div>
        <div class="prio-card-s">${showPriority(element.priority)}</div>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML template for the detailed view of a task card.
 *
 * @param {Object} task - The task object containing details about the task.
 * @param {string} initialsHTML - The HTML string for the assigned contacts' initials.
 * @returns {string} The HTML string for the detailed task card view.
 */
function getCardDetailsTemplate(task, initialsHTML) {
  return `
    <div class="card-main-content">
      <div class="card-overlay-header-flex">
        <p class="category-card-s">${task.category}</p>
        <img onclick="closeCardDetails()" class="add-task-close-btn" src="./assets/icons/cancel.svg" alt="">
      </div>
      <h2 class="task-title">${task.title}</h2>
      <p class="task-description">${task.description}</p>
      <p class="task-date">Due Date: ${task.date}</p>
      <div class="flex-priority">
        <p class="task-priority">Priority: ${task.priority}</p>
        <div class="prio-card-s">${showPriority(task.priority)}</div>
      </div>
      <p>Assigned to:</p>
      <div class="selected-avatars-overlay">${initialsHTML}</div>
      <p class="task-subtask">Subtasks:</p>
      <ul class="margin-bottom">
        ${
          task.subtasks
            ?.map(
              (st) => `
          <li class="task-list">
            <input type="checkbox" ${st.status === "done" ? "checked" : ""} 
              onchange="updateSubtaskStatus(${task.id}, '${st.title}')" class="edit-checkbox"> 
            <p class="card-overlay-subtask-title">${st.title}</p>
          </li>
        `
            )
            .join("") || "<li>No Subtasks</li>"
        }
      </ul>
    </div>
    <div class="task-overlay-footer">
      <div class="contact-change edit-icon" onclick="editTask(${
        task.id
      })"  onmouseover="changeToBlueIconEdit()" onmouseout="changeToBlackIconEdit()">
        <img id="edit-icon-n" class="icon" src="./assets/icons/edit.svg" alt="Edit Icon Normal">
        <img id="edit-icon-b" class="dp-none icon" src="./assets/icons/edit-blue.svg" alt="Edit Icon Hover">
        <p>Edit</p>
      </div>
      <div class="contact-change delete-display" onclick="deleteTask(${
        task.id
      })" onmouseover="changeToBlueIconDelete()" onmouseout="changeToBlackIconDelete()">
        <img id="delete-icon-n" class="icon" src="./assets/icons/delete.svg" alt="Delete Icon Normal">
        <img id="delete-icon-b" class="dp-none icon" src="./assets/icons/delete-blue.svg" alt="Delete Icon Hover">
        <p>Delete</p>
      </div>
    </div>
  `;
}

/**
 * Generates the HTML template for editing a task.
 *
 * @param {Object} task - The task object containing details about the task.
 * @returns {string} The HTML string for the edit task form.
 */
function getEditTaskTemplate(task) {
  return `
    <div class="card-overlay-content-content">
      <div class="card-overlay-header-flex-right">
        <img onclick="closeCardDetails()" class="add-task-close-btn" src="./assets/icons/cancel.svg" alt="Close">
      </div>
      <div class="edit-form">
        <label>Title:</label>
        <input required name="title" id="edit-title" value="${task.title}" class="edit-input" />
        
        <label>Description:</label>
        <textarea name="description" id="edit-description" class="edit-textarea">${task.description}</textarea>
        
        <label>Due Date:</label>
        <input required name="date" id="edit-date" type="date" value="${task.date}" class="edit-input" />

        <label>Priority:</label>
        <div class="priority-btn-group">
          <button type="button" class="prio-btn" id="prio-low" onclick="selectPriorityEdit('low')">
            Low <img src="./assets/icons/priority-low.svg" class="prio-icon" alt="Low">
          </button>
          <button type="button" class="prio-btn" id="prio-medium" onclick="selectPriorityEdit('medium')">
            Medium <img src="./assets/icons/priority-medium.svg" class="prio-icon" alt="Medium">
          </button>
          <button type="button" class="prio-btn" id="prio-urgent" onclick="selectPriorityEdit('urgent')">
            Urgent <img src="./assets/icons/priority-urgent.svg" class="prio-icon" alt="Urgent">
          </button>
        </div>
        <input type="hidden" name="priority" id="edit-priority-hidden" />

        <div class="assigned-to-section frame-39">
          <label for="assigned-to">Assigned to</label>
          <input
            type="text"
            id="edit-assigned-to"
            class="selection"
            placeholder="Select contacts to assign"
            onclick="toggleEditContactDropdown('${task.id}')"
          />

          <img
            id="assigned-to-img-down"
            class="assigned-to-img dropdown-img"
            src="./assets/icons/arrow_drop_down.svg"
            alt="Select contact dropdown arrow"
            onclick="toggleEditContactDropdown(); event.stopPropagation();"
          />

          <img
            id="assigned-to-img-up"
            class="assigned-to-img dropdown-img dp-none"
            src="./assets/icons/arrow_drop_down_up.svg"
            alt="Select contact dropdown arrow"
            onclick="toggleEditContactDropdown(); event.stopPropagation();"
          />
          <div
            class="edit-drop-down-contact-list dp-none"
            id="edit-drop-down-contact-list"
            onclick="preventBubbling(event)"
          ></div>
          <div id="edit-selected-avatars" class="edit-selected-avatars"></div>
        </div>

        <div class="add-subtask frame-39">
          <label for="subtask" class="edit-subtask-label">Subtasks</label>
          <input
            type="text"
            id="edit-subtask"
            class="subtask"
            placeholder="Add new subtask"
            onkeydown="handleSubtaskEnter(event)"
          />
          <img
            id="edit-Add-subtask-img"
            class="edit-add-subtask-img"
            src="./assets/icons/add.svg"
            alt="Add subtask"
          />
          <img
            id="edit-cancel-task-img"
            class="edit-cancel-task-img subtask-img dp-none"
            src="./assets/icons/cancel.svg"
            alt="Cancel Subtask"
          />
          <div id="edit-small-separator" class="edit-small-separator dp-none"></div>
          <img
            id="edit-accept-task-img"
            class="edit-accept-task-img subtask-img dp-none"
            src="./assets/icons/check.svg"
            alt="Accept Subtask"
          />
          <div class="subtask-list" id="edit-subtask-list"></div>
        </div>

        <div class="edit-btn-row">
          <button onclick="saveEditedTaskManual('${task.id}')" class="task-btn">
            Ok
            <svg class="white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
            </svg>
          </button>
          <button type="button" class="btn btn-cancel" onclick="cardDetails('${task.id}')">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

/**
 * Returns the HTML template for a subtask item in the edit overlay.
 * @param {number} index - Index of the subtask.
 * @param {{ title: string, checked: boolean }} subtask - Subtask object.
 * @returns {string} HTML string for the subtask.
 */
function getEditSubtaskTemplate(index, subtask) {
  return `
    <div class="subtask-list-item" id="subtask-list-item-${index}">
      <li id="title-${index}" class="subtask-title">${subtask.title}</li>
      <div class="subtask-list-item-btns">
        <img class="subtask-edit-icons edit" onclick="editEditSubtaskItem(${index})" src="./assets/icons/edit.svg" alt="Edit Subtask Icon"/>
        <div class="subtask-list-item-separator"></div>
        <img class="subtask-edit-icons delete" onclick="deleteEditSubtask(${index})" src="./assets/icons/delete.svg" alt="Delete Subtask Icon"/>
      </div>
    </div>
    <div id="input-container-${index}" class="change-input dp-none">
      <input id="input-${index}" type="text" class="edit-input-subtask">
      <img class="subtask-edit-icons delete-2" onclick="deleteEditSubtask(${index})" src="./assets/icons/delete.svg" alt="Delete Subtask Icon"/>
      <div class="subtask-list-item-separator-2"></div>
      <img class="subtask-edit-icons accept" onclick="editAcceptSubtaskItem(${index})" src="./assets/icons/check.svg" alt="Accept Subtask Icon"/>
    </div>
  `;
}

/**
 * Generates the HTML for a contact element.
 * @param {Object} contact - The contact object.
 * @param {boolean} isSelected - Indicates whether the contact is selected.
 * @returns {HTMLElement} The HTML element representing the contact.
 */
function createContactElement(contact, isSelected) {
  const contactElement = document.createElement("div");
  contactElement.classList.add("contactListElement");
  if (isSelected) contactElement.classList.add("selected");
  contactElement.onclick = () => toggleAssignContact(contact.name, contact.avatar);

  contactElement.innerHTML = `
    <div class="avatar-card-edit" style="background-color:${contact.color}">
      ${contact.avatar}
    </div>
    <p class="contact-list-name">${contact.name}</p>
    <div>
      <img src="./assets/icons/${isSelected ? "btn-checked" : "btn-unchecked"}.svg" />
    </div>
  `;

  return contactElement;
}
