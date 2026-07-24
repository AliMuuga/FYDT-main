/* ==========================================================================
   File: script.js
   Purpose: Digital Studio & Editorial Gallery Interactions
   Includes: Lenis smooth scroll, custom cursor tracking, text rotator, 
             mobile navigation, GSAP animations, dynamic lightbox modal.
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     01. DOM ELEMENTS & INITIALIZATION
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const loadingScreen = document.querySelector('.loading-screen');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelectorAll('.site-nav a');
  const reveals = document.querySelectorAll('.reveal');
  const heroVideos = document.querySelectorAll('.hero-background-video');
  const cursorDot = document.querySelector('.cursor-dot');

  /* --------------------------------------------------------------------------
     02. LENIS SMOOTH SCROLLING (OPTIMIZED FOR PERFORMANCE)
     -------------------------------------------------------------------------- */
  let lenis = null;
  if (typeof window.Lenis !== 'undefined') {
    lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false // Native touch scrolling to prevent mobile freezing
    });

    lenis.on('scroll', () => {
      if (window.ScrollTrigger) {
        ScrollTrigger.update();
      }
    });

    if (window.gsap) {
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (time) => {
        lenis.raf(time);
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
    }
  }

  /* --------------------------------------------------------------------------
     03. CUSTOM CURSOR TRACKING
     -------------------------------------------------------------------------- */
  if (cursorDot && window.matchMedia('(pointer: fine)').matches) {
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }, { passive: true });

    // Event Delegation for hover effects to handle dynamically added cards
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('a, button, .poster-card, .art-card, .fashion-card, .artwork-card, .project-card, .collection-card, .card');
      if (target) {
        cursorDot.classList.add('active');
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('a, button, .poster-card, .art-card, .fashion-card, .artwork-card, .project-card, .collection-card, .card');
      if (target) {
        cursorDot.classList.remove('active');
      }
    });
  }

  /* --------------------------------------------------------------------------
     04. LOADING STATE & PRELOADER
     -------------------------------------------------------------------------- */
  const hidePreloader = () => {
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
    }
    document.body.classList.add('loaded');
  };

  if (document.readyState === 'complete') {
    hidePreloader();
  } else {
    window.addEventListener('load', hidePreloader);
  }

  /* --------------------------------------------------------------------------
     05. HERO VIDEO & MEDIA READINESS
     -------------------------------------------------------------------------- */
  heroVideos.forEach((video) => {
    if (video.readyState >= 3) {
      video.classList.add('ready');
    } else {
      video.addEventListener('loadeddata', () => video.classList.add('ready'));
    }
  });

  /* --------------------------------------------------------------------------
     06. HEADER SCROLL & MOBILE NAVIGATION
     -------------------------------------------------------------------------- */
  const toggleHeader = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 24);
    }
  };

  window.addEventListener('scroll', toggleHeader, { passive: true });
  toggleHeader();

  menuToggle?.addEventListener('click', () => {
    document.body.classList.toggle('nav-open');
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => document.body.classList.remove('nav-open'));
  });

  /* Active Page Identifier */
  const activePage = document.body.dataset.page || 'home';
  navLinks.forEach((link) => {
    const pageName = link.dataset.nav;
    if (pageName) {
      link.classList.toggle('active', pageName === activePage);
    }
  });

  /* --------------------------------------------------------------------------
     07. HERO TEXT ROTATOR
     -------------------------------------------------------------------------- */
  const rotateTexts = document.querySelectorAll('.hero-text-rotator .rotate-text');
  if (rotateTexts.length > 1) {
    let activeTextIdx = 0;
    setInterval(() => {
      rotateTexts[activeTextIdx].classList.remove('active');
      activeTextIdx = (activeTextIdx + 1) % rotateTexts.length;
      rotateTexts[activeTextIdx].classList.add('active');
    }, 4000);
  }

  /* --------------------------------------------------------------------------
     08. INTERSECTION OBSERVER REVEAL ANIMATIONS
     -------------------------------------------------------------------------- */
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    reveals.forEach((item) => revealObserver.observe(item));
  }

  /* --------------------------------------------------------------------------
     09. ENHANCED GSAP ANIMATIONS & PARALLAX
     -------------------------------------------------------------------------- */
  if (window.gsap) {
    const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });

    // 1. Eyebrow badge
    if (document.querySelector('.hero-copy .eyebrow')) {
      heroTL.fromTo('.hero-copy .eyebrow', 
        { y: -20, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1.2 }
      );
    }

    // 2. Main Heading Reveal
    if (document.querySelector('.hero-copy h1')) {
      heroTL.fromTo('.hero-copy h1', 
        { y: 50, opacity: 0, skewY: 3 }, 
        { y: 0, opacity: 1, skewY: 0, duration: 1.3 },
        '-=0.8'
      );
    }

    // 3. Hero Subtitle & Rotator
    const subElements = document.querySelectorAll('.hero-title, .hero-text-rotator, .hero-subtitle');
    if (subElements.length > 0) {
      heroTL.fromTo(subElements, 
        { y: 25, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.15 },
        '-=0.9'
      );
    }

    // 4. Action Buttons
    if (document.querySelector('.hero-actions .btn')) {
      heroTL.fromTo('.hero-actions .btn', 
        { y: 20, opacity: 0, scale: 0.95 }, 
        { y: 0, opacity: 1, scale: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' },
        '-=0.6'
      );
    }

    // Interactive Hero Mouse Parallax
    const heroStage = document.querySelector('.hero-stage');
    const heroCopy = document.querySelector('.hero-copy');

    if (heroStage && heroCopy && window.matchMedia('(pointer: fine)').matches) {
      heroStage.addEventListener('mousemove', (e) => {
        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;
        
        const x = (clientX / innerWidth - 0.5) * 2;
        const y = (clientY / innerHeight - 0.5) * 2;

        gsap.to(heroCopy, {
          x: x * 12,
          y: y * 12,
          rotationY: x * 4,
          rotationX: -y * 4,
          duration: 0.8,
          ease: 'power2.out',
          transformPerspective: 1000
        });
      });

      heroStage.addEventListener('mouseleave', () => {
        gsap.to(heroCopy, {
          x: 0,
          y: 0,
          rotationY: 0,
          rotationX: 0,
          duration: 1,
          ease: 'power2.out'
        });
      });
    }
  }

  /* --------------------------------------------------------------------------
     10. ARTWORK LIGHTBOX MODAL (MULTI-VARIANT GALLERY)
     -------------------------------------------------------------------------- */
  (function initModal() {
    const cardSelector = [
      '.poster-card',
      '.art-card',
      '.fashion-card',
      '.featured-project-card',
      '.collection-card',
      '.project-card',
      '.artwork-card',
      '.card'
    ].join(',');

    let modal = document.querySelector('.art-modal') || document.querySelector('#artModal');

    // Create modal DOM structure dynamically if missing
    if (!modal) {
      modal = document.createElement('div');
      modal.className = 'art-modal';
      modal.id = 'artModal';
      modal.innerHTML = `
        <div class="art-modal-container">
          <button class="art-modal-close" aria-label="Close modal">Close</button>
          <div class="art-modal-stage">
            <button class="modal-nav prev" aria-label="Previous image">&larr;</button>
            <img src="" alt="Gallery Display">
            <button class="modal-nav next" aria-label="Next image">&rarr;</button>
          </div>
          <div class="art-modal-sidebar">
            <div class="modal-meta-header">
              <h2 class="modal-title"></h2>
              <span class="category-tag"></span>
            </div>
            <div class="modal-meta-body">
              <p class="modal-description"></p>
            </div>
            <div class="version-section">
              <span class="version-section-title">Versions / Angles</span>
              <div class="version-thumbnails"></div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
    }

    const modalImg = modal.querySelector('.art-modal-stage img');
    const modalTitle = modal.querySelector('.modal-title') || modal.querySelector('.modal-meta-header h2');
    const modalCategory = modal.querySelector('.category-tag');
    const modalDesc = modal.querySelector('.modal-description');
    const closeBtn = modal.querySelector('.art-modal-close');
    const versionContainer = modal.querySelector('.version-thumbnails');
    const prevBtn = modal.querySelector('.modal-nav.prev');
    const nextBtn = modal.querySelector('.modal-nav.next');

    let currentVariants = [];
    let currentIndex = 0;

    function parseVariants(cardEl, primaryImg) {
      // 1. Check for nested image elements (.variant-img)
      const nestedImgs = Array.from(cardEl.querySelectorAll('.variant-img')).map(i => i.src);
      if (nestedImgs.length > 0) return nestedImgs;

      // 2. Check for data-versions or data-variants attributes across card and primary image
      const raw = cardEl?.dataset.versions || 
                  cardEl?.dataset.variants || 
                  cardEl?.getAttribute('data-versions') || 
                  cardEl?.getAttribute('data-variants') || 
                  primaryImg?.dataset.versions || 
                  primaryImg?.dataset.variants || 
                  primaryImg?.getAttribute('data-versions') || 
                  primaryImg?.getAttribute('data-variants') || '';

      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed) && parsed.length) return parsed;
        } catch (e) {
          // Fallback parsing for comma-delimited string format
        }
        const splitString = raw.split(',').map(s => s.trim()).filter(Boolean);
        if (splitString.length > 0) return splitString;
      }

      // 3. Fallback to primary image source
      return primaryImg?.src ? [primaryImg.src] : [];
    }

    function showIndex(index) {
      if (!currentVariants.length) return;
      currentIndex = (index + currentVariants.length) % currentVariants.length;
      
      if (modalImg) {
        modalImg.style.opacity = '0.3';
        setTimeout(() => {
          modalImg.src = currentVariants[currentIndex];
          modalImg.style.opacity = '1';
        }, 80);
      }

      if (versionContainer) {
        versionContainer.querySelectorAll('img').forEach((thumb, idx) => {
          thumb.classList.toggle('active', idx === currentIndex);
        });
      }
    }

    function openModal(card, primaryImg) {
      const title = card.getAttribute('data-title') || card.querySelector('h2, h3')?.textContent || 'Untitled Artwork';
      const category = card.getAttribute('data-category') || card.querySelector('span, .eyebrow')?.textContent || 'Gallery Exhibition';
      const description = card.getAttribute('data-description') || card.querySelector('p')?.textContent || '';

      currentVariants = parseVariants(card, primaryImg);
      
      if (modalTitle) modalTitle.textContent = title;
      if (modalCategory) modalCategory.textContent = category;
      if (modalDesc) modalDesc.textContent = description;

      // Build variant thumbnails
      if (versionContainer) {
        versionContainer.innerHTML = '';
        if (currentVariants.length > 1) {
          if (versionContainer.parentElement) {
            versionContainer.parentElement.style.display = 'block';
          }
          currentVariants.forEach((src, i) => {
            const thumb = document.createElement('img');
            thumb.src = src;
            thumb.alt = `Variant ${i + 1}`;
            if (i === 0) thumb.classList.add('active');
            thumb.addEventListener('click', () => showIndex(i));
            versionContainer.appendChild(thumb);
          });
        } else if (versionContainer.parentElement) {
          versionContainer.parentElement.style.display = 'none';
        }
      }

      // Navigation controls visibility
      if (prevBtn) prevBtn.style.display = currentVariants.length > 1 ? 'grid' : 'none';
      if (nextBtn) nextBtn.style.display = currentVariants.length > 1 ? 'grid' : 'none';

      showIndex(0);
      modal.classList.add('active');

      if (lenis) {
        lenis.stop();
      } else {
        document.body.style.overflow = 'hidden';
      }
    }

    function closeModal() {
      modal.classList.remove('active');

      if (lenis) {
        lenis.start();
      } else {
        document.body.style.overflow = '';
      }
    }

    // Delegated click event listener
    document.addEventListener('click', (e) => {
      const card = e.target.closest(cardSelector);
      if (!card) return;

      const img = card.querySelector('img');
      if (!img) return;

      e.preventDefault();
      openModal(card, img);
    });

    // Control Handlers
    closeBtn?.addEventListener('click', closeModal);
    prevBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showIndex(currentIndex - 1);
    });
    nextBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      showIndex(currentIndex + 1);
    });

    // Close when clicking outside of artwork container
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('art-modal-stage')) {
        closeModal();
      }
    });

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;

      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowRight') showIndex(currentIndex + 1);
      if (e.key === 'ArrowLeft') showIndex(currentIndex - 1);
    });
  })();
});