// ════════════════════════════════════════
//  anima.js — Animaciones globales
// ════════════════════════════════════════

// ── LOADER ──
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const bar = document.getElementById('loader-bar');
  if (bar) bar.style.width = '100%';
  setTimeout(() => { loader.style.opacity = '0'; }, 800);
  setTimeout(() => { loader.style.display = 'none'; }, 1300);
});

// ── CURSOR ──
const cursor = document.getElementById('cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
  document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(1.8)');
  document.addEventListener('mouseup',   () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');
}

// ── COUNTERS ──
const counters = document.querySelectorAll('.stat-num');
if (counters.length) {
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.dataset.target;
      let count    = 0;
      const step   = Math.ceil(target / 40);
      const timer  = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(timer); }
        el.textContent = count;
      }, 40);
      counterObs.unobserve(el);
    });
  });
  counters.forEach(c => counterObs.observe(c));
}

// ── REVEAL ON SCROLL ──
const revealEls = document.querySelectorAll('.reveal');
if (revealEls.length) {
  const revealObs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
      }
    });
  }, { threshold: 0.1 });
  revealEls.forEach(el => revealObs.observe(el));
}

// ── NAV SCROLL SHADOW ──
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 20
      ? '0 4px 30px rgba(0,0,0,.4)'
      : 'none';
  });
}
