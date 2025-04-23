/**
 * Initializes the application by fetching users, loading login info, and setting default login info.
 */

let userData = {};
let usersArr = [];

function init() {
  getUsersFromDatabase();
  loadLoginInfo("whoIsLoggedIn");
  putLoginInfo("whoIsLoggedIn", { isGuestLoggedIn: false, userLoggedIn: { name: "", avatar: "" } });
}

/**
 * Fetches users from the database and populates the `usersArr` array.
 * @async
 */
async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("contactList");
  let UserKeysArray = Object.keys(userResponse);
  for (let index = 0; index < UserKeysArray.length; index++) {
    usersArr.push({
      id: UserKeysArray[index],
      user: userResponse[UserKeysArray[index]],
    });
  }
}

/**
 * Fetches all users from the specified path in the database.
 * @async
 * @param {string} path - The path to fetch users from.
 * @returns {Promise<Object>} The response data as a JSON object.
 */

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

/**
 * Handles the login process by validating inputs and navigating to the summary page if successful.
 *
 * The function performs the following checks in order:
 * 1. Checks if input fields are empty and displays required field errors.
 * 2. Validates the email format and displays an error if incorrect.
 * 3. Validates the password and displays an error if incorrect.
 * 4. If both email and password are correct, processes the login and redirects to the summary page.
 *
 * @async
 */

async function loginUser() {
  if (areInputsEmpty()) {
    showRequiredFields();
  } else if (!isEmailCorrect()) {
    wrongEmail();
  } else if (!isPasswordCorrect()) {
    wrongPassword();
  } else if (isEmailCorrect() && isPasswordCorrect()) {
    await processLogin();
    goToSummary();
  }
}

/**
 * Processes the login by storing the logged-in user's information.
 * @async
 */
async function processLogin() {
  let loginUserEmail = document.getElementById("email").value;
  let filteredUser = usersArr.filter((item) => item.user.email === loginUserEmail);
  await putLoginInfo("whoIsLoggedIn", {
    isGuestLoggedIn: false,
    userLoggedIn: { name: filteredUser[0].user.name, avatar: filteredUser[0].user.avatar },
  });
}

/**
 * Logs in a guest user and redirects to the dashboard.
 */
function loginGuest() {
  putLoginInfo("whoIsLoggedIn", { isGuestLoggedIn: true, userLoggedIn: { name: "", avatar: "" } });
  window.location.href = "./dashboard.html";
}

/**
 * Checks if the entered email matches any user in the database.
 * @returns {boolean} True if the email is correct, otherwise false.
 */
function isEmailCorrect() {
  let email = document.getElementById("email");
  return usersArr.some((user) => user.user.email === email.value);
}

/**
 * Checks if the entered password matches any user in the database.
 * @returns {boolean} True if the password is correct, otherwise false.
 */
function isPasswordCorrect() {
  let password = document.getElementById("password");
  return usersArr.some((user) => user.user.password === password.value);
}

/**
 * Checks if the email or password input fields are empty.
 * @returns {boolean} True if any input is empty, otherwise false.
 */
function areInputsEmpty() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  if (email.value === "" || password.value === "") {
    return true;
  }
}

/**
 * Checks if a task with the given title already exists in the task array.
 * @param {Array} tasksArr - The array of tasks.
 * @param {string} title - The title of the task to check.
 * @returns {boolean} True if the task exists, otherwise false.
 */
function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some((task) => task.title === title);
}

/**
 * Displays error messages for required fields if they are empty.
 */
function showRequiredFields() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  if (email.value === "") {
    document.getElementById("error-email").classList.remove("dp-none");
    document.getElementById("email").style.border = "1px solid red";
  }
  if (password.value === "") {
    document.getElementById("error-password").classList.remove("dp-none");
    document.getElementById("password").style.border = "1px solid red";
  }
}

/**
 * Displays an error message for an incorrect password.
 */
function wrongPassword() {
  document.getElementById("wrong-password").classList.remove("dp-none");
  document.getElementById("password").style.border = "1px solid red";
}

/**
 * Displays an error message for an incorrect email.
 */
function wrongEmail() {
  document.getElementById("wrong-email").classList.remove("dp-none");
  document.getElementById("email").style.border = "1px solid red";
}

/**
 * Removes error messages and resets input field styles.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} inputId - The ID of the input element.
 */
function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

/**
 * Redirects the user to the summary/dashboard page.
 */
function goToSummary() {
  window.location.href = "./dashboard.html";
}

window.addEventListener("load", () => {
  const greeting = document.querySelector(".greeting");
  const logo = document.querySelector(".greeting-logo");
  setTimeout(() => {
    logo.classList.add("shrink");
  }, 500);
  setTimeout(() => {
    greeting.classList.add("hide");
  }, 500);
});
