fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/header08.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("custom-header-placeholder").innerHTML = html;

    // Load dropdown + sticky script
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/js/header-dropdown-init-sticky-29.js";
    document.body.appendChild(script);
  });

// Add viewport meta tag
const meta = document.createElement("meta");
meta.name = "viewport";
meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
document.head.appendChild(meta);



// Load Hero & About Only On Correct Pages
  document.addEventListener("DOMContentLoaded", function () {
    const path = window.location.pathname;

    const hero = document.getElementById("custom-hero-placeholder");
    const about = document.getElementById("about-me-placeholder");

    const isHome = (path === "/" || path === "");

    if (hero) hero.style.display = isHome ? "block" : "none";
    if (about) about.style.display = isHome ? "block" : "none";
  });
