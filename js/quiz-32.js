if (window.location.pathname.includes("/pages/get-started")) {
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-23.html")
    .then(res => res.text())
    .then(html => {
      const overlay = document.createElement("div");
      overlay.innerHTML = html;
      document.body.appendChild(overlay);
      initQuizApp(); // your logic
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





//EXIT Button Logic
function showQuizExitModal() {
  // Check if already open
  if (document.querySelector("#lead-form-modal")) return;

  // Create overlay container
  const modalOverlay = document.createElement("div");
  modalOverlay.id = "lead-form-overlay";
  modalOverlay.style.position = "fixed";
  modalOverlay.style.top = 0;
  modalOverlay.style.left = 0;
  modalOverlay.style.width = "100%";
  modalOverlay.style.height = "100%";
  modalOverlay.style.background = "rgba(0, 0, 0, 0.6)";
  modalOverlay.style.zIndex = 9999;
  modalOverlay.style.display = "flex";
  modalOverlay.style.justifyContent = "center";
  modalOverlay.style.alignItems = "center";

  // Lock scroll
  document.body.style.overflow = "hidden";

  // Fetch your existing modal HTML (the signup version)
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/signup.html")
    .then(res => res.text())
    .then(html => {
      const contentWrapper = document.createElement("div");
      contentWrapper.innerHTML = html;
      modalOverlay.appendChild(contentWrapper);

      // Inject into DOM
      document.body.appendChild(modalOverlay);

      // Add source identifier
      const form = modalOverlay.querySelector("#lead-form");
      if (form) form.setAttribute("data-source", "quiz-exit");

      // Allow close on overlay click or exit button
      modalOverlay.addEventListener("click", e => {
        if (e.target === modalOverlay || e.target.classList.contains("modal-close-btn")) {
          modalOverlay.remove();
          document.body.style.overflow = ""; // Unlock scroll
        }
      });
    });
}

// Wait for quiz-exit button to exist, especially if injected
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver(() => {
    const exitBtn = document.getElementById("quiz-exit");
    if (exitBtn) {
      exitBtn.addEventListener("click", showQuizExitModal);
      observer.disconnect(); // stop observing
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});





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

