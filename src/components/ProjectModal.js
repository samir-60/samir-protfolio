import { soundEngine } from './SoundEngine.js';

export class ProjectModal {
  constructor(modalId, backdropId, contentId) {
    this.modal = document.getElementById(modalId);
    this.backdrop = document.getElementById(backdropId);
    this.content = document.getElementById(contentId);
    this.closeBtn = this.modal ? this.modal.querySelector('.modal-close-btn') : null;

    if (this.modal) {
      this.init();
    }
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen()) {
        this.close();
      }
    });
  }

  isOpen() {
    return this.modal && this.modal.classList.contains('active');
  }

  open(project) {
    if (!this.modal || !this.content) return;
    soundEngine.playModalOpen();

    this.content.innerHTML = `
      <div class="project-modal-header">
        <div class="project-badge" style="background: ${project.color}22; color: ${project.color}; border: 1px solid ${project.color}55;">
          ${project.badge || 'Featured Innovation'}
        </div>
        <h2 class="project-modal-title">${project.title}</h2>
        <p class="project-modal-subtitle">${project.subtitle}</p>
      </div>

      <div class="project-modal-hero-img-wrap">
        <img src="${project.image}" alt="${project.title}" class="project-modal-img" loading="lazy" />
        <div class="img-gradient-overlay"></div>
      </div>

      <div class="project-modal-body">
        <div class="project-modal-section">
          <h3>Overview</h3>
          <p>${project.fullDescription}</p>
        </div>

        <div class="project-modal-section">
          <h3>Key Engineering Highlights</h3>
          <ul class="modal-highlights-list">
            ${project.highlights.map(h => `<li><span class="bullet" style="color: ${project.color}">▹</span> ${h}</li>`).join('')}
          </ul>
        </div>

        <div class="project-modal-section">
          <h3>Architecture & Tech Stack</h3>
          <div class="modal-tags-wrap">
            ${project.tags.map(tag => `<span class="tech-tag">${tag}</span>`).join('')}
          </div>
        </div>

        <div class="project-modal-stats-grid">
          ${Object.entries(project.stats || {}).map(([key, value]) => `
            <div class="modal-stat-box">
              <span class="stat-key">${key.toUpperCase()}</span>
              <span class="stat-val" style="color: ${project.color}">${value}</span>
            </div>
          `).join('')}
        </div>

        <div class="project-modal-actions">
          <a href="${project.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary modal-action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path><path d="M9 18c-4.51 2-5-2-7-2"></path></svg>
            View Repository
          </a>
          <a href="${project.liveUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary modal-action-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            Explore Live Platform
          </a>
        </div>
      </div>
    `;

    document.body.classList.add('modal-locked');
    this.modal.classList.add('active');
  }

  close() {
    if (!this.modal) return;
    soundEngine.playClick();
    this.modal.classList.remove('active');
    document.body.classList.remove('modal-locked');
  }
}
