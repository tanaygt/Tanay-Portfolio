/* ============================
   TANAY SHRIVASTAVA - PORTFOLIO
   app.js - Main JavaScript
   ============================ */

// ===== LOADER =====
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
    initAnimations();
  }, 2000);
});

// ===== PARTICLE SYSTEM =====
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.speedX = (Math.random() - 0.5) * 0.4;
      this.speedY = (Math.random() - 0.5) * 0.4;
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = ['#6366f1','#3b82f6','#06b6d4','#8b5cf6'][Math.floor(Math.random()*4)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for (let i = 0; i < 120; i++) particles.push(new Particle());

  function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist / 100) * 0.08;
          ctx.strokeStyle = '#6366f1';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connectParticles();
    animId = requestAnimationFrame(animate);
  }
  animate();
}

// ===== NAVBAR =====
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
      backToTop.classList.add('show');
    } else {
      navbar.classList.remove('scrolled');
      backToTop.classList.remove('show');
    }

    // Active nav link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll('.nav-link').forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current) link.classList.add('active');
    });
  });

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ===== MOBILE MENU =====
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  hamburger.addEventListener('click', () => {
    mobileMenu.classList.toggle('open');
  });
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
    }
  });
}

// ===== ROTATING TEXT =====
function initRotatingText() {
  const roles = ['AI Developer', 'Supply Chain Analyst', 'Full Stack Builder', 'Problem Solver', 'Community Leader'];
  let index = 0;
  const el = document.getElementById('rotatingText');
  if (!el) return;

  function rotate() {
    el.style.opacity = '0';
    el.style.transform = 'translateY(-10px)';
    setTimeout(() => {
      index = (index + 1) % roles.length;
      el.textContent = roles[index];
      el.style.opacity = '1';
      el.style.transform = 'translateY(0)';
    }, 400);
  }

  el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
  setInterval(rotate, 2800);
}

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  const startTime = performance.now();
  const duration = 2000;
  const isDecimal = target % 1 !== 0;

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isDecimal ? (target * eased).toFixed(1) : Math.round(target * eased);
    el.textContent = value;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target;
  }
  requestAnimationFrame(update);
}

// ===== SKILL BAR ANIMATION =====
function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target;
        fill.style.width = fill.getAttribute('data-width') + '%';
        observer.unobserve(fill);
      }
    });
  }, { threshold: 0.3 });
  fills.forEach(f => observer.observe(f));
}

// ===== AOS (SCROLL ANIMATIONS) =====
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  const delayMap = {
    '100': 100, '200': 200, '300': 300, '400': 400, '500': 500
  };

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}

// ===== STAT COUNTERS =====
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.getAttribute('data-target')));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => observer.observe(c));
}

// ===== KPI COUNTERS =====
function initKPICounters() {
  const counters = document.querySelectorAll('.counter-kpi');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseFloat(el.getAttribute('data-target')));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
}

// ===== GITHUB CONTRIBUTION GRID =====
function initGithubGrid() {
  const grid = document.getElementById('githubGrid');
  if (!grid) return;
  const levels = [0, 1, 2, 3, 4];
  const weights = [35, 25, 20, 12, 8];

  function getRandom() {
    let r = Math.random() * 100;
    let cum = 0;
    for (let i = 0; i < weights.length; i++) {
      cum += weights[i];
      if (r < cum) return levels[i];
    }
    return 0;
  }

  for (let i = 0; i < 182; i++) {
    const cell = document.createElement('div');
    const lvl = getRandom();
    cell.className = `github-cell${lvl > 0 ? ' l' + lvl : ''}`;
    cell.title = `${lvl > 0 ? lvl * 2 : 0} contributions`;
    grid.appendChild(cell);
  }
}

// ===== PROJECT FILTERS =====
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      cards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.opacity = '1';
          card.style.transform = '';
          card.style.pointerEvents = '';
        } else {
          card.style.opacity = '0.2';
          card.style.transform = 'scale(0.97)';
          card.style.pointerEvents = 'none';
        }
        card.style.transition = 'all 0.35s ease';
      });
    });
  });
}

// ===== CONTACT FORM =====
function initContactForm() {
  const form = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('formSubmitBtn');
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    // Simulate email send (replace with EmailJS or FormSubmit in production)
    setTimeout(() => {
      success.classList.add('show');
      btn.innerHTML = '<i class="fas fa-check"></i> Sent!';
      btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
      form.reset();
      setTimeout(() => {
        success.classList.remove('show');
        btn.innerHTML = '<i class="fas fa-paper-plane"></i> Send Message';
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }, 1800);
  });
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ===== 3D TILT EFFECT on Cards =====
function initCardTilt() {
  document.querySelectorAll('.project-card, .glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
    });
    card.addEventListener('mouseenter', () => {
      card.style.transition = 'transform 0.1s ease';
    });
  });
}

// ===== GLOWING CURSOR TRAIL =====
function initCursorTrail() {
  if (window.matchMedia('(pointer: coarse)').matches) return; // skip on touch
  const trail = document.createElement('div');
  trail.style.cssText = `
    position: fixed; width: 300px; height: 300px;
    border-radius: 50%; pointer-events: none; z-index: 0;
    background: radial-gradient(circle, rgba(99,102,241,0.06), transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
  `;
  document.body.appendChild(trail);
  document.addEventListener('mousemove', e => {
    trail.style.left = e.clientX + 'px';
    trail.style.top = e.clientY + 'px';
  });
}

// ===== TYPEWRITER for hero on load =====
function initTypewriter() {
  const title = document.querySelector('.hero-title');
  if (!title) return;
  title.style.opacity = '1';
}

// ===== PROFILE IMAGE FALLBACK =====
function initProfileFallback() {
  const img = document.getElementById('profileImg');
  if (!img) return;
  img.addEventListener('error', () => {
    // Create SVG avatar fallback
    const container = img.parentElement;
    img.style.display = 'none';
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 200 200');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.innerHTML = `
      <defs>
        <linearGradient id="avatarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#6366f1"/>
          <stop offset="100%" stop-color="#06b6d4"/>
        </linearGradient>
      </defs>
      <rect width="200" height="200" fill="url(#avatarGrad)"/>
      <circle cx="100" cy="75" r="35" fill="rgba(255,255,255,0.3)"/>
      <ellipse cx="100" cy="165" rx="55" ry="45" fill="rgba(255,255,255,0.2)"/>
      <text x="100" y="105" text-anchor="middle" fill="white" font-size="36" font-weight="700" font-family="Inter,sans-serif">TS</text>
    `;
    container.appendChild(svg);
  });
}

// ===== ANALYTICS SECTION GLOW =====
function initAnalyticsGlow() {
  const section = document.getElementById('analytics');
  if (!section) return;
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.bar').forEach((bar, i) => {
          setTimeout(() => {
            bar.style.background = 'linear-gradient(180deg, #6366f1, #06b6d4)';
            bar.style.boxShadow = '0 0 12px rgba(99,102,241,0.5)';
          }, i * 120);
        });
      }
    });
  }, { threshold: 0.3 });
  observer.observe(section);
}

// ===== SCROLL PROGRESS BAR =====
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed; top: 0; left: 0; height: 3px;
    background: linear-gradient(90deg, #6366f1, #3b82f6, #06b6d4);
    z-index: 9998; width: 0%; transition: width 0.1s;
  `;
  document.body.appendChild(bar);
  window.addEventListener('scroll', () => {
    const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    bar.style.width = scrolled + '%';
  });
}

// ===== INIT ALL =====
function initAnimations() {
  initParticles();
  initNavbar();
  initMobileMenu();
  initRotatingText();
  initAOS();
  initStatCounters();
  initKPICounters();
  initSkillBars();
  initGithubGrid();
  initProjectFilters();
  initContactForm();
  initSmoothScroll();
  initCardTilt();
  initCursorTrail();
  initTypewriter();
  initProfileFallback();
  initAnalyticsGlow();
  initScrollProgress();
}
