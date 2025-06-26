document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("animated-headline");
  const headlines = [
    "Your Future, Elevated.",
    "Sell with Confidence.",
    "Buy Smarter.",
    "Upsize Stress‑Free.",
    "Guidance You Can Trust."
  ];

  if (!el) return;

  let index = 0;

  function switchHeadline() {
    // Slide out current
    el.classList.remove("slide-in");
    el.classList.add("slide-out");

    setTimeout(() => {
      index = (index + 1) % headlines.length;
      el.textContent = headlines[index];

      // Prepare for slide in
      el.classList.remove("slide-out");
      el.classList.add("slide-in");

      setTimeout(() => {
        el.classList.remove("slide-in");
      }, 800); // Match CSS transition time
    }, 600); // Wait for slide-out before changing
  }

  setInterval(switchHeadline, 4500);
});
