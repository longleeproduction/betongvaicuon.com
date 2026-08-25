/* Slider ảnh trang chủ */

// Hero Slider functionality
const slides = document.querySelectorAll('.hero-slide');
const dots = document.querySelectorAll('.slider-dot');
const prevBtn = document.querySelector('.slider-arrow.prev');
const nextBtn = document.querySelector('.slider-arrow.next');
let currentSlide = 0;
let slideInterval;

function showSlide(index) {
    // Handle wrap around
    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;
    currentSlide = index;

    // Update slides
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });

    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

function prevSlide() {
    showSlide(currentSlide - 1);
}

// Auto slide every 5 seconds
function startSlideShow() {
    slideInterval = setInterval(nextSlide, 5000);
}

function stopSlideShow() {
    clearInterval(slideInterval);
}

// Event listeners
nextBtn.addEventListener('click', () => {
    stopSlideShow();
    nextSlide();
    startSlideShow();
});

prevBtn.addEventListener('click', () => {
    stopSlideShow();
    prevSlide();
    startSlideShow();
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        stopSlideShow();
        showSlide(index);
        startSlideShow();
    });
});

// Start auto slideshow
startSlideShow();

// Pause on hover
const heroSection = document.querySelector('.hero');
heroSection.addEventListener('mouseenter', stopSlideShow);
heroSection.addEventListener('mouseleave', startSlideShow);
