(function () {
  if (window.location.pathname.startsWith("/pages/4-bed-homes-lakeville-mn")) {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Path matched — injecting iframe...");
      document.body.classList.add("no-header-footer");

      fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/lakeville-upsizers-16.html")
        .then(response => response.text())
        .then(html => {
          console.log("HTML fetched successfully");

          const wrapper = document.createElement("div");
          wrapper.innerHTML = html;

          const footer = document.getElementById("footer");
          const main = document.querySelector("main");

          if (footer && footer.parentNode) {
            footer.parentNode.insertBefore(wrapper, footer);
            console.log("Injected before footer");
          } else if (main) {
            main.appendChild(wrapper);
            console.warn("Footer not found — injected into <main>");
          } else {
            document.body.appendChild(wrapper);
            console.warn("Main/footer not found — fallback to body");
          }
        })
        .catch(err => {
          console.error("Failed to load injected content:", err);
        });

      // ✅ This stylesheet injection should be outside the fetch block
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/css/lakeville-upsizer-17.css";
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
