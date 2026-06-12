/* Genera la barra de navegación en todas las páginas */
(function() {
  const isRoot = !window.location.pathname.includes('/paginas/');
  const base = isRoot ? '' : '../';

  const nav = `
  <nav class="navbar">
    <a href="${base}index.html" class="nav-brand">
      <div class="nav-logo">🔔</div>
      <span>Timbre Automático</span>
    </a>
    <ul class="nav-links">
      <li><a href="${base}index.html">Inicio</a></li>
      <li><a href="${base}paginas/desarrollo.html">Desarrollo</a></li>
      <li><a href="${base}paginas/galeria.html">Galería</a></li>
      <li><a href="${base}paginas/acerca.html">Acerca de</a></li>
    </ul>
    <div class="nav-right">
      <button id="theme-toggle" class="theme-toggle" aria-label="Cambiar tema"></button>
      <button class="nav-toggle" aria-label="Menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </nav>`;

  document.write(nav);
})();
