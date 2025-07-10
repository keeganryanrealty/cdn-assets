// === Inject GTM <script> into <head> ===
(function() {
  const gtmScript = document.createElement('script');
  gtmScript.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-W2M7XSLQ');`;
  document.head.prepend(gtmScript);
})();

// === Inject GTM <noscript> into <body> ===
(function() {
  const noscript = document.createElement('noscript');
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-W2M7XSLQ"
  height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  const body = document.getElementsByTagName('body')[0];
  if (body) {
    body.insertAdjacentElement('afterbegin', noscript);
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      document.body.insertAdjacentElement('afterbegin', noscript);
    });
  }
})();
