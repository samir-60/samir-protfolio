import confetti from 'canvas-confetti';
import { projectsData } from './data/projects.js';
import { skillsData } from './data/skills.js';
import { experienceData } from './data/experience.js';

import { ThreeHeroScene } from './components/ThreeHeroScene.js';
import { ThreeSkillsGalaxy } from './components/ThreeSkillsGalaxy.js';
import { Terminal } from './components/Terminal.js';
import { ProjectModal } from './components/ProjectModal.js';
import { ResumeModal } from './components/ResumeModal.js';
import { CursorEffects } from './components/CursorEffects.js';
import { soundEngine } from './components/SoundEngine.js';
import { LiveVenturesSlider } from './components/LiveVenturesSlider.js';
import { GeoTelemetryTicker } from './components/GeoTelemetryTicker.js';
import { syncGitHubRepositories } from './services/githubSync.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Live Geo-Telemetry & Sliding Clock
  new GeoTelemetryTicker('geoTelemetryMount');
  // 1. Initialize 3D Hero Scene
  try {
    new ThreeHeroScene('three-hero-canvas');
  } catch (err) {
    console.warn('3D Hero Canvas Fallback:', err);
  }

  // 2. Initialize 3D Skills Sphere
  try {
    new ThreeSkillsGalaxy('skills-galaxy-canvas');
  } catch (err) {
    console.warn('3D Skills Canvas Fallback:', err);
  }

  // 3. Initialize Modals
  const projectModal = new ProjectModal('projectModal', 'projectModalBackdrop', 'projectModalContent');
  new ResumeModal('resumeModal', 'resumeModalBackdrop', 'openResumeBtn');

  // 4. Initialize CLI Terminal
  new Terminal('terminalBody', 'terminalInput');

  // 5. Render Dynamic Sections & Live Ventures Slider
  new LiveVenturesSlider('liveVenturesSlider');
  renderProjects(projectsData, projectModal);
  renderSkillsCategories(skillsData.categories);
  renderExperience(experienceData);

  // Live Real-Time Auto-Sync from GitHub @samir-60
  syncGitHubRepositories((syncedProjects) => {
    renderProjects(syncedProjects, projectModal);
    const repoLabel = document.getElementById('repoCountLabel');
    if (repoLabel) {
      repoLabel.textContent = `${syncedProjects.length} REPOSITORIES SYNCED`;
    }
  });

  // 6. Initialize Typewriter
  initTypewriter();

  // 7. Initialize Stats & Skill Meter Intersection Observers
  initScrollCounters();
  initSkillBarAnimation();

  // 8. Initialize Human Story Tabs
  initStoryTabs();

  // 9. Initialize Theme & Sound Controls
  initThemeManager();
  initSoundControls();

  // 10. Initialize Contact Form & Copy Buttons
  initContactInteractions();

  // 11. Navigation & Scroll Spy
  initNavigation();

  // 12. Footer Live Clock
  initLiveClock();

  // 13. Initialize Cursor & 3D Tilt Effects
  new CursorEffects();
});

/* ==========================================================================
   RENDER FUNCTIONS
   ========================================================================== */

function renderProjects(projects, modalInstance) {
  const grid = document.getElementById('projectsGrid');
  if (!grid) return;

  grid.innerHTML = projects.map(proj => `
    <div class="project-card tilt-card" data-category="${proj.category}" data-id="${proj.id}">
      <div class="card-glare"></div>
      <div class="project-img-wrap">
        <div class="project-badge-tag" style="background: ${proj.color}22; color: ${proj.color}; border: 1px solid ${proj.color}55;">
          ${proj.badge}
        </div>
        <img src="${proj.image}" alt="${proj.title}" class="project-img" loading="lazy" />
      </div>
      <div class="project-body">
        <h3 class="project-title">${proj.title}</h3>
        <p class="project-short-desc">${proj.shortDescription}</p>
        <div class="project-tech-tags">
          ${proj.tags.slice(0, 4).map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
        <div class="project-footer">
          <span class="explore-link">
            Case Study & Specs
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">
            ${proj.stats.stars || proj.stats.latency || proj.stats.fps || 'Live Demo'}
          </span>
        </div>
      </div>
    </div>
  `).join('');

  // Attach card click handlers
  const cards = grid.querySelectorAll('.project-card');
  cards.forEach(card => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-id');
      const targetProj = projects.find(p => p.id === id);
      if (targetProj && modalInstance) {
        modalInstance.open(targetProj);
      }
    });
  });

  // Filter Buttons
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      soundEngine.playClick();

      const filter = btn.getAttribute('data-filter');
      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

function renderSkillsCategories(categories) {
  const container = document.getElementById('skillsCategoriesList');
  if (!container) return;

  container.innerHTML = categories.map(cat => `
    <div class="skill-category-card">
      <div class="skill-cat-header">
        <h3 class="skill-cat-title" style="color: ${cat.color};">${cat.title}</h3>
      </div>
      <p class="skill-cat-desc">${cat.description}</p>
      <div class="skill-bars-list">
        ${cat.skills.map(sk => `
          <div class="skill-bar-item">
            <div class="skill-bar-meta">
              <span>${sk.name}</span>
              <span style="color: ${cat.color}; font-family: var(--font-mono);">${sk.level}%</span>
            </div>
            <div class="skill-bar-track">
              <div class="skill-bar-fill" data-level="${sk.level}" style="background: linear-gradient(90deg, ${cat.color}88, ${cat.color});"></div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

function renderExperience(experiences) {
  const container = document.getElementById('experienceTimeline');
  if (!container) return;

  container.innerHTML = experiences.map(exp => `
    <div class="timeline-item">
      <div class="timeline-dot"></div>
      <div class="timeline-card">
        <div class="timeline-header">
          <div>
            <h3 class="timeline-role">${exp.role}</h3>
            <div class="timeline-company">${exp.company} • ${exp.location}</div>
          </div>
          <span class="timeline-period">${exp.period}</span>
        </div>
        <p class="timeline-desc">${exp.description}</p>
        <ul class="timeline-bullets">
          ${exp.achievements.map(ach => `<li><span class="bullet">▹</span> ${ach}</li>`).join('')}
        </ul>
        <div class="project-tech-tags">
          ${exp.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   TYPEWRITER EFFECT
   ========================================================================== */
function initTypewriter() {
  const target = document.getElementById('typewriterTarget');
  if (!target) return;

  const roles = [
    'Full-Stack Web Developer',
    'Cybersecurity Expert & Fraud Analyst',
    'Founder of Softyx (softyx.shop)',
    'B.Sc. CSE Student @ Metropolitan University',
    'Architect of Profix & Shine UK',
    'Academic AI Researcher & Open-Source Builder'
  ];

  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 75;

  function type() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
      target.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      target.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Hold full text so it can be comfortably read
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 350; // Pause briefly before typing next role
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   INTERSECTION OBSERVERS (COUNTERS & SKILL BARS)
   ========================================================================== */
function initScrollCounters() {
  const statNumbers = document.querySelectorAll('.stat-number');
  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        statNumbers.forEach(stat => {
          const target = parseInt(stat.getAttribute('data-target'), 10);
          const suffix = stat.innerText.replace(/[0-9]/g, '');
          let count = 0;
          const duration = 1500;
          const stepTime = 25;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            count += increment;
            if (count >= target) {
              stat.innerText = target + suffix;
              clearInterval(timer);
            } else {
              stat.innerText = Math.floor(count) + suffix;
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.3 });

  const banner = document.querySelector('.stats-banner');
  if (banner) observer.observe(banner);
}

function initSkillBarAnimation() {
  const skillFills = document.querySelectorAll('.skill-bar-fill');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        skillFills.forEach(fill => {
          const level = fill.getAttribute('data-level');
          fill.style.width = `${level}%`;
        });
      }
    });
  }, { threshold: 0.2 });

  const skillsSection = document.getElementById('skills');
  if (skillsSection) observer.observe(skillsSection);
}

/* ==========================================================================
   HUMAN STORY TABS
   ========================================================================== */
function initStoryTabs() {
  const tabBtns = document.querySelectorAll('.story-tab-btn');
  const tabContents = document.querySelectorAll('.story-tab-content');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      soundEngine.playClick();

      const tabId = btn.getAttribute('data-tab');
      const targetContent = document.getElementById(`tab-${tabId}`);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   THEME & SOUND CONTROLS
   ========================================================================== */
function initThemeManager() {
  const dropdown = document.getElementById('themeDropdown');
  const themeBtn = document.getElementById('themeBtn');
  const themeItems = document.querySelectorAll('.theme-item');

  // Load saved theme
  const savedTheme = localStorage.getItem('samir_portfolio_theme') || 'obsidian';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateActiveThemeItem(savedTheme);

  if (themeBtn && dropdown) {
    themeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdown.classList.toggle('open');
      soundEngine.playClick();
    });

    document.addEventListener('click', () => {
      dropdown.classList.remove('open');
    });
  }

  themeItems.forEach(item => {
    item.addEventListener('click', () => {
      const theme = item.getAttribute('data-set-theme');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('samir_portfolio_theme', theme);
      updateActiveThemeItem(theme);
      if (dropdown) dropdown.classList.remove('open');
      soundEngine.playChime();
    });
  });

  function updateActiveThemeItem(theme) {
    themeItems.forEach(item => {
      if (item.getAttribute('data-set-theme') === theme) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }
}

function initSoundControls() {
  const soundBtn = document.getElementById('soundToggleBtn');
  const iconOn = document.getElementById('soundIconOn');
  const iconOff = document.getElementById('soundIconOff');

  if (!soundBtn) return;

  function updateSoundUI() {
    const isMuted = soundEngine.isMuted();
    if (iconOn && iconOff) {
      iconOn.style.display = isMuted ? 'none' : 'block';
      iconOff.style.display = isMuted ? 'block' : 'none';
    }
  }

  updateSoundUI();

  soundBtn.addEventListener('click', () => {
    soundEngine.toggleSound();
    updateSoundUI();
  });
}

/* ==========================================================================
   CONTACT FORM & LIVE EMAIL DISPATCH
   ========================================================================== */
function initContactInteractions() {
  const form = document.getElementById('contactForm');
  const submitBtn = document.getElementById('contactSubmitBtn');
  const submitText = document.getElementById('submitBtnText');
  const successMsg = document.getElementById('formSuccess');
  const errorMsg = document.getElementById('formError');
  const copyBtn = document.getElementById('copyEmailBtn');
  const copyText = document.getElementById('copyEmailText');

  const TARGET_EMAIL = 'qureshsamir145@gmail.com';

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const senderName = document.getElementById('senderName')?.value.trim() || 'Valued Contact';
      const senderEmail = document.getElementById('senderEmail')?.value.trim();
      const senderSubject = document.getElementById('senderSubject')?.value.trim() || 'Portfolio Inquiry';
      const senderMessage = document.getElementById('senderMessage')?.value.trim();

      if (!senderEmail || !senderMessage) return;

      // Loading state
      if (submitBtn) submitBtn.disabled = true;
      if (submitText) submitText.textContent = 'Sending Message...';
      if (successMsg) successMsg.style.display = 'none';
      if (errorMsg) errorMsg.style.display = 'none';

      try {
        let sent = false;

        // 1. First attempt direct Secure Django / Express SMTP API
        try {
          const apiBase = import.meta.env.VITE_BACKEND_URL || '';
          let directRes = await fetch(`${apiBase}/api/contact/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: senderName,
              email: senderEmail,
              subject: senderSubject,
              message: senderMessage,
            }),
          });

          if (!directRes.ok && directRes.status === 404) {
            directRes = await fetch(`${apiBase}/api/contact`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                name: senderName,
                email: senderEmail,
                subject: senderSubject,
                message: senderMessage,
              }),
            });
          }

          if (directRes.ok) {
            sent = true;
          }
        } catch (apiErr) {
          console.log('Secure Direct Backend offline, using fallback provider...', apiErr);
        }

        // 2. Fallback to FormSubmit if direct server is not available
        if (!sent) {
          const payload = {
            name: senderName,
            email: senderEmail,
            _replyto: senderEmail,
            _subject: `New Portfolio Message from ${senderName}: ${senderSubject}`,
            subject: senderSubject,
            message: senderMessage,
            _captcha: 'false',
            _autoresponse: `Hi ${senderName},\n\nThank you for reaching out to Samir Qureshi!\n\nYour message regarding "${senderSubject}" has been received. Samir will review your note and get back to you directly at ${senderEmail} as soon as possible.\n\nBest regards,\nSamir Qureshi\nB.Sc. in CSE (Metropolitan University, Sylhet)\nFull-Stack Web Developer & Cybersecurity Specialist\nPortfolio: https://github.com/samir-60\nDirect Email: ${TARGET_EMAIL}`,
            _template: 'table',
          };

          const fsRes = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (fsRes.ok) {
            sent = true;
          }
        }

        if (sent) {
          soundEngine.playChime();

          // Confetti celebration
          confetti({
            particleCount: 120,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#38bdf8', '#818cf8', '#c084fc', '#10b981'],
          });

          if (successMsg) {
            successMsg.style.display = 'block';
            successMsg.innerHTML = `
              <strong>✓ Message Sent Directly to Samir!</strong><br />
              Your message was delivered directly to <code>${TARGET_EMAIL}</code> and a confirmation copy has been sent to your email.
            `;
          }
          form.reset();
        } else {
          throw new Error('All dispatch methods failed');
        }
      } catch (err) {
        console.warn('Contact form error:', err);
        if (errorMsg) errorMsg.style.display = 'block';
        window.location.href = `mailto:${TARGET_EMAIL}?subject=${encodeURIComponent(senderSubject)}&body=${encodeURIComponent(`From: ${senderName} (${senderEmail})\n\n${senderMessage}`)}`;
      } finally {
        if (submitBtn) submitBtn.disabled = false;
        if (submitText) submitText.textContent = 'Send Message';
      }
    });
  }

  if (copyBtn && copyText) {
    copyBtn.addEventListener('click', () => {
      soundEngine.playClick();
      navigator.clipboard.writeText(TARGET_EMAIL).then(() => {
        copyText.textContent = '✓ Copied: ' + TARGET_EMAIL;
        setTimeout(() => {
          copyText.textContent = 'Copy ' + TARGET_EMAIL;
        }, 3000);
      }).catch(() => {
        copyText.textContent = TARGET_EMAIL;
      });
    });
  }
}

/* ==========================================================================
   NAVIGATION & LIVE CLOCK
   ========================================================================== */
function initNavigation() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const backToTop = document.getElementById('backToTopBtn');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(sec => {
      const secHeight = sec.offsetHeight;
      const secTop = sec.offsetTop - 120;
      const secId = sec.getAttribute('id');

      if (scrollY > secTop && scrollY <= secTop + secHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${secId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  });

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      soundEngine.playClick();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

function initLiveClock() {
  const clockEl = document.getElementById('liveClockDisplay');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    clockEl.textContent = 'Live (UTC): ' + now.toUTCString().split(' ').slice(4, 5)[0] + ' UTC';
  }

  updateTime();
  setInterval(updateTime, 1000);
}
