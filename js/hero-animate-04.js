<script>
document.addEventListener("DOMContentLoaded", () => {
  const el = document.getElementById("animated-headline");
  const headlines = [
    "Your Future, Elevated.",
    "Sell with Confidence.",
    "Buy Smarter.",
    "Upsize Stress‑Free.",
    "Guidance You Can Trust."
  ];

  let index = 0;

  function switchHeadline() {
    el.classList.remove("fade-in");
    el.classList.add("fade-out");

    setTimeout(() => {
      index = (index + 1) % headlines.length;
      el.textContent = headlines[index];

      // Force reflow to restart the transition
      void el.offsetWidth;

      el.classList.remove("fade-out");
      el.classList.add("fade-in");
    }, 600); // Match transition duration
  }

  setInterval(switchHeadline, 4500);
});
</script>
