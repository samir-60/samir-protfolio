import { soundEngine } from './SoundEngine.js';

export class ResumeModal {
  constructor(modalId, backdropId, triggerBtnId) {
    this.modal = document.getElementById(modalId);
    this.backdrop = document.getElementById(backdropId);
    this.triggerBtn = document.getElementById(triggerBtnId);
    this.closeBtn = this.modal ? this.modal.querySelector('.modal-close-btn') : null;
    this.printBtn = this.modal ? this.modal.querySelector('#printResumeBtn') : null;

    if (this.modal) {
      this.init();
    }
  }

  init() {
    if (this.triggerBtn) {
      this.triggerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.open();
      });
    }

    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.close());
    }

    if (this.printBtn) {
      this.printBtn.addEventListener('click', () => {
        soundEngine.playClick();
        window.print();
      });
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

  open() {
    if (!this.modal) return;
    soundEngine.playModalOpen();
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
