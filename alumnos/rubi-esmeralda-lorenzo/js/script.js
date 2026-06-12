/* ============================================================
   script.js — Proyecto Arduino MAX30102
   Materia: Páginas Web | Estudiante: Rubí Esmeralda Lorenzo Hernández
   Año: 2026
   ============================================================ */

/* ── Configuración general ── */
const CONFIG = {
  bpmMin:        58,    // BPM mínimo en simulación normal
  bpmMax:        95,    // BPM máximo en simulación normal
  bpmExercise:   120,   // BPM durante modo ejercicio
  bpmRest:       58,    // BPM durante reposo
  ecgSpeed:      2.5,   // Velocidad del trazo ECG (px por frame)
  ecgAmplitude:  55,    // Altura del pico QRS
  updateInterval: 2200, // ms entre actualizaciones de BPM
};

/* ── Estado global ── */
let monitoringActive = false;   // Si el monitoreo está activo
let currentBPM       = 75;      // BPM actual
let bpmUpdateTimer   = null;    // Timer de actualización BPM
let ecgAnimId        = null;    // ID del requestAnimationFrame del ECG
let toastTimeout     = null;    // Timer del toast

/* ============================================================
   INICIALIZACIÓN
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavLinks();
  setupMobileMenu();

  /* Solo en index.html */
  if (document.getElementById('ecgCanvas')) {
    initECG();
    startBPMSimulation();
  }
});

/* ============================================================
   MODO CLARO / OSCURO
   ============================================================ */

/**
 * Lee la preferencia guardada en localStorage y aplica el tema
 * al cargar la página.
 */
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  if (saved === 'light') {
    document.body.classList.add('light-mode');
  }
  updateThemeButtons();
}

/**
 * Alterna entre tema oscuro y claro al presionar el botón.
 */
function toggleTheme() {
  const isLight = document.body.classList.toggle('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  updateThemeButtons();
}

/**
 * Actualiza el ícono de todos los botones de tema en la página.
 */
function updateThemeButtons() {
  const isLight = document.body.classList.contains('light-mode');
  document.querySelectorAll('.btn-theme').forEach(btn => {
    btn.textContent = isLight ? '🌙' : '☀️';
    btn.title = isLight ? 'Modo oscuro' : 'Modo claro';
  });
}

/* ============================================================
   NAVEGACIÓN
   ============================================================ */

/**
 * Resalta el enlace activo comparando la URL actual
 * con el href de cada enlace de navegación.
 */
function initNavLinks() {
  const links = document.querySelectorAll('.nav-links a');
  const path  = window.location.pathname;

  links.forEach(link => {
    const href = link.getAttribute('href');
    // Verifica si la ruta actual incluye el nombre del archivo
    if (
      (href === '../index.html' && (path.endsWith('/') || path.endsWith('index.html'))) ||
      (href !== '../index.html' && path.includes(href.replace('../', '')))
    ) {
      link.classList.add('active');
    }
  });
}

/**
 * Abre/cierra el menú de navegación en móvil.
 */
function setupMobileMenu() {
  const btn = document.getElementById('btnMenu');
  const nav = document.getElementById('navLinks');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.textContent = open ? '✕' : '☰';
  });

  /* Cerrar al hacer clic en un enlace */
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.textContent = '☰';
    });
  });
}

/* ============================================================
   ANIMACIÓN ECG
   ============================================================ */

/* Variables internas del ECG */
let ecgX   = 0;       // Posición X del trazo
let ecgY   = 0;       // Posición Y del trazo
let ecgPhase = 0;     // Fase dentro del ciclo cardíaco

/**
 * Inicializa el canvas y arranca la animación del ECG.
 */
function initECG() {
  const canvas = document.getElementById('ecgCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  resizeCanvas(canvas);
  window.addEventListener('resize', () => resizeCanvas(canvas));

  ecgX = 0;
  ecgY = canvas.height / 2;

  drawECGLoop(canvas, ctx);
}

/**
 * Ajusta las dimensiones reales del canvas al tamaño visible.
 */
function resizeCanvas(canvas) {
  canvas.width  = canvas.offsetWidth  || 700;
  canvas.height = canvas.offsetHeight || 120;
}

/**
 * Calcula el desplazamiento vertical del trazo ECG según la fase
 * del ciclo cardíaco (onda P, complejo QRS, onda T).
 * @param {number} phase - Valor entre 0 y 1 que representa el progreso del ciclo
 * @returns {number} desplazamiento en píxeles
 */
function ecgWaveform(phase) {
  const amp = CONFIG.ecgAmplitude;

  /* Onda P — pequeña elevación antes del QRS */
  if (phase < 0.1)  return Math.sin(phase / 0.1 * Math.PI) * (amp * 0.18);

  /* Segmento PQ — línea base */
  if (phase < 0.18) return 0;

  /* Complejo QRS — pico principal */
  if (phase < 0.22) return -Math.sin((phase - 0.18) / 0.04 * Math.PI) * (amp * 0.3);
  if (phase < 0.26) return  Math.sin((phase - 0.22) / 0.04 * Math.PI) * amp;
  if (phase < 0.30) return -Math.sin((phase - 0.26) / 0.04 * Math.PI) * (amp * 0.25);

  /* Segmento ST — pequeña elevación */
  if (phase < 0.38) return (phase - 0.30) / 0.08 * (amp * 0.12);

  /* Onda T — elevación suave */
  if (phase < 0.55) return Math.sin((phase - 0.38) / 0.17 * Math.PI) * (amp * 0.28);

  /* Diástole — línea base */
  return 0;
}

/**
 * Bucle principal de animación del ECG.
 * Avanza el trazo y borra el extremo anterior creando efecto de desplazamiento.
 */
function drawECGLoop(canvas, ctx) {
  const mid = canvas.height / 2;
  const cycleLength = (60 / currentBPM) * 60 * CONFIG.ecgSpeed; // px por ciclo cardíaco

  /* Avanzar fase */
  ecgPhase = (ecgPhase + CONFIG.ecgSpeed / cycleLength) % 1;

  /* Calcular nueva posición Y */
  const newY = mid + ecgWaveform(ecgPhase);

  if (ecgX === 0) {
    /* Primera pasada: iniciar camino */
    ctx.beginPath();
    ctx.moveTo(ecgX, mid);
  }

  /* Borrar franja delantera (efecto de pantalla que avanza) */
  ctx.clearRect(ecgX + 1, 0, 20, canvas.height);

  /* Dibujar segmento */
  ctx.beginPath();
  ctx.moveTo(ecgX, ecgY);
  ctx.lineTo(ecgX + CONFIG.ecgSpeed, newY);
  ctx.strokeStyle = '#f472b6';
  ctx.lineWidth   = 2.2;
  ctx.shadowBlur  = 10;
  ctx.shadowColor = '#f472b6';
  ctx.stroke();

  /* Avanzar posición X; reiniciar al llegar al borde */
  ecgX += CONFIG.ecgSpeed;
  if (ecgX >= canvas.width) {
    ecgX = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  ecgY = newY;

  /* Pedir siguiente frame */
  ecgAnimId = requestAnimationFrame(() => drawECGLoop(canvas, ctx));
}

/* ============================================================
   SIMULACIÓN DINÁMICA DE BPM
   ============================================================ */

/**
 * Arranca la simulación que actualiza los BPM
 * e inicia la visualización.
 */
function startBPMSimulation() {
  updateBPMDisplay();
  bpmUpdateTimer = setInterval(() => {
    if (!monitoringActive) return;
    /* Oscilación aleatoria suave alrededor del valor actual */
    const delta = (Math.random() - 0.5) * 8;
    currentBPM  = Math.round(
      Math.max(CONFIG.bpmMin, Math.min(CONFIG.bpmMax, currentBPM + delta))
    );
    updateBPMDisplay();
    updateHeartRateStatus();
  }, CONFIG.updateInterval);
}

/**
 * Actualiza todos los elementos visuales con el valor de BPM actual.
 */
function updateBPMDisplay() {
  const el = document.getElementById('bpmValue');
  if (el) {
    el.textContent = currentBPM;
    /* Color según rango */
    if      (currentBPM < 60) el.style.color = '#c084fc';  // Bradicardia
    else if (currentBPM > 100) el.style.color = '#fb7185'; // Taquicardia
    else                       el.style.color = '#f472b6'; // Normal
  }
}

/**
 * Actualiza el texto del estado de frecuencia cardíaca.
 */
function updateHeartRateStatus() {
  const el = document.getElementById('rhythmText');
  if (!el) return;

  if      (currentBPM < 60)  el.textContent = 'Bradicardia — Frecuencia baja';
  else if (currentBPM > 100) el.textContent = 'Taquicardia — Frecuencia elevada';
  else                        el.textContent = 'Ritmo Sinusal Normal';

  el.style.color = currentBPM < 60 ? 'var(--cyan)' :
                   currentBPM > 100 ? 'var(--red-alert)' : 'var(--green)';
}

/* ============================================================
   BOTÓN DE MONITOREO
   ============================================================ */

/**
 * Alterna el estado del monitoreo (activo/pausado).
 * Llamado desde el botón en index.html.
 */
function toggleMonitoring() {
  monitoringActive = !monitoringActive;
  const btn  = document.getElementById('btnMonitor');
  const span = btn ? btn.querySelector('span') : null;

  if (monitoringActive) {
    if (span) span.textContent = '⏸ PAUSAR MONITOREO';
    showToast('✅ Monitoreo activo — Leyendo sensor MAX30102');
  } else {
    if (span) span.textContent = '▶ INICIAR MONITOREO';
    showToast('⏸ Monitoreo pausado');
  }
}

/* ============================================================
   TOAST / NOTIFICACIÓN
   ============================================================ */

/**
 * Muestra una notificación temporal en la esquina inferior derecha.
 * @param {string} msg - Mensaje a mostrar
 * @param {number} duration - Duración en ms (por defecto 3500)
 */
function showToast(msg, duration = 3500) {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = msg;
  toast.classList.add('show');

  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), duration);
}

/* ============================================================
   SIMULACIÓN DE DATOS ADICIONALES
   ============================================================ */

/**
 * Genera valores ficticios para SpO2 y temperatura,
 * y los actualiza en el DOM.
 */
function updateExtraMetrics() {
  const spo2El = document.getElementById('spo2Value');
  const tempEl = document.getElementById('tempValue');

  if (spo2El) {
    const spo2 = 96 + Math.floor(Math.random() * 4); // 96–99%
    spo2El.textContent = spo2 + '%';
  }

  if (tempEl) {
    const temp = (36.4 + Math.random() * 0.8).toFixed(1); // 36.4–37.2°C
    tempEl.textContent = temp + '°C';
  }
}

/* Actualizar métricas extra cada 4 segundos */
setInterval(updateExtraMetrics, 4000);
