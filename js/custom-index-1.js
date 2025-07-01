(function () {
  if (window.location.pathname === "/index.php?") {
    document.addEventListener("DOMContentLoaded", function () {
      // Inject your stylesheet
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/css/custom-index.css";
      document.head.appendChild(link);
    });
  }
})();








const removeSpacer = () => {
  const spacer = document.getElementById('fixed-header-spacer');
  if (spacer) {
    spacer.remove();
  } else {
    setTimeout(removeSpacer, 200);
  }
};
removeSpacer();

const hideSaveListing= () => {
  const header = document.querySelector('.saveListing');
  if (header) {
    header.style.setProperty('display', 'none', 'important');
  } else {
    setTimeout(hideSaveListing, 200); // retry after 200ms
  }
};
hideSaveListing();
