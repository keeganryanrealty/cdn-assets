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

function initStickyHeader() {
  const header = document.querySelector(".custom-header");
  const hero = document.querySelector(".hero-section");

  if (!header || !hero) return;

  const headerHeight = header.offsetHeight;
  const heroHeight = hero.offsetHeight;

function handleScroll() {
  const scrollY = window.scrollY;
  console.log("scrolly:", scrollY, "heroHeight:", heroHeight, "headerHeight:", headerHeight);

  if (scrollY >= heroHeight - headerHeight) {
    header.classList.remove("transparent");
    header.classList.add("sticky-solid");
    console.log("→ Switched to sticky-solid");
  } else {
    header.classList.remove("sticky-solid");
    header.classList.add("transparent");
    console.log("→ Switched to transparent");
  }
}


  window.addEventListener("scroll", handleScroll);
  handleScroll(); // run on load
}

// Run only AFTER header is injected into DOM
const waitForHeader = setInterval(() => {
  const header = document.querySelector(".custom-header");
  const hero = document.querySelector(".hero-section");

  if (header && hero) {
    clearInterval(waitForHeader);
    initDropdown();
    initStickyHeader();
  }
}, 100);
