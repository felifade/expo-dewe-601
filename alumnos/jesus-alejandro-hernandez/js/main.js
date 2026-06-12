// ============================================
// MAIN.JS — INTERACTIVIDAD PÁGINA PRINCIPAL
// ============================================

// -- Contador animado de estadísticas --
function animateCounters() {
  const counters = document.querySelectorAll('.stat-num');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const dur    = 1200;
      const step   = 16;
      const inc    = target / (dur / step);
      let current  = 0;

      const timer = setInterval(() => {
        current += inc;
        if (current >= target) {
          current = target;
          clearInterval(timer);
        }
        el.textContent = Math.floor(current);
      }, step);

      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

// -- Tabs de componentes --
function initComponentTabs() {
  const buttons = document.querySelectorAll('.comp-btn');
  const details = document.querySelectorAll('.comp-detail');
  if (!buttons.length) return;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      details.forEach(d => d.classList.remove('active'));

      btn.classList.add('active');
      const target = document.getElementById(btn.dataset.comp);
      if (target) target.classList.add('active');
    });
  });
}

// -- Animación de cards al aparecer --
function initCardAnimations() {
  const cards = document.querySelectorAll('.feature-card');
  if (!cards.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card  = entry.target;
        const delay = card.dataset.delay || 0;
        setTimeout(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
          card.style.transition = 'opacity .5s ease, transform .5s ease';
        }, parseInt(delay));
        observer.unobserve(card);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(c => observer.observe(c));
}

// -- Init --
document.addEventListener('DOMContentLoaded', () => {
  animateCounters();
  initComponentTabs();
  initCardAnimations();
});
