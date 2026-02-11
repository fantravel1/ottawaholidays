/* ============================================================
   OttawaHolidays.com — Main JavaScript
   Navigation, scroll animations, vibe bars, lazy loading
   ============================================================ */

(function () {
    'use strict';

    // ==================== HEADER SCROLL BEHAVIOR ====================
    const header = document.getElementById('header');
    let lastScrollY = 0;
    let ticking = false;

    function updateHeader() {
        const scrollY = window.scrollY;
        if (scrollY > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            window.requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }, { passive: true });

    // ==================== MOBILE NAV ====================
    const navToggle = document.getElementById('navToggle');
    const mainNav = document.getElementById('mainNav');

    if (navToggle && mainNav) {
        navToggle.addEventListener('click', function () {
            const isOpen = mainNav.classList.toggle('open');
            navToggle.classList.toggle('active');
            navToggle.setAttribute('aria-expanded', isOpen);
            document.body.style.overflow = isOpen ? 'hidden' : '';
        });

        // Close nav when clicking a link
        mainNav.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
                mainNav.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });

        // Close nav on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && mainNav.classList.contains('open')) {
                mainNav.classList.remove('open');
                navToggle.classList.remove('active');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            }
        });
    }

    // ==================== SCROLL ANIMATIONS ====================
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -60px 0px',
            threshold: 0.1
        };

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animateElements.forEach(function (el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        animateElements.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    // ==================== VIBE BARS ANIMATION ====================
    const vibeBars = document.querySelectorAll('.vibe-bar');

    if (vibeBars.length && 'IntersectionObserver' in window) {
        vibeBars.forEach(function (bar) {
            bar.setAttribute('data-animated', 'false');
        });

        const vibeObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    const bars = entry.target.querySelectorAll('.vibe-bar');
                    bars.forEach(function (bar, index) {
                        setTimeout(function () {
                            bar.removeAttribute('data-animated');
                        }, index * 120);
                    });
                    vibeObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        var vibeGrid = document.querySelector('.vibe-grid');
        if (vibeGrid) {
            vibeObserver.observe(vibeGrid);
        }
    }

    // ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                var headerHeight = header ? header.offsetHeight : 0;
                var targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Close mobile nav if open
                if (mainNav && mainNav.classList.contains('open')) {
                    mainNav.classList.remove('open');
                    navToggle.classList.remove('active');
                    navToggle.setAttribute('aria-expanded', 'false');
                    document.body.style.overflow = '';
                }
            }
        });
    });

    // ==================== LAZY LOADING IMAGES (NATIVE + FALLBACK) ====================
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading — already handled by HTML attributes
    } else if ('IntersectionObserver' in window) {
        // Fallback for browsers without native lazy loading
        var lazyImages = document.querySelectorAll('img[loading="lazy"]');
        var imageObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    var img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '200px' });

        lazyImages.forEach(function (img) {
            imageObserver.observe(img);
        });
    }

    // ==================== CURRENT YEAR IN FOOTER (if needed) ====================
    var yearEls = document.querySelectorAll('[data-year]');
    yearEls.forEach(function (el) {
        el.textContent = new Date().getFullYear();
    });

})();
