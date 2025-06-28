
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/about-me-2.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("about-me-placeholder").innerHTML = html;
    });
