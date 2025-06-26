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
    // Slide and fade out
    el.classList.remove("animate-in", "animate-in-active");
    el.classList.add("animate-out");

    setTimeout(() => {
      // Update text
      index = (index + 1) % headlines.length;
      el.textContent = headlines[index];

      // Prepare slide-in
      el.classList.remove("animate-out");
      el.classList.add("animate-in");

      // Small delay to let animate-in apply, then activate visible state
      setTimeout(() => {
        el.classList.add("animate-in-active");
      }, 50); // short enough to work smoothly

      // Cleanup
      setTimeout(() => {
        el.classList.remove("animate-in", "animate-in-active");
      }, 600); // match transition time
    }, 600); // match slide-out duration
  }

  setInterval(updateHeadline, 4500);
});
