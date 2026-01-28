/* ============================================
   FETHIYE İK - MAIN JAVASCRIPT
   Navigation, Mobile Menu, Header Scroll
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  const header = document.getElementById('header');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

  // Check for saved user preference
  const currentTheme = localStorage.getItem('theme');

  if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
  } else if (currentTheme === 'light') {
    document.body.classList.remove('dark-mode');
  } else if (prefersDarkScheme.matches) {
    // Auto dark mode if system prefers it
    document.body.classList.add('dark-mode');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('dark-mode');

      let theme = 'light';
      if (document.body.classList.contains('dark-mode')) {
        theme = 'dark';
      }

      localStorage.setItem('theme', theme);
    });
  }

  // ===== HEADER SCROLL EFFECT =====
  let lastScrollY = window.scrollY;

  function handleHeaderScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll(); // Initial check

  // ===== MOBILE MENU =====
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', function () {
      this.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu when clicking on a link
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function () {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });

    // Close menu on escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenuBtn.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // ===== SMOOTH SCROLL =====
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');

      if (href === '#') return;

      const target = document.querySelector(href);

      if (target) {
        e.preventDefault();

        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // ===== DROPDOWN HOVER HANDLING =====
  const dropdowns = document.querySelectorAll('.nav-dropdown');

  dropdowns.forEach(dropdown => {
    let timeout;

    dropdown.addEventListener('mouseenter', function () {
      clearTimeout(timeout);
      this.querySelector('.dropdown-menu').style.opacity = '1';
      this.querySelector('.dropdown-menu').style.visibility = 'visible';
      this.querySelector('.dropdown-menu').style.transform = 'translateX(-50%) translateY(0)';
    });

    dropdown.addEventListener('mouseleave', function () {
      const menu = this.querySelector('.dropdown-menu');
      timeout = setTimeout(() => {
        menu.style.opacity = '0';
        menu.style.visibility = 'hidden';
        menu.style.transform = 'translateX(-50%) translateY(10px)';
      }, 200);
    });
  });

  // ===== ACTIVE NAV LINK =====
  function setActiveNavLink() {
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.main-nav a, .mobile-nav a');

    navLinks.forEach(link => {
      link.classList.remove('active');

      const href = link.getAttribute('href');
      if (currentPath.endsWith(href) ||
        (currentPath.endsWith('/') && href === 'index.html') ||
        (currentPath.includes('/hizmetler') && href.includes('hizmetler'))) {
        link.classList.add('active');
      }
    });
  }

  setActiveNavLink();

  // ===== LAZY LOAD IMAGES =====
  if ('IntersectionObserver' in window) {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  // ===== PHONE LINK TRACKING =====
  const phoneLinks = document.querySelectorAll('a[href^="tel:"]');

  phoneLinks.forEach(link => {
    link.addEventListener('click', function () {
      // Track phone clicks (for analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'phone_click', {
          'event_category': 'contact',
          'event_label': this.getAttribute('href')
        });
      }
    });
  });

  // ===== WHATSAPP LINK TRACKING =====
  const whatsappLinks = document.querySelectorAll('a[href*="wa.me"]');

  whatsappLinks.forEach(link => {
    link.addEventListener('click', function () {
      // Track WhatsApp clicks (for analytics)
      if (typeof gtag !== 'undefined') {
        gtag('event', 'whatsapp_click', {
          'event_category': 'contact',
          'event_label': 'whatsapp'
        });
      }
    });
  });

  // ===== SCROLL ANIMATIONS (Intersection Observer) =====
  const animatedElements = document.querySelectorAll('.animate-on-scroll');

  if (animatedElements.length > 0 && 'IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      animationObserver.observe(element);
    });
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(element => {
      element.classList.add('is-visible');
    });
  }

  // ===== FORM VALIDATION =====
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      let isValid = true;
      const requiredFields = contactForm.querySelectorAll('[required]');

      // Clear previous errors
      contactForm.querySelectorAll('.form-error').forEach(error => error.remove());
      contactForm.querySelectorAll('.error').forEach(field => field.classList.remove('error'));

      // Validate each required field
      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          isValid = false;
          field.classList.add('error');
          showFieldError(field, 'Bu alan zorunludur');
        }

        // Email validation
        if (field.type === 'email' && field.value.trim()) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(field.value)) {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'Geçerli bir e-posta adresi girin');
          }
        }

        // Phone validation
        if (field.type === 'tel' && field.value.trim()) {
          const phoneRegex = /^(\+90|0)?[0-9]{10}$/;
          const cleanPhone = field.value.replace(/\s/g, '');
          if (!phoneRegex.test(cleanPhone)) {
            isValid = false;
            field.classList.add('error');
            showFieldError(field, 'Geçerli bir telefon numarası girin');
          }
        }
      });

      if (isValid) {
        // Show success message
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.innerHTML = '✓ Mesajınız gönderildi! En kısa sürede size dönüş yapacağız.';
        contactForm.appendChild(successDiv);
        contactForm.reset();

        setTimeout(() => successDiv.remove(), 5000);
      }
    });

    // Helper function to show field error
    function showFieldError(field, message) {
      const errorSpan = document.createElement('span');
      errorSpan.className = 'form-error';
      errorSpan.textContent = message;
      field.parentNode.appendChild(errorSpan);
    }

    // Real-time validation
    contactForm.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('input', function () {
        if (this.classList.contains('error') && this.value.trim()) {
          this.classList.remove('error');
          const errorMsg = this.parentNode.querySelector('.form-error');
          if (errorMsg) errorMsg.remove();
        }
      });
    });
  }

  // ===== COUNTER ANIMATION =====
  const trustNumbers = document.querySelectorAll('.trust-number');

  if (trustNumbers.length > 0 && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const text = element.textContent;
          const match = text.match(/\d+/);

          if (match) {
            const target = parseInt(match[0]);
            animateCounter(element, target);
          }

          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    trustNumbers.forEach(number => counterObserver.observe(number));
  }

  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 60; // 60 frames for ~1 second
    const suffix = element.textContent.includes('+') ? '+' : '';

    function update() {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current) + suffix;
        requestAnimationFrame(update);
      } else {
        element.textContent = target + suffix;
      }
    }

    element.textContent = '0' + suffix;
    requestAnimationFrame(update);
  }

  // ===== STAT NUMBER ANIMATION =====
  const statNumbers = document.querySelectorAll('.stat-number');

  if (statNumbers.length > 0 && 'IntersectionObserver' in window) {
    const statObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const text = element.textContent;
          const match = text.match(/\d+/);

          if (match) {
            const target = parseInt(match[0]);
            animateCounter(element, target);
          }

          observer.unobserve(element);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(number => statObserver.observe(number));
  }

  console.log('Fethiye İK - Website loaded successfully');
});

