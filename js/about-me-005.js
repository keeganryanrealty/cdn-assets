(function () {
  if (window.location.pathname === "/pages/about") {
    fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/about-me-001.html")
      .then(response => response.text())
      .then(html => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;
        document.body.appendChild(wrapper);
      })
      .catch(err => {
        console.error("Failed to load injected content:", err);
      });
  }
})();

const link = document.createElement("link");
link.rel = "stylesheet";
link.href = "https://yourusername.github.io/kvcore-injections/about-style-01.css";
document.head.appendChild(link);
