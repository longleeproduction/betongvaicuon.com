/* Trình xem ảnh/video: chuyển ảnh, zoom, kéo, vuốt */

// ============================================
// TRÌNH XEM ẢNH / VIDEO (Lightbox)
// ============================================
(function () {
    const lb = document.getElementById('lightbox');
    if (!lb) return;

    const stage = document.getElementById('lbStage');
    const imgEl = document.getElementById('lbImage');
    const videoEl = document.getElementById('lbVideo');
    const counterEl = document.getElementById('lbCounter');
    const zoomLevelEl = document.getElementById('lbZoomLevel');
    const hintEl = document.getElementById('lbHint');
    const prevBtn = document.getElementById('lbPrev');
    const nextBtn = document.getElementById('lbNext');

    const MIN_SCALE = 1;
    const MAX_SCALE = 5;

    let items = [];
    let index = 0;
    let scale = 1;
    let tx = 0;
    let ty = 0;
    let lastFocus = null;

    function collectImages() {
        return Array.from(document.querySelectorAll('#images .gallery-item img')).map(img => ({
            type: 'image',
            src: img.getAttribute('src'),
            alt: img.getAttribute('alt') || 'Ảnh công trình bê tông vải cuộn'
        }));
    }

    function collectVideos() {
        return Array.from(document.querySelectorAll('#videos .video-item video')).map(video => {
            const source = video.querySelector('source');
            return {
                type: 'video',
                src: source ? source.getAttribute('src') : video.getAttribute('src'),
                alt: 'Video thi công bê tông vải cuộn'
            };
        });
    }

    function applyTransform() {
        imgEl.style.transform = 'translate(' + tx + 'px, ' + ty + 'px) scale(' + scale + ')';
        imgEl.classList.toggle('zoomed', scale > 1);
        zoomLevelEl.textContent = Math.round(scale * 100) + '%';
    }

    function resetZoom() {
        scale = 1;
        tx = 0;
        ty = 0;
        applyTransform();
    }

    // Giữ ảnh không bị kéo ra ngoài khung khi phóng to
    function clampPan() {
        const rect = imgEl.getBoundingClientRect();
        const maxX = Math.max(0, (rect.width - stage.clientWidth) / 2);
        const maxY = Math.max(0, (rect.height - stage.clientHeight) / 2);
        tx = Math.min(maxX, Math.max(-maxX, tx));
        ty = Math.min(maxY, Math.max(-maxY, ty));
    }

    // originX/originY tính theo tâm khung xem (0,0 là chính giữa)
    function zoomTo(newScale, originX, originY) {
        const previous = scale;
        scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale));
        if (scale === previous) return;

        if (typeof originX === 'number') {
            const ratio = scale / previous;
            tx = originX - (originX - tx) * ratio;
            ty = originY - (originY - ty) * ratio;
        }

        if (scale === 1) {
            tx = 0;
            ty = 0;
        } else {
            clampPan();
        }
        applyTransform();
    }

    function render() {
        const item = items[index];
        if (!item) return;

        resetZoom();
        const isImage = item.type === 'image';

        imgEl.hidden = !isImage;
        videoEl.hidden = isImage;
        // chỉ khoá cử chỉ chạm khi xem ảnh, để điều khiển video hoạt động bình thường
        stage.classList.toggle('is-image', isImage);

        if (isImage) {
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
            imgEl.src = item.src;
            imgEl.alt = item.alt;
            hintEl.textContent = 'Cuộn chuột hoặc chụm hai ngón để phóng to · Kéo để di chuyển · ← → chuyển ảnh · Esc để đóng';
        } else {
            imgEl.removeAttribute('src');
            videoEl.src = item.src;
            videoEl.load();
            hintEl.textContent = '← → chuyển video · Esc để đóng';
        }

        document.querySelectorAll('#lbZoomIn, #lbZoomOut, #lbZoomLevel').forEach(btn => {
            btn.classList.toggle('disabled', !isImage);
            btn.disabled = !isImage;
        });

        counterEl.textContent = (index + 1) + ' / ' + items.length;
        const single = items.length < 2;
        prevBtn.style.display = single ? 'none' : '';
        nextBtn.style.display = single ? 'none' : '';
    }

    function open(list, startIndex) {
        items = list;
        index = startIndex;
        lastFocus = document.activeElement;

        lb.classList.add('open');
        requestAnimationFrame(() => lb.classList.add('visible'));
        document.body.style.overflow = 'hidden';
        render();

        trackEvent('media_preview_open', {
            type: items[index] ? items[index].type : 'unknown',
            index: index + 1
        });
    }

    function close() {
        lb.classList.remove('visible');
        setTimeout(() => {
            lb.classList.remove('open');
            imgEl.removeAttribute('src');
            videoEl.pause();
            videoEl.removeAttribute('src');
            videoEl.load();
        }, 250);
        document.body.style.overflow = '';
        if (lastFocus && typeof lastFocus.focus === 'function') lastFocus.focus();
    }

    function go(step) {
        if (items.length < 2) return;
        index = (index + step + items.length) % items.length;
        render();
    }

    // --- Mở từ album ảnh ---
    document.querySelectorAll('#images .gallery-item').forEach((item, i) => {
        item.addEventListener('click', function () {
            open(collectImages(), i);
        });
    });

    // --- Mở từ album video (nút mở rộng) ---
    document.querySelectorAll('#videos .video-item').forEach((item, i) => {
        const expandBtn = item.querySelector('.video-expand');
        if (!expandBtn) return;
        expandBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const video = item.querySelector('video');
            if (video) video.pause();
            open(collectVideos(), i);
        });
    });

    // --- Điều khiển ---
    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));
    document.getElementById('lbClose').addEventListener('click', close);
    document.getElementById('lbZoomIn').addEventListener('click', () => zoomTo(scale + 0.5));
    document.getElementById('lbZoomOut').addEventListener('click', () => zoomTo(scale - 0.5));
    zoomLevelEl.addEventListener('click', resetZoom);

    // Nhấn ra nền để đóng
    lb.addEventListener('click', function (e) {
        if (e.target === lb || e.target === stage) close();
    });

    // Bàn phím
    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') go(-1);
        else if (e.key === 'ArrowRight') go(1);
        else if (e.key === '+' || e.key === '=') zoomTo(scale + 0.5);
        else if (e.key === '-') zoomTo(scale - 0.5);
        else if (e.key === '0') resetZoom();
    });

    // Nhấn đúp để phóng to / thu nhỏ
    imgEl.addEventListener('dblclick', function (e) {
        if (scale > 1) resetZoom();
        else zoomTo(2.5, e.clientX - stage.clientWidth / 2, e.clientY - stage.clientHeight / 2);
    });

    // Cuộn chuột để zoom
    stage.addEventListener('wheel', function (e) {
        if (imgEl.hidden) return;
        e.preventDefault();
        const step = e.deltaY < 0 ? 0.25 : -0.25;
        zoomTo(scale + step, e.clientX - stage.clientWidth / 2, e.clientY - stage.clientHeight / 2);
    }, { passive: false });

    // Kéo để di chuyển + vuốt để chuyển ảnh + chụm hai ngón để zoom
    const pointers = new Map();
    let dragStart = null;
    let pinchStart = null;

    function pointerDistance() {
        const pts = Array.from(pointers.values());
        return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
    }

    stage.addEventListener('pointerdown', function (e) {
        if (imgEl.hidden) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (pointers.size === 1) {
            dragStart = { x: e.clientX, y: e.clientY, tx: tx, ty: ty, moved: false };
            imgEl.classList.add('dragging');
        } else if (pointers.size === 2) {
            pinchStart = { dist: pointerDistance(), scale: scale };
            dragStart = null;
        }
        stage.setPointerCapture(e.pointerId);
    });

    stage.addEventListener('pointermove', function (e) {
        if (!pointers.has(e.pointerId)) return;
        pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });

        if (pointers.size === 2 && pinchStart) {
            const ratio = pointerDistance() / pinchStart.dist;
            zoomTo(pinchStart.scale * ratio);
            return;
        }

        if (pointers.size === 1 && dragStart && scale > 1) {
            tx = dragStart.tx + (e.clientX - dragStart.x);
            ty = dragStart.ty + (e.clientY - dragStart.y);
            dragStart.moved = true;
            clampPan();
            applyTransform();
        }
    });

    function endPointer(e) {
        if (dragStart && scale === 1 && pointers.size === 1) {
            // Vuốt ngang để chuyển ảnh khi chưa phóng to
            const dx = e.clientX - dragStart.x;
            if (Math.abs(dx) > 60) go(dx < 0 ? 1 : -1);
        }
        pointers.delete(e.pointerId);
        if (pointers.size < 2) pinchStart = null;
        if (pointers.size === 0) {
            dragStart = null;
            imgEl.classList.remove('dragging');
        }
    }

    stage.addEventListener('pointerup', endPointer);
    stage.addEventListener('pointercancel', endPointer);

    // Giữ ảnh trong khung khi đổi kích thước cửa sổ
    window.addEventListener('resize', function () {
        if (!lb.classList.contains('open') || scale === 1) return;
        clampPan();
        applyTransform();
    });
})();
