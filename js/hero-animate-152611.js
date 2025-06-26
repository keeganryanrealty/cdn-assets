document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("animated-headline");
  if (!container) return; // prevent crash if not found

  const currentEl = container.querySelector(".current");
  const nextEl = container.querySelector(".next");
  if (!currentEl || !nextEl) return; // also prevent crash if spans not present

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

    nextEl.classList.add("enter");
    void nextEl.offsetWidth;
    nextEl.classList.add("enter-active");

    setTimeout(() => {
      currentEl.textContent = nextEl.textContent;
      nextEl.className = "headline next";
    }, 700);
  }

  setInterval(switchHeadline, 4500);
});
