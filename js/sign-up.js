const BASE_URL = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
  getUsersFromDatabase();
  disableSignupBtn();
  createRandomColor();

  // removeSingleUser(2)
}
let policyAccepted = false;
let usersArr = [];

async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("contactList");
  let UserKeysArray = Object.keys(userResponse);
  for (let index = 0; index < UserKeysArray.length; index++) {
    usersArr.push({
      id: UserKeysArray[index],
      user: userResponse[UserKeysArray[index]],
    });
  }
  console.log(usersArr);
}

async function getAllUsers(path) {
  let response = await fetch(BASE_URL + path + ".json");
  return (responseToJson = await response.json());
}

function areInputsEmpty() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let name = document.getElementById("name");
  if (email.value === "" || password.value === "" || name.value === "") {
    return true;
  }
}

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

function enableSignupBtn() {
  document.getElementById("submit-btn").disabled = false;
  document.getElementById("submit-btn").classList.add("signup-btn-enabled");
}

function disableSignupBtn() {
  document.getElementById("submit-btn").disabled = true;
  document.getElementById("submit-btn").classList.remove("signup-btn-enabled");
}

function userAlreadyExists(usersArr, email, password) {
  return usersArr.some((user) => user.user.email === email && user.user.password === password);
}

function createAvatar(str) {
  let newStr = "";
  for (let i = 0; i < str.length; i++) {
    if (str[i].match(/[A-Z]/)) {
      newStr += str[i];
    }
  }
  return newStr;
}

function createRandomColor() {
  let rgb = "";
  let r = Math.floor(Math.random() * 255) + 1;
  let g = Math.floor(Math.random() * 255) + 1;
  let b = Math.floor(Math.random() * 255) + 1;
  rgb += `rgb(${r}, ${g},${b})`;
  return rgb;
}

//refactored

function addUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const name = document.getElementById("name").value;

  if (areInputsInvalid(email, password, name, confirmPassword)) return;

  const newUser = createNewUser(email, password, name);
  usersArr.push(newUser);
  saveUserToDatabase(newUser);
}

function areInputsInvalid(email, password, name, confirmPassword) {
  if (areInputsEmpty() || userAlreadyExists(usersArr, email, password)) {
    console.log("Input empty or user already exists");
    showRequiredFields();
    showErrorMsgs();
    return true;
  }
  if (password !== confirmPassword) {
    document.getElementById("error-confirm-pw").classList.remove("dp-none");
    return true;
  }
  return false;
}

function createNewUser(email, password, name) {
  return {
    id: generateUniqueId(), // Generate a unique ID
    user: {
      color: createRandomColor(),
      email,
      name,
      password,
      avatar: createAvatar(name),
      phoneNumber: "", // Default empty phone number
    },
  };
}

// Generate a unique ID for the new user
function generateUniqueId() {
  return String(Date.now()); // Use the current timestamp as a unique ID
}

function saveUserToDatabase(user) {
  const { id, user: userData } = user;
  addEditSingleUser(id, userData);
}

function passwordsMatch() {
  return document.getElementById("password").value === document.getElementById("confirm-password").value;
}

//to refactor!
function showRequiredFields() {
  if (document.getElementById("name").value === "") {
    document.getElementById("name").style.borderColor = "red";
  }
  if (document.getElementById("email").value === "") {
    document.getElementById("email").style.borderColor = "red";
  }
  if (document.getElementById("password").value === "") {
    document.getElementById("password").style.borderColor = "red";
  }
  if (document.getElementById("confirm-password").value === "") {
    document.getElementById("confirm-password").style.borderColor = "red";
  }
}

//to refactor!
function showErrorMsgs() {
  if (document.getElementById("name").value === "") {
    document.getElementById("error-name").classList.remove("dp-none");
  }
  if (document.getElementById("email").value === "") {
    document.getElementById("error-email-1").classList.remove("dp-none");
  }
  if (document.getElementById("password").value === "") {
    document.getElementById("error-pw").classList.remove("dp-none");
  }
  if (document.getElementById("confirm-password").value === "") {
    document.getElementById("error-confirm-pw").classList.remove("dp-none");
  }
}

function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function addEditSingleUser(id, user) {
  putData(`contactList/${id}`, user);
}

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

async function removeSingleUser(id) {
  deleteData(`contactList/${id}`);
}

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

function showLog() {
  document.getElementById("log").innerHTML = `<div class="signup-successful-msg">
          <p>You Signed Up Successfully</p> 
        </div>`;
}

function goToLogin() {
  setTimeout(() => {
    window.location.href = "./index.html";
  }, 1000);
}

function signUp() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let name = document.getElementById("name");
  if (areInputsEmpty()) {
    console.log("INPUTS ARE EMTPY");
  } else if (!validateEmail(email.value)) {
    console.log("INVALID EMAIL");
  } else if (userAlreadyExists(usersArr, email.value, password.value)) {
    console.log("USER ALREADY EXISTS");
  } else if (!passwordsMatch()) {
    console.log("PASSWORDS DONT MATCH");
  } else {
    showLog();
    goToLogin();
  }
}
