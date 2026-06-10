// ==========================================
// SmartBell — JavaScript principal
// ==========================================

// --- CUSTOM CURSOR ---
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursorRing');
let rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX - 6 + 'px';
  cursor.style.top = e.clientY - 6 + 'px';
  rx += (e.clientX - 18 - rx) * 0.12;
  ry += (e.clientY - 18 - ry) * 0.12;
  ring.style.left = rx + 'px';
  ring.style.top = ry + 'px';
});
requestAnimationFrame(function loop() { requestAnimationFrame(loop); });

// --- SCROLL REVEAL ---
const revealEls = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      e.target.style.transitionDelay = (i % 4) * 0.1 + 's';
      e.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });
revealEls.forEach(el => io.observe(el));

// --- WAVEFORM ANIMATION ---
setInterval(() => {
  document.querySelectorAll('#waveform .wave-bar').forEach(b => {
    b.style.height = (Math.random() * 22 + 4) + 'px';
  });
  const vis = document.getElementById('recordingVis');
  if (vis && vis.classList.contains('visible')) {
    document.querySelectorAll('#recWaveform .wave-bar').forEach(b => {
      b.style.height = (Math.random() * 22 + 4) + 'px';
    });
  }
}, 120);

// --- TIMESTAMP HUD ---
function updateTimestamp() {
  const el = document.getElementById('camTimestamp');
  if (el) {
    const n = new Date();
    el.textContent = n.toLocaleTimeString('es-MX', { hour12: false }) + '  ' + n.toLocaleDateString('es-MX');
  }
}
setInterval(updateTimestamp, 1000);
updateTimestamp();

// ==========================================
// CAMERA LOGIC
// ==========================================
let camStream = null;
let facingMode = 'user';
let isMirrored = true;
let cameraActive = false;

async function startCamera() {
  if (camStream) stopCamera();
  try {
    const constraints = {
      video: { facingMode: facingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
      audio: false
    };
    camStream = await navigator.mediaDevices.getUserMedia(constraints);
    const video = document.getElementById('camVideo');
    video.srcObject = camStream;
    video.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
    video.onloadedmetadata = () => {
      video.style.opacity = '1';
      document.getElementById('camPlaceholder').style.display = 'none';
      document.getElementById('doorbellOverlay').style.display = 'flex';
      document.getElementById('snapPreview').style.display = 'none';
      cameraActive = true;
      const badge = document.getElementById('camLiveBadge');
      badge.innerHTML = `<div style="width:6px;height:6px;border-radius:50%;background:var(--green);animation:pulse-green 1.5s infinite;"></div><span style="color:var(--green);">EN VIVO</span>`;
      const track = camStream.getVideoTracks()[0];
      const settings = track.getSettings();
      document.getElementById('camResLabel').textContent = `${settings.width || '?'}×${settings.height || '?'}px`;
      addLog('Cámara activada: ' + (facingMode === 'user' ? 'frontal' : 'trasera'), 'ok');
      addLog(`Resolución: ${settings.width || '?'}×${settings.height || '?'}`, 'info');
      const phoneVid = document.getElementById('phoneCamVideo');
      if (phoneVid) {
        phoneVid.srcObject = camStream;
        phoneVid.style.opacity = '1';
        document.getElementById('phoneCamIcon').style.display = 'none';
      }
    };
  } catch (err) {
    addLog('Error al acceder a la cámara: ' + err.message, 'warn');
    const ph = document.getElementById('camPlaceholder');
    ph.style.display = 'flex';
    ph.innerHTML = `
      <div style="font-size:2rem;opacity:0.4;">🚫</div>
      <div style="font-family:var(--font-mono);font-size:0.68rem;color:var(--accent2);text-align:center;max-width:200px;line-height:1.6;">
        Permiso denegado o cámara no disponible.<br>Verifica los permisos del navegador.
      </div>
      <button onclick="startCamera()" style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);color:var(--accent);padding:0.4rem 1rem;font-family:var(--font-mono);font-size:0.65rem;cursor:pointer;margin-top:0.5rem;">REINTENTAR</button>
    `;
  }
}

function stopCamera() {
  if (camStream) {
    camStream.getTracks().forEach(t => t.stop());
    camStream = null;
  }
  const video = document.getElementById('camVideo');
  video.srcObject = null;
  video.style.opacity = '0';
  cameraActive = false;
  const ph = document.getElementById('camPlaceholder');
  ph.style.display = 'flex';
  ph.innerHTML = `
    <svg viewBox="0 0 80 60" width="80" xmlns="http://www.w3.org/2000/svg" opacity="0.25">
      <rect x="2" y="8" width="76" height="52" rx="6" fill="none" stroke="#00d4ff" stroke-width="2"/>
      <circle cx="40" cy="34" r="14" fill="none" stroke="#00d4ff" stroke-width="2"/>
      <circle cx="40" cy="34" r="6" fill="#00d4ff" opacity="0.3"/>
      <rect x="28" y="2" width="24" height="10" rx="3" fill="none" stroke="#00d4ff" stroke-width="1.5"/>
      <circle cx="66" cy="18" r="4" fill="#00d4ff" opacity="0.4"/>
    </svg>
    <div style="font-family:var(--font-mono);font-size:0.7rem;color:var(--muted);letter-spacing:0.1em;">CÁMARA INACTIVA</div>
    <button onclick="startCamera()" style="background:rgba(0,212,255,0.1);border:1px solid rgba(0,212,255,0.3);color:var(--accent);padding:0.5rem 1.2rem;font-family:var(--font-mono);font-size:0.7rem;cursor:pointer;letter-spacing:0.08em;transition:all 0.3s;">📷 ACTIVAR CÁMARA</button>
  `;
  document.getElementById('doorbellOverlay').style.display = 'none';
  document.getElementById('snapPreview').style.display = 'none';
  document.getElementById('camLiveBadge').innerHTML = `<div style="width:6px;height:6px;border-radius:50%;background:var(--muted);"></div><span>SIN CÁMARA</span>`;
  document.getElementById('camResLabel').textContent = '---';
  addLog('Cámara detenida.', 'info');
  const phoneVid = document.getElementById('phoneCamVideo');
  if (phoneVid) { phoneVid.srcObject = null; phoneVid.style.opacity = '0'; }
  const phoneIcon = document.getElementById('phoneCamIcon');
  if (phoneIcon) phoneIcon.style.display = '';
}

async function flipCamera() {
  facingMode = facingMode === 'user' ? 'environment' : 'user';
  addLog('Cambiando a cámara ' + (facingMode === 'user' ? 'frontal' : 'trasera') + '...', 'info');
  if (cameraActive) await startCamera();
}

function toggleMirror() {
  isMirrored = !isMirrored;
  const video = document.getElementById('camVideo');
  video.style.transform = isMirrored ? 'scaleX(-1)' : 'scaleX(1)';
  addLog('Espejo: ' + (isMirrored ? 'activado' : 'desactivado'), 'info');
}

function takeSnapshot() {
  const video = document.getElementById('camVideo');
  if (!cameraActive || video.readyState < 2) {
    addLog('Activa la cámara antes de tomar una captura.', 'warn');
    return;
  }
  const canvas = document.getElementById('snapCanvas');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const ctx = canvas.getContext('2d');
  if (isMirrored) {
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(0,212,255,0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.globalCompositeOperation = 'source-over';

  const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
  const preview = document.getElementById('snapPreview');
  preview.src = dataUrl;
  preview.style.display = 'block';

  const viewport = document.getElementById('camViewport');
  const flash = document.createElement('div');
  flash.style.cssText = 'position:absolute;inset:0;background:white;z-index:20;opacity:0.7;transition:opacity 0.4s;pointer-events:none;';
  viewport.appendChild(flash);
  setTimeout(() => { flash.style.opacity = '0'; }, 50);
  setTimeout(() => { flash.remove(); preview.style.display = 'none'; }, 2000);

  addLog('Captura tomada (' + canvas.width + '×' + canvas.height + 'px)', 'ok');

  const a = document.createElement('a');
  a.href = dataUrl;
  a.download = 'smartbell-snap-' + Date.now() + '.jpg';
  a.click();
}

// ==========================================
// DEMO LOGIC
// ==========================================
let demoPhase = 0;
let demoTimer = null;

function addLog(msg, type = 'info') {
  const log = document.getElementById('demoLog');
  if (!log) return;
  const now = new Date();
  const t = now.getMinutes().toString().padStart(2, '0') + ':' + now.getSeconds().toString().padStart(2, '0');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = `<span class="log-time">${t}</span><span class="log-msg ${type}">${msg}</span>`;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
}

function setProgress(step) {
  for (let i = 1; i <= 4; i++) {
    const el = document.getElementById('ps' + i);
    if (!el) continue;
    el.className = 'prog-step';
    if (i < step) el.classList.add('done');
    else if (i === step) el.classList.add('active');
  }
}

function setState(label, desc, sub) {
  document.getElementById('stateLabel').textContent = label;
  document.getElementById('stateDesc').textContent = desc;
  document.getElementById('stateSub').textContent = sub;
}

function showToast() {
  const t = document.getElementById('toast');
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 4500);
}

function ringDoorbell() {
  if (demoPhase !== 0 && demoPhase !== 5) return;
  demoPhase = 1;

  const pulse = document.getElementById('doorbellPulse');
  if (pulse) {
    pulse.classList.remove('ringing');
    void pulse.offsetWidth;
    pulse.classList.add('ringing');
  }

  const ph = document.getElementById('pressHint');
  if (ph) ph.textContent = '¡Llamando...';
  document.getElementById('mainDemoBtn').textContent = '⏳ PROCESANDO...';
  document.getElementById('mainDemoBtn').disabled = true;

  setProgress(1);
  setState('SEÑAL DETECTADA', 'Botón GPIO activado', 'El ESP32 detectó la señal del botón. Iniciando protocolo de notificación...');
  addLog('GPIO_PIN: señal HIGH detectada en botón', 'warn');
  addLog('Activando protocolo SmartBell...', 'info');

  clearTimeout(demoTimer);
  demoTimer = setTimeout(() => {
    demoPhase = 2;
    setProgress(2);
    setState('NOTIFICACIÓN ENVIADA', 'Alerta push al propietario', 'Se envió una notificación instantánea al smartphone. La cámara está transmitiendo en vivo.');
    addLog('PUSH: "Alguien en la puerta" enviado', 'ok');
    addLog('Cámara: transmisión activa ✓', 'ok');
    addLog('WiFi: latencia 12ms — señal fuerte', 'ok');
    showToast();

    demoTimer = setTimeout(() => {
      demoPhase = 3;
      setProgress(3);
      setState('REPRODUCIENDO AUDIO', '"Lo siento, no me encuentro en casa..."', 'El propietario no respondió. El sistema reproduce el mensaje automático para el visitante.');
      addLog('Propietario sin respuesta (timeout 15s)', 'warn');
      addLog('Reproduciendo mensaje de audio...', 'info');

      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance('Lo siento, no me encuentro en casa. Por favor, deja tu mensaje después del tono.');
        utter.lang = 'es-MX';
        utter.rate = 0.88;
        utter.pitch = 1.05;
        window.speechSynthesis.speak(utter);
      }

      demoTimer = setTimeout(() => {
        demoPhase = 4;
        setProgress(4);
        setState('GRABANDO MENSAJE', 'El visitante graba su mensaje de voz', 'El micrófono está activo. El visitante puede dejar su mensaje ahora.');
        addLog('Audio completado. Modo grabación activado.', 'ok');
        addLog('MIC: capturando audio del visitante...', 'warn');
        document.getElementById('recordingVis').classList.add('visible');

        demoTimer = setTimeout(() => {
          demoPhase = 5;
          setProgress(5);
          setState('MENSAJE GUARDADO ✓', '¡Demo completada con éxito!', 'El mensaje fue grabado y almacenado en el servidor. El propietario recibirá notificación.');
          addLog('Grabación finalizada: 00:08 seg', 'ok');
          addLog('Mensaje guardado en servidor ✓', 'ok');
          addLog('Notificación: "Nuevo mensaje de visita"', 'ok');
          document.getElementById('recordingVis').classList.remove('visible');
          if (ph) ph.textContent = 'TOCAR TIMBRE';
          document.getElementById('mainDemoBtn').textContent = '🔔 TOCAR TIMBRE';
          document.getElementById('mainDemoBtn').disabled = false;
        }, 5000);
      }, 4500);
    }, 2500);
  }, 2000);
}

function resetDemo() {
  clearTimeout(demoTimer);
  demoPhase = 0;
  window.speechSynthesis && window.speechSynthesis.cancel();
  setProgress(0);
  setState('ESPERANDO INTERACCIÓN', 'Sistema listo', 'Activa la cámara y presiona el botón del timbre para simular el flujo completo del SmartBell.');
  document.getElementById('recordingVis').classList.remove('visible');
  const ph = document.getElementById('pressHint');
  if (ph) ph.textContent = 'TOCAR TIMBRE';
  document.getElementById('mainDemoBtn').textContent = '🔔 TOCAR TIMBRE';
  document.getElementById('mainDemoBtn').disabled = false;
  const pulse = document.getElementById('doorbellPulse');
  if (pulse) pulse.classList.remove('ringing');
  addLog('Sistema reiniciado.', 'info');
}
