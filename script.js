document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    setTimeout(() => body.classList.add('app-logo-move'), 2100);
    setTimeout(() => body.classList.add('app-ready'), 3200);

    const TILT_MAX = 8;
    document.querySelectorAll('.tilt-card').forEach((card) => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - 0.5;
            const y = (e.clientY - r.top) / r.height - 0.5;
            const ry = x * TILT_MAX;
            const rx = -y * TILT_MAX;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    });

    const layers = document.querySelectorAll('.bg-layer');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        layers.forEach((layer, i) => {
            const d = 12 + i * 8;
            layer.style.transform = `translate(${-x * d}px, ${-y * d * 0.6}px)`;
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                el.classList.add('visible');

                if (el.classList.contains('skill-card')) {
                    const fill = el.querySelector('.skill-fill');
                    if (fill && !fill.dataset.done) {
                        fill.style.width = fill.dataset.progress + '%';
                        fill.dataset.done = '1';
                    }
                }
                observer.unobserve(el);
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll('.pop-in').forEach((el) => {
        if (el.classList.contains('waterfall-item')) return;
        if (el.closest('.hero')) return;
        observer.observe(el);
    });

    const waterfallItems = document.querySelectorAll('.waterfall-grid .waterfall-item');
    if (waterfallItems.length) {
        const waterfallObs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    waterfallItems.forEach((card, i) => {
                        setTimeout(() => card.classList.add('visible'), i * 120);
                    });
                    waterfallObs.disconnect();
                });
            },
            { threshold: 0.15 }
        );
        waterfallObs.observe(waterfallItems[0]);
    }

    const toggle = document.getElementById('system-toggle');
    const overlay = document.getElementById('logic-overlay');
    if (toggle && overlay) {
        toggle.addEventListener('click', () => {
            const on = overlay.classList.toggle('active');
            toggle.textContent = on ? 'System Toggle: ON' : 'System Toggle';
        });
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                overlay.classList.remove('active');
                toggle.textContent = 'System Toggle';
            }
        });
    }
});
