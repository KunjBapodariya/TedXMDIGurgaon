/* ===================================================
   TEDx7.0 Landing Page — JavaScript
   Video controls, scroll animations, nav, counters
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ---- Preloader ----
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader.classList.add('hidden'), 600);
  });
  // Fallback: hide preloader after 3s even if load event is slow
  setTimeout(() => preloader.classList.add('hidden'), 3000);

  // ---- Background video — ensure autoplay on all devices ----
  const bgVideo = document.getElementById('hero-video-bg');
  if (bgVideo) {
    bgVideo.play().catch(() => {
      // Autoplay blocked — show poster image as fallback
      bgVideo.style.display = 'none';
      const fallback = document.createElement('img');
      fallback.src = bgVideo.poster;
      fallback.alt = 'TEDx6.0 Metanoia';
      fallback.style.cssText = 'width:100%;height:100%;object-fit:cover;';
      bgVideo.parentElement.appendChild(fallback);
    });
  }

  // ---- Featured Video Preview Card — Play / Pause / Sound ----
  const previewVideo = document.getElementById('hero-video-preview');
  const playBtn = document.getElementById('hero-play-btn');
  const soundBtn = document.getElementById('hero-sound-btn');

  if (previewVideo && playBtn) {
    const playIcon = playBtn.querySelector('.play-icon');
    const pauseIcon = playBtn.querySelector('.pause-icon');

    function setPlayingUI(playing) {
      if (playing) {
        playBtn.classList.add('is-playing');
        playIcon.style.display = 'none';
        pauseIcon.style.display = 'block';
      } else {
        playBtn.classList.remove('is-playing');
        playIcon.style.display = 'block';
        pauseIcon.style.display = 'none';
      }
    }

    playBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (previewVideo.paused) {
        previewVideo.play();
        setPlayingUI(true);
      } else {
        previewVideo.pause();
        setPlayingUI(false);
      }
    });

    // Click anywhere on the player area to toggle
    const playerArea = previewVideo.closest('.hero__video-card-player');
    playerArea.addEventListener('click', () => {
      if (previewVideo.paused) {
        previewVideo.play();
        setPlayingUI(true);
      } else {
        previewVideo.pause();
        setPlayingUI(false);
      }
    });

    // Auto-play the preview when card becomes visible
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          previewVideo.play().then(() => setPlayingUI(true)).catch(() => {});
          cardObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });
    cardObserver.observe(previewVideo.closest('.hero__video-card'));
  }

  if (previewVideo && soundBtn) {
    const mutedIcon = soundBtn.querySelector('.muted-icon');
    const unmutedIcon = soundBtn.querySelector('.unmuted-icon');

    soundBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      previewVideo.muted = !previewVideo.muted;
      if (previewVideo.muted) {
        mutedIcon.style.display = 'block';
        unmutedIcon.style.display = 'none';
      } else {
        mutedIcon.style.display = 'none';
        unmutedIcon.style.display = 'block';
      }
    });
  }

  // ---- Sticky Nav ----
  const nav = document.getElementById('nav');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.classList.add('nav--scrolled');
    } else {
      nav.classList.remove('nav--scrolled');
    }
  }, { passive: true });

  // ---- Mobile Nav Toggle ----
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu on link click
  navLinks.querySelectorAll('.nav__link, .nav__cta').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.classList.remove('active');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // ---- Scroll Reveal (Intersection Observer) ----
  const revealElements = document.querySelectorAll('.reveal, .theme__title-line, .theme__subtitle, .speaker-card');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // ---- Animated Counter ----
  const counters = document.querySelectorAll('.stat__number[data-count]');
  let countersAnimated = false;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !countersAnimated) {
        countersAnimated = true;
        animateCounters();
        counterObserver.disconnect();
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'), 10);
      const duration = 2000;
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out quart
        const eased = 1 - Math.pow(1 - progress, 4);
        const current = Math.round(eased * target);

        counter.textContent = current + (target >= 100 ? '+' : '');

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target + (target >= 100 ? '+' : '');
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ---- Parallax-like subtle movement on hero background ----
  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia && window.matchMedia('(min-width: 768px)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const heroHeight = document.querySelector('.hero').offsetHeight;
      if (scrollY < heroHeight) {
        const parallax = scrollY * 0.25;
        heroMedia.style.transform = `translateY(${parallax}px)`;
      }
    }, { passive: true });
  }

  // ---- Active nav link highlight ----
  const sections = document.querySelectorAll('section[id]');
  const navLinksAll = document.querySelectorAll('.nav__link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });
    navLinksAll.forEach(link => {
      link.style.color = '';
      if (link.getAttribute('href') === '#' + current) {
        link.style.color = '#FFFFFF';
      }
    });
  }, { passive: true });
});
