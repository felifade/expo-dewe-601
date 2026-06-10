/* ============================================================
   SENSOR DE RITMO CARDÍACO INTELIGENTE — Script Principal
   ============================================================ */

/* ─── 1. MODO OSCURO / CLARO ─────────────────────────────── */

/**
 * Aplica el tema guardado en localStorage al cargar la página.
 * Se llama inmediatamente para evitar parpadeos.
 */
(function initTheme() {
  const saved = localStorage.getItem('heartTheme');
  if (saved === 'light') document.body.classList.add('light');
})();

/** Alterna entre modo oscuro y claro */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light');
  localStorage.setItem('heartTheme', isLight ? 'light' : 'dark');

  // Cambiar ícono del botón
  const btn = document.getElementById('theme-toggle');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';
}

/* ─── 2. MENÚ RESPONSIVE ─────────────────────────────────── */

/** Abre o cierra el menú móvil */
function toggleMenu() {
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  const isOpen = hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open', isOpen);
  document.body.style.overflow = isOpen ? 'hidden' : '';
}

/** Cierra el menú al hacer clic en un enlace */
function closeMobileMenu() {
  const hamburger  = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  document.body.style.overflow = '';
}

/* ─── 3. MARCA EL ENLACE ACTIVO EN LA NAVBAR ─────────────── */
function setActiveNav() {
  const page = location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    link.classList.toggle('active', href === page);
  });
}

/* ─── 4. SIMULACIÓN DE RITMO CARDÍACO ────────────────────── */

/**
 * Genera un BPM aleatorio en el rango dado con variación suave
 * respecto al valor anterior (±8 BPM por lectura).
 */
let lastBPM = 72;

function nextBPM() {
  const delta = Math.floor(Math.random() * 17) - 8; // -8 a +8
  lastBPM = Math.min(110, Math.max(50, lastBPM + delta));
  return lastBPM;
}

/**
 * Determina el estado cardíaco según el BPM:
 *   50-59  → Precaución (bradicardia leve)
 *   60-100 → Normal
 *   101+   → Alerta (taquicardia)
 */
function bpmStatus(bpm) {
  if (bpm < 60)  return { label: '⚠ PRECAUCIÓN',  cls: 'status-warning', color: '#eab308' };
  if (bpm > 100) return { label: '🚨 ALERTA',      cls: 'status-alert',   color: '#ef4444' };
  return              { label: '✔ NORMAL',         cls: 'status-normal',  color: '#22c55e' };
}

/**
 * Actualiza el monitor cardíaco principal del hero (index.html).
 * También ajusta el color del número BPM al estado.
 */
function updateMonitor() {
  const bpmEl    = document.getElementById('bpm-value');
  const statusEl = document.getElementById('status-bar');
  if (!bpmEl || !statusEl) return;

  const bpm    = nextBPM();
  const status = bpmStatus(bpm);

  // Animación de cambio numérico
  bpmEl.style.transform = 'scale(1.15)';
  bpmEl.style.opacity   = '0.5';
  setTimeout(() => {
    bpmEl.textContent       = bpm;
    bpmEl.style.color       = status.color;
    bpmEl.style.transform   = 'scale(1)';
    bpmEl.style.opacity     = '1';
    bpmEl.style.transition  = 'all 0.4s ease';
  }, 150);

  // Actualizar barra de estado
  statusEl.className = 'status-bar ' + status.cls;
  statusEl.textContent = status.label;
}

/**
 * Actualiza el monitor de la página de Desarrollo.
 */
function updateDevMonitor() {
  const el = document.getElementById('bpm-dev');
  if (!el) return;

  const bpm    = nextBPM();
  const status = bpmStatus(bpm);

  el.textContent    = bpm;
  el.style.color    = status.color;
  el.style.transition = 'color 0.5s';

  const bar = document.getElementById('status-dev');
  if (bar) {
    bar.className   = 'status-bar ' + status.cls;
    bar.textContent = status.label;
  }
}

/* ─── 5. FORMULARIO DE CONTACTO ──────────────────────────── */

function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const name  = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const msg   = document.getElementById('message').value.trim();
    const msgEl = document.getElementById('form-msg');

    // Validación básica
    if (!name || !email || !msg) {
      msgEl.textContent = '⚠ Por favor completa todos los campos.';
      msgEl.className   = 'error';
      return;
    }

    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRe.test(email)) {
      msgEl.textContent = '⚠ Ingresa un correo electrónico válido.';
      msgEl.className   = 'error';
      return;
    }

    // Simulación de envío exitoso
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled     = true;
    btn.textContent  = 'Enviando…';

    setTimeout(() => {
      msgEl.textContent = `✔ ¡Mensaje enviado, ${name}! Te responderemos pronto.`;
      msgEl.className   = 'success';
      form.reset();
      btn.disabled    = false;
      btn.textContent = 'Enviar mensaje';

      // Limpiar mensaje tras 5 s
      setTimeout(() => { msgEl.className = ''; msgEl.textContent = ''; }, 5000);
    }, 1200);
  });
}

/* ─── 6. ANIMACIÓN DE ENTRADA DE TARJETAS ────────────────── */

function initScrollAnimations() {
  const cards = document.querySelectorAll(
    '.feat-card, .step-card, .about-card, .contact-item'
  );

  if (!('IntersectionObserver' in window)) {
    cards.forEach(c => c.style.opacity = '1');
    return;
  }

  cards.forEach((card, i) => {
    card.style.opacity    = '0';
    card.style.transform  = 'translateY(24px)';
    card.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  cards.forEach(card => observer.observe(card));
}

/* ─── 7. INICIALIZACIÓN ──────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {
  /* Tema */
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.textContent = document.body.classList.contains('light') ? '🌙' : '☀️';
    themeBtn.addEventListener('click', toggleTheme);
  }

  /* Hamburguesa */
  const hamburger = document.querySelector('.hamburger');
  if (hamburger) hamburger.addEventListener('click', toggleMenu);

  /* Links móviles */
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', closeMobileMenu);
  });

  /* Navegación activa */
  setActiveNav();

  /* Monitor hero (index) */
  if (document.getElementById('bpm-value')) {
    updateMonitor();
    setInterval(updateMonitor, 2000);
  }

  /* Monitor desarrollo */
  if (document.getElementById('bpm-dev')) {
    updateDevMonitor();
    setInterval(updateDevMonitor, 2000);
  }

  /* Formulario */
  initForm();

  /* Animaciones de scroll */
  initScrollAnimations();

  /* Cerrar menú al redimensionar */
  window.addEventListener('resize', () => {
    if (window.innerWidth > 700) closeMobileMenu();
  });
});
