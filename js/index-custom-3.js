(function () {
  if (window.location.pathname === "/index.php?advanced=1&display=Lakeville&min=0&max=100000000&beds=4&baths=0&types%5B%5D=1&types%5B%5D=31&types%5B%5D=4&types%5B%5D=6&types%5B%5D=12&types%5B%5D=55&types%5B%5D=56&types%5B%5D=57&minfootage=0&maxfootage=30000&minacres=0&maxacres=0&yearbuilt=0&maxyearbuilt=0&walkscore=0&keywords=&sortby=listings.price+DESC&rtype=map") {
    document.addEventListener("DOMContentLoaded", function () {
      // Inject your stylesheet
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/css/index-custom-3.css";
      document.head.appendChild(link);
    });
  }
})();
