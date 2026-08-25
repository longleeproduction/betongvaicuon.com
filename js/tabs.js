/* Tab mục Ứng Dụng và tab Album */

// Application tabs (Loại phổ thông / Gia cường cao cấp)
document.querySelectorAll('.app-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        document.querySelectorAll('.app-tab').forEach(t => t.classList.remove('active'));
        this.classList.add('active');

        document.querySelectorAll('.app-panel').forEach(panel => {
            panel.classList.remove('active');
        });

        const panelId = this.getAttribute('data-app');
        document.getElementById(panelId).classList.add('active');
        trackEvent('application_tab_switch', { tab: panelId });
    });
});

// Gallery tabs functionality
document.querySelectorAll('.gallery-tab').forEach(tab => {
    tab.addEventListener('click', function () {
        // Remove active class from all tabs
        document.querySelectorAll('.gallery-tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        this.classList.add('active');

        // Hide all content
        document.querySelectorAll('.gallery-content').forEach(content => {
            content.classList.remove('active');
        });

        // Show selected content
        const tabId = this.getAttribute('data-tab');
        document.getElementById(tabId).classList.add('active');
        trackEvent('gallery_tab_switch', { tab: tabId });

        // Pause all videos when switching tabs
        document.querySelectorAll('.gallery-content video').forEach(video => {
            video.pause();
        });
    });
});
