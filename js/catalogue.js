/* Lọc danh mục và mở rộng chi tiết sản phẩm */

// ============================================
// PRODUCT CATALOGUE
// ============================================

// Toggle product details
function toggleDetails(btn) {
    const details = btn.nextElementSibling;
    const isOpen = details.classList.contains('open');
    details.classList.toggle('open');
    btn.textContent = isOpen ? 'Xem chi tiết ▼' : 'Thu gọn ▲';
}

// Catalogue filter
document.querySelectorAll('.catalogue-filter').forEach(filter => {
    filter.addEventListener('click', function () {
        document.querySelectorAll('.catalogue-filter').forEach(f => f.classList.remove('active'));
        this.classList.add('active');

        const category = this.getAttribute('data-filter');
        const cards = document.querySelectorAll('.product-card');

        cards.forEach(card => {
            if (category === 'all' || card.getAttribute('data-category') === category) {
                card.style.display = '';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 50);
            } else {
                card.style.display = 'none';
            }
        });

        trackEvent('catalogue_filter', { category: category });
    });
});
