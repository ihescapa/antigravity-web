/* =========================================
   PROJECT GONDWANA - INTERACTIVITY
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('main-header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const desktopNav = document.querySelector('.desktop-nav');

    // 1. Header Scroll Effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Mobile Menu Toggle
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('active');
        desktopNav.classList.toggle('active');
    });

    // 3. Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal-up');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Protection Logic (Simplified for static site)
    // This runs on community.html to verify access
    if (window.location.pathname.includes('comunidad.html')) {
        const isAuth = sessionStorage.getItem('gondwana_auth');
        if (isAuth !== 'true') {
            window.location.href = 'socios.html';
        }
    }
});

// login function (called from socios.html)
function attemptLogin() {
    const password = document.getElementById('pass-field').value;
    // Password base requested: "patagonia" (simulated)
    if (password === 'patagonia') {
        sessionStorage.setItem('gondwana_auth', 'true');
        window.location.href = 'comunidad.html';
    } else {
        alert('Clave incorrecta. Pista: Es un lugar gigante al sur.');
    }
}
