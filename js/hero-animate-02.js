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
    // Slide out current
    el.classList.add("slide-out");
    
    setTimeout(() => {
      index = (index + 1) % headlines.length;
      el.textContent = headlines[index];

      // Instantly move below + hide (no transition)
      el.classList.remove("slide-out");
      el.style.transition = "none";
      el.style.opacity = "0";
      el.style.transform = "translateY(30px)";

      // Trigger reflow to reset transition
      void el.offsetWidth;

      // Then animate back in
      el.style.transition = "transform 0.7s ease, opacity 0.7s ease";
      el.classList.add("slide-in");

      // Remove slide-in after animation completes
      setTimeout(() => {
        el.classList.remove("slide-in");
      }, 700);
    }, 600); // Wait for slide-out to complete
  }

  setInterval(switchHeadline, 4500);
});
