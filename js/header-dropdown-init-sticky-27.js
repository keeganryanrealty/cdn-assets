// 👇 At the top of your script
console.log("🔥 Sticky header script loaded!");

const waitForHeader = setInterval(() => {
  const header = document.querySelector(".custom-header");
  const hero = document.querySelector(".hero-section");

  console.log("⏳ Waiting for header/hero...", { headerExists: !!header, heroExists: !!hero });

  if (header && hero) {
    clearInterval(waitForHeader);
    console.log("✅ Header & Hero found, running init...");

    initDropdown();
    initStickyHeader();
  }
}, 100);

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
  console.log("✅ Header & hero found, running sticky header init...");
  const header = document.querySelector(".custom-header");
  const hero = document.querySelector(".hero-section");

  if (!header || !hero) return;

  const headerHeight = header.offsetHeight;

  function handleScroll() {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight; // <- Moved inside here!

    console.log("scrollY:", scrollY, "heroHeight:", heroHeight, "headerHeight:", headerHeight);
    console.log("hero.offsetHeight:", hero.offsetHeight);
console.log("header.offsetHeight:", header.offsetHeight);
console.log("window.scrollY:", window.scrollY);

    if (scrollY >= heroHeight - headerHeight) {
      if (!header.classList.contains("sticky-solid")) {
        header.classList.remove("transparent");
        header.classList.add("sticky-solid");
        console.log("→ Switched to sticky-solid");
      }
    } else {
      if (!header.classList.contains("transparent")) {
        header.classList.remove("sticky-solid");
        header.classList.add("transparent");
        console.log("→ Switched to transparent");
      }
    }
  }

  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Run on load
}

// Fallback: Force scroll event once everything has loaded
window.addEventListener("load", () => {
  console.log("📦 Window fully loaded — forcing scroll check");
  window.dispatchEvent(new Event("scroll"));
});
