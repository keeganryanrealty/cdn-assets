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
  
  console.log("📩 Attaching form listener in showLeadForm()");
 
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
      form.addEventListener('submit', async function (e) {
        e.preventDefault();
        const modal = document.getElementById("lead-form-modal");

        const fullName = form.name.value.trim();
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(" ") || '';
        const email = form.email.value;
        const phone = form.phone.value || '';
      
        console.log("📤 Attempting Supabase signup:", email);
        
        const mlsid = sessionStorage.getItem('lead-mlsid') || '';
        const propertyAddress = sessionStorage.getItem('lead-address') || '';

        console.log("📍 MLS ID (from session):", mlsid);
        console.log("🏠 Property Address (from session):", propertyAddress);
        const password = form.password.value; // must be included in your form
        
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

        // SIGN UP in Supabase
        const { data, error } = await window.supabase.auth.signUp({
          email,
          password,
          options: {
          data: { full_name: fullName }
          }
        });

        if (error) {
          alert("Signup error: " + error.message);
          return;
        }

        console.log("✅ Supabase user created:", data.user.email);

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
          if (sessionStorage.getItem('lead-save-clicked')) {
            // Let login handler take care of save action — don't call onSubmit callback
            return;
          }

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
function injectLoginForm(showImmediately = false) {
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/login-form-5.html")
    .then(response => response.text())
    .then(html => {
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;

      const footer = document.getElementById("footer");
      if (footer && footer.parentNode) {
        footer.parentNode.insertBefore(wrapper, footer);
      } else {
        document.body.appendChild(wrapper);
        console.warn("⚠️ Footer not found — injected at end of body.");
      }

      const waitForModal = setInterval(() => {
        const modal = document.getElementById("lead-form-modal");
        if (!modal) return;

        clearInterval(waitForModal);

        if (showImmediately) {
          modal.style.display = "block"; // ✅ Show only if triggered to
        }

        console.log("✅ Login form modal injected");
        attachLoginHandlers();
      }, 200);
    })
    .catch(err => {
      console.error("❌ Failed to load login form:", err);
    });
}
// Attach Log In Handlers
function attachLoginHandlers() {
  const observeLoginSubmit = setInterval(() => {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    clearInterval(observeLoginSubmit);

loginForm.addEventListener('submit', async function (e) {
  e.preventDefault();

  const email = loginForm.email.value.trim();
  const password = loginForm.password.value;
  const errorBox = document.getElementById('login-error-message');

  const { data, error } = await window.supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (errorBox) {
      errorBox.textContent = formatSupabaseError(error);
      errorBox.style.display = 'block';
    }
    return;
  }

  if (errorBox) errorBox.style.display = 'none';

  console.log("✅ Logged in as:", data.user.email);
  sessionStorage.setItem('leadCaptured', 'true');
  window.dispatchEvent(new CustomEvent('supabase:auth:login'));

  const modal = document.getElementById("lead-form-modal");
  if (modal) {
    modal.style.display = "none";
    modal.querySelector('h2').textContent = 'Log In to View Property Details';
  }

  // 🔍 Check for save intent
  if (sessionStorage.getItem('lead-save-clicked')) {
  const mls = sessionStorage.getItem('lead-mls') || '';
  const mlsid = sessionStorage.getItem('lead-mlsid') || '';
  const address = sessionStorage.getItem('lead-address') || '';
  const listingKey = `${mls}-${mlsid}`;
  await saveListingAfterLogin(listingKey);

  // update button visually
  const allSaveBtns = document.querySelectorAll(`.custom-save-btn[data-mlsid="${mlsid}"]`);
  allSaveBtns.forEach(btn => {
    btn.innerHTML = '<i class="fa fa-check"></i><span>Saved</span>';
  });

  // cleanup
  sessionStorage.removeItem('lead-save-clicked');
  sessionStorage.removeItem('lead-mlsid');
  sessionStorage.removeItem('lead-address');
}


    // ✅ Fallback: redirect to last viewed property
    const viewed = JSON.parse(sessionStorage.getItem('viewedProperties') || '[]');
    const lastViewed = viewed[viewed.length - 1];
    if (lastViewed) {
      window.location.href = lastViewed;
    } else {
      window.location.reload();
    }
  });
    }, 500);

    // Reattach signup button logic
      const observeCreateClick = setInterval(() => {
      const createBtn = document.getElementById("create-account-btn");
      if (!createBtn) return;

      clearInterval(observeCreateClick);
      createBtn.addEventListener("click", () => {
        console.log("🌀 Switching to Create Account form...");
        swapToSignupForm();
      });
  }, 500);
}


if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectLoginForm(false));
} else {
  injectLoginForm(false);
}


// Error formatter functions should be defined OUTSIDE
function formatSupabaseError(error) {
  const msg = error.message.toLowerCase();

  if (msg.includes("invalid login credentials")) {
    return "Incorrect email or password. Please try again.";
  }
  if (msg.includes("email not confirmed")) {
    return "Please confirm your email before logging in. Check your inbox.";
  }
  if (msg.includes("user not found")) {
    return "No account found with this email.";
  }
  return "Login failed: " + error.message;
}

function formatSupabaseSignupError(error) {
  const msg = error.message.toLowerCase();

  if (msg.includes("user already registered") || msg.includes("user already exists")) {
    return "This email is already registered. Try logging in instead.";
  }
  if (msg.includes("invalid email")) {
    return "Please enter a valid email address.";
  }
  if (msg.includes("password should be at least")) {
    return "Password must be at least 6 characters long.";
  }
  if (msg.includes("email rate limit")) {
    return "Too many sign-up attempts. Please wait a moment and try again.";
  }

  return "Signup failed: " + error.message;
}

// Signup swap
function swapToSignupForm() {
  fetch("https://cdn.jsdelivr.net/gh/keeganryanrealty/cdn-assets@main/html/create-account-6.html")
    .then(response => response.text())
    .then(html => {

      const modal = document.getElementById("lead-form-modal");
      if (!modal) {
        console.error("❌ Modal container not found to inject signup form");
        return;
      }

      modal.innerHTML = html;

// Back to login form logic
const observeBackToLogin = setInterval(() => {
  const backBtn = document.getElementById("back-to-login-btn");
  if (!backBtn) return;

  clearInterval(observeBackToLogin);

  backBtn.addEventListener("click", () => {
    console.log("🔁 Switching back to login form...");
    
    // Completely remove the modal so injectLoginForm() re-adds it from scratch
    const modal = document.getElementById("lead-form-modal");
    if (modal) modal.remove();

    // Re-inject the login form
    injectLoginForm(true); // ⬅️ Calls your main function that loads the login HTML + listeners
  });
}, 300);

      const recheck = setInterval(() => {
        const form = document.getElementById("lead-form");
        if (!form) return;

        clearInterval(recheck);
        if (!form.dataset.handlerAttached) {
          form.dataset.handlerAttached = "true";

          form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const email = form.email.value.trim();
            const password = form.password.value;

            const { data, error } = await window.supabase.auth.signUp({ email, password });
            const errorBox = document.getElementById('signup-error-message');

            if (error) {
              if (errorBox) {
                errorBox.textContent = formatSupabaseSignupError(error);
                errorBox.style.display = 'block';
              }
              return;
            }

            if (errorBox) errorBox.style.display = 'none';

            console.log("✅ Signup successful:", data.user.email);
            showLeadForm(); // Optional logic after signup
          });
        }
      }, 300);
    })
    .catch(err => {
      console.error("❌ Failed to load signup form:", err);
    });
}
// Close Button Handler
document.addEventListener("click", function (e) {
  if (e.target.matches(".modal-close-btn")) {
    const modal = document.getElementById("lead-form-modal");
    const currentPath = window.location.pathname;

    if (currentPath !== "/" && currentPath !== "/index.php") {
      // Redirect to homepage if not already on it
      window.location.href = "/";
    } else {
      // Otherwise, just close the modal
      if (modal) modal.style.display = "none";
    }
  }
});

// === END VIEW DETAILS LEAD FORM LOGIC ===

// === LOGOUT ===
document.addEventListener("DOMContentLoaded", function () {
  const logoutLink = document.getElementById("logout-link");

  if (logoutLink) {
    logoutLink.addEventListener("click", async function (e) {
      e.preventDefault();
      const { error } = await window.supabase.auth.signOut();
      if (!error) {
        console.log("✅ Logged out");
        sessionStorage.removeItem("leadCaptured");
        sessionStorage.removeItem("viewedProperties");
        window.location.reload();
      } else {
        console.error("❌ Logout failed:", error.message);
      }
    });
  }
});

document.addEventListener("DOMContentLoaded", async function () {
  const loginBtn = document.getElementById("login-link"); // Update with your actual ID
  const logoutBtn = document.getElementById("logout-link"); // Optional

  const {
    data: { session },
  } = await window.supabase.auth.getSession();

  if (session && session.user) {
    // User is logged in
    if (loginBtn) loginBtn.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "inline";
  } else {
    // User is logged out
    if (loginBtn) loginBtn.style.display = "inline";
    if (logoutBtn) logoutBtn.style.display = "none";
  }
});
// === END LOGOUT ===

// LOGIN DISPLAY FOR /PROPERTY/ PAGES Wait for Supabase to initialize + login modal to inject
if (window.location.pathname.includes("/property/")) {
  // Wait until DOM is ready
  document.addEventListener("DOMContentLoaded", function () {
    // Wait until modal exists (if dynamically loaded)
    const checkExist = setInterval(() => {
      const modal = document.getElementById("lead-form-modal");
      if (!modal || window.supabase === undefined) return;

      clearInterval(checkExist);

      // Check login status
      window.supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
          console.log("🔐 Not logged in — showing login modal");
          modal.style.display = "block";
        } else {
          console.log("✅ Already logged in");
        }
      });
    }, 300);
  });
}









// SAVE LISTING MECHANICS
// ==========================
// 1. Inject Custom Save Button
// ==========================
function injectCustomSaveButtons() {
  document.querySelectorAll('.listing-box').forEach(listingBox => {
    if (listingBox.querySelector('.custom-save-btn')) return;

    listingBox.removeAttribute('data-link');
    const originalSave = listingBox.querySelector('.saveListing');
    if (!originalSave) return;

    const mlsid = originalSave.dataset.mlsid;
    const mls = originalSave.dataset.mls;
    const stack = listingBox.querySelector('.listing-box-image-links');
    if (!stack) return;

    const btn = document.createElement('a');
    btn.href = 'javascript:void(0)';
    btn.className = 'custom-save-btn';
    btn.dataset.mlsid = mlsid;
    btn.dataset.mls = mls;
    btn.innerHTML = `<i class="fa fa-heart"></i><span style="margin-left: 8px;">Save</span>`;

    stack.appendChild(btn);
  });
}

function watchForListings() {
  const observer = new MutationObserver(injectCustomSaveButtons);
  observer.observe(document.body, { childList: true, subtree: true });
  injectCustomSaveButtons();
}

function extractAddressFromSlug(slug) {
  const path = slug.split('/property/')[1];
  if (!path) return 'Unknown Address';

  const parts = path.split('-');
  if (parts.length < 5) return 'Unknown Address';

  // Assume format: MLS-MLSID-[Street Parts]-City-State-Zip
  const zip = parts.pop();
  const state = parts.pop().toUpperCase();
  const city = capitalize(parts.pop());
  const streetParts = parts.slice(2); // Skip MLS + MLSID
  const street = streetParts.map(capitalize).join(' ');

  return `${street}, ${city}, ${state} ${zip}`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


// ==========================
// 2. Handle Save Clicks
// ==========================
document.addEventListener('click', async function (e) {
  const btn = e.target.closest('.custom-save-btn');
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();
  e.stopImmediatePropagation();

  const mlsid = btn.dataset.mlsid;
  const mls = btn.dataset.mls;
  const listingKey = `${mls}-${mlsid}`;
    // ✳️ Address extraction
    let address = btn.closest('.listing-box')?.querySelector('.listing-box-location')?.textContent?.trim();
    if (!address) {
    const slug = window.location.pathname;
    address = extractAddressFromSlug(slug);
    }

  sessionStorage.setItem('lead-save-clicked', 'true');
  sessionStorage.setItem('lead-mlsid', mlsid);
  sessionStorage.setItem('lead-mls', mls);
  sessionStorage.setItem('lead-address', address);

  const { data: { session } } = await window.supabase.auth.getSession();

  if (!session) {
    const modal = document.getElementById('lead-form-modal');
    if (modal) {
      modal.querySelector('h2').textContent = 'Login to Save Listing';
      modal.style.display = 'block';
    }

    const onLogin = async () => {
      const { data: { session: newSession } } = await window.supabase.auth.getSession();
      if (newSession) {
        window.removeEventListener('supabase:auth:login', onLogin);
        saveListingAfterLogin(listingKey, newSession.user.id, address);
      }
    };

    window.addEventListener('supabase:auth:login', onLogin);
  } else {
    saveListingAfterLogin(listingKey, session.user.id, address);
  }
}, true);

// ==========================
// 3. Save to Supabase
// ==========================
async function saveListingAfterLogin(listingKey, userId, address) {
  const [mls, mlsid] = listingKey.split('-');

  const { error } = await window.supabase.from('saved_listings').insert([
    { user_id: userId, mls_id: mlsid, mls: mls, address: address }
  ]);

  if (error) {
    if (error.code === '23505') {
      console.log("⚠️ Listing already saved.");
    } else {
      console.error("❌ Failed to save:", error.message);
    }
    return;
  }

  console.log("✅ Saved to Supabase:", listingKey);
  updateSaveButtonsUI(mls, mlsid);
}

function updateSaveButtonsUI(mls, mlsid) {
  document.querySelectorAll(`.custom-save-btn[data-mls="${mls}"][data-mlsid="${mlsid}"]`)
    .forEach(markButtonAsSaved);
}

function markButtonAsSaved(btn) {
  btn.classList.add('saved');
  btn.innerHTML = `<i class="fa fa-check"></i><span style="margin-left: 8px;">Saved</span>`;
}

// ==========================
// 4. Persist Saved Buttons on Load
// ==========================
async function highlightSavedListings() {
  const { data: { session } } = await window.supabase.auth.getSession();
  const userId = session?.user?.id;
  if (!userId) return;

  const { data: savedListings, error } = await window.supabase
    .from('saved_listings')
    .select('mls_id, mls')
    .eq('user_id', userId);

  if (error) {
    console.error("❌ Failed to fetch saved listings:", error.message);
    return;
  }

  const savedKeys = new Set(savedListings.map(row => `${row.mls}-${row.mls_id}`));

  document.querySelectorAll('.custom-save-btn').forEach(btn => {
    const key = `${btn.dataset.mls}-${btn.dataset.mlsid}`;
    if (savedKeys.has(key)) markButtonAsSaved(btn);
  });
}

// ==========================
// 5. Initialize on Page Load
// ==========================
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    watchForListings();
    highlightSavedListings();
  });
} else {
  watchForListings();
  highlightSavedListings();
}





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




