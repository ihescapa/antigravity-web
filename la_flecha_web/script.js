document.addEventListener("DOMContentLoaded", () => {
    // 1. Intersection Observer for animations
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const appearObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                if (entry.target.classList.contains('milestone-block')) {
                    entry.target.classList.add('is-active');
                }
            } else {
                // Keep visible once seen for smoother experience, or remove for replay
                // entry.target.classList.remove('is-visible');
                if (entry.target.classList.contains('milestone-block')) {
                    entry.target.classList.remove('is-active');
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .milestone-block').forEach(el => appearObserver.observe(el));

    // 2. Scroll Logic: Route Line & Parallax
    const routeProgress = document.getElementById('routeProgress');
    const decorIcons = document.querySelectorAll('.decor');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight;
        const winHeight = window.innerHeight;

        // Progress bar
        const scrollable = docHeight - winHeight;
        const scrolled = (scrollTop / scrollable) * 100;
        if (routeProgress) routeProgress.style.height = scrolled + '%';

        // Parallax decorative icons
        decorIcons.forEach(icon => {
            const speed = parseFloat(icon.getAttribute('style').match(/--parallax:\s*(-?[\d.]+)/)[1]);
            const yPos = scrollTop * speed;
            icon.style.transform = `translateY(${yPos}px)`;
        });
    });

    // 3. Modern Expandable Logic
    const expandButtons = document.querySelectorAll('.modern-btn');

    expandButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const isExpanded = content.classList.contains('expanded');

            // Toggle
            if (isExpanded) {
                content.classList.remove('expanded');
                this.querySelector('span').style.width = '30px';
                this.innerHTML = 'Saber más <span></span>';
            } else {
                content.classList.add('expanded');
                this.querySelector('span').style.width = '60px'; // Visual feedback
                this.innerHTML = 'Cerrar <span></span>';
            }

            // Refresh scroll triggers after expansion
            setTimeout(() => {
                window.dispatchEvent(new Event('scroll'));
            }, 600);
        });
    });

    // 4. Hero parallax subtle effect
    const heroImg = document.getElementById('mainHeroImg');
    if (heroImg) {
        window.addEventListener('scroll', () => {
            const val = window.scrollY * 0.1;
            heroImg.style.transform = `translateY(${val}px)`;
        });
    }
});
