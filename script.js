(() => {
  const progress = document.getElementById('progress');
  const nav = document.getElementById('nav');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const backToTop = document.getElementById('backToTop');
  const year = document.getElementById('year');

  if (year) year.textContent = new Date().getFullYear();

  // Smoothly return to the very top.
  if (backToTop) {
    backToTop.addEventListener('click', (event) => {
      event.preventDefault();
      window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
  }

  function updateProgress() {
    if (!progress) return;
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  updateProgress();

  // Accessible mobile navigation.
  function closeMenu() {
    if (!nav || !menuToggle) return;
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation');
  }
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation' : 'Open navigation');
    });
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('click', (event) => {
      if (nav.classList.contains('open') && !nav.contains(event.target) && !menuToggle.contains(event.target)) closeMenu();
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
    window.addEventListener('resize', () => {
      if (window.innerWidth > 900) closeMenu();
    });
  }

  // Reveal animations and active navigation, with a fallback for older browsers.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealElements.forEach((element) => revealObserver.observe(element));

    const sections = [...document.querySelectorAll('main section[id], .contact-section[id]')];
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach((section) => sectionObserver.observe(section));
  } else {
    revealElements.forEach((element) => element.classList.add('visible'));
  }

  // Subtle pointer-follow glow on cards; no effect on touch-only devices.
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.skill-card, .project-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
        card.style.setProperty('--my', `${event.clientY - rect.top}px`);
      });
    });
  }

  // If a personal photo is not included, show a designed monogram instead of a broken image.
  const profileImage = document.getElementById('profileImage');
  if (profileImage) {
    profileImage.addEventListener('error', () => {
      const frame = profileImage.closest('.image-frame');
      if (frame) frame.classList.add('profile-unavailable');
      profileImage.hidden = true;
      const shade = frame && frame.querySelector('.image-shade');
      if (shade) shade.hidden = true;
    }, { once: true });
    if (profileImage.complete && profileImage.naturalWidth === 0) profileImage.dispatchEvent(new Event('error'));
  }

  // Static-host contact form. FormSubmit emails submissions to the portfolio owner's inbox.
  // The owner must click the one-time activation link sent after the first submission.
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const status = document.getElementById('formStatus');
      const button = contactForm.querySelector('button[type="submit"]');
      const honeypot = contactForm.querySelector('[name="_honey"]');
      if (honeypot && honeypot.value) return;
      if (!status || !button) return;

      button.disabled = true;
      button.innerHTML = 'Sending… <span>↗</span>';
      status.className = 'form-status';
      status.textContent = 'Sending your message…';

      const payload = Object.fromEntries(new FormData(contactForm).entries());
      delete payload._honey;
      payload._subject = `Portfolio contact: ${payload.subject || payload.name || 'New message'}`;
      payload._template = 'table';
      payload._replyto = payload.email;

      try {
        const response = await fetch('https://formsubmit.co/ajax/adilanwartester95@gmail.com', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();
        if (!response.ok || String(result.success).toLowerCase() !== 'true') {
          throw new Error(result.message || 'Unable to send message.');
        }
        status.className = 'form-status success';
        status.textContent = 'Thanks! Your message has been submitted. I’ll get back to you soon.';
        contactForm.reset();
      } catch (error) {
        status.className = 'form-status error';
        status.textContent = 'Sorry, the message could not be sent. Please email adilanwartester95@gmail.com directly.';
      } finally {
        button.disabled = false;
        button.innerHTML = 'Send message <span>↗</span>';
      }
    });
  }
})();
