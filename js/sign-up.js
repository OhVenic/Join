const BASE_URL = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Initializes the sign-up page by fetching users, disabling the sign-up button, and creating a random color.
 */
async function init() {
  await getUsersFromDatabase();
  disableSignupBtn();
  createRandomColor();
}

let policyAccepted = false;
let usersArr = [];

/**
 * Fetches all users from the database and populates the `usersArr` array.
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
 * Fetches all users from the specified database path.
 * @param {string} path - The database path to fetch users from.
 * @returns {Promise<Object>} The response data as a JSON object.
 */
async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

/**
 * Toggles the acceptance of the policy and updates the UI accordingly.
 */
function acceptPolicy() {
  if (policyAccepted === false) {
    document.getElementById("checkbox").src = "./assets/icons/btn-checked-blue.svg";
    policyAccepted = true;
    enableSignupBtn();
  } else if (policyAccepted === true) {
    document.getElementById("checkbox").src = "./assets/icons/btn-unchecked.svg";
    policyAccepted = false;
    disableSignupBtn();
  }
}

/**
 * Enables the sign-up button and applies the enabled styling.
 */
function enableSignupBtn() {
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("submit-btn").classList.add("signup-btn-enabled");
}

/**
 * Disables the sign-up button and removes the enabled styling.
 */
function disableSignupBtn() {
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("submit-btn").classList.remove("signup-btn-enabled");
}

/**
 * Creates an avatar string by extracting uppercase letters from the given string.
 * @param {string} str - The input string.
 * @returns {string} The avatar string.
 */
function createAvatar(str) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[A-Z]/)) {
      newStr += str[i];
    }
  }
  return newStr;
}

/**
 * Generates a random RGB color string.
 * @returns {string} The RGB color string.
 */
function createRandomColor() {
  let rgb = "";
  let r = Math.floor(Math.random() * 255) + 1;
  let g = Math.floor(Math.random() * 255) + 1;
  let b = Math.floor(Math.random() * 255) + 1;
  rgb += `rgb(${r}, ${g},${b})`;
  return rgb;
}

/**
 * Creates a new user object with the given details.
 * @param {string} email - The user's email.
 * @param {string} password - The user's password.
 * @param {string} name - The user's name.
 * @returns {Object} The new user object.
 */
function createNewUser(email, password, name) {
  return {
    id: generateUniqueId(),
    user: {
      color: createRandomColor(),
      email,
      name,
      password,
      avatar: createAvatar(name),
      phoneNumber: "",
    },
  };
}

/**
 * Generates a unique ID based on the current timestamp.
 * @returns {string} The unique ID.
 */
function generateUniqueId() {
  return String(Date.now());
}

/**
 * Saves a user to the database.
 * @param {Object} user - The user object to save.
 */
function saveUserToDatabase(user) {
  const { id, user: userData } = user;
  addEditSingleUser(id, userData);
}

/**
 * Removes error messages and resets the input field's border color.
 * @param {string} errorId - The ID of the error message element.
 * @param {string} inputId - The ID of the input field element.
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
 * Validates an email address using a regular expression.
 * @param {string} email - The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Adds or edits a single user in the database.
 * @param {string} id - The user's ID.
 * @param {Object} user - The user data to add or edit.
 */
async function addEditSingleUser(id, user) {
  putData(`contactList/${id}`, user);
}

/**
 * Sends a PUT request to update data in the database.
 * @param {string} path - The database path to update.
 * @param {Object} data - The data to update.
 * @returns {Promise<Object>} The response data as a JSON object.
 */
async function putData(path = "", data = {}) {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "PUT",
    header: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return (responseToJson = await response.json());
}

/**
 * Removes a single user from the database.
 * @param {string} id - The user's ID.
 */
async function removeSingleUser(id) {
  deleteData(`contactList/${id}`);
}

/**
 * Sends a DELETE request to remove data from the database.
 * @param {string} path - The database path to delete.
 * @returns {Promise<Object>} The response data as a JSON object.
 */
async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

/**
 * Displays a success message after signing up.
 */
function showLog() {
  document.getElementById("log").innerHTML = `<div class="signup-successful-msg">
          <p>You Signed Up Successfully</p> 
        </div>`;
}

/**
 * Redirects the user to the login page after a delay.
 */
function goToLogin() {
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 1000);
}

// Update the signUp function to include the new email existence check
async function signUp(event) {
  event.preventDefault();
  if (isUsersArrEmpty()) return;
  const email = document.getElementById("email");
  const name = document.getElementById("name");
  if (handleEmptyInputs()) return;
  if (handleInvalidEmail(email)) return;
  if (handleExistingEmail(email.value, email)) return; // New email existence check
  if (handleExistingUser(email.value, name.value, name)) return;
  if (handlePasswordMismatch()) return;
  completeSignUp();
}
/**
 * Checks if the `usersArr` array is empty.
 * @returns {boolean} True if the array is empty, false otherwise.
 */
function isUsersArrEmpty() {
  if (usersArr.length === 0) {
    console.log("Users are still loading. Please try again.");
    return true;
  }
  return false;
}

/**
 * Checks if any input fields are empty and shows error messages if necessary.
 * @returns {boolean} True if any inputs are empty, false otherwise.
 */
function handleEmptyInputs() {
  if (areInputsEmpty()) {
    showRequiredFields();
    return true;
  }
  return false;
}

/**
 * Checks if the provided email is invalid and shows an error message if necessary.
 * @param {HTMLElement} email - The email input element.
 * @returns {boolean} True if the email is invalid, false otherwise.
 */
function handleInvalidEmail(email) {
  if (!validateEmail(email.value)) {
    document.getElementById("error-email-2").classList.remove("dp-none");
    email.style.borderColor = "red";
    return true;
  }
  return false;
}

/**
 * Checks if the user already exists and shows an error message if necessary.
 * @param {string} emailVal - The email value to check.
 * @param {string} nameVal - The name value to check.
 * @param {HTMLElement} nameEl - The name input element.
 * @returns {boolean} True if the user already exists, false otherwise.
 */
function handleExistingUser(emailVal, nameVal, nameEl) {
  if (userAlreadyExists(usersArr, emailVal, nameVal)) {
    document.getElementById("error-name-2").classList.remove("dp-none");
    nameEl.style.borderColor = "red";
    return true;
  }
  return false;
}

/**
 * Checks if the email already exists and shows an error message if necessary.
 * @param {string} emailVal - The email value to check.
 * @param {HTMLElement} emailEl - The email input element.
 * @returns {boolean} True if the email already exists, false otherwise.
 */
function handleExistingEmail(emailVal, emailEl) {
  if (emailAlreadyExists(usersArr, emailVal)) {
    document.getElementById("error-email-3").classList.remove("dp-none");
    emailEl.style.borderColor = "red";
    return true;
  }
  return false;
}

/**
 * Checks if an email already exists in the `usersArr` array.
 * @param {Array} usersArr - The array of users.
 * @param {string} email - The email to check.
 * @returns {boolean} True if the email already exists, false otherwise.
 */
function emailAlreadyExists(usersArr, email) {
  return usersArr.some((user) => user.user.email === email);
}

/**
 * Checks if the passwords do not match and shows an error message if necessary.
 * @returns {boolean} True if the passwords do not match, false otherwise.
 */
function handlePasswordMismatch() {
  if (!passwordsMatch()) {
    document.getElementById("error-confirm-pw").classList.remove("dp-none");
    document.getElementById("password").style.borderColor = "red";
    document.getElementById("confirm-password").style.borderColor = "red";
    return true;
  }
  return false;
}

/**
 * Completes the sign-up process by adding the user, showing a success message, and redirecting to login.
 */
function completeSignUp() {
  addUser();
  showLog();
  goToLogin();
}

/**
 * Checks if the passwords match.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
function passwordsMatch() {
  return document.getElementById("password").value === document.getElementById("confirm-password").value;
}

/**
 * Checks if a user already exists in the `usersArr` array.
 * @param {Array} usersArr - The array of users.
 * @param {string} email - The email to check.
 * @param {string} name - The name to check.
 * @returns {boolean} True if the user already exists, false otherwise.
 */
function userAlreadyExists(usersArr, email, name) {
  return usersArr.some((user) => user.user.email === email || user.user.name === name);
}

/**
 * Checks if any input fields are empty.
 * @returns {boolean} True if any inputs are empty, false otherwise.
 */
function areInputsEmpty() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let name = document.getElementById("name");
  if (email.value === "" || password.value === "" || name.value === "") {
    return true;
  }
  return false;
}

/**
 * Shows error messages for required fields that are empty.
 */
function showRequiredFields() {
  if (document.getElementById("name").value === "") {
    document.getElementById("name").style.borderColor = "red";
    document.getElementById("error-name").classList.remove("dp-none");
  }
  if (document.getElementById("email").value === "") {
    document.getElementById("email").style.borderColor = "red";
    document.getElementById("error-email-1").classList.remove("dp-none");
  }
  if (document.getElementById("password").value === "") {
    document.getElementById("password").style.borderColor = "red";
    document.getElementById("error-pw").classList.remove("dp-none");
  }
  if (document.getElementById("confirm-password").value === "") {
    document.getElementById("confirm-password").style.borderColor = "red";
    document.getElementById("error-confirm-pw").classList.remove("dp-none");
  }
}

/**
 * Adds a new user to the `usersArr` array and saves it to the database.
 */
function addUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const name = document.getElementById("name").value;
  const newUser = createNewUser(email, password, name);
  usersArr.push(newUser);
  saveUserToDatabase(newUser);
}
