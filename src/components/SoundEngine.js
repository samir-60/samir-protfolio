// High-performance, zero-asset Web Audio API Synthesizer
class SoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = localStorage.getItem('samir_portfolio_sound') === 'false';
    this.initialized = false;
  }

  init() {
    if (!this.initialized && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
        this.initialized = true;
      }
    }
  }

  ensureContext() {
    if (!this.audioCtx) this.init();
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleSound() {
    this.muted = !this.muted;
    localStorage.setItem('samir_portfolio_sound', (!this.muted).toString());
    if (!this.muted) {
      this.playChime();
    }
    return !this.muted;
  }

  isMuted() {
    return this.muted;
  }

  playClick() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, this.audioCtx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.06, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.05);
    } catch (e) {
      // Graceful fallback if audio blocked
    }
  }

  playHover() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.audioCtx.currentTime);
      osc.frequency.linearRampToValueAtTime(640, this.audioCtx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.015, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.04);
    } catch (e) {
      // Ignore
    }
  }

  playModalOpen() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.audioCtx) return;

      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(240, this.audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(580, this.audioCtx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.08, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 0.18);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 0.18);
    } catch (e) {
      // Ignore
    }
  }

  playChime() {
    if (this.muted) return;
    try {
      this.ensureContext();
      if (!this.audioCtx) return;

      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C Major arpeggio
      freqs.forEach((freq, idx) => {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime + idx * 0.06);

        gain.gain.setValueAtTime(0.05, this.audioCtx.currentTime + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + idx * 0.06 + 0.35);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(this.audioCtx.currentTime + idx * 0.06);
        osc.stop(this.audioCtx.currentTime + idx * 0.06 + 0.35);
      });
    } catch (e) {
      // Ignore
    }
  }
}

export const soundEngine = new SoundEngine();
