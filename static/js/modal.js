/**
 * Desert Glassmorphism - Project Case Study Modal Controller
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

  function initProjectModal() {
    const backdrop = document.getElementById('projectModalBackdrop');
    if (!backdrop) return;

    const closeBtn = document.getElementById('modalCloseBtn');
    const modalTag = document.getElementById('modalProjectTag');
    const modalTitle = document.getElementById('modalProjectTitle');
    const modalDescription = document.getElementById('modalProjectDescription');
    const modalMetrics = document.getElementById('modalMetricsContainer');
    const modalOutcomes = document.getElementById('modalOutcomesList');
    const modalTech = document.getElementById('modalTechStack');

    // Build projects lookup map
    const projectsMap = {};
    const dataScript = document.getElementById('portfolio-projects-data');
    if (dataScript) {
      try {
        const projectsList = JSON.parse(dataScript.textContent);
        if (Array.isArray(projectsList)) {
          projectsList.forEach(p => {
            projectsMap[p.id] = p;
          });
        }
      } catch (e) {
        console.warn('Error reading portfolio projects data:', e);
      }
    }

    let previousActiveElement = null;

    function openModal(data) {
      if (!data) return;
      previousActiveElement = document.activeElement;

      // Populate Tag
      if (modalTag) {
        modalTag.textContent = data.tag || 'CASE STUDY';
      }

      // Populate Title
      if (modalTitle) {
        modalTitle.textContent = data.title || 'Project Details';
      }

      // Populate Description
      if (modalDescription) {
        modalDescription.textContent = data.full_details || data.fullDetails || data.summary || '';
      }

      // Populate Metrics
      if (modalMetrics) {
        const metrics = data.metrics || [];
        if (Array.isArray(metrics) && metrics.length > 0) {
          modalMetrics.innerHTML = metrics.map(m => `
            <div class="modal-metric-card">
              <span class="modal-metric-value">${m.value || ''}</span>
              <span class="modal-metric-label">${m.label || ''}</span>
            </div>
          `).join('');
          modalMetrics.parentElement.style.display = 'block';
        } else {
          modalMetrics.parentElement.style.display = 'none';
        }
      }

      // Populate Outcomes
      if (modalOutcomes) {
        const outcomes = data.key_outcomes || data.outcomes || data.keyOutcomes || [];
        if (Array.isArray(outcomes) && outcomes.length > 0) {
          modalOutcomes.innerHTML = outcomes.map(item => `
            <li style="display: flex; gap: 0.75rem; align-items: flex-start; margin-bottom: 0.6rem; color: rgba(245, 235, 224, 0.9);">
              <i data-lucide="check-circle" style="color: #a3e635; width: 18px; height: 18px; flex-shrink: 0; margin-top: 3px;"></i>
              <span>${item}</span>
            </li>
          `).join('');
          modalOutcomes.parentElement.style.display = 'block';
        } else {
          modalOutcomes.parentElement.style.display = 'none';
        }
      }

      // Populate Tech Stack Chips
      if (modalTech) {
        const techList = data.tech || [];
        if (Array.isArray(techList) && techList.length > 0) {
          modalTech.innerHTML = techList.map(t => `
            <span class="tech-chip">${t}</span>
          `).join('');
          modalTech.parentElement.style.display = 'block';
        } else {
          modalTech.parentElement.style.display = 'none';
        }
      }

      backdrop.classList.add('open');
      document.body.style.overflow = 'hidden';

      // Re-initialize Lucide icons in modal
      if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
      }

      if (closeBtn) {
        closeBtn.focus();
      }
    }

    function closeModal() {
      backdrop.classList.remove('open');
      document.body.style.overflow = '';
      if (previousActiveElement) {
        previousActiveElement.focus();
      }
    }

    // Event Delegation: Catches clicks on the button, SVG icon, or path inside
    document.addEventListener('click', (e) => {
      const triggerBtn = e.target.closest('.project-modal-trigger');
      if (!triggerBtn) return;

      e.preventDefault();

      // Method 1: Check inline data-project attribute
      const rawData = triggerBtn.getAttribute('data-project');
      if (rawData) {
        try {
          const data = JSON.parse(rawData);
          if (data) {
            openModal(data);
            return;
          }
        } catch (err) {
          console.error('Error parsing data-project attribute:', err);
        }
      }

      // Method 2: Check data-project-id against projectsMap
      const projId = triggerBtn.getAttribute('data-project-id');
      if (projId && projectsMap[projId]) {
        openModal(projectsMap[projId]);
        return;
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    // Backdrop click to close
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeModal();
      }
    });

    // Escape key to close
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && backdrop.classList.contains('open')) {
        closeModal();
      }
    });
  }

  onReady(initProjectModal);
})();
