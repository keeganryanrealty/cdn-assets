(function () {
  const currentPath = window.location.pathname;
  if (!currentPath.includes("/pages/get-started")) return;

  // Create quiz container
  const container = document.createElement("div");
  container.id = "quiz-container";

  // Fetch and insert quiz HTML
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-05.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;

      // Insert before footer (if found), or fallback to end of body
      const footer = document.querySelector('footer, #custom-footer, .footer-section');
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(container, footer);
      } else {
        console.warn("⚠️ Footer not found — injecting at end of body.");
        document.body.appendChild(container);
      }

      // TEMP HIDE NON-QUIZ SECTIONS
      const header = document.querySelector('header');
      const wrapper = document.querySelector('.page-wrapper');
      const aboutMe = document.querySelector('#about-me-placeholder');
      const customHero = document.querySelector('#custom-hero-placeholder');

      if (header) header.style.display = "none";
      if (wrapper) wrapper.style.display = "none";
      if (footer) footer.style.display = "none";
      if (aboutMe) aboutMe.style.display = "none";
      if (customHero) customHero.style.display = "none";

      initQuizApp(); // Call quiz logic
    })
    .catch(err => console.error("Quiz load error:", err));

  function initQuizApp() {
    console.log("✅ Quiz initialized");
  }
})();




// MULTISELECT LOGIC
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("quiz-option")) {
    const parent = e.target.closest(".multiselect");
    if (parent) {
      const selected = parent.querySelectorAll(".quiz-option.selected");
      const isSelected = e.target.classList.contains("selected");

      if (!isSelected && selected.length >= 2) return;

      e.target.classList.toggle("selected");
    } else {
      // Single select logic
      const options = e.target.parentElement.querySelectorAll(".quiz-option");
      options.forEach(opt => opt.classList.remove("selected"));
      e.target.classList.add("selected");
    }

    // Enable next if any option selected
    const step = e.target.closest(".quiz-step");
    const hasSelection = step.querySelector(".quiz-option.selected");
    const nextBtn = step.querySelector("#quiz-next");
    if (nextBtn) nextBtn.disabled = !hasSelection;
  }
});

