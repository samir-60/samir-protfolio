import { soundEngine } from './SoundEngine.js';

export class CursorEffects {
  constructor() {
    this.initInteractiveAudio();
    this.init3DTilt();
    this.init3DTitle();
  }

  init3DTitle() {
    const titleWrap = document.getElementById('heroTitleWrap');
    const subtitleWrap = document.getElementById('heroSubtitle3D');

    window.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;

      if (titleWrap) {
        const rotateY = x * 14;
        const rotateX = -y * 12;
        titleWrap.style.transform = `perspective(1200px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;
      }

      if (subtitleWrap) {
        const subRotateY = x * 9;
        const subRotateX = -y * 8;
        subtitleWrap.style.transform = `perspective(1200px) rotateX(${subRotateX.toFixed(2)}deg) rotateY(${subRotateY.toFixed(2)}deg) translateZ(8px)`;
      }
    });
  }

  initInteractiveAudio() {
    const targets = document.querySelectorAll('a, button, input, textarea, .interactive-card, .skill-pill, .filter-btn');
    targets.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        soundEngine.playHover();
      });
      el.addEventListener('click', () => {
        soundEngine.playClick();
      });
    });
  }

  init3DTilt() {
    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10; // Max 10 deg tilt
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(12px)`;

        // Glare highlight effect
        const glare = card.querySelector('.card-glare');
        if (glare) {
          const percentX = (x / rect.width) * 100;
          const percentY = (y / rect.height) * 100;
          glare.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255,255,255,0.18), transparent 60%)`;
        }
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        const glare = card.querySelector('.card-glare');
        if (glare) {
          glare.style.background = 'transparent';
        }
      });
    });
  }
}
