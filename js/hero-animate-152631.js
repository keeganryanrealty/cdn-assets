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
    index = (index + 1) % headlines.length;
    nextEl.textContent = headlines[index];

    // Prepare for transition
    currentEl.classList.remove("current");
    currentEl.classList.add("exit");
    nextEl.classList.add("enter");

    requestAnimationFrame(() => {
      currentEl.classList.add("exit-active");
      nextEl.classList.add("enter-active");
    });

    setTimeout(() => {
      currentEl.className = "headline next";
      nextEl.className = "headline current";

      // Swap roles
      [currentEl, nextEl] = [nextEl, currentEl];
    }, 700);
  }

  setInterval(switchHeadline, 4500);
});
