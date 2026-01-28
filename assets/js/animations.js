/* ============================================
   FETHIYE İK - ANIMATIONS JAVASCRIPT
   Scroll Animations, Counters, Effects
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

    // ===== SCROLL ANIMATIONS =====
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');

                    // If it's a counter, animate it
                    const counters = entry.target.querySelectorAll('.counter');
                    counters.forEach(counter => animateCounter(counter));
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        animateOnScrollElements.forEach(el => animationObserver.observe(el));
    } else {
        // Fallback for older browsers
        animateOnScrollElements.forEach(el => el.classList.add('is-visible'));
    }

    // ===== COUNTER ANIMATION =====
    const countersAnimated = new Set();

    function animateCounter(element) {
        if (countersAnimated.has(element)) return;
        countersAnimated.add(element);

        const target = parseInt(element.dataset.target) || 0;
        const duration = 2000;
        const startTime = performance.now();
        const startValue = 0;

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
            element.textContent = currentValue + (target >= 100 ? '+' : '');

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // ===== HERO STATS COUNTERS =====
    const heroStats = document.querySelectorAll('.stats-card .counter');

    if (heroStats.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    heroStats.forEach(counter => animateCounter(counter));
                    statsObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statsCard = document.querySelector('.stats-card');
        if (statsCard) {
            statsObserver.observe(statsCard);
        }
    }

    // ===== PARALLAX EFFECTS =====
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length > 0) {
        let ticking = false;

        function handleParallax() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;

                    parallaxElements.forEach(el => {
                        const speed = parseFloat(el.dataset.parallax) || 0.5;
                        const offset = scrollY * speed;
                        el.style.transform = `translateY(${offset}px)`;
                    });

                    ticking = false;
                });

                ticking = true;
            }
        }

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ===== STAGGER ANIMATIONS =====
    function staggerAnimation(elements, delayIncrement = 100) {
        elements.forEach((el, index) => {
            el.style.animationDelay = `${index * delayIncrement}ms`;
        });
    }

    // Apply stagger to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    staggerAnimation(serviceCards, 100);

    // Apply stagger to feature items
    const featureItems = document.querySelectorAll('.feature-item');
    staggerAnimation(featureItems, 100);

    // ===== FLOATING CARD ANIMATION RANDOMIZATION =====
    const floatingCards = document.querySelectorAll('.floating-card');

    floatingCards.forEach((card, index) => {
        const duration = 4 + Math.random() * 2; // 4-6 seconds
        const delay = index * 0.5;
        card.style.animationDuration = `${duration}s`;
        card.style.animationDelay = `${delay}s`;
    });

    // ===== TEXT REVEAL ANIMATION =====
    const textRevealElements = document.querySelectorAll('[data-text-reveal]');

    textRevealElements.forEach(el => {
        const text = el.textContent;
        el.textContent = '';

        [...text].forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.animationDelay = `${index * 30}ms`;
            span.classList.add('char-reveal');
            el.appendChild(span);
        });
    });

    // ===== MOUSE MOVE EFFECTS =====
    const heroVisual = document.querySelector('.hero-visual');

    if (heroVisual && window.matchMedia('(hover: hover)').matches) {
        document.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPercent = (clientX / innerWidth - 0.5) * 2;
            const yPercent = (clientY / innerHeight - 0.5) * 2;

            const floatingCards = heroVisual.querySelectorAll('.floating-card');
            floatingCards.forEach((card, index) => {
                const intensity = (index + 1) * 5;
                card.style.transform = `translate(${xPercent * intensity}px, ${yPercent * intensity}px)`;
            });
        });
    }

    // ===== RIPPLE EFFECT FOR BUTTONS =====
    const buttons = document.querySelectorAll('.btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });

    // Add ripple styles
    const rippleStyles = document.createElement('style');
    rippleStyles.textContent = `
    .btn {
      position: relative;
      overflow: hidden;
    }
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.4);
      transform: scale(0);
      animation: rippleEffect 0.6s linear;
      pointer-events: none;
    }
    @keyframes rippleEffect {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(rippleStyles);

    // ===== INTERSECTION OBSERVER FOR SECTIONS =====
    const sections = document.querySelectorAll('section[id]');

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');

                // Update URL hash without scrolling
                if (history.replaceState) {
                    history.replaceState(null, null, `#${id}`);
                }

                // Update active nav link
                const navLinks = document.querySelectorAll(`.main-nav a[href="#${id}"], .mobile-nav a[href="#${id}"]`);
                document.querySelectorAll('.main-nav a, .mobile-nav a').forEach(link => link.classList.remove('current'));
                navLinks.forEach(link => link.classList.add('current'));
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-100px 0px -100px 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    console.log('Fethiye İK - Animations initialized');
});
