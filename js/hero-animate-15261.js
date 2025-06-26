document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("animated-headline");
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

  function switchHeadline() {
    // Set next text
    index = (index + 1) % headlines.length;
    nextEl.textContent = headlines[index];

    // Animate next in
    nextEl.classList.add("enter");

    // Force reflow
    void nextEl.offsetWidth;

    nextEl.classList.add("enter-active");

    // After transition, swap roles
    setTimeout(() => {
      currentEl.textContent = nextEl.textContent;
      nextEl.className = "headline next";
    }, 700);
  }

  setInterval(switchHeadline, 4500);
});
