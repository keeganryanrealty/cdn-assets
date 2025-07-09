(function () {
  if (window.location.pathname === "/pages/4-bed-homes-lakeville-mn") {
    document.addEventListener("DOMContentLoaded", function () {
      fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/lakeville-upsizers-9.html")
        .then(response => response.text())
        .then(html => {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = html;

          const main = document.querySelector("main");
          const footer = document.getElementById("footer");

          if (main) {
            main.appendChild(wrapper);  // Inject into the main content area
            console.log("Injected into <main>.");
          } else if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(wrapper, footer);  // Fallback
            console.warn("Main not found — injected before footer.");
          } else {
            document.body.appendChild(wrapper);  // Final fallback
            console.warn("Main/footer not found — injected at end of body.");
          }
        })
        .catch(err => {
          console.error("Failed to load injected content:", err);
        });

      // Inject your stylesheet
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/css/lakeville-upsizer.css";
      document.head.appendChild(link);
    });
  }
})();

// Optional: hide editor bar
const hideBeeRow = () => {
  const header = document.querySelector(".bee-editor-container");
  if (header) {
    header.style.setProperty("display", "none", "important");
  } else {
    setTimeout(hideBeeRow, 200); // retry after 200ms
  }
};
hideBeeRow();
