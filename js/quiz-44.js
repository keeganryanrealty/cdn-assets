if (window.location.pathname.includes("/pages/get-started")) {
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-23.html")
    .then(res => res.text())
    .then(html => {
      const overlay = document.createElement("div");
      overlay.innerHTML = html;
      document.body.appendChild(overlay);
    });
}






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






// EXIT Button Logic
// EXIT Button Logic
function showQuizExitModal() {
  // Prevent duplicate modals
  if (document.querySelector("#lead-form-modal")) return;

  // Lock scroll
  document.body.style.overflow = "hidden";

  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-exit-modal.html")
    .then(res => res.text())
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      const modal = wrapper.querySelector("#lead-form-modal");
      if (!modal) return console.error("Modal not found in injected HTML");

      // Append to DOM
      document.body.appendChild(modal);

      // Add data-source attribute
      const form = modal.querySelector("#lead-form");
      if (form) form.setAttribute("data-source", "quiz-exit");

      // Set up close logic for both overlay click and close button
      modal.addEventListener("click", e => {
        if (
          e.target.id === "lead-form-modal" || 
          e.target.classList.contains("modal-close-btn")
        ) {
          modal.remove();
          document.body.style.overflow = "";
        }
      });
    })
    .catch(err => console.error("Error loading modal:", err));
}

// Wait for the #quiz-exit button to appear in the DOM
const observer = new MutationObserver(() => {
  const exitBtn = document.getElementById("quiz-exit");
  if (exitBtn && !exitBtn.dataset.listenerAdded) {
    exitBtn.addEventListener("click", showQuizExitModal);
    exitBtn.dataset.listenerAdded = "true"; // prevent multiple bindings
    observer.disconnect(); // stop watching once attached
  }
});
observer.observe(document.body, { childList: true, subtree: true });



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
    const nextBtn = document.getElementById("quiz-next");
    if (nextBtn) nextBtn.disabled = !hasSelection;
  }
});

