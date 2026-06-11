// ═══════════════════════════════════════════
//  THEME TOGGLE — ANIMACIÓN PRO (eclipse ripple)
// ═══════════════════════════════════════════
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme') || 'dark';
if (savedTheme === 'light') document.body.classList.add('light');

function createThemeRipple(originEl) {
  // Crear el canvas de ripple
  const ripple = document.createElement('div');
  ripple.id = 'theme-ripple';
  const rect = originEl.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const maxDist = Math.hypot(Math.max(cx, window.innerWidth - cx), Math.max(cy, window.innerHeight - cy));

  const isGoingLight = !document.body.classList.contains('light');

  ripple.style.cssText = `
    position: fixed;
    left: ${cx}px;
    top: ${cy}px;
    width: 0; height: 0;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    background: ${isGoingLight ? '#f5f4ff' : '#0a0a0f'};
    z-index: 7999;
    pointer-events: none;
    will-change: width, height;
    transition: width 0.65s cubic-bezier(0.4,0,0.2,1), height 0.65s cubic-bezier(0.4,0,0.2,1);
  `;
  document.body.appendChild(ripple);

  // Partículas de estrellas/luz
  const particleCount = isGoingLight ? 18 : 14;
  const particles = [];
  for (let i = 0; i < particleCount; i++) {
    const p = document.createElement('div');
    const angle = (i / particleCount) * Math.PI * 2;
    const dist = 30 + Math.random() * 60;
    const size = isGoingLight ? (2 + Math.random() * 5) : (1 + Math.random() * 3);
    const color = isGoingLight
      ? ['#ff3c6e','#7b61ff','#00e5c0','#ffd700'][Math.floor(Math.random()*4)]
      : ['#7b61ff','#ff3c6e','#00e5c0','#ffffff'][Math.floor(Math.random()*4)];
    p.style.cssText = `
      position: fixed;
      left: ${cx}px; top: ${cy}px;
      width: ${size}px; height: ${size}px;
      border-radius: 50%;
      background: ${color};
      z-index: 8000;
      pointer-events: none;
      transform: translate(-50%,-50%);
      transition: left 0.6s cubic-bezier(0.2,0,0,1), top 0.6s cubic-bezier(0.2,0,0,1), opacity 0.6s ease;
      opacity: 1;
      box-shadow: 0 0 ${size*2}px ${color};
    `;
    document.body.appendChild(p);
    particles.push({ el: p, tx: cx + Math.cos(angle)*dist, ty: cy + Math.sin(angle)*dist });
  }

  // Lunar glow ring
  const ring = document.createElement('div');
  ring.style.cssText = `
    position: fixed;
    left: ${cx}px; top: ${cy}px;
    width: 0; height: 0;
    border-radius: 50%;
    border: 2px solid ${isGoingLight ? 'rgba(255,60,110,0.6)' : 'rgba(123,97,255,0.6)'};
    z-index: 8001;
    pointer-events: none;
    transform: translate(-50%,-50%);
    transition: width 0.5s ease, height 0.5s ease, opacity 0.5s ease;
    opacity: 1;
  `;
  document.body.appendChild(ring);

  // Fase 1: lanzar partículas y ring
  requestAnimationFrame(() => {
    ring.style.width = '80px';
    ring.style.height = '80px';
    particles.forEach(p => {
      p.el.style.left = p.tx + 'px';
      p.el.style.top  = p.ty + 'px';
    });
  });

  // Fase 2: expandir ripple (tras frame)
  setTimeout(() => {
    ripple.style.width  = maxDist * 2.2 + 'px';
    ripple.style.height = maxDist * 2.2 + 'px';
    // Cambiar tema a mitad
    setTimeout(() => {
      document.body.classList.toggle('light');
      localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
    }, 280);
  }, 80);

  // Fase 3: desvanecer partículas y ring
  setTimeout(() => {
    ring.style.width  = '120px';
    ring.style.height = '120px';
    ring.style.opacity = '0';
    particles.forEach(p => { p.el.style.opacity = '0'; });
  }, 300);

  // Cleanup
  setTimeout(() => {
    ripple.style.transition = 'opacity 0.25s';
    ripple.style.opacity = '0';
  }, 600);
  setTimeout(() => {
    ripple.remove();
    ring.remove();
    particles.forEach(p => p.el.remove());
  }, 850);
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => createThemeRipple(themeToggle));
}

// ═══════════════════════════════════════════
//  MOBILE MENU
// ═══════════════════════════════════════════
const burger = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');
if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const spans = burger.querySelectorAll('span');
    if (navLinks.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
      spans.forEach(s => { s.style.transform=''; s.style.opacity=''; });
    }
  });
}

// ═══════════════════════════════════════════
//  CUSTOM CURSOR
// ═══════════════════════════════════════════
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursorRing');
if (cursor && ring) {
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove', e => {
    mx=e.clientX; my=e.clientY;
    cursor.style.left=mx+'px'; cursor.style.top=my+'px';
  });
  (function animRing() {
    rx += (mx-rx)*0.12; ry += (my-ry)*0.12;
    ring.style.left=rx+'px'; ring.style.top=ry+'px';
    requestAnimationFrame(animRing);
  })();
  document.querySelectorAll('a,button,.skill-card,.project-card,.stat-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('active'); ring.classList.add('active'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('active'); ring.classList.remove('active'); });
  });
}

// ═══════════════════════════════════════════
//  PAGE TRANSITION PANELS
// ═══════════════════════════════════════════
const panels = document.querySelectorAll('.wipe-panel');

function epicTransition(cb) {
  panels.forEach(p => { p.classList.remove('out'); p.classList.add('in'); });
  setTimeout(() => {
    if (cb) cb();
    panels.forEach(p => { p.classList.remove('in'); p.classList.add('out'); });
    setTimeout(() => panels.forEach(p => p.classList.remove('out')), 420);
  }, 430);
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(a.getAttribute('href'));
    epicTransition(() => { if(target) target.scrollIntoView(); });
  });
});

document.querySelectorAll('a[data-page]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const href = a.getAttribute('href');
    epicTransition(() => { window.location.href = href; });
  });
});

// ═══════════════════════════════════════════
//  SCROLL REVEAL
// ═══════════════════════════════════════════
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    setTimeout(() => el.classList.add('visible'), Number(el.dataset.delay) || 0);

    const bar = el.querySelector('.skill-bar');
    if (bar) setTimeout(() => { bar.style.width = bar.dataset.width+'%'; }, 200);

    const counter = el.querySelector('[data-count]');
    if (counter) {
      const total = parseInt(counter.dataset.count);
      let n=0; const inc=total/40;
      const iv = setInterval(() => {
        n+=inc;
        if(n>=total){counter.textContent=total;clearInterval(iv);}
        else counter.textContent=Math.floor(n);
      },30);
    }
    observer.unobserve(el);
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal,.timeline-item').forEach(el => observer.observe(el));

document.querySelectorAll('.skill-card,.project-card').forEach((el,i) => {
  el.style.transitionDelay = (i*0.08)+'s';
});

// ═══════════════════════════════════════════
//  NAV ACTIVE ON SCROLL
// ═══════════════════════════════════════════
const navItems = document.querySelectorAll('.nav-links a[href^="#"]');
if (navItems.length) {
  window.addEventListener('scroll', () => {
    let cur='';
    document.querySelectorAll('section[id]').forEach(s => {
      if (window.scrollY >= s.offsetTop-160) cur=s.id;
    });
    navItems.forEach(a => {
      a.classList.toggle('active', a.getAttribute('href')==='#'+cur);
    });
  });
}

// ═══════════════════════════════════════════
//  BACK TO TOP
// ═══════════════════════════════════════════
const backTop = document.getElementById('back-top');
if (backTop) {
  window.addEventListener('scroll', () => {
    backTop.classList.toggle('visible', window.scrollY > 400);
  });
  backTop.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

// ═══════════════════════════════════════════
//  INTRO SCREEN
// ═══════════════════════════════════════════
const introScreen = document.getElementById('intro-screen');
if (introScreen) {
  const canvas = document.getElementById('intro-canvas');
  const ctx    = canvas.getContext('2d');
  const wipe   = document.getElementById('intro-wipe');
  const skip   = document.getElementById('intro-skip');

  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const pts = Array.from({length:120}, () => ({
    x:Math.random()*canvas.width, y:Math.random()*canvas.height,
    r:Math.random()*2+0.5, vx:(Math.random()-.5)*.4, vy:(Math.random()-.5)*.4,
    a:Math.random()*.5+.1, c:['#7b61ff','#ff3c6e','#00e5c0'][Math.floor(Math.random()*3)]
  }));

  function drawPts() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pts.forEach(p => {
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.c; ctx.globalAlpha=p.a; ctx.fill();
    });
    ctx.globalAlpha=1;
    if(!introScreen.classList.contains('done')) requestAnimationFrame(drawPts);
  }
  drawPts();

  const iName    = document.getElementById('intro-name');
  const iSub     = document.getElementById('intro-sub');
  const iBarWrap = document.getElementById('intro-bar-wrap');
  const iBar     = document.getElementById('intro-bar');

  setTimeout(()=>{ iName.style.opacity='1'; iName.style.transform='translateY(0)'; },800);
  setTimeout(()=>{ iSub.style.opacity='1'; },1200);
  setTimeout(()=>{ iBarWrap.style.opacity='1'; setTimeout(()=>{ iBar.style.width='100%'; },100); },1500);

  function dismissIntro() {
    wipe.style.transition='transform 0.5s cubic-bezier(0.76,0,0.24,1)';
    wipe.style.transform='scaleX(1)';
    setTimeout(()=>{
      introScreen.style.display='none';
      introScreen.classList.add('done');
      wipe.style.transformOrigin='right';
      wipe.style.transition='transform 0.5s cubic-bezier(0.76,0,0.24,1) 0.05s';
      wipe.style.transform='scaleX(0)';
      document.body.style.overflow='';
    },520);
  }

  setTimeout(dismissIntro, 3600);
  if (skip) skip.addEventListener('click', dismissIntro);
  document.body.style.overflow='hidden';
}

// ═══════════════════════════════════════════
//  DAYS COUNTER
// ═══════════════════════════════════════════
const daysEl = document.getElementById('days-cceh');
if (daysEl) {
  const start = new Date('2025-11-04');
  const today = new Date();
  const diff  = Math.floor((today - start) / 86400000);
  daysEl.setAttribute('data-count', diff);
}

// ═══════════════════════════════════════════
//  TYPEWRITER HERO
// ═══════════════════════════════════════════
const twEl = document.getElementById('typewriter');
if (twEl) {
  const words = ['Técnico en Informática', 'Diseñador de Infografías', 'Practicante CCEH', 'Sistema Dual'];
  let wi=0, ci=0, deleting=false;
  function type() {
    const word = words[wi];
    twEl.textContent = deleting ? word.slice(0,ci--) : word.slice(0,ci++);
    if (!deleting && ci>word.length) { deleting=true; setTimeout(type,1500); return; }
    if (deleting && ci<0) { deleting=false; wi=(wi+1)%words.length; ci=0; }
    setTimeout(type, deleting?50:90);
  }
  setTimeout(type, 2000);
}

// ═══════════════════════════════════════════
//  NAV SCROLL EFFECT
// ═══════════════════════════════════════════
const nav = document.querySelector('nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });
}
