// ================================================================
// SCRIPT PRINCIPAL — Monitor de Ritmo Cardíaco con Arduino
// Sensor MAX30102 | Autor: Jared Martínez Santiago
// Materia: Páginas Web | Año: 2026
// ================================================================


// ================================================================
// 1. MODO CLARO / OSCURO
//    Alterna entre tema oscuro (predeterminado) y tema claro
// ================================================================

const themeButtons = document.querySelectorAll('.btn-theme');

/** Cambia el tema y guarda la preferencia del usuario */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');

  themeButtons.forEach(btn => {
    const icon = btn.querySelector('.theme-icon');
    const text = btn.querySelector('.theme-text');
    if (icon) icon.textContent = isLight ? '🌑' : '☀️';
    if (text) text.textContent = isLight ? 'Modo Oscuro' : 'Modo Claro';
  });

  localStorage.setItem('theme', isLight ? 'light' : 'dark');
}

/** Al cargar la página, aplica el tema que el usuario tenía guardado */
function loadTheme() {
  if (localStorage.getItem('theme') === 'light') {
    document.body.classList.add('light-mode');
    themeButtons.forEach(btn => {
      const icon = btn.querySelector('.theme-icon');
      const text = btn.querySelector('.theme-text');
      if (icon) icon.textContent = '🌑';
      if (text) text.textContent = 'Modo Oscuro';
    });
  }
}

themeButtons.forEach(btn => btn.addEventListener('click', toggleTheme));
loadTheme();


// ================================================================
// 2. MENÚ HAMBURGUESA (para pantallas pequeñas)
// ================================================================

const hamburger = document.querySelector('.hamburger');
const navMenu   = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Cerrar el menú al hacer clic en un enlace
  navMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navMenu.classList.remove('open'));
  });
}


// ================================================================
// 3. RESALTAR ENLACE ACTIVO EN LA NAVEGACIÓN
//    Compara la URL actual con cada enlace del menú
// ================================================================

(function highlightActiveLink() {
  const current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-menu a').forEach(link => {
    if (link.getAttribute('href').split('/').pop() === current) {
      link.classList.add('active');
    }
  });
})();


// ================================================================
// 4. ANIMACIÓN ECG (Electrocardiograma)
//    Dibuja la onda característica del latido cardíaco en un canvas
// ================================================================

/**
 * Inicia la animación del ECG en un elemento <canvas>
 * @param {string}  canvasId  - ID del canvas en el HTML
 * @param {string}  color     - Color de la línea ('green' o 'blue')
 * @param {number}  amplitude - Altura máxima de los picos
 * @param {number}  speed     - Píxeles que avanza por frame
 */
function startECG(canvasId, color = 'green', amplitude = 1, speed = 2) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;                        // Salir si no existe el canvas

  const ctx    = canvas.getContext('2d');

  // Ajustar resolución del canvas al tamaño CSS real
  function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Colores según el modo claro/oscuro
  const colorMap = {
    green: { line: '#00ff88', glow: 'rgba(0,255,136,0.5)' },
    blue:  { line: '#00cfff', glow: 'rgba(0,207,255,0.5)' }
  };

  // Forma de la onda ECG (curva P, complejo QRS, onda T)
  // Cada entrada es [x relativo 0-1, y relativo -1 a 1]
  const ecgShape = [
    [0.00,  0.00], [0.05,  0.00], [0.10,  0.10], [0.15,  0.05],  // Onda P
    [0.20,  0.00], [0.25, -0.10], [0.30,  1.00], [0.35, -0.40],  // Complejo QRS
    [0.40,  0.00], [0.50,  0.20], [0.60,  0.10], [0.70,  0.00],  // Onda T
    [0.85,  0.00], [1.00,  0.00]                                  // Línea basal
  ];

  let offset = 0;           // Desplazamiento horizontal de la onda
  const trailLength = 300;  // Longitud del rastro visible en píxeles
  const points = [];        // Array que almacena los puntos a dibujar

  /** Calcula la altura Y de la onda en una posición X dada */
  function getWaveY(x) {
    // Periodo de la onda (ajustado al ancho del canvas)
    const period  = canvas.width * 0.55;
    // Posición dentro de un ciclo (0 a 1)
    const phase   = ((x % period) + period) % period / period;

    // Interpolar entre los puntos predefinidos de la forma ECG
    for (let i = 0; i < ecgShape.length - 1; i++) {
      const [x0, y0] = ecgShape[i];
      const [x1, y1] = ecgShape[i + 1];
      if (phase >= x0 && phase < x1) {
        const t = (phase - x0) / (x1 - x0);
        return (y0 + t * (y1 - y0)) * amplitude;
      }
    }
    return 0;
  }

  /** Dibuja un frame del ECG */
  function drawFrame() {
    const W = canvas.width;
    const H = canvas.height;
    const cy = H / 2;  // Centro vertical

    // Limpiar canvas con un fondo semitransparente (efecto de rastro)
    ctx.fillStyle = 'rgba(2, 13, 16, 0.22)';
    ctx.fillRect(0, 0, W, H);

    // Agregar un nuevo punto al final del rastro
    const newY = cy - getWaveY(offset) * (H * 0.38);
    points.push({ x: W - 1, y: newY });

    // Desplazar todos los puntos hacia la izquierda
    for (let i = 0; i < points.length; i++) {
      points[i].x -= speed;
    }

    // Eliminar puntos que ya salieron de la pantalla
    while (points.length > 0 && points[0].x < 0) {
      points.shift();
    }

    if (points.length < 2) { offset += speed; requestAnimationFrame(drawFrame); return; }

    // Dibujar la línea del ECG con efecto de brillo
    ctx.shadowBlur  = 12;
    ctx.shadowColor = colorMap[color].glow;
    ctx.strokeStyle = colorMap[color].line;
    ctx.lineWidth   = 1.8;
    ctx.lineJoin    = 'round';
    ctx.lineCap     = 'round';

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    // Dibujar con degradado de opacidad (más brillante al frente)
    for (let i = 1; i < points.length; i++) {
      const alpha = i / points.length;   // 0 = fondo, 1 = frente
      ctx.globalAlpha = alpha;
      ctx.lineTo(points[i].x, points[i].y);
    }

    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.shadowBlur  = 0;

    offset += speed;
    requestAnimationFrame(drawFrame);  // Solicitar el siguiente frame
  }

  drawFrame();  // Iniciar la animación
}


// ================================================================
// 5. SIMULACIÓN DINÁMICA DEL BPM
//    Cambia el valor de BPM de forma aleatoria y realista
// ================================================================

let bpmRunning    = false;   // Estado del monitor (activo/inactivo)
let bpmInterval   = null;    // Referencia al intervalo de actualización
let currentBPM    = 72;      // Valor inicial de BPM

/**
 * Genera un BPM aleatorio cercano al valor actual (simula variabilidad real)
 * @param {number} base - Valor base de BPM
 */
function getRandomBPM(base) {
  const delta = (Math.random() - 0.5) * 6;  // ±3 BPM de variación
  const newBPM = Math.round(base + delta);
  return Math.max(50, Math.min(120, newBPM)); // Limitar entre 50 y 120 BPM
}

/** Actualiza el texto del BPM en pantalla y ajusta el color según el valor */
function updateBPMDisplay(bpm) {
  const bpmEl = document.getElementById('bpmValue');
  if (!bpmEl) return;

  bpmEl.textContent = bpm;

  // Cambiar color según si el BPM es normal, alto o bajo
  if (bpm >= 60 && bpm <= 100) {
    bpmEl.style.color = 'var(--neon-green)';
    bpmEl.style.textShadow = 'var(--glow-green)';
    updateStatus('RITMO NORMAL — Sistema operando correctamente', 'normal');
  } else if (bpm > 100) {
    bpmEl.style.color = 'var(--red-alert)';
    bpmEl.style.textShadow = '0 0 16px var(--red-alert)';
    updateStatus('TAQUICARDIA DETECTADA — Frecuencia elevada', 'alert');
  } else {
    bpmEl.style.color = 'var(--amber)';
    bpmEl.style.textShadow = '0 0 16px var(--amber)';
    updateStatus('BRADICARDIA DETECTADA — Frecuencia baja', 'warning');
  }
}

/** Actualiza el texto de estado del monitor */
function updateStatus(msg, type) {
  const statusEl = document.getElementById('patientStatus');
  if (!statusEl) return;
  statusEl.textContent = msg;

  const dot = document.querySelector('.status-dot');
  if (dot) {
    dot.style.background =
      type === 'alert'   ? 'var(--red-alert)' :
      type === 'warning' ? 'var(--amber)'      :
                           'var(--neon-green)';
    dot.style.boxShadow = dot.style.background.replace('var(', '0 0 6px var(');
  }
}

/** Inicia o detiene la simulación del monitor al hacer clic en el botón */
function toggleMonitor() {
  const btn = document.getElementById('btnMonitor');
  if (!btn) return;

  bpmRunning = !bpmRunning;

  if (bpmRunning) {
    // Iniciar simulación: actualizar cada 1.4 segundos
    bpmInterval = setInterval(() => {
      currentBPM = getRandomBPM(currentBPM);
      updateBPMDisplay(currentBPM);
    }, 1400);

    btn.textContent = '⏹ DETENER MONITOREO';
    btn.classList.add('running');
    updateStatus('MONITOREO ACTIVO — Leyendo sensor MAX30102...', 'normal');

  } else {
    // Detener simulación
    clearInterval(bpmInterval);
    btn.textContent = '▶ INICIAR MONITOREO';
    btn.classList.remove('running');
    updateStatus('SISTEMA EN ESPERA — Presione Iniciar para comenzar', 'normal');
  }
}

// Asignar evento al botón de monitoreo
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('btnMonitor');
  if (btn) btn.addEventListener('click', toggleMonitor);

  // Mostrar BPM inicial
  updateBPMDisplay(currentBPM);
});


// ================================================================
// 6. INICIAR ANIMACIONES ECG AL CARGAR
// ================================================================

document.addEventListener('DOMContentLoaded', function () {
  // Canal 1: ondas QRS (verde)
  startECG('ecgCanvas',  'green', 1.0, 2.2);
  // Canal 2: SpO2 / onda más suave (azul)
  startECG('ecgCanvas2', 'blue',  0.5, 2.2);
});


// ================================================================
// 7. ANIMACIONES DE REVEAL AL HACER SCROLL
//    Hace aparecer los elementos cuando el usuario llega a ellos
// ================================================================

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', initReveal);


// ================================================================
// 8. ANIMAR BARRAS DE PROGRESO AL APARECER EN PANTALLA
// ================================================================

function initBars() {
  const bars = document.querySelectorAll('.bar-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          setTimeout(() => { bar.style.width = bar.dataset.width || '0%'; }, 150);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.3 }
  );

  bars.forEach(bar => observer.observe(bar));
}

document.addEventListener('DOMContentLoaded', initBars);


// ================================================================
// 9. RELOJ EN TIEMPO REAL (para el monitor de hospital)
// ================================================================

function updateClock() {
  const clockEl = document.getElementById('monitorClock');
  if (!clockEl) return;

  const now  = new Date();
  const hh   = String(now.getHours()).padStart(2, '0');
  const mm   = String(now.getMinutes()).padStart(2, '0');
  const ss   = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hh}:${mm}:${ss}`;
}

setInterval(updateClock, 1000);
document.addEventListener('DOMContentLoaded', updateClock);


// ================================================================
// 10. MENSAJE EN CONSOLA PARA DESARROLLADORES
// ================================================================
console.log('%c💚 Monitor Cardíaco MAX30102 + Arduino', 'font-size:15px; font-weight:bold; color:#00ff88;');
console.log('%c Jared Martínez Santiago — Páginas Web 2026', 'color:#00cfff; font-size:12px;');
