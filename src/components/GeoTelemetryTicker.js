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

    const initialTz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Dhaka';
    const tzFallback = this.resolveTimezoneFallback(initialTz);

    this.telemetryData = {
      ip: 'Securing...',
      city: tzFallback.city || 'Dhaka',
      country: tzFallback.country || 'Bangladesh',
      countryCode: tzFallback.countryCode || 'BD',
      flagEmoji: tzFallback.flagEmoji || '🇧🇩',
      flagUrl: tzFallback.flagUrl || 'https://flagcdn.com/w40/bd.png',
      timezone: initialTz,
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
    this.render();
    this.startSliding();

    this.timer = setInterval(() => this.updateClock(), 1000);

    // Fetch live IP and Geo metadata in background and dynamically update HUD
    await this.fetchGeoData();
  }

  resolveTimezoneFallback(tz) {
    const tzMap = {
      'Asia/Dhaka': { city: 'Dhaka', country: 'Bangladesh', countryCode: 'BD', flagEmoji: '🇧🇩', flagUrl: 'https://flagcdn.com/w40/bd.png' },
      'Europe/London': { city: 'London', country: 'United Kingdom', countryCode: 'GB', flagEmoji: '🇬🇧', flagUrl: 'https://flagcdn.com/w40/gb.png' },
      'America/New_York': { city: 'New York', country: 'United States', countryCode: 'US', flagEmoji: '🇺🇸', flagUrl: 'https://flagcdn.com/w40/us.png' },
      'America/Los_Angeles': { city: 'Los Angeles', country: 'United States', countryCode: 'US', flagEmoji: '🇺🇸', flagUrl: 'https://flagcdn.com/w40/us.png' },
      'America/Chicago': { city: 'Chicago', country: 'United States', countryCode: 'US', flagEmoji: '🇺🇸', flagUrl: 'https://flagcdn.com/w40/us.png' },
      'America/Toronto': { city: 'Toronto', country: 'Canada', countryCode: 'CA', flagEmoji: '🇨🇦', flagUrl: 'https://flagcdn.com/w40/ca.png' },
      'Asia/Kolkata': { city: 'Kolkata', country: 'India', countryCode: 'IN', flagEmoji: '🇮🇳', flagUrl: 'https://flagcdn.com/w40/in.png' },
      'Asia/Dubai': { city: 'Dubai', country: 'United Arab Emirates', countryCode: 'AE', flagEmoji: '🇦🇪', flagUrl: 'https://flagcdn.com/w40/ae.png' },
      'Asia/Riyadh': { city: 'Riyadh', country: 'Saudi Arabia', countryCode: 'SA', flagEmoji: '🇸🇦', flagUrl: 'https://flagcdn.com/w40/sa.png' },
      'Asia/Singapore': { city: 'Singapore', country: 'Singapore', countryCode: 'SG', flagEmoji: '🇸🇬', flagUrl: 'https://flagcdn.com/w40/sg.png' },
      'Asia/Tokyo': { city: 'Tokyo', country: 'Japan', countryCode: 'JP', flagEmoji: '🇯🇵', flagUrl: 'https://flagcdn.com/w40/jp.png' },
      'Asia/Kuala_Lumpur': { city: 'Kuala Lumpur', country: 'Malaysia', countryCode: 'MY', flagEmoji: '🇲🇾', flagUrl: 'https://flagcdn.com/w40/my.png' },
      'Europe/Berlin': { city: 'Berlin', country: 'Germany', countryCode: 'DE', flagEmoji: '🇩🇪', flagUrl: 'https://flagcdn.com/w40/de.png' },
      'Europe/Paris': { city: 'Paris', country: 'France', countryCode: 'FR', flagEmoji: '🇫🇷', flagUrl: 'https://flagcdn.com/w40/fr.png' },
      'Europe/Amsterdam': { city: 'Amsterdam', country: 'Netherlands', countryCode: 'NL', flagEmoji: '🇳🇱', flagUrl: 'https://flagcdn.com/w40/nl.png' },
      'Australia/Sydney': { city: 'Sydney', country: 'Australia', countryCode: 'AU', flagEmoji: '🇦🇺', flagUrl: 'https://flagcdn.com/w40/au.png' },
      'Australia/Melbourne': { city: 'Melbourne', country: 'Australia', countryCode: 'AU', flagEmoji: '🇦🇺', flagUrl: 'https://flagcdn.com/w40/au.png' }
    };

    if (tz && tzMap[tz]) {
      return tzMap[tz];
    }

    // Generic parse from timezone name (e.g. "Europe/Rome" -> city "Rome", region "Europe")
    const parts = (tz || '').split('/');
    const rawCity = parts[1]?.replace(/_/g, ' ') || 'Global';
    return {
      city: rawCity,
      country: parts[0]?.replace(/_/g, ' ') || 'Web Node',
      countryCode: '',
      flagEmoji: '🌐',
      flagUrl: ''
    };
  }

  async fetchGeoData() {
    let resolved = false;

    // 1. Primary: ipwho.is (CORS enabled, highly accurate, returns flag image & emoji)
    try {
      const res = await fetch('https://ipwho.is/', { cache: 'no-cache' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false && data.country) {
          const code = (data.country_code || '').toUpperCase();
          this.telemetryData.ip = data.ip || 'Secured IP';
          this.telemetryData.city = data.city || this.telemetryData.city;
          this.telemetryData.country = data.country || this.telemetryData.country;
          this.telemetryData.countryCode = code;
          this.telemetryData.flagEmoji = data.flag?.emoji || this.getCountryFlag(code);
          this.telemetryData.flagUrl = code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : '';
          this.telemetryData.timezone = data.timezone?.id || this.telemetryData.timezone;
          this.telemetryData.utcOffset = data.timezone?.utc || '';
          resolved = true;
        }
      }
    } catch (e) {
      // Fall through to next provider
    }

    // 2. Secondary: freeipapi.com
    if (!resolved) {
      try {
        const res = await fetch('https://freeipapi.com/api/json', { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          if (data && data.countryName) {
            const code = (data.countryCode || '').toUpperCase();
            this.telemetryData.ip = data.ipAddress || 'Secured IP';
            this.telemetryData.city = data.cityName || this.telemetryData.city;
            this.telemetryData.country = data.countryName || this.telemetryData.country;
            this.telemetryData.countryCode = code;
            this.telemetryData.flagEmoji = this.getCountryFlag(code);
            this.telemetryData.flagUrl = code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : '';
            this.telemetryData.timezone = data.timeZone || this.telemetryData.timezone;
            resolved = true;
          }
        }
      } catch (e) {
        // Fall through to next provider
      }
    }

    // 3. Tertiary: ipapi.co
    if (!resolved) {
      try {
        const res = await fetch('https://ipapi.co/json/', { cache: 'no-cache' });
        if (res.ok) {
          const data = await res.json();
          if (data && (data.country_name || data.country)) {
            const code = (data.country_code || data.country || '').toUpperCase();
            this.telemetryData.ip = data.ip || 'Secured IP';
            this.telemetryData.city = data.city || this.telemetryData.city;
            this.telemetryData.country = data.country_name || data.country || this.telemetryData.country;
            this.telemetryData.countryCode = code;
            this.telemetryData.flagEmoji = this.getCountryFlag(code);
            this.telemetryData.flagUrl = code ? `https://flagcdn.com/w40/${code.toLowerCase()}.png` : '';
            this.telemetryData.timezone = data.timezone || this.telemetryData.timezone;
            this.telemetryData.utcOffset = data.utc_offset || '';
            resolved = true;
          }
        }
      } catch (e) {
        // Fall through to timezone fallback
      }
    }

    // Update dynamic slide contents with newly fetched telemetry
    this.updateClock();
    this.updateLiveTelemetryDOM();
  }

  getCountryFlag(code) {
    if (!code || code.length !== 2) return '🌐';
    try {
      const codePoints = code
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
      return String.fromCodePoint(...codePoints);
    } catch (e) {
      return '🌐';
    }
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

  updateLiveTelemetryDOM() {
    if (!this.container) return;

    const geoBadge = this.container.querySelector('#hudGeoBadge');
    const geoCity = this.container.querySelector('#hudGeoCity');
    const geoCountry = this.container.querySelector('#hudGeoCountry');
    const geoIp = this.container.querySelector('#hudGeoIp');
    const tzMeta = this.container.querySelector('#hudTzMeta');

    if (geoBadge) {
      geoBadge.innerHTML = this.renderFlagBadgeHTML();
    }
    if (geoCity) {
      geoCity.textContent = this.telemetryData.city;
    }
    if (geoCountry) {
      geoCountry.textContent = this.telemetryData.country;
    }
    if (geoIp) {
      geoIp.textContent = `IP: ${this.telemetryData.ip}`;
    }
    if (tzMeta) {
      tzMeta.textContent = `${this.telemetryData.timezone} ${this.telemetryData.utcOffset}`.trim();
    }
  }

  renderFlagBadgeHTML() {
    if (this.telemetryData.flagUrl && this.telemetryData.countryCode) {
      return `
        <span class="hud-flag-wrap">
          <img src="${this.telemetryData.flagUrl}" srcset="https://flagcdn.com/w80/${this.telemetryData.countryCode.toLowerCase()}.png 2x" alt="${this.telemetryData.countryCode}" class="hud-country-flag" width="16" height="12" loading="eager" />
        </span>
        <span>VISITOR ORIGIN</span>
      `;
    }
    return `<span>${this.telemetryData.flagEmoji || '🌐'} VISITOR ORIGIN</span>`;
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
                <span class="hud-sub-meta font-mono" id="hudTzMeta">${this.telemetryData.timezone} ${this.telemetryData.utcOffset}</span>
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

            <!-- Slide 2: Visitor IP & Country Geolocation with Crisp Country Flag -->
            <div class="hud-telemetry-slide">
              <div class="hud-slide-inner">
                <span class="hud-chip-badge geo-badge" id="hudGeoBadge">
                  ${this.renderFlagBadgeHTML()}
                </span>
                <span class="hud-main-val">
                  <strong id="hudGeoCity">${this.telemetryData.city}</strong>, <span id="hudGeoCountry">${this.telemetryData.country}</span>
                </span>
                <span class="hud-sub-meta font-mono" id="hudGeoIp">IP: ${this.telemetryData.ip}</span>
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

