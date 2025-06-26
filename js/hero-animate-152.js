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

  function updateHeadline() {
    // Get next headline text
    index = (index + 1) % headlines.length;
    nextEl.textContent = headlines[index];

    // Prepare next headline to slide in from below
    nextEl.classList.remove("enter-active");
    nextEl.classList.add("enter");

    // Trigger reflow to enable transition
    void nextEl.offsetWidth;

    // Begin transitions
    currentEl.classList.add("exit");
    nextEl.classList.add("enter-active");

    // After transition ends, reset classes
    setTimeout(() => {
      currentEl.textContent = nextEl.textContent;
      currentEl.className = "headline current";
      nextEl.className = "headline next";
      nextEl.style.opacity = 0;
    }, 700); // match CSS transition
  }

  setInterval(updateHeadline, 4000);
});
