/* trackEvent() và đo lường GA4 / Facebook Pixel */

// ============================================
// ANALYTICS EVENT TRACKING
// ============================================
function trackEvent(eventName, params) {
    // Google Analytics 4
    if (typeof gtag === 'function') {
        gtag('event', eventName, params);
    }
    // Facebook Pixel
    if (typeof fbq === 'function') {
        fbq('trackCustom', eventName, params);
    }
}

// --- 1. Navigation Click Tracking ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const section = this.getAttribute('href').replace('#', '');
        trackEvent('navigation_click', {
            section: section,
            link_text: this.textContent.trim()
        });
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// --- 2. CTA Button Click Tracking ---
document.querySelectorAll('.cta-button').forEach(btn => {
    btn.addEventListener('click', function () {
        trackEvent('cta_click', {
            button_text: this.textContent.trim(),
            button_location: this.closest('section')?.id || 'unknown'
        });
        if (typeof fbq === 'function') {
            fbq('track', 'Lead', { content_name: this.textContent.trim() });
        }
    });
});

// --- 3. Zalo & Messenger Click Tracking ---
document.querySelectorAll('.floating-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        var channel = this.classList.contains('zalo-btn') ? 'Zalo' : 'Messenger';
        trackEvent('social_chat_click', { channel: channel });
        if (typeof fbq === 'function') {
            fbq('track', 'Contact', { content_name: channel });
        }
    });
});

// --- 4. Scroll Depth Tracking ---
(function () {
    var milestones = [25, 50, 75, 100];
    var reached = {};
    window.addEventListener('scroll', function () {
        var scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        milestones.forEach(function (m) {
            if (scrollPercent >= m && !reached[m]) {
                reached[m] = true;
                trackEvent('scroll_depth', { percent: m });
            }
        });
    });
})();

// --- 5. Section Visibility Tracking ---
(function () {
    var sections = document.querySelectorAll('section[id]');
    var viewed = {};
    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !viewed[entry.target.id]) {
                viewed[entry.target.id] = true;
                trackEvent('section_view', { section: entry.target.id });
            }
        });
    }, { threshold: 0.3 });
    sections.forEach(function (s) { observer.observe(s); });
})();

// --- 6. Gallery Tab Tracking (added below in gallery section) ---

// --- 7. Time on Page Tracking ---
(function () {
    var intervals = [30, 60, 120, 300];
    intervals.forEach(function (sec) {
        setTimeout(function () {
            trackEvent('time_on_page', { seconds: sec });
        }, sec * 1000);
    });
})();
