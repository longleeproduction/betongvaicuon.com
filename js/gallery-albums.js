/* Album ảnh: ảnh bìa, đếm số ảnh, mở trình xem; nút mở rộng cho video */

(function () {
    const viewer = window.mediaViewer;
    if (!viewer) return;

    // ---------- Album ảnh ----------
    document.querySelectorAll('#images .album').forEach(album => {
        const photos = Array.from(album.querySelectorAll('.album-photos img'));

        // Album chưa có ảnh thì ẩn đi, tránh hiện ô trống trên trang
        if (!photos.length) {
            album.hidden = true;
            return;
        }

        const name = album.querySelector('.album-name');
        const title = name ? name.textContent.trim() : '';

        // Ảnh đầu tiên làm ảnh bìa
        album.style.backgroundImage = 'url("' + photos[0].getAttribute('src') + '")';

        // Số ảnh tự đếm, không cần sửa tay khi thêm ảnh
        const count = document.createElement('span');
        count.className = 'album-count';
        count.textContent = photos.length + ' ảnh';
        album.appendChild(count);

        album.addEventListener('click', function () {
            const items = photos.map(img => ({
                type: 'image',
                src: img.getAttribute('src'),
                alt: img.getAttribute('alt') || title
            }));
            viewer.open(items, 0, title);
        });
    });

    // ---------- Video ----------
    const videoItems = Array.from(document.querySelectorAll('#videos .video-item'));

    function collectVideos() {
        return videoItems.map(item => {
            const video = item.querySelector('video');
            const source = video ? video.querySelector('source') : null;
            return {
                type: 'video',
                src: source ? source.getAttribute('src') : (video ? video.getAttribute('src') : ''),
                alt: 'Video thi công bê tông vải cuộn'
            };
        });
    }

    videoItems.forEach((item, i) => {
        const expandBtn = item.querySelector('.video-expand');
        if (!expandBtn) return;
        expandBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            const video = item.querySelector('video');
            if (video) video.pause();
            viewer.open(collectVideos(), i, 'Video thi công');
        });
    });
})();
