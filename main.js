/**
 * SOIKOT STUDIO — Interactive Scripts
 * Handles Navigation, Video Showcase, ByTheNumbers, Scroll-Driven OurExpertise, CaseStudies, OurProcess, VideoTestimonials, FAQ & Blog
 */

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Hamburger Toggle
  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const navMenu = document.getElementById('navMenu');

  if (hamburgerBtn && navMenu) {
    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navMenu.classList.toggle('w--open');
      hamburgerBtn.setAttribute('aria-expanded', isOpen);

      // Animate hamburger icon bars
      const bars = hamburgerBtn.querySelectorAll('span');
      if (isOpen) {
        if (bars[0]) bars[0].style.transform = 'translateY(9px) rotate(45deg)';
        if (bars[1]) bars[1].style.opacity = '0';
        if (bars[2]) bars[2].style.transform = 'translateY(-9px) rotate(-45deg)';
      } else {
        if (bars[0]) bars[0].style.transform = 'none';
        if (bars[1]) bars[1].style.opacity = '1';
        if (bars[2]) bars[2].style.transform = 'none';
      }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !hamburgerBtn.contains(e.target)) {
        if (navMenu.classList.contains('w--open')) {
          navMenu.classList.remove('w--open');
          hamburgerBtn.setAttribute('aria-expanded', 'false');
          const bars = hamburgerBtn.querySelectorAll('span');
          if (bars[0]) bars[0].style.transform = 'none';
          if (bars[1]) bars[1].style.opacity = '1';
          if (bars[2]) bars[2].style.transform = 'none';
        }
      }
    });
  }

  // Pages Dropdown Toggle on Click (Mobile & Touch Devices)
  const pagesDropdown = document.getElementById('pagesDropdown');
  if (pagesDropdown) {
    const dropdownToggle = pagesDropdown.querySelector('.nav-dropdown-toggle');
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        if (window.innerWidth <= 991) {
          e.preventDefault();
          e.stopPropagation();
          const isOpen = pagesDropdown.classList.toggle('w--open');
          dropdownToggle.setAttribute('aria-expanded', isOpen);
        }
      });
    }
  }

  // Smooth scroll anchor link handler
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          if (window.lenisInstance) {
            window.lenisInstance.scrollTo(targetElement);
          } else {
            targetElement.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    });
  });

  // Initialize Global Lenis Smooth Scroll (Step 1)
  initLenis();

  // Initialize Components & Viewport-Aware Scroll Engine
  initScrollAnimations();
  initHeroGSAPMotion();
  ScrollFillText.initAll();
  initVideoShowcase();
  initByTheNumbers();
  initOurExpertise();
  initCaseStudies();
  initOurProcess();
  initVideoTestimonials();
  initVideoModal();
  initFAQ();
  initBlog();
  initNewsletter();
  initAboutUsScrollTrigger();
  initGetStartedScrollTrigger();
  initFooterWordmarkAnimation();
  initFooterCursorEffect();
});

/**
 * Global Lenis Smooth Scroll Initializer & GSAP ScrollTrigger Sync
 */
let lenisInstance = null;
function initLenis() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  if (typeof Lenis !== 'undefined') {
    lenisInstance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: window.innerWidth >= 768,
      touchMultiplier: 1.5,
    });
    window.lenisInstance = lenisInstance;

    // Sync Lenis with GSAP ScrollTrigger so animations stay synced
    if (typeof ScrollTrigger !== 'undefined') {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    function raf(time) {
      lenisInstance.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }
}

/**
 * Reusable ScrollFillText Component / Utility (Word-Level Gradient Fill)
 * Splits heading into individual word spans and sequentially animates each word's
 * backgroundPosition across the section's scroll range.
 */
class ScrollFillText {
  constructor(element, config = {}) {
    this.element = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.element) return;

    this.section = this.element.closest('section') || this.element.closest('.container') || this.element.parentElement;

    const dataset = this.element.dataset || {};
    this.config = {
      start: dataset.scrollFillStart || 'top 80%',
      end: dataset.scrollFillEnd || 'bottom 60%',
      minDistance: parseInt(dataset.scrollFillMinDistance, 10) || 320,
      ...config
    };

    this.words = [];
    this.ctx = null;
    this.init();
  }

  splitIntoWords(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent;
      if (!text.trim()) return;

      const words = text.split(/(\s+)/);
      const fragment = document.createDocumentFragment();

      words.forEach(part => {
        if (part.trim().length > 0) {
          const span = document.createElement('span');
          span.className = 'scroll-fill-word';
          span.textContent = part;
          fragment.appendChild(span);
          this.words.push(span);
        } else if (part.length > 0) {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      node.parentNode.replaceChild(fragment, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(child => this.splitIntoWords(child));
    }
  }

  init() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Split text into words if not already split
    this.words = Array.from(this.element.querySelectorAll('.scroll-fill-word'));
    if (this.words.length === 0) {
      this.splitIntoWords(this.element);
    }

    if (this.words.length === 0) return;

    const triggerEl = this.section || this.element;

    this.ctx = gsap.context(() => {
      // Build master scrub timeline for sequential word fill
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerEl,
          start: this.config.start,
          end: () => {
            if (this.section) {
              const sectionHeight = this.section.offsetHeight;
              if (sectionHeight < this.config.minDistance) {
                return `+=${this.config.minDistance}`;
              }
            }
            return this.config.end;
          },
          scrub: true,
          invalidateOnRefresh: true,
        }
      });

      this.words.forEach((word, i) => {
        tl.fromTo(
          word,
          { backgroundPosition: '100% 0' },
          {
            backgroundPosition: '0% 0',
            ease: 'none',
            duration: 1
          },
          i * 1 // Sequentially positioned in timeline
        );
      });
    }, this.element);
  }

  destroy() {
    if (this.ctx) {
      this.ctx.revert();
      this.ctx = null;
    }
  }

  static initAll() {
    const instances = [];
    document.querySelectorAll('.scroll-fill-text').forEach(el => {
      instances.push(new ScrollFillText(el));
    });
    return instances;
  }
}

/**
 * GSAP ScrollTrigger Motion Module
 * - Smooth Hero headline & subtext scroll parallax with subtle opacity fade
 * - Rotating Accent Starburst linked to scroll progress / velocity
 */
function initHeroGSAPMotion() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // 1. Hero Headline & Subtext Parallax
  const heroHeadline = document.getElementById('heroHeadline');
  const heroSubtext = document.getElementById('heroSubtext');
  const heroBg = document.getElementById('heroBgImg');

  if (heroHeadline) {
    gsap.to(heroHeadline, {
      y: -40,
      opacity: 0.65,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  if (heroSubtext) {
    gsap.to(heroSubtext, {
      y: -24,
      opacity: 0.70,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 0.85
      }
    });
  }

  if (heroBg) {
    gsap.to(heroBg, {
      yPercent: -6,
      scale: 1.03,
      ease: 'none',
      scrollTrigger: {
        trigger: '#home',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // 2. Rotating Accent Graphic (Starburst spins smoothly on scroll velocity & progress)
  const starburst = document.getElementById('starburstGraphic');
  if (starburst) {
    gsap.to(starburst, {
      rotation: 720,
      ease: 'none',
      scrollTrigger: {
        trigger: document.body,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.6
      }
    });
  }
}

/**
 * About Us Header ScrollTrigger Animation
 */
function initAboutUsScrollTrigger() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const section = document.getElementById('aboutUs');
  if (!section) return;

  const items = section.querySelectorAll('.about-us-tag, .about-us-subtext');
  if (!items.length) return;

  gsap.from(items, {
    opacity: 0,
    y: 28,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 85%',
      toggleActions: 'play none none none'
    }
  });
}

/**
 * Get Started CTA Section ScrollTrigger Animation
 */
function initGetStartedScrollTrigger() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const getStartedSection = document.getElementById('getStarted');
  if (!getStartedSection) return;

  const card = getStartedSection.querySelector('.pricing-cta-card');
  const items = getStartedSection.querySelectorAll('.get-started-tag, .get-started-subtext, .get-started-btn-wrap');

  if (card) {
    gsap.from(card, {
      scale: 0.94,
      opacity: 0,
      duration: 0.9,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: getStartedSection,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }

  if (items.length) {
    gsap.from(items, {
      opacity: 0,
      y: 26,
      duration: 0.8,
      stagger: 0.12,
      delay: 0.1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: getStartedSection,
        start: 'top 85%',
        toggleActions: 'play none none none'
      }
    });
  }
}

/**
 * Footer Wordmark Interactive Animation (Scroll Expansion + Mouse Sheen)
 */
function initFooterWordmarkAnimation() {
  const wordmark = document.querySelector('.footer-wordmark');
  const wrap = document.querySelector('.footer-wordmark-wrap');
  if (!wordmark || !wrap) return;

  // 1. ScrollTrigger reveal and expansion
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.fromTo(wordmark, 
      { yPercent: 25, opacity: 0.35, letterSpacing: '-0.06em' },
      {
        yPercent: 0,
        opacity: 1,
        letterSpacing: '-0.035em',
        ease: 'power2.out',
        scrollTrigger: {
          trigger: wrap,
          start: 'top 98%',
          end: 'bottom 85%',
          scrub: 1
        }
      }
    );
  }

  // 2. Interactive Spotlight Sheen on Hover / Mouse Move
  wrap.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    wordmark.style.setProperty('--sheen-x', `${x}%`);
  });

  wrap.addEventListener('mouseleave', () => {
    wordmark.style.setProperty('--sheen-x', '50%');
  });
}

/**
 * Newsletter Form Handler
 */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const msg = document.getElementById('newsletterMsg');
  if (!form || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('.footer-email-input');
    if (input && input.value) {
      msg.textContent = '✓ Thank you for subscribing to Soikot Studio news!';
      msg.style.color = '#4ECA77';
      input.value = '';
      setTimeout(() => {
        msg.textContent = '';
      }, 4500);
    }
  });
}

/**
 * VideoShowcase Component
 * Drives smooth cinematic scale-up linked to scroll progress through the pinned section
 */
function formatVideoTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

/**
 * VideoShowcase Component
 * Drives smooth cinematic scale-up linked to scroll progress through the pinned section
 * Features a full interactive video player (Play/Pause, Sound Decide, Scrubber, Real Minutes Display)
 */
function initVideoShowcase() {
  const showcaseSection = document.getElementById('aboutUs') || document.getElementById('videoShowcase') || document.querySelector('.video-showcase-section');
  const videoFrame = document.getElementById('videoFrame');
  const videoHeader = document.getElementById('videoShowcaseHeader');
  const video = document.getElementById('showcaseVideo');
  const playToggle = document.getElementById('videoPlayToggle');
  const playBtn = document.getElementById('showcasePlayBtn');
  const scrubber = document.getElementById('showcaseScrubber');
  const progressFill = document.getElementById('showcaseProgressFill');
  const progressHandle = document.getElementById('showcaseProgressHandle');
  const timeDisplay = document.getElementById('showcaseTimeDisplay');
  const muteBtn = document.getElementById('showcaseMuteBtn');
  const fullscreenBtn = document.getElementById('showcaseFullscreenBtn');

  if (!showcaseSection || !videoFrame) return;

  // 1. High-Performance Fluid Scroll Engine (Pinned Scale-Up as user scrolls)
  let currentProgress = 0;
  let targetProgress = 0;
  let rafId = null;

  function calculateProgress() {
    const track = showcaseSection.querySelector('.video-showcase-track') || showcaseSection;
    const rect = track.getBoundingClientRect();
    const scrollDistance = track.offsetHeight - window.innerHeight;

    if (scrollDistance <= 0) return 0;

    const scrolled = -rect.top;
    return Math.max(0, Math.min(1, scrolled / scrollDistance));
  }

  function updateMotion() {
    currentProgress += (targetProgress - currentProgress) * 0.16;

    const isMobile = window.innerWidth <= 767;

    // Scale curve: begins compact (0.78), expands smoothly to full presentation width (1.0)
    const startScale = isMobile ? 0.88 : 0.78;
    const targetScale = startScale + currentProgress * (1.0 - startScale);

    // Border-radius morphing (34px down to 20px on full expansion)
    const startRadius = isMobile ? 18 : 34;
    const endRadius = isMobile ? 12 : 20;
    const targetRadius = startRadius - currentProgress * (startRadius - endRadius);

    videoFrame.style.transform = `translate3d(0, 0, 0) scale(${targetScale.toFixed(4)})`;
    videoFrame.style.borderRadius = `${targetRadius.toFixed(1)}px`;

    if (Math.abs(targetProgress - currentProgress) > 0.0004) {
      rafId = window.requestAnimationFrame(updateMotion);
    } else {
      rafId = null;
    }
  }

  function onScroll() {
    targetProgress = calculateProgress();
    if (!rafId) {
      rafId = window.requestAnimationFrame(updateMotion);
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  if (window.lenisInstance) {
    window.lenisInstance.on('scroll', onScroll);
  }

  targetProgress = calculateProgress();
  currentProgress = targetProgress;
  updateMotion();

  // 2. Explicit User-Driven Video Playback & Controls (NO auto-play on scroll)
  if (video) {
    video.muted = false; // Allow full audio playback when user chooses to play
    video.controls = false;
    video.removeAttribute('controls');
    video.setAttribute('playsinline', '');

    function updatePlayStateUI(isPlaying) {
      if (isPlaying) {
        videoFrame.classList.add('is-playing');
        if (playToggle) {
          const playIcon = playToggle.querySelector('.play-icon');
          const pauseIcon = playToggle.querySelector('.pause-icon');
          if (playIcon) playIcon.style.display = 'none';
          if (pauseIcon) pauseIcon.style.display = 'block';
        }
        if (playBtn) {
          const ctrlPlay = playBtn.querySelector('.ctrl-play-icon');
          const ctrlPause = playBtn.querySelector('.ctrl-pause-icon');
          if (ctrlPlay) ctrlPlay.style.display = 'none';
          if (ctrlPause) ctrlPause.style.display = 'block';
        }
      } else {
        videoFrame.classList.remove('is-playing');
        if (playToggle) {
          const playIcon = playToggle.querySelector('.play-icon');
          const pauseIcon = playToggle.querySelector('.pause-icon');
          if (playIcon) playIcon.style.display = 'block';
          if (pauseIcon) pauseIcon.style.display = 'none';
        }
        if (playBtn) {
          const ctrlPlay = playBtn.querySelector('.ctrl-play-icon');
          const ctrlPause = playBtn.querySelector('.ctrl-pause-icon');
          if (ctrlPlay) ctrlPlay.style.display = 'block';
          if (ctrlPause) ctrlPause.style.display = 'none';
        }
      }
    }

    function togglePlayback(e) {
      if (e) e.stopPropagation();
      if (video.paused) {
        video.play().then(() => {
          updatePlayStateUI(true);
        }).catch(() => {
          // If browser blocks unmuted play without user gesture, fallback to muted play with unmute button
          video.muted = true;
          updateMuteStateUI(true);
          video.play().then(() => updatePlayStateUI(true)).catch(() => {});
        });
      } else {
        video.pause();
        updatePlayStateUI(false);
      }
    }

    if (playToggle) playToggle.addEventListener('click', togglePlayback);
    if (playBtn) playBtn.addEventListener('click', togglePlayback);

    // Click on video frame (except bottom controls bar) toggles playback
    videoFrame.addEventListener('click', (e) => {
      if (!e.target.closest('#showcaseControls') && !e.target.closest('.video-meta-bar')) {
        togglePlayback(e);
      }
    });

    // 3. Time Update & Scrubber Progress
    function updateTimeAndProgress() {
      const current = video.currentTime || 0;
      const duration = video.duration || 0;
      const percent = duration > 0 ? (current / duration) * 100 : 0;

      if (progressFill) progressFill.style.width = `${percent.toFixed(2)}%`;
      if (progressHandle) progressHandle.style.left = `${percent.toFixed(2)}%`;

      if (timeDisplay) {
        const curFormatted = formatVideoTime(current);
        const durFormatted = formatVideoTime(duration);
        timeDisplay.innerHTML = `<span class="video-current-time">${curFormatted}</span> / <span class="video-total-duration">${durFormatted}</span>`;
      }
    }

    video.addEventListener('timeupdate', updateTimeAndProgress);
    video.addEventListener('loadedmetadata', updateTimeAndProgress);
    video.addEventListener('ended', () => {
      updatePlayStateUI(false);
    });

    // 4. Scrubber Seek Interaction
    if (scrubber) {
      let isSeeking = false;

      function seekTo(e) {
        const rect = scrubber.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        if (width > 0 && video.duration) {
          const ratio = Math.max(0, Math.min(1, clickX / width));
          video.currentTime = ratio * video.duration;
          updateTimeAndProgress();
        }
      }

      scrubber.addEventListener('mousedown', (e) => {
        isSeeking = true;
        seekTo(e);
      });

      document.addEventListener('mousemove', (e) => {
        if (isSeeking) seekTo(e);
      });

      document.addEventListener('mouseup', () => {
        if (isSeeking) isSeeking = false;
      });
    }

    // 5. Sound / Mute Toggle (Decision by visitor)
    function updateMuteStateUI(isMuted) {
      if (!muteBtn) return;
      const unmutedIcon = muteBtn.querySelector('.ctrl-unmuted-icon');
      const mutedIcon = muteBtn.querySelector('.ctrl-muted-icon');
      if (isMuted) {
        if (unmutedIcon) unmutedIcon.style.display = 'none';
        if (mutedIcon) mutedIcon.style.display = 'block';
      } else {
        if (unmutedIcon) unmutedIcon.style.display = 'block';
        if (mutedIcon) mutedIcon.style.display = 'none';
      }
    }

    if (muteBtn) {
      muteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        video.muted = !video.muted;
        updateMuteStateUI(video.muted);
      });
    }

    // 6. Fullscreen Toggle
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!document.fullscreenElement) {
          if (videoFrame.requestFullscreen) {
            videoFrame.requestFullscreen();
          } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }
  }
}

/**
 * ByTheNumbers Component
 * Recreates the mechanical slot-counter / rolling number animation matching the Webflow reference
 */
function initByTheNumbers() {
  const section = document.getElementById('byTheNumbers');
  if (!section) return;

  const statItems = section.querySelectorAll('.about-us-counter-wrapper');
  let hasAnimated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        observer.unobserve(entry.target);

        statItems.forEach((statItem, statIdx) => {
          // Stagger item entrance fade and translation
          setTimeout(() => {
            statItem.classList.add('is-inview');
          }, statIdx * 120);

          // Animate each digit column inside this statistic item
          const digitCols = statItem.querySelectorAll('.counter-digit-single-wrapper');
          digitCols.forEach((col, colIdx) => {
            const digitCount = col.children.length;
            if (digitCount <= 1) return;

            // Target is the last digit in the stack
            const finalOffset = ((digitCount - 1) / digitCount) * 100;
            const duration = 1.6 + colIdx * 0.15;
            const delay = statIdx * 140 + colIdx * 80 + 100;

            col.style.transition = `transform ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
            
            // Trigger translation
            requestAnimationFrame(() => {
              col.style.transform = `translate3d(0, -${finalOffset}%, 0)`;
            });
          });
        });
      }
    });
  }, {
    threshold: 0.25,
    rootMargin: '0px 0px -50px 0px'
  });

  observer.observe(section);
}

/**
 * OurExpertise Component
 * Physical Continuous Upward Scroll Sequence:
 * 01 WEBSITE DESIGN & DEVELOPMENT
 *   ↓ (Panel 02 physically rises from below)
 * 02 AI AUTOMATION
 *   ↓ (Panel 03 physically rises from below)
 * 03 CHILDREN'S BOOK ILLUSTRATION
 */
function initOurExpertise() {
  const section = document.getElementById('ourExpertise');
  if (!section) return;

  const panel1 = document.getElementById('expertisePanel0');
  const panel2 = document.getElementById('expertisePanel1');
  const panel3 = document.getElementById('expertisePanel2');

  if (!panel1 || !panel2 || !panel3) return;

  function update() {
    const rect = section.getBoundingClientRect();
    const sectionHeight = section.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollDistance = sectionHeight - windowHeight;

    if (scrollDistance <= 0) return;

    // Scroll progress 0.0 -> 1.0 through the pinned section
    const scrolled = -rect.top;
    let progress = scrolled / scrollDistance;
    progress = Math.max(0, Math.min(1, progress));

    // Transition 1: Panel 2 (Violet) rises smoothly between progress 0.15 -> 0.45
    const t1 = Math.max(0, Math.min(1, (progress - 0.15) / 0.30));
    
    // Generous Resting Window: Panel 2 stays settled in full view from 0.45 -> 0.65
    // Transition 2: Panel 3 (Orange) rises smoothly between progress 0.65 -> 0.95
    const t2 = Math.max(0, Math.min(1, (progress - 0.65) / 0.30));

    // Continuous physical translation of Panel 2 (from 100% down to 0%)
    const panel2Y = (1 - t1) * 100;

    // Continuous physical translation of Panel 3 (from 100% down to 0%)
    const panel3Y = (1 - t2) * 100;

    // Apply clean edge-to-edge full-bleed translations (no black background reveal)
    panel1.style.transform = `translate3d(0, 0, 0)`;
    panel2.style.transform = `translate3d(0, ${panel2Y.toFixed(2)}%, 0)`;
    panel3.style.transform = `translate3d(0, ${panel3Y.toFixed(2)}%, 0)`;
  }

  // Optimized RAF binding
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial calculation
  update();
}



/**
 * ============================================================================
 * STACKED CARD CYCLER WIDGET
 * ============================================================================
 * Visual Structure:
 * - A stack of cards, same size, absolutely positioned inside a fixed container.
 * - Depth 0 (Front): rotate(0deg), translateY(0), scale(1), opacity: 1, zIndex: 3
 * - Depth 1: rotate(-4deg), translateY(8px), scale(0.96), opacity: 0.5, zIndex: 2
 * - Depth 2: rotate(-8deg), translateY(16px), scale(0.92), opacity: 0.25, zIndex: 1
 *
 * Cycle Animation (GSAP Timeline, runs every ~2.2s):
 * 1. Depth 0 exits: rotate ~ -15deg, translate down & left (x: -22, y: 38), fade to 0 (power2.in)
 * 2. Depth 1 -> Depth 0: rotate 0deg, translateY 0, scale 1, opacity 1, zIndex 3 (back.out(1.2))
 * 3. Depth 2 -> Depth 1: rotate -4deg, translateY 8px, scale 0.96, opacity 0.5, zIndex 2 (power2.out)
 * 4. Exited card is recycled to Depth 2 with next category data, ready for next round.
 *
 * Features:
 * - Auto-cycle on mount with hover-to-pause.
 * - Respects prefers-reduced-motion (skips rotation/motion, simple crossfade).
 * - Component API: props { categories: [{label, icon}], intervalMs: 2200, autoPlay: true }
 * - Supports external driving via `cycler.goToIndex(targetIndex)` for scroll sync.
 */
class StackedCardCycler {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    if (!this.container) return;

    this.options = Object.assign({
      categories: [
        { label: 'Websites design', icon: 'rocket' },
        { label: 'Web development', icon: 'code' },
        { label: 'Brand identity', icon: 'brand' },
        { label: 'Pitch decks', icon: 'pitch' }
      ],
      intervalMs: 2200,
      autoPlay: true
    }, options);

    this.categories = this.options.categories;
    this.currentIndex = 0;
    this.isAnimating = false;
    this.isPaused = false;
    this.timer = null;
    this.cards = []; // 3 DOM elements in depth order [depth0, depth1, depth2]

    this.icons = {
      rocket: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path><path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path></svg>',
      code: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
      brand: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><circle cx="18" cy="18" r="3"></circle><line x1="6" y1="9" x2="6" y2="15"></line><line x1="9" y1="18" x2="15" y2="18"></line><line x1="8.5" y1="7.5" x2="16.5" y2="16.5"></line></svg>',
      pitch: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>'
    };

    this.init();
  }

  getIconSVG(key) {
    return this.icons[key] || this.icons.rocket;
  }

  init() {
    let deck = this.container.querySelector('.stacked-card-deck');
    if (!deck) {
      deck = document.createElement('div');
      deck.className = 'stacked-card-deck';
      this.container.appendChild(deck);
    }
    deck.innerHTML = '';

    this.cards = [];
    for (let depth = 0; depth < 3; depth++) {
      const catIdx = (this.currentIndex + depth) % this.categories.length;
      const cat = this.categories[catIdx];

      const card = document.createElement('div');
      card.className = `stacked-card-item depth-${depth}`;
      card.innerHTML = `
        <span class="stacked-card-icon">${this.getIconSVG(cat.icon)}</span>
        <span class="stacked-card-label">${cat.label}</span>
      `;
      deck.appendChild(card);
      this.cards.push(card);
    }

    // Set exact initial GSAP coordinate transforms
    this.applyDepthTransformsImmediate();

    // Hover pause functionality
    this.container.addEventListener('mouseenter', () => { this.isPaused = true; });
    this.container.addEventListener('mouseleave', () => { this.isPaused = false; });

    // Optional click to advance immediately
    this.container.addEventListener('click', () => {
      if (!this.isAnimating) this.next();
    });

    // Start auto cycle timer
    if (this.options.autoPlay) {
      this.startTimer();
    }
  }

  applyDepthTransformsImmediate() {
    if (this.cards.length < 3) return;
    gsap.set(this.cards[0], { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, zIndex: 10, transformOrigin: 'center center' });
    gsap.set(this.cards[1], { x: 38, y: 38, rotation: 5, scale: 0.96, opacity: 0.5, zIndex: 5, transformOrigin: 'center center' });
    gsap.set(this.cards[2], { x: 65, y: 65, rotation: 8, scale: 0.92, opacity: 0.28, zIndex: 1, transformOrigin: 'center center' });
  }

  startTimer() {
    this.stopTimer();
    this.timer = setInterval(() => {
      if (!this.isPaused && !this.isAnimating) {
        this.next();
      }
    }, this.options.intervalMs);
  }

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }

  next() {
    if (this.isAnimating) return;
    const nextIndex = (this.currentIndex + 1) % this.categories.length;
    this.animateTo(nextIndex);
  }

  goToIndex(targetIndex) {
    if (targetIndex === this.currentIndex || this.isAnimating) return;
    this.stopTimer(); // When driven externally, disable internal timer
    this.animateTo(targetIndex);
  }

  animateTo(targetIndex) {
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isAnimating = true;

    const frontCard = this.cards[0];  // depth 0 -> moves UPWARD out of view
    const depth1Card = this.cards[1]; // depth 1 -> advances UP and LEFT to front
    const depth2Card = this.cards[2]; // depth 2 -> advances UP and LEFT to depth 1

    const newBackCatIdx = (targetIndex + 2) % this.categories.length;
    const newBackCat = this.categories[newBackCatIdx];

    if (prefersReducedMotion) {
      gsap.to(frontCard, {
        opacity: 0,
        duration: 0.15,
        onComplete: () => {
          this.currentIndex = targetIndex;
          for (let d = 0; d < 3; d++) {
            const cat = this.categories[(targetIndex + d) % this.categories.length];
            this.cards[d].querySelector('.stacked-card-icon').innerHTML = this.getIconSVG(cat.icon);
            this.cards[d].querySelector('.stacked-card-label').textContent = cat.label;
          }
          this.applyDepthTransformsImmediate();
          this.isAnimating = false;
        }
      });
      return;
    }

    // Set layering: depth 1 immediately assumes top position, old front exits above
    gsap.set(depth1Card, { zIndex: 10, transformOrigin: 'center center' });
    gsap.set(frontCard, { zIndex: 8, transformOrigin: 'center center' });
    gsap.set(depth2Card, { zIndex: 5, transformOrigin: 'center center' });

    const tl = gsap.timeline({
      onComplete: () => {
        // Recycle old front card to become the new depth 2 card
        frontCard.querySelector('.stacked-card-icon').innerHTML = this.getIconSVG(newBackCat.icon);
        frontCard.querySelector('.stacked-card-label').textContent = newBackCat.label;

        gsap.set(frontCard, {
          x: 65,
          y: 65,
          rotation: 8,
          scale: 0.92,
          opacity: 0.28,
          zIndex: 1,
          transformOrigin: 'center center'
        });

        this.cards = [depth1Card, depth2Card, frontCard];
        this.currentIndex = targetIndex;
        this.isAnimating = false;
      }
    });

    // 1. FRONT CARD: Compact mechanical UPWARD removal (+10px X, -75px Y, -2deg rot, 0.26s)
    tl.to(frontCard, {
      x: 10,
      y: -75,
      rotation: -2,
      scale: 1,
      duration: 0.26,
      ease: 'power2.in'
    }, 0);

    // Minor exit fade at the very end of upward travel
    tl.to(frontCard, {
      opacity: 0,
      duration: 0.1,
      ease: 'power1.in'
    }, 0.16);

    // 2. SECOND CARD (Depth 1 -> Front): Moves UP and LEFT from (38, 38, rot 5deg) to (0, 0, rot 0deg)
    tl.to(depth1Card, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      duration: 0.28,
      ease: 'power2.out'
    }, 0);

    // 3. THIRD CARD (Depth 2 -> Depth 1): Moves UP and LEFT from (65, 65, rot 8deg) to (38, 38, rot 5deg)
    tl.to(depth2Card, {
      x: 38,
      y: 38,
      rotation: 5,
      scale: 0.96,
      opacity: 0.5,
      duration: 0.28,
      ease: 'power2.out'
    }, 0);
  }

  destroy() {
    this.stopTimer();
    this.cards.forEach(card => gsap.killTweensOf(card));
  }
}

// Expose widget globally
window.StackedCardCycler = StackedCardCycler;

/**
 * ============================================================================
 * MEETING PREVIEW BUTTON COMPONENT (Dot -> Dual Avatars Morph on Hover)
 * ============================================================================
 * Features:
 * - Idle State: Standard pill button with circular dot indicator + Label text.
 * - Hover State: Dot collapses (scale 0.8, opacity 0, duration 0.15s) while two avatar chips
 *   ("You" chip + person photo avatar) and a spinning "+" connector scale/fade in
 *   with slight stagger (~0.05s) and spring overshoot (ease "back.out(1.5)").
 * - Reverse (Hover-Out): Avatars converge inward (translateX toward each other) & scale to 0
 *   while the dot icon scales/fades back in as avatars finish merging.
 * - Smooth auto-width expansion on the button without text reflow.
 * - Accessibility: aria-label preserved, touch devices stay in stable idle state,
 *   respects prefers-reduced-motion.
 * - Component API: Props { label, userAvatarLabel, personAvatarUrl, onClick }
 */
class MeetingPreviewButton {
  constructor(element, options = {}) {
    this.btn = typeof element === 'string' ? document.querySelector(element) : element;
    if (!this.btn) return;

    this.options = Object.assign({
      label: 'Book a 30-min call',
      userAvatarLabel: 'You',
      personAvatarUrl: 'assets/avatar.jpg',
      onClick: null
    }, options);

    this.iconArea = this.btn.querySelector('.meeting-btn-icon-area');
    this.dotWrap = this.btn.querySelector('.meeting-btn-dot-wrap');
    this.avatarsWrap = this.btn.querySelector('.meeting-btn-avatars-wrap');
    this.userAvatar = this.btn.querySelector('.meeting-btn-user-avatar');
    this.connector = this.btn.querySelector('.meeting-btn-connector');
    this.personAvatar = this.btn.querySelector('.meeting-btn-person-avatar');
    this.labelEl = this.btn.querySelector('.meeting-btn-label');

    this.isHovered = false;
    this.tl = null;

    this.init();
  }

  init() {
    if (!this.iconArea || !this.dotWrap || !this.avatarsWrap) return;

    // Apply prop values if provided
    if (this.options.label && this.labelEl) {
      this.labelEl.textContent = this.options.label;
      this.btn.setAttribute('aria-label', this.options.label);
    }
    if (this.options.userAvatarLabel && this.userAvatar) {
      this.userAvatar.textContent = this.options.userAvatarLabel;
    }
    if (this.options.personAvatarUrl && this.personAvatar) {
      const img = this.personAvatar.querySelector('img');
      if (img) img.src = this.options.personAvatarUrl;
    }

    // Only enable hover animations on fine-pointer devices (keeps touch devices in stable idle dot state)
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      gsap.set(this.iconArea, { width: 22 });
      gsap.set(this.dotWrap, { scale: 1, opacity: 1, x: 0 });
      gsap.set(this.avatarsWrap, { opacity: 1, display: 'inline-flex' });
      gsap.set(this.userAvatar, { scale: 0, opacity: 0, x: -8 });
      gsap.set(this.connector, { scale: 0, opacity: 0, rotation: -90 });
      gsap.set(this.personAvatar, { scale: 0, opacity: 0, x: 8 });

      this.btn.addEventListener('mouseenter', () => this.onHoverIn());
      this.btn.addEventListener('mouseleave', () => this.onHoverOut());
    }

    if (typeof this.options.onClick === 'function') {
      this.btn.addEventListener('click', (e) => this.options.onClick(e));
    }
  }

  onHoverIn() {
    this.isHovered = true;
    if (this.tl) this.tl.kill();

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.to(this.dotWrap, { opacity: 0, duration: 0.15 });
      gsap.to([this.userAvatar, this.connector, this.personAvatar], { opacity: 1, scale: 1, x: 0, rotation: 0, duration: 0.15 });
      return;
    }

    this.tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

    // 1. Cross-fade + scale dot icon out (scale 0.8, opacity 0, duration ~0.15s)
    this.tl.to(this.dotWrap, {
      scale: 0.8,
      opacity: 0,
      duration: 0.15,
      ease: 'power2.in'
    }, 0);

    // Expand icon area container width smoothly (duration ~0.3s, ease: "back.out(1.5)")
    this.tl.to(this.iconArea, {
      width: 58,
      duration: 0.3,
      ease: 'back.out(1.5)'
    }, 0.03);

    // 2. "You" avatar chip scales + fades in (from scale 0.7/opacity 0 to 1/1)
    this.tl.fromTo(this.userAvatar, {
      scale: 0.7,
      opacity: 0,
      x: -6
    }, {
      scale: 1,
      opacity: 1,
      x: 0,
      duration: 0.28,
      ease: 'back.out(1.5)'
    }, 0.06);

    // 3. Connector "+" icon rotates (-90deg to 0deg) + scales/fades in
    this.tl.fromTo(this.connector, {
      scale: 0,
      opacity: 0,
      rotation: -90
    }, {
      scale: 1,
      opacity: 1,
      rotation: 0,
      duration: 0.25,
      ease: 'back.out(1.7)'
    }, 0.09);

    // 4. Photo avatar scales + fades in with ~0.05s stagger
    this.tl.fromTo(this.personAvatar, {
      scale: 0.7,
      opacity: 0,
      x: 6
    }, {
      scale: 1,
      opacity: 1,
      x: 0,
      duration: 0.28,
      ease: 'back.out(1.5)'
    }, 0.12);
  }

  onHoverOut() {
    this.isHovered = false;
    if (this.tl) this.tl.kill();

    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      gsap.to([this.userAvatar, this.connector, this.personAvatar], { opacity: 0, duration: 0.15 });
      gsap.to(this.dotWrap, { opacity: 1, duration: 0.15 });
      return;
    }

    this.tl = gsap.timeline({ defaults: { overwrite: 'auto' } });

    // 1. Avatars scale down & move toward center (merging feel)
    this.tl.to(this.userAvatar, {
      x: 8,
      scale: 0,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in'
    }, 0);

    this.tl.to(this.personAvatar, {
      x: -8,
      scale: 0,
      opacity: 0,
      duration: 0.22,
      ease: 'power2.in'
    }, 0);

    this.tl.to(this.connector, {
      scale: 0,
      opacity: 0,
      rotation: 90,
      duration: 0.18,
      ease: 'power2.in'
    }, 0);

    // Shrink icon area back to idle 22px in parallel
    this.tl.to(this.iconArea, {
      width: 22,
      duration: 0.26,
      ease: 'power2.out'
    }, 0.06);

    // 2. Dot icon scales/fades back in as avatars finish merging
    this.tl.to(this.dotWrap, {
      scale: 1,
      opacity: 1,
      duration: 0.22,
      ease: 'back.out(1.4)'
    }, 0.1);
  }

  destroy() {
    if (this.tl) this.tl.kill();
  }
}

// Expose globally
window.MeetingPreviewButton = MeetingPreviewButton;

/**
 * ============================================================================
 * SPLIT SCROLL CASE STUDIES SCROLL ENGINE (gsap.context scoped & discrete sync)
 * ============================================================================
 */
function initCaseStudies() {
  const section = document.getElementById('caseStudies');
  if (!section) return;

  // Clean up any existing context instance before re-initializing
  if (window._splitScrollCaseStudiesCtx) {
    window._splitScrollCaseStudiesCtx.revert();
    window._splitScrollCaseStudiesCtx = null;
  }

  // Check for any fixed global header to compute sticky top offset
  const header = document.querySelector('header.is-fixed, .fixed-nav, .header-fixed, .site-header');
  let headerOffset = 0;
  if (header) {
    const headerStyle = window.getComputedStyle(header);
    if (headerStyle.position === 'fixed') {
      headerOffset = header.offsetHeight || 0;
    }
  }

  const sidebar = section.querySelector('.split-cs-sidebar');
  if (sidebar && headerOffset > 0) {
    sidebar.style.top = `${headerOffset}px`;
    sidebar.style.height = `calc(100vh - ${headerOffset}px)`;
  }

  // Initialize MeetingPreviewButton in sidebar
  const meetingBtnEl = section.querySelector('#csMeetingBtn');
  if (meetingBtnEl) {
    new MeetingPreviewButton(meetingBtnEl);
  }

  // Initialize StackedCardCycler widget in sidebar
  const cyclerContainer = section.querySelector('#csServiceCycler');
  let cyclerInstance = null;
  if (cyclerContainer) {
    cyclerInstance = new StackedCardCycler(cyclerContainer, {
      intervalMs: 2200,
      autoPlay: true,
      categories: [
        { label: 'Web Development', icon: 'code' },
        { label: 'UI/UX Design', icon: 'layers' },
        { label: 'AI Automation', icon: 'workflow' },
        { label: 'Illustration', icon: 'brush' }
      ]
    });
    window._activeStackedCardCycler = cyclerInstance;
  }

  // Ensure ScrollTrigger is registered
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Create component-scoped GSAP context
  const ctx = gsap.context((self) => {
    const cards = Array.from(section.querySelectorAll('.split-cs-scene-card, .split-cs-card'));

    if (!cards.length) return;

    let currentActiveIndex = -1;

    // Discrete update handler triggered on scroll past each scene card
    function updateActiveState(index) {
      if (index === currentActiveIndex || index < 0 || index >= cards.length) return;
      currentActiveIndex = index;

      // 1. Sync the left sidebar StackedCardCycler widget
      if (window._activeStackedCardCycler && typeof window._activeStackedCardCycler.goTo === 'function') {
        window._activeStackedCardCycler.goTo(index % 3);
      }

      // 2. Sync active state on cards
      cards.forEach((card, idx) => {
        if (idx === index) {
          card.classList.add('is-active');
        } else {
          card.classList.remove('is-active');
        }
      });
    }

    // MatchMedia: Enable ScrollTrigger per card on desktop (> 900px)
    if (typeof ScrollTrigger !== 'undefined') {
      ScrollTrigger.matchMedia({
        "(min-width: 901px)": function() {
          cards.forEach((card, index) => {
            ScrollTrigger.create({
              trigger: card,
              start: "top 60%",
              end: "bottom 40%",
              onEnter: () => updateActiveState(index),
              onEnterBack: () => updateActiveState(index)
            });
          });

          updateActiveState(0);
        },

        "(max-width: 900px)": function() {
          updateActiveState(0);
        }
      });
    }

    // Case Studies Custom Cursor Follower (Attached Dart Pointer + Dynamic Project VIEW PROJECT Badge)
    const csCursor = document.getElementById('csCustomCursor');
    const csCursorWrap = document.getElementById('csCustomCursorWrap');
    const projectsStack = section.querySelector('#csProjectsStack');

    if (csCursor && csCursorWrap && projectsStack && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      let mouseX = -300;
      let mouseY = -300;
      let cursorX = -300;
      let cursorY = -300;
      let isHovering = false;
      let rafId = null;

      function renderCsCursor() {
        // Smooth immediate follow (0.88 lerp)
        cursorX += (mouseX - cursorX) * 0.88;
        cursorY += (mouseY - cursorY) * 0.88;

        if (Math.abs(mouseX - cursorX) < 0.1) cursorX = mouseX;
        if (Math.abs(mouseY - cursorY) < 0.1) cursorY = mouseY;

        csCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        if (isHovering) {
          rafId = requestAnimationFrame(renderCsCursor);
        }
      }

      function checkCursorUnderPoint() {
        if (mouseX < 0 || mouseY < 0) return;
        const elem = document.elementFromPoint(mouseX, mouseY);
        if (!elem) return;

        const card = elem.closest('.split-cs-scene-card, .custom-cursor-target');
        if (card && section.contains(card)) {
          if (!isHovering) {
            isHovering = true;
            csCursor.style.visibility = 'visible';
            csCursor.style.opacity = '1';
            gsap.to(csCursorWrap, {
              opacity: 1,
              scale: 1,
              duration: 0.15,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            if (!rafId) rafId = requestAnimationFrame(renderCsCursor);
          }
        } else if (isHovering) {
          isHovering = false;
          gsap.to(csCursorWrap, {
            opacity: 0,
            scale: 0.8,
            duration: 0.12,
            ease: 'power2.in',
            overwrite: 'auto',
            onComplete: () => {
              if (!isHovering) {
                csCursor.style.visibility = 'hidden';
                if (rafId) {
                  cancelAnimationFrame(rafId);
                  rafId = null;
                }
              }
            }
          });
        }
      }

      window.addEventListener('scroll', checkCursorUnderPoint, { passive: true });
      if (window.lenisInstance) {
        window.lenisInstance.on('scroll', checkCursorUnderPoint);
      }

      const mediaTargets = projectsStack.querySelectorAll('.split-cs-scene-card, .split-cs-scene-media-wrap, .custom-cursor-target');

      mediaTargets.forEach(target => {
        target.addEventListener('mouseenter', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          cursorX = mouseX;
          cursorY = mouseY;
          isHovering = true;
          csCursor.style.visibility = 'visible';
          csCursor.style.opacity = '1';
          csCursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

          // Quick snappy entrance (~0.15s, power2.out)
          gsap.to(csCursorWrap, {
            opacity: 1,
            scale: 1,
            duration: 0.15,
            ease: 'power2.out',
            overwrite: 'auto'
          });

          if (!rafId) rafId = requestAnimationFrame(renderCsCursor);
        });

        target.addEventListener('mousemove', (e) => {
          mouseX = e.clientX;
          mouseY = e.clientY;
          if (!isHovering) {
            isHovering = true;
            csCursor.style.visibility = 'visible';
            csCursor.style.opacity = '1';
            gsap.to(csCursorWrap, {
              opacity: 1,
              scale: 1,
              duration: 0.15,
              ease: 'power2.out',
              overwrite: 'auto'
            });
            if (!rafId) rafId = requestAnimationFrame(renderCsCursor);
          }
        });

        target.addEventListener('mouseleave', (e) => {
          const relTarget = e.relatedTarget;
          if (!relTarget || !relTarget.closest('.split-cs-projects-stack, .split-cs-scene-card, .custom-cursor-target')) {
            isHovering = false;
            // Quick snappy exit (~0.12s, power2.in)
            gsap.to(csCursorWrap, {
              opacity: 0,
              scale: 0.8,
              duration: 0.12,
              ease: 'power2.in',
              overwrite: 'auto',
              onComplete: () => {
                if (!isHovering) {
                  csCursor.style.visibility = 'hidden';
                  if (rafId) {
                    cancelAnimationFrame(rafId);
                    rafId = null;
                  }
                }
              }
            });
          }
        });

        target.addEventListener('click', () => {
          const contactSection = document.getElementById('contact');
          if (contactSection) {
            if (window.lenisInstance) {
              window.lenisInstance.scrollTo(contactSection);
            } else {
              contactSection.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });
    }

  }, section);

  // Store context globally for unmount cleanup
  window._splitScrollCaseStudiesCtx = ctx;
}

/**
 * Section 1: OurProcess Component
 * Scrubbed scroll-progress red timeline line and active step markers
 */
function initOurProcess() {
  const processSection = document.getElementById('ourProcess');
  const progressBar = document.getElementById('processTimelineProgress');
  const step1 = document.getElementById('processStep1');
  const step2 = document.getElementById('processStep2');
  const step3 = document.getElementById('processStep3');

  if (!processSection || !progressBar || !step1 || !step2 || !step3) return;

  function update() {
    const node1 = step1.querySelector('.process-marker-node');
    const node2 = step2.querySelector('.process-marker-node');
    const node3 = step3.querySelector('.process-marker-node');

    if (!node1 || !node2 || !node3) return;

    const r1 = node1.getBoundingClientRect();
    const r2 = node2.getBoundingClientRect();
    const r3 = node3.getBoundingClientRect();

    const y1 = r1.top + r1.height / 2;
    const y2 = r2.top + r2.height / 2;
    const y3 = r3.top + r3.height / 2;

    const triggerY = window.innerHeight * 0.52;

    let progress = 0;
    if (y3 > y1) {
      progress = (triggerY - y1) / (y3 - y1);
    }
    progress = Math.max(0, Math.min(1, progress));

    // Update red timeline line with GPU scaleY for instantaneous 60/120fps fluid response
    progressBar.style.transform = `scaleY(${progress.toFixed(4)})`;

    // Step 1 Active State
    if (triggerY >= y1 - 24) {
      step1.classList.add('is-active');
    } else {
      step1.classList.remove('is-active');
    }

    // Step 2 Active State
    if (triggerY >= y2 - 20) {
      step2.classList.add('is-active');
    } else {
      step2.classList.remove('is-active');
    }

    // Step 3 Active State
    if (triggerY >= y3 - 20) {
      step3.classList.add('is-active');
    } else {
      step3.classList.remove('is-active');
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  update();

  // Process Video Preview Trigger interaction (Opens Video Player with full controls, sound & minutes display)
  const videoTrigger = document.getElementById('processVideoTrigger');
  if (videoTrigger) {
    videoTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openVideoModal(
        'assets/videos/showcase.mp4',
        'Our Creative & Development Process',
        'Soikot Studio // Engineering Distinctive Digital Brands',
        'Process Reel'
      );
    });
  }
}

/**
 * Section: VideoTestimonials Component (Stodio Reference Layout)
 * Structured Data, Responsive Cards & Video Lightbox Modal
 */
/**
 * Actual National Flag SVG Graphics (Guarantees authentic crisp rendering across all OS/browsers)
 */
const flagSvgs = {
  US: `<svg class="testimonial-flag-icon" viewBox="0 0 640 480" width="17" height="12" aria-hidden="true"><g fill-rule="evenodd"><path fill="#bd3d44" d="M0 0h640v480H0z"/><path stroke="#fff" stroke-width="37" d="M0 55.4h640M0 129.2h640M0 203h640M0 277h640M0 350.8h640M0 424.6h640"/><path fill="#192f5d" d="M0 0h296v258.5H0z"/><g fill="#fff"><g id="d"><g id="c"><g id="e"><polygon points="24.7,18.5 28.5,30.3 38.3,30.3 30.4,36.1 33.4,47.4 24.7,40.4 16,47.4 19,36.1 11.1,30.3 20.9,30.3"/></g><use href="#e" x="49.3"/><use href="#e" x="98.6"/><use href="#e" x="147.9"/><use href="#e" x="197.2"/><use href="#e" x="246.5"/></g><use href="#c" y="37"/><use href="#c" y="74"/><use href="#c" y="110.8"/><use href="#c" y="147.7"/><use href="#c" y="184.6"/></g></g></g></svg>`,
  GB: `<svg class="testimonial-flag-icon" viewBox="0 0 640 480" width="17" height="12" aria-hidden="true"><path fill="#012169" d="M0 0h640v480H0z"/><path fill="#FFF" d="m75 0 245 180L565 0h75v60L435 240l205 180v60h-75L320 300 75 480H0v-60l205-180L0 60V0h75z"/><path fill="#C8102E" d="m424 288 216 156v36L392 288h32zM216 192 0 36V0l248 192h-32zm-32 96L0 420v60l216-168h-32zm424-96 232-156V0L608 192h-32z"/><path fill="#FFF" d="M240 0h160v480H240zM0 160h640v160H0z"/><path fill="#C8102E" d="M267 0h106v480H267zM0 187h640v106H0z"/></svg>`,
  DE: `<svg class="testimonial-flag-icon" viewBox="0 0 640 480" width="17" height="12" aria-hidden="true"><path fill="#000" d="M0 0h640v160H0z"/><path fill="#D00" d="M0 160h640v160H0z"/><path fill="#FFCE00" d="M0 320h640v160H0z"/></svg>`,
  AU: `<svg class="testimonial-flag-icon" viewBox="0 0 640 480" width="17" height="12" aria-hidden="true"><path fill="#00008b" d="M0 0h640v480H0z"/><path fill="#FFF" d="m37 0 123 90L283 0h37v30L202 120l118 90v30h-37L160 150 37 240H0v-30l118-90L0 30V0h37z"/><path fill="#c8102e" d="m212 144 108 78v18L196 144h16zM108 96 0 18V0l124 96h-16zm-16 48L0 210v30l108-84H92zm212-48 116-78V0L304 96h-16z"/><path fill="#FFF" d="M120 0h80v240h-80zM0 80h320v80H0z"/><path fill="#c8102e" d="M133 0h54v240h-54zM0 93h320v54H0z"/><circle cx="160" cy="360" r="28" fill="#FFF"/><circle cx="480" cy="100" r="14" fill="#FFF"/><circle cx="540" cy="180" r="14" fill="#FFF"/><circle cx="480" cy="380" r="14" fill="#FFF"/><circle cx="420" cy="240" r="14" fill="#FFF"/><circle cx="500" cy="270" r="9" fill="#FFF"/></svg>`,
  CA: `<svg class="testimonial-flag-icon" viewBox="0 0 640 480" width="17" height="12" aria-hidden="true"><path fill="#ff0000" d="M0 0h160v480H0zm480 0h160v480H480z"/><path fill="#fff" d="M160 0h320v480H160z"/><path fill="#ff0000" d="m320 72 15 48 35-15-10 40 42 10-25 35 30 18-38 15 2 30-36-8-15 45-15-45-36 8 2-30-38-15 30-18-25-35 42-10-10-40 35 15zM315 285h10v75h-10z"/></svg>`
};

const testimonialsData = [
  {
    name: 'Elena Vance',
    role: 'Founder & Author',
    company: 'Vanguard Literary',
    countryCode: 'US',
    country: 'United States',
    quote: 'Working with Soikot Studio gave our brand and website a completely new level of clarity. The attention to detail and bespoke interaction craft is unmatched.',
    videoUrl: 'assets/videos/showcase.mp4',
    thumbnail: 'assets/testimonials/testimonial_1.jpg',
    avatar: 'assets/testimonials/testimonial_1.jpg',
    duration: '01:45',
    service: 'Website Design & Development'
  },
  {
    name: 'Dr. Julian Ross',
    role: 'Executive Coach',
    company: 'Apex Leadership Group',
    countryCode: 'GB',
    country: 'United Kingdom',
    quote: 'Our conversion rates tripled within the first two weeks of launching our new coaching platform. The design communicates authority and trust effortlessly.',
    videoUrl: 'assets/videos/showcase.mp4',
    thumbnail: 'assets/testimonials/testimonial_2.jpg',
    avatar: 'assets/testimonials/testimonial_2.jpg',
    duration: '02:10',
    service: 'Conversion Architecture & AI'
  },
  {
    name: 'Alexei Volkov',
    role: 'CEO & Founder',
    company: 'Startup Launch Tech',
    countryCode: 'DE',
    country: 'Germany',
    quote: 'They don’t just build websites; they architect end-to-end digital experiences. Our investors and users were blown away by the speed and polish.',
    videoUrl: 'assets/videos/showcase.mp4',
    thumbnail: 'assets/testimonials/testimonial_3.jpg',
    avatar: 'assets/testimonials/testimonial_3.jpg',
    duration: '01:25',
    service: 'SaaS Platform & Waitlist UI'
  },
  {
    name: 'Marcus Chen',
    role: 'Co-Founder & CTO',
    company: 'Cypher Cloud Systems',
    countryCode: 'AU',
    country: 'Australia',
    quote: 'The team understood our technical product immediately and designed a high-performing, immersive web experience.',
    videoUrl: 'assets/videos/showcase.mp4',
    thumbnail: 'assets/testimonials/testimonial_4.jpg',
    avatar: 'assets/testimonials/testimonial_4.jpg',
    duration: '01:50',
    service: 'Developer Portal & Motion'
  },
  {
    name: 'Sarah Jenkins',
    role: 'Children’s Author',
    company: 'Little Seedling Stories',
    countryCode: 'CA',
    country: 'Canada',
    quote: 'The character designs and expressive picture book layouts were beyond our expectations. Pure creative magic.',
    videoUrl: 'assets/videos/showcase.mp4',
    thumbnail: 'assets/case-studies/book_launch.jpg',
    avatar: 'assets/avatar.jpg',
    duration: '02:05',
    service: 'Children\'s Book Illustration'
  },
  {
    name: 'David Miller',
    role: 'Managing Director',
    company: 'Transform Coaching',
    countryCode: 'US',
    country: 'United States',
    quote: 'The website completely transformed how prospective clients perceive our programs. Outstanding communication throughout.',
    videoUrl: 'assets/videos/showcase.mp4',
    thumbnail: 'assets/case-studies/transform_coaching.jpg',
    avatar: 'assets/case-studies/personal_growth_coach.jpg',
    duration: '01:40',
    service: 'Website Design & Development'
  }
];

function initVideoTestimonials() {
  const section = document.getElementById('clientTestimonials');
  const track = document.getElementById('testimonialsGrid');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (!track) return;

  // Duplicate items to form a seamless infinite loop
  const loopData = [...testimonialsData, ...testimonialsData];

  // Render cards from duplicated data with authentic SVG flags
  track.innerHTML = loopData.map((item, idx) => `
    <div class="testimonial-card" data-idx="${idx % testimonialsData.length}">
      <div class="testimonial-video-frame">
        <img src="${item.thumbnail}" alt="${item.name} Video Testimonial" class="testimonial-poster" loading="lazy" />
        <div class="testimonial-video-overlay"></div>
        <button class="testimonial-play-btn" type="button" aria-label="Play ${item.name} Testimonial Video">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="6,4 20,12 6,20"/>
          </svg>
        </button>
        <div class="testimonial-duration-badge">${item.duration}</div>
      </div>
      
      <div class="testimonial-meta-row">
        <img src="${item.avatar}" alt="${item.name}" class="testimonial-avatar" loading="lazy" />
        <div class="testimonial-info">
          <div class="testimonial-name-flag-row">
            <span class="testimonial-author-name">${item.name}</span>
            <span class="testimonial-flag" title="${item.country}">${flagSvgs[item.countryCode] || ''}</span>
          </div>
          <span class="testimonial-author-role">${item.role}, ${item.company}</span>
        </div>
      </div>
    </div>
  `).join('');

  // Continuous Slow Moving Carousel Engine
  let isHovered = false;
  let isUserInteracting = false;
  let isVideoPlaying = false;
  let isSectionInView = true;
  let resumeTimer = null;
  let rafId = null;
  let scrollPos = 0;
  const speed = 0.75; // Smooth, relaxed continuous drift pace (pixels per frame)

  function stepAutoScroll() {
    if (!isHovered && !isUserInteracting && !isVideoPlaying && isSectionInView) {
      const halfWidth = track.scrollWidth / 2;
      if (halfWidth > 0) {
        scrollPos += speed;
        // Seamless loop without any visual jump
        if (scrollPos >= halfWidth) {
          scrollPos -= halfWidth;
        }
        track.scrollLeft = scrollPos;
      }
    } else if (!isUserInteracting) {
      // Keep scrollPos synced with actual DOM position
      scrollPos = track.scrollLeft;
    }
    rafId = requestAnimationFrame(stepAutoScroll);
  }

  // Start continuous loop
  rafId = requestAnimationFrame(stepAutoScroll);

  // Viewport Observer (pause when off-screen to preserve CPU/GPU)
  if (section && 'IntersectionObserver' in window) {
    const viewObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        isSectionInView = entry.isIntersecting;
      });
    }, { root: null, threshold: 0 });
    viewObserver.observe(section);
  }

  // Pause on mouse hover over the carousel
  track.addEventListener('mouseenter', () => {
    isHovered = true;
    scrollPos = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isHovered = false;
    scrollPos = track.scrollLeft;
  });

  // Track native scroll events to keep position synced
  track.addEventListener('scroll', () => {
    if (isUserInteracting || isMouseDown) {
      scrollPos = track.scrollLeft;
    }
  }, { passive: true });

  // Inline Direct-In-Card Video Playback (Pauses auto-scroll while playing)
  let isDragging = false;
  let startX = 0;
  let dragStartScroll = 0;

  track.querySelectorAll('.testimonial-card').forEach(card => {
    const playBtn = card.querySelector('.testimonial-play-btn');
    const frame = card.querySelector('.testimonial-video-frame');
    const idx = parseInt(card.getAttribute('data-idx'), 10);
    const item = testimonialsData[idx];

    function playVideoInCard(e) {
      if (isDragging) return;
      e.stopPropagation();

      // Pause and remove any other playing video on other cards
      track.querySelectorAll('.testimonial-card').forEach(otherCard => {
        if (otherCard !== card) {
          const activeVid = otherCard.querySelector('video.testimonial-inline-video');
          if (activeVid) {
            activeVid.pause();
            activeVid.remove();
            otherCard.classList.remove('is-playing');
          }
        }
      });

      // If already playing in this frame, toggle playback
      let existingVid = frame.querySelector('video.testimonial-inline-video');
      if (existingVid) {
        if (existingVid.paused) {
          existingVid.play().catch(() => {});
          isVideoPlaying = true;
        } else {
          existingVid.pause();
          isVideoPlaying = false;
        }
        return;
      }

      // Create video element directly inside the card with sound, duration and controls
      const videoEl = document.createElement('video');
      videoEl.className = 'testimonial-inline-video';
      videoEl.src = item.videoUrl;
      videoEl.autoplay = true;
      videoEl.controls = true;
      videoEl.muted = false;
      videoEl.playsInline = true;
      videoEl.setAttribute('playsinline', '');
      videoEl.style.position = 'absolute';
      videoEl.style.inset = '0';
      videoEl.style.width = '100%';
      videoEl.style.height = '100%';
      videoEl.style.objectFit = 'cover';
      videoEl.style.borderRadius = '12px';
      videoEl.style.zIndex = '10';

      frame.appendChild(videoEl);
      card.classList.add('is-playing');
      isVideoPlaying = true;

      videoEl.play().catch(() => {
        videoEl.muted = true;
        videoEl.play().catch(() => {});
      });

      videoEl.addEventListener('ended', () => {
        videoEl.remove();
        card.classList.remove('is-playing');
        isVideoPlaying = false;
      });

      videoEl.addEventListener('pause', () => {
        if (videoEl.ended) {
          isVideoPlaying = false;
        }
      });
    }

    if (playBtn) playBtn.addEventListener('click', playVideoInCard);
    if (frame) frame.addEventListener('click', (e) => {
      if (!e.target.closest('video')) {
        playVideoInCard(e);
      }
    });
  });

  // Prev / Next Navigation Buttons
  const scrollAmount = 292; // Card width (270px) + Gap (22px)

  function handleManualNav(direction) {
    isUserInteracting = true;
    clearTimeout(resumeTimer);
    track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
    resumeTimer = setTimeout(() => {
      isUserInteracting = false;
      scrollPos = track.scrollLeft;
    }, 1200);
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => handleManualNav(1));
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => handleManualNav(-1));
  }

  // Touch Swipe Support
  track.addEventListener('touchstart', () => {
    isUserInteracting = true;
    clearTimeout(resumeTimer);
  }, { passive: true });

  track.addEventListener('touchend', () => {
    resumeTimer = setTimeout(() => {
      isUserInteracting = false;
      scrollPos = track.scrollLeft;
    }, 1800);
  }, { passive: true });

  // Mouse Drag Support
  let isMouseDown = false;
  let dragThreshold = 5;

  track.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    isUserInteracting = true;
    clearTimeout(resumeTimer);
    startX = e.pageX - track.offsetLeft;
    dragStartScroll = track.scrollLeft;
    track.classList.add('is-dragging');
  });

  track.addEventListener('mouseleave', () => {
    if (isMouseDown) {
      isMouseDown = false;
      track.classList.remove('is-dragging');
      resumeTimer = setTimeout(() => {
        isUserInteracting = false;
        scrollPos = track.scrollLeft;
      }, 1500);
    }
  });

  track.addEventListener('mouseup', () => {
    isMouseDown = false;
    track.classList.remove('is-dragging');
    setTimeout(() => {
      isDragging = false;
    }, 50);
    resumeTimer = setTimeout(() => {
      isUserInteracting = false;
      scrollPos = track.scrollLeft;
    }, 1800);
  });

  track.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > dragThreshold) {
      isDragging = true;
    }
    track.scrollLeft = dragStartScroll - walk;
    scrollPos = track.scrollLeft;

    // Boundary wrap for manual drag
    const halfWidth = track.scrollWidth / 2;
    if (track.scrollLeft >= halfWidth) {
      track.scrollLeft -= halfWidth;
      startX = e.pageX - track.offsetLeft;
      dragStartScroll = track.scrollLeft;
      scrollPos = track.scrollLeft;
    } else if (track.scrollLeft <= 0) {
      track.scrollLeft += halfWidth;
      startX = e.pageX - track.offsetLeft;
      dragStartScroll = track.scrollLeft;
      scrollPos = track.scrollLeft;
    }
  });
}

/**
 * Global Video Lightbox Modal Controller
 * Provides complete video player functionality: sound control, duration readout, seeker, play/pause
 */
let modalElements = null;

function initVideoModal() {
  const modal = document.getElementById('testimonialModal');
  const backdrop = document.getElementById('modalBackdrop');
  const closeBtn = document.getElementById('modalCloseBtn');
  const player = document.getElementById('modalVideoPlayer');
  const clientName = document.getElementById('modalClientName');
  const clientRole = document.getElementById('modalClientRole');
  const serviceBadge = document.getElementById('modalServiceBadge');

  if (!modal || !player) return;

  modalElements = { modal, backdrop, closeBtn, player, clientName, clientRole, serviceBadge };

  function closeModal() {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    player.pause();
    player.currentTime = 0;
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (backdrop) backdrop.addEventListener('click', closeModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });
}

function openVideoModal(videoSrc, name, role, badge) {
  if (!modalElements) {
    initVideoModal();
  }
  if (!modalElements) return;

  const { modal, player, clientName, clientRole, serviceBadge } = modalElements;

  if (clientName) clientName.textContent = name || 'Soikot Studio Reel';
  if (clientRole) clientRole.textContent = role || 'Client Showcase';
  if (serviceBadge) serviceBadge.textContent = badge || 'Digital Experience';

  player.src = videoSrc;
  player.muted = false; // Enabled sound for explicit user playback
  player.currentTime = 0;
  player.controls = true; // Full native player controls (sound, time, scrubber, fullscreen)

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';

  player.play().catch(() => {
    // If browser requires muted start on mobile
    player.muted = true;
    player.play().catch(() => {});
  });
}

/**
 * Section: FAQ Component (Stodio Accordion Style & Single Item Toggle)
 */
const faqData = [
  {
    question: "What services does Soikot Studio provide?",
    answer: "We provide website design and development, AI automation for business communication and workflows, and children's book illustration."
  },
  {
    question: "How do you approach a new project?",
    answer: "We start by understanding your goals, audience, and requirements. From there, we define the right strategy, design direction, and development process for your project."
  },
  {
    question: "What is the typical timeline for a project?",
    answer: "Timelines depend on the scope and complexity of the project. Smaller projects can take a few weeks, while larger or more complex projects may require more time."
  },
  {
    question: "How do you handle revisions?",
    answer: "We build revision stages into the project process so feedback can be collected and improvements can be made without disrupting the overall workflow."
  },
  {
    question: "How much do your services cost?",
    answer: "Pricing depends on the scope, requirements, complexity, and goals of the project. After understanding what you need, we can provide a clear project estimate."
  },
  {
    question: "Do you handle both design and development?",
    answer: "Yes. We can handle the complete process, from strategy and visual design through development, testing, and launch."
  },
  {
    question: "Can you help automate parts of my business with AI?",
    answer: "Yes. We can help businesses automate customer communication and workflows, including messages, emails, WhatsApp conversations, calls, and other repetitive processes using AI-powered systems."
  },
  {
    question: "How do we get started?",
    answer: "You can book a free call or send us an email. We'll discuss your project, goals, and requirements to determine the best next step."
  }
];

function initFAQ() {
  const accordionContainer = document.getElementById('faqAccordionList');
  if (!accordionContainer) return;

  accordionContainer.innerHTML = faqData.map((item, idx) => `
    <div class="faq-item ${idx === 0 ? 'is-open' : ''}" data-faq-index="${idx}">
      <button class="faq-question-btn" aria-expanded="${idx === 0 ? 'true' : 'false'}">
        <span class="faq-question-text">${item.question}</span>
        <div class="faq-toggle-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </div>
      </button>
      <div class="faq-answer-collapse">
        <p class="faq-answer-text">${item.answer}</p>
      </div>
    </div>
  `).join('');

  const faqItems = accordionContainer.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all items
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('is-open');
        otherItem.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
      });

      // Toggle clicked item
      if (!isOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/**
 * Dedicated Blog Page Component
 * Structured dataset, 3-column rendering, and interactive load more
 */
const blogPostsData = [
  {
    title: "How Much Does a Professional Website Really Cost?",
    slug: "professional-website-cost",
    category: "WEB DESIGN",
    readTime: "8 MIN",
    description: "A practical breakdown of what affects website pricing and how to understand the real investment behind a professional website.",
    thumbnail: "assets/blog/blog_pricing.jpg",
    publishDate: "August 2026",
    author: "Soikot Studio Editorial",
    articleUrl: "#"
  },
  {
    title: "What Makes a Website Actually Convert Visitors?",
    slug: "website-conversion-secrets",
    category: "WEB DESIGN",
    readTime: "10 MIN",
    description: "The design, messaging, structure, and user experience decisions that can turn more visitors into real customers.",
    thumbnail: "assets/blog/blog_convert.jpg",
    publishDate: "August 2026",
    author: "Soikot Studio Strategy",
    articleUrl: "#"
  },
  {
    title: "10 Ways AI Can Save Your Business Time",
    slug: "10-ways-ai-saves-business-time",
    category: "AI & AUTOMATION",
    readTime: "7 MIN",
    description: "Explore practical ways businesses can automate repetitive communication, workflows, and everyday operations.",
    thumbnail: "assets/blog/blog_ai_time.jpg",
    publishDate: "August 2026",
    author: "Soikot Studio AI Lab",
    articleUrl: "#"
  },
  {
    title: "Why Your Business Website Might Be Holding You Back",
    slug: "website-holding-business-back",
    category: "BUSINESS",
    readTime: "6 MIN",
    description: "Common website mistakes that make businesses look outdated, unclear, or difficult to trust.",
    thumbnail: "assets/blog/blog_holding_back.jpg",
    publishDate: "July 2026",
    author: "Soikot Studio Consulting",
    articleUrl: "#"
  },
  {
    title: "Why Looking Different Matters More Than Looking Modern",
    slug: "looking-different-vs-modern",
    category: "DESIGN",
    readTime: "9 MIN",
    description: "How businesses can build a distinctive digital identity instead of blending in with everyone else.",
    thumbnail: "assets/blog/blog_different.jpg",
    publishDate: "July 2026",
    author: "Soikot Studio Brand",
    articleUrl: "#"
  },
  {
    title: "What Can You Actually Automate With AI?",
    slug: "what-to-automate-with-ai",
    category: "AI & AUTOMATION",
    readTime: "8 MIN",
    description: "A practical look at how AI can assist with messages, emails, calls, WhatsApp conversations, and business workflows.",
    thumbnail: "assets/blog/blog_ai_automate.jpg",
    publishDate: "July 2026",
    author: "Soikot Studio AI Lab",
    articleUrl: "#"
  }
];

function initBlog() {
  const homeGrid = document.getElementById('homeBlogGrid');
  const blogGrid = document.getElementById('blogArticlesGrid');
  const loadMoreBtn = document.getElementById('blogLoadMoreBtn');

  function renderCard(post) {
    return `
      <a href="${post.articleUrl}" class="blog-card-item" data-slug="${post.slug}">
        <div class="blog-card-thumb-wrap">
          <img src="${post.thumbnail}" alt="${post.title}" class="blog-card-thumb-img" loading="lazy" />
        </div>
        
        <div class="blog-card-body">
          <div class="blog-card-meta-top">
            <span class="blog-card-category">${post.category}</span>
            <span class="blog-card-dot">•</span>
            <span class="blog-card-readtime">${post.readTime}</span>
          </div>
          
          <h3 class="blog-card-title">${post.title}</h3>
          
          <div class="blog-card-footer">
            <span class="blog-card-date">${post.publishDate}</span>
            <span class="blog-card-read-link">
              <span>Read Article</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="7" y1="17" x2="17" y2="7"></line>
                <polyline points="7 7 17 7 17 17"></polyline>
              </svg>
            </span>
          </div>
        </div>
      </a>
    `;
  }

  // Render on Homepage (Clear Day 4-Card System)
  if (homeGrid) {
    homeGrid.innerHTML = `
      <!-- Card 1: Lead Visual Card -->
      <a href="blog.html" class="cd-blog-card cd-blog-card-lead">
        <div class="cd-lead-visual">
          <img src="assets/blog/clear_kayak_diver.jpg" alt="Solo vs. Tandem Choosing Your Clear Kayak" class="cd-lead-img" loading="lazy" />
          <div class="cd-lead-overlay"></div>
          <span class="cd-lead-tag">#Buying Guide</span>
          <h3 class="cd-lead-title">Solo <span class="cd-vs-accent">vs.</span> Tandem<br />Choosing Your<br />Clear Kayak</h3>
        </div>
        <p class="cd-lead-excerpt">
          Explore expert guides, water conditions, and hull insights to choose the right clear kayak and make the most of every adventure.
        </p>
        <div class="cd-card-bottom-bar">
          <div class="cd-reading-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>5 min: Reading Time</span>
          </div>
          <span class="cd-read-link">Read Article &rarr;</span>
        </div>
      </a>

      <!-- Card 2: Editorial Typographic Card -->
      <a href="blog.html" class="cd-blog-card cd-blog-card-text">
        <div class="cd-tag-pill">#Founder Story</div>
        <h3 class="cd-editorial-title">
          <span class="cd-title-bold">Born</span>
          <span class="cd-title-faded">From a Love</span>
          <span class="cd-title-bold">of What</span>
          <span class="cd-title-faded">Lies Beneath:</span>
          <span class="cd-title-bold">The Story</span>
        </h3>
        <div class="cd-card-bottom-bar">
          <div class="cd-reading-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>6 min: Reading Time</span>
          </div>
        </div>
      </a>

      <!-- Card 3: Editorial Typographic Card -->
      <a href="blog.html" class="cd-blog-card cd-blog-card-text">
        <div class="cd-tag-pill">#Adventure</div>
        <h3 class="cd-editorial-title">
          <span class="cd-title-bold">Planning</span>
          <span class="cd-title-faded">Your First</span>
          <span class="cd-title-bold">Clear Kayak</span>
          <span class="cd-title-faded">Trip:</span>
          <span class="cd-title-bold">Gear &amp; Tips</span>
        </h3>
        <div class="cd-card-bottom-bar">
          <div class="cd-reading-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>5 min: Reading Time</span>
          </div>
        </div>
      </a>

      <!-- Card 4: Editorial Typographic Card -->
      <a href="blog.html" class="cd-blog-card cd-blog-card-text">
        <div class="cd-tag-pill">#Destinations</div>
        <h3 class="cd-editorial-title">
          <span class="cd-title-bold">5 Places</span>
          <span class="cd-title-faded">Where a Clear</span>
          <span class="cd-title-bold">Kayak</span>
          <span class="cd-title-faded">Changes the</span>
          <span class="cd-title-bold">Experience</span>
        </h3>
        <div class="cd-card-bottom-bar">
          <div class="cd-reading-time">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>5 min: Reading Time</span>
          </div>
        </div>
      </a>
    `;
  }

  // Render on Dedicated Blog Page (All articles)
  if (blogGrid) {
    blogGrid.innerHTML = blogPostsData.map(renderCard).join('');
  }

  // Load more button action on Blog Page
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
      const btnText = loadMoreBtn.querySelectorAll('.button-text');
      btnText.forEach(t => t.textContent = 'All Stories Loaded');
      loadMoreBtn.style.opacity = '0.6';
      loadMoreBtn.style.cursor = 'default';
    });
  }
}

/**
 * Footer Cursor Effect (Interactive White Glow Follower strictly bounded inside Footer)
 */
function initFooterCursorEffect() {
  const footer = document.getElementById('siteFooter');
  if (!footer) return;

  let glow = footer.querySelector('.footer-cursor-glow');
  if (!glow) {
    glow = document.createElement('div');
    glow.className = 'footer-cursor-glow';
    footer.appendChild(glow);
  }

  let rafId = null;
  let mouseX = 0;
  let mouseY = 0;
  let currentX = 0;
  let currentY = 0;
  let isInside = false;

  function updateGlowPosition() {
    if (!isInside) return;
    currentX += (mouseX - currentX) * 0.15;
    currentY += (mouseY - currentY) * 0.15;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    rafId = requestAnimationFrame(updateGlowPosition);
  }

  footer.addEventListener('mouseenter', (e) => {
    isInside = true;
    footer.classList.add('has-cursor');
    const rect = footer.getBoundingClientRect();
    currentX = e.clientX - rect.left;
    currentY = e.clientY - rect.top;
    mouseX = currentX;
    mouseY = currentY;
    glow.style.left = `${currentX}px`;
    glow.style.top = `${currentY}px`;
    cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(updateGlowPosition);
  });

  footer.addEventListener('mousemove', (e) => {
    const rect = footer.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    if (!isInside) {
      isInside = true;
      footer.classList.add('has-cursor');
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(updateGlowPosition);
    }
  });

  footer.addEventListener('mouseleave', () => {
    isInside = false;
    footer.classList.remove('has-cursor');
    cancelAnimationFrame(rafId);
  });
}

/**
 * Viewport Scroll-Triggered Animation Engine
 * Ensures below-the-fold sections ONLY animate when the user scrolls near them (15%–25% threshold)
 * and animates ONCE without jitter.
 */
function initScrollAnimations() {
  // 1. Initial Hero Loaded Sequence (runs smoothly on page load for top visible content only)
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.body.classList.add('hero-loaded');
    }, 60);
  });

  // 2. Sections and Elements Intersection Observer
  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -12% 0px', // Triggers when element enters ~12% from bottom
    threshold: 0.15
  };

  const scrollObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-inview');
        // Once animated into its final state, keep it in view and unobserve
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all sections and independent reveal elements
  const animTargets = document.querySelectorAll(
    '.video-showcase-section, .counter-section, .expertise-scroll-section, .case-studies-section, .process-section, .testimonials-section, .home-blog-section, .pricing-cta-section, .faq-section, .get-started-cta-section, .site-footer, .reveal-item'
  );

  animTargets.forEach((target) => {
    scrollObserver.observe(target);
  });
}
