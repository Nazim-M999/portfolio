/**
 * PORTFOLIO — NAZIM MELLOUK
 * JavaScript : navigation, accessibilité, formulaire, préférences
 * WCAG 2.2 AA conforme
 */

/* =========================================================
   MENU ACCESSIBILITÉ
   ========================================================= */

const A11Y = {
  panel: document.getElementById('a11y-toggle'),
  options: document.getElementById('a11y-options'),
  root: document.documentElement,
  body: document.body,

  prefs: {
    fontScale: parseFloat(localStorage.getItem('a11y-font-scale')) || 1,
    highContrast: localStorage.getItem('a11y-high-contrast') === 'true',
    darkMode: localStorage.getItem('a11y-dark-mode') === 'true',
    noAnimations: localStorage.getItem('a11y-no-animations') === 'true',
    underlineLinks: localStorage.getItem('a11y-underline-links') === 'true',
  },

  init() {
    // Charger préférences stockées (le site est toujours clair par défaut ;
    // le mode sombre ne s'active que si l'utilisateur l'a choisi explicitement)
    this.applyAll();

    // Toggle panel
    document.getElementById('a11y-toggle').addEventListener('click', () => {
      const expanded = this.panel.getAttribute('aria-expanded') === 'true';
      this.setOpen(!expanded);
      if (!expanded) {
        document.querySelector('.a11y-btn').focus();
      }
    });

    // Fermer avec Échap
    document.getElementById('a11y-options').addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.setOpen(false);
        this.panel.focus();
      }
    });

    // Boutons
    document.getElementById('btn-text-plus').addEventListener('click', () => this.changeFont(0.1));
    document.getElementById('btn-text-minus').addEventListener('click', () => this.changeFont(-0.1));
    document.getElementById('btn-contrast').addEventListener('click', () => this.toggle('highContrast', 'btn-contrast', 'high-contrast'));
    document.getElementById('btn-dark').addEventListener('click', () => this.toggleDark());
    document.getElementById('btn-no-anim').addEventListener('click', () => this.toggleAnimations());
    document.getElementById('btn-underline').addEventListener('click', () => this.toggle('underlineLinks', 'btn-underline', 'underline-links'));
    document.getElementById('btn-reset').addEventListener('click', () => this.reset());

    // Respecter prefers-reduced-motion du système (sauf si l'utilisateur a déjà un choix explicite)
    if (localStorage.getItem('a11y-no-animations') === null) {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      if (prefersReducedMotion.matches) {
        this.body.dataset.animations = 'false';
      }
    }
  },

  setOpen(open) {
    this.panel.setAttribute('aria-expanded', String(open));
    this.panel.setAttribute('aria-label', open ? 'Fermer les options d\'accessibilité' : 'Ouvrir les options d\'accessibilité');
    this.options.hidden = !open;
  },

  changeFont(delta) {
    this.prefs.fontScale = Math.min(1.5, Math.max(0.75, +(this.prefs.fontScale + delta).toFixed(2)));
    this.root.style.setProperty('--user-font-scale', this.prefs.fontScale);
    localStorage.setItem('a11y-font-scale', this.prefs.fontScale);
  },

  toggle(pref, btnId, cssClass) {
    this.prefs[pref] = !this.prefs[pref];
    const btn = document.getElementById(btnId);
    btn.setAttribute('aria-pressed', String(this.prefs[pref]));

    if (cssClass) {
      this.body.classList.toggle(cssClass, this.prefs[pref]);
    }

    localStorage.setItem(`a11y-${pref.replace(/([A-Z])/g, '-$1').toLowerCase()}`, this.prefs[pref]);
  },

  toggleAnimations() {
    this.prefs.noAnimations = !this.prefs.noAnimations;
    this.body.dataset.animations = this.prefs.noAnimations ? 'false' : 'true';
    document.getElementById('btn-no-anim').setAttribute('aria-pressed', String(this.prefs.noAnimations));
    localStorage.setItem('a11y-no-animations', this.prefs.noAnimations);
  },

  toggleDark() {
    this.prefs.darkMode = !this.prefs.darkMode;
    this.body.classList.toggle('dark-mode', this.prefs.darkMode);
    document.getElementById('btn-dark').setAttribute('aria-pressed', String(this.prefs.darkMode));
    localStorage.setItem('a11y-dark-mode', this.prefs.darkMode);
  },

  applyAll() {
    this.root.style.setProperty('--user-font-scale', this.prefs.fontScale);
    if (this.prefs.highContrast) this.body.classList.add('high-contrast');
    if (this.prefs.darkMode) this.body.classList.add('dark-mode');
    if (this.prefs.noAnimations) this.body.dataset.animations = 'false';
    if (this.prefs.underlineLinks) this.body.classList.add('underline-links');

    // Sync aria-pressed
    const sync = (id, val) => {
      const btn = document.getElementById(id);
      if (btn) btn.setAttribute('aria-pressed', String(val));
    };
    sync('btn-contrast', this.prefs.highContrast);
    sync('btn-dark', this.prefs.darkMode);
    sync('btn-no-anim', this.prefs.noAnimations);
    sync('btn-underline', this.prefs.underlineLinks);
  },

  reset() {
    ['a11y-font-scale','a11y-high-contrast','a11y-dark-mode','a11y-no-animations','a11y-underline-links'].forEach(k => localStorage.removeItem(k));
    this.prefs = { fontScale: 1, highContrast: false, darkMode: false, noAnimations: false, underlineLinks: false };
    this.root.style.removeProperty('--user-font-scale');
    ['high-contrast','dark-mode','underline-links'].forEach(c => this.body.classList.remove(c));
    this.body.dataset.animations = 'true';
    ['btn-contrast','btn-dark','btn-no-anim','btn-underline'].forEach(id => {
      const btn = document.getElementById(id);
      if (btn) btn.setAttribute('aria-pressed', 'false');
    });
  }
};

/* =========================================================
   NAVIGATION MOBILE
   ========================================================= */

const NAV = {
  toggle: document.querySelector('.nav-toggle'),
  links: document.getElementById('nav-links'),
  backdrop: document.getElementById('nav-backdrop'),

  init() {
    if (!this.toggle || !this.links) return;

    this.toggle.addEventListener('click', () => {
      const expanded = this.toggle.getAttribute('aria-expanded') === 'true';
      this.setOpen(!expanded);
    });

    // Fermer au clic sur un lien
    this.links.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => this.setOpen(false));
    });

    // Fermer au clic sur le fond assombri (en dehors du tiroir)
    if (this.backdrop) {
      this.backdrop.addEventListener('click', () => this.setOpen(false));
    }

    // Fermer avec Échap
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.links.classList.contains('open')) {
        this.setOpen(false);
        this.toggle.focus();
      }
    });
  },

  setOpen(open) {
    this.toggle.setAttribute('aria-expanded', String(open));
    this.links.classList.toggle('open', open);
    this.toggle.setAttribute('aria-label', open ? 'Fermer le menu de navigation' : 'Ouvrir le menu de navigation');
    // Empêche le défilement de la page derrière le tiroir de navigation
    document.body.classList.toggle('nav-open', open);

    if (this.backdrop) {
      this.backdrop.classList.toggle('open', open);
    }
  }
};

/* =========================================================
   NAVIGATION ACTIVE (aria-current) + FIL D'ARIANE DYNAMIQUE
   ========================================================= */

const SCROLL_SPY = {
  sections: [],
  navLinks: [],

  labels: {
    hero: 'Accueil',
    about: 'À propos',
    skills: 'Compétences',
    projects: 'Projets',
    'projects-extra': 'Projets complémentaires',
    accessibility: 'Accessibilité numérique',
    education: 'Formation',
    availability: 'Disponibilité',
    contact: 'Contact'
  },

  breadcrumbHome: document.querySelector('#breadcrumb-list a[href="#hero"]'),
  breadcrumbCurrent: document.getElementById('breadcrumb-current'),

  init() {
    this.sections = Array.from(document.querySelectorAll('main section[id]'));
    this.navLinks = Array.from(document.querySelectorAll('#nav-links a'));

    const headerOffset = window.innerWidth <= 768 ? 90 : 140;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setActive(entry.target.id);
        }
      });
    }, { rootMargin: `-${headerOffset}px 0px -55% 0px` });

    this.sections.forEach(s => observer.observe(s));
  },

  setActive(id) {
    this.navLinks.forEach(link => {
      const isActive = link.getAttribute('href') === `#${id}`;
      link.setAttribute('aria-current', isActive ? 'true' : 'false');
    });

    if (!this.breadcrumbHome || !this.breadcrumbCurrent) return;

    if (id === 'hero') {
      this.breadcrumbCurrent.hidden = true;
      this.breadcrumbCurrent.removeAttribute('aria-current');
      this.breadcrumbHome.setAttribute('aria-current', 'page');
    } else {
      this.breadcrumbCurrent.hidden = false;
      this.breadcrumbCurrent.textContent = this.labels[id] || '';
      this.breadcrumbCurrent.setAttribute('aria-current', 'page');
      this.breadcrumbHome.removeAttribute('aria-current');
    }
  }
};

/* =========================================================
   HEADER SCROLL EFFECT
   ========================================================= */

function initHeaderScroll() {
  const header = document.getElementById('site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    header.style.boxShadow = scroll > 80 ? '0 2px 20px rgba(15, 23, 42, 0.08)' : '';
  }, { passive: true });
}

/* =========================================================
   BOUTON RETOUR EN HAUT DE PAGE
   ========================================================= */

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  const heroHeading = document.getElementById('hero-heading');
  if (!btn) return;

  const setVisible = (visible) => {
    btn.classList.toggle('is-visible', visible);
    btn.setAttribute('aria-hidden', String(!visible));
    btn.tabIndex = visible ? 0 : -1;
  };

  window.addEventListener('scroll', () => {
    setVisible(window.scrollY > 480);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (heroHeading) {
      if (!heroHeading.hasAttribute('tabindex')) heroHeading.setAttribute('tabindex', '-1');
      heroHeading.focus({ preventScroll: true });
    }
  });
}

/* =========================================================
   REVEAL ON SCROLL (animations d'entrée)
   ========================================================= */

function initReveal() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (document.body.dataset.animations === 'false') return;

  const targets = document.querySelectorAll('.project-card, .skill-group, .extra-card, .a11y-feature, .timeline-item, .stat-card');

  const style = document.createElement('style');
  style.textContent = `
    .reveal-pending {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    .reveal-pending.revealed {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);

  targets.forEach((el, i) => {
    el.classList.add('reveal-pending');
    el.style.transitionDelay = `${(i % 4) * 60}ms`;
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -50px 0px' });

  targets.forEach(el => observer.observe(el));
}

/* =========================================================
   FORMULAIRE DE CONTACT (validation + mailto fallback)
   ========================================================= */

const FORM = {
  form: document.getElementById('contact-form'),
  status: document.getElementById('form-status'),

  init() {
    if (!this.form) return;

    this.form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (this.validate()) {
        this.send();
      }
    });

    // Validation en temps réel
    ['contact-name', 'contact-email', 'contact-message'].forEach(id => {
      const field = document.getElementById(id);
      if (field) {
        field.addEventListener('blur', () => this.validateField(field));
        field.addEventListener('input', () => {
          if (field.dataset.touched) this.validateField(field);
        });
      }
    });
  },

  validateField(field) {
    field.dataset.touched = '1';
    const errorEl = document.getElementById(`${field.id.replace('contact-', '')}-error`);
    let error = '';

    if (field.required && !field.value.trim()) {
      error = 'Ce champ est obligatoire.';
    } else if (field.type === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
      error = 'Adresse email invalide.';
    }

    if (errorEl) errorEl.textContent = error;
    field.setAttribute('aria-invalid', error ? 'true' : 'false');
    return !error;
  },

  validate() {
    const fields = this.form.querySelectorAll('input, textarea');
    let valid = true;
    fields.forEach(field => {
      if (!this.validateField(field)) valid = false;
    });
    return valid;
  },

  send() {
    const name = document.getElementById('contact-name').value.trim();
    const email = document.getElementById('contact-email').value.trim();
    const message = document.getElementById('contact-message').value.trim();

    // Fallback mailto (sans backend)
    const subject = encodeURIComponent(`Contact portfolio – ${name}`);
    const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\nMessage :\n${message}`);
    const mailto = `mailto:nm2436101@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailto;

    this.status.textContent = 'Votre client mail a été ouvert avec le message pré-rempli.';
    this.status.className = 'form-status success';
  }
};

/* =========================================================
   LAZY LOADING DES IMAGES (fallback pour anciens navigateurs)
   ========================================================= */

function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) return; // natif

  const images = document.querySelectorAll('img[loading="lazy"]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
}

/* =========================================================
   GESTION DES IMAGES MANQUANTES (fallback élégant)
   ========================================================= */

function initImageFallbacks() {
  document.querySelectorAll('.project-img, .hero-avatar').forEach(img => {
    img.addEventListener('error', function() {
      this.style.display = 'none';
      const wrapper = this.closest('.project-img-wrapper, .hero-avatar-wrapper');
      if (wrapper) {
        wrapper.style.background = 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)';
        wrapper.style.minHeight = '200px';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        wrapper.style.justifyContent = 'center';

        if (!wrapper.querySelector('.img-placeholder')) {
          const placeholder = document.createElement('span');
          placeholder.className = 'img-placeholder';
          placeholder.setAttribute('aria-hidden', 'true');
          placeholder.textContent = this.alt ? this.alt.charAt(0).toUpperCase() : '?';
          placeholder.style.cssText = `
            font-family: 'Inter', sans-serif;
            font-size: 3rem;
            font-weight: 800;
            color: #2563EB;
            opacity: 0.45;
          `;
          wrapper.appendChild(placeholder);
        }
      }
    });
  });
}

/* =========================================================
   PIÈGE FOCUS POUR LE MENU MOBILE
   ========================================================= */

function trapFocus(container) {
  const focusableSelectors = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])';

  container.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !container.classList.contains('open')) return;
    const focusable = container.querySelectorAll(focusableSelectors);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
}

/* =========================================================
   INIT GLOBAL
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  A11Y.init();
  NAV.init();
  SCROLL_SPY.init();
  initHeaderScroll();
  initBackToTop();
  initReveal();
  FORM.init();
  initLazyImages();
  initImageFallbacks();

  // Piège focus dans le menu mobile pendant qu'il est ouvert
  const navLinks = document.getElementById('nav-links');
  if (navLinks) trapFocus(navLinks);

  // Smooth scroll pour ancres internes
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.getElementById(this.getAttribute('href').slice(1));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Focus pour l'accessibilité
        if (!target.hasAttribute('tabindex')) {
          target.setAttribute('tabindex', '-1');
        }
        target.focus({ preventScroll: true });
      }
    });
  });
});
