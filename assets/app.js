// Karnataka Handloom Presentation JavaScript - Namma Hejjegalu

class PresentationController {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 15;
        this.slides = document.querySelectorAll('.slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.currentSlideSpan = document.getElementById('currentSlide');
        this.totalSlidesSpan = document.getElementById('totalSlides');
        
        this.init();
    }
    
    init() {
        // Ensure slides are properly indexed
        this.slides.forEach((slide, index) => {
            slide.setAttribute('data-slide-number', index + 1);
        });
        
        // Set up initial state
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Add event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
        
        // Add touch/swipe support for mobile
        this.addTouchSupport();
        
        // Ensure first slide is properly displayed
        this.showSlide(1, false); // false = no animation for initial load
        
        console.log('Namma Hejjegalu: Threads of Karnataka presentation initialized!');
    }
    
    showSlide(slideNumber, animate = true) {
        // Validate slide number
        if (slideNumber < 1 || slideNumber > this.totalSlides) {
            return;
        }
        
        const direction = slideNumber > this.currentSlide ? 'right' : 'left';
        const previousSlideNumber = this.currentSlide;
        
        // Update current slide number first
        this.currentSlide = slideNumber;
        
        // Remove all classes from all slides
        this.slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'slide-in-left', 'slide-in-right');
            
            const slideNum = index + 1;
            
            if (slideNum === slideNumber) {
                // This is the active slide
                slide.classList.add('active');
                
                // Add animation class if needed
                if (animate) {
                    if (direction === 'right') {
                        slide.classList.add('slide-in-right');
                    } else if (direction === 'left') {
                        slide.classList.add('slide-in-left');
                    }
                }
            } else if (slideNum < slideNumber) {
                // Previous slides
                slide.classList.add('prev');
            }
        });
        
        this.updateSlideCounter();
        this.updateNavigationButtons();
        
        // Add slide-specific enhancements
        if (animate) {
            this.addSlideEnhancements(slideNumber);
        }
        
        // Remove animation classes after animation completes
        if (animate) {
            setTimeout(() => {
                this.slides.forEach(slide => {
                    slide.classList.remove('slide-in-left', 'slide-in-right');
                });
            }, 600);
        }
        
        // Update additional indicators
        this.updateIndicators(slideNumber);
        this.updateProgressBar(slideNumber);
        
        // Log slide change for debugging
        console.log(`Navigated to slide ${slideNumber}: ${this.getSlideTitle(slideNumber)}`);
    }
    
    getSlideTitle(slideNumber) {
        const slideTitles = [
            'Title Slide',
            'Mission Statement', 
            'Campaign Objectives',
            'Core Themes',
            'Brand Positioning & Storytelling',
            'Design × Fashion Collaborations',
            'Digital First Discovery',
            'Culture × Fashion × Public Space',
            'Education & Youth Engagement',
            'Livelihood & Community Empowerment',
            'Campaign Timeline',
            'Strategic Partnerships',
            'Success Metrics',
            'Packaging & Branding Experience',
            'Content Ideas Summary'
        ];
        return slideTitles[slideNumber - 1] || `Slide ${slideNumber}`;
    }
    
    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.showSlide(this.currentSlide + 1);
        } else {
            // Optional: Loop back to first slide
            // this.showSlide(1);
        }
    }
    
    previousSlide() {
        if (this.currentSlide > 1) {
            this.showSlide(this.currentSlide - 1);
        } else {
            // Optional: Loop to last slide
            // this.showSlide(this.totalSlides);
        }
    }
    
    updateSlideCounter() {
        if (this.currentSlideSpan && this.totalSlidesSpan) {
            this.currentSlideSpan.textContent = this.currentSlide;
            this.totalSlidesSpan.textContent = this.totalSlides;
        }
    }
    
    updateNavigationButtons() {
        if (this.prevBtn && this.nextBtn) {
            // Update previous button
            this.prevBtn.disabled = this.currentSlide === 1;
            this.prevBtn.style.opacity = this.currentSlide === 1 ? '0.5' : '1';
            
            // Update next button
            this.nextBtn.disabled = this.currentSlide === this.totalSlides;
            this.nextBtn.style.opacity = this.currentSlide === this.totalSlides ? '0.5' : '1';
            
            // Update button text for context
            if (this.currentSlide === 1) {
                this.nextBtn.innerHTML = 'Start Presentation ❯';
            } else if (this.currentSlide === this.totalSlides) {
                this.prevBtn.innerHTML = '❮ Back to Content';
            } else {
                this.prevBtn.innerHTML = '❮ Previous';
                this.nextBtn.innerHTML = 'Next ❯';
            }
        }
    }
    
    handleKeyboard(event) {
        // Don't interfere if user is typing in an input field
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(event.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
            case 'PageDown':
                event.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
            case 'PageUp':
                event.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.showSlide(1);
                break;
            case 'End':
                event.preventDefault();
                this.showSlide(this.totalSlides);
                break;
            case 'Escape':
                // Exit fullscreen if in fullscreen mode
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                }
                break;
            case 'f':
            case 'F':
                // Toggle fullscreen
                event.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }
    
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Could not enter fullscreen:', err);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    addTouchSupport() {
        let startX = 0;
        let startY = 0;
        let endX = 0;
        let endY = 0;
        const minSwipeDistance = 50;
        
        document.addEventListener('touchstart', (e) => {
            startX = e.changedTouches[0].screenX;
            startY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        document.addEventListener('touchend', (e) => {
            endX = e.changedTouches[0].screenX;
            endY = e.changedTouches[0].screenY;
            this.handleSwipe();
        }, { passive: true });
        
        const handleSwipe = () => {
            const swipeDistanceX = Math.abs(endX - startX);
            const swipeDistanceY = Math.abs(endY - startY);
            
            // Only handle horizontal swipes (ignore vertical scrolling)
            if (swipeDistanceX > minSwipeDistance && swipeDistanceX > swipeDistanceY) {
                if (endX < startX) {
                    // Swipe left - next slide
                    this.nextSlide();
                } else if (endX > startX) {
                    // Swipe right - previous slide
                    this.previousSlide();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }
    
    // Method to jump to a specific slide
    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.showSlide(slideNumber);
            return true;
        }
        return false;
    }
    
    addSlideEnhancements(slideNumber) {
        // Add slide-specific animations with a small delay
        setTimeout(() => {
            const currentSlideElement = document.getElementById(`slide${slideNumber}`);
            if (!currentSlideElement) return;
            
            // Add staggered animations for various elements
            const animatableItems = currentSlideElement.querySelectorAll(
                '.pillar-list li, .objective-item, .theme-item, .initiative-item, ' +
                '.partnership-category, .timeline-item, .metric-item, .branding-element, ' +
                '.content-format'
            );
            
            animatableItems.forEach((item, index) => {
                item.style.opacity = '0';
                item.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    item.style.transition = 'all 0.5s ease';
                    item.style.opacity = '1';
                    item.style.transform = 'translateY(0)';
                }, index * 100 + 300); // Start after slide transition
            });
            
            // Special animations for images
            const images = currentSlideElement.querySelectorAll('img');
            images.forEach((img, index) => {
                img.style.opacity = '0';
                img.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    img.style.transition = 'all 0.6s ease';
                    img.style.opacity = '1';
                    img.style.transform = 'scale(1)';
                }, 500 + index * 200);
            });
            
        }, 100);
    }
    
    updateIndicators(slideNumber) {
        const indicators = document.querySelectorAll('.slide-indicator');
        indicators.forEach((indicator, index) => {
            if (index + 1 === slideNumber) {
                indicator.style.background = '#8B0000';
                indicator.style.transform = 'scale(1.2)';
            } else {
                indicator.style.background = 'rgba(255,255,255,0.3)';
                indicator.style.transform = 'scale(1)';
            }
        });
    }
    
    updateProgressBar(slideNumber) {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            const progress = (slideNumber / this.totalSlides) * 100;
            progressBar.style.width = `${progress}%`;
        }
    }
    
    // Auto-advance functionality (optional)
    startAutoAdvance(intervalMs = 10000) {
        this.autoAdvanceInterval = setInterval(() => {
            if (this.currentSlide < this.totalSlides) {
                this.nextSlide();
            } else {
                this.stopAutoAdvance();
            }
        }, intervalMs);
        
        console.log(`Auto-advance started (${intervalMs/1000}s intervals)`);
    }
    
    stopAutoAdvance() {
        if (this.autoAdvanceInterval) {
            clearInterval(this.autoAdvanceInterval);
            this.autoAdvanceInterval = null;
            console.log('Auto-advance stopped');
        }
    }
    
    // Get presentation statistics
    getStats() {
        return {
            currentSlide: this.currentSlide,
            totalSlides: this.totalSlides,
            progress: Math.round((this.currentSlide / this.totalSlides) * 100),
            currentSlideTitle: this.getSlideTitle(this.currentSlide)
        };
    }
}

// Function to add slide indicators (dots)
function addSlideIndicators() {
    const navigation = document.querySelector('.navigation');
    if (!navigation) return;
    
    const indicatorsContainer = document.createElement('div');
    indicatorsContainer.className = 'slide-indicators';
    
    for (let i = 1; i <= 15; i++) {
        const indicator = document.createElement('button');
        indicator.className = 'slide-indicator';
        indicator.setAttribute('data-slide', i);
        indicator.setAttribute('title', `Go to slide ${i}`);
        
        if (i === 1) {
            indicator.style.background = '#8B0000';
            indicator.style.transform = 'scale(1.2)';
        }
        
        indicator.addEventListener('click', () => {
            if (window.presentation) {
                window.presentation.goToSlide(i);
            }
        });
        
        indicatorsContainer.appendChild(indicator);
    }
    
    // Insert indicators between counter and next button
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        navigation.insertBefore(indicatorsContainer, nextBtn);
    }
}

// Function to add progress bar
function addProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.id = 'progress-bar';
    progressBar.style.width = '6.67%'; // 1/15 for first slide
    
    document.body.appendChild(progressBar);
}

// Function to add keyboard shortcuts help
function addKeyboardShortcuts() {
    const shortcuts = {
        'Arrow Keys': 'Navigate slides',
        'Space': 'Next slide',
        'Home/End': 'First/Last slide',
        'F': 'Toggle fullscreen',
        'Esc': 'Exit fullscreen'
    };
    
    // Create help overlay (hidden by default)
    const helpOverlay = document.createElement('div');
    helpOverlay.id = 'keyboard-help';
    helpOverlay.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: rgba(0,0,0,0.9);
        color: white;
        padding: 24px;
        border-radius: 12px;
        z-index: 2000;
        display: none;
        font-size: 14px;
        line-height: 1.6;
    `;
    
    let helpContent = '<h3 style="margin-top:0; color: #8B0000;">Keyboard Shortcuts</h3>';
    for (const [key, description] of Object.entries(shortcuts)) {
        helpContent += `<div><strong>${key}:</strong> ${description}</div>`;
    }
    helpContent += '<div style="margin-top:16px; font-size:12px; opacity:0.7;">Press H to toggle this help</div>';
    
    helpOverlay.innerHTML = helpContent;
    document.body.appendChild(helpOverlay);
    
    // Toggle help with H key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'h' || e.key === 'H') {
            e.preventDefault();
            const isVisible = helpOverlay.style.display === 'block';
            helpOverlay.style.display = isVisible ? 'none' : 'block';
        }
    });
    
    // Close help when clicking outside
    helpOverlay.addEventListener('click', (e) => {
        if (e.target === helpOverlay) {
            helpOverlay.style.display = 'none';
        }
    });
}

// Initialize the presentation when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Small delay to ensure all elements are rendered
    setTimeout(() => {
        // Create presentation controller instance
        window.presentation = new PresentationController();
        
        // Add enhanced features
        addProgressBar();
        addSlideIndicators();
        addKeyboardShortcuts();
        
        // Debug info and API
        console.log('🧵 Namma Hejjegalu: Threads of Karnataka - Presentation Ready! 🧵');
        console.log(`📊 Total slides: ${window.presentation.totalSlides}`);
        console.log(`📍 Current slide: ${window.presentation.currentSlide}`);
        console.log('');
        console.log('🎮 Available Commands:');
        console.log('- presentation.goToSlide(n) - Jump to slide n');
        console.log('- presentation.getStats() - Get presentation statistics');
        console.log('- presentation.startAutoAdvance(ms) - Start auto-advance');
        console.log('- presentation.stopAutoAdvance() - Stop auto-advance');
        console.log('- Press H for keyboard shortcuts');
        console.log('');
        
        // Verify slides are properly set up
        const slides = document.querySelectorAll('.slide');
        console.log(`✅ Found ${slides.length} slides in DOM`);
        
        // Check for any slide ID mismatches
        let slidesValid = true;
        slides.forEach((slide, index) => {
            const slideId = slide.id;
            const expectedId = `slide${index + 1}`;
            if (slideId !== expectedId) {
                console.warn(`⚠️ Slide ${index + 1} has ID "${slideId}", expected "${expectedId}"`);
                slidesValid = false;
            }
        });
        
        if (slidesValid) {
            console.log('✅ All slides properly configured');
        }
        
        // Add global presentation API
        window.nammaHejjegalu = {
            presentation: window.presentation,
            goToSlide: (n) => window.presentation.goToSlide(n),
            next: () => window.presentation.nextSlide(),
            prev: () => window.presentation.previousSlide(),
            stats: () => window.presentation.getStats(),
            autoStart: (ms) => window.presentation.startAutoAdvance(ms),
            autoStop: () => window.presentation.stopAutoAdvance()
        };
        
    }, 100);
    
    // Add click-to-advance functionality on slide content
    document.addEventListener('click', (e) => {
        // Only advance if clicking on slide content, not navigation elements
        if (!e.target.closest('.navigation') && 
            !e.target.closest('.nav-btn') && 
            !e.target.closest('.slide-indicator') &&
            !e.target.matches('img') && // Don't advance when clicking images
            !e.target.closest('#keyboard-help') &&
            window.presentation) {
            
            const clickX = e.clientX;
            const windowWidth = window.innerWidth;
            
            // Click on right 2/3 advances, left 1/3 goes back
            if (clickX > windowWidth / 3) {
                window.presentation.nextSlide();
            } else {
                window.presentation.previousSlide();
            }
        }
    });
    
    // Prevent context menu on presentation slides
    document.addEventListener('contextmenu', (e) => {
        if (e.target.closest('.slide')) {
            e.preventDefault();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
        // Ensure presentation remains properly sized
        const presentation = document.querySelector('.presentation-container');
        if (presentation) {
            presentation.style.height = window.innerHeight + 'px';
        }
    });
    
    // Handle visibility change (when tab becomes active/inactive)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && window.presentation) {
            window.presentation.stopAutoAdvance();
        }
    });
});

// Prevent accidental page navigation
window.addEventListener('beforeunload', (e) => {
    if (window.presentation && window.presentation.currentSlide > 1) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave the presentation?';
    }
});

// Export for debugging and external use
if (typeof window !== 'undefined') {
    window.PresentationController = PresentationController;
}