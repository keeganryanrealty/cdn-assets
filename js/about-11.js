
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/about-11.html")
    .then(res => res.text())
    .then(html => {
      document.getElementById("about-me-placeholder").innerHTML = html;
    });
