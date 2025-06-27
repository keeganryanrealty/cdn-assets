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
  const header = document.querySelector(".custom-header");
  const hero = document.querySelector(".hero-section");

  if (!header || !hero) return;

  console.log("✅ Setting up IntersectionObserver");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          header.classList.remove("transparent");
          header.classList.add("sticky-solid");
          console.log("⬇️ Hero out of view → Sticky header ON");
        } else {
          header.classList.remove("sticky-solid");
          header.classList.add("transparent");
          console.log("⬆️ Hero in view → Transparent header ON");
        }
      });
    },
    {
      root: null, // viewport
      threshold: 0, // trigger as soon as any part is out of view
    }
  );

  observer.observe(hero);
}
