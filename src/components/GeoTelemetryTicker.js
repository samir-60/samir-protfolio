/**
 * Ultra-Dynamic Geo-Telemetry & Sliding Live Clock HUD Capsule
 * Uniquely slides across Visitor IP, Country, Live Time, Date, and Cyber Metrics
 */
export class GeoTelemetryTicker {
  constructor(mountId) {
    this.container = document.getElementById(mountId);
    this.currentIndex = 0;
    this.timer = null;
    this.slideInterval = null;
    this.isPaused = false;
    this.totalSlides = 4;

    this.telemetryData = {
      ip: 'Detecting...',
      city: 'Locating...',
      country: 'Global',
      countryCode: '',
      flag: '🌐',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
      utcOffset: '',
      localTime: '--:--:-- --',
      localDate: '---, --- --, ----',
      dayOfWeek: '---',
      latency: '12ms'
    };

    if (this.container) {
      this.init();
    }
  }

  async init() {
    this.updateClock();
    this.timer = setInterval(() => this.updateClock(), 1000);

    // Fetch IP and Geo metadata
    await this.fetchGeoData();

    this.render();
    this.startSliding();
  }

  async fetchGeoData() {
    try {
      const res = await fetch('https://ipapi.co/json/', { cache: 'force-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.city) {
          this.telemetryData.ip = data.ip || 'Secured IP';
          this.telemetryData.city = data.city;
          this.telemetryData.country = data.country_name || data.country;
          this.telemetryData.countryCode = data.country_code || '';
          this.telemetryData.timezone = data.timezone || this.telemetryData.timezone;
          this.telemetryData.utcOffset = data.utc_offset || '';
          this.telemetryData.flag = this.getCountryFlag(data.country_code);
        }
      }
    } catch (e) {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
      const parts = tz.split('/');
      this.telemetryData.city = parts[1]?.replace(/_/g, ' ') || 'Global';
      this.telemetryData.country = parts[0]?.replace(/_/g, ' ') || 'Web Node';
      this.telemetryData.flag = '🌐';
    }
    this.updateClock();
  }

  getCountryFlag(code) {
    if (!code || code.length !== 2) return '🌐';
    const codePoints = code
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }

  updateClock() {
    try {
      const now = new Date();
      const timeStr = new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: this.telemetryData.timezone
      }).format(now);

      const dateStr = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        timeZone: this.telemetryData.timezone
      }).format(now);

      const dayStr = new Intl.DateTimeFormat('en-US', {
        weekday: 'long',
        timeZone: this.telemetryData.timezone
      }).format(now);

      this.telemetryData.localTime = timeStr;
      this.telemetryData.localDate = dateStr;
      this.telemetryData.dayOfWeek = dayStr;

      // Update DOM elements in real time
      const timeEls = this.container?.querySelectorAll('.live-time-ticker');
      const dateEls = this.container?.querySelectorAll('.live-date-ticker');
      const dayEls = this.container?.querySelectorAll('.live-day-ticker');

      timeEls?.forEach(el => { el.textContent = timeStr; });
      dateEls?.forEach(el => { el.textContent = dateStr; });
      dayEls?.forEach(el => { el.textContent = dayStr; });
    } catch (err) {
      const now = new Date();
      this.telemetryData.localTime = now.toLocaleTimeString();
      this.telemetryData.localDate = now.toLocaleDateString();
    }
  }

  render() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="unique-telemetry-hud" id="uniqueTelemetryHud">
        <!-- Live Status Radar -->
        <div class="hud-radar-zone">
          <span class="hud-live-pulse"></span>
          <span class="hud-live-core"></span>
          <span class="hud-live-tag">LIVE GEO HUD</span>
        </div>

        <!-- Horizontal Sliding Carousel Viewport -->
        <div class="hud-slide-viewport">
          <div class="hud-slide-track" id="hudSlideTrack">
            
            <!-- Slide 0: Local Time (IP & Country Wise) -->
            <div class="hud-telemetry-slide active">
              <div class="hud-slide-inner">
                <span class="hud-chip-badge time-badge">🕒 LIVE TIME</span>
                <span class="hud-main-val font-mono">
                  <strong class="live-time-ticker text-cyan">${this.telemetryData.localTime}</strong>
                </span>
                <span class="hud-sub-meta font-mono">${this.telemetryData.timezone} ${this.telemetryData.utcOffset}</span>
              </div>
            </div>

            <!-- Slide 1: Local Date & Day -->
            <div class="hud-telemetry-slide">
              <div class="hud-slide-inner">
                <span class="hud-chip-badge date-badge">📅 LIVE DATE</span>
                <span class="hud-main-val">
                  <strong class="live-day-ticker">${this.telemetryData.dayOfWeek}</strong>, <span class="live-date-ticker font-mono">${this.telemetryData.localDate}</span>
                </span>
                <span class="hud-sub-meta font-mono">2026 CALENDAR</span>
              </div>
            </div>

            <!-- Slide 2: Visitor IP & Country Geolocation -->
            <div class="hud-telemetry-slide">
              <div class="hud-slide-inner">
                <span class="hud-chip-badge geo-badge">${this.telemetryData.flag} VISITOR ORIGIN</span>
                <span class="hud-main-val">
                  <strong>${this.telemetryData.city}</strong>, ${this.telemetryData.country}
                </span>
                <span class="hud-sub-meta font-mono">IP: ${this.telemetryData.ip}</span>
              </div>
            </div>

            <!-- Slide 3: Live System & Cyber Operations -->
            <div class="hud-telemetry-slide">
              <div class="hud-slide-inner">
                <span class="hud-chip-badge cyber-badge">🛡️ SECURE NODE</span>
                <span class="hud-main-val">
                  <strong>Sylhet Hub</strong> • Latency: <span class="text-cyan">${this.telemetryData.latency}</span>
                </span>
                <span class="hud-sub-meta font-mono">TLS 1.3 256-BIT</span>
              </div>
            </div>

          </div>
        </div>

        <!-- Sliding HUD Nav Controls -->
        <div class="hud-controls-zone">
          <button class="hud-nav-btn prev" id="hudPrevSlide" aria-label="Previous Slide">‹</button>
          <div class="hud-progress-indicators" id="hudProgressIndicators">
            <span class="hud-prog-dot active" data-index="0"></span>
            <span class="hud-prog-dot" data-index="1"></span>
            <span class="hud-prog-dot" data-index="2"></span>
            <span class="hud-prog-dot" data-index="3"></span>
          </div>
          <button class="hud-nav-btn next" id="hudNextSlide" aria-label="Next Slide">›</button>
        </div>
      </div>
    `;

    // Bind Controls
    const hud = document.getElementById('uniqueTelemetryHud');
    if (hud) {
      hud.addEventListener('mouseenter', () => { this.isPaused = true; });
      hud.addEventListener('mouseleave', () => { this.isPaused = false; });
    }

    const prevBtn = document.getElementById('hudPrevSlide');
    const nextBtn = document.getElementById('hudNextSlide');

    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.prevSlide();
    });

    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.nextSlide();
    });

    const dots = this.container.querySelectorAll('.hud-prog-dot');
    dots.forEach((dot) => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const index = parseInt(dot.getAttribute('data-index'), 10);
        this.goToSlide(index);
      });
    });
  }

  startSliding() {
    if (this.slideInterval) clearInterval(this.slideInterval);
    this.slideInterval = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 3500);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.totalSlides;
    this.updateSlideUI();
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.totalSlides) % this.totalSlides;
    this.updateSlideUI();
  }

  goToSlide(index) {
    this.currentIndex = index;
    this.updateSlideUI();
  }

  updateSlideUI() {
    const track = document.getElementById('hudSlideTrack');
    const slides = this.container?.querySelectorAll('.hud-telemetry-slide');
    const dots = this.container?.querySelectorAll('.hud-prog-dot');

    if (track) {
      track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
    }

    if (slides) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === this.currentIndex);
      });
    }

    if (dots) {
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === this.currentIndex);
      });
    }
  }
}
