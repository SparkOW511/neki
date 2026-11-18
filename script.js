// ---------- Smooth in-page nav + active link ----------
const links = document.querySelectorAll('[data-link]');
const navEl = document.getElementById('siteNav');
const mobileMenu = document.getElementById('mobileMenu');
const navToggle = document.getElementById('navToggle');

links.forEach((link) => {
  link.addEventListener('click', (e) => {
    const href = link.getAttribute('href');
    if (!href || !href.startsWith('#')) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    closeMobileMenu();
    history.replaceState(null, '', href);
  });
});

function closeMobileMenu() {
  mobileMenu.classList.remove('is-open');
  navToggle.classList.remove('is-open');
  navToggle.setAttribute('aria-expanded', 'false');
}

navToggle.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('is-open');
  navToggle.classList.toggle('is-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
});

// ---------- Scroll state: nav bg, progress bar, active section ----------
const progressFill = document.getElementById('progressFill');
const sections = document.querySelectorAll('main section[id]');
const navAnchors = document.querySelectorAll('.nav-links a[data-link]');

function onScroll() {
  const scrollY = window.scrollY;
  navEl.classList.toggle('is-scrolled', scrollY > 20);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  progressFill.style.width = pct + '%';

  let currentId = sections[0]?.id;
  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();
    if (rect.top <= window.innerHeight * 0.35) {
      currentId = section.id;
    }
  });
  navAnchors.forEach((a) => {
    a.classList.toggle('is-active', a.getAttribute('href') === `#${currentId}`);
  });
}
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---------- Reveal on scroll (IntersectionObserver) ----------
const revealEls = document.querySelectorAll('.reveal, .reveal-up, .hero-title');

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        entry.target.querySelectorAll('.reveal-line').forEach((el) => el.classList.add('in-view'));
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
);
revealEls.forEach((el) => io.observe(el));

// hero title reveals immediately on load, not on scroll
requestAnimationFrame(() => {
  document.querySelector('.hero-title')?.classList.add('in-view');
});

// ---------- Custom cursor ----------
const cursorDot = document.querySelector('.cursor-dot');
const cursorRing = document.querySelector('.cursor-ring');
const isFinePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (isFinePointer && cursorDot && cursorRing) {
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    cursorRing.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .magnetic').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing.classList.add('is-active'));
    el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-active'));
  });
}

// ---------- Magnetic buttons ----------
if (isFinePointer) {
  document.querySelectorAll('.magnetic').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      el.style.transform = `translate(${x * 0.25}px, ${y * 0.35}px)`;
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'translate(0, 0)';
    });
  });
}

// ---------- Footer year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Initial hash scroll ----------
if (location.hash) {
  const target = document.querySelector(location.hash);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
}
