/* ═══════════════════════════════════════════════
   CCEH ESTADÍA — script.js
   Hero GTA VI bidireccional (scroll ↓ y ↑)
   + partículas toda la página
   + reveals, progress, nav, cursor
═══════════════════════════════════════════════ */
"use strict";

/* ── PARTICLES ── */
(function () {
  const container = document.getElementById('particles');
  if (!container) return;
  const colors = ['#ffcb7d','#ffa14b','#ff5b2f','#ff2400','#bb1200','#661000','#ffd264','#ff8a1a'];
  for (let i = 0; i < 65; i++) {
    const s = document.createElement('div');
    s.classList.add('spark');
    const size = Math.random() * 4 + 0.8;
    const col  = colors[Math.floor(Math.random() * colors.length)];
    s.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      background:${col};
      animation-duration:${7 + Math.random() * 15}s;
      animation-delay:${Math.random() * 12}s;
      box-shadow:0 0 ${size * 5}px ${col};
    `;
    container.appendChild(s);
  }
})();

/* ── INTRO FLAME PARTICLES ── */
(function () {
  const container = document.getElementById('hero-intro-particles');
  if (!container) return;
  const colors = ['#6b0914', '#8c1722', '#a52b34', '#4b040f', '#5e0b18'];
  for (let i = 0; i < 120; i++) {
    const spark = document.createElement('div');
    spark.className = 'hero-intro-flame';
    const size = Math.random() * 10 + 4;
    const left = Math.random() * 100;
    const delay = Math.random() * -5;
    const duration = 2.2 + Math.random() * 2.8;
    const opacity = 0.25 + Math.random() * 0.65;
    spark.style.cssText = `
      width:${size}px;
      height:${size}px;
      left:${left}%;
      bottom:${-12 - Math.random() * 28}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      opacity:${opacity};
      animation-duration:${duration}s;
      animation-delay:${delay}s;
      border-radius: 999px;
      filter: blur(${Math.random() * 1.4 + 0.4}px);
    `;
    container.appendChild(spark);
  }
})();

/* ── SCROLL PROGRESS ── */
(function () {
  const bar = document.getElementById('progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ══════════════════════════════════════════════
   HERO — GTA VI  BIDIRECCIONAL
   ──────────────────────────────────────────────
   #hero        → height:200vh  (zona de scroll)
   #hero-sticky → sticky top:0, height:100vh

   p = scrollY / heroHeight   (0 → 1)

   FASES (reversibles en ambas direcciones):
   ┌──────────────────────────────────────────┐
   │ p 0.00→0.18 │ Negro. Título emerge tenue │
   │ p 0.18→0.55 │ Imagen sube + título CRECE │
   │ p 0.55→0.80 │ Imagen full + título baja  │
   │ p 0.80→1.00 │ Fade out hacia el contenido│
   └──────────────────────────────────────────┘
   Al hacer scroll hacia arriba cada fase
   se revierte exactamente.
══════════════════════════════════════════════ */
(function () {
  const hero    = document.getElementById('hero');
  const bgDark  = document.getElementById('hero-bg-dark');
  const leftImg = document.getElementById('hero-image-left');
  const rightImg = document.getElementById('hero-image-right');
  const overlay = document.getElementById('hero-overlay');
  const fog     = document.getElementById('hero-fog');
  const titleW  = document.getElementById('hero-title-wrap');
  const titleLeft = document.getElementById('hero-title-half-left');
  const titleRight = document.getElementById('hero-title-half-right');
  const nav     = document.getElementById('siteNav');
  if (!hero || !leftImg || !rightImg || !titleW || !titleLeft || !titleRight) return;
  const images = [leftImg, rightImg];

  /* Helpers */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const lerp  = (a, b, t) => a + (b - a) * t;
  /* ease in-out cuadrático */
  const eio   = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  /* mapea p de [a,b] → [0,1] con clamp */
  const norm  = (p, a, b) => clamp((p - a) / (b - a), 0, 1);

  function tick() {
    const heroH = hero.offsetHeight; // 200vh
    const p = clamp(window.scrollY / heroH, 0, 1);

    /* ── IMAGEN ─────────────────────────────────────── */
    const door = eio(p);
    const doorX = lerp(0, 80, door);
    const doorR = lerp(0, 12, door);
    const titleDoorX = lerp(0, 64, door);
    const titleDoorR = lerp(0, 4, door);
    const imgScale = lerp(1, 1.16, p);

    images.forEach(function(image) {
      image.style.opacity = 1;
    });
    leftImg.style.transform  = `translateX(-${doorX}px) rotateY(${-doorR}deg) scale(${imgScale})`;
    rightImg.style.transform = `translateX(${doorX}px) rotateY(${doorR}deg) scale(${imgScale})`;

    /* ── OVERLAY & FOG ──────────────────────────────── */
    overlay.style.opacity = 1;

    fog.style.opacity = clamp(p * 0.95, 0, 1);
    bgDark.style.opacity = clamp(1 - p * 1.8, 0, 1);

    titleW.style.opacity = 1;
    titleW.style.transform = `translateX(-50%) translateY(${lerp(0, 16, door)}px)`;
    titleLeft.style.transform  = `translateX(-${titleDoorX}px) rotateY(${-titleDoorR}deg)`;
    titleRight.style.transform = `translateX(${titleDoorX}px) rotateY(${titleDoorR}deg)`;

    /* ── NAV ─────────────────────────────────────────── */
    if (p > 0.85) {
      nav.classList.add('visible');
    } else {
      nav.classList.remove('visible');
    }
  }

  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();

(function () {
  const heroIntro = document.getElementById('hero-intro');
  const nav = document.getElementById('siteNav');

  function finishIntro() {
    document.body.classList.remove('intro-active');
    if (heroIntro) {
      heroIntro.style.display = 'none';
      heroIntro.style.pointerEvents = 'none';
      heroIntro.style.visibility = 'hidden';
    }
    if (nav) {
      nav.classList.add('visible');
    }
  }

  if (document.readyState === 'complete') {
    setTimeout(finishIntro, 2000);
  } else {
    window.addEventListener('load', function () {
      setTimeout(finishIntro, 2000);
    });
  }
})();

function typeHeroTitle() {
  var wrapper = document.getElementById('hero-title-wrap');
  var titleEls = document.querySelectorAll('.hero-main-title-clone');
  if (!titleEls.length || !wrapper) return;
  var titleEl = titleEls[0];
  var mainText = titleEl.dataset.typedMain || '';
  var highlightText = titleEl.dataset.typedHighlight || '';
  var fullText = mainText + highlightText;
  var currentIndex = 0;
  wrapper.style.opacity = 1;
  titleEls.forEach(function(el) {
    el.textContent = '';
    el.classList.add('typing');
  });

  function setTitleText(content) {
    titleEls.forEach(function(el) {
      el.innerHTML = content;
    });
  }

  function typeNext() {
    currentIndex += 1;
    var visible = fullText.slice(0, currentIndex);
    if (currentIndex > mainText.length) {
      setTitleText(mainText + '<span class="line-red">' + visible.slice(mainText.length) + '</span>');
    } else {
      setTitleText(visible);
    }
    if (currentIndex < fullText.length) {
      setTimeout(typeNext, 80);
    } else {
      setTimeout(function() {
        titleEls.forEach(function(el) {
          el.classList.remove('typing');
        });
      }, 400);
    }
  }
  typeNext();
}

/* ── REVEAL ON SCROLL ── */
(function () {
  const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('visible'), 80);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  els.forEach(el => obs.observe(el));
})();

/* ── NAV HIGHLIGHT ── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  function update() {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 160) current = sec.id;
    });
    links.forEach(a => {
      const href = a.getAttribute('href').slice(1);
      a.style.color      = href === current ? 'var(--red)' : '';
      a.style.textShadow = href === current ? '0 0 10px var(--red)' : '';
    });
  }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();




(function(){
  var btn   = document.getElementById('theme-btn');
  var icon  = document.getElementById('theme-icon');
  var label = document.getElementById('theme-label');
  var light = false;

  btn.addEventListener('click', function(){
    light = !light;
    if(light){
      document.documentElement.classList.add('light-mode');
      icon.textContent  = '🌙';
      label.textContent = 'MODO OSCURO';
    } else {
      document.documentElement.classList.remove('light-mode');
      icon.textContent  = '☀️';
      label.textContent = 'MODO CLARO';
    }
  });
})();

function bindFileTrigger() {
  document.querySelectorAll('[data-file-trigger]').forEach(function(trigger) {
    var targetId = trigger.dataset.fileTrigger;
    var input = document.getElementById(targetId);
    if (!input) return;
    trigger.addEventListener('click', function() {
      input.click();
    });
  });
}

function setupImageInput(inputId, imageId, placeholderId) {
  var input = document.getElementById(inputId);
  if (!input) return;
  var image = document.getElementById(imageId);
  var placeholder = placeholderId ? document.getElementById(placeholderId) : null;
  input.addEventListener('change', function() {
    var file = this.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      if (image) {
        image.src = e.target.result;
        image.style.display = 'block';
      }
      if (placeholder) {
        placeholder.style.display = 'none';
      }
    };
    reader.readAsDataURL(file);
  });
}

function bindGalleryButtons() {
  var openGalleryBtn = document.getElementById('openGalleryBtn');
  if (openGalleryBtn) {
    openGalleryBtn.addEventListener('click', openGallery);
  }
  var prevBtn = document.getElementById('ev-lb-prev');
  var nextBtn = document.getElementById('ev-lb-next');
  var closeTop = document.getElementById('ev-lb-close-top');
  var closeBtn = document.getElementById('ev-lb-close');
  if (prevBtn) {
    prevBtn.addEventListener('click', function(e) { e.stopPropagation(); galleryNav(-1); });
  }
  if (nextBtn) {
    nextBtn.addEventListener('click', function(e) { e.stopPropagation(); galleryNav(1); });
  }
  if (closeTop) {
    closeTop.addEventListener('click', function(e) { e.stopPropagation(); closeLightbox(); });
  }
  if (closeBtn) {
    closeBtn.addEventListener('click', function(e) { e.stopPropagation(); closeLightbox(); });
  }
}

bindFileTrigger();
setupImageInput('photoFileInput', 'studentPhoto');
setupImageInput('empresaFileInput', 'empresaPhoto', 'empresaPlaceholder');
// setupImageInput('empLogoInput', 'empLogoImg', 'empLogoPlaceholder');
bindGalleryButtons();

  /* ═══════════════════════════════════════════════════
    GALERÍA / LIGHTBOX — openGallery + navegación
  ═══════════════════════════════════════════════════ */

  var galleryImages = [];
  var currentImage  = 0;

  function buildGallery() {
    galleryImages = [];
    ['img1','img2','img3'].forEach(function(id) {
      var el = document.getElementById(id);
      if (el && el.src && el.src !== '' && el.src !== window.location.href) {
        galleryImages.push(el.src);
      }
    });
  }

  /* Botón "Ver" en la sección de infografías */
  function openGallery() {
    buildGallery();
    if (galleryImages.length === 0) {
      var btn = document.querySelector('.ev-btn-cyan');
      if (btn) {
        var orig = btn.innerHTML;
        btn.innerHTML = '⚠ Sin imágenes';
        setTimeout(function() { btn.innerHTML = orig; }, 1800);
      }
      return;
    }
    currentImage = 0;
    renderLightbox();
    document.getElementById('ev-lightbox').style.display = 'flex';
  }

  function renderLightbox() {
    var img     = document.getElementById('ev-lb-img');
    var counter = document.getElementById('ev-lb-counter');
    var prev    = document.getElementById('ev-lb-prev');
    var next    = document.getElementById('ev-lb-next');
    if (img)     img.src = galleryImages[currentImage];
    if (counter) counter.textContent = (currentImage + 1) + ' / ' + galleryImages.length;
    var show = galleryImages.length > 1;
    if (prev) prev.style.display = show ? 'flex' : 'none';
    if (next) next.style.display = show ? 'flex' : 'none';
  }

  /* Flechas ← → */
  function galleryNav(dir) {
    if (galleryImages.length === 0) return;
    currentImage = (currentImage + dir + galleryImages.length) % galleryImages.length;
    renderLightbox();
  }

  /* Cerrar */
  function closeLightbox() {
    document.getElementById('ev-lightbox').style.display = 'none';
  }

  /* Abrir una imagen suelta (compatibilidad con handleEv) */
  function openLb(src) {
    galleryImages = [src];
    currentImage  = 0;
    renderLightbox();
    document.getElementById('ev-lightbox').style.display = 'flex';
  }
  function closeLb() { closeLightbox(); }

  /* Cargar imagen en slot desde <input> */
  function loadSlot(input, imgId, phId) {
    var file = input.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
      var img = document.getElementById(imgId);
      var ph  = document.getElementById(phId);
      if (img) { img.src = e.target.result; img.style.display = 'block'; }
      if (ph)  { ph.style.display = 'none'; }
    };
    reader.readAsDataURL(file);
  }

  /* Clic en fondo → cerrar */
  (function() {
    var lb = document.getElementById('ev-lightbox');
    if (lb) lb.addEventListener('click', function(e) {
      if (e.target === this) closeLightbox();
    });
  })();

  /* Teclado: flechas + Escape */
  document.addEventListener('keydown', function(e) {
    var lb = document.getElementById('ev-lightbox');
    if (lb && lb.style.display === 'flex') {
      if (e.key === 'ArrowRight') galleryNav(1);
      if (e.key === 'ArrowLeft')  galleryNav(-1);
      if (e.key === 'Escape')     closeLightbox();
    }
  });

  /* handleEv: subir múltiples fotos (usado en otras secciones) */
  function triggerEv(id) { document.getElementById(id).click(); }

  function handleEv(input, mainId, mainImgId, mainPhId, thumbsId) {
    var files   = Array.from(input.files);
    if (!files.length) return;
    var mainImg = document.getElementById(mainImgId);
    var mainPh  = document.getElementById(mainPhId);
    var thumbs  = document.getElementById(thumbsId);
    files.forEach(function(file, i) {
      var reader = new FileReader();
      reader.onload = function(e) {
        var src = e.target.result;
        if (mainImg && mainImg.style.display === 'none' && i === 0) {
          mainImg.src = src;
          mainImg.style.display = 'block';
          if (mainPh) mainPh.style.display = 'none';
        }
        if (thumbs && (i > 0 || (mainImg && mainImg.style.display === 'block'))) {
          var t = document.createElement('div');
          t.className = 'ev-thumb';
          t.style.backgroundImage = 'url(' + src + ')';
          t.onclick = function() { openLb(src); };
          var del = document.createElement('button');
          del.className = 'ev-thumb-del';
          del.textContent = '×';
          del.onclick = function(e) { e.stopPropagation(); t.remove(); };
          t.appendChild(del);
          thumbs.appendChild(t);
        }
      };
      reader.readAsDataURL(file);
    });
    input.value = '';
  }

