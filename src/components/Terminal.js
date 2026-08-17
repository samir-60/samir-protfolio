import { soundEngine } from './SoundEngine.js';

export class Terminal {
  constructor(terminalBodyId, inputId) {
    this.body = document.getElementById(terminalBodyId);
    this.input = document.getElementById(inputId);
    this.history = [];
    this.historyIndex = -1;
    this.commandList = [
      'help',
      'about',
      'skills',
      'projects',
      'experience',
      'contact',
      'hire',
      'theme',
      'matrix',
      'resume',
      'quote',
      'sudo',
      'clear'
    ];

    if (this.input && this.body) {
      this.init();
    }
  }

  init() {
    this.input.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Focus input on terminal container click
    const container = this.body.closest('.terminal-window');
    if (container) {
      container.addEventListener('click', () => {
        this.input.focus();
      });
    }

    // Initial greeting
    this.appendOutput([
      '<span class="term-cyan">⚡ Welcome to Samir Qureshi\'s Interactive CLI Shell (v2.4.0)</span>',
      '<span class="term-muted">Type <span class="term-yellow">help</span> to view available commands or try <span class="term-green">projects</span>, <span class="term-cyan">about</span>, or <span class="term-purple">matrix</span>.</span>',
      ''
    ]);
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      const rawCommand = this.input.value.trim();
      if (!rawCommand) return;

      soundEngine.playClick();
      this.history.push(rawCommand);
      this.historyIndex = this.history.length;

      this.appendCommand(rawCommand);
      this.executeCommand(rawCommand.toLowerCase());
      this.input.value = '';
      this.scrollToBottom();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.input.value = this.history[this.historyIndex] || '';
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.input.value = this.history[this.historyIndex] || '';
      } else {
        this.historyIndex = this.history.length;
        this.input.value = '';
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const current = this.input.value.trim().toLowerCase();
      if (!current) return;
      const match = this.commandList.find((cmd) => cmd.startsWith(current));
      if (match) {
        this.input.value = match;
      }
    }
  }

  appendCommand(cmd) {
    const line = document.createElement('div');
    line.className = 'terminal-line term-prompt-line';
    line.innerHTML = `<span class="term-prompt">samir@innovator:~$</span> <span class="term-cmd-text">${this.escapeHTML(cmd)}</span>`;
    this.body.appendChild(line);
  }

  appendOutput(lines) {
    const block = document.createElement('div');
    block.className = 'terminal-output';
    block.innerHTML = lines.join('<br>');
    this.body.appendChild(block);
  }

  scrollToBottom() {
    this.body.scrollTop = this.body.scrollHeight;
  }

  escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  executeCommand(cmd) {
    const parts = cmd.split(' ');
    const mainCmd = parts[0];
    const arg = parts[1];

    switch (mainCmd) {
      case 'help':
        this.appendOutput([
          '<span class="term-header">AVAILABLE COMMANDS:</span>',
          '  <span class="term-yellow">about</span>        - Get to know Samir Qureshi & his engineering philosophy',
          '  <span class="term-yellow">skills</span>       - Inspect technical stack & proficiency breakdown',
          '  <span class="term-yellow">projects</span>     - Browse flagship projects including BiblioDrop',
          '  <span class="term-yellow">experience</span>   - View career timeline & milestones',
          '  <span class="term-yellow">contact</span>      - Direct communication channels (LinkedIn, GitHub, Email)',
          '  <span class="term-yellow">hire</span>         - Why hire Samir? Key value proposition',
          '  <span class="term-yellow">theme [name]</span> - Change UI theme: <span class="term-cyan">obsidian</span>, <span class="term-green">emerald</span>, <span class="term-yellow">solar</span>',
          '  <span class="term-yellow">matrix</span>       - Trigger digital cyber rain visualizer',
          '  <span class="term-yellow">resume</span>       - Open the official printable resume view',
          '  <span class="term-yellow">quote</span>        - Inspiring thought on architecture & design',
          '  <span class="term-yellow">clear</span>        - Clean up the terminal display'
        ]);
        break;

      case 'about':
        this.appendOutput([
          '<span class="term-header">ABOUT SAMIR QURESHI:</span>',
          '  <span class="term-cyan">Name:</span>        Samir Qureshi',
          '  <span class="term-cyan">Education:</span>   B.Sc. in Computer Science &amp; Engineering (2025 — 2029)',
          '  <span class="term-cyan">University:</span>  Metropolitan University, Sylhet',
          '  <span class="term-cyan">Roles:</span>       Full-Stack Web Developer • Cybersecurity Specialist • Businessman &amp; Entrepreneur • CSE Researcher',
          '  <span class="term-cyan">Ventures:</span>    Founder @ Softyx Clothing (softyx.shop), Profix &amp; Shine UK (profixandshine.co.uk)',
          '  <span class="term-cyan">Mission:</span>     Merging rigorous CSE research, cybersecurity defense, and full-stack software development into high-impact businesses.',
          '  <span class="term-muted">"Bridging Computer Science Research, Cybersecurity &amp; Real-World Entrepreneurship."</span>'
        ]);
        break;

      case 'skills':
        this.appendOutput([
          '<span class="term-header">TECHNICAL SKILL & DOMAIN MASTERY:</span>',
          '  <span class="term-cyan">CSE Core:</span>      DSA, Algorithms, OOP, DBMS, Computer Networks, Operating Systems',
          '  <span class="term-green">Web Dev:</span>       TypeScript, JavaScript (ES6+), React/Next.js, Node.js, Express, Three.js 3D',
          '  <span class="term-purple">Cybersecurity:</span> E-Commerce Fraud Detection, OWASP, Authentication, Vulnerability Audit',
          '  <span class="term-yellow">Business &amp; Res:</span> Product Strategy, Brand Monetization, AI Data Modeling (FieldForesight)'
        ]);
        break;

      case 'projects':
        this.appendOutput([
          '<span class="term-header">FEATURED GITHUB REPOSITORIES & LIVE PLATFORMS:</span>',
          '  1. <span class="term-cyan">Softyx Clothing</span> (Live on softyx.shop) - E-commerce platform with live virtual try-on & body scanner',
          '  2. <span class="term-green">Profix &amp; Shine UK</span> (Live on profixandshine.co.uk) - UK cleaning services commercial web platform',
          '  3. <span class="term-purple">BiblioDrop</span> (GitHub) - Community literature & book exchange platform',
          '  4. <span class="term-yellow">Softyx Fraud Checker</span> (GitHub) - Transaction risk scoring & e-commerce fraud detection',
          '  5. <span class="term-pink">StudySync</span> (GitHub) - Synchronized study & academic collaboration hub',
          '  <span class="term-muted">Browse full code on GitHub: <a href="https://github.com/samir-60" target="_blank" class="term-link">github.com/samir-60</a></span>'
        ]);
        break;

      case 'experience':
        this.appendOutput([
          '<span class="term-header">CAREER TIMELINE:</span>',
          '  <span class="term-cyan">2023 - Present:</span> Full-Stack Engineer & Creative Technologist (Open Source / BiblioDrop)',
          '  <span class="term-purple">2022 - 2024:</span>    Business Technologist & Solution Architect',
          '  <span class="term-yellow">2021 - 2023:</span>    Software Developer & Technical Explorer'
        ]);
        break;

      case 'contact':
        this.appendOutput([
          '<span class="term-header">GET IN TOUCH:</span>',
          '  <span class="term-green">WhatsApp:</span> <a href="https://wa.me/8801725198663" target="_blank" class="term-link">+8801725198663</a>',
          '  <span class="term-cyan">Email:</span>    <a href="mailto:qureshsamir145@gmail.com" class="term-link">qureshsamir145@gmail.com</a>',
          '  <span class="term-cyan">LinkedIn:</span> <a href="https://www.linkedin.com/in/samir-qureshi-b13b27261/" target="_blank" class="term-link">https://www.linkedin.com/in/samir-qureshi-b13b27261/</a>',
          '  <span class="term-green">GitHub:</span>   <a href="https://github.com/samir-60" target="_blank" class="term-link">https://github.com/samir-60</a>',
          '  <span class="term-yellow">Status:</span>   [Available] Open to full-time roles, contracts, &amp; high-impact projects'
        ]);
        break;

      case 'hire':
        this.appendOutput([
          '<span class="term-header">WHY WORK WITH SAMIR QURESHI?</span>',
          '  [+] <span class="term-green">Hybrid Mastery:</span> Rigorous computer science fundamentals + commercial business acumen.',
          '  [+] <span class="term-green">Performance Obsession:</span> Sub-second API responses and locked 60 FPS 3D spatial execution.',
          '  [+] <span class="term-green">Total Ownership:</span> Clear communication, proactive delivery, and reliable clean code.',
          '  <span class="term-muted">Ready to discuss? Scroll down to the contact section or write directly to qureshsamir145@gmail.com</span>'
        ]);
        break;

      case 'theme':
        if (!arg) {
          this.appendOutput(['Usage: <span class="term-yellow">theme [obsidian | emerald | solar]</span>']);
        } else if (['obsidian', 'emerald', 'solar'].includes(arg)) {
          document.documentElement.setAttribute('data-theme', arg);
          localStorage.setItem('samir_portfolio_theme', arg);
          soundEngine.playChime();
          this.appendOutput([`<span class="term-green">✔ Switched theme to: <strong>${arg}</strong></span>`]);
        } else {
          this.appendOutput([`<span class="term-red">Unknown theme '${arg}'. Choose obsidian, emerald, or solar.</span>`]);
        }
        break;

      case 'matrix':
        this.runMatrixEffect();
        break;

      case 'resume':
        const resumeBtn = document.getElementById('openResumeBtn');
        if (resumeBtn) {
          resumeBtn.click();
          this.appendOutput(['<span class="term-green">Opening official resume modal...</span>']);
        } else {
          this.appendOutput(['<span class="term-yellow">Resume viewer loaded in modal.</span>']);
        }
        break;

      case 'quote':
        const quotes = [
          '"Simplicity is prerequisite for reliability." — Edsger W. Dijkstra',
          '"Good code is its own best documentation." — Steve McConnell',
          '"First, solve the problem. Then, write the code." — John Johnson',
          '"Make it work, make it right, make it fast." — Kent Beck'
        ];
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
        this.appendOutput([`<span class="term-purple">${randomQuote}</span>`]);
        break;

      case 'sudo':
        this.appendOutput([
          '<span class="term-red">Permission denied: You are a guest in Samir\'s digital universe. (Nice try though! 🚀)</span>'
        ]);
        break;

      case 'clear':
        this.body.innerHTML = '';
        break;

      default:
        this.appendOutput([
          `<span class="term-red">Command not recognized: '${cmd}'.</span> Type <span class="term-yellow">help</span> for a list of valid commands.`
        ]);
        break;
    }
  }

  runMatrixEffect() {
    this.appendOutput(['<span class="term-green">Initializing Matrix Stream...</span>']);
    let count = 0;
    const interval = setInterval(() => {
      let chars = '';
      for (let i = 0; i < 40; i++) {
        chars += String.fromCharCode(33 + Math.floor(Math.random() * 93));
      }
      const p = document.createElement('div');
      p.className = 'term-matrix-line';
      p.innerText = chars;
      this.body.appendChild(p);
      this.scrollToBottom();
      count++;
      if (count > 12) {
        clearInterval(interval);
        const end = document.createElement('div');
        end.innerHTML = '<span class="term-cyan">Matrix stream decoupled. Reality restored.</span>';
        this.body.appendChild(end);
        this.scrollToBottom();
      }
    }, 80);
  }
}
