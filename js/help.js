async function init() {
  await showLoggedInInfo();
}

function showSubMenu() {
  if (document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.remove("dp-none");
    document.getElementById("subMenu").innerHTML = `
                  <a href="./privacy-policy.html"><div class="subMenu-btns">Privacy Policy</div></a>
                  <a href="./legal-notice.html"><div class="subMenu-btns">Legal Notice</div></a>
                  <a href="#"><div class="subMenu-btns">Log Out</div></a>`;
  } else {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

function closeSubMenu() {
  if (!document.getElementById("subMenu").classList.contains("dp-none")) {
    document.getElementById("subMenu").classList.add("dp-none");
  }
}

function preventBubbling(event) {
  event.stopPropagation();
}

async function showLoggedInInfo() {
  await loadLoginInfo("whoIsLoggedIn");
  if (loginInfo[0].isGuestLoggedIn === true) {
    document.getElementById("initialLetter").innerHTML = "G";
  } else {
    document.getElementById("initialLetter").innerHTML = loginInfo[0].userLoggedIn.avatar;
  }
}
