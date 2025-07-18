(function () {
  const currentPath = window.location.pathname;
  if (!currentPath.includes("/pages/get-started")) return;

  const container = document.createElement("div");
  container.id = "quiz-container";

  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-22.html")
    .then(res => res.text())
    .then(async html => {
      container.innerHTML = html;

      // Wait for all the page elements before hiding them
      try {
        const [header, wrapper, aboutMe, customHero, footer] = await Promise.all([
          waitForElement("header"),
          waitForElement(".page-wrapper"),
          waitForElement("#about-me-placeholder", 2000),
          waitForElement("#custom-hero-placeholder", 2000),
          waitForElement("#custom-footer")
        ]);

        if (header) header.style.display = "none";
        if (wrapper) wrapper.style.display = "none";
        if (aboutMe) aboutMe.style.display = "none";
        if (customHero) customHero.style.display = "none";

        footer.parentNode.insertBefore(container, footer);
        footer.remove(); // Replace with quiz
      } catch (err) {
        console.warn("⚠️ Some elements not found:", err);
        document.body.appendChild(container); // fallback
      }

      // Force quiz container to overlay everything if needed
      Object.assign(container.style, {
        position: "relative",
        zIndex: "9999",
        backgroundColor: "#fff"
      });

      initQuizApp();
    })
    .catch(err => console.error("Quiz load error:", err));

  function waitForElement(selector, timeout = 4000) {
    return new Promise((resolve, reject) => {
      const startTime = Date.now();
      const check = () => {
        const el = document.querySelector(selector);
        if (el) return resolve(el);
        if (Date.now() - startTime > timeout) return reject(`❌ Timeout: ${selector} not found`);
        requestAnimationFrame(check);
      };
      check();
    });
  }

  function initQuizApp() {
    console.log("✅ Quiz initialized");
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

