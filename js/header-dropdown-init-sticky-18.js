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

function initStickyScroll() {
  const header = document.querySelector(".custom-header");
  const hero = document.querySelector(".hero-section");

  if (!header || !hero) return false;

 function handleScroll() {
  const heroBottom = hero.getBoundingClientRect().bottom;
  const headerHeight = header.offsetHeight;

  console.log("heroBottom:", heroBottom, "headerHeight:", headerHeight);

  if (heroBottom <= headerHeight) {
    header.classList.remove("transparent");
    header.classList.add("sticky-solid");
    console.log("Added sticky-solid");
  } else {
    header.classList.remove("sticky-solid");
    header.classList.add("transparent");
    console.log("Added transparent");
  }
}


  window.addEventListener("scroll", handleScroll);
  handleScroll(); // run on load
  return true;
}

// Try initializing sticky logic with retries
(function retryStickyInit() {
  const success = initStickyScroll();
  if (!success) {
    setTimeout(retryStickyInit, 100); // Retry every 100ms
  }
})();
