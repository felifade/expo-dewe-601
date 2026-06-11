/* ================================================
   RTH DUAL — JAVASCRIPT INTERACTIVO
   ================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // 1. SIGNAL BARS
  const sb = document.getElementById('signalBars');
  if (sb) { for (let i = 0; i < 80; i++) sb.appendChild(document.createElement('span')); }

  // 2. NAV STICKY
  const nav = document.getElementById('mainNav');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 80);
  });

  // 3. MOBILE MENU
  const menuBtn    = document.getElementById('menuBtn');
  const menuClose  = document.getElementById('menuClose');
  const mobileMenu = document.getElementById('mobileMenu');
  const mmLinks    = document.querySelectorAll('.mm-link');
  const openMenu   = () => { mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu  = () => { mobileMenu.classList.remove('open'); document.body.style.overflow = ''; };
  if (menuBtn)   menuBtn.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  mmLinks.forEach(l => l.addEventListener('click', closeMenu));

  // 4. SCROLL REVEAL — actividades
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.act-section').forEach(el => revealObs.observe(el));

  // 5. ACTIVE NAV LINK
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav__links a');
  const activeObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.getAttribute('id');
        navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${id}`));
      }
    });
  }, { threshold: 0.45 });
  sections.forEach(s => activeObs.observe(s));

  // 6. LIVE BADGE CYCLE
  const badge = document.getElementById('liveBadge');
  if (badge) {
    const texts = ['EN VIVO', 'DUAL RTH', 'REPORTE', 'EN VIVO'];
    let i = 0;
    setInterval(() => { i = (i + 1) % texts.length; badge.textContent = texts[i]; }, 2500);
  }

  // 7. COUNTER ANIMATION
  function animCount(el, target, dur = 1400) {
    let v = 0;
    const step = Math.max(1, Math.ceil(target / (dur / 16)));
    const t = setInterval(() => {
      v += step;
      if (v >= target) { el.textContent = target; clearInterval(t); }
      else el.textContent = v;
    }, 16);
  }
  const cntObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        animCount(e.target, parseInt(e.target.dataset.target));
        cntObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.rs__n[data-target]').forEach(el => cntObs.observe(el));

  // 8. SUBIR IMÁGENES
  document.querySelectorAll('.img-input').forEach(input => {
    input.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const imgEl = document.getElementById(input.dataset.img);
      const phEl  = document.getElementById(input.dataset.ph);
      const reader = new FileReader();
      reader.onload = (ev) => {
        imgEl.src = ev.target.result;
        imgEl.classList.remove('hidden');
        if (phEl) phEl.style.display = 'none';
      };
      reader.readAsDataURL(file);
    });
  });

});