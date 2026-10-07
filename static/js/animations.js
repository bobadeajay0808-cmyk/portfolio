/**
 * Desert Glassmorphism - Animations, Cursor & 3D Tilt Dynamics
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

  // 1. Custom Cursor Tracking with Lagging Ring
  function initCustomCursor() {
    const dot = document.querySelector('.custom-cursor-dot');
    const ring = document.querySelector('.custom-cursor-ring');

    if (!dot || !ring) return;

    // Check for touch / pointer coarse
    if (window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;
    });

    // Smooth lerp for lagging ring
    function renderRing() {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(renderRing);
    }
    requestAnimationFrame(renderRing);

    // Hover scale state on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .glass-card, .side-card-badge');
    interactiveElements.forEach((el) => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // 2. Scroll Progress Bar
  function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      progressBar.style.width = `${progress}%`;
    }, { passive: true });
  }

  // 3. Scroll Reveal Observer (Ensures elements are immediately visible)
  function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal');
    if (reveals.length === 0) return;

    // Ensure all sections are active and visible
    reveals.forEach((el) => el.classList.add('active'));

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('active');
          }
        });
      }, {
        threshold: 0.05
      });

      reveals.forEach((el) => observer.observe(el));
    }
  }

  // 4. Subtle 3D Card Tilt that Follows the Mouse
  function initCardTilt() {
    if (window.matchMedia && (window.matchMedia('(pointer: coarse)').matches || window.matchMedia('(prefers-reduced-motion: reduce)').matches)) {
      return;
    }

    const cards = document.querySelectorAll('.glass-card:not(.hero-stage-card)');

    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = -((cardY - centerY) / centerY) * 6;
        const rotateY = ((cardX - centerX) / centerX) * 6;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // 5. Count-Up Stats Animation
  function initCountUpStats() {
    const statElements = document.querySelectorAll('[data-counter-target]');
    if (statElements.length === 0) return;

    let hasRun = false;
    const statsContainer = document.querySelector('.stats-counter-row');
    if (!statsContainer) return;

    function runCounter() {
      if (hasRun) return;
      hasRun = true;
      statElements.forEach((el) => {
        const rawTarget = el.getAttribute('data-counter-target');
        if (!rawTarget) return;
        const isDecimal = rawTarget.includes('.');
        const targetVal = parseFloat(rawTarget);
        const duration = 1800;
        const startTime = performance.now();

        function updateCounter(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const easeProgress = 1 - Math.pow(1 - progress, 3);
          const currentVal = targetVal * easeProgress;

          if (isDecimal) {
            el.textContent = currentVal.toFixed(2);
          } else {
            el.textContent = Math.floor(currentVal).toString();
          }

          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            el.textContent = rawTarget;
          }
        }

        requestAnimationFrame(updateCounter);
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            runCounter();
            observer.disconnect();
          }
        });
      }, { threshold: 0.2 });

      observer.observe(statsContainer);
    } else {
      runCounter();
    }
  }

  // 6. Skill Progress Bars Animation
  function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress-fill');
    if (skillBars.length === 0) return;

    function activateBars() {
      skillBars.forEach((bar) => {
        const targetLevel = bar.getAttribute('data-level') || '0';
        bar.style.width = `${targetLevel}%`;
      });
    }

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const targetLevel = bar.getAttribute('data-level') || '0';
            bar.style.width = `${targetLevel}%`;
            observer.unobserve(bar);
          }
        });
      }, { threshold: 0.1 });

      skillBars.forEach((bar) => observer.observe(bar));
    } else {
      activateBars();
    }
  }

  onReady(() => {
    initCustomCursor();
    initScrollProgress();
    initScrollReveal();
    initCardTilt();
    initCountUpStats();
    initSkillBars();
  });
})();
