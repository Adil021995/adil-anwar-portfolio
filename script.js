const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');
const navLinks = [...document.querySelectorAll('.nav-link')];

const scrollProgressBar = document.querySelector('#scroll-progress-bar');
let progressUpdateQueued = false;
const updateScrollProgress = () => {
  const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
  if (scrollProgressBar) scrollProgressBar.style.width = `${progress}%`;
  progressUpdateQueued = false;
};
window.addEventListener('scroll', () => {
  if (!progressUpdateQueued) {
    progressUpdateQueued = true;
    window.requestAnimationFrame(updateScrollProgress);
  }
}, { passive: true });
window.addEventListener('resize', updateScrollProgress, { passive: true });
updateScrollProgress();

const animatedRole = document.querySelector('[data-role]');
const rolePhrases = ['Aspiring QA Automation Engineer', 'AI-Assisted Website Designer & Developer'];
if (animatedRole && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  let roleIndex = 0;
  let characterIndex = rolePhrases[0].length;
  let deleting = false;

  const typeRole = () => {
    const phrase = rolePhrases[roleIndex];
    if (!deleting) {
      characterIndex += 1;
      animatedRole.textContent = phrase.slice(0, characterIndex);
      if (characterIndex >= phrase.length) {
        deleting = true;
        window.setTimeout(typeRole, 1500);
        return;
      }
    } else {
      characterIndex -= 1;
      animatedRole.textContent = phrase.slice(0, characterIndex);
      if (characterIndex <= 0) {
        deleting = false;
        roleIndex = (roleIndex + 1) % rolePhrases.length;
        window.setTimeout(typeRole, 400);
        return;
      }
    }
    window.setTimeout(typeRole, deleting ? 32 : 65);
  };

  window.setTimeout(() => {
    deleting = true;
    typeRole();
  }, 1800);
}

menuToggle?.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  primaryNav.classList.toggle('open', !isOpen);
});

navLinks.forEach((link) => link.addEventListener('click', () => {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation');
  primaryNav?.classList.remove('open');
}));

const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const sectionId = entry.target.id;
    navLinks.forEach((link) => link.classList.toggle('active', link.hash === `#${sectionId}`));
  });
}, { rootMargin: '-30% 0px -60% 0px' });
document.querySelectorAll('main section[id]').forEach((section) => sectionObserver.observe(section));

const filterButtons = document.querySelectorAll('.skill-tab');
const skillCards = document.querySelectorAll('.skill-card');
const updateSkillGridLayout = () => {
  const columns = window.matchMedia('(max-width: 760px)').matches ? 2 : window.matchMedia('(max-width: 1000px)').matches ? 3 : 5;
  const tracks = columns === 5 ? 60 : columns === 3 ? 12 : 8;
  const defaultSpan = tracks / columns;
  const visibleCards = [...skillCards].filter((card) => !card.hidden);
  skillCards.forEach((card) => { card.style.gridColumn = `span ${defaultSpan}`; });
  const remainder = visibleCards.length % columns;
  if (remainder) {
    const finalRowSpan = tracks / remainder;
    visibleCards.slice(-remainder).forEach((card) => { card.style.gridColumn = `span ${finalRowSpan}`; });
  }
};
filterButtons.forEach((button) => button.addEventListener('click', () => {
  filterButtons.forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  const category = button.dataset.filter;
  skillCards.forEach((card, index) => {
    card.hidden = category !== 'all' && card.dataset.category !== category;
    if (!card.hidden) {
      card.style.animationDelay = `${Math.min(index % 8, 7) * 25}ms`;
      card.style.animationName = 'none';
      requestAnimationFrame(() => { card.style.animationName = ''; });
    }
  });
  updateSkillGridLayout();
}));
updateSkillGridLayout();
window.addEventListener('resize', updateSkillGridLayout, { passive: true });

document.querySelector('#year').textContent = new Date().getFullYear();

// Drive the cover tilt and scroll-parallax CSS variables for both project previews.
const projectPreviews = [
  { element: document.querySelector('.project-book .gallery-open'), prefix: 'book' },
  { element: document.querySelector('.project-medhome .gallery-open'), prefix: 'medi' }
].filter((preview) => preview.element);
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!prefersReducedMotion && projectPreviews.length) {
  if (window.matchMedia('(pointer: fine)').matches) {
    projectPreviews.forEach(({ element, prefix }) => {
      element.addEventListener('pointermove', (event) => {
        const bounds = element.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width));
        const y = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
        element.style.setProperty(`--${prefix}-tilt-x`, `${(0.5 - y) * 9}deg`);
        element.style.setProperty(`--${prefix}-tilt-y`, `${(x - 0.5) * 12}deg`);
        element.style.setProperty(`--${prefix}-light-x`, `${x * 100}%`);
        element.style.setProperty(`--${prefix}-light-y`, `${y * 100}%`);
      }, { passive: true });
      element.addEventListener('pointerleave', () => {
        element.style.setProperty(`--${prefix}-tilt-x`, '0deg');
        element.style.setProperty(`--${prefix}-tilt-y`, '0deg');
      });
    });
  }

  let previewParallaxQueued = false;
  const updateProjectPreviewParallax = () => {
    projectPreviews.forEach(({ element, prefix }) => {
      const bounds = element.getBoundingClientRect();
      const viewportOffset = window.innerHeight / 2 - (bounds.top + bounds.height / 2);
      const depth = Math.max(-13, Math.min(13, viewportOffset * 0.022));
      element.style.setProperty(`--${prefix}-scroll-depth`, `${depth}px`);
    });
    previewParallaxQueued = false;
  };
  window.addEventListener('scroll', () => {
    if (previewParallaxQueued) return;
    previewParallaxQueued = true;
    window.requestAnimationFrame(updateProjectPreviewParallax);
  }, { passive: true });
  window.addEventListener('resize', updateProjectPreviewParallax, { passive: true });
  updateProjectPreviewParallax();
}

const cursorGlow = document.querySelector('.cursor-glow');
const galleryDialog = document.querySelector('#book-gallery');
if (galleryDialog) {
  const gallerySlides = [
    { src: 'assets/online-book-store/home.png', title: 'Home page', description: 'Home page with featured books, search and navigation.' },
    { src: 'assets/online-book-store/category.png', title: 'Categories', description: 'Category shelves for browsing books by genre and interest.' },
    { src: 'assets/online-book-store/cart.png', title: 'Shopping cart', description: 'Cart quantity controls and a clear order summary.' },
    { src: 'assets/online-book-store/login.png', title: 'Login', description: 'Reader account sign-in screen for the JavaScript demo.' },
    { src: 'assets/online-book-store/signup.png', title: 'Sign up', description: 'Account creation screen for the JavaScript demo.' },
    { src: 'assets/online-book-store/order-tracking.png', title: 'Order tracking', description: 'Order status timeline and tracking details.' }
  ];
  const galleryImage = galleryDialog.querySelector('#gallery-image');
  const galleryFrame = galleryDialog.querySelector('.gallery-frame');
  const galleryCaption = galleryDialog.querySelector('#gallery-caption');
  const galleryDescription = galleryDialog.querySelector('#gallery-description');
  const galleryCount = galleryDialog.querySelector('#gallery-count');
  const galleryThumbs = [...galleryDialog.querySelectorAll('[data-gallery-thumb]')];
  let galleryIndex = 0;

  const showGallerySlide = (nextIndex, direction = 1) => {
    galleryIndex = (nextIndex + gallerySlides.length) % gallerySlides.length;
    const slide = gallerySlides[galleryIndex];
    galleryFrame.classList.remove('slide-next', 'slide-prev');
    galleryImage.src = slide.src;
    galleryImage.alt = `Online Book Store ${slide.title.toLowerCase()} screenshot`;
    galleryCaption.textContent = slide.title;
    galleryDescription.textContent = slide.description;
    galleryCount.textContent = `${String(galleryIndex + 1).padStart(2, '0')} / ${String(gallerySlides.length).padStart(2, '0')}`;
    galleryThumbs.forEach((thumb, index) => {
      const isActive = index === galleryIndex;
      thumb.classList.toggle('active', isActive);
      if (isActive) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    requestAnimationFrame(() => galleryFrame.classList.add(direction >= 0 ? 'slide-next' : 'slide-prev'));
  };

  document.querySelector('[data-open-gallery]')?.addEventListener('click', () => {
    showGallerySlide(0, 1);
    galleryDialog.showModal();
  });
  galleryDialog.querySelector('[data-close-gallery]')?.addEventListener('click', () => galleryDialog.close());
  galleryDialog.querySelector('[data-gallery-prev]')?.addEventListener('click', () => showGallerySlide(galleryIndex - 1, -1));
  galleryDialog.querySelector('[data-gallery-next]')?.addEventListener('click', () => showGallerySlide(galleryIndex + 1, 1));
  galleryThumbs.forEach((thumb) => thumb.addEventListener('click', () => {
    const targetIndex = Number(thumb.dataset.galleryThumb);
    showGallerySlide(targetIndex, targetIndex >= galleryIndex ? 1 : -1);
  }));
  galleryDialog.addEventListener('click', (event) => {
    if (event.target === galleryDialog) galleryDialog.close();
  });
  galleryDialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') showGallerySlide(galleryIndex + 1, 1);
    if (event.key === 'ArrowLeft') showGallerySlide(galleryIndex - 1, -1);
  });
}

const medhomeGalleryDialog = document.querySelector('#medhome-gallery');
if (medhomeGalleryDialog) {
  const medhomeSlides = [
    { src: 'assets/medi-home/home.png', title: 'Home page', description: 'Pharmacy-style landing page with product discovery, search and care-focused navigation.' },
    { src: 'assets/medi-home/category.png', title: 'Categories', description: 'Category-led browsing for healthcare, personal-care and wellness products.' },
    { src: 'assets/medi-home/cart.png', title: 'Shopping cart', description: 'Cart quantities, offer summaries and a front-end demo checkout flow.' },
    { src: 'assets/medi-home/login.png', title: 'Login', description: 'Reader-friendly sign-in experience shown as part of the front-end demo.' },
    { src: 'assets/medi-home/signup.png', title: 'Sign up', description: 'Account creation screen for the browser-based MediHome demo.' },
    { src: 'assets/medi-home/order-tracking.png', title: 'Order tracking', description: 'Sample order details and a demo delivery journey timeline.' }
  ];
  const image = medhomeGalleryDialog.querySelector('#medhome-gallery-image');
  const frame = medhomeGalleryDialog.querySelector('.gallery-frame');
  const caption = medhomeGalleryDialog.querySelector('#medhome-gallery-caption');
  const description = medhomeGalleryDialog.querySelector('#medhome-gallery-description');
  const count = medhomeGalleryDialog.querySelector('#medhome-gallery-count');
  const thumbs = [...medhomeGalleryDialog.querySelectorAll('[data-medi-thumb]')];
  let index = 0;

  const showSlide = (nextIndex, direction = 1) => {
    index = (nextIndex + medhomeSlides.length) % medhomeSlides.length;
    const slide = medhomeSlides[index];
    frame.classList.remove('slide-next', 'slide-prev');
    image.src = slide.src;
    image.alt = `MediHome ${slide.title.toLowerCase()} screenshot`;
    caption.textContent = slide.title;
    description.textContent = slide.description;
    count.textContent = `${String(index + 1).padStart(2, '0')} / ${String(medhomeSlides.length).padStart(2, '0')}`;
    thumbs.forEach((thumb, thumbIndex) => {
      const active = thumbIndex === index;
      thumb.classList.toggle('active', active);
      if (active) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    requestAnimationFrame(() => frame.classList.add(direction >= 0 ? 'slide-next' : 'slide-prev'));
  };

  document.querySelector('[data-open-medhome-gallery]')?.addEventListener('click', () => {
    showSlide(0, 1);
    medhomeGalleryDialog.showModal();
  });
  medhomeGalleryDialog.querySelector('[data-close-medhome-gallery]')?.addEventListener('click', () => medhomeGalleryDialog.close());
  medhomeGalleryDialog.querySelector('[data-medi-prev]')?.addEventListener('click', () => showSlide(index - 1, -1));
  medhomeGalleryDialog.querySelector('[data-medi-next]')?.addEventListener('click', () => showSlide(index + 1, 1));
  thumbs.forEach((thumb) => thumb.addEventListener('click', () => {
    const target = Number(thumb.dataset.mediThumb);
    showSlide(target, target >= index ? 1 : -1);
  }));
  medhomeGalleryDialog.addEventListener('click', (event) => {
    if (event.target === medhomeGalleryDialog) medhomeGalleryDialog.close();
  });
  medhomeGalleryDialog.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') showSlide(index + 1, 1);
    if (event.key === 'ArrowLeft') showSlide(index - 1, -1);
  });
}

// Give the hero portrait a smooth pointer-driven 3D lean on precise-pointer devices.
const portraitStage = document.querySelector('.hero-visual');
const portraitFrame = document.querySelector('.portrait-frame');
const portraitCanTilt = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const portraitReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (portraitStage && portraitFrame && portraitCanTilt && !portraitReducedMotion) {
  let tiltFrame = 0;
  let pendingTilt = null;

  portraitStage.addEventListener('pointermove', (event) => {
    const bounds = portraitStage.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;

    const x = (event.clientX - bounds.left) / bounds.width;
    const y = (event.clientY - bounds.top) / bounds.height;
    pendingTilt = {
      x: ((x - 0.5) * 10).toFixed(2),
      y: ((0.5 - y) * 8).toFixed(2),
      lightX: `${(x * 100).toFixed(1)}%`,
      lightY: `${(y * 100).toFixed(1)}%`
    };

    if (!tiltFrame) {
      tiltFrame = requestAnimationFrame(() => {
        portraitFrame.style.setProperty('--portrait-tilt-x', `${pendingTilt.y}deg`);
        portraitFrame.style.setProperty('--portrait-tilt-y', `${pendingTilt.x}deg`);
        portraitFrame.style.setProperty('--portrait-light-x', pendingTilt.lightX);
        portraitFrame.style.setProperty('--portrait-light-y', pendingTilt.lightY);
        tiltFrame = 0;
      });
    }
  }, { passive: true });

  portraitStage.addEventListener('pointerleave', () => {
    portraitFrame.style.setProperty('--portrait-tilt-x', '0deg');
    portraitFrame.style.setProperty('--portrait-tilt-y', '0deg');
    portraitFrame.style.setProperty('--portrait-light-x', '50%');
    portraitFrame.style.setProperty('--portrait-light-y', '35%');
  }, { passive: true });
}

// Submit the contact form through FormSubmit's AJAX endpoint so the visitor
// stays on this page instead of being sent through its default thank-you route.
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  const formStatus = contactForm.querySelector('.form-status');
  const submitButton = contactForm.querySelector('[type="submit"]');
  const originalButtonMarkup = submitButton?.innerHTML;
  const ajaxEndpoint = contactForm.dataset.ajaxEndpoint;

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity() || !formStatus || !submitButton || !ajaxEndpoint) return;

    formStatus.hidden = false;
    formStatus.dataset.state = 'sending';
    formStatus.textContent = 'Sending your message…';
    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending…';
    contactForm.setAttribute('aria-busy', 'true');

    try {
      const response = await fetch(ajaxEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(new FormData(contactForm).entries()))
      });
      const result = await response.json();
      if (!response.ok || String(result.success).toLowerCase() !== 'true') {
        throw new Error(result.message || 'The form service could not accept your message.');
      }

      contactForm.reset();
      formStatus.dataset.state = 'success';
      formStatus.textContent = 'Message submitted successfully. Thank you for reaching out!';
    } catch (error) {
      formStatus.dataset.state = 'error';
      formStatus.textContent = 'Your message could not be sent right now. Please try again or email adilanwartester95@gmail.com.';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonMarkup;
      contactForm.removeAttribute('aria-busy');
    }
  });
}
