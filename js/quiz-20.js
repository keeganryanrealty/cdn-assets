(function () {
  const currentPath = window.location.pathname;
  if (!currentPath.includes("/pages/get-started")) return;

  // Create quiz container
  const container = document.createElement("div");
  container.id = "quiz-container";

  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-20.html")
    .then(res => res.text())
    .then(async html => {
      container.innerHTML = html;

      // Wait for the footer to load
      let footer;
      try {
        footer = await waitForElement('#custom-footer');
        footer.parentNode.insertBefore(container, footer);
        footer.remove(); // fully remove
      } catch (err) {
        console.warn("⚠️ Footer not found — injected at end of body.");
        document.body.appendChild(container);
      }

      // TEMP HIDE OTHER SECTIONS
      const header = document.querySelector('header');
      const wrapper = document.querySelector('.page-wrapper');
      const aboutMe = document.querySelector('#about-me-placeholder');
      const customHero = document.querySelector('#custom-hero-placeholder');

      if (header) header.style.display = "none";
      if (wrapper) wrapper.style.display = "none";
      if (aboutMe) aboutMe.style.display = "none";
      if (customHero) customHero.style.display = "none";

      initQuizApp();
    })
    .catch(err => console.error("Quiz load error:", err));

  function initQuizApp() {
    console.log("✅ Quiz initialized");
  }

  function waitForElement(selector, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();

      const interval = setInterval(() => {
        const element = document.querySelector(selector);
        if (element) {
          clearInterval(interval);
          resolve(element);
        } else if (Date.now() - startTime > timeout) {
          clearInterval(interval);
          reject(`❌ Timeout: ${selector} not found`);
        }
      }, 100);
    });
  }
})();





const steps = [
  {
    question: "What’s most important in your next home?",
    subtext: "Pick up to 2 things that matter most.",
    type: "multiselect",
    options: [
      { label: "Location", icon: "🏙️", value: "location" },
      { label: "Square Footage", icon: "📐", value: "space" },
      { label: "Outdoor Space", icon: "🌳", value: "outdoor" },
      { label: "Modern Finishes", icon: "🛋️", value: "modern" },
      { label: "Affordability", icon: "💰", value: "affordability" }
    ]
  },
  // more steps...
];


// Quiz Progress
function updateQuizProgress(sectionKey) {
  document.querySelectorAll('.quiz-progress-section').forEach(section => {
    section.classList.toggle('active', section.dataset.step === sectionKey);
  });
}

// Example: call this when entering a new section
updateQuizProgress('timeline');












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

