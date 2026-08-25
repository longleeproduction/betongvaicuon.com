/* Hiệu ứng hiện dần khi cuộn trang */

// Scroll animations
function revealOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .gallery-item, .product-card, .client-card');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}
window.addEventListener('scroll', revealOnScroll);

// Initialize animations
document.addEventListener('DOMContentLoaded', function () {
    const elements = document.querySelectorAll('.feature-card, .gallery-item, .product-card, .client-card');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'all 0.6s ease-out';
    });
    // Hiện ngay các phần tử đang nằm trong khung nhìn (kể cả khi mở link có #anchor)
    revealOnScroll();
});
