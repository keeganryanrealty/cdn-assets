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

  // ✅ Extract MLS ID
  const mlsMatch = targetURL.match(/-\d+-/);
  const mlsid = mlsMatch ? mlsMatch[0].replace(/-/g, '') : '';

  // ✅ Extract Property Address from URL
  const addressPart = targetURL.split('-').slice(2).join(' ');
  const propertyAddress = addressPart
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase()); // Title Case

  // ✅ Store in sessionStorage
  sessionStorage.setItem('lead-mlsid', mlsid);
  sessionStorage.setItem('lead-address', propertyAddress);

  console.log("📌 Captured from Click → MLS ID:", mlsid);
  console.log("🏡 Captured Address:", propertyAddress);

  // Save viewed
  const viewed = JSON.parse(sessionStorage.getItem('viewedProperties') || '[]');
  if (!viewed.includes(targetURL)) {
    viewed.push(targetURL);
    sessionStorage.setItem('viewedProperties', JSON.stringify(viewed));
  }

  // Skip form if already captured
  if (sessionStorage.getItem('leadCaptured')) {
    window.location.href = targetURL;
    return;
  }

  showLeadForm(() => {
    sessionStorage.setItem('leadCaptured', 'true');
    window.location.href = targetURL;
  });
}, true);

// 2. View Details Submit Form Logic
function showLeadForm(onSubmit) {
  const modal = document.getElementById('lead-form-modal');
  if (!modal) return;

  modal.style.display = 'block';

  const pollInterval = 100;
  const maxAttempts = 50;
  let attempts = 0;

  const waitForForm = setInterval(() => {
    const form = document.getElementById('lead-form');

    if (form && form.dataset.handlerAttached !== "true") {
      clearInterval(waitForForm);
      form.dataset.handlerAttached = "true";

      // ✅ NOW the form exists — safe to attach submit listener
      form.addEventListener('submit', function (e) {
        e.preventDefault();

        const fullName = form.name.value.trim();
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(" ") || '';
        const email = form.email.value;
        const phone = form.phone.value || '';

        const mlsid = sessionStorage.getItem('lead-mlsid') || '';
        const propertyAddress = sessionStorage.getItem('lead-address') || '';

        console.log("📍 MLS ID (from session):", mlsid);
        console.log("🏠 Property Address (from session):", propertyAddress);

        const leadData = {
          email,
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
            PHONE: phone
          },
          tags: ["Buyer", "Browsing Lead"],
          mlsid,
          address: propertyAddress
        };

        // ✅ Mailchimp call
        fetch('https://api-six-tau-53.vercel.app/api/mailchimp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify(leadData)
        })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Mailchimp error');
          console.log("✅ Lead sent to Mailchimp:", data);
        })
        .catch(error => {
          console.error("❌ Mailchimp error:", error.message);
        });

        // ✅ KVCore call
        fetch('https://api-six-tau-53.vercel.app/api/kvcore', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          mode: 'cors',
          credentials: 'include',
          body: JSON.stringify({
            firstName,
            lastName,
            email,
            phone,
            mlsid,
            address: propertyAddress
          })
        })
        .then(async res => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'KVCore error');
          console.log("✅ Lead sent to KVCore:", data);
        })
        .catch(error => {
          console.error("❌ KVCore error:", error.message);
        });

        setTimeout(() => {
          modal.style.display = 'none';
          sessionStorage.removeItem('lead-mlsid');
          sessionStorage.removeItem('lead-address');
          if (typeof onSubmit === 'function') {
            onSubmit();
          }
        }, 250);
      });
    }

    if (++attempts > maxAttempts) {
      clearInterval(waitForForm);
      console.warn("❌ Gave up waiting for lead form to load.");
    }
  }, pollInterval);
}


// 3. Inject Login Form HTML and Watch for Create Account Click ===
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    // Load LOGIN form first
    fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/login-form.html")
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

        console.log("✅ Login form modal injected");

        // Intercept view clicks
        const recheckInterval = setInterval(() => {
          setupViewDetailsInterception();
          setupMapPopupInterception();
        }, 1000);
        setTimeout(() => clearInterval(recheckInterval), 30000);

        // 🧠 Watch for "Create Account" button click inside login form
        const observeCreateClick = setInterval(() => {
          const createBtn = document.getElementById("create-account-btn");
          if (!createBtn) return;

          clearInterval(observeCreateClick);
          createBtn.addEventListener("click", () => {
            console.log("🌀 Switching to Create Account form...");
            swapToSignupForm();
          });
        }, 500);
      })
      .catch(err => {
        console.error("❌ Failed to load login form:", err);
      });
  });

  // 🔁 Load Create Account form (view-details-form-2.html)
  function swapToSignupForm() {
    fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/view-details-form-2.html")
      .then(response => response.text())
      .then(html => {
        const modal = document.getElementById("lead-form-modal");
        if (!modal) {
          console.error("❌ Modal container not found to inject signup form");
          return;
        }

        // Replace modal contents with signup form
        modal.innerHTML = html;

        console.log("✅ Signup form loaded");

        // ✅ Re-run submission watcher logic
          const recheck = setInterval(() => {
            const form = document.getElementById("lead-form");
            if (!form) return;

            clearInterval(recheck);
            if (!form.dataset.handlerAttached) {
              form.dataset.handlerAttached = "true";
        showLeadForm(); // Or manually attach the event listener here
    }
}, 300);

      })
      .catch(err => {
        console.error("❌ Failed to load signup form:", err);
      });
  }
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


