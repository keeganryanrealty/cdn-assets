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
    // Fade + slide out
    el.classList.remove("fade-slide-in");
    el.classList.add("fade-slide-out");

    setTimeout(() => {
      index = (index + 1) % headlines.length;
      el.textContent = headlines[index];

      // Immediately switch to slide in
      el.classList.remove("fade-slide-out");
      el.classList.add("fade-slide-in");
    }, 700); // Match transition duration
  }

  setInterval(switchHeadline, 4500);
});
