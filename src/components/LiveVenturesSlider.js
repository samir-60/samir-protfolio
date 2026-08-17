import { soundEngine } from './SoundEngine.js';

export class LiveVenturesSlider {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.currentSlide = 0;
    this.totalSlides = 3;
    this.autoPlayInterval = null;
    this.isPaused = false;
    this.touchStartX = 0;
    this.touchEndX = 0;

    this.slidesData = [
      {
        id: 'softyx',
        status: 'LIVE PRODUCTION STORE',
        domain: 'softyx.shop',
        domainUrl: 'https://softyx.shop',
        githubUrl: 'https://github.com/samir-60/Softyx-Clothing',
        title: 'SOFTYX CLOTHING',
        tagline: 'Flagship E-Commerce Fashion Platform & Virtual Try-On Engine',
        description: 'Engineered for high-volume commercial scale in Bangladesh with real-time body dimension scanning, interactive 3D virtual fitting drape geometry, sub-second catalog search, and secure payment checkout.',
        telemetry: [
          { label: 'ARCHITECTURE', value: 'TypeScript / React / Node' },
          { label: 'CAPABILITIES', value: '3D Virtual Try-On • Body Scanner' },
          { label: 'AVAILABILITY', value: 'Live 24/7 Global Production' },
          { label: 'PERFORMANCE', value: 'Sub-second Load Time' }
        ],
        tags: ['softyx.shop', 'Virtual Try-On', 'Body Scanner', 'TypeScript', 'E-Commerce', 'Active Platform']
      },
      {
        id: 'profix',
        status: 'UK LIVE COMMERCIAL WEB',
        domain: 'profixandshine.co.uk',
        domainUrl: 'https://profixandshine.co.uk',
        githubUrl: 'https://github.com/samir-60/Profix-shine-uk',
        title: 'PROFIX & SHINE UK',
        tagline: 'Commercial & Residential Cleaning Services Platform Operating in the UK',
        description: 'Bespoke web infrastructure designed for the United Kingdom cleaning sector, featuring instant automated quotation calculators, customer booking funnels, and mobile-first 99+ Google Lighthouse optimization.',
        telemetry: [
          { label: 'MARKET REGION', value: 'United Kingdom (UK)' },
          { label: 'WORKFLOWS', value: 'Instant Quote Engine • Booking Funnel' },
          { label: 'LIGHTHOUSE', value: '99+ Performance & SEO Score' },
          { label: 'CLIENT CONVERSION', value: 'Optimized Mobile UI/UX' }
        ],
        tags: ['profixandshine.co.uk', 'United Kingdom', 'Instant Quotation', 'Booking System', '99+ Lighthouse', 'Commercial']
      },
      {
        id: 'fraud-radar',
        status: 'CYBER DEFENSE CORE',
        domain: 'github.com/samir-60',
        domainUrl: 'https://github.com/samir-60/Softyx-Clothing',
        githubUrl: 'https://github.com/samir-60/Softyx-Clothing',
        title: 'SOFTYX FRAUD RADAR',
        tagline: 'Heuristic E-Commerce Risk Scoring & Velocity Defense Algorithm',
        description: 'Handcrafted cybersecurity analysis engine engineered to analyze customer checkout telemetry, IP velocity patterns, device fingerprinting, and risk scoring to prevent merchant chargebacks.',
        telemetry: [
          { label: 'CORE PROTOCOL', value: 'Heuristic Velocity Math' },
          { label: 'DETECTION SPEED', value: '12ms Real-time Decisioning' },
          { label: 'SECURITY DOMAIN', value: 'Cybersecurity & Anti-Fraud' },
          { label: 'MERCHANT SAFETY', value: 'Chargeback & Bot Shield' }
        ],
        tags: ['Cybersecurity', 'Fraud Scoring', 'Risk Analysis', 'TypeScript', 'Heuristic Defense']
      }
    ];

    this.render();
    this.bindEvents();
    this.startAutoPlay();
  }

  render() {
    this.container.innerHTML = `
      <div class="masculine-slider-card">
        <!-- Top HUD Header -->
        <div class="masculine-slider-hud">
          <div class="slider-hud-left">
            <span class="hud-radar-dot"></span>
            <span class="hud-title">LIVE PRODUCTION WORKPLACES &amp; COMMERCIAL PLATFORMS</span>
          </div>
          
          <div class="slider-hud-controls">
            <span class="slider-counter" id="sliderCounter">01 / 03</span>
            <div class="slider-nav-btns">
              <button class="slider-btn" id="sliderPrevBtn" aria-label="Previous Slide" title="Previous Slide">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                PREV
              </button>
              <button class="slider-btn" id="sliderNextBtn" aria-label="Next Slide" title="Next Slide">
                NEXT
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Slider Track Container -->
        <div class="masculine-slider-viewport" id="sliderViewport">
          <div class="masculine-slider-track" id="sliderTrack">
            ${this.slidesData.map((slide, index) => this.renderSlideHTML(slide, index)).join('')}
          </div>
        </div>

        <!-- Bottom Tabs / Segment Pagination -->
        <div class="masculine-slider-tabs">
          ${this.slidesData.map((slide, index) => `
            <button class="slider-tab-segment ${index === 0 ? 'active' : ''}" data-slide-to="${index}">
              <span class="segment-num">0${index + 1}</span>
              <span class="segment-title">${slide.title}</span>
              <div class="segment-progress"></div>
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  renderSlideHTML(slide, index) {
    return `
      <div class="masculine-slide ${index === 0 ? 'active' : ''}" data-slide-index="${index}">
        <div class="slide-inner">
          <!-- Top Meta Bar -->
          <div class="slide-meta-bar">
            <div class="slide-badge">
              <span class="hud-radar-dot green"></span>
              <span>${slide.status}</span>
            </div>
            <a href="${slide.domainUrl}" target="_blank" rel="noopener noreferrer" class="slide-domain-link">
              ${slide.domain} ↗
            </a>
          </div>

          <!-- Main Content -->
          <div class="slide-body">
            <h3 class="slide-title">${slide.title}</h3>
            <p class="slide-tagline">${slide.tagline}</p>
            <p class="slide-desc">${slide.description}</p>

            <!-- Specs Grid (Masculine Telemetry Chips) -->
            <div class="slide-telemetry-grid">
              ${slide.telemetry.map(t => `
                <div class="telemetry-chip">
                  <span class="telemetry-label">${t.label}</span>
                  <span class="telemetry-value">${t.value}</span>
                </div>
              `).join('')}
            </div>

            <!-- Tags -->
            <div class="slide-tags">
              ${slide.tags.map(tag => `<span class="slide-tag">${tag}</span>`).join('')}
            </div>

            <!-- Action Buttons -->
            <div class="slide-actions">
              <a href="${slide.domainUrl}" target="_blank" rel="noopener noreferrer" class="btn-masculine-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                LAUNCH ${slide.domain.toUpperCase()}
              </a>
              <a href="${slide.githubUrl}" target="_blank" rel="noopener noreferrer" class="btn-masculine-secondary">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>
                VIEW GITHUB REPO
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  bindEvents() {
    const prevBtn = this.container.querySelector('#sliderPrevBtn');
    const nextBtn = this.container.querySelector('#sliderNextBtn');
    const tabSegments = this.container.querySelectorAll('.slider-tab-segment');
    const card = this.container.querySelector('.masculine-slider-card');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.goToSlide(this.currentSlide - 1);
        soundEngine.playClick();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.goToSlide(this.currentSlide + 1);
        soundEngine.playClick();
      });
    }

    tabSegments.forEach(seg => {
      seg.addEventListener('click', () => {
        const slideIndex = parseInt(seg.getAttribute('data-slide-to'), 10);
        this.goToSlide(slideIndex);
        soundEngine.playClick();
      });
    });

    // Pause on hover
    if (card) {
      card.addEventListener('mouseenter', () => { this.isPaused = true; });
      card.addEventListener('mouseleave', () => { this.isPaused = false; });

      // Touch events for mobile swiping
      card.addEventListener('touchstart', (e) => {
        this.touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      card.addEventListener('touchend', (e) => {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
      }, { passive: true });
    }
  }

  handleSwipe() {
    const diff = this.touchStartX - this.touchEndX;
    if (Math.abs(diff) > 45) {
      if (diff > 0) {
        this.goToSlide(this.currentSlide + 1);
      } else {
        this.goToSlide(this.currentSlide - 1);
      }
      soundEngine.playClick();
    }
  }

  goToSlide(index) {
    if (index < 0) {
      this.currentSlide = this.totalSlides - 1;
    } else if (index >= this.totalSlides) {
      this.currentSlide = 0;
    } else {
      this.currentSlide = index;
    }

    this.updateUI();
  }

  updateUI() {
    const track = this.container.querySelector('#sliderTrack');
    const counter = this.container.querySelector('#sliderCounter');
    const slides = this.container.querySelectorAll('.masculine-slide');
    const tabSegments = this.container.querySelectorAll('.slider-tab-segment');

    if (track) {
      track.style.transform = `translateX(-${this.currentSlide * 100}%)`;
    }

    if (counter) {
      counter.textContent = `0${this.currentSlide + 1} / 0${this.totalSlides}`;
    }

    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === this.currentSlide);
    });

    tabSegments.forEach((seg, idx) => {
      seg.classList.toggle('active', idx === this.currentSlide);
    });
  }

  startAutoPlay() {
    if (this.autoPlayInterval) clearInterval(this.autoPlayInterval);
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.goToSlide(this.currentSlide + 1);
      }
    }, 6000);
  }
}
