// Only run on the quiz page
if (window.location.pathname.includes("/pages/get-started")) {
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-23.html")
    .then(res => res.text())
    .then(html => {
      const overlay = document.createElement("div");
      overlay.innerHTML = html;
      document.body.appendChild(overlay);
      initQuizLogic(); // Run logic after DOM injection

      // Wait for #quiz-exit to exist, then bind click
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
    });
}

// Exit modal handler
function showQuizExitModal() {
  console.log("Exit button clicked");

  if (document.getElementById("quiz-exit-modal")) return; // Don't duplicate
  document.body.style.overflow = "hidden";

  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz-exit-modal-05.html")
    .then(res => res.text())
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      while (wrapper.firstChild) {
        document.body.appendChild(wrapper.firstChild);
      }

      const modal = document.getElementById("quiz-exit-modal");
      if (!modal) return console.error("Modal not found");

      // ✅ Force visibility
      Object.assign(modal.style, {
        display: "flex",
        visibility: "visible",
        opacity: "1",
        zIndex: "999999",
        position: "fixed",
        inset: "0",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
      });

      // Modal close logic
      modal.addEventListener("click", e => {
        if (
          e.target.id === "quiz-exit-modal" ||
          e.target.classList.contains("modal-close-btn")
        ) {
          modal.remove();
          document.body.style.overflow = "";
        }
      });

      // 🔁 Handle login swap
      const loginBtnCheck = setInterval(() => {
        const loginBtn = document.getElementById("back-to-login-btn");
        if (!loginBtn) return;

        clearInterval(loginBtnCheck);
        loginBtn.addEventListener("click", () => {
          console.log("🔁 Switching to login form inside quiz modal...");
          injectQuizLoginForm(); // ✅ Replaces modal content
        });
      }, 300);
    })
    .catch(err => console.error("Error loading modal:", err));
}


function injectQuizLoginForm() {
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/login-form-5.html")
    .then(res => res.text())
    .then(html => {
      const modal = document.getElementById("quiz-exit-modal");
      if (!modal) return console.error("Quiz modal not found");

      modal.innerHTML = html;

      // Reapply styles
      Object.assign(modal.style, {
        display: "flex",
        visibility: "visible",
        opacity: "1",
        zIndex: "999999",
        position: "fixed",
        inset: "0",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
      });

      modal.addEventListener("click", e => {
        if (
          e.target.id === "quiz-exit-modal" ||
          e.target.classList.contains("modal-close-btn")
        ) {
          modal.remove();
          document.body.style.overflow = "";
        }
      });

      // 👉 Add login form submit logic here if needed
    })
    .catch(err => console.error("Error loading login form:", err));
}




// Main quiz logic
function initQuizLogic() {
  // Multiselect + single select logic
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

  // Progress bar logic (if used)
  function updateQuizProgressPercent(percent) {
    const clamped = Math.max(0, Math.min(100, percent));
    const progressBar = document.getElementById("quiz-progress");
    if (progressBar) {
      progressBar.style.setProperty('--quiz-progress-percent', `${clamped}%`);
    }

    document.querySelectorAll('.quiz-progress-section').forEach(section => {
      const start = parseInt(section.dataset.start, 10);
      const end = parseInt(section.dataset.end, 10);
      section.classList.toggle('active', clamped >= start && clamped <= end);
    });
  }

  // Example usage: 
  // const percentComplete = Math.round((currentStep / totalSteps) * 100);
  // updateQuizProgressPercent(percentComplete);
}
