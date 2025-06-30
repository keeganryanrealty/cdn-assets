(async function () {
  const footerAlreadyLoaded = document.querySelector('#custom-footer');
  if (footerAlreadyLoaded) return;

  const res = await fetch('https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/footer-15.html');
  const html = await res.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;

  document.body.appendChild(footer);
})();
