window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (!loader) return;
  const bar = document.getElementById('loader-bar');
  if (bar) bar.style.width = '100%';
  setTimeout(() => { loader.style.opacity = '0'; }, 800);
  setTimeout(() => { loader.style.display = 'none'; }, 1300);
});

const cursor = document.getElementById('cursor');
if (cursor) {
  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
  });
}

const counters = document.querySelectorAll('.stat-num');
if (counters.length) {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = +el.dataset.target;
      let count = 0;
      const step = Math.ceil(target / 40);
      const t = setInterval(() => {
        count += step;
        if (count >= target) { count = target; clearInterval(t); }
        el.textContent = count;
      }, 40);
      obs.unobserve(el);
    });
  });
  counters.forEach(c => obs.observe(c));
}

document.querySelectorAll('.reveal').forEach(el =>
  new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: .1 }).observe(el)
);

const nav = document.querySelector('nav');
if (nav) window.addEventListener('scroll', () => {
  nav.style.boxShadow = window.scrollY > 20 ? '0 4px 30px rgba(0,0,0,.4)' : 'none';
});