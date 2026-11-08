/* ============================================================
   Portfolio interactions — Vincent Mutei Mutinda
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    const setOpen = (open) => {
      navLinks.classList.toggle('open', open);
      navToggle.setAttribute('aria-expanded', String(open));
      document.body.classList.toggle('nav-open', open);
    };

    const isOpen = () => navLinks.classList.contains('open');

    navToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      setOpen(!isOpen());
    });

    // Close after choosing a link
    navLinks.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => setOpen(false));
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) setOpen(false);
    });

    // Close when tapping outside
    document.addEventListener('click', (e) => {
      if (!isOpen()) return;
      if (navLinks.contains(e.target) || navToggle.contains(e.target)) return;
      setOpen(false);
    });

    // Close when resizing up to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820 && isOpen()) setOpen(false);
    });
  }

  /* ---------- Reveal on scroll (safe: never leaves content hidden) ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .card, .skill-card, .growth-card, .project-card, .cert-card, .timeline-item, .contact-card, .contact-head, .hero-actions, .contact-meta'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

  const showAll = () => revealTargets.forEach((el) => el.classList.add('visible'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -10% 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));

    // Safety net for tall elements the observer might miss
    setTimeout(showAll, 2500);

    // Anything already in viewport on load
    revealTargets.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight) el.classList.add('visible');
    });
  } else {
    showAll();
  }

  // Guarantee: when you reach the bottom, everything is visible
  window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 80) showAll();
  }, { passive: true });

  /* ---------- CV preview toggle ---------- */
  const cvToggle = document.getElementById('cvPreviewToggle');
  const cvPanel = document.getElementById('cvPreviewPanel');

  if (cvToggle && cvPanel) {
    cvToggle.addEventListener('click', () => {
      const open = cvPanel.hasAttribute('hidden');
      if (open) {
        cvPanel.removeAttribute('hidden');
        cvToggle.textContent = 'Hide CV';
        cvToggle.setAttribute('aria-expanded', 'true');
        cvPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        cvPanel.setAttribute('hidden', '');
        cvToggle.textContent = 'Preview CV';
        cvToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Contact form → opens the visitor's email client ---------- */
  const OWN_EMAIL = 'vincentmutinda59@gmail.com';
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.className = 'form-note';

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const subject = String(data.get('subject') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !message) {
        note.textContent = 'Please fill in your name, email and message.';
        note.classList.add('err');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
        note.textContent = 'Please enter a valid email address.';
        note.classList.add('err');
        return;
      }

      const finalSubject = subject || `Portfolio enquiry from ${name}`;
      const body =
        `Name: ${name}\n` +
        `Email: ${email}\n\n` +
        `${message}\n\n` +
        `— Sent from the portfolio contact form`;

      const mailto =
        `mailto:${OWN_EMAIL}` +
        `?subject=${encodeURIComponent(finalSubject)}` +
        `&body=${encodeURIComponent(body)}`;

      window.location.href = mailto;

      note.textContent = 'Opening your email app with the message pre-filled…';
      note.classList.add('ok');
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('main section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          navAnchors.forEach((a) => {
            a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--text)' : '';
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => navObserver.observe(s));
  }
})();
