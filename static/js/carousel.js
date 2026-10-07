/**
 * Desert Glassmorphism - 3D Hero Carousel / Stage Manager
 * Controls left, center, right 3D positioning, keyboard navigation,
 * touch gestures, and interactive switches.
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

  function initHeroCarousel() {
    const track = document.querySelector('.hero-carousel-track');
    const cards = Array.from(document.querySelectorAll('.hero-stage-card'));
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    const prevBtn = document.getElementById('heroPrevBtn');
    const nextBtn = document.getElementById('heroNextBtn');

    if (!track || cards.length === 0) return;

    let activeIndex = 1; // Default to Center card (index 1: Ajay Bobade profile)
    const totalCards = cards.length;

    function updateCarousel(newIndex) {
      activeIndex = (newIndex + totalCards) % totalCards;

      cards.forEach((card, index) => {
        // Calculate relative position (-1: left, 0: center, 1: right)
        const diff = (index - activeIndex + totalCards) % totalCards;

        if (diff === 0) {
          card.setAttribute('data-card-pos', 'center');
          card.setAttribute('aria-hidden', 'false');
          card.tabIndex = 0;
        } else if (diff === 1) {
          card.setAttribute('data-card-pos', 'right');
          card.setAttribute('aria-hidden', 'false');
          card.tabIndex = 0;
        } else if (diff === 2 || diff === totalCards - 1) {
          card.setAttribute('data-card-pos', 'left');
          card.setAttribute('aria-hidden', 'false');
          card.tabIndex = 0;
        } else {
          card.setAttribute('data-card-pos', 'hidden');
          card.setAttribute('aria-hidden', 'true');
          card.tabIndex = -1;
        }
      });

      // Update dot indicators
      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeIndex);
        dot.setAttribute('aria-selected', index === activeIndex ? 'true' : 'false');
      });
    }

    // Click on side cards shifts that card to center
    cards.forEach((card, index) => {
      card.addEventListener('click', (e) => {
        // If clicking an interactive button or link inside, don't hijack
        if (e.target.closest('a') || e.target.closest('button')) {
          if (!e.target.closest('.side-card-badge')) {
            return;
          }
        }
        if (activeIndex !== index) {
          updateCarousel(index);
        }
      });

      // Keyboard accessibility on card focus
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          if (activeIndex !== index) {
            e.preventDefault();
            updateCarousel(index);
          }
        }
      });
    });

    // Arrow controls
    if (prevBtn) {
      prevBtn.addEventListener('click', () => updateCarousel(activeIndex - 1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => updateCarousel(activeIndex + 1));
    }

    // Dots navigation
    dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const targetIdx = parseInt(dot.getAttribute('data-index'), 10);
        if (!isNaN(targetIdx)) {
          updateCarousel(targetIdx);
        }
      });
    });

    // Global keyboard arrow navigation when carousel in view
    window.addEventListener('keydown', (e) => {
      if (document.activeElement && (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA')) {
        return;
      }
      if (e.key === 'ArrowLeft') {
        updateCarousel(activeIndex - 1);
      } else if (e.key === 'ArrowRight') {
        updateCarousel(activeIndex + 1);
      }
    });

    // Touch Swipe Gestures
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance > 0) {
          updateCarousel(activeIndex - 1); // Swiped right -> go to left card
        } else {
          updateCarousel(activeIndex + 1); // Swiped left -> go to right card
        }
      }
    }

    // Initialize layout
    updateCarousel(activeIndex);
  }

  onReady(initHeroCarousel);
})();
