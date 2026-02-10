document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const dots = document.querySelectorAll('.dot');

    let currentSlide = 0;
    const totalSlides = slides.length;

    // Initialize state
    updateSlideState();

    nextBtn.addEventListener('click', () => {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlideState();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlideState();
        }
    });

    dots.forEach(dot => {
        dot.addEventListener('click', (e) => {
            const slideIndex = parseInt(e.target.dataset.slide);
            currentSlide = slideIndex;
            updateSlideState();
        });
    });

    function updateSlideState() {
        // Update slides
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');

            if (index === currentSlide) {
                slide.classList.add('active');
            } else if (index < currentSlide) {
                slide.classList.add('prev'); // For exit animation direction if needed
            }
        });

        // Update Buttons
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;

        // Update Dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
});
