document.addEventListener("DOMContentLoaded", function () {
  const el = document.getElementById("animated-headline");
  const headlines = [
    "Your Future, Elevated.",
    "Sell with Confidence.",
    "Buy Smarter.",
    "Upsize Stress‑Free.",
    "Guidance You Can Trust."
  ];

  if (!el) {
    console.log("⚠️ animated-headline element not found.");
    return;
  }

  let index = 0;

  setInterval(() => {
    el.style.opacity = 0;
    setTimeout(() => {
      index = (index + 1) % headlines.length;
      el.textContent = headlines[index];
      el.style.opacity = 1;
    }, 300);
  }, 4000);
});
