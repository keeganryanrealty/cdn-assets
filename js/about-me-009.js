(function () {
  if (window.location.pathname === "/pages/about") {
    fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/about-me-001.html")
      .then(response => response.text())
      .then(html => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        // Find the footer and insert before it
        const footer = document.querySelector("footer") || document.getElementById("kv-footer");
        if (footer && footer.parentNode) {
          footer.parentNode.insertBefore(wrapper, footer);
        } else {
          document.body.appendChild(wrapper); // fallback
        }
      })
      .catch(err => {
        console.error("Failed to load injected content:", err);
      });

    // Inject CSS
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://yourusername.github.io/kvcore-injections/about-style-01.css"; // update this URL
    document.head.appendChild(link);
  }
})();
