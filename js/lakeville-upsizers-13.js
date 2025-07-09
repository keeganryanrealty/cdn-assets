(function () {
  if (window.location.pathname.startsWith("/pages/4-bed-homes-lakeville-mn")) {
    document.addEventListener("DOMContentLoaded", function () {
      console.log("Path matched — injecting iframe...");

      fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/lakeville-upsizers-9.html")
        .then(response => response.text())
        .then(html => {
          console.log("HTML fetched successfully");
          const wrapper = document.createElement("div");
          wrapper.innerHTML = html;

          const main = document.querySelector("main");
          if (main) {
            main.appendChild(wrapper);
            console.log("Injected into <main>");
          } else {
            document.body.appendChild(wrapper);
            console.warn("Main not found — fallback to body");
          }
        })
        .catch(err => {
          console.error("Failed to load injected content:", err);
        });

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
