/**
 * Abrar Ali — Premium Portfolio JS
 * Particles · Custom Cursor · Magnetic Buttons · Scroll Animations · Typed Effect
 */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     Helpers
  ------------------------------------------------------------------ */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ------------------------------------------------------------------
     Page Loader
  ------------------------------------------------------------------ */
  window.addEventListener('load', () => {
    const loader = $('#pageLoader');
    if (loader) {
      setTimeout(() => loader.classList.add('loaded'), 600);
    }
    initAll();
  });

  function initAll() {
    initCustomCursor();
    initScrollProgress();
    initHeaderScroll();
    initNavigation();
    initMobileNav();
    initRevealOnScroll();
    initParticles();
    initTyped();
    initPortfolio();
    initTestimonials();
    initBackToTop();
    initMagneticButtons();
    initAOS();
    initPureCounter();
    initLightbox();
  }

  /* ------------------------------------------------------------------
     Custom Cursor (desktop only)
  ------------------------------------------------------------------ */
  function initCustomCursor() {
    if (window.innerWidth < 1024) return;
    const dot = $('#cursorDot');
    const ring = $('#cursorRing');
    if (!dot || !ring) return;

    let mx = 0, my = 0, dx = 0, dy = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function animate() {
      dx += (mx - dx) * 0.15;
      dy += (my - dy) * 0.15;
      dot.style.left = mx + 'px';
      dot.style.top = my + 'px';
      ring.style.left = dx + 'px';
      ring.style.top = dy + 'px';
      requestAnimationFrame(animate);
    })();

    // Hover states
    const hoverEls = $$('a, button, .magnetic-btn, .portfolio-card, .service-card, .glass-card');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  /* ------------------------------------------------------------------
     Scroll Progress Bar
  ------------------------------------------------------------------ */
  function initScrollProgress() {
    const bar = $('#scrollProgress');
    if (!bar) return;
    window.addEventListener('scroll', () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
      bar.style.width = pct + '%';
    }, { passive: true });
  }

  /* ------------------------------------------------------------------
     Header Scroll Effect
  ------------------------------------------------------------------ */
  function initHeaderScroll() {
    const header = $('#header');
    if (!header) return;
    const check = () => header.classList.toggle('scrolled', window.scrollY > 60);
    window.addEventListener('scroll', check, { passive: true });
    check();
  }

  /* ------------------------------------------------------------------
     Navigation (scroll spy + smooth scroll)
  ------------------------------------------------------------------ */
  function initNavigation() {
    const links = $$('.scrollto');
    const sections = $$('section[id]');

    // Smooth scroll on click
    links.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const target = $(link.getAttribute('href'));
        if (target) {
          window.scrollTo({ top: target.offsetTop - 70, behavior: 'smooth' });
        }
        // Close mobile nav if open
        closeMobileNav();
      });
    });

    // Scroll spy
    function updateActive() {
      const pos = window.scrollY + 200;
      sections.forEach(sec => {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const id = sec.getAttribute('id');
        const navLink = $(`.nav-menu a[href="#${id}"]`);
        if (navLink) {
          if (pos >= top && pos < bottom) {
            $$('.nav-menu a').forEach(a => a.classList.remove('active'));
            navLink.classList.add('active');
          }
        }
      });
    }
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }

  /* ------------------------------------------------------------------
     Mobile Navigation
  ------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = $('#mobileNavToggle');
    const overlay = $('#mobileNavOverlay');
    if (!toggle || !overlay) return;

    toggle.addEventListener('click', () => {
      const isActive = toggle.classList.toggle('active');
      overlay.classList.toggle('active', isActive);
      document.body.style.overflow = isActive ? 'hidden' : '';
    });
  }

  function closeMobileNav() {
    const toggle = $('#mobileNavToggle');
    const overlay = $('#mobileNavOverlay');
    if (toggle) toggle.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  /* ------------------------------------------------------------------
     Reveal on Scroll
  ------------------------------------------------------------------ */
  function initRevealOnScroll() {
    const reveals = $$('.reveal-text');
    if (!reveals.length) return;

    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('revealed'), i * 80);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach(el => obs.observe(el));
  }

  /* ------------------------------------------------------------------
     Particle Canvas (Hero Background)
  ------------------------------------------------------------------ */
  function initParticles() {
    const canvas = $('#particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h, particles = [], mouse = { x: -1000, y: -1000 };
    const PARTICLE_COUNT = Math.min(80, Math.floor(window.innerWidth / 18));
    const CONNECT_DIST = 140;

    function resize() {
      w = canvas.width = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    canvas.addEventListener('mousemove', e => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -1000; mouse.y = -1000; });

    class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.r = Math.random() * 1.5 + 0.5;
        this.alpha = Math.random() * 0.4 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > w) this.vx *= -1;
        if (this.y < 0 || this.y > h) this.vy *= -1;

        // Mouse repel
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const force = (120 - dist) / 120 * 0.02;
          this.vx += dx * force;
          this.vy += dy * force;
        }
        // Damping
        this.vx *= 0.999;
        this.vy *= 0.999;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(162, 155, 254, ${this.alpha})`;
        ctx.fill();
      }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const opacity = (1 - dist / CONNECT_DIST) * 0.12;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108, 92, 231, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, w, h);
      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ------------------------------------------------------------------
     Typed Effect
  ------------------------------------------------------------------ */
  function initTyped() {
    const el = $('.typed');
    if (!el) return;
    const items = el.getAttribute('data-typed-items');
    if (!items) return;
    new Typed('.typed', {
      strings: items.split(',').map(s => s.trim()),
      loop: true,
      typeSpeed: 60,
      backSpeed: 30,
      backDelay: 2500,
      showCursor: true,
      cursorChar: '|'
    });
  }

  /* ------------------------------------------------------------------
     Portfolio (Isotope + Lightbox)
  ------------------------------------------------------------------ */
  function initPortfolio() {
    const container = $('.portfolio-grid');
    if (!container) return;

    let iso;
    // wait for images
    setTimeout(() => {
      iso = new Isotope(container, {
        itemSelector: '.portfolio-card',
        layoutMode: 'fitRows',
        transitionDuration: '0.6s'
      });
    }, 300);

    const filters = $$('.filter-btn');
    filters.forEach(btn => {
      btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        if (iso) {
          iso.arrange({ filter: btn.dataset.filter });
        }
      });
    });
  }

  function initLightbox() {
    GLightbox({ selector: '.portfolio-lightbox' });
  }

  /* ------------------------------------------------------------------
     Testimonials Slider
  ------------------------------------------------------------------ */
  function initTestimonials() {
    new Swiper('.testimonials-slider', {
      speed: 600,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      slidesPerView: 1,
      spaceBetween: 24,
      pagination: { el: '.swiper-pagination', type: 'bullets', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2, spaceBetween: 24 },
        1200: { slidesPerView: 3, spaceBetween: 24 }
      }
    });
  }

  /* ------------------------------------------------------------------
     Back to Top
  ------------------------------------------------------------------ */
  function initBackToTop() {
    const btn = $('#backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('active', window.scrollY > 400);
    }, { passive: true });
    btn.addEventListener('click', e => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ------------------------------------------------------------------
     Magnetic Buttons (desktop hover effect)
  ------------------------------------------------------------------ */
  function initMagneticButtons() {
    if (window.innerWidth < 1024) return;
    const btns = $$('.magnetic-btn');
    btns.forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0, 0)';
      });
    });
  }

  /* ------------------------------------------------------------------
     AOS (Animate on Scroll)
  ------------------------------------------------------------------ */
  function initAOS() {
    AOS.init({
      duration: 900,
      easing: 'ease-out-cubic',
      once: true,
      offset: 60,
      mirror: false
    });
  }

  /* ------------------------------------------------------------------
     PureCounter
  ------------------------------------------------------------------ */
  function initPureCounter() {
    new PureCounter();
  }
})();

