/* Header khi cuộn, hamburger, highlight mục đang xem */

// ============================================
// HEADER: Scroll effect, Hamburger, Active nav
// ============================================

const mainHeader = document.getElementById('mainHeader');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const menuOverlay = document.getElementById('menuOverlay');
const allNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');

// Scroll: transparent → solid header
function handleHeaderScroll() {
    if (window.scrollY > 50) {
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }
}
window.addEventListener('scroll', handleHeaderScroll);
handleHeaderScroll();

// Hamburger toggle
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
}

hamburger.addEventListener('click', toggleMobileMenu);
menuOverlay.addEventListener('click', toggleMobileMenu);

// Close mobile menu on link click
allNavLinks.forEach(link => {
    link.addEventListener('click', function () {
        if (navLinks.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
});

// Active section highlighting
function updateActiveNav() {
    const scrollPos = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';

    sections.forEach(section => {
        if (section.offsetTop <= scrollPos) {
            currentSection = section.getAttribute('id');
        }
    });

    allNavLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}
window.addEventListener('scroll', updateActiveNav);
updateActiveNav();
