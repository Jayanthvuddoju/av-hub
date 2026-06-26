import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  initGlobalNavigation();
  initHomeTabs();
  initResourcesFilter();
  initRegisterModal();
  initFormSubmissions();
});

/* --- Global Navigation Logic --- */
function initGlobalNavigation() {
  const header = document.querySelector('.royal-header');
  const hamburger = document.querySelector('.hamburger');
  const navLinksContainer = document.querySelector('.nav-links');

  // Sticky header scroll class
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    });
  }

  // Hamburger toggle
  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinksContainer.classList.toggle('active');
    });

    // Close menu when clicking links
    const links = navLinksContainer.querySelectorAll('.nav-link');
    links.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinksContainer.classList.remove('active');
      });
    });
  }

  // Highlight active page link
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  let matched = false;

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      const isHome = href === '/' || href === 'index.html';
      const pathEndsWithHref = currentPath.endsWith(href);
      const isCurrentHome = currentPath === '/' || currentPath.endsWith('index.html') || currentPath === '';

      if ((isHome && isCurrentHome) || (!isHome && pathEndsWithHref && href !== 'index.html')) {
        link.classList.add('active');
        matched = true;
      } else {
        link.classList.remove('active');
      }
    }
  });

  // Fallback default if no match
  if (!matched && navLinks.length > 0) {
    const isHome = currentPath === '/' || currentPath === '' || currentPath.includes('index.html');
    if (isHome) {
      const homeLink = Array.from(navLinks).find(l => l.getAttribute('href') === 'index.html' || l.getAttribute('href') === '/');
      if (homeLink) homeLink.classList.add('active');
    }
  }
}

/* --- Home / Who We Serve Tabs --- */
function initHomeTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  if (tabButtons.length > 0 && tabContents.length > 0) {
    tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTabId = btn.getAttribute('data-tab');

        // Remove active state from other buttons
        tabButtons.forEach(b => b.classList.remove('active'));
        // Hide other tab contents
        tabContents.forEach(c => c.classList.remove('active'));

        // Activate selected
        btn.classList.add('active');
        const targetContent = document.getElementById(targetTabId);
        if (targetContent) {
          targetContent.classList.add('active');
        }
      });
    });
  }
}

/* --- Resources Filtering and Search --- */
function initResourcesFilter() {
  const searchInput = document.getElementById('resource-search');
  const filterPills = document.querySelectorAll('.filter-pill');
  const resourceCards = document.querySelectorAll('.resource-card-container');

  if (!resourceCards.length) return;

  let activeCategory = 'all';
  let searchQuery = '';

  function filterResources() {
    resourceCards.forEach(container => {
      const card = container.querySelector('.resource-card');
      if (!card) return;

      const category = card.getAttribute('data-category');
      const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
      const desc = card.querySelector('.card-desc')?.textContent.toLowerCase() || '';
      
      const matchesCategory = activeCategory === 'all' || category === activeCategory;
      const matchesSearch = title.includes(searchQuery) || desc.includes(searchQuery);

      if (matchesCategory && matchesSearch) {
        container.style.display = 'block';
      } else {
        container.style.display = 'none';
      }
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      filterResources();
    });
  }

  if (filterPills.length > 0) {
    filterPills.forEach(pill => {
      pill.addEventListener('click', () => {
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
        activeCategory = pill.getAttribute('data-filter');
        filterResources();
      });
    });
  }
}

/* --- Modal Handler for Event Registrations --- */
function initRegisterModal() {
  const openModalButtons = document.querySelectorAll('.btn-register-event');
  const modalOverlay = document.getElementById('register-modal');
  const closeModalButton = document.querySelector('.modal-close');
  const eventNameField = document.getElementById('modal-event-name');
  const eventTitleDisplay = document.getElementById('modal-event-display');

  if (!modalOverlay) return;

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const eventName = btn.getAttribute('data-event');
      if (eventNameField) {
        eventNameField.value = eventName || '';
      }
      if (eventTitleDisplay) {
        eventTitleDisplay.textContent = eventName || 'Selected Event';
      }
      modalOverlay.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scrolling
    });
  });

  const closeModal = () => {
    modalOverlay.classList.remove('active');
    document.body.style.overflow = ''; // Restore scroll
    // Reset form states inside modal
    const form = modalOverlay.querySelector('form');
    if (form) {
      form.style.display = 'block';
      const successMsg = modalOverlay.querySelector('.form-success-container');
      if (successMsg) successMsg.classList.remove('active');
      form.reset();
    }
  };

  if (closeModalButton) {
    closeModalButton.addEventListener('click', closeModal);
  }

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      closeModal();
    }
  });
}

/* --- Royal Form Submissions (Simulated) --- */
function initFormSubmissions() {
  const forms = document.querySelectorAll('.royal-form');

  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      // Simple validation
      const requiredInputs = form.querySelectorAll('[required]');
      let allValid = true;
      
      requiredInputs.forEach(input => {
        if (!input.value.trim()) {
          input.style.borderColor = 'red';
          allValid = false;
        } else {
          input.style.borderColor = '';
        }
      });

      if (!allValid) return;

      // Submit animation state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn ? submitBtn.textContent : 'Submit';
      
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Processing...';
      }

      // Simulate network request
      setTimeout(() => {
        // Reset submit button state
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }

        // Hide form and show success container
        form.style.display = 'none';
        const parent = form.parentElement;
        const successContainer = parent.querySelector('.form-success-container');
        if (successContainer) {
          successContainer.classList.add('active');
          
          // Custom text if it is dynamic
          const userName = form.querySelector('[name="name"]')?.value || 'Leader';
          const successTitle = successContainer.querySelector('.success-title');
          if (successTitle && successTitle.getAttribute('data-template')) {
            successTitle.textContent = successTitle.getAttribute('data-template').replace('{name}', userName);
          }
        }
      }, 1200);
    });
  });
}
