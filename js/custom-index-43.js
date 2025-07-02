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
    console.warn("❌ Lead form modal not found.");
    return;
  }

  // ✅ Always show the modal immediately
  modal.style.display = 'block';

  // ⏳ Poll until the form is loaded in the DOM
  const pollInterval = 100; // ms
  const maxAttempts = 50;
  let attempts = 0;

  const waitForForm = setInterval(() => {
    const form = document.getElementById('lead-form');

    if (form && form.dataset.handlerAttached !== "true") {
      clearInterval(waitForForm);
      form.dataset.handlerAttached = "true";

      form.addEventListener('submit', function (e) {
        e.preventDefault();

        console.log("📡 Submitting Mailchimp at", new Date().toISOString());

        const fullName = form.name.value.trim();
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(" ") || '';
        // Extract MLS ID from pathname
        const mlsidMatch = window.location.pathname.match(/property\/\d+-(\d+)-/);
        const mlsid = mlsidMatch ? mlsidMatch[1] : '';
        console.log("🛣️ Pathname:", window.location.pathname);
        // Extract Property Address Once Loaded
        function waitForElement(selector, timeout = 3000) {
  return new Promise((resolve, reject) => {
    const intervalTime = 100;
    let timeElapsed = 0;
    const interval = setInterval(() => {
      const element = document.querySelector(selector);
      if (element) {
        clearInterval(interval);
        resolve(element);
      } else if (timeElapsed >= timeout) {
        clearInterval(interval);
        reject(new Error("Element not found in time"));
      }
      timeElapsed += intervalTime;
    }, intervalTime);
  });
}
// End Property Extraction
        
// Usage inside showLeadForm or wherever
waitForElement('.listing-detail-attribute .value')
  .then(addressElement => {
    const propertyAddress = addressElement.innerText.trim();
    console.log("🏠 Property Address:", propertyAddress);

    // Attach to your fetch payload here
  })
  .catch(err => {
    console.warn("⛔ Address element not found:", err.message);
  });

    
        // LeadData Payload
        const leadData = {
          email: form.email.value,
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName,
            PHONE: form.phone.value || ''
          },
          tags: ["Buyer", "Browsing Lead"],
          mlsid: mlsid, // for Zapier field mapping
          address: propertyAddress // to be injected in the Notes section
        };

        // ✅ Send to Mailchimp
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

        // ✅ Send to KVCore
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
            email: form.email.value,
            phone: form.phone.value || '',
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

        // ✅ Close modal and trigger onSubmit
        setTimeout(() => {
          modal.style.display = 'none';
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


