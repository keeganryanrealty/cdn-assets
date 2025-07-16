(function () {
  const currentPath = window.location.pathname;
  if (!currentPath.includes("/pages/get-started")) return;

  // Inject quiz container into body
  const container = document.createElement("div");
  container.id = "quiz-container";

  // Fetch and insert HTML from GitHub-hosted file
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/quiz.html")
    .then(res => res.text())
    .then(html => {
      container.innerHTML = html;
      document.body.appendChild(container);
      initQuizApp(); // call your quiz logic here
    })
    .catch(err => console.error("Quiz load error:", err));
})();
