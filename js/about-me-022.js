(function () {
  if (window.location.pathname === "/pages/about") {
    document.addEventListener("DOMContentLoaded", function () {
      fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/about-me-007.html")
        .then(response => response.text())
        .then(html => {
          const wrapper = document.createElement("div");
          wrapper.innerHTML = html;

          const footer = document.getElementById("footer");

          if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(wrapper, footer);
          } else {
            // Fallback if footer not found
            document.body.appendChild(wrapper);
            console.warn("Footer not found — content injected at end of body.");
          }
        })
        .catch(err => {
          console.error("Failed to load injected content:", err);
        });

      // Inject your stylesheet
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/css/about-style-07.css";
      document.head.appendChild(link);
    });
  }
})();
