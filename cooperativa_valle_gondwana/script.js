/* script.js */
document.addEventListener('DOMContentLoaded', () => {
    // Fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Lightbox for gallery
    const items = document.querySelectorAll('.gallery-item img');
    items.forEach(img => {
        img.addEventListener('click', () => {
            const overlay = document.createElement('div');
            overlay.className = 'lightbox-overlay';
            const fullImg = document.createElement('img');
            fullImg.src = img.src;
            overlay.appendChild(fullImg);
            document.body.appendChild(overlay);

            overlay.addEventListener('click', () => {
                overlay.remove();
            });
        });
    });
});
