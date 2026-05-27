document.addEventListener('DOMContentLoaded', () => {
    const slidesContainer = document.querySelector('.slides-container');
    const slides = document.querySelectorAll('.slide');

    const navDots = document.querySelectorAll('.nav-dot');
    const laserCursor = document.getElementById('laser-cursor');



    // --- STRICT NAVIGATION LOGIC ---
    let currentSlideIndex = 0;
    let isScrolling = false;
    const SCROLL_COOLDOWN = 500; // ms
    const SCROLL_ANIMATION_DURATION = 250; // ms - 調整這個改速度 (數值越大越慢)

    // Custom Smooth Scroll Function
    function smoothScrollTo(element, target, duration) {
        const start = element.scrollTop;
        const change = target - start;
        const startTime = performance.now();

        function animateScroll(currentTime) {
            const timeElapsed = currentTime - startTime;
            if (timeElapsed < duration) {
                // Ease In Out Quad
                let t = timeElapsed / (duration / 2);
                let val;
                if (t < 1) {
                    val = change / 2 * t * t + start;
                } else {
                    t--;
                    val = -change / 2 * (t * (t - 2) - 1) + start;
                }
                element.scrollTop = val;
                requestAnimationFrame(animateScroll);
            } else {
                element.scrollTop = target;
            }
        }
        requestAnimationFrame(animateScroll);
    }

    // Centralized Navigation Function
    function goToSlide(index) {
        if (index < 0 || index >= slides.length) return;

        currentSlideIndex = index;

        // Use custom smooth scroll
        smoothScrollTo(slidesContainer, slides[index].offsetTop, SCROLL_ANIMATION_DURATION);

        // Update dots
        navDots.forEach(dot => dot.classList.remove('active'));
        if (navDots[index]) {
            navDots[index].classList.add('active');
        }
    }

    // Initialize first slide active state
    goToSlide(0);

    // Navigation Dots Click
    navDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });

    // Mouse Wheel Navigation (Throttled)
    slidesContainer.addEventListener('wheel', (e) => {
        e.preventDefault(); // Prevent default scroll

        if (isScrolling) return;

        if (e.deltaY > 0) {
            // Scroll Down
            if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
                activateCooldown();
            }
        } else {
            // Scroll Up
            if (currentSlideIndex > 0) {
                goToSlide(currentSlideIndex - 1);
                activateCooldown();
            }
        }
    }, { passive: false });

    function activateCooldown() {
        isScrolling = true;
        setTimeout(() => {
            isScrolling = false;
        }, SCROLL_COOLDOWN);
    }

    // Keyboard Navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentSlideIndex < slides.length - 1) {
                goToSlide(currentSlideIndex + 1);
            }
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentSlideIndex > 0) {
                goToSlide(currentSlideIndex - 1);
            }
        }
    });

    // --- LASER POINTER LOGIC ---
    let mouseX = 0;
    let mouseY = 0;
    let laserX = 0;
    let laserY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Trail Effect
    const trails = [];
    const MAX_TRAILS = 10;

    function animateLaser() {
        // Smooth follow - Increased speed (0.2 -> 0.8) for less lag
        laserX += (mouseX - laserX) * 0.8;
        laserY += (mouseY - laserY) * 0.8;

        if (laserCursor) {
            laserCursor.style.left = `${laserX}px`;
            laserCursor.style.top = `${laserY}px`;
        }

        // Create trail
        const trail = document.createElement('div');
        trail.classList.add('laser-trail');
        trail.style.left = `${laserX}px`;
        trail.style.top = `${laserY}px`;
        document.body.appendChild(trail);
        trails.push(trail);

        if (trails.length > MAX_TRAILS) {
            const oldTrail = trails.shift();
            oldTrail.remove();
        }

        // Fade out trails
        trails.forEach((t, i) => {
            t.style.opacity = (i / trails.length) * 0.5; // Lower opacity for trail
            t.style.transform = `translate(-50%, -50%) scale(${i / trails.length})`;
        });

        requestAnimationFrame(animateLaser);
    }

    // --- IMAGE ZOOM LOGIC (PIXEL-PERFECT) ---
    const slideImages = document.querySelectorAll('.slide-image');

    slideImages.forEach(img => {
        img.addEventListener('click', (e) => {
            e.stopPropagation();

            // 1. Create Backdrop
            const backdrop = document.createElement('div');
            backdrop.classList.add('zoom-backdrop');
            document.body.appendChild(backdrop);

            // Force reflow for backdrop transition
            backdrop.offsetHeight;
            backdrop.style.opacity = '1';

            // 2. Create Clone
            const clone = img.cloneNode();
            clone.classList.add('zoom-overlay');

            // 3. Get Original Position & Dimensions
            const rect = img.getBoundingClientRect();

            // 4. Set Initial Position (Fixed over original)
            clone.style.top = `${rect.top}px`;
            clone.style.left = `${rect.left}px`;
            clone.style.width = `${rect.width}px`;
            clone.style.height = `${rect.height}px`;
            // Keep initial padding/border to match original

            document.body.appendChild(clone);

            // 5. Force Reflow
            clone.offsetHeight;

            // 6. Calculate Target Dimensions (Max 80vw/80vh, preserve aspect ratio)
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const maxWidth = viewportWidth * 0.95;
            const maxHeight = viewportHeight * 0.95;

            const aspectRatio = img.naturalWidth / img.naturalHeight;

            let targetWidth = maxWidth;
            let targetHeight = targetWidth / aspectRatio;

            if (targetHeight > maxHeight) {
                targetHeight = maxHeight;
                targetWidth = targetHeight * aspectRatio;
            }

            // 7. Calculate Center Position
            const targetTop = (viewportHeight - targetHeight) / 2;
            const targetLeft = (viewportWidth - targetWidth) / 2;

            // 8. Animate to Target
            clone.style.top = `${targetTop}px`;
            clone.style.left = `${targetLeft}px`;
            clone.style.width = `${targetWidth}px`;
            clone.style.height = `${targetHeight}px`;

            // Remove padding/border for pure image look (fixes aspect ratio mismatch)
            clone.style.padding = '0';
            clone.style.border = 'none';
            clone.style.borderRadius = '4px'; // Slight radius looks nice
            clone.style.maxWidth = 'none';
            clone.style.maxHeight = 'none';

            // 9. Close on Click (Animate back)
            const closeZoom = (e) => {
                if (e) e.stopPropagation();

                // Get current position of original image (in case of scroll)
                const currentRect = img.getBoundingClientRect();

                // Animate back to original
                clone.style.top = `${currentRect.top}px`;
                clone.style.left = `${currentRect.left}px`;
                clone.style.width = `${currentRect.width}px`;
                clone.style.height = `${currentRect.height}px`;

                // Restore padding/border to match original
                clone.style.padding = '0.5rem';
                clone.style.border = '1px solid #e2e8f0';
                clone.style.borderRadius = '0.5rem';

                clone.style.background = 'transparent'; // Fade out bg
                clone.style.boxShadow = 'none';

                // Fade out backdrop
                backdrop.style.opacity = '0';

                // Remove after transition
                setTimeout(() => {
                    clone.remove();
                    backdrop.remove();
                }, 300);

                // Cleanup listeners
                window.removeEventListener('wheel', closeOnScroll);
                window.removeEventListener('keydown', closeOnKey);
            };

            clone.addEventListener('click', closeZoom);
            backdrop.addEventListener('click', closeZoom);

            // Close on scroll/wheel/escape
            const closeOnScroll = () => closeZoom();
            const closeOnKey = (e) => {
                if (e.key === 'Escape') closeZoom();
            };

            window.addEventListener('wheel', closeOnScroll);
            window.addEventListener('keydown', closeOnKey);
        });
    });

    animateLaser();
});
