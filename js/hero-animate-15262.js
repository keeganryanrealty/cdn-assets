document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("animated-headline");
  if (!container) return;

  let currentEl = container.querySelector(".current");
  let nextEl = container.querySelector(".next");

  const headlines = [
    "Your Future, Elevated.",
    "Sell with Confidence.",
    "Buy Smarter.",
    "Upsize Stress‑Free.",
    "Guidance You Can Trust."
  ];

  let index = 0;

  function switchHeadline() {
    // Set the new headline
    index = (index + 1) % headlines.length;
    nextEl.textContent = headlines[index];

    // Trigger exit for current
    currentEl.classList.remove("current");
    currentEl.classList.add("exit");

    requestAnimationFrame(() => {
      currentEl.classList.add("exit-active");
      nextEl.classList.add("enter");

      requestAnimationFrame(() => {
        nextEl.classList.add("enter-active");
      });
    });

    // After transition completes
    setTimeout(() => {
      currentEl.className = "headline next"; // Reset to next
      nextEl.className = "headline current"; // Becomes current

      // Swap references
      [currentEl, nextEl] = [nextEl, currentEl];
    }, 700);
  }

  setInterval(switchHeadline, 4500);
});
