/**
 * BeatTheHeat.Asia - Main JavaScript
 * Core functionality for site interactions, navigation, and user experience
 */

(function() {
    'use strict';

    // ===== UTILITY FUNCTIONS =====
    
    /**
     * Debounce function for performance optimization
     */
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Check if element is in viewport (for lazy loading)
     */
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // ===== MOBILE NAVIGATION =====
    
    class MobileNavigation {
        constructor() {
            this.navToggle = document.getElementById('navToggle');
            this.navMenu = document.getElementById('navMenu');
            this.body = document.body;
            this.isOpen = false;
            
            this.init();
        }

        init() {
            if (this.navToggle && this.navMenu) {
                this.navToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.toggle();
                });

                // Close menu when clicking on nav links
                const navLinks = this.navMenu.querySelectorAll('.nav-link');
                navLinks.forEach(link => {
                    link.addEventListener('click', () => {
                        if (this.isOpen) {
                            this.close();
                        }
                    });
                });

                // Close menu when clicking outside
                document.addEventListener('click', (e) => {
                    if (this.isOpen && !this.navMenu.contains(e.target) && !this.navToggle.contains(e.target)) {
                        this.close();
                    }
                });

                // Handle keyboard navigation
                this.navToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggle();
                    }
                });

                // Close menu on escape key
                document.addEventListener('keydown', (e) => {
                    if (e.key === 'Escape' && this.isOpen) {
                        this.close();
                    }
                });
            }
        }

        toggle() {
            if (this.isOpen) {
                this.close();
            } else {
                this.open();
            }
        }

        open() {
            this.navMenu.classList.add('nav-menu--open');
            this.navToggle.classList.add('nav-toggle--open');
            this.body.classList.add('nav-open');
            this.isOpen = true;
            
            // Set focus to first nav link for accessibility
            const firstLink = this.navMenu.querySelector('.nav-link');
            if (firstLink) {
                firstLink.focus();
            }
            
            // Update aria attributes
            this.navToggle.setAttribute('aria-expanded', 'true');
            this.navMenu.setAttribute('aria-hidden', 'false');
        }

        close() {
            this.navMenu.classList.remove('nav-menu--open');
            this.navToggle.classList.remove('nav-toggle--open');
            this.body.classList.remove('nav-open');
            this.isOpen = false;
            
            // Update aria attributes
            this.navToggle.setAttribute('aria-expanded', 'false');
            this.navMenu.setAttribute('aria-hidden', 'true');
        }
    }

    // ===== HEAT EMERGENCY RIBBON =====
    
    class HeatEmergencyRibbon {
        constructor() {
            this.ribbon = document.getElementById('heatRibbon');
            this.closeButton = this.ribbon?.querySelector('.ribbon-close');
            this.storageKey = 'beattheheat_ribbon_dismissed';
            
            this.init();
        }

        init() {
            if (!this.ribbon) return;

            // Check if ribbon was previously dismissed
            if (this.isDismissed()) {
                this.hide();
                return;
            }

            // Add close functionality
            if (this.closeButton) {
                this.closeButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.dismiss();
                });

                // Keyboard support
                this.closeButton.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.dismiss();
                    }
                });
            }

            // Auto-dismiss after 30 seconds if not interacted with
            setTimeout(() => {
                if (!this.isDismissed()) {
                    this.ribbon.style.opacity = '0.8';
                }
            }, 30000);
        }

        dismiss() {
            this.hide();
            this.setDismissed();
        }

        hide() {
            if (this.ribbon) {
                this.ribbon.style.transform = 'translateY(-100%)';
                this.ribbon.style.opacity = '0';
                setTimeout(() => {
                    this.ribbon.style.display = 'none';
                }, 300);
            }
        }

        isDismissed() {
            try {
                return localStorage.getItem(this.storageKey) === 'true';
            } catch (e) {
                return false;
            }
        }

        setDismissed() {
            try {
                localStorage.setItem(this.storageKey, 'true');
            } catch (e) {
                // localStorage not available, that's okay
            }
        }
    }

    // Make closeRibbon globally available for onclick attributes
    window.closeRibbon = function() {
        const ribbon = document.getElementById('heatRibbon');
        if (ribbon) {
            ribbon.style.transform = 'translateY(-100%)';
            ribbon.style.opacity = '0';
            setTimeout(() => {
                ribbon.style.display = 'none';
            }, 300);
        }
    };

    // ===== SMOOTH SCROLLING =====
    
    class SmoothScrolling {
        constructor() {
            this.init();
        }

        init() {
            // Handle all anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            
            anchorLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    if (href === '#') return;
                    
                    const target = document.querySelector(href);
                    if (target) {
                        e.preventDefault();
                        this.scrollToTarget(target);
                    }
                });
            });
        }

        scrollToTarget(target) {
            const headerOffset = 100; // Account for sticky header
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });

            // Update focus for accessibility
            target.focus({ preventScroll: true });
        }
    }

    // ===== ACCESSIBILITY ENHANCEMENTS =====
    
    class AccessibilityEnhancements {
        constructor() {
            this.init();
        }

        init() {
            this.enhanceKeyboardNavigation();
            this.addSkipLinks();
            this.enhanceFocusManagement();
        }

        enhanceKeyboardNavigation() {
            // Add keyboard support to interactive elements
            const interactiveElements = document.querySelectorAll('.card, .funding-card, .story-card');
            
            interactiveElements.forEach(element => {
                // Make cards focusable
                if (!element.getAttribute('tabindex')) {
                    element.setAttribute('tabindex', '0');
                }

                // Add keyboard activation
                element.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        const link = element.querySelector('a');
                        if (link) {
                            e.preventDefault();
                            link.click();
                        }
                    }
                });
            });
        }

        addSkipLinks() {
            // Add skip to main content link
            const skipLink = document.createElement('a');
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.className = 'skip-link sr-only';
            skipLink.style.cssText = `
                position: absolute;
                top: -40px;
                left: 6px;
                background: var(--color-midnight-navy);
                color: white;
                padding: 8px;
                text-decoration: none;
                border-radius: 4px;
                z-index: 1000;
            `;

            // Show on focus
            skipLink.addEventListener('focus', () => {
                skipLink.style.top = '6px';
                skipLink.classList.remove('sr-only');
            });

            skipLink.addEventListener('blur', () => {
                skipLink.style.top = '-40px';
                skipLink.classList.add('sr-only');
            });

            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        enhanceFocusManagement() {
            // Add focus indicators for better accessibility
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                }
            });

            document.addEventListener('mousedown', () => {
                document.body.classList.remove('keyboard-navigation');
            });
        }
    }

    // ===== PERFORMANCE OPTIMIZATIONS =====
    
    class PerformanceOptimizations {
        constructor() {
            this.init();
        }

        init() {
            this.lazyLoadImages();
            this.optimizeScrollHandlers();
        }

        lazyLoadImages() {
            // Simple lazy loading for images
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => imageObserver.observe(img));
        }

        optimizeScrollHandlers() {
            // Throttled scroll handler for performance
            let ticking = false;

            function updateScrollPosition() {
                const scrolled = window.pageYOffset;
                const navbar = document.querySelector('.navbar');
                
                if (navbar) {
                    if (scrolled > 100) {
                        navbar.classList.add('navbar--scrolled');
                    } else {
                        navbar.classList.remove('navbar--scrolled');
                    }
                }
                
                ticking = false;
            }

            window.addEventListener('scroll', () => {
                if (!ticking) {
                    requestAnimationFrame(updateScrollPosition);
                    ticking = true;
                }
            });
        }
    }

    // ===== FORM ENHANCEMENTS =====
    
    class FormEnhancements {
        constructor() {
            this.init();
        }

        init() {
            const forms = document.querySelectorAll('form');
            forms.forEach(form => this.enhanceForm(form));
        }

        enhanceForm(form) {
            // Add validation feedback
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                input.addEventListener('blur', () => {
                    this.validateField(input);
                });

                input.addEventListener('input', debounce(() => {
                    this.clearValidationErrors(input);
                }, 300));
            });

            // Handle form submission
            form.addEventListener('submit', (e) => {
                if (!this.validateForm(form)) {
                    e.preventDefault();
                }
            });
        }

        validateField(field) {
            const isValid = field.checkValidity();
            const errorElement = field.parentNode.querySelector('.field-error');
            
            if (!isValid) {
                field.classList.add('field--error');
                if (errorElement) {
                    errorElement.textContent = field.validationMessage;
                    errorElement.style.display = 'block';
                }
            } else {
                field.classList.remove('field--error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
            
            return isValid;
        }

        validateForm(form) {
            const inputs = form.querySelectorAll('input, textarea, select');
            let isFormValid = true;
            
            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });
            
            return isFormValid;
        }

        clearValidationErrors(field) {
            field.classList.remove('field--error');
            const errorElement = field.parentNode.querySelector('.field-error');
            if (errorElement) {
                errorElement.style.display = 'none';
            }
        }
    }

    // ===== INITIALIZATION =====
    
    function initializeApp() {
        // Initialize all components when DOM is ready
        new MobileNavigation();
        new HeatEmergencyRibbon();
        new SmoothScrolling();
        new AccessibilityEnhancements();
        new PerformanceOptimizations();
        new FormEnhancements();

        // Add loaded class to body for CSS transitions
        document.body.classList.add('js-loaded');
        
        console.log('🌡️ BeatTheHeat.Asia initialized successfully');
    }

    // ===== EVENT LISTENERS =====
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
    } else {
        initializeApp();
    }

    // Handle window resize for responsive adjustments
    window.addEventListener('resize', debounce(() => {
        // Close mobile menu on resize to desktop
        if (window.innerWidth > 768) {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            
            if (navMenu && navMenu.classList.contains('nav-menu--open')) {
                navMenu.classList.remove('nav-menu--open');
                navToggle.classList.remove('nav-toggle--open');
                document.body.classList.remove('nav-open');
            }
        }
    }, 250));

    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            // Page is hidden - pause any animations or timers
            console.log('Page hidden - optimizing performance');
        } else {
            // Page is visible - resume normal operation
            console.log('Page visible - resuming normal operation');
        }
    });

})();
