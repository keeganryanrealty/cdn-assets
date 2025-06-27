(function waitForHeadlineElements() {
  const container = document.getElementById("animated-headline");
  if (!container) return setTimeout(waitForHeadlineElements, 100); // Retry

  let currentEl = container.querySelector(".current");
  let nextEl = container.querySelector(".next");

  if (!currentEl || !nextEl) return setTimeout(waitForHeadlineElements, 100); // Retry

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

    requestAnimationFrame(() => {
      currentEl.classList.add("exit-active");
      nextEl.classList.add("enter-active");
    });

    setTimeout(() => {
      currentEl.className = "headline next";
      nextEl.className = "headline current";
      [currentEl, nextEl] = [nextEl, currentEl];
    }, 700); // Match your transition time
  }

  setInterval(switchHeadline, 4500);
})();
