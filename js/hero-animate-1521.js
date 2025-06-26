document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const container = document.getElementById("animated-headline");
    if (!container) return;

    const currentEl = container.querySelector(".current");
    const nextEl = container.querySelector(".next");

    const headlines = [
      "Your Future, Elevated.",
      "Sell with Confidence.",
      "Buy Smarter.",
      "Upsize Stress‑Free.",
      "Guidance You Can Trust."
    ];

    let index = 0;

    function updateHeadline() {
      index = (index + 1) % headlines.length;
      nextEl.textContent = headlines[index];

      nextEl.classList.remove("enter-active");
      nextEl.classList.add("enter");

      void nextEl.offsetWidth;

      currentEl.classList.add("exit");
      nextEl.classList.add("enter-active");

      setTimeout(() => {
        currentEl.textContent = nextEl.textContent;
        currentEl.className = "headline current";
        nextEl.className = "headline next";
        nextEl.style.opacity = 0;
      }, 700);
    }

    setInterval(updateHeadline, 4000);
  }, 100); // Wait 100ms to ensure CMS DOM is ready
});
