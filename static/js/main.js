/**
 * Desert Glassmorphism - Main Application Script
 * Orchestrates navigation, project toggles, contact form submission, and Lucide icons.
 */

(function () {
  'use strict';

  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  // 1. Initialize Lucide Icons
  function initIcons() {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  }

  // 2. Active Section Highlighting in Floating Pill Navbar (IntersectionObserver)
  function initActiveNavHighlight() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    if (sections.length === 0 || navLinks.length === 0) return;

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              const href = link.getAttribute('href');
              if (href && href.startsWith('#')) {
                if (href === `#${currentId}`) {
                  link.classList.add('active');
                  link.setAttribute('aria-current', 'page');
                } else {
                  link.classList.remove('active');
                  link.removeAttribute('aria-current');
                }
              }
            });
          }
        });
      }, {
        threshold: 0.25,
        rootMargin: '-5% 0px -35% 0px'
      });

      sections.forEach((sec) => observer.observe(sec));
    }
  }

  // 3. Project Card: Overview | Technical Pill Toggle Switch
  function initProjectToggles() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach((card) => {
      const toggleButtons = card.querySelectorAll('.pill-toggle-btn');
      const overviewText = card.querySelector('.text-overview');
      const technicalText = card.querySelector('.text-technical');

      if (!overviewText || !technicalText || toggleButtons.length === 0) return;

      toggleButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const mode = btn.getAttribute('data-toggle-mode');

          toggleButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          if (mode === 'technical') {
            overviewText.style.display = 'none';
            technicalText.style.display = 'block';
          } else {
            overviewText.style.display = 'block';
            technicalText.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Contact Form Transmission Submission (AJAX to /api/contact)
  function initContactForm() {
    const form = document.getElementById('contactTransmissionForm');
    const submitBtn = document.getElementById('contactSubmitBtn');
    const statusBox = document.getElementById('contactFormStatus');

    if (!form || !submitBtn) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contactName');
      const emailInput = document.getElementById('contactEmail');
      const messageInput = document.getElementById('contactMessage');

      const payload = {
        name: nameInput ? nameInput.value.trim() : '',
        email: emailInput ? emailInput.value.trim() : '',
        message: messageInput ? messageInput.value.trim() : ''
      };

      if (!payload.name || !payload.message) {
        if (statusBox) {
          statusBox.textContent = 'Please fill out your name and transmission message.';
          statusBox.style.color = '#f87171';
        }
        return;
      }

      // UI state: Sending...
      const originalBtnHTML = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <i data-lucide="loader-2" class="animate-spin" style="width: 18px; height: 18px;"></i>
        <span>TRANSMITTING...</span>
      `;
      initIcons();

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok && result.status === 'success') {
          // Success State
          submitBtn.classList.add('btn-success');
          submitBtn.innerHTML = `
            <i data-lucide="check" style="width: 18px; height: 18px;"></i>
            <span>TRANSMISSION SENT!</span>
          `;
          initIcons();

          if (statusBox) {
            statusBox.textContent = result.message || 'Message successfully delivered to Ajay Dilip Bobade.';
            statusBox.style.color = '#4ade80';
          }

          form.reset();

          setTimeout(() => {
            submitBtn.classList.remove('btn-success');
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHTML;
            initIcons();
            if (statusBox) statusBox.textContent = '';
          }, 4500);

        } else {
          throw new Error(result.message || 'Server returned an error.');
        }

      } catch (err) {
        console.error('Contact transmission error:', err);
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnHTML;
        initIcons();

        if (statusBox) {
          statusBox.textContent = 'Transmission failed to connect. Please reach out directly to bobadeajay0808@gmail.com.';
          statusBox.style.color = '#f87171';
        }
      }
    });
  }

  // 5. Back to Top Smooth Scroll
  function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
      backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // 6. Social Links Normalization & Reliable External Opening
  function initSocialLinks() {
    const links = document.querySelectorAll('.social-icon-btn, a[href*="linkedin"], a[href*="github"], a[href*="gmail"]');
    links.forEach((link) => {
      let href = (link.getAttribute('href') || '').trim();
      if (!href) return;

      // Handle email
      if (href.includes('@') && !href.startsWith('mailto:') && !href.startsWith('http')) {
        href = `mailto:${href}`;
        link.setAttribute('href', href);
      } else if (href.startsWith('www.') || href.startsWith('linkedin.com') || href.startsWith('github.com')) {
        href = `https://${href}`;
        link.setAttribute('href', href);
      }

      if (!href.startsWith('mailto:')) {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
      }
    });
  }

  onReady(() => {
    initIcons();
    initActiveNavHighlight();
    initProjectToggles();
    initContactForm();
    initBackToTop();
    initSocialLinks();
  });

  // 7. Global Click Interceptor: Catches and repairs any protocol-less external links
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link) return;

    let href = (link.getAttribute('href') || '').trim();
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    // Handle email addresses missing mailto:
    if (href.includes('@') && !href.startsWith('mailto:') && !href.startsWith('http')) {
      e.preventDefault();
      window.location.href = `mailto:${href}`;
      return;
    }

    // Handle website addresses missing https://
    if (href.startsWith('www.') || href.startsWith('linkedin.com') || href.startsWith('github.com')) {
      e.preventDefault();
      window.open(`https://${href}`, '_blank', 'noopener,noreferrer');
      return;
    }
  }, true);

  window.addEventListener('load', initIcons);
})();
