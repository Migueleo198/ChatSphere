// Re-run animation every 5 seconds
setInterval(() => {
    const textElement = document.querySelector('.animated-text');
    textElement.style.animation = 'none'; // Reset animation
    void textElement.offsetWidth;        // Trigger reflow (restart animation)
    textElement.style.animation = 'fadeSlideIn 2s ease forwards';
}, 5000);