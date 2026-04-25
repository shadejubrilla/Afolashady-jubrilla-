/* ══════════════════════════════════════════════════════════
   AFOLASHADE JOY JUBRILLA — GLOBAL JS v3.0
══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── CURSOR ─────────────────────────────────────────── */
  const dot = document.getElementById('c-dot');
  const ring = document.getElementById('c-ring');
  if (dot && ring) {
    let mx = 0, my = 0, rx = 0, ry = 0;
    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
    (function loop() {
      dot.style.left = mx + 'px'; dot.style.top = my + 'px';
      rx += (mx - rx) * .1; ry += (my - ry) * .1;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(loop);
    })();
    const hoverEls = 'a, button, .pillar-card, .gallery-item, .test-card, .press-card, .pub-card, .metric-card, .skill-item, .tl-item, .fw-badge';
    document.querySelectorAll(hoverEls).forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('hc'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('hc'));
    });
  }

  /* ── NAV SCROLL ─────────────────────────────────────── */
  const nav = document.getElementById('main-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('solid', window.scrollY > 40);
    }, { passive: true });
  }

  /* ── ACTIVE NAV LINK ────────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    const href = (a.getAttribute('href') || '').split('/').pop();
    if (href === page) a.classList.add('active');
  });

  /* ── SCROLL REVEAL ──────────────────────────────────── */
  const revEls = document.querySelectorAll('.rv');
  if (revEls.length) {
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('vis'); ro.unobserve(e.target); }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    revEls.forEach(el => ro.observe(el));
  }

  /* ── PARALLAX ───────────────────────────────────────── */
  const pfx = document.querySelectorAll('[data-parallax]');
  if (pfx.length) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      pfx.forEach(el => {
        const speed = parseFloat(el.dataset.parallax) || .2;
        el.style.transform = `translateY(${sy * speed}px)`;
      });
    }, { passive: true });
  }

  /* ── COUNT-UP ───────────────────────────────────────── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const co = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting || e.target.dataset.done) return;
        e.target.dataset.done = '1';
        const target = parseInt(e.target.dataset.count);
        const suffix = e.target.dataset.suffix || '';
        const dur = 1800;
        const start = performance.now();
        const step = now => {
          const p = Math.min((now - start) / dur, 1);
          const ease = 1 - Math.pow(1 - p, 3);
          const v = Math.floor(ease * target);
          e.target.textContent = (v >= 1000 ? Math.floor(v / 1000) + 'k' : v) + suffix;
          if (p < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
        co.unobserve(e.target);
      });
    }, { threshold: .4 });
    counters.forEach(el => co.observe(el));
  }

  /* ── BOOK 3D TILT ───────────────────────────────────── */
  const bk = document.getElementById('book-cover');
  if (bk) {
    bk.addEventListener('mousemove', e => {
      const r = bk.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top)  / r.height - .5;
      bk.style.transform = `rotateY(${x * 22}deg) rotateX(${-y * 14}deg)`;
    });
    bk.addEventListener('mouseleave', () => {
      bk.style.transform = 'rotateY(-10deg) rotateX(3deg)';
    });
  }

  /* ── 3D TILT CARDS ────────────────────────────────── */
  document.querySelectorAll('.pillar-card, .test-card, .press-card, .pub-card').forEach(card => {
    card.style.transition = 'transform .35s ease';
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5;
      const y = (e.clientY - r.top) / r.height - .5;
      card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 8}deg) translateZ(8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateY(0) rotateX(0) translateZ(0)';
    });
  });

  /* ── PORTRAIT PARALLAX ──────────────────────────────── */
  const pf = document.querySelector('.portrait-frame');
  if (pf) {
    document.addEventListener('mousemove', e => {
      const r = pf.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / window.innerWidth;
      const dy = (e.clientY - (r.top  + r.height / 2)) / window.innerHeight;
      const img = pf.querySelector('img');
      if (img) img.style.transform = `scale(1.06) translate(${dx * -14}px, ${dy * -9}px)`;
    }, { passive: true });
  }

  /* ── LIGHTBOX ───────────────────────────────────────── */
  const lb = document.getElementById('lightbox');
  if (lb) {
    const lbImg   = document.getElementById('lb-img');
    const lbCount = document.getElementById('lb-count');
    const items   = [...document.querySelectorAll('.gallery-item')];
    const srcs    = items.map(i => i.querySelector('img').src);
    let cur = 0;

    window.openLightbox = i => {
      cur = i; lbImg.src = srcs[i];
      lbCount.textContent = (i + 1) + ' / ' + srcs.length;
      lb.classList.add('open'); document.body.style.overflow = 'hidden';
    };
    window.closeLightbox = () => { lb.classList.remove('open'); document.body.style.overflow = ''; };
    window.lbNav = d => { cur = (cur + d + srcs.length) % srcs.length; openLightbox(cur); };
    lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') lbNav(1);
      if (e.key === 'ArrowLeft')  lbNav(-1);
    });
  }

  /* ── PORTFOLIO SECTION NAV ──────────────────────────── */
  const sectionBtns = document.querySelectorAll('[data-section-btn]');
  const sections    = document.querySelectorAll('[data-section]');
  if (sectionBtns.length) {
    sectionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const target = btn.dataset.sectionBtn;
        sectionBtns.forEach(b => b.classList.remove('active'));
        sections.forEach(s => s.classList.remove('active'));
        btn.classList.add('active');
        const sec = document.querySelector(`[data-section="${target}"]`);
        if (sec) sec.classList.add('active');
      });
    });
  }

  /* ── MOBILE MENU ────────────────────────────────────── */
  window.toggleMobileMenu = () => {
    const ex = document.getElementById('mob-menu');
    const backdrop = document.getElementById('mob-backdrop');
    const tog = document.querySelector('.mob-tog');
    
    if (ex) { 
      ex.style.opacity = '0';
      ex.style.transform = 'translateY(-30px)';
      if(backdrop) backdrop.style.opacity = '0';
      if(tog) tog.classList.remove('active');
      setTimeout(() => { ex.remove(); if(backdrop) backdrop.remove(); }, 350);
      return; 
    }
    
    const page = window.location.pathname.split('/').pop() || 'index.html';
    if(tog) tog.classList.add('active');
    
    const backdropEl = document.createElement('div');
    backdropEl.id = 'mob-backdrop';
    Object.assign(backdropEl.style, {
      position: 'fixed', inset: '0', zIndex: '998',
      background: 'rgba(6,6,9,.7)', backdropFilter: 'blur(6px)',
      WebkitBackdropFilter: 'blur(6px)',
      opacity: '0', transition: 'opacity .4s'
    });
    backdropEl.onclick = () => toggleMobileMenu();
    document.body.appendChild(backdropEl);
    setTimeout(() => backdropEl.style.opacity = '1', 10);
    
    const m = document.createElement('div');
    m.id = 'mob-menu';
    Object.assign(m.style, {
      position: 'fixed', top: '0', left: '0', right: '0', zIndex: '999',
      background: 'linear-gradient(180deg, rgba(12,12,20,.98) 0%, rgba(6,6,9,.99) 100%)',
      backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(200,169,110,.15)',
      padding: '100px 8vw 48px',
      display: 'flex', flexDirection: 'column', gap: '8px',
      opacity: '0', transform: 'translateY(-30px)',
      transition: 'opacity .4s cubic-bezier(.4,0,.2,1), transform .4s cubic-bezier(.4,0,.2,1)',
      boxShadow: '0 20px 60px rgba(0,0,0,.5)'
    });
    
    const menuHeader = document.createElement('div');
    menuHeader.innerHTML = `<span style="font-size:.52rem;letter-spacing:.35em;text-transform:uppercase;color:var(--gold);margin-bottom:24px;display:block">Navigation</span>`;
    Object.assign(menuHeader.style, {
      marginBottom: '16px', paddingBottom: '20px',
      borderBottom: '1px solid rgba(30,28,42,.5)'
    });
    m.appendChild(menuHeader);
    
    const navItems = [
      ['index.html', 'Landing'],
      ['home.html', 'Home'],
      ['portfolio.html', 'Portfolio'],
      ['book.html', 'Book'],
      ['resources.html', 'Knowledge Hub'],
      ['gallery.html', 'Gallery'],
      ['contact.html', 'Contact']
    ];
    
    navItems.forEach(([href, label], i) => {
      const isActive = href === page;
      const item = document.createElement('a');
      item.href = href;
      
      item.innerHTML = `
        <span style="flex:1">${label}</span>
        ${isActive ? '<span style="width:6px;height:6px;background:var(--gold);border-radius:50%"></span>' : ''}
      `;
      
      Object.assign(item.style, {
        display: 'flex', alignItems: 'center', gap: '12px',
        color: isActive ? 'var(--gold)' : 'var(--cream2)',
        textDecoration: 'none', fontSize: '1rem', 
        fontFamily: 'var(--font-body)', fontWeight: '300',
        padding: '16px 0',
        borderBottom: '1px solid rgba(30,28,42,.3)',
        transition: 'color .3s, padding-left .3s',
        opacity: '0', transform: 'translateX(-20px)',
        animation: `mob-item-in .4s ${0.1 + i * 0.06}s forwards`
      });
      
      item.onmouseenter = () => {
        if (!isActive) {
          item.style.color = 'var(--cream)';
          item.style.paddingLeft = '12px';
        }
      };
      item.onmouseleave = () => {
        if (!isActive) {
          item.style.color = 'var(--cream2)';
          item.style.paddingLeft = '0';
        }
      };
      item.onclick = () => {
        m.style.opacity = '0';
        m.style.transform = 'translateY(-20px)';
        backdrop.style.opacity = '0';
        setTimeout(() => { m.remove(); backdrop.remove(); }, 300);
      };
      
      m.appendChild(item);
    });
    
    const closeBtn = document.createElement('button');
    closeBtn.innerHTML = '✕';
    Object.assign(closeBtn.style, {
      position: 'absolute', top: '28px', right: '24px',
      width: '44px', height: '44px',
      background: 'rgba(30,28,42,.5)', border: '1px solid rgba(200,169,110,.2)',
      color: 'var(--gold)', fontSize: '1.2rem',
      cursor: 'none', borderRadius: '50%',
      transition: 'background .3s, transform .3s'
    });
    closeBtn.onmouseenter = () => {
      closeBtn.style.background = 'rgba(200,169,110,.1)';
      closeBtn.style.transform = 'rotate(90deg)';
    };
    closeBtn.onmouseleave = () => {
      closeBtn.style.background = 'rgba(30,28,42,.5)';
      closeBtn.style.transform = 'rotate(0deg)';
    };
    closeBtn.onclick = () => toggleMobileMenu();
    m.appendChild(closeBtn);
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes mob-item-in {
        to { opacity: 1; transform: translateX(0); }
      }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(m);
    setTimeout(() => {
      m.style.opacity = '1';
      m.style.transform = 'translateY(0)';
    }, 20);
  };

});
