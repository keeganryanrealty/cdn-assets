(function () {
  const currentPath = window.location.pathname;
  if (!currentPath.includes("/pages/get-started")) return;

  // Create quiz container
  const container = document.createElement("div");
  container.id = "quiz-container";

  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-22.html")
    .then(res => res.text())
    .then(async html => {
      container.innerHTML = html;

      // Wait for elements before hiding them
      try {
        await Promise.all([
          waitForElement("header"),
          waitForElement(".page-wrapper"),
          waitForElement("#custom-footer")
        ]);

        const header = document.querySelector("header");
        const wrapper = document.querySelector(".page-wrapper");
        const aboutMe = document.querySelector("#about-me-placeholder");
        const customHero = document.querySelector("#custom-hero-placeholder");

        if (header) header.style.display = "none";
        if (wrapper) wrapper.style.display = "none";
        if (aboutMe) aboutMe.style.display = "none";
        if (customHero) customHero.style.display = "none";

        const footer = document.querySelector("#custom-footer");
        footer.parentNode.insertBefore(container, footer);
        footer.remove(); // clean remove
      } catch (err) {
        console.warn("⚠️ Some elements not found:", err);
        document.body.appendChild(container); // fallback
      }

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
function updateQuizProgressPercent(percent) {
  // Clamp percent between 0 and 100
  const clamped = Math.max(0, Math.min(100, percent));
  
  // Update CSS variable for fill
  const progressBar = document.getElementById("quiz-progress");
  progressBar.style.setProperty('--quiz-progress-percent', `${clamped}%`);

  // Update active section based on data-start and data-end
  document.querySelectorAll('.quiz-progress-section').forEach(section => {
    const start = parseInt(section.dataset.start, 10);
    const end = parseInt(section.dataset.end, 10);

    const isActive = clamped >= start && clamped <= end;
    section.classList.toggle('active', isActive);
  });
}

// PROGRESS QUIZ LOGIC THAT WE CAN PLUG INTO QUIZ
// const percentComplete = Math.round((currentStep / totalSteps) * 100);
// updateQuizProgressPercent(percentComplete); 









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

