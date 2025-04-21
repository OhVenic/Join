/**
 * Initializes the privacy policy page by loading and displaying logged-in user information.
 */
async function init() {
  loadLoginInfo("whoIsLoggedIn");
  await showLoggedInInfo();
}

/**
 * Displays logged-in user information.
 */
async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");
  if (loginInfo[0].isGuestLoggedIn === true) {
    document.getElementById("initialLetter").innerHTML = "G";
  } else {
    document.getElementById("initialLetter").innerHTML = loginInfo[0].userLoggedIn.avatar;
  }
}
