const placeholder = document.getElementById("custom-header-placeholder");

const observer = new MutationObserver(() => {
  const hamburger = document.querySelector(".hamburger");
  const navList = document.querySelector(".nav-primary");

  if (hamburger && navList) {
    hamburger.addEventListener("click", function () {
      navList.classList.toggle("active");
      hamburger.blur();
    });

    observer.disconnect(); // Stop observing after attaching
  }
});

// Watch for the injected HTML to show up
observer.observe(placeholder, {
  childList: true,
  subtree: true
});
