/* =============================================
   TIMBRE AUTOMÁTICO — JavaScript principal
   ============================================= */

// ---- GESTIÓN DEL TEMA ----
const THEME_KEY = 'theme-preference';

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.body.classList.toggle('dark', saved === 'dark');
  updateThemeIcon(saved);

  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', () => {
      const isDark = document.body.classList.contains('dark');
      const newTheme = isDark ? 'light' : 'dark';
      document.body.classList.toggle('dark');
      localStorage.setItem(THEME_KEY, newTheme);
      updateThemeIcon(newTheme);
    });
  }
}

function updateThemeIcon(theme) {
  const toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.setAttribute('aria-label', theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro');
  }
}

// ---- NAVEGACIÓN ----
function initNav() {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
      });
    });
  }

  // Marca el link activo
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = a.getAttribute('href').split('/').pop();
    if (href === path) a.classList.add('active');
  });
}

// ---- REVEAL ON SCROLL ----
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  els.forEach(el => observer.observe(el));
}

// ---- ANIMACIÓN DE CONTADORES ----
function animateCounter(el, target, duration = 1500) {
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);
    const value = Math.floor(ease * target);
    el.textContent = value.toLocaleString('es-MX');
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString('es-MX') + (el.dataset.suffix || '');
  };
  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const count = parseInt(e.target.dataset.count);
        animateCounter(e.target, count);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// ---- TABS ----
function initTabs() {
  const tabBtns = document.querySelectorAll('[data-tab]');
  const tabPanels = document.querySelectorAll('[data-panel]');

  if (!tabBtns.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabBtns.forEach(b => {
        b.classList.toggle('active', b.dataset.tab === target);
      });
      tabPanels.forEach(p => {
        p.classList.toggle('active', p.dataset.panel === target);
      });
    });
  });
}

// ---- ESTILOS DE REVEAL ----
(function injectStyles() {
  if (document.getElementById('custom-styles')) return;
  const style = document.createElement('style');
  style.id = 'custom-styles';
  style.textContent = `
    .reveal { opacity: 0; transform: translateY(20px); transition: opacity .5s ease, transform .5s ease; }
    .reveal.revealed { opacity: 1; transform: none; }
    .reveal:nth-child(2) { transition-delay: .1s; }
    .reveal:nth-child(3) { transition-delay: .2s; }
    .reveal:nth-child(4) { transition-delay: .3s; }
    [data-panel] { display: none; }
    [data-panel].active { display: block; animation: fadeIn .3s ease; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    [data-tab] { cursor: pointer; padding: .6rem 1.2rem; border-radius: 10px; border: 1px solid var(--border); background: transparent; color: var(--text-muted); font-family: var(--font-sans); font-size: .9rem; font-weight: 500; transition: all .2s; }
    [data-tab].active, [data-tab]:hover { background: var(--primary); color: white; border-color: var(--primary); }
    .tabs-container { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: 2rem; border-bottom: 1px solid var(--border); padding-bottom: 0; }
  `;
  document.head.appendChild(style);
})();

// ---- INICIALIZAR ----
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNav();
  initReveal();
  initCounters();
  initTabs();
});
