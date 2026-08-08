/* ═══════════════════════════════════════════════════════════════════
   devRasen Portfolio — script.js  v3.0 FRESH
   Complete interactive portfolio JavaScript
   ═══════════════════════════════════════════════════════════════════ */

'use strict';

/* ══════════════════════ PRELOADER ══════════════════════════════════ */
(function() {
  const preloader = document.getElementById('preloader');
  const plNum     = document.getElementById('pl-num');
  const plBar     = document.getElementById('pl-bar');
  if (!preloader) return;

  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 18;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('done');
        setTimeout(() => { preloader.remove(); initAll(); }, 800);
      }, 300);
    }
    if (plNum) plNum.textContent = Math.floor(progress);
    if (plBar) plBar.style.width = progress + '%';
  }, 80);

  function initAll() {
    initCursor();
    initNavbar();
    initHeroCanvas();
    initTypewriter();
    initCounters();
    initScrollReveal();
    initSkillBars();
    initFilterButtons();
    initScrollProgress();
    initTabSwitcher();
    initContactForm();
    initBackToTop();
    initSmoothScroll();
    initCardGlow();
    initParallax();
  }
})();

/* ══════════════════════ CUSTOM CURSOR ══════════════════════════════ */
function initCursor() {
  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;
  if (!window.matchMedia('(pointer: fine)').matches) {
    dot.style.display = 'none'; ring.style.display = 'none'; return;
  }

  let mx = -200, my = -200, rx = -200, ry = -200;
  let raf;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  function animateCursor() {
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    raf = requestAnimationFrame(animateCursor);
  }
  raf = requestAnimationFrame(animateCursor);

  // Hover & click states
  const hoverEls = document.querySelectorAll('a, button, .svc-card, .work-item, .ts-pill, .wf-btn, .tt-btn');
  hoverEls.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));
}

/* ══════════════════════ NAVBAR ══════════════════════════════════════ */
function initNavbar() {
  const nav     = document.getElementById('navbar');
  const burger  = document.getElementById('burger');
  const mobNav  = document.getElementById('mob-overlay');
  const mobClose= document.getElementById('mob-close');

  function onScroll() {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    updateActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (burger && mobNav) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      mobNav.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobClose.addEventListener('click', () => window.closeMob && window.closeMob());
    mobNav.addEventListener('click', e => { if (e.target === mobNav) window.closeMob && window.closeMob(); });
  }

  window.closeMob = function() {
    burger && burger.classList.remove('open');
    mobNav  && mobNav.classList.remove('open');
    document.body.style.overflow = '';
  };

  document.addEventListener('keydown', e => { if (e.key === 'Escape') window.closeMob && window.closeMob(); });
}

function updateActiveLink() {
  const sections = ['hero','about','services','works','contact'];
  let current = 'hero';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (el.getBoundingClientRect().top <= 120) current = id;
  });
  document.querySelectorAll('.nl[data-s]').forEach(link => {
    link.classList.toggle('active', link.dataset.s === current);
  });
}

/* ══════════════════════ HERO CANVAS ═════════════════════════════════ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, particles = [], mouse = { x: -999, y: -999 };
  const NUM = 80;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  document.getElementById('hero')?.addEventListener('mousemove', e => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - .5) * .4;
      this.vy = (Math.random() - .5) * .4;
      this.r  = Math.random() * 1.5 + .5;
      this.a  = Math.random() * .4 + .1;
      this.col= Math.random() > .5 ? '59,130,246' : '99,102,241';
    }
    update() {
      // Repel from mouse
      const dx = this.x - mouse.x, dy = this.y - mouse.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < 120) {
        const force = (120 - dist) / 120;
        this.vx += (dx / dist) * force * 0.8;
        this.vy += (dy / dist) * force * 0.8;
      }
      this.vx *= .98; this.vy *= .98;
      this.x  += this.vx; this.y  += this.vy;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.col},${this.a})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < NUM; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const d  = Math.sqrt(dx*dx + dy*dy);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(59,130,246,${.15 * (1 - d / 120)})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    }
  }

  // Gradient blobs
  let t = 0;
  function drawBlobs() {
    t += 0.005;
    const blobs = [
      { x: W * (.3 + Math.sin(t * .7) * .1),  y: H * (.4 + Math.cos(t * .5) * .1), r: W * .25, c: 'rgba(59,130,246,' },
      { x: W * (.7 + Math.cos(t * .6) * .08), y: H * (.6 + Math.sin(t * .8) * .08), r: W * .2,  c: 'rgba(99,102,241,' },
    ];
    blobs.forEach(b => {
      const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
      g.addColorStop(0, b.c + '.06)');
      g.addColorStop(1, b.c + '0)');
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    });
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    drawBlobs();
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    requestAnimationFrame(loop);
  }
  loop();
}

/* ══════════════════════ TYPEWRITER ══════════════════════════════════ */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const words = [
    'scalable web apps.',
    'beautiful UIs.',
    'Laravel APIs.',
    'React experiences.',
    'digital products.',
  ];
  let wi = 0, ci = 0, deleting = false;
  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.substring(0, ci--) : word.substring(0, ci++);
    if (!deleting && ci === word.length + 1) {
      deleting = true; setTimeout(tick, 1600); return;
    }
    if (deleting && ci === 0) {
      deleting = false; wi = (wi + 1) % words.length;
    }
    setTimeout(tick, deleting ? 55 : 90);
  }
  tick();
}

/* ══════════════════════ COUNTERS ════════════════════════════════════ */
function initCounters() {
  const counters = document.querySelectorAll('.hstat-n[data-target]');
  if (!counters.length) return;

  let done = false;
  function animateCounters() {
    if (done) return;
    const hero = document.getElementById('hero');
    if (!hero) return;
    const rect = hero.getBoundingClientRect();
    if (rect.bottom > 0) {
      done = true;
      counters.forEach(el => {
        const target = +el.dataset.target;
        const dur = 2000;
        const start = performance.now();
        function step(now) {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target);
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
      });
    }
  }
  window.addEventListener('scroll', animateCounters, { passive: true });
  animateCounters();
}

/* ══════════════════════ SCROLL REVEAL ═══════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.fade-up, .fade-left');
  if (!els.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => obs.observe(el));
}

/* ══════════════════════ SKILL BARS ══════════════════════════════════ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-w]');
  if (!bars.length) return;

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        setTimeout(() => { e.target.style.width = e.target.dataset.w + '%'; }, 300);
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });
  bars.forEach(b => obs.observe(b));
}

/* ══════════════════════ FILTER BUTTONS ═════════════════════════════ */
function initFilterButtons() {
  const btns  = document.querySelectorAll('.wf-btn');
  const items = document.querySelectorAll('.work-item');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.f;

      items.forEach(item => {
        const cat = item.dataset.cat || '';
        const show = filter === 'all' || cat === filter;
        item.style.transition = 'opacity .35s, transform .35s';
        if (show) {
          item.style.display = '';
          requestAnimationFrame(() => { item.style.opacity = '1'; item.style.transform = ''; });
        } else {
          item.style.opacity = '0';
          item.style.transform = 'scale(.93)';
          setTimeout(() => { if (item.style.opacity === '0') item.style.display = 'none'; }, 380);
        }
      });
    });
  });
}

/* ══════════════════════ SCROLL PROGRESS ════════════════════════════ */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  function update() {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (total > 0 ? window.scrollY / total * 100 : 0) + '%';
  }
  window.addEventListener('scroll', update, { passive: true });
}

/* ══════════════════════ TAB SWITCHER ════════════════════════════════ */
function initTabSwitcher() {
  const btns = document.querySelectorAll('.tt-btn');
  if (!btns.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabId = btn.dataset.tab;
      document.querySelectorAll('.tt-content').forEach(c => {
        c.classList.toggle('hidden', c.id !== 'tab-' + tabId);
      });
    });
  });
}

/* ══════════════════════ CONTACT FORM ═══════════════════════════════ */
function initContactForm() {
  const form    = document.getElementById('contact-form');
  const submitBtn = document.getElementById('cf-submit');
  const success = document.getElementById('cf-success');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name    = document.getElementById('cf-name')?.value.trim();
    const email   = document.getElementById('cf-email')?.value.trim();
    const subject = document.getElementById('cf-subject')?.value.trim();
    const msg     = document.getElementById('cf-msg')?.value.trim();

    if (!name || !email || !subject || !msg) {
      // Shake invalid fields
      [['cf-name',name],['cf-email',email],['cf-subject',subject],['cf-msg',msg]].forEach(([id, val]) => {
        if (!val) {
          const inp = document.getElementById(id);
          if (!inp) return;
          inp.style.borderBottomColor = '#ef4444';
          inp.style.animation = 'shake .3s ease';
          setTimeout(() => { inp.style.animation = ''; inp.style.borderBottomColor = ''; }, 600);
        }
      });
      return;
    }

    const btnText = submitBtn?.querySelector('.cf-btn-text');
    if (btnText) btnText.textContent = 'Sending...';
    if (submitBtn) submitBtn.disabled = true;

    // Simulate API call
    await new Promise(r => setTimeout(r, 1400));

    if (btnText) btnText.textContent = 'Send Message';
    if (submitBtn) submitBtn.disabled = false;
    if (success) success.classList.add('show');
    form.reset();
    setTimeout(() => success?.classList.remove('show'), 6000);
  });

  // Clear error styles on input
  form.querySelectorAll('input, textarea').forEach(inp => {
    inp.addEventListener('input', () => { inp.style.borderBottomColor = ''; });
  });
}

/* ══════════════════════ BACK TO TOP ══════════════════════════════════ */
function initBackToTop() {
  const btn = document.getElementById('btt');
  if (!btn) return;
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 500), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ══════════════════════ SMOOTH SCROLL ═══════════════════════════════ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ══════════════════════ CARD GLOW EFFECT ════════════════════════════ */
function initCardGlow() {
  document.querySelectorAll('.svc-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
    });
  });
}

/* ══════════════════════ PARALLAX ════════════════════════════════════ */
function initParallax() {
  const badges = document.querySelectorAll('.float-badge');
  if (!badges.length) return;
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const s = window.scrollY;
    const delta = s - lastScroll;
    lastScroll = s;
    badges.forEach((b, i) => {
      const speed = (i % 3 + 1) * 0.05;
      const current = parseFloat(b.style.getPropertyValue('--py') || '0');
      b.style.setProperty('--py', current + delta * speed + 'px');
      // Note: We rely on animation keyframe for vertical float; parallax is subtle
    });
  }, { passive: true });
}

/* ══════════════════════ HERO IMAGE TILT ══════════════════════════════ */
(function() {
  const img = document.getElementById('hero-img');
  const wrap = img?.closest('.hero-img-wrap');
  if (!img || !wrap) return;
  wrap.addEventListener('mousemove', e => {
    const rect = wrap.getBoundingClientRect();
    const xRel = (e.clientX - rect.left) / rect.width  - .5;
    const yRel = (e.clientY - rect.top)  / rect.height - .5;
    img.style.transform = `perspective(600px) rotateY(${xRel * 6}deg) rotateX(${-yRel * 6}deg) scale(1.02)`;
  });
  wrap.addEventListener('mouseleave', () => {
    img.style.transform = 'perspective(600px) rotateY(0) rotateX(0) scale(1)';
  });
  img.style.transition = 'transform .4s ease';
})();

/* ══════════════════════ ADD SHAKE KEYFRAME ══════════════════════════ */
(function() {
  const style = document.createElement('style');
  style.textContent = `@keyframes shake{
    0%,100%{transform:translateX(0)}
    20%,60%{transform:translateX(-4px)}
    40%,80%{transform:translateX(4px)}
  }`;
  document.head.appendChild(style);
})();
