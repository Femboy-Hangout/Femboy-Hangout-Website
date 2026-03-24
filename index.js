document.addEventListener('DOMContentLoaded', () => {
    // Create floating decorations in the background
    const container = document.getElementById('decorations');
    const emojis = ['🌸', '✨', '🐾', '🎀', '💖', '⭐', '☁️', '🌈'];
    const numDecorations = 30;

    for (let i = 0; i < numDecorations; i++) {
        createDecoration(emojis[Math.floor(Math.random() * emojis.length)]);
    }

    function createDecoration(emoji) {
        const el = document.createElement('div');
        el.className = 'decoration';
        el.innerText = emoji;
        
        // Random starting position
        el.style.left = Math.random() * 100 + 'vw';
        el.style.top = Math.random() * 100 + 'vh';
        
        // Random sizes
        const size = Math.random() * 1.5 + 1;
        el.style.fontSize = size + 'rem';
        el.style.opacity = Math.random() * 0.4 + 0.1;

        if (container) {
            container.appendChild(el);
            animateDecoration(el);
        }
    }

    function animateDecoration(el) {
        const duration = Math.random() * 10000 + 10000; // 10-20s
        const xOffset = (Math.random() - 0.5) * 200;
        const yOffset = (Math.random() - 0.5) * 200;

        el.animate([
            { transform: 'translate(0, 0) rotate(0deg)' },
            { transform: `translate(${xOffset}px, ${yOffset}px) rotate(${Math.random() * 360}deg)` },
            { transform: 'translate(0, 0) rotate(0deg)' }
        ], {
            duration: duration,
            iterations: Infinity,
            direction: 'alternate',
            easing: 'ease-in-out'
        });
    }

    // Cursor sparkle trail effect
    let isMoving = false;
    document.addEventListener('mousemove', (e) => {
        if (isMoving) return;
        isMoving = true;
        
        // Throttle sparkle generation slightly for performance
        setTimeout(() => {
            createSparkle(e.clientX, e.clientY);
            isMoving = false;
        }, 40); 
    });

    function createSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.innerText = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = (x - 10) + 'px'; // Center roughly on cursor
        sparkle.style.top = (y - 10) + 'px';
        sparkle.style.fontSize = '1.2rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '9999';
        
        document.body.appendChild(sparkle);

        const animation = sparkle.animate([
            { transform: 'scale(1) translateY(0)', opacity: 1 },
            { transform: `scale(0.5) translateY(${Math.random() * 30 + 20}px) translateX(${(Math.random() - 0.5) * 30}px)`, opacity: 0 }
        ], {
            duration: 800 + Math.random() * 400,
            easing: 'ease-out'
        });

        animation.onfinish = () => sparkle.remove();
    }
});
