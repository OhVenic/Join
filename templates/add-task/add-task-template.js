function contactListDropDownTemplate(i) {
  return `<div class="contactListElement" id="${i}" onclick="toggleContactSelection(${i})">
              <div class="contact">
              <span class="avatar" style="background-color: ${contacts[i].color}">${contacts[i].avatar}</span>
              <span>${contacts[i].name}</span>
              </div>
              <div><img id="btn-checkbox-${i}" src="./assets/icons/btn-unchecked.svg" alt="Button Unchecked"/></div>
              </div>`;
}

function subtaskListTemplate(i) {
  return `<div class="subtask-list-item" id="subtask-list-item-${i}" >
      <li id="title-${i}">${subtasks[i].title}</li>
      <div class="subtask-list-item-btns">
        <img class="subtask-edit-icons edit" onclick="editSubtaskItem(${i})" src="./assets/icons/edit.svg" alt="Edit Subtask Icon"/>
        <div class="subtask-list-item-separator"></div>
        <img class="subtask-edit-icons delete" onclick="deleteSubtaskItem(${i})" src="./assets/icons/delete.svg" alt="Delete Subtask Icon"/>
      </div>
    </div>
    <div id="input-container-${i}" class="change-input dp-none">
      <input id="input-${i}" type="text" class="input">
        <img class="subtask-edit-icons delete-2" onclick="deleteSubtaskItem(${i})" src="./assets/icons/delete.svg" alt="Edit Subtask Icon"/>
        <div class="subtask-list-item-separator-2"></div>
        <img class="subtask-edit-icons accept" onclick="acceptSubtaskItem(${i})" src="./assets/icons/check.svg" alt="Delete Subtask Icon"/>
    </div>`;
}
//   <div class="subtask-list-item-btns-2">
//</div>
