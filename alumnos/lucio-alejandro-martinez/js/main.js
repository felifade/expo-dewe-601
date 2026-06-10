/* ============================================================
   TIMBRE ARDUINO - JavaScript Principal
   ============================================================ */

/* ---------- Theme toggle ---------- */
const html = document.documentElement;
const themeBtn = document.getElementById('theme-toggle');
const THEME_KEY = 'timbre-theme';

function applyTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem(THEME_KEY, t);
}

const saved = localStorage.getItem(THEME_KEY) ||
  (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
applyTheme(saved);

themeBtn?.addEventListener('click', () => {
  applyTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
});

/* ---------- Hamburger nav ---------- */
const hamburger = document.querySelector('.hamburger');
const mobileMenu = document.querySelector('.mobile-menu');

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

// Close on link click
document.querySelectorAll('.mobile-menu a').forEach(a =>
  a.addEventListener('click', () => {
    hamburger?.classList.remove('open');
    mobileMenu?.classList.remove('open');
  })
);

/* ---------- Active nav link ---------- */
function setActive() {
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === path ||
      (path === 'index.html' && a.getAttribute('href') === '#'));
  });
}
setActive();

/* ---------- Floating particles ---------- */
function createParticles() {
  const container = document.querySelector('.particles');
  if (!container) return;
  const count = 18;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.width = p.style.height = (2 + Math.random() * 3) + 'px';
    container.appendChild(p);
  }
}
createParticles();

/* ---------- Scroll reveal (fade-in) ---------- */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

/* ---------- Accordion / FAQ ---------- */
document.querySelectorAll('.acc-header').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.acc-item');
    const body = item.querySelector('.acc-body');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.acc-item.open').forEach(open => {
      open.classList.remove('open');
      open.querySelector('.acc-body').style.maxHeight = '0';
    });

    if (!isOpen) {
      item.classList.add('open');
      body.style.maxHeight = body.scrollHeight + 'px';
    }
  });
});

/* ---------- Copy code buttons ---------- */
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const code = btn.closest('.code-block')?.querySelector('pre')?.innerText || '';
    navigator.clipboard.writeText(code).then(() => {
      const orig = btn.textContent;
      btn.textContent = '✓ Copiado';
      btn.style.color = 'var(--green)';
      btn.style.borderColor = 'var(--green)';
      setTimeout(() => {
        btn.textContent = orig;
        btn.style.color = '';
        btn.style.borderColor = '';
      }, 2000);
    });
  });
});

/* ---------- Toast notification ---------- */
function showToast(msg, dur = 3000) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), dur);
}

/* ---------- Sound / Doorbell button ---------- */
const soundBtn = document.getElementById('sound-btn');
let audioCtx = null;

function playBell() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const freqs = [880, 660, 440, 330];
  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.value = freq;
    const start = audioCtx.currentTime + i * 0.18;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.25, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, start + 0.5);
    osc.start(start);
    osc.stop(start + 0.55);
  });
}

soundBtn?.addEventListener('click', () => {
  playBell();
  soundBtn.classList.add('ringing');
  soundBtn.textContent = '🔔';
  showToast('¡Din-don! Timbre activado 🔔');
  setTimeout(() => {
    soundBtn.classList.remove('ringing');
    soundBtn.textContent = '🔕';
    setTimeout(() => soundBtn.textContent = '🔔', 2500);
  }, 1500);
});

/* ---------- Contact form ---------- */
const contactForm = document.getElementById('contact-form');
contactForm?.addEventListener('submit', e => {
  e.preventDefault();
  const btn = contactForm.querySelector('[type="submit"]');
  const orig = btn.textContent;
  btn.textContent = '⏳ Enviando…';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = '✓ Enviado';
    btn.style.background = 'var(--green)';
    showToast('¡Mensaje enviado! Te responderemos pronto.');
    contactForm.reset();
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  }, 1400);
});

/* ---------- Counter animation ---------- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const dur = 1800;
  const step = 16;
  const increment = target / (dur / step);
  let current = 0;
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) { current = target; clearInterval(timer); }
    el.textContent = Math.floor(current) + (el.dataset.suffix || '');
  }, step);
}

const statNums = document.querySelectorAll('.stat-num[data-target]');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      statsObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });
statNums.forEach(el => statsObserver.observe(el));

/* ---------- Smooth scroll for anchor links ---------- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
