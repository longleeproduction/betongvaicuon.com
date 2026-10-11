/* Gửi form liên hệ qua Web3Forms (email) và vào hệ thống admin (danh sách khách cần tư vấn) */

// Form submission handler (Web3Forms + admin)
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');
const ADMIN_LEADS_URL = ['localhost', '127.0.0.1'].includes(location.hostname)
    ? 'http://localhost:4000/api/public/leads'
    : 'https://admin.betongvaicuon.com/api/public/leads';

function sendToWeb3Forms(formData) {
    return fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (!data.success) throw new Error('web3forms');
        });
}

function sendToAdmin(formData) {
    return fetch(ADMIN_LEADS_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email') || '',
            message: formData.get('message') || '',
            page: location.pathname,
            botcheck: formData.get('botcheck') ? 'on' : ''
        })
    }).then(response => {
        if (!response.ok) throw new Error('admin');
    });
}

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    // Gửi song song: chỉ cần một nơi nhận được là khách không bị mất
    Promise.allSettled([sendToWeb3Forms(formData), sendToAdmin(formData)])
        .then(results => {
            if (results.some(r => r.status === 'fulfilled')) {
                formResult.style.display = 'block';
                formResult.style.color = '#059669';
                formResult.textContent = 'Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.';
                trackEvent('form_submit_success', { form: 'contact' });
                if (typeof fbq === 'function') {
                    fbq('track', 'Lead', { content_name: 'Contact Form' });
                }
                if (typeof gtag === 'function') {
                    gtag('event', 'generate_lead', { currency: 'VND', value: 1 });
                }
                contactForm.reset();
            } else {
                formResult.style.display = 'block';
                formResult.style.color = '#dc2626';
                formResult.textContent = 'Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline 0919 335 088.';
                trackEvent('form_submit_error', { form: 'contact' });
            }
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            setTimeout(() => { formResult.style.display = 'none'; }, 5000);
        });
});
