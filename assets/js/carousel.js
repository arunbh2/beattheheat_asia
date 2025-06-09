/**
 * BeatTheHeat.Asia - Carousel Component
 * Accessible, touch-friendly carousel for showcasing content
 * Supports images, cards, testimonials, and partner logos
 */

class BeatTheHeatCarousel {
    constructor(element, options = {}) {
        this.carousel = element;
        this.options = {
            // Default configuration
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 5000,
            infinite: true,
            dots: true,
            arrows: true,
            fade: false,
            speed: 300,
            pauseOnHover: true,
            pauseOnFocus: true,
            accessibility: true,
            swipe: true,
            touchThreshold: 50,
            responsive: [
                {
                    breakpoint: 768,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: true,
                        arrows: false
                    }
                }
            ],
            ...options
        };
        
        this.currentSlide = 0;
        this.slides = [];
        this.slideWidth = 0;
        this.isAnimating = false;
        this.autoplayTimer = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isTouch = false;
        
        this.init();
    }

    init() {
        if (!this.carousel) {
            console.warn('Carousel element not found');
            return;
        }

        this.setupStructure();
        this.createSlides();
        this.createControls();
        this.bindEvents();
        this.updateCarousel();
        
        if (this.options.autoplay) {
            this.startAutoplay();
        }

        // Add loaded class for CSS animations
        this.carousel.classList.add('carousel--loaded');
        
        console.log('🎠 Carousel initialized with', this.slides.length, 'slides');
    }

    setupStructure() {
        // Ensure proper carousel structure
        this.carousel.classList.add('beat-carousel');
        
        // Find or create track
        this.track = this.carousel.querySelector('.carousel-track');
        if (!this.track) {
            this.track = document.createElement('div');
            this.track.className = 'carousel-track';
            
            // Move all children to track
            while (this.carousel.firstChild) {
                this.track.appendChild(this.carousel.firstChild);
            }
            
            this.carousel.appendChild(this.track);
        }

        // Create viewport wrapper
        this.viewport = document.createElement('div');
        this.viewport.className = 'carousel-viewport';
        this.carousel.insertBefore(this.viewport, this.track);
        this.viewport.appendChild(this.track);

        // Set ARIA attributes
        this.carousel.setAttribute('role', 'region');
        this.carousel.setAttribute('aria-label', 'Content carousel');
        this.track.setAttribute('role', 'group');
        this.track.setAttribute('aria-live', 'polite');
    }

    createSlides() {
        const slideElements = this.track.children;
        this.slides = Array.from(slideElements).map((slide, index) => {
            slide.classList.add('carousel-slide');
            slide.setAttribute('role', 'group');
            slide.setAttribute('aria-roledescription', 'slide');
            slide.setAttribute('aria-label', `${index + 1} of ${slideElements.length}`);
            slide.setAttribute('data-slide-index', index);
            
            return {
                element: slide,
                index: index
            };
        });

        // Clone slides for infinite loop if needed
        if (this.options.infinite && this.slides.length > 1) {
            this.createClones();
        }
    }

    createClones() {
        const slidesToClone = this.getCurrentSlidesToShow();
        
        // Clone first slides and append to end
        for (let i = 0; i < slidesToClone; i++) {
            const clone = this.slides[i].element.cloneNode(true);
            clone.classList.add('carousel-slide--clone');
            clone.setAttribute('aria-hidden', 'true');
            this.track.appendChild(clone);
        }
        
        // Clone last slides and prepend to beginning
        for (let i = this.slides.length - slidesToClone; i < this.slides.length; i++) {
            const clone = this.slides[i].element.cloneNode(true);
            clone.classList.add('carousel-slide--clone');
            clone.setAttribute('aria-hidden', 'true');
            this.track.insertBefore(clone, this.track.firstChild);
        }
        
        // Update current slide position to account for prepended clones
        this.currentSlide = slidesToClone;
    }

    createControls() {
        // Create arrow controls
        if (this.options.arrows) {
            this.createArrows();
        }
        
        // Create dot indicators
        if (this.options.dots) {
            this.createDots();
        }
        
        // Create play/pause button for autoplay
        if (this.options.autoplay) {
            this.createPlayPause();
        }
    }

    createArrows() {
        this.prevButton = document.createElement('button');
        this.prevButton.className = 'carousel-arrow carousel-arrow--prev';
        this.prevButton.setAttribute('aria-label', 'Previous slide');
        this.prevButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        this.nextButton = document.createElement('button');
        this.nextButton.className = 'carousel-arrow carousel-arrow--next';
        this.nextButton.setAttribute('aria-label', 'Next slide');
        this.nextButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
        `;
        
        this.carousel.appendChild(this.prevButton);
        this.carousel.appendChild(this.nextButton);
    }

    createDots() {
        this.dotsContainer = document.createElement('div');
        this.dotsContainer.className = 'carousel-dots';
        this.dotsContainer.setAttribute('role', 'tablist');
        this.dotsContainer.setAttribute('aria-label', 'Slide selection');
        
        const totalDots = Math.ceil(this.slides.length / this.getCurrentSlidesToShow());
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            dot.setAttribute('role', 'tab');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.setAttribute('data-slide', i * this.getCurrentSlidesToShow());
            
            if (i === 0) {
                dot.classList.add('carousel-dot--active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.setAttribute('aria-selected', 'false');
            }
            
            this.dotsContainer.appendChild(dot);
        }
        
        this.carousel.appendChild(this.dotsContainer);
    }

    createPlayPause() {
        this.playPauseButton = document.createElement('button');
        this.playPauseButton.className = 'carousel-play-pause';
        this.playPauseButton.setAttribute('aria-label', 'Pause autoplay');
        this.playPauseButton.innerHTML = `
            <svg class="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 5V19L19 12L8 5Z" stroke="currentColor" stroke-width="2"/>
            </svg>
            <svg class="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M6 4H10V20H6V4ZM14 4H18V20H14V4Z" stroke="currentColor" stroke-width="2"/>
            </svg>
        `;
        
        this.carousel.appendChild(this.playPauseButton);
        this.updatePlayPauseButton();
    }

    bindEvents() {
        // Arrow button events
        if (this.prevButton) {
            this.prevButton.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextButton) {
            this.nextButton.addEventListener('click', () => this.nextSlide());
        }
        
        // Dot navigation events
        if (this.dotsContainer) {
            this.dotsContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('carousel-dot')) {
                    const slideIndex = parseInt(e.target.getAttribute('data-slide'));
                    this.goToSlide(slideIndex);
                }
            });
        }
        
        // Play/pause button events
        if (this.playPauseButton) {
            this.playPauseButton.addEventListener('click', () => this.toggleAutoplay());
        }
        
        // Keyboard navigation
        if (this.options.accessibility) {
            this.carousel.addEventListener('keydown', (e) => this.handleKeydown(e));
        }
        
        // Touch/swipe events
        if (this.options.swipe) {
            this.bindTouchEvents();
        }
        
        // Pause on hover/focus
        if (this.options.pauseOnHover || this.options.pauseOnFocus) {
            this.bindPauseEvents();
        }
        
        // Window resize
        window.addEventListener('resize', () => this.handleResize());
        
        // Intersection Observer for performance
        this.bindIntersectionObserver();
    }

    bindTouchEvents() {
        this.track.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isTouch = true;
            this.stopAutoplay();
        }, { passive: true });
        
        this.track.addEventListener('touchmove', (e) => {
            if (!this.isTouch) return;
            this.touchEndX = e.touches[0].clientX;
        }, { passive: true });
        
        this.track.addEventListener('touchend', () => {
            if (!this.isTouch) return;
            
            const touchDiff = this.touchStartX - this.touchEndX;
            
            if (Math.abs(touchDiff) > this.options.touchThreshold) {
                if (touchDiff > 0) {
                    this.nextSlide();
                } else {
                    this.prevSlide();
                }
            }
            
            this.isTouch = false;
            if (this.options.autoplay) {
                this.startAutoplay();
            }
        }, { passive: true });
    }

    bindPauseEvents() {
        if (this.options.pauseOnHover) {
            this.carousel.addEventListener('mouseenter', () => this.stopAutoplay());
            this.carousel.addEventListener('mouseleave', () => {
                if (this.options.autoplay) this.startAutoplay();
            });
        }
        
        if (this.options.pauseOnFocus) {
            this.carousel.addEventListener('focusin', () => this.stopAutoplay());
            this.carousel.addEventListener('focusout', () => {
                if (this.options.autoplay) this.startAutoplay();
            });
        }
    }

    bindIntersectionObserver() {
        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        if (this.options.autoplay) this.startAutoplay();
                    } else {
                        this.stopAutoplay();
                    }
                });
            }, { threshold: 0.5 });
            
            this.observer.observe(this.carousel);
        }
    }

    handleKeydown(e) {
        switch (e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                this.prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.slides.length - 1);
                break;
            case ' ':
                e.preventDefault();
                this.toggleAutoplay();
                break;
        }
    }

    handleResize() {
        clearTimeout(this.resizeTimer);
        this.resizeTimer = setTimeout(() => {
            this.updateCarousel();
        }, 250);
    }

    getCurrentSlidesToShow() {
        const windowWidth = window.innerWidth;
        
        if (this.options.responsive) {
            for (let breakpoint of this.options.responsive) {
                if (windowWidth <= breakpoint.breakpoint) {
                    return breakpoint.settings.slidesToShow || this.options.slidesToShow;
                }
            }
        }
        
        return this.options.slidesToShow;
    }

    updateCarousel() {
        const slidesToShow = this.getCurrentSlidesToShow();
        this.slideWidth = 100 / slidesToShow;
        
        // Update slide widths
        const allSlides = this.track.querySelectorAll('.carousel-slide');
        allSlides.forEach(slide => {
            slide.style.width = `${this.slideWidth}%`;
        });
        
        // Update track position
        this.updateTrackPosition();
        this.updateAriaAttributes();
        this.updateDots();
    }

    updateTrackPosition() {
        const translateX = -this.currentSlide * this.slideWidth;
        
        if (this.options.fade && this.getCurrentSlidesToShow() === 1) {
            // Fade transition
            this.track.style.transform = 'translateX(0)';
            this.slides.forEach((slide, index) => {
                slide.element.style.opacity = index === this.currentSlide ? '1' : '0';
            });
        } else {
            // Slide transition
            this.track.style.transform = `translateX(${translateX}%)`;
            this.slides.forEach(slide => {
                slide.element.style.opacity = '1';
            });
        }
    }

    updateAriaAttributes() {
        // Update slide visibility for screen readers
        const slidesToShow = this.getCurrentSlidesToShow();
        
        this.slides.forEach((slide, index) => {
            const isVisible = index >= this.currentSlide && index < this.currentSlide + slidesToShow;
            slide.element.setAttribute('aria-hidden', !isVisible);
        });
    }

    updateDots() {
        if (!this.dotsContainer) return;
        
        const dots = this.dotsContainer.querySelectorAll('.carousel-dot');
        const activeIndex = Math.floor(this.currentSlide / this.getCurrentSlidesToShow());
        
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('carousel-dot--active');
                dot.setAttribute('aria-selected', 'true');
            } else {
                dot.classList.remove('carousel-dot--active');
                dot.setAttribute('aria-selected', 'false');
            }
        });
    }

    nextSlide() {
        if (this.isAnimating) return;
        
        const maxSlide = this.options.infinite ? this.slides.length : this.slides.length - this.getCurrentSlidesToShow();
        
        if (this.currentSlide >= maxSlide) {
            if (this.options.infinite) {
                this.currentSlide = 0;
            } else {
                return;
            }
        } else {
            this.currentSlide += this.options.slidesToScroll;
        }
        
        this.animateSlide();
    }

    prevSlide() {
        if (this.isAnimating) return;
        
        if (this.currentSlide <= 0) {
            if (this.options.infinite) {
                this.currentSlide = this.slides.length - this.getCurrentSlidesToShow();
            } else {
                return;
            }
        } else {
            this.currentSlide -= this.options.slidesToScroll;
        }
        
        this.animateSlide();
    }

    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        
        this.currentSlide = Math.max(0, Math.min(index, this.slides.length - 1));
        this.animateSlide();
    }

    animateSlide() {
        this.isAnimating = true;
        
        this.updateTrackPosition();
        this.updateAriaAttributes();
        this.updateDots();
        
        // Announce slide change to screen readers
        if (this.options.accessibility) {
            const announcement = `Slide ${this.currentSlide + 1} of ${this.slides.length}`;
            this.announceToScreenReader(announcement);
        }
        
        setTimeout(() => {
            this.isAnimating = false;
        }, this.options.speed);
    }

    startAutoplay() {
        if (!this.options.autoplay) return;
        
        this.stopAutoplay();
        this.autoplayTimer = setInterval(() => {
            this.nextSlide();
        }, this.options.autoplaySpeed);
        
        this.updatePlayPauseButton();
    }

    stopAutoplay() {
        if (this.autoplayTimer) {
            clearInterval(this.autoplayTimer);
            this.autoplayTimer = null;
        }
        
        this.updatePlayPauseButton();
    }

    toggleAutoplay() {
        if (this.autoplayTimer) {
            this.stopAutoplay();
        } else {
            this.startAutoplay();
        }
    }

    updatePlayPauseButton() {
        if (!this.playPauseButton) return;
        
        if (this.autoplayTimer) {
            this.playPauseButton.classList.add('carousel-play-pause--playing');
            this.playPauseButton.setAttribute('aria-label', 'Pause autoplay');
        } else {
            this.playPauseButton.classList.remove('carousel-play-pause--playing');
            this.playPauseButton.setAttribute('aria-label', 'Start autoplay');
        }
    }

    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    destroy() {
        // Clean up event listeners and timers
        this.stopAutoplay();
        
        if (this.observer) {
            this.observer.disconnect();
        }
        
        window.removeEventListener('resize', this.handleResize);
        
        // Remove created elements
        if (this.prevButton) this.prevButton.remove();
        if (this.nextButton) this.nextButton.remove();
        if (this.dotsContainer) this.dotsContainer.remove();
        if (this.playPauseButton) this.playPauseButton.remove();
        
        console.log('🗑️ Carousel destroyed');
    }
}

// Auto-initialize carousels with data attributes
document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('[data-carousel]');
    
    carousels.forEach(carousel => {
        // Parse options from data attributes
        const options = {};
        
        if (carousel.dataset.slidesToShow) {
            options.slidesToShow = parseInt(carousel.dataset.slidesToShow);
        }
        
        if (carousel.dataset.autoplay === 'true') {
            options.autoplay = true;
        }
        
        if (carousel.dataset.autoplaySpeed) {
            options.autoplaySpeed = parseInt(carousel.dataset.autoplaySpeed);
        }
        
        if (carousel.dataset.infinite === 'false') {
            options.infinite = false;
        }
        
        if (carousel.dataset.fade === 'true') {
            options.fade = true;
        }
        
        if (carousel.dataset.dots === 'false') {
            options.dots = false;
        }
        
        if (carousel.dataset.arrows === 'false') {
            options.arrows = false;
        }
        
        // Initialize carousel
        new BeatTheHeatCarousel(carousel, options);
    });
});

// Export for manual initialization
window.BeatTheHeatCarousel = BeatTheHeatCarousel;
