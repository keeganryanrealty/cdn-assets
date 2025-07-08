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
function extractCityFromAddress(address) {
  const parts = address.split(',');
  return parts.length >= 2 ? parts[1].trim() : '';
}

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

      form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fullName = form.name.value.trim();
        const nameParts = fullName.split(" ");
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(" ") || '';
        const email = form.email.value;
        const phone = form.phone.value || '';
        const password = form.password.value;

        // Store for later use
        sessionStorage.setItem('lead-fname', firstName);
        sessionStorage.setItem('lead-lname', lastName);
        sessionStorage.setItem('lead-phone', phone);
        sessionStorage.setItem('lead-email', email);

        const mlsid = sessionStorage.getItem('lead-mlsid') || '';
        const address = sessionStorage.getItem('lead-address') || '';
        sessionStorage.setItem('lead-city', extractCityFromAddress(address));

        // Sign up WITHOUT confirmation
        const { error } = await window.supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: null,
            data: { full_name: fullName }
          }
        });

       if (error) {
          alert("Signup error: " + error.message);
        return;
        }


        modal.style.display = 'none';

        
      // ✅ Trigger lead sync + redirect
      window.dispatchEvent(new CustomEvent('supabase:auth:login'));
        
        const viewed = JSON.parse(sessionStorage.getItem('viewedProperties') || '[]');
        const lastViewed = viewed[viewed.length - 1];
        if (lastViewed) {
          window.location.href = lastViewed;
        } else {
          window.location.reload();
        }


        // Just wait — auth state change will take care of the rest
      });
    }

    if (++attempts > maxAttempts) {
      clearInterval(waitForForm);
      console.warn("❌ Lead form not found after waiting.");
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

//Supabase, KVCore, Mailchimp Callers
window.addEventListener('supabase:auth:login', async () => {
  // Prevent duplicate syncs
  if (sessionStorage.getItem('lead-registered-synced')) return;
  sessionStorage.setItem('lead-registered-synced', 'true');

  const email = sessionStorage.getItem('lead-email') || '';
  const firstName = sessionStorage.getItem('lead-fname') || '';
  const lastName = sessionStorage.getItem('lead-lname') || '';
  const phone = sessionStorage.getItem('lead-phone') || '';
  const mlsid = sessionStorage.getItem('lead-mlsid') || '';
  const address = sessionStorage.getItem('lead-address') || '';
  const city = sessionStorage.getItem('lead-city') || '';

  const leadData = {
    email,
    merge_fields: {
      FNAME: firstName,
      LNAME: lastName,
      PHONE: phone
    },
    tags: ["Buyer", "Browsing Lead", city],
    mlsid,
    address
  };

  // ✅ Mailchimp
  fetch('https://api-six-tau-53.vercel.app/api/mailchimp', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leadData)
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log("✅ Sent to Mailchimp:", data);
  }).catch(err => console.error("❌ Mailchimp error:", err.message));

  // ✅ KVCore
  fetch('https://api-six-tau-53.vercel.app/api/kvcore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName,
      lastName,
      email,
      phone,
      mlsid,
      address
    })
  }).then(async res => {
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    console.log("✅ Sent to KVCore:", data);
  }).catch(err => console.error("❌ KVCore error:", err.message));
});


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

          // Completely remove the modal so injectLoginForm() re-adds it
          const modal = document.getElementById("lead-form-modal");
          if (modal) modal.remove();

          // Re-inject the login form
          injectLoginForm(true);
        });
      }, 300);

      // Handle new account creation
      const recheck = setInterval(() => {
        const form = document.getElementById("lead-form");
        if (!form) return;

        clearInterval(recheck);
        if (!form.dataset.handlerAttached) {
          form.dataset.handlerAttached = "true";

          form.addEventListener('submit', async function (e) {
            e.preventDefault();

            const fullName = form.name.value.trim();
            const nameParts = fullName.split(" ");
            const firstName = nameParts[0] || '';
            const lastName = nameParts.slice(1).join(" ") || '';
            const email = form.email.value.trim();
            const password = form.password.value;
            const phone = form.phone.value || '';

            // Save data to sessionStorage for sync later
            sessionStorage.setItem('lead-fname', firstName);
            sessionStorage.setItem('lead-lname', lastName);
            sessionStorage.setItem('lead-email', email);
            sessionStorage.setItem('lead-phone', phone);

            const mlsid = sessionStorage.getItem('lead-mlsid') || '';
            const address = sessionStorage.getItem('lead-address') || '';
            sessionStorage.setItem('lead-city', extractCityFromAddress(address));

            const { data, error } = await window.supabase.auth.signUp({
              email,
              password,
              options: {
                emailRedirectTo: null,
                data: { full_name: fullName }
              }
            });

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
            sessionStorage.setItem('leadCaptured', 'true');
            window.dispatchEvent(new CustomEvent('supabase:auth:login'));

            // ✅ Close modal and redirect
            modal.style.display = 'none';
            const viewed = JSON.parse(sessionStorage.getItem('viewedProperties') || '[]');
            const lastViewed = viewed[viewed.length - 1];
            if (lastViewed) {
              window.location.href = lastViewed;
            } else {
              window.location.reload();
            }
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
document.addEventListener("click", function (e) {
  const btn = e.target.closest("#logout-link"); // ✅ Match the HTML ID
  if (!btn) return;

  e.preventDefault();
  e.stopPropagation();

  window.supabase.auth.signOut().then(() => {
    console.log("✅ Logged out successfully");

    // 🧹 Clear session storage manually
    sessionStorage.clear();

    // 🔁 Redirect to homepage or reload
    window.location.href = '/';
  }).catch(err => {
    console.error("❌ Logout error", err);
    alert("Failed to log out. Please try again.");
  });
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

// LOGIN DISPLAY FOR LISTING PAGES
if (isListingPage()) {
  document.addEventListener("DOMContentLoaded", function () {
    const checkExist = setInterval(() => {
      const modal = document.getElementById("lead-form-modal");
      if (!modal || window.supabase === undefined) return;

      clearInterval(checkExist);

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
  let address = btn.dataset.address;

if (!address || address === 'Unknown Address') {
  address = sessionStorage.getItem('lead-address');
}

if (!address || address === 'Unknown Address') {
  // Final fallback — try extracting from slug or whatever else
  const slug = btn.closest('.listing-box')?.querySelector('a[href*="/property/"]')?.getAttribute('href') || '';
  address = extractAddressFromSlug(slug);
}

if (!address || address === 'Unknown Address') {
  address = 'Unknown Address';
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
// Top Spacer for Listing/Detail Pages
function isListingPage() {
  const path = window.location.pathname;
  return path.includes('/property/') || path.includes('/details.php');
}

function injectTopSpacer() {
  if (!isListingPage()) return;

  const existingSpacer = document.querySelector('#custom-top-spacer');
  if (existingSpacer) return;

  const spacer = document.createElement('div');
  spacer.id = 'custom-top-spacer';
  spacer.style.height = '60px';
  spacer.style.width = '100%';
  document.body.prepend(spacer);
}

// Run immediately
injectTopSpacer();


// ==========================
// 6. Save Button On Listing Page
// ==========================
function isListingPage() {
  const path = window.location.pathname;
  return path.includes('/property/') || path.includes('/details.php');
}

function extractMLSFromURL() {
  const path = window.location.pathname;
  const params = new URLSearchParams(window.location.search);
  let mls = '';
  let mlsid = '';

  if (path.includes('/property/')) {
    const slug = path.split('/property/')[1];
    const parts = slug.split('-');
    if (parts.length >= 3) {
      mls = parts[0];
      mlsid = parts[1];
    }
  } else if (path.includes('/details.php')) {
    mls = params.get('mls');
    mlsid = params.get('mlsid');
  }

  return { mls, mlsid };
}

function extractAddressFromDetailsPage() {
  const attributes = document.querySelectorAll('.listing-detail-attribute');

  for (const attr of attributes) {
    const keyEl = attr.querySelector('.key');
    const valueEl = attr.querySelector('.value');

    const key = keyEl?.textContent?.trim();
    const value = valueEl?.textContent?.trim();

    if (key === 'Address' && value) {
      // Remove leading/trailing quotes and excess whitespace
      const cleanedValue = value.replace(/['"]+/g, '').trim();
      console.log('✅ Extracted Address:', cleanedValue);
      return cleanedValue;
    }
  }

  console.log('❌ Could not find address');
  return 'Unknown Address';
}

function waitForSelector(selector, timeout = 5000) {
  return new Promise((resolve, reject) => {
    const interval = 100;
    const maxAttempts = timeout / interval;
    let attempts = 0;

    const check = () => {
      const el = document.querySelector(selector);
      if (el) return resolve(el);
      attempts++;
      if (attempts * interval >= timeout) return reject(null);
      setTimeout(check, interval);
    };

    check();
  });
}

function isListingPage() {
  const path = window.location.pathname;
  return path.includes('/property/') || path.includes('/details.php');
}

let hasInjectedSaveBtn = false; // ✅ Top-level flag

async function injectSaveButtonOnDetailPage() {
  if (!isListingPage() || hasInjectedSaveBtn) return;

  await new Promise(res => setTimeout(res, 500));
  const navList = await waitForSelector(
  '.col-sm-12.col-md-12.col-lg-3 .widget.hidden-sm-down .nav-style-primary'
  ).catch(() => null);

  if (!navList) {
    console.log('❌ Could not find nav list');
    return;
  }

  // ✅ Find the widget-nav li to insert after
  const widgetNavLi = navList.querySelector('li.widget-nav');
  if (!widgetNavLi) {
    console.log('❌ Could not find widget-nav item');
    return;
  }

  // ✅ Avoid duplicate insertion
  if (navList.querySelector('.custom-save-btn')) {
    console.log('⚠️ Save button already present');
    hasInjectedSaveBtn = true;
    return;
  }

  console.log('✅ Injecting Save Button after widget-nav');

  const newLi = document.createElement('li');
  newLi.className = 'nav-item';
  newLi.style.textAlign = 'left';

  
  const { mls, mlsid } = extractMLSFromURL(); // ✅ Reuse helper

  // ✅ Save address for Supabase (adjust selector as needed)
  const address = extractAddressFromDetailsPage();
  sessionStorage.setItem('lead-address', address); // Optional, for fallback


  const btn = document.createElement('a');
  btn.href = '#';
  btn.dataset.address = address;
  btn.className = 'custom-save-btn nav-link';
  btn.dataset.mls = mls;
  btn.dataset.mlsid = mlsid;
  btn.innerHTML = `<i class="fa fa-heart"></i> Save`;
  btn.style.display = 'block';

  newLi.appendChild(btn);
  widgetNavLi.insertAdjacentElement('afterend', newLi); // ✅ Insert right after widget-nav
  hasInjectedSaveBtn = true;

  console.log('✅ Save button injected below widget-nav');

  // 👇 Insert duplicate Save button into mobile-only nav (row.hidden-md-up)
  const mobileRow = document.querySelector('.row.hidden-md-up');
  if (mobileRow && !mobileRow.querySelector('.custom-save-btn-mobile')) {
  const mobileBtn = document.createElement('a');
  mobileBtn.href = '#';
  mobileBtn.className = 'custom-save-btn custom-save-btn-mobile nav-link';
  mobileBtn.dataset.mls = mls;
  mobileBtn.dataset.mlsid = mlsid;
  mobileBtn.dataset.address = address;
  mobileBtn.innerHTML = `<i class="fa fa-heart"></i> Save`;
  mobileBtn.style.display = 'block';

  const li = document.createElement('li');
  li.className = 'nav-item';
  li.style.textAlign = 'left';
  li.appendChild(mobileBtn);

  // Create mobile-style nav container if needed
  let mobileNav = mobileRow.querySelector('.nav-style-primary');
  if (!mobileNav) {
    const ul = document.createElement('ul');
    ul.className = 'nav nav-stacked nav-style-primary';
    mobileNav = ul;
    mobileRow.appendChild(ul);
  }

  const mobileWidgetNavLi = mobileNav.querySelector('li.widget-nav');
    if (mobileWidgetNavLi) {
    mobileWidgetNavLi.insertAdjacentElement('afterend', li);
    } else {
    mobileNav.appendChild(li); // fallback if widget-nav not found
    }
  }

}

// Initial injection
injectSaveButtonOnDetailPage();
highlightSavedListings();

// Also observe DOM changes in case content loads after delay
if (isListingPage()) {
  const observer = new MutationObserver(() => {
    const now = Date.now();
    if (!window.__lastSaveBtnRun || now - window.__lastSaveBtnRun > 1000) {
      window.__lastSaveBtnRun = now;
      injectSaveButtonOnDetailPage();
      highlightSavedListings();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}












// Hide only .saveListing buttons inside the nav on detail pages
function hideSystemSaveButtonsOnDetailPage() {
  const path = window.location.pathname;
  const isDetailPage = path.includes('/property/') || path.includes('/details.php');

  if (!isDetailPage) return;

  document.querySelectorAll('.saveListing').forEach(el => {
    el.style.setProperty('display', 'none', 'important');
  });
}

// Run after your button injection
setTimeout(hideSystemSaveButtonsOnDetailPage, 1000);


// Recheck every 1.5 seconds for dynamically loaded elements
const intervalId = setInterval(() => {
  document.querySelectorAll('.saveListing').forEach(el => {
    el.style.setProperty('display', 'none', 'important');
  });
}, 1500);

// Optional: Stop checking after 30 seconds
setTimeout(() => clearInterval(intervalId), 30000);

// ==========================
// Modify Listing Page Nav Links (Targeting Visible Only)
// ==========================
if (isListingPage()) {
  const navEditInterval = setInterval(() => {
    const navSelectors = [
      '.col-sm-12.col-md-12.col-lg-3 .widget.hidden-sm-down .nav-style-primary', // Desktop
      '.row.hidden-md-up .nav-style-primary' // Mobile
    ];

    navSelectors.forEach(selector => {
      const navList = document.querySelector(selector);
      if (!navList) return;

      // Hide unwanted links
      navList.querySelectorAll('a.nav-link').forEach(link => {
        const text = link.textContent?.trim()?.toLowerCase();
        if (
          text.includes('property email alerts') ||
          text.includes('print flyer') ||
          text.includes('chat with us now')
        ) {
          link.closest('.nav-item')?.style.setProperty('display', 'none', 'important');
        }
      });

      // Replace "Ask agent a question"
      const askLink = navList.querySelector('a.ask-question.nav-link');
      if (askLink && !askLink.dataset.customHandled) {
        const newLink = askLink.cloneNode(true);
        newLink.href = '/pages/contact';
        newLink.removeAttribute('onclick');
        newLink.dataset.customHandled = 'true';
        newLink.addEventListener('click', e => {
          e.preventDefault();
          window.open('/pages/contact', '_blank');
        });
        askLink.replaceWith(newLink);
      }

      // Replace "Request Showing"
      const showLink = navList.querySelector('a.showing-request.nav-link');
      if (showLink && !showLink.dataset.customHandled) {
        const newLink = showLink.cloneNode(true);
        newLink.href = 'https://calendly.com/keegan-ryan-exprealty/schedule-a-consultation';
        newLink.removeAttribute('onclick');
        newLink.dataset.customHandled = 'true';
        newLink.addEventListener('click', e => {
          e.preventDefault();
          window.open(newLink.href, '_blank');
        });
        showLink.replaceWith(newLink);
      }
    });
  }, 1000);

  // ✅ Stop checking after 30 seconds
  setTimeout(() => clearInterval(navEditInterval), 30000);
}




// Ensure View Details buttons get intercepted
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setupViewDetailsInterception();
  });
} else {
  setupViewDetailsInterception();
}
