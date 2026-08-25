/* Gửi form liên hệ qua Web3Forms */

// Form submission handler (Web3Forms)
const contactForm = document.getElementById('contactForm');
const formResult = document.getElementById('formResult');

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const submitBtn = contactForm.querySelector('.submit-button');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Đang gửi...';
    submitBtn.disabled = true;

    const formData = new FormData(contactForm);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
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
                formResult.textContent = 'Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline 094 345 2386.';
            }
        })
        .catch(() => {
            formResult.style.display = 'block';
            formResult.style.color = '#dc2626';
            formResult.textContent = 'Có lỗi xảy ra. Vui lòng thử lại hoặc gọi hotline 094 345 2386.';
            trackEvent('form_submit_error', { form: 'contact' });
        })
        .finally(() => {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            setTimeout(() => { formResult.style.display = 'none'; }, 5000);
        });
});
