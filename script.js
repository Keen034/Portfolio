/* ============================================================
   Portfolio interactions
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('siteHeader');
  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  const closeNav = () => {
    navLinks.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  };

  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeNav);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });

  /* ---------- Reveal on scroll ---------- */
  const revealTargets = document.querySelectorAll(
    '.section-head, .card, .growth-card, .blog-cta, .resume-actions, .hero-actions'
  );

  revealTargets.forEach((el) => el.classList.add('reveal'));

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
      { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('visible'));
  }

  /* ---------- Resume loader state machine ---------- */
  const resumeLoader = document.getElementById('resumeLoader');
  if (resumeLoader) {
    const states = resumeLoader.querySelectorAll('.resume-state');
    const showState = (name) => {
      states.forEach((s) => {
        s.hidden = s.dataset.state !== name;
      });
    };

    // Simulated fetch — replace with a real fetch() to your resume JSON/PDF
    setTimeout(() => showState('loading-data'), 900);
    setTimeout(() => showState('unavailable'), 2200);
  }

  const downloadResume = document.getElementById('downloadResume');
  if (downloadResume) {
    downloadResume.addEventListener('click', (e) => {
      e.preventDefault();
      // Point this at your actual resume file, e.g. /resume.pdf
      window.open('resume.pdf', '_blank', 'noopener');
    });
  }

  /* ---------- Article counter (blog) ---------- */
  const articleCount = document.getElementById('articleCount');
  const setArticleCount = (n) => {
    if (!articleCount) return;
    articleCount.textContent = `Showing ${n} article${n === 1 ? '' : 's'}`;
  };

  // Replace with a real fetch to your posts source
  const posts = [];
  setArticleCount(posts.length);

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  const note = document.getElementById('formNote');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      note.className = 'form-note';

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const email = String(data.get('email') || '').trim();
      const message = String(data.get('message') || '').trim();

      if (!name || !email || !message) {
        note.textContent = 'Please fill in all fields.';
        note.classList.add('err');
        return;
      }

      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
      if (!emailOk) {
        note.textContent = 'Please enter a valid email address.';
        note.classList.add('err');
        return;
      }

      /* --- Wire this up to your backend / Formspree / mailto ---
         Example with Formspree:
         fetch('https://formspree.io/f/YOUR_ID', {
           method: 'POST',
           headers: { 'Accept': 'application/json' },
           body: data
         }).then(...)
      ---------------------------------------------------------- */

      note.textContent = `Thanks, ${name.split(' ')[0]} — your message is ready to send.`;
      note.classList.add('ok');
      form.reset();
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
            const active = a.getAttribute('href') === `#${id}`;
            a.style.color = active ? 'var(--text)' : '';
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );
    sections.forEach((s) => navObserver.observe(s));
  }

  /* ---------- Year in footer (safety) ---------- */
  const yearEl = document.querySelector('.footer-copy');
  if (yearEl && !yearEl.textContent.includes('2026')) {
    yearEl.textContent = yearEl.textContent.replace(/\d{4}/, '2026');
  }
})();
