/**
 * script.js
 * Contains custom interactive functionality for the landing page.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Console log to ensure script is hooked up correctly
    console.log('DOM fully loaded and parsed. Custom scripts initialized.');

    // 1. Sticky Navbar Example (Optional enhancement)
    const navbar = document.querySelector('.navbar');

    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 0) {
                // Add subtle shadow when scrolling down
                navbar.classList.add('shadow-sm');
                // Ensure bg remains white
                navbar.classList.add('bg-white');
            } else {
                navbar.classList.remove('shadow-sm');
                navbar.classList.remove('bg-white');
            }
        });
    }

    // 2. Custom button interactions (can add ripples, etc. here)
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(btn => {
        btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'translateY(-1px)';
            btn.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translateY(0)';
            btn.style.boxShadow = 'none';
        });
    });

    // 4. Showcase Tabs Interaction Logic (Image Swap)
    const tabs = document.querySelectorAll('.glass-tag');
    const showcaseImage = document.getElementById('showcaseImage');

    if (tabs.length > 0 && showcaseImage) {
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // If it's already active, do nothing to prevent unnecessary flashes
                if (tab.classList.contains('active')) return;

                // Remove active styling from all tabs
                tabs.forEach(t => {
                    t.classList.remove('active', 'text-dark', 'bg-white');
                });

                // Add active styling back to the clicked tab
                tab.classList.add('active', 'text-dark', 'bg-white');

                // Get target image URL from the data attribute
                const newImageSrc = tab.getAttribute('data-image');

                if (newImageSrc) {
                    // Start fade out transition
                    showcaseImage.style.opacity = '0';

                    // Wait for the CSS fade-out to finish (0.3s as defined in HTML inline style)
                    setTimeout(() => {
                        showcaseImage.src = newImageSrc;

                        // Wait for image content to visually load then fade back in
                        showcaseImage.onload = () => {
                            showcaseImage.style.opacity = '1';
                        };
                    }, 300);
                }
            });
        });
    }

    // 5. Testimonial Carousel Interaction Logic
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    const indicator = document.querySelector('.slide-indicator');

    if (track && cards.length > 0 && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalCards = cards.length;

        // Dynamic gap based on bootstrap gap-4 (which is 1.5rem = 24px)
        const gap = 24;

        function updateCarousel() {
            // Calculate the card width (min-width is strictly set in HTML/CSS)
            const cardWidth = cards[0].offsetWidth;

            // Translate the track left depending on the current index
            const offset = (cardWidth + gap) * currentIndex;
            track.style.transform = `translateX(-${offset}px)`;

            // Update Indicator text (e.g., 1/5)
            // Adding 1 to totalCards if calculating "Page" out of total pages
            // For simple card-by-card sliding:
            indicator.textContent = `${currentIndex + 1}/${totalCards}`;

            // Handle Button Disabled states
            if (currentIndex === 0) {
                prevBtn.disabled = true;
            } else {
                prevBtn.disabled = false;
            }

            if (currentIndex === totalCards - 1) {
                nextBtn.disabled = true;
            } else {
                nextBtn.disabled = false;
            }
        }

        // Initial setup
        updateCarousel();

        // Bind clicks
        nextBtn.addEventListener('click', () => {
            if (currentIndex < totalCards - 1) {
                currentIndex++;
                updateCarousel();
            }
        });

        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        });

        // Recalculate widths on resize
        window.addEventListener('resize', () => {
            updateCarousel();
        });
    }

    // 6. Statistics Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Lower is slower

    // Function to animate the counting
    const animateCounter = (counter) => {
        const target = parseFloat(counter.getAttribute('data-target'));
        const decimals = parseInt(counter.getAttribute('data-decimals')) || 0;
        let count = parseFloat(counter.innerText);

        // Calculate the increment step
        const inc = target / speed;

        if (count < target) {
            // Add increment and format based on required decimals
            count += inc;
            counter.innerText = count.toFixed(decimals);

            // Call function recursively to continue counting
            requestAnimationFrame(() => animateCounter(counter));
        } else {
            // Ensure exactly matching target due to float math
            counter.innerText = target.toFixed(decimals);
        }
    };

    // Intersection Observer to trigger when elements scroll into view
    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Trigger animation and stop observing
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.5 // Trigger when at least 50% is visible
    });

    // Start observing each counter
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // 7. Hreflang Tag Tester Form Submission
    const hreflangForm = document.getElementById('hreflangForm');
    if (hreflangForm) {
        hreflangForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            // Add custom validation or API call logic here in the future
            console.log('Hreflang form submitted via AJAX.');
        });
    }

    // 8. Robots.txt Tester Form Submission
    const robotsForm = document.getElementById('robotsForm');
    if (robotsForm) {
        robotsForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            console.log('Robots form submitted via AJAX.');
        });
    }

    // 9. Meta Tag Checker Form Submission
    const metatagForm = document.getElementById('metatagForm');
    if (metatagForm) {
        metatagForm.addEventListener('submit', (e) => {
            e.preventDefault(); // Prevent page reload
            console.log('Meta Tag form submitted via AJAX.');
        });
    }

});

/**
 * Global function to toggle Custom FAQ Accordions
 * Defined outside DOMContentLoaded so inline onclick handlers can access it
 */
function toggleFaq(element) {
    const parentItem = element.closest('.faq-item');
    const answer = parentItem.querySelector('.faq-answer');
    const iconOpen = parentItem.querySelector('.icon-open');
    const iconClose = parentItem.querySelector('.icon-close');
    
    // Check if clicking an already active item
    const isActive = parentItem.classList.contains('active');

    // First, close all items currently open
    const allItems = document.querySelectorAll('.faq-item');
    allItems.forEach(item => {
        item.classList.remove('active');
        const itemAnswer = item.querySelector('.faq-answer');
        const itemIconOpen = item.querySelector('.icon-open');
        const itemIconClose = item.querySelector('.icon-close');
        
        if (itemAnswer) itemAnswer.style.display = 'none';
        if (itemIconOpen) itemIconOpen.style.display = 'block';
        if (itemIconClose) itemIconClose.style.display = 'none';
    });

    // If it wasn't active, open it
    if (!isActive) {
        parentItem.classList.add('active');
        answer.style.display = 'block';
        iconOpen.style.display = 'none';
        iconClose.style.display = 'block';
    }
}
