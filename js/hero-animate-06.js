document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("animated-headline");
  const headlines = [
    "Your Future, Elevated.",
    "Sell with Confidence.",
    "Buy Smarter.",
    "Upsize Stress‑Free.",
    "Guidance You Can Trust."
  ];
  let index = 0;

  function updateHeadline() {
    // Fade + slide out
    el.classList.remove("animate-in-active");
    el.classList.add("animate-out");

    setTimeout(() => {
      // Set new text
      index = (index + 1) % headlines.length;
      el.textContent = headlines[index];

      // Prep for slide-in
      el.classList.remove("animate-out");
      el.classList.add("animate-in");

      // Allow DOM to apply .animate-in, then trigger visible animation
      requestAnimationFrame(() => {
        el.classList.add("animate-in-active");
      });

      // Cleanup
      setTimeout(() => {
        el.classList.remove("animate-in");
      }, 600);
    }, 600); // Match your CSS transition timing
  }

  setInterval(updateHeadline, 4500);
});
