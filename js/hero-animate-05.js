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
    // Animate out
    el.classList.add("animate-out");

    setTimeout(() => {
      // Update text
      index = (index + 1) % headlines.length;
      el.textContent = headlines[index];

      // Reset position to animate-in starting point
      el.classList.remove("animate-out");
      el.classList.add("animate-in");

      // Allow reflow before transitioning in
      requestAnimationFrame(() => {
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      });

      // Clean up the 'animate-in' class after transition
      setTimeout(() => {
        el.classList.remove("animate-in");
      }, 600);
    }, 600); // Match the out-transition duration
  }

  setInterval(updateHeadline, 4500);
});
