document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("animated-headline");
  if (!container) return;

  const headlines = [
    "Your Future, Elevated.",
    "Sell with Confidence.",
    "Buy Smarter.",
    "Upsize Stress‑Free.",
    "Guidance You Can Trust."
  ];

  let current = container.querySelector(".current");
  let next = container.querySelector(".next");
  let index = 0;

  function switchHeadline() {
    index = (index + 1) % headlines.length;
    next.textContent = headlines[index];

    // Animate out current
    current.classList.remove("current");
    current.classList.add("exit");

    // Animate in next
    next.classList.remove("next");
    next.classList.add("enter");

    // Swap roles
    setTimeout(() => {
      current.className = "headline next";
      next.className = "headline current";

      [current, next] = [next, current];
    }, 600);
  }

  setInterval(switchHeadline, 4500);
});
