/* ================================================
   RTH BITÁCORA — JAVASCRIPT INTERACTIVO
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- 1. FECHA AUTOMÁTICA ----
  const fechaEl = document.getElementById('fechaHoy');
  const footerYear = document.getElementById('footerYear');
  const now = new Date();
  const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
  if (fechaEl) fechaEl.textContent = now.toLocaleDateString('es-MX', opciones);
  if (footerYear) footerYear.textContent = now.getFullYear();


  // ---- 2. SIGNAL BARS ANIMATION ----
  const signalContainer = document.getElementById('signalBars');
  if (signalContainer) {
    for (let i = 0; i < 80; i++) {
      const bar = document.createElement('span');
      signalContainer.appendChild(bar);
    }
  }


  // ---- 3. NAV STICKY SHADOW ----
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (nav) {
      nav.classList.toggle('scrolled', window.scrollY > 80);
    }
  });


  // ---- 4. MOBILE MENU ----
  const menuBtn    = document.getElementById('menuBtn');
  const menuClose  = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const mmLinks    = document.querySelectorAll('.mm-link');

  function openMenu()  { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; }

  if (menuBtn)   menuBtn.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  mmLinks.forEach(l => l.addEventListener('click', closeMenu));


  // ---- 5. SCROLL REVEAL (IntersectionObserver) ----
  const revealEls = document.querySelectorAll('[data-reveal], .timeline__item, .obj-card, .av-item, .prob-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));


  // ---- 6. COUNTER ANIMATION ----
  function animateCounter(el, target, duration = 1600) {
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = start;
      }
    }, 16);
  }

  const statsObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target, 10);
        animateCounter(el, target);
        statsObs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.av-stat__num[data-target]').forEach(el => statsObs.observe(el));


  // ---- 7. CARGA DE IMÁGENES ----
  document.querySelectorAll('.img-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const targetId = input.dataset.target;
      const imgEl = document.getElementById(targetId);
      const placeholder = input.closest('.img-placeholder');

      const reader = new FileReader();
      reader.onload = (ev) => {
        imgEl.src = ev.target.result;
        imgEl.classList.remove('hidden');
        if (placeholder) placeholder.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  });


  // ---- 8. GUARDAR DATOS DEL ALUMNO ----
  const inputNombre = document.getElementById('inputNombre');
  const inputGrupo  = document.getElementById('inputGrupo');
  const guardarBtn  = document.getElementById('guardarDatos');
  const alumnoNombreEl = document.getElementById('alumnoNombre');
  const alumnoGrupoEl  = document.getElementById('alumnoGrupo');

  // Cargar de localStorage si existen
  if (localStorage.getItem('rth_nombre') && alumnoNombreEl) {
    alumnoNombreEl.textContent = localStorage.getItem('rth_nombre');
  }
  if (localStorage.getItem('rth_grupo') && alumnoGrupoEl) {
    alumnoGrupoEl.textContent = localStorage.getItem('rth_grupo');
  }

  if (guardarBtn) {
    guardarBtn.addEventListener('click', () => {
      const nombre = inputNombre.value.trim();
      const grupo  = inputGrupo.value.trim();

      if (nombre && alumnoNombreEl) {
        alumnoNombreEl.textContent = nombre;
        localStorage.setItem('rth_nombre', nombre);
      }
      if (grupo && alumnoGrupoEl) {
        alumnoGrupoEl.textContent = grupo;
        localStorage.setItem('rth_grupo', grupo);
      }

      // Feedback visual
      guardarBtn.textContent = '✓ Guardado';
      guardarBtn.style.background = '#1e8a44';
      setTimeout(() => {
        guardarBtn.textContent = 'Guardar datos ↗';
        guardarBtn.style.background = '';
      }, 2000);

      // Scroll suave al hero
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }


  // ---- 9. ACTIVE NAV HIGHLIGHT on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__links a');

  const sectionObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.style.color = link.getAttribute('href') === `#${id}`
            ? 'var(--rth-red)'
            : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObs.observe(s));


  // ---- 10. TYPEWRITER en badge ----
  const badge = document.querySelector('.hero__badge');
  if (badge) {
    const texts = ['EN VIVO', 'DUAL RTH', 'BITÁCORA', 'EN VIVO'];
    let i = 0;
    setInterval(() => {
      i = (i + 1) % texts.length;
      badge.textContent = texts[i];
    }, 2500);
  }

});