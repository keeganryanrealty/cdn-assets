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





// === VIEW DETAILS LEAD FORM LOGIC ===

// 1. Intercept and handle View Details click events
function setupViewDetailsInterception() {
  document.querySelectorAll('a[href*="/details.php"]').forEach(link => {
    if (link.dataset.interceptAttached === "true") return;
    link.dataset.interceptAttached = "true";

    // Attach listener to anchor *and* allow bubbling for nested image clicks
    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetURL = link.href;

      const viewed = JSON.parse(sessionStorage.getItem('viewedProperties') || '[]');
      if (!viewed.includes(targetURL)) {
        viewed.push(targetURL);
        sessionStorage.setItem('viewedProperties', JSON.stringify(viewed));
      }

      if (sessionStorage.getItem('leadCaptured')) {
        window.location.href = targetURL;
        return;
      }

      // Show form modal, then redirect
      showLeadForm(() => {
        sessionStorage.setItem('leadCaptured', 'true');
        window.location.href = targetURL;
      });
    }, true); // <-- Use capture mode to intercept bubbling clicks
  });
}
// Intercept and handle Map Pop Up View Details click events
function setupMapPopupInterception() {
  document.querySelectorAll('.leaflet-popup a[href*="/property/"]').forEach(link => {
    if (link.dataset.interceptAttached === "true") return;
    link.dataset.interceptAttached = "true";

    link.addEventListener('click', function (e) {
      e.preventDefault();

      const targetURL = link.href;

      // Log property view
      const viewed = JSON.parse(sessionStorage.getItem('viewedProperties') || '[]');
      if (!viewed.includes(targetURL)) {
        viewed.push(targetURL);
        sessionStorage.setItem('viewedProperties', JSON.stringify(viewed));
      }

      if (sessionStorage.getItem('leadCaptured')) {
        window.location.href = targetURL;
        return;
      }

      showLeadForm(() => {
        sessionStorage.setItem('leadCaptured', 'true');
        window.location.href = targetURL;
      });
    });
  });
}
// Intercept Image click events
document.addEventListener('click', function (e) {
  const box = e.target.closest('div.listing-box[data-link]');
  if (!box) return;

  e.preventDefault();
  e.stopImmediatePropagation();
  e.stopPropagation();

  const targetURL = box.dataset.link;
  if (!targetURL) return;

  const viewed = JSON.parse(sessionStorage.getItem('viewedProperties') || '[]');
  if (!viewed.includes(targetURL)) {
    viewed.push(targetURL);
    sessionStorage.setItem('viewedProperties', JSON.stringify(viewed));
  }

  if (sessionStorage.getItem('leadCaptured')) {
    window.location.href = targetURL;
    return;
  }

  showLeadForm(() => {
    sessionStorage.setItem('leadCaptured', 'true');
    window.location.href = targetURL;
  });
}, true); // Capture phase


// 2. Show your lead form modal and handle submission
function showLeadForm(onSubmit) {
  const modal = document.getElementById('lead-form-modal');
  if (!modal) {
    console.warn("Lead form modal not found.");
    return;
  }

  modal.style.display = 'block';

  const form = document.getElementById('lead-form');
  if (!form) {
    console.warn("Lead form element missing inside modal.");
    return;
  }

  if (form.dataset.handlerAttached !== "true") {
    form.dataset.handlerAttached = "true";

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // ✅ Split name into first and last
      const fullName = form.name.value.trim();
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(" ") || '';

      const leadData = {
        email: form.email.value,
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
          PHONE: form.phone.value || ''
        },
        tags: ["Buyer", "Browsing Lead"]
      };
     
      // ✅ Send to Mailchimp
      fetch('https://api-six-tau-53.vercel.app/api/mailchimp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData)
      })
      .then(res => res.json())
      .then(result => {
        console.log("✅ Lead sent to Mailchimp:", result);
      })
      .catch(error => {
        console.error("❌ Mailchimp error:", error);
      });

      // ✅ Also send to Make.com webhook
      fetch('https://hook.us2.make.com/ixladj9374dy27mpmdf8homieayeso2f', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: fullName,
              email: form.email.value,
              phone: form.phone.value,
            tags: ["Buyer", "Browsing Lead"]
          })
        })
  .then(() => console.log("✅ Lead sent to Make.com webhook"))
  .catch(error => console.error("❌ Make.com webhook error:", error));

modal.style.display = 'none';
onSubmit();

      modal.style.display = 'none';
      onSubmit();
    });
  }
}


// 3. Inject the form HTML from GitHub, then initialize watchers
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/view-details-form-1.html")
      .then(response => response.text())
      .then(html => {
        const wrapper = document.createElement("div");
        wrapper.innerHTML = html;

        const footer = document.getElementById("footer");
        if (footer && footer.parentNode) {
          footer.parentNode.insertBefore(wrapper, footer);
        } else {
          document.body.appendChild(wrapper);
          console.warn("⚠️ Footer not found — content injected at end of body.");
        }

        console.log("✅ Lead form modal injected");

        // Watch for View Details links and attach intercepts
        const recheckInterval = setInterval(() => {
          setupViewDetailsInterception();
          setupMapPopupInterception();
          setupListingBoxInterception();
                              }, 1000);
        setTimeout(() => clearInterval(recheckInterval), 30000); // Optional: stop after 30s
      })
      .catch(err => {
        console.error("❌ Failed to load injected form HTML:", err);
      });
  });
})();
// === END VIEW DETAILS LEAD FORM LOGIC ===







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


