function highlightMenuActual() {
  console.log(window.location.pathname);

  const menuMappings = {
    "/dashboard.html": ["menu-btn-dashboard", "menu-btn-resp-dashboard"],
    "/add-task.html": ["menu-btn-add-task", "menu-btn-resp-add-task"],
    "/board.html": ["menu-btn-board", "menu-btn-resp-board"],
    "/contacts.html": ["menu-btn-contacts", "menu-btn-resp-contacts"],
    "/privacy-policy.html": ["pp-btn"],
    "/legal-notice.html": ["ln-btn"],
    "/legal-notice-external.html": ["lne-btn"],
    "/privacy-policy-external.html": ["ppe-btn"],
  };

  const responsiveStyles = {
    backgroundColor: "#131820",
    borderRadius: "20px",
  };

  const path = window.location.pathname;
  if (menuMappings[path]) {
    menuMappings[path].forEach((id, index) => {
      const element = document.getElementById(id);
      if (element) {
        if (!path.includes("privacy-policy") && !path.includes("legal-notice")) {
          if (index === 0) {
            element.style.backgroundColor = "#3e5779";
          } else {
            Object.assign(element.style, responsiveStyles);
          }
        }
        if (path.includes("privacy-policy") || path.includes("legal-notice")) {
          element.style.color = "#29abe2";
        }
      }
    });
  }
}
