function addTaskTemplate() {
  return `<div class="scroller"><div class="extra-div"><div class="add-task-main-title"><h1>Add Task</h1>
    <img onclick="closeAddTaskModal()" class="add-task-close-btn" src="./assets/icons/cancel.svg" alt=""></div>
    <form class="add-task-form">
      <section class="add-task-1">
        <div class="add-title-content">
          <div class="add-title frame-219">
            <label for="add-task-title"
              >Title<span class="red">*</span></label
            >
            <input
            oninput="removeErrorMsgs('required-title', 'add-task-title')"
              type="text"
              id="add-task-title"
              class="add-task-title"
              placeholder="Enter a title"
              required
            />
          </div>
          <div class="requiredText dp-none" id="required-title">
            <p class="red">This field is required</p>
          </div>
          <div class="task-already-exists dp-none" id="task-already-exists">
            <p class="red">Task already exists</p>
          </div>
        </div>
        <div class="add-description frame-219">
          <label for="add-task-description">Description</label>
          <textarea
            name=""
            id="add-task-description"
            class="add-task-description"
            placeholder="Enter a Description"
          ></textarea>
        </div>
        <div class="add-date-content">
          <div class="add-date frame-219">
            <label for="add-task-due-date"
              >Due date<span class="red">*</span></label
            >
            <input
            onfocus="removeErrorMsgs('required-date', 'add-task-due-date')"
              type="date"
              id="add-task-due-date"
              class="add-task-due-date"
              placeholder="ide"
            />
          </div>
          <div class="requiredText dp-none" id="required-date">
            <p class="red">This field is required</p>
          </div>
        </div>
        <div class="select-priority frame-39">
          <label for="priority">Priority</label>
          <div class="priority-btns">
            <div
              class="priority-btn"
              id="prio-btn-urgent"
              onclick="togglePrio('urgent')"
            >
              <p>Urgent</p>
              <img
                id="prio-img-urgent"
                class="priority-img"
                src="./assets/icons/priority-urgent.svg"
                alt="Priority Urgent"
              />
            </div>
            <div
              class="priority-btn"
              id="prio-btn-medium"
              onclick="togglePrio('medium')"
            >
              <p>Medium</p>
              <img
                id="prio-img-medium"
                class="priority-img"
                src="./assets/icons/priority-medium.svg"
                alt="Priority Medium"
              />
            </div>
            <div
              class="priority-btn"
              id="prio-btn-low"
              onclick="togglePrio('low')"
            >
              <p>Low</p>
              <img
                id="prio-img-low"
                class="priority-img"
                src="./assets/icons/priority-low.svg"
                alt="Priority Low"
              />
            </div>
          </div>
        </div>
      </section>
      <div class="separator"></div>
      <section class="add-task-2">

        <div class="assigned-to-section frame-39">
          <label for="assigned-to">Assigned to</label>
          <input
            type="text"
            id="assigned-to"
            class="selection"
            placeholder="Select contacts to assign"
            onclick="showContactList(event)"
          />
          <img
            id="assigned-to-img-down"
            class="assigned-to-img dropdown-img"
            src="./assets/icons/arrow_drop_down.svg"
            alt="Select contact dropdown arrow"
            onclick="showContactList(event)"
          />
          <img
            id="assigned-to-img-up"
            class="assigned-to-img dropdown-img dp-none"
            src="./assets/icons/arrow_drop_down_up.svg"
            alt="Select contact dropdown arrow"
            onclick="showContactList(event)"
          />
          <div
            class="drop-down-contact-list dp-none"
            id="drop-down-contact-list"
            onclick="preventBubbling(event)"
          ></div>
          <div id="selected-avatars"></div>
        </div>
        <div class="add-category-content">
          <div class="add-category frame-39">
            <label for="category">Category<span class="red">*</span></label>
            <input
            onfocus="removeErrorMsgs('required-category', 'category')"
              type="text"
              id="category"
              class="selection"
              placeholder="Select task category"
              onclick="showCategoryList(event)"
            />
            <img
              id="add-category-img-down"
              class="add-category-img dropdown-img"
              src="./assets/icons/arrow_drop_down.svg"
              alt="Add category dropdown arrow"
              onclick="showCategoryList(event)"
            />
            <img
              id="add-category-img-up"
              class="add-category-img dropdown-img dp-none"
              src="./assets/icons/arrow_drop_down_up.svg"
              alt="Add category dropdown arrow"
              onclick="showCategoryList(event)"
            />
            <div
              class="drop-down-category-list dp-none"
              id="drop-down-category-list"
              onclick="preventBubbling(event)"
            ></div>
          </div>
          <div class="requiredText dp-none" id="required-category">
            <p class="red">This field is required</p>
          </div>
        </div>
        <div class="add-subtask frame-39">
          <label for="subtask">Subtasks</label>
          <input
            onclick="acceptOrCancelSubtask()"
            type="text"
            id="subtask"
            class="subtask"
            placeholder="Add new subtask"
          />
          <img
            id="add-subtask-img"
            class="add-subtask-img"
            src="./assets/icons/add.svg"
            alt="Add subtask"
          />
          <div class="cancel-or-accept">
            <img
              onclick="cancelSubTask()"
              id="cancel-task-img"
              class="cancel-task-img subtask-img dp-none"
              src="./assets/icons/cancel.svg"
              alt="Cancel Subtask"
            />
            <div id="small-separator" class="small-separator dp-none"></div>
            <img
              id="accept-task-img"
              class="accept-task-img subtask-img dp-none"
              src="./assets/icons/check.svg"
              alt="Accept Subtask"
              onclick="addSubtask()"
            />
          </div>
          <ul class="subtask-list" id="subtask-list"></ul>
        </div>
      </section>
    </form>
    <div class="form-footer">
      <div class="footnote">
        <span class="red">*</span>This field is required
      </div>
      <div class="form-btns">
        <div
          onclick="clearTaskForm()"
          class="clear-btn form-btn"
          onmouseover="changeToBlueIcon()"
          onmouseout="changeToBlackIcon()"
        >
          <p>Clear</p>
          <img
            id="clear"
            class="clear form-btn-img"
            src="./assets/icons/cancel.svg"
            alt="Clear Task Image"
          />
          <img
            id="clear-hover"
            class="clear-hover form-btn-img dp-none"
            src="./assets/icons/clear-hover.svg"
            alt="Create Task Image Hover"
          />
        </div>
        <div class="create-btn form-btn" onclick="createTask()">
          <p>Create Task</p>
          <img
            class="create form-btn-img"
            src="./assets/icons/check-white.svg"
            alt="Create Task Image"
          />
        </div>
      </div>
    </div></div></div>`;
}
