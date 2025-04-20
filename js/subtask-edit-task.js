let editSubtasks = [];

function setupEditSubtaskInput(task) {
    editSubtasks = task.subtasks || [];
    renderEditSubtasks();
  
    const input = document.getElementById("edit-subtask");
    const addBtn = document.getElementById("edit-Add-subtask-img");
    const cancelBtn = document.getElementById("edit-cancel-task-img");
    const acceptBtn = document.getElementById("edit-accept-task-img");
    const separator = document.getElementById("edit-small-separator");
  
    input.addEventListener("click", () => {
      addBtn.classList.add("dp-none");
      cancelBtn.classList.remove("dp-none");
      acceptBtn.classList.remove("dp-none");
      separator.classList.remove("dp-none");
    });
  
    input.addEventListener("input", () => {
      const hasText = input.value.trim().length > 0;
    });
  
    acceptBtn.onclick = () => {
      const value = input.value.trim();
      if (value) {
        editSubtasks.push({ title: value, checked: false });
        input.value = "";
        renderEditSubtasks();
  
        // Reset UI
        addBtn.classList.remove("dp-none");
        cancelBtn.classList.add("dp-none");
        acceptBtn.classList.add("dp-none");
        separator.classList.add("dp-none");
      }
    };
  
    cancelBtn.onclick = () => {
      input.value = "";
  
      // Reset UI
      addBtn.classList.remove("dp-none");
      cancelBtn.classList.add("dp-none");
      acceptBtn.classList.add("dp-none");
      separator.classList.add("dp-none");
    };
  }
  
  function renderEditSubtasks() {
    const list = document.getElementById("edit-subtask-list");
    list.innerHTML = "";
    editSubtasks.forEach((subtask, index) => {
      list.innerHTML += `
       <div class="subtask-list-item" id="subtask-list-item-${index}" 
      onmouseover="showEditLayout(this)" 
      onmouseout="removeEditLayout(this)">
      <li id="title-${index}">${subtask.title}</li>
      <div class="subtask-list-item-btns dp-none">
        <img class="subtask-edit-icons edit" onclick="editEditSubtaskItem(${index})" src="./assets/icons/edit.svg" alt="Edit Subtask Icon"/>
        <div class="subtask-list-item-separator"></div>
        <img class="subtask-edit-icons delete" onclick="deleteEditSubtask(${index})" src="./assets/icons/delete.svg" alt="Delete Subtask Icon"/>
      </div>
    </div>
    <div id="input-container-${index}" class="change-input dp-none">
      <input id="input-${index}" type="text" class="input">
        <img class="subtask-edit-icons delete-2" onclick="deleteEditSubtask(${index})" src="./assets/icons/delete.svg" alt="Edit Subtask Icon"/>
        <div class="subtask-list-item-separator-2"></div>
        <img class="subtask-edit-icons accept" onclick="editAcceptSubtaskItem(${index})" src="./assets/icons/check.svg" alt="Delete Subtask Icon"/>
    </div>`;
    });
  }
  
  function toggleEditSubtask(index) {
    editSubtasks[index].checked = !editSubtasks[index].checked;
    renderEditSubtasks();
  }
  
  function deleteEditSubtask(index) {
    editSubtasks.splice(index, 1);
    renderEditSubtasks();
  }

  function editEditSubtaskItem(index) {
    const inputContainer = document.getElementById(`input-container-${index}`);
    const listItem = document.getElementById(`subtask-list-item-${index}`);
    const inputField = document.getElementById(`input-${index}`);
  
    inputContainer.classList.remove("dp-none");
    listItem.classList.add("dp-none");
    inputField.value = editSubtasks[index].title;
  
    inputField.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault();
        editAcceptSubtaskItem(index);
      }
    });
  }
  
  
  function editAcceptSubtaskItem(index) {
    const inputField = document.getElementById(`input-${index}`);
    const newValue = inputField.value.trim();
  
    if (newValue !== "") {
      editSubtasks[index].title = newValue;
      renderEditSubtasks();
    }
  }