  function fullyRemoveModal() {
    // Remove the login modal if injected
    const modal = document.getElementById('login_modal');
    if (modal) modal.remove();

    // Remove modal backdrop if it appears
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) backdrop.remove();

    // Restore body class and overflow
    const body = document.getElementById('listing-bodycontent');
    if (body && body.classList.contains('modal_open')) {
      body.classList.remove('modal_open');
      body.classList.add('inner'); // Ensure 'inner' stays
      body.style.overflow = 'auto';
      console.log("🔓 Modal lock removed from body");
    }
  }

  // Run once on page load
  window.addEventListener('DOMContentLoaded', fullyRemoveModal);

  // Watch for any future injection attempts
  const observer = new MutationObserver(fullyRemoveModal);
  observer.observe(document.body, {
    childList: true,
    attributes: true,
    attributeFilter: ['class'],
    subtree: true
  });
