/* Trang hướng dẫn thi công: thanh tiến độ, mục lục dính, nút về đầu trang */

(function () {
    const guideBody = document.querySelector('.guide-body');
    if (!guideBody) return;

    // --- Thanh tiến độ đọc ---
    const progress = document.querySelector('.gd-progress');
    const topBtn = document.querySelector('.gd-top');

    // --- Mục lục: highlight mục đang đọc ---
    const tocLinks = Array.from(document.querySelectorAll('.guide-toc a[href^="#"]'));
    const targets = tocLinks
        .map(a => document.getElementById(a.getAttribute('href').slice(1)))
        .filter(Boolean);

    function onScroll() {
        if (progress) {
            const max = document.documentElement.scrollHeight - window.innerHeight;
            progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
        }

        if (topBtn) {
            topBtn.classList.toggle('show', window.scrollY > 600);
        }

        // Mục cuối cùng đã cuộn qua khỏi mép trên (cộng chiều cao header)
        const pos = window.scrollY + 130;
        let current = null;
        targets.forEach(t => {
            if (t.offsetTop <= pos) current = t.id;
        });
        tocLinks.forEach(a => {
            a.classList.toggle('active', a.getAttribute('href') === '#' + current);
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();

    // --- Về đầu trang ---
    if (topBtn) {
        topBtn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // --- Mục lục thu gọn trên mobile ---
    const tocToggle = document.querySelector('.gd-toc-toggle');
    const tocList = document.querySelector('.guide-toc ul');
    if (tocToggle && tocList) {
        tocToggle.addEventListener('click', function () {
            tocToggle.classList.toggle('open');
            tocList.classList.toggle('open');
        });
        // Chọn xong thì đóng lại
        tocLinks.forEach(a => {
            a.addEventListener('click', function () {
                tocToggle.classList.remove('open');
                tocList.classList.remove('open');
            });
        });
    }

    // --- Đóng menu mobile khi bấm link điều hướng về trang chủ ---
    // header.js chỉ gắn sự kiện cho link dạng "#..." nên phải bổ sung ở đây
    document.querySelectorAll('.nav-links a:not([href^="#"])').forEach(link => {
        link.addEventListener('click', function () {
            const nav = document.getElementById('navLinks');
            if (nav && nav.classList.contains('active') && typeof toggleMobileMenu === 'function') {
                toggleMobileMenu();
            }
        });
    });

    // --- Nút in tài liệu ---
    const printBtn = document.getElementById('gdPrint');
    if (printBtn) {
        printBtn.addEventListener('click', function () {
            if (typeof trackEvent === 'function') {
                trackEvent('guide_print', { page: 'thi-cong-be-tong-vai-cuon' });
            }
            window.print();
        });
    }

    // --- Hiệu ứng hiện dần ---
    // Chỉ ẩn khi chắc chắn có thể hiện lại: dùng class trên <html>, kèm lưới an toàn
    // (timeout + sự kiện load) để nội dung không bao giờ bị kẹt ở trạng thái ẩn.
    const revealables = document.querySelectorAll('.gd-step, .gd-principle, .gd-check');
    const canReveal = 'IntersectionObserver' in window
        && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function revealAll() {
        document.documentElement.classList.remove('gd-js-reveal');
        revealables.forEach(el => el.classList.add('gd-shown'));
    }

    if (canReveal && revealables.length) {
        document.documentElement.classList.add('gd-js-reveal');
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('gd-shown');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
        revealables.forEach(el => io.observe(el));

        // Lưới an toàn: dù có chuyện gì thì sau 1,5s mọi nội dung đều phải hiện
        setTimeout(revealAll, 1500);
        window.addEventListener('load', function () { setTimeout(revealAll, 800); });
        window.addEventListener('beforeprint', revealAll);
    }
})();
