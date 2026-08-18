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
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Initialize Components & Viewport-Aware Scroll Engine
  initScrollAnimations();
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
  initFooterCursorEffect();
});

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
  const showcaseSection = document.getElementById('videoShowcase');
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

  // 1. Scroll-Driven Cinematic Scaling (Pervasive & Smooth)
  function calculateProgress() {
    const rect = showcaseSection.getBoundingClientRect();
    const sectionHeight = showcaseSection.offsetHeight;
    const windowHeight = window.innerHeight;
    const scrollDistance = sectionHeight - windowHeight;

    if (scrollDistance <= 0) return 0;

    const scrolled = -rect.top;
    let progress = scrolled / scrollDistance;
    return Math.max(0, Math.min(1, progress));
  }

  function updateScrollMotion() {
    const progress = calculateProgress();

    // Scale calculation: expands to full screen seamlessly without affecting playback
    const isMobile = window.innerWidth <= 767;
    const isTablet = window.innerWidth > 767 && window.innerWidth <= 1024;
    const maxScaleMultiplier = isMobile ? 0.38 : (isTablet ? 0.55 : 0.72);
    const targetScale = 1.0 + progress * maxScaleMultiplier;
    
    // Border-radius morphing (14px down to 0px on full expansion)
    const baseRadius = isMobile ? 12 : 14;
    const targetRadius = Math.max(0, baseRadius * (1 - progress * 1.2));

    // Header fade and lift effect
    const targetHeaderOpacity = Math.max(0, 1 - progress * 2.2);
    const targetHeaderY = -progress * 54;

    // Direct GPU transform application for instant fluid response
    videoFrame.style.transform = `translate3d(0, 0, 0) scale(${targetScale.toFixed(4)})`;
    videoFrame.style.borderRadius = `${targetRadius.toFixed(1)}px`;

    if (videoHeader) {
      videoHeader.style.opacity = targetHeaderOpacity.toFixed(3);
      videoHeader.style.transform = `translateX(-50%) translateY(${targetHeaderY.toFixed(1)}px)`;
    }
  }

  // Bind scroll and resize with requestAnimationFrame
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateScrollMotion();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  updateScrollMotion();

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

    // Transition 1: Panel 2 rises from below during progress 0.10 -> 0.48
    const t1 = Math.max(0, Math.min(1, (progress - 0.10) / 0.38));
    
    // Transition 2: Panel 3 rises from below during progress 0.52 -> 0.90
    const t2 = Math.max(0, Math.min(1, (progress - 0.52) / 0.38));

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
 * Case Studies Carousel (Scale & Translate Depth Flip Carousel)
 * Continuous automatic rotation with viewport awareness and smooth looping.
 */
function initCaseStudies() {
  const section = document.getElementById('caseStudies');
  const cards = document.querySelectorAll('.case-study-section .card');
  const track = document.getElementById('caseStudyTrack');

  if (!cards.length) return;

  let currentIndex = 2; // Sets the 3rd card (Clear Day Kayaks) as starting main card
  const total = cards.length;
  let autoPlayTimer = null;
  const AUTO_INTERVAL = 2800; // Auto-advance every 2.8 seconds
  let isHovered = false;

  function updateCarousel() {
    cards.forEach((card, index) => {
      // Clear all positioning classes first
      card.classList.remove('active', 'prev-1', 'next-1', 'prev-2', 'next-2');

      // Assign classes based on circular distance from current center index
      if (index === currentIndex) {
        card.classList.add('active'); // Main
      } else if (index === (currentIndex - 1 + total) % total) {
        card.classList.add('prev-1'); // Medium Left
      } else if (index === (currentIndex + 1) % total) {
        card.classList.add('next-1'); // Medium Right
      } else if (index === (currentIndex - 2 + total) % total) {
        card.classList.add('prev-2'); // Small Left
      } else if (index === (currentIndex + 2) % total) {
        card.classList.add('next-2'); // Small Right
      }
    });
  }

  function advanceNext() {
    currentIndex = (currentIndex + 1) % total;
    updateCarousel();
  }

  function startAutoPlay() {
    if (autoPlayTimer) clearInterval(autoPlayTimer);
    autoPlayTimer = setInterval(() => {
      if (!isHovered) {
        advanceNext();
      }
    }, AUTO_INTERVAL);
  }

  function stopAutoPlay() {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer);
      autoPlayTimer = null;
    }
  }

  // Initialize the layout & start moving carousel immediately
  updateCarousel();
  startAutoPlay();

  // Pause ONLY when directly hovering over the active cards track, resume on leave
  if (track) {
    track.addEventListener('mouseenter', () => {
      isHovered = true;
    });
    track.addEventListener('mouseleave', () => {
      isHovered = false;
    });
  }

  // Click on visible side cards to bring them directly to center
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      if (
        card.classList.contains('prev-1') ||
        card.classList.contains('next-1') ||
        card.classList.contains('prev-2') ||
        card.classList.contains('next-2')
      ) {
        currentIndex = index;
        updateCarousel();
        startAutoPlay(); // Reset timer after manual click
      }
    });
  });

  // Viewport Intersection Observer: run when in view, pause when scrolled away
  if ('IntersectionObserver' in window && section) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startAutoPlay();
        } else {
          stopAutoPlay();
        }
      });
    }, { threshold: 0.15 });

    observer.observe(section);
  }

  // Touch / Swipe support for Mobile and Tablet
  if (track) {
    let touchStartX = 0;
    let touchEndX = 0;

    track.addEventListener('touchstart', (e) => {
      isHovered = true;
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    track.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].clientX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 35) {
        if (diff > 0) {
          currentIndex = (currentIndex + 1) % total;
        } else {
          currentIndex = (currentIndex - 1 + total) % total;
        }
        updateCarousel();
      }
      isHovered = false;
      startAutoPlay();
    }, { passive: true });
  }
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
  const track = document.getElementById('testimonialsGrid');
  const prevBtn = document.getElementById('testimonialPrev');
  const nextBtn = document.getElementById('testimonialNext');

  if (!track) return;

  // Render cards from data with authentic SVG flags
  track.innerHTML = testimonialsData.map((item, idx) => `
    <div class="testimonial-card" data-idx="${idx}">
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

  // Inline Direct-In-Card Video Playback (NO Modal/Popup)
  let isDragging = false;
  let startX = 0;
  let scrollLeft = 0;

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
        } else {
          existingVid.pause();
        }
        return;
      }

      // Create video element directly inside the card with sound, duration and controls
      const videoEl = document.createElement('video');
      videoEl.className = 'testimonial-inline-video';
      videoEl.src = item.videoUrl;
      videoEl.autoplay = true;
      videoEl.controls = true; // Provides sound volume, time duration, scrubber & play/pause right in the card
      videoEl.muted = false; // Audio enabled for user-initiated click
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

      videoEl.play().catch(() => {
        // Fallback for strict browser autoplay policies
        videoEl.muted = true;
        videoEl.play().catch(() => {});
      });

      videoEl.addEventListener('ended', () => {
        videoEl.remove();
        card.classList.remove('is-playing');
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

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      track.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      track.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
  }

  // Mouse Drag / Swipe Support
  let isMouseDown = false;
  let dragThreshold = 5;

  track.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
    track.classList.add('is-dragging');
  });

  track.addEventListener('mouseleave', () => {
    isMouseDown = false;
    track.classList.remove('is-dragging');
  });

  track.addEventListener('mouseup', () => {
    isMouseDown = false;
    track.classList.remove('is-dragging');
    setTimeout(() => {
      isDragging = false;
    }, 50);
  });

  track.addEventListener('mousemove', (e) => {
    if (!isMouseDown) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.4;
    if (Math.abs(walk) > dragThreshold) {
      isDragging = true;
    }
    track.scrollLeft = scrollLeft - walk;
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
