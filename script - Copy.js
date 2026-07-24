/*
  File: script.js
  Purpose: Site interactions - smooth scroll, loading state, hero video readiness, navigation toggles, and reveal animations.
  Last modified: 2026-07-22
*/
/* =========================
  SMOOTH SCROLL
========================= */
const header = document.querySelector('.site-header');
const loadingScreen = document.querySelector('.loading-screen');
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelectorAll('.site-nav a');
const reveals = document.querySelectorAll('.reveal');
const heroVideos = document.querySelectorAll('.hero-background-video');

if (window.Lenis) {
  const lenis = new Lenis({ duration: 1.2, smooth: true });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

/* =========================
  LOADING STATE
========================= */
window.addEventListener('load', () => {
  loadingScreen?.classList.add('hidden');
  document.body.classList.add('loaded');
});

/* =========================
  VIDEO PREVIEW STATE
========================= */
heroVideos.forEach((video) => {
  video.addEventListener('loadeddata', () => {
    video.classList.add('ready');
  });
});

/* =========================
  HEADER SCROLL
========================= */
const toggleHeader = () => {
  header?.classList.toggle('scrolled', window.scrollY > 24);
};

window.addEventListener('scroll', toggleHeader, { passive: true });
toggleHeader();

/* =========================
  MOBILE NAVIGATION
========================= */
menuToggle?.addEventListener('click', () => {
  document.body.classList.toggle('nav-open');
});

navLinks.forEach((link) => {
  link.addEventListener('click', () => document.body.classList.remove('nav-open'));
});

/* =========================
  ACTIVE NAV LINK
========================= */
const activePage = document.body.dataset.page || 'home';
navLinks.forEach((link) => {
  const pageName = link.dataset.nav;
  link.classList.toggle('active', pageName === activePage);
});

/* =========================
  REVEAL ANIMATIONS
========================= */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

reveals.forEach((item) => revealObserver.observe(item));

/* =========================
  GSAP ENTRANCES
========================= */
if (window.gsap) {
  gsap.from(['.hero-copy', '.hero-copy-card'], { duration: 1.1, y: 30, opacity: 0, ease: 'power3.out' });
  gsap.from('.page-hero', { duration: 1, y: 24, opacity: 0, ease: 'power3.out', delay: 0.15 });
}

/* =========================
  IMAGE VARIANTS LIGHTBOX (GLASS STYLE)
========================= */
(function () {
  const selector = [
    '.poster-card img',
    '.art-card img',
    '.fashion-card img',
    '.featured-project-card img',
    '.collection-card img',
    '.project-card img',
    '.poster-grid img',
    '.art-grid img',
    '.fashion-grid img',
    '.project-grid img',
    '.collection-grid img'
  ].join(',');

  // Build modal DOM
  const backdrop = document.createElement('div');
  backdrop.className = 'gm-backdrop';
  backdrop.innerHTML = `
    <div class="gm-modal" role="dialog" aria-modal="true">
      <div class="gm-media">
        <div class="gm-controls">
          <button class="gm-btn gm-close" aria-label="Close">Close</button>
        </div>
        <img class="gm-current" src="" alt="">
      </div>
      <div class="gm-thumbs" role="list"></div>
    </div>
  `;
  document.body.appendChild(backdrop);

  const gmCurrent = backdrop.querySelector('.gm-current');
  const gmThumbs = backdrop.querySelector('.gm-thumbs');
  const gmClose = backdrop.querySelector('.gm-close');

  let currentVariants = [];
  let currentIndex = 0;

  function parseVariants(el) {
    // look for data-variants on the image or parent card
    const raw = el.dataset.variants || el.closest('.poster-card')?.dataset.variants || '';
    if (!raw) return [el.src];
    // allow JSON array or comma-separated
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length) return parsed;
    } catch (e) { /* not JSON */ }
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }

  function openModal(variants, index = 0) {
    currentVariants = variants.length ? variants : [''];
    currentIndex = Math.min(Math.max(0, index), currentVariants.length - 1);
    gmThumbs.innerHTML = '';
    currentVariants.forEach((src, i) => {
      const b = document.createElement('button');
      b.className = 'gm-thumb';
      if (i === currentIndex) b.classList.add('active');
      b.innerHTML = `<img src="${src}" alt="variant-${i}">`;
      b.addEventListener('click', () => showIndex(i));
      gmThumbs.appendChild(b);
    });
    showIndex(currentIndex);
    backdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    backdrop.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showIndex(i) {
    currentIndex = i;
    gmCurrent.src = currentVariants[currentIndex];
    // mark active
    gmThumbs.querySelectorAll('.gm-thumb').forEach((t, idx) => {
      t.classList.toggle('active', idx === currentIndex);
    });
  }

  // global click to open
  function onImageClick(e) {
    const img = e.target.closest('img');
    if (!img) return;
    if (!img.matches(selector)) return;
    e.preventDefault();
    const variants = parseVariants(img);
    openModal(variants, variants.indexOf(img.src) || 0);
  }

  document.addEventListener('click', onImageClick);
  gmClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', (ev) => {
    if (ev.target === backdrop) closeModal();
  });
  // esc to close
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();

