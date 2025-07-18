if (window.location.pathname.includes("/pages/get-started")) {
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-23.html")
    .then(res => res.text())
    .then(html => {
      const overlay = document.createElement("div");
      overlay.innerHTML = html;
      document.body.appendChild(overlay);
      initQuizLogic(); // <- kick off main logic after DOM exists
    });
}

function initQuizLogic() {
    if (exitBtn) {
      console.log("Exit button found, attaching listener.");
      exitBtn.addEventListener("click", showQuizExitModal);
    }


  
  // Multiselect logic
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("quiz-option")) {
      const parent = e.target.closest(".multiselect");
      if (parent) {
        const selected = parent.querySelectorAll(".quiz-option.selected");
        const isSelected = e.target.classList.contains("selected");

        if (!isSelected && selected.length >= 2) return;

        e.target.classList.toggle("selected");
      } else {
        const options = e.target.parentElement.querySelectorAll(".quiz-option");
        options.forEach(opt => opt.classList.remove("selected"));
        e.target.classList.add("selected");
      }

      const step = e.target.closest(".quiz-step");
      const hasSelection = step.querySelector(".quiz-option.selected");
      const nextBtn = document.getElementById("quiz-next");
      if (nextBtn) nextBtn.disabled = !hasSelection;
    }
  });


  
  // Progress update helper (for future use)
  function updateQuizProgressPercent(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    const progressBar = document.getElementById("quiz-progress");
    progressBar?.style.setProperty('--quiz-progress-percent', `${clamped}%`);

    document.querySelectorAll('.quiz-progress-section').forEach(section => {
      const start = parseInt(section.dataset.start, 10);
      const end = parseInt(section.dataset.end, 10);
      section.classList.toggle('active', clamped >= start && clamped <= end);
    });
  }

    // PROGRESS QUIZ LOGIC THAT WE CAN PLUG INTO QUIZ
    // const percentComplete = Math.round((currentStep / totalSteps) * 100);
    // updateQuizProgressPercent(percentComplete); 

  
  // Exit modal logic
function showQuizExitModal() {
  console.log("Exit button clicked"); // confirm click is firing

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

      document.body.appendChild(modal);
      const form = modal.querySelector("#lead-form");
      if (form) form.setAttribute("data-source", "quiz-exit");

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


  // Attach exit button listener (now guaranteed to exist)
    const observer = new MutationObserver(() => {
      const exitBtn = document.getElementById("quiz-exit");
      if (exitBtn && !exitBtn.dataset.listenerAttached) {
        console.log("Attaching listener to #quiz-exit");
        exitBtn.addEventListener("click", showQuizExitModal);
        exitBtn.dataset.listenerAttached = "true";
        observer.disconnect();
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });

