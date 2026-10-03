/**
 * ==========================================================================
 * 4-YEAR HIGH-PACKAGE IT ROADMAP - CORE JAVASCRIPT
 * Interactive Particles, Strategy Tabs, Terminal Simulator & Checklist Storage
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initParticleCanvas();
  initStrategyTabs();
  initChecklistTracker();
  initTerminalSimulator();
  initMobileMenu();
});

/* --------------------------------------------------------------------------
   1. Interactive Cyber Neural Network Particle Background
   -------------------------------------------------------------------------- */
function initParticleCanvas() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = window.innerWidth < 768 ? 35 : 75;
  const maxDistance = 140;

  let mouse = { x: null, y: null, radius: 150 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.7;
      this.vy = (Math.random() - 0.5) * 0.7;
      this.radius = Math.random() * 2 + 1;
      this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(59, 130, 246, ';
      this.alpha = Math.random() * 0.5 + 0.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      // Mouse gentle interaction
      if (mouse.x != null && mouse.y != null) {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < mouse.radius) {
          const force = (mouse.radius - dist) / mouse.radius;
          this.x -= (dx / dist) * force * 1.5;
          this.y -= (dy / dist) * force * 1.5;
        }
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const opacity = (1 - dist / maxDistance) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(0, 240, 255, ${opacity})`;
          ctx.lineWidth = 0.8;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  animate();
}

/* --------------------------------------------------------------------------
   2. Strategy Tab Switching Logic
   -------------------------------------------------------------------------- */
function initStrategyTabs() {
  const tabs = document.querySelectorAll('.strategy-tab-btn');
  const panels = document.querySelectorAll('.strategy-panel');

  if (!tabs.length) return;

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      panels.forEach((p) => p.classList.remove('active'));

      tab.classList.add('active');
      const targetId = tab.getAttribute('data-target');
      const targetPanel = document.getElementById(targetId);
      if (targetPanel) {
        targetPanel.classList.add('active');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   3. Interactive Milestone Checklist Tracker with LocalStorage
   -------------------------------------------------------------------------- */
function initChecklistTracker() {
  const checklistItems = document.querySelectorAll('.checklist-item');
  const progressPercentText = document.getElementById('progress-percent');
  const progressBar = document.getElementById('progress-bar-fill');

  if (!checklistItems.length) return;

  const storageKey = 'roadmap_checklist_progress_' + (document.body.getAttribute('data-page') || 'global');
  let savedState = {};

  try {
    savedState = JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (e) {
    savedState = {};
  }

  // Restore saved checks
  checklistItems.forEach((item, index) => {
    const itemId = item.getAttribute('data-id') || `item_${index}`;
    if (savedState[itemId]) {
      item.classList.add('completed');
      const checkIcon = item.querySelector('.checklist-checkbox');
      if (checkIcon) checkIcon.innerHTML = '&#10003;';
    }

    item.addEventListener('click', () => {
      const isCompleted = item.classList.toggle('completed');
      const checkIcon = item.querySelector('.checklist-checkbox');
      if (checkIcon) {
        checkIcon.innerHTML = isCompleted ? '&#10003;' : '';
      }
      savedState[itemId] = isCompleted;
      localStorage.setItem(storageKey, JSON.stringify(savedState));
      updateProgress();
    });
  });

  function updateProgress() {
    const total = checklistItems.length;
    const completed = document.querySelectorAll('.checklist-item.completed').length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    if (progressPercentText) progressPercentText.innerText = `${percentage}% Complete`;
    if (progressBar) progressBar.style.width = `${percentage}%`;
  }

  updateProgress();
}

/* --------------------------------------------------------------------------
   4. Interactive Linux Terminal Simulator
   -------------------------------------------------------------------------- */
function initTerminalSimulator() {
  const terminalInput = document.getElementById('term-input');
  const terminalBody = document.getElementById('term-body');

  if (!terminalInput || !terminalBody) return;

  const commands = {
    help: `Available commands:
  - <span style="color:#00f0ff">roadmap</span>: Display the 4-year high-package pipeline
  - <span style="color:#00f0ff">linux</span>: Why Linux mastery is mandatory for Tier-1 engineering
  - <span style="color:#00f0ff">salary</span>: View expected CTC salary range by tier
  - <span style="color:#00f0ff">skills</span>: List the Year 1 Core Systems & Communication checklist
  - <span style="color:#00f0ff">whoami</span>: Display engineer identity
  - <span style="color:#00f0ff">clear</span>: Clear terminal console`,

    roadmap: `[4-YEAR HIGH-PACKAGE PIPELINE]
  Y1: Linux, Shell, Git, Networking, OS & Communication
  Y2: DSA (400+ Problems), LeetCode Medium/Hard, Core CS
  Y3: Full-Stack Microservices, Cloud/Docker, Internships
  Y4: System Design (HLD/LLD), FAANG Mock Prep, CTC Negotiation`,

    linux: `[LINUX DEPTH]
  Modern hyperscale clouds (AWS/GCP/Meta) run on Linux.
  Mastery of Bash, POSIX, Processes, Pipes, SSH, and System Calls
  sets you apart from 95% of generic college graduates.`,

    salary: `[COMPENSATION MATRIX]
  Tier 3 Service: 3.5 - 6.5 LPA
  Tier 2 Product: 12 - 20 LPA
  Tier 1 Unicorn: 22 - 38 LPA
  Tier 1 FAANG / US Remote: 45 - 90+ LPA / $150k+ USD`,

    skills: `[YEAR 1 CHECKLIST]
  [x] Linux Bash scripting & Vim/Nano
  [x] Git branching, PRs & GitHub portfolio
  [x] TCP/IP, DNS, HTTP/3, Sockets & Networks
  [x] Technical Presentation & English articulation`,

    whoami: `Aspiring Elite Software Engineer targeting Tier-1 CTC.`,
    clear: '__CLEAR__'
  };

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const fullCmd = terminalInput.value.trim().toLowerCase();
      terminalInput.value = '';

      if (!fullCmd) return;

      if (fullCmd === 'clear') {
        terminalBody.innerHTML = '';
        return;
      }

      // Append user command line
      const userLine = document.createElement('div');
      userLine.className = 'terminal-line';
      userLine.innerHTML = `<span class="term-prompt">engineer@antigravity:~$</span> <span class="term-cmd">${escapeHTML(fullCmd)}</span>`;
      terminalBody.appendChild(userLine);

      // Append response
      const responseLine = document.createElement('div');
      responseLine.className = 'terminal-line term-output';

      if (commands[fullCmd]) {
        responseLine.innerHTML = commands[fullCmd];
      } else {
        responseLine.innerHTML = `<span style="color:#ef4444">zsh: command not found: ${escapeHTML(fullCmd)}. Type 'help' for available commands.</span>`;
      }

      terminalBody.appendChild(responseLine);
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }
  });

  function escapeHTML(str) {
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
}

/* --------------------------------------------------------------------------
   5. Mobile Menu Toggle
   -------------------------------------------------------------------------- */
function initMobileMenu() {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  if (!menuBtn || !navLinks) return;

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}
