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

 document.addEventListener("DOMContentLoaded", function initStickyHeader() {
  const header = document.querySelector(".custom-header");
  const hero = document.querySelector(".hero-section");

  if (!header || !hero) {
    return setTimeout(initStickyHeader, 100); // Wait for DOM elements to be ready
  }

  function handleScroll() {
    const heroBottom = hero.getBoundingClientRect().bottom;

    if (heroBottom <= 0) {
      header.classList.remove("transparent");
      header.classList.add("sticky-solid");
    } else {
      header.classList.remove("sticky-solid");
      header.classList.add("transparent");
    }
  }

  // Apply once and on scroll
  window.addEventListener("scroll", handleScroll);
  handleScroll();
}

// Try after DOM is loaded
document.addEventListener("DOMContentLoaded", initStickyHeader);
