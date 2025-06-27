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

      currentEl.classList.remove("current");
      currentEl.classList.add("exit");

      nextEl.classList.remove("next");
      nextEl.classList.add("enter");

      // Animate in next headline
      requestAnimationFrame(() => {
        nextEl.classList.add("enter-active");
      });

      // After animation, reset classes
      setTimeout(() => {
        currentEl.className = "headline next";
        nextEl.className = "headline current";

        [currentEl, nextEl] = [nextEl, currentEl];
      }, 800); // Match transition time
    }

    setInterval(switchHeadline, 4500);
  });
