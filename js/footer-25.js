(async function () {
  const path = window.location.pathname + window.location.search;

  // Skip injecting if URL starts with /index.php?advanced
  if (path.startsWith("/index.php?advanced")) return;

  const footerAlreadyLoaded = document.querySelector('#custom-footer');
  if (footerAlreadyLoaded) return;

  const res = await fetch('https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/footer-24.html');
  const html = await res.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;

  document.body.appendChild(footer);
})();
