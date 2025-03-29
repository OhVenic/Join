function logout() {
  localStorage.removeItem("user");
  window.location.href = "login.html";
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
