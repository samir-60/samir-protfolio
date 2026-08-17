import { codeSnippets } from '../data/codeSnippets.js';
import { soundEngine } from './SoundEngine.js';

export class CodeWorkbench {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.activeSnippetId = codeSnippets[0].id;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    const active = codeSnippets.find(s => s.id === this.activeSnippetId) || codeSnippets[0];

    this.container.innerHTML = `
      <div class="workbench-card tilt-card">
        <div class="card-glare"></div>

        <!-- Workbench Top Header -->
        <div class="workbench-header">
          <div class="workbench-tabs">
            ${codeSnippets.map(snippet => `
              <button class="workbench-tab-btn ${snippet.id === this.activeSnippetId ? 'active' : ''}" data-snippet-id="${snippet.id}">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m18 16 4-4-4-4"></path><path d="m6 8-4 4 4 4"></path><path d="m14.5 4-5 16"></path></svg>
                <span>${snippet.filename}</span>
              </button>
            `).join('')}
          </div>

          <div class="workbench-actions">
            <button class="btn btn-secondary workbench-btn" id="copySnippetBtn" style="padding: 0.35rem 0.8rem; font-size: 0.8rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path></svg>
              <span id="copySnippetText">Copy Code</span>
            </button>
            <button class="btn btn-primary workbench-btn" id="runSnippetBtn" style="padding: 0.35rem 0.9rem; font-size: 0.8rem;">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
              <span>Test &amp; Execute</span>
            </button>
          </div>
        </div>

        <!-- Meta Bar -->
        <div class="workbench-meta-bar">
          <div style="display: flex; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
            <span class="project-badge-tag" style="background: rgba(56, 189, 248, 0.15); color: var(--accent-cyan); font-size: 0.75rem;">
              ${active.badge}
            </span>
            <span style="font-weight: 600; color: var(--text-primary); font-size: 0.9rem;">${active.title}</span>
          </div>
          <span style="font-size: 0.8rem; color: var(--text-muted); font-family: var(--font-mono);">${active.language.toUpperCase()} • Handcrafted</span>
        </div>

        <p class="workbench-desc">${active.description}</p>

        <!-- Code Viewer with Line Numbers -->
        <div class="workbench-code-wrap">
          <pre class="workbench-code"><code>${this.escapeAndHighlight(active.code)}</code></pre>
        </div>

        <!-- Interactive Execution Console Output -->
        <div class="workbench-console" id="workbenchConsole" style="display: none;">
          <div class="console-header">
            <span style="color: var(--accent-emerald); font-weight: 600;">[Execution Output Simulator]</span>
            <span class="console-timestamp" id="consoleTimestamp"></span>
          </div>
          <pre class="console-output" id="consoleOutputText">${active.sampleOutput}</pre>
        </div>
      </div>
    `;

    this.attachEvents();
  }

  escapeAndHighlight(code) {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      const lineNum = String(idx + 1).padStart(2, ' ');
      // Simple clean highlighting for keywords, comments, strings
      let formatted = line
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      if (formatted.trim().startsWith('//')) {
        formatted = `<span style="color: #64748b; font-style: italic;">${formatted}</span>`;
      } else {
        formatted = formatted
          .replace(/\b(export|interface|function|const|let|return|if|else|import|from)\b/g, '<span style="color: #c084fc; font-weight: 600;">$1</span>')
          .replace(/\b(number|string|boolean|void|RiskEvaluation|TransactionPayload|UserDimensions|SizeRecommendation)\b/g, '<span style="color: #38bdf8;">$1</span>')
          .replace(/('(?:\\'|[^'])*'|`(?:\\`|[^`])*`)/g, '<span style="color: #34d399;">$1</span>');
      }

      return `<span class="code-line"><span class="code-line-num">${lineNum}</span>  ${formatted}</span>`;
    }).join('\n');
  }

  attachEvents() {
    // Tab switching
    const tabBtns = this.container.querySelectorAll('.workbench-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-snippet-id');
        if (id && id !== this.activeSnippetId) {
          soundEngine.playClick();
          this.activeSnippetId = id;
          this.render();
        }
      });
    });

    // Copy Code Button
    const copyBtn = this.container.querySelector('#copySnippetBtn');
    const copyText = this.container.querySelector('#copySnippetText');
    const active = codeSnippets.find(s => s.id === this.activeSnippetId);

    if (copyBtn && active) {
      copyBtn.addEventListener('click', () => {
        soundEngine.playClick();
        navigator.clipboard.writeText(active.code).then(() => {
          if (copyText) copyText.textContent = 'Copied to Clipboard';
          setTimeout(() => {
            if (copyText) copyText.textContent = 'Copy Code';
          }, 2500);
        });
      });
    }

    // Run / Execute Simulator Button
    const runBtn = this.container.getElementById('runSnippetBtn');
    const consoleBox = this.container.getElementById('workbenchConsole');
    const consoleTime = this.container.getElementById('consoleTimestamp');

    if (runBtn && consoleBox) {
      runBtn.addEventListener('click', () => {
        soundEngine.playChime();
        consoleBox.style.display = 'block';
        if (consoleTime) {
          consoleTime.textContent = new Date().toLocaleTimeString();
        }
        consoleBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
    }
  }
}
