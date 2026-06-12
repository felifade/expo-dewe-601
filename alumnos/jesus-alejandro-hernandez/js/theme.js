// ============================================
// TEMA CLARO / OSCURO
// ============================================
(function () {
  const root = document.documentElement;
  const btn  = document.getElementById('themeToggle');
  const icon = btn ? btn.querySelector('.theme-icon') : null;

  // Recuperar preferencia guardada
  const saved = localStorage.getItem('timbre-theme');
  const preferred = saved || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  setTheme(preferred);

  if (btn) {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem('timbre-theme', theme);
    if (icon) icon.textContent = theme === 'dark' ? '☀️' : '🌙';
  }
})();
