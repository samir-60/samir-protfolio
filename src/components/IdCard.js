import { soundEngine } from './SoundEngine.js';

/**
 * Animated 3D Holographic ID Card Component
 * Represents Samir Qureshi — Full-Stack Web Developer & Entrepreneur
 */
export class IdCard {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.isFlipped = false;
    this.currentX = 0;
    this.currentY = 0;
    this.targetX = 0;
    this.targetY = 0;
    this.rafId = null;

    this.init();
  }

  init() {
    this.render();
    this.attachEventListeners();
    this.startAnimationLoop();
  }

  render() {
    this.container.innerHTML = `
      <div class="id-card-wrapper" id="idCardWrapper" aria-label="Interactive ID Card of Samir Qureshi">
        <!-- Hanging Lanyard Strap & Clip System -->
        <div class="id-lanyard-system" aria-hidden="true">
          <div class="lanyard-ribbon">
            <span class="lanyard-text">SAMIR QURESHI ★ FULL-STACK DEVELOPER ★ TECH ENTREPRENEUR ★ B.SC CSE</span>
          </div>
          <div class="lanyard-hardware">
            <div class="lanyard-swivel-clip"></div>
            <div class="lanyard-ring"></div>
            <div class="lanyard-clasp"></div>
          </div>
        </div>

        <!-- 3D Perspective Card Container -->
        <div class="id-card-perspective">
          <div class="id-card-body" id="idCardBody" role="button" tabindex="0" aria-label="Press Enter or Click to flip ID card">
            
            <!-- Dynamic Specular Glare / Holographic Iridescent Foil -->
            <div class="id-card-glare" id="idCardGlare"></div>
            <div class="id-card-hologram-shimmer"></div>

            <!-- ================= FRONT FACE ================= -->
            <div class="id-card-face id-card-front">
              <!-- Lanyard Punch Hole Slot -->
              <div class="id-slot-hole">
                <div class="id-slot-punch"></div>
              </div>

              <!-- Top Security Header -->
              <div class="id-header">
                <div class="id-corp-brand">
                  <div class="id-mini-chip-icon">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                      <rect x="5" y="5" width="14" height="14" rx="2" fill="none" stroke="currentColor" stroke-width="2"/>
                      <circle cx="12" cy="12" r="3"/>
                      <line x1="12" y1="2" x2="12" y2="5" stroke="currentColor" stroke-width="2"/>
                      <line x1="12" y1="19" x2="12" y2="22" stroke="currentColor" stroke-width="2"/>
                      <line x1="2" y1="12" x2="5" y2="12" stroke="currentColor" stroke-width="2"/>
                      <line x1="19" y1="12" x2="22" y2="12" stroke="currentColor" stroke-width="2"/>
                    </svg>
                  </div>
                  <div>
                    <span class="id-header-title">DEVELOPER PASS</span>
                    <span class="id-header-sub">METROPOLITAN UNIVERSITY • SYLHET</span>
                  </div>
                </div>
                <div class="id-hologram-seal" title="Tamper-proof Cryptographic Seal">
                  <span>SECURE</span>
                  <div class="hologram-prism"></div>
                </div>
              </div>

              <!-- Biometric Profile Section -->
              <div class="id-profile-grid">
                <!-- Photo Container with Biometric Targeting -->
                <div class="id-photo-frame">
                  <div class="id-photo-reticles">
                    <span class="reticle top-left"></span>
                    <span class="reticle top-right"></span>
                    <span class="reticle bottom-left"></span>
                    <span class="reticle bottom-right"></span>
                  </div>
                  <div class="id-laser-scanner"></div>
                  <img 
                    src="./samir-qureshi.jpg" 
                    alt="Samir Qureshi — Full-Stack Web Developer & Entrepreneur" 
                    class="id-portrait-img"
                    loading="eager"
                  />
                  <div class="id-verified-chip">
                    <span class="chip-pulse"></span>
                    <span>VERIFIED</span>
                  </div>
                </div>

                <!-- Gold EMV Microchip & Meta Badges -->
                <div class="id-hardware-col">
                  <!-- Realistic Gold Smart Chip -->
                  <div class="emv-chip" title="Cryptographic Identity Chip">
                    <div class="chip-line horizontal"></div>
                    <div class="chip-line vertical"></div>
                    <div class="chip-center"></div>
                  </div>

                  <!-- NFC & Wireless Waveforms -->
                  <div class="nfc-symbol" title="Contactless NFC Active">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                      <path d="M7 17a6 6 0 0 1 0-10"/>
                      <path d="M11 19a9 9 0 0 1 0-14"/>
                      <path d="M15 21a12 12 0 0 1 0-18"/>
                    </svg>
                  </div>

                  <div class="security-level-badge">
                    <span class="level-label">CLEARANCE</span>
                    <span class="level-val">LVL 05</span>
                  </div>
                </div>
              </div>

              <!-- Name & Primary Title -->
              <div class="id-name-block">
                <div class="id-full-name">SAMIR QURESHI</div>
                <div class="id-role-title">Full-Stack Web Developer</div>
                <div class="id-secondary-role">Tech Entrepreneur &amp; Cybersecurity Specialist</div>
              </div>

              <!-- Live Status Pill -->
              <div class="id-status-row">
                <div class="status-indicator-pill">
                  <span class="status-live-dot"></span>
                  <span class="status-text">AVAILABLE FOR HIRE &amp; VENTURES</span>
                </div>
                <div class="id-serial-pill">SQ-2025-DEV</div>
              </div>

              <!-- Telemetry Metadata Matrix -->
              <div class="id-telemetry-matrix">
                <div class="matrix-cell">
                  <span class="cell-k">ACADEMICS</span>
                  <span class="cell-v">B.Sc. CSE (25–29)</span>
                </div>
                <div class="matrix-cell">
                  <span class="cell-k">VENTURE</span>
                  <span class="cell-v">Softyx Clothing</span>
                </div>
                <div class="matrix-cell">
                  <span class="cell-k">LOCATION</span>
                  <span class="cell-v">Sylhet, BD</span>
                </div>
                <div class="matrix-cell">
                  <span class="cell-k">SYSTEM ROLE</span>
                  <span class="cell-v">System Architect</span>
                </div>
              </div>

              <!-- Bottom Laser Barcode & Flip Prompt -->
              <div class="id-footer-row">
                <div class="id-barcode-graphic" aria-hidden="true">
                  <div class="barcode-lines"></div>
                  <span class="barcode-number">*SQ-8801725198663-PRO*</span>
                </div>
                <button class="id-flip-trigger-btn" type="button" aria-label="Flip ID badge to view reverse side">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
                  </svg>
                  <span>FLIP</span>
                </button>
              </div>
            </div>

            <!-- ================= BACK FACE ================= -->
            <div class="id-card-face id-card-back">
              <!-- Magnetic Reader Stripe -->
              <div class="id-mag-stripe">
                <div class="mag-sheen"></div>
              </div>

              <!-- Back Header & Watermark -->
              <div class="id-back-header">
                <div class="back-title">FOUNDER &amp; DEVELOPER CREDENTIALS</div>
                <div class="back-org">METROPOLITAN UNIVERSITY CSE DIVISION</div>
              </div>

              <!-- Core Stack Tags Grid -->
              <div class="id-back-section">
                <div class="back-section-label">CORE TECHNICAL ARSENAL</div>
                <div class="tech-chips-wall">
                  <span class="tech-chip">TypeScript</span>
                  <span class="tech-chip">JavaScript (ESNext)</span>
                  <span class="tech-chip">React</span>
                  <span class="tech-chip">Node.js</span>
                  <span class="tech-chip">PostgreSQL</span>
                  <span class="tech-chip">Cybersecurity</span>
                  <span class="tech-chip">Three.js 3D</span>
                  <span class="tech-chip">Next.js</span>
                  <span class="tech-chip">Tailwind &amp; CSS</span>
                  <span class="tech-chip">REST &amp; WebSockets</span>
                </div>
              </div>

              <!-- Entrepreneurship Record & Ventures -->
              <div class="id-back-section">
                <div class="back-section-label">VENTURES &amp; SYSTEMS CREATED</div>
                <div class="ventures-mini-list">
                  <div class="v-mini-item">
                    <span class="v-dot"></span>
                    <strong>Softyx Clothing:</strong> E-commerce apparel platform &amp; fraud engine
                  </div>
                  <div class="v-mini-item">
                    <span class="v-dot"></span>
                    <strong>Profix &amp; Shine UK:</strong> Commercial cleaning service engine
                  </div>
                  <div class="v-mini-item">
                    <span class="v-dot"></span>
                    <strong>FieldForesight:</strong> AI predictive agricultural crop intelligence
                  </div>
                </div>
              </div>

              <!-- QR Code & Security Hologram Section -->
              <div class="id-back-split-row">
                <!-- Verified QR Code pointing to WhatsApp -->
                <div class="id-qr-module">
                  <div class="id-qr-box">
                    <svg viewBox="0 0 100 100" class="qr-svg" width="68" height="68" fill="currentColor">
                      <!-- Scannable styling QR matrix -->
                      <rect x="0" y="0" width="30" height="30" rx="3" fill="#ffffff"/>
                      <rect x="5" y="5" width="20" height="20" fill="#0b0f17"/>
                      <rect x="9" y="9" width="12" height="12" fill="#ffffff"/>
                      
                      <rect x="70" y="0" width="30" height="30" rx="3" fill="#ffffff"/>
                      <rect x="75" y="5" width="20" height="20" fill="#0b0f17"/>
                      <rect x="79" y="9" width="12" height="12" fill="#ffffff"/>

                      <rect x="0" y="70" width="30" height="30" rx="3" fill="#ffffff"/>
                      <rect x="5" y="75" width="20" height="20" fill="#0b0f17"/>
                      <rect x="9" y="79" width="12" height="12" fill="#ffffff"/>

                      <!-- Pattern dots -->
                      <rect x="36" y="6" width="8" height="8" fill="#ffffff"/>
                      <rect x="48" y="10" width="6" height="6" fill="#ffffff"/>
                      <rect x="40" y="22" width="6" height="6" fill="#ffffff"/>
                      <rect x="56" y="20" width="8" height="8" fill="#ffffff"/>
                      <rect x="10" y="40" width="6" height="6" fill="#ffffff"/>
                      <rect x="22" y="44" width="8" height="8" fill="#ffffff"/>
                      <rect x="36" y="38" width="12" height="12" rx="2" fill="#38bdf8"/>
                      <rect x="54" y="42" width="8" height="8" fill="#ffffff"/>
                      <rect x="68" y="38" width="6" height="6" fill="#ffffff"/>
                      <rect x="80" y="44" width="8" height="8" fill="#ffffff"/>
                      <rect x="38" y="56" width="8" height="8" fill="#ffffff"/>
                      <rect x="50" y="58" width="10" height="10" fill="#ffffff"/>
                      <rect x="66" y="54" width="6" height="6" fill="#ffffff"/>
                      <rect x="82" y="60" width="8" height="8" fill="#ffffff"/>
                      <rect x="38" y="74" width="8" height="8" fill="#ffffff"/>
                      <rect x="52" y="72" width="6" height="6" fill="#ffffff"/>
                      <rect x="44" y="86" width="10" height="8" fill="#ffffff"/>
                      <rect x="74" y="76" width="18" height="18" rx="2" fill="#38bdf8"/>
                    </svg>
                  </div>
                  <span class="qr-caption">SCAN FOR DIRECT WHATSAPP &amp; CONTACT</span>
                </div>

                <!-- Signature & Authority Seal -->
                <div class="id-auth-module">
                  <div class="auth-seal-stamp">
                    <svg viewBox="0 0 100 100" width="46" height="46" class="seal-svg">
                      <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(245, 158, 11, 0.45)" stroke-width="2" stroke-dasharray="4 3"/>
                      <circle cx="50" cy="50" r="37" fill="none" stroke="rgba(245, 158, 11, 0.7)" stroke-width="1.5"/>
                      <path d="M50 20 L55 35 L70 35 L58 45 L62 60 L50 50 L38 60 L42 45 L30 35 L45 35 Z" fill="rgba(245, 158, 11, 0.35)"/>
                      <text x="50" y="80" text-anchor="middle" font-size="8" fill="#f59e0b" font-weight="bold" letter-spacing="1">AUTHENTIC</text>
                    </svg>
                  </div>

                  <div class="id-signature-block">
                    <div class="sig-label">AUTHORIZED SIGNATURE</div>
                    <div class="sig-script">Samir Qureshi</div>
                    <div class="sig-line"></div>
                  </div>
                </div>
              </div>

              <!-- Quick Interactive Connect Actions -->
              <div class="id-back-actions">
                <a href="https://wa.me/8801725198663" target="_blank" rel="noopener noreferrer" class="id-action-pill whatsapp">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.03-1.25-.75-.67-1.26-1.5-1.41-1.75-.14-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.77 2.71 4.3 3.79.6.26 1.07.41 1.44.53.61.19 1.16.17 1.6.1 1.49-.07 1.47-.72 1.68-1.42.21-.69.21-1.29.15-1.42-.06-.13-.23-.2-.48-.32Z"/>
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
                <button class="id-flip-trigger-btn flip-back-btn" type="button" aria-label="Flip back to front of ID card">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M2.5 2v6h6M2.66 15.57a10 10 0 1 0 .57-8.38l-5.67-5.67"/>
                  </svg>
                  <span>RETURN TO FRONT</span>
                </button>
              </div>
            </div>

          </div>
        </div>

        <!-- Floating Interactive Badge Controls -->
        <div class="id-card-controls">
          <button class="id-toggle-btn" id="idCardFlipBtn" type="button" aria-label="Flip Badge to reverse side">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
              <path d="M3 3v5h5"/>
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/>
              <path d="M16 21h5v-5"/>
            </svg>
            <span id="flipBtnText">Flip Badge (Reveal Credentials &amp; QR)</span>
          </button>
          <div class="id-badge-hint">
            <span class="hint-dot"></span>
            <span>Hover to tilt 3D • Click card to flip</span>
          </div>
        </div>
      </div>
    `;

    this.cardBody = document.getElementById('idCardBody');
    this.glare = document.getElementById('idCardGlare');
    this.flipBtn = document.getElementById('idCardFlipBtn');
    this.flipBtnText = document.getElementById('flipBtnText');
  }

  attachEventListeners() {
    if (!this.cardBody) return;

    // Flip triggers
    const toggleFlip = (e) => {
      // Prevent flipping if clicked on external link inside back face
      if (e.target.closest('a')) return;
      this.flip();
    };

    this.cardBody.addEventListener('click', toggleFlip);
    this.cardBody.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.flip();
      }
    });

    if (this.flipBtn) {
      this.flipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.flip();
      });
    }

    const backFlipBtn = this.container.querySelector('.flip-back-btn');
    if (backFlipBtn) {
      backFlipBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.flip();
      });
    }

    // 3D Tilt interaction
    const containerEl = this.container.querySelector('.id-card-wrapper');
    if (!containerEl) return;

    containerEl.addEventListener('pointermove', (e) => {
      const rect = containerEl.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate normalized tilt (-15deg to +15deg)
      const rotateY = ((x - centerX) / centerX) * 14;
      const rotateX = -((y - centerY) / centerY) * 14;

      this.targetX = rotateX;
      this.targetY = rotateY;

      // Holographic glare tracking
      if (this.glare) {
        const glarePercentX = (x / rect.width) * 100;
        const glarePercentY = (y / rect.height) * 100;
        this.glare.style.background = `radial-gradient(circle at ${glarePercentX}% ${glarePercentY}%, rgba(255, 255, 255, 0.45) 0%, rgba(56, 189, 248, 0.15) 30%, rgba(168, 85, 247, 0.1) 60%, transparent 80%)`;
        this.glare.style.opacity = '1';
      }
    });

    containerEl.addEventListener('pointerleave', () => {
      this.targetX = 0;
      this.targetY = 0;
      if (this.glare) {
        this.glare.style.opacity = '0';
      }
    });
  }

  flip() {
    this.isFlipped = !this.isFlipped;
    if (this.cardBody) {
      this.cardBody.classList.toggle('flipped', this.isFlipped);
    }
    if (this.flipBtnText) {
      this.flipBtnText.textContent = this.isFlipped 
        ? 'Return to Front (Photo & Badge ID)' 
        : 'Flip Badge (Reveal Credentials & QR)';
    }

    // Sound effect
    try {
      soundEngine.playClick();
    } catch {
      // Audio fallback
    }
  }

  startAnimationLoop() {
    const render = () => {
      // Smooth lerp
      this.currentX += (this.targetX - this.currentX) * 0.1;
      this.currentY += (this.targetY - this.currentY) * 0.1;

      if (this.cardBody) {
        const baseFlip = this.isFlipped ? 180 : 0;
        this.cardBody.style.transform = `rotateX(${this.currentX.toFixed(2)}deg) rotateY(${(baseFlip + this.currentY).toFixed(2)}deg)`;
      }

      this.rafId = requestAnimationFrame(render);
    };

    render();
  }

  destroy() {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}
