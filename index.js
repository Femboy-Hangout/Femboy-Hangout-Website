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

    // Click-to-copy for the Minecraft server IPs (Java + Bedrock)
    document.querySelectorAll('.copy-ip').forEach((copyBtn) => {
        const copyText = copyBtn.querySelector('.copy-ip-text');
        if (!copyText) return;
        const ip = copyBtn.dataset.ip;
        let resetTimer;

        copyBtn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(ip);
                copyText.textContent = 'Copied!';
            } catch {
                copyText.textContent = ip; // clipboard blocked, IP stays visible
            }
            clearTimeout(resetTimer);
            resetTimer = setTimeout(() => { copyText.textContent = ip; }, 1500);
        });
    });
});
