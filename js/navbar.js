/**
 * Highlights the menu button corresponding to the current page.
 */
function highlightMenuActual() {
  const menuMappings = getMenuMappings();
  const responsiveStyles = getResponsiveStyles();
  const path = window.location.pathname;

  if (menuMappings[path]) {
    menuMappings[path].forEach((id, index) => {
      const element = document.getElementById(id);
      if (element) {
        applyStylesToElement(element, path, index, responsiveStyles);
      }
    });
  }
}

/**
 * Returns the mapping of paths to menu button IDs.
 * @returns {Object} An object mapping paths to menu button IDs.
 */
function getMenuMappings() {
  return {
    "/Join/dashboard.html": ["menu-btn-dashboard", "menu-btn-resp-dashboard"],
    "/Join/add-task.html": ["menu-btn-add-task", "menu-btn-resp-add-task"],
    "/Join/board.html": ["menu-btn-board", "menu-btn-resp-board"],
    "/Join/contacts.html": ["menu-btn-contacts", "menu-btn-resp-contacts"],
    "/Join/privacy-policy.html": ["pp-btn"],
    "/Join/legal-notice.html": ["ln-btn"],
    "/Join/legal-notice-external.html": ["lne-btn"],
    "/Join/privacy-policy-external.html": ["ppe-btn"],
  };
}

/**
 * Returns the responsive styles for menu buttons.
 * @returns {Object} An object containing responsive styles.
 */
function getResponsiveStyles() {
  return {
    backgroundColor: "#131820",
    borderRadius: "20px",
  };
}

/**
 * Applies the appropriate styles to a menu button element.
 * @param {HTMLElement} element - The menu button element.
 * @param {string} path - The current page path.
 * @param {number} index - The index of the element in the menu mapping.
 * @param {Object} responsiveStyles - The responsive styles to apply.
 */
function applyStylesToElement(element, path, index, responsiveStyles) {
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
