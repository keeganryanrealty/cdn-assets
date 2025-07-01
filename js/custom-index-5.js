(function () {
  if (window.location.pathname === "/index.php?") {
    document.addEventListener("DOMContentLoaded", function () {
      // Inject your stylesheet
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/css/custom-index.css";
      document.head.appendChild(link);
    });
  }
})();





// VIEW DETAILS LEAD FORM LOGIC
document.querySelectorAll('a[href*="/details.php"]').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();

    const targetURL = link.href;

    // Log property view (optional)
    const viewed = JSON.parse(sessionStorage.getItem('viewedProperties') || '[]');
    if (!viewed.includes(targetURL)) {
      viewed.push(targetURL);
      sessionStorage.setItem('viewedProperties', JSON.stringify(viewed));
    }

    // If already filled out the form this session, skip form
    if (sessionStorage.getItem('leadCaptured')) {
      window.location.href = targetURL;
      return;
    }

    // Show the lead form modal
    showLeadForm(() => {
      sessionStorage.setItem('leadCaptured', 'true');
      window.location.href = targetURL;
    });
  });
});


function showLeadForm(onSubmit) {
  const modal = document.getElementById('lead-form-modal');
  modal.style.display = 'block';

  const form = document.getElementById('lead-form');
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    // Optional: send to your CRM / webhook here
    const leadData = {
      name: form.name.value,
      email: form.email.value,
      phone: form.phone.value
    };
    console.log("Captured lead:", leadData);

    // Hide modal
    modal.style.display = 'none';

    // Run redirect callback
    onSubmit();
  });
}

(function () {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/view-details-form.html")
      .then(response => response.text())
      .then(html => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        // Insert before footer if it exists, else append to end
        const footer = document.getElementById("footer");
        if (footer && footer.parentNode) {
          footer.parentNode.insertBefore(wrapper, footer);
        } else {
          document.body.appendChild(wrapper);
          console.warn("Footer not found — content injected at end of body.");
        }

        console.log("✅ View Details form injected");
      })
      .catch(err => {
        console.error("❌ Failed to load injected content:", err);
      });
  });
})();
// END OF VIEW DETAILS LEAD FORM LOGIC







// Initial run in case elements are already on the page
document.querySelectorAll('.saveListing').forEach(el => {
  el.style.setProperty('display', 'none', 'important');
});

// Recheck every 1.5 seconds for dynamically loaded elements
const intervalId = setInterval(() => {
  document.querySelectorAll('.saveListing').forEach(el => {
    el.style.setProperty('display', 'none', 'important');
  });
}, 1500);

// Optional: Stop checking after 30 seconds
setTimeout(() => clearInterval(intervalId), 30000);


