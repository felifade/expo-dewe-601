// ============================================
// PAGES.JS — Interactividad páginas internas
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // -- ACCORDION --
  document.querySelectorAll('.acc-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.acc-item');
      const isOpen = item.classList.contains('open');
      // Cerrar todos
      document.querySelectorAll('.acc-item').forEach(i => i.classList.remove('open'));
      // Abrir el clickeado si estaba cerrado
      if (!isOpen) item.classList.add('open');
    });
  });

  // -- GALLERY FILTER --
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      galleryItems.forEach(item => {
        if (filter === 'all' || item.dataset.cat === filter) {
          item.classList.remove('hidden');
          item.style.animation = 'fadeIn .35s ease forwards';
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // -- GALLERY MODAL --
  const overlay  = document.getElementById('modalOverlay');
  const modalContent = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const svg = item.querySelector('svg');
      if (svg && overlay && modalContent) {
        modalContent.innerHTML = svg.outerHTML;
        overlay.classList.add('open');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('open'));
  }
  if (overlay) {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) overlay.classList.remove('open');
    });
  }

  // -- TIMELINE SCROLL ANIMATION --
  const timelineItems = document.querySelectorAll('.timeline-item');
  if (timelineItems.length) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    timelineItems.forEach((item, i) => {
      item.style.transitionDelay = `${i * 0.1}s`;
      obs.observe(item);
    });
  }

  // -- CONTACT FORM --
  const sendBtn = document.getElementById('sendBtn');
  const formSuccess = document.getElementById('formSuccess');

  if (sendBtn) {
    sendBtn.addEventListener('click', () => {
      const nombre  = document.getElementById('nombre')?.value.trim();
      const email   = document.getElementById('email')?.value.trim();
      const mensaje = document.getElementById('mensaje')?.value.trim();

      if (!nombre || !email || !mensaje) {
        alert('Por favor completa todos los campos antes de enviar.');
        return;
      }

      // Simular envío
      sendBtn.textContent = 'Enviando...';
      sendBtn.disabled = true;

      setTimeout(() => {
        sendBtn.textContent = 'Enviar mensaje';
        sendBtn.disabled = false;
        formSuccess.classList.add('show');
        document.getElementById('nombre').value = '';
        document.getElementById('email').value = '';
        document.getElementById('mensaje').value = '';
        setTimeout(() => formSuccess.classList.remove('show'), 4000);
      }, 1200);
    });
  }

});
