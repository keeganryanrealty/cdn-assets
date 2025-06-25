function initDropdown() {
  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".nav-primary");

  if (hamburger && navList) {
    hamburger.addEventListener("click", function () {
      navList.classList.toggle("active");
      hamburger.blur();
    });
  } else {
    console.warn("Dropdown elements not found.");
  }
}

// Ensure the script runs AFTER the header is injected
if (document.getElementById("custom-header-placeholder").children.length) {
  initDropdown(); // header is already in the DOM
} else {
  // Retry every 100ms until the elements appear
  const interval = setInterval(() => {
    const hamburger = document.querySelector(".hamburger");
    const navList = document.querySelector(".nav-primary");
    if (hamburger && navList) {
      clearInterval(interval);
      initDropdown();
    }
  }, 100);
}
