const BASE_URL =
  "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
  getUsersFromDatabase();
  disableSignupBtn();

  // removeSingleUser(2)
}
let policyAccepted = false;
let usersArr = [];

async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("users");
  let UserKeysArray = Object.keys(userResponse);
  for (let index = 0; index < UserKeysArray.length; index++) {
    usersArr.push({
      id: UserKeysArray[index],
      user: userResponse[UserKeysArray[index]],
    });
    console.log(usersArr);
  }
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
    document.getElementById("checkbox").src =
      "./assets/icons/btn-checked-blue.svg";
    policyAccepted = true;
    enableSignupBtn();
  } else if (policyAccepted === true) {
    document.getElementById("checkbox").src =
      "./assets/icons/btn-unchecked.svg";
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
  return usersArr.some(
    (user) => user.user.email === email && user.user.password === password
  );
}

//to refactor!
function addUser() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let name = document.getElementById("name");
  if (
    areInputsEmpty() ||
    userAlreadyExists(usersArr, email.value, password.value)
  ) {
    console.log("input empty or user already exists");
    showRequiredFields();
    showErrorMsgs();
  } else if (
    document.getElementById("password").value !==
    document.getElementById("confirm-password").value
  ) {
    document.getElementById("error-confirm-pw").classList.remove("dp-none");
  } else {
    console.log("input is not empty and user does not exist");
    usersArr.push({
      id: String(usersArr.length),
      user: { email: email.value, name: name.value, password: password.value },
    });
    addEditSingleUser(usersArr[usersArr.length - 1].id, {
      email: usersArr[usersArr.length - 1].user.email,
      name: usersArr[usersArr.length - 1].user.name,
      password: usersArr[usersArr.length - 1].user.password,
    });
  }
}

function passwordsMatch() {
  return (
    document.getElementById("password").value ===
    document.getElementById("confirm-password").value
  );
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
    inputElement.style.borderColor = "gray";
  }
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

async function addEditSingleUser(id, user) {
  putData(`users/${id}`, user);
}

async function removeSingleUser(id) {
  deleteData(`users/${id}`);
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

async function deleteData(path = "") {
  let response = await fetch(BASE_URL + path + ".json", {
    method: "DELETE",
  });
  return (responseToJson = await response.json());
}

function showLog() {
  document.getElementById(
    "log"
  ).innerHTML = `<div class="signup-successful-msg">
          <p>You Signed Up Successfully</p> 
        </div>`;
}

function goToLogin() {
  setTimeout(() => {
    window.location.href = "./login.html";
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
