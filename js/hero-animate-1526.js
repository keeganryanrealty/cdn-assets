document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("animated-headline");
  const currentSpan = container.querySelector(".headline.current");
  const nextSpan = container.querySelector(".headline.next");

  const headlines = [
    "Your Future, Elevated.",
    "Sell with Confidence.",
    "Buy Smarter.",
    "Upsize Stress‑Free.",
    "Guidance You Can Trust."
  ];

  let index = 0;
  currentSpan.textContent = headlines[index]; // Make sure it appears initially

  setInterval(() => {
    const prevIndex = index;
    index = (index + 1) % headlines.length;

    // Set next text and prepare it for animation
    nextSpan.textContent = headlines[index];
    nextSpan.classList.remove("exit", "enter-active");
    nextSpan.classList.add("enter");

    // Animate out current
    currentSpan.classList.remove("enter", "enter-active");
    currentSpan.classList.add("exit");

    // Wait for reflow, then animate in next
    requestAnimationFrame(() => {
      nextSpan.classList.remove("enter");
      nextSpan.classList.add("enter-active");
    });

    // After animation, swap roles
    setTimeout(() => {
      currentSpan.textContent = nextSpan.textContent;
      currentSpan.className = "headline current";
      nextSpan.textContent = "";
      nextSpan.className = "headline next";
    }, 700); // Match CSS transition duration
  }, 4000);
});
