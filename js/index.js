const BASE_URL = "https://join-382e0-default-rtdb.europe-west1.firebasedatabase.app/";

function init() {
  getUsersFromDatabase();
}

let usersArr = [];

async function getUsersFromDatabase() {
  let userResponse = await getAllUsers("contactList");
  console.log(userResponse);
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

function loginUser() {
  if (areInputsEmpty()) {
    console.log("INPUTS EMPTY");
    showRequiredFields();
  } else if (!isEmailCorrect()) {
    console.log("email is not correct");
    wrongEmail();
  } else if (!isPasswordCorrect()) {
    console.log("password is not correct");
    wrongPassword();
  } else if (isEmailCorrect() && isPasswordCorrect()) {
    goToSummary();
  }
}

function isEmailCorrect() {
  let email = document.getElementById("email");
  return usersArr.some((user) => user.user.email === email.value);
}

function isPasswordCorrect() {
  let password = document.getElementById("password");
  return usersArr.some((user) => user.user.password === password.value);
}

function areInputsEmpty() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  if (email.value === "" || password.value === "") {
    return true;
  }
}

function taskAlreadyExists(tasksArr, title) {
  return tasksArr.some((task) => task.title === title);
}

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

function wrongPassword() {
  document.getElementById("wrong-password").classList.remove("dp-none");
  document.getElementById("password").style.border = "1px solid red";
}

function wrongEmail() {
  document.getElementById("wrong-email").classList.remove("dp-none");
  document.getElementById("email").style.border = "1px solid red";
}

function removeErrorMsgs(errorId, inputId) {
  let errorElement = document.getElementById(errorId);
  let inputElement = document.getElementById(inputId);
  if (errorElement) {
    errorElement.classList.add("dp-none");
    inputElement.style.borderColor = "rgba(209, 209, 209, 1)";
  }
}

function goToSummary() {
  window.location.href = "./dashboard.html";
}

window.addEventListener('load', () => {
  const greeting = document.querySelector('.greeting');
  const logo = document.querySelector('.greeting-logo');

  setTimeout(() => {
    logo.classList.add('shrink'); // schrumpft das Logo
  }, 500);

  setTimeout(() => {
    greeting.classList.add('hide'); // blendet das weiße Overlay aus
  }, 500);
});
