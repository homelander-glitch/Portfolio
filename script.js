document.addEventListener('DOMContentLoaded', () => {
    // 1. 3D tilt effect (cards)
    const tiltMax = 12;
    const tiltCards = document.querySelectorAll('.tilt-card, .tilt-small');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            const rotateY = percentX * tiltMax;
            const rotateX = -percentY * tiltMax;

            card.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform =
                'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    });

    // 2. Parallax background (moves with mouse)
    const bgLayers = document.querySelectorAll('.bg-layer');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        bgLayers.forEach((layer, index) => {
            const depth = (index + 1) * 15; // different depth for each
            const moveX = -x * depth;
            const moveY = -y * depth;
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });

    // 3. Scroll reveal + 3D skill bar fill
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            el.classList.add('visible');

            // Animate skill bars
            if (el.classList.contains('skill-card')) {
                const fill = el.querySelector('.skill-3d-fill');
                if (fill && !fill.dataset.filled) {
                    const target = fill.dataset.progress || 0;
                    fill.style.width = `${target}%`;
                    fill.dataset.filled = 'true';
                }
            }

            obs.unobserve(el);
        });
    }, { threshold: 0.18 });

    document.querySelectorAll('.pop-in').forEach(el => observer.observe(el));

    // 4. Project modal popup
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    const projectDetails = {
        diagnostic: {
            title: 'Mobile Hardware Diagnostic Suite',
            paragraphs: [
                'This project turns the browser into a lightweight diagnostic lab for mobile devices.',
                'Network tests run in a sequential async pipeline (download → upload) instead of a single combined test, so each phase is visible. This helps understand where latency or throttling is happening.',
                'For speakers, the Web Audio API drives low‑frequency oscillations (LFO) that help vibrate out dust or water from the grill. This is wrapped in a simple, guided UI so non‑technical users can still run it.',
                'Using navigator.mediaDevices, the app switches between front and rear cameras to quickly check sensors, autofocus, and exposure – all from one interface.'
            ]
        },
        chess: {
            title: 'Interactive Chess Application',
            paragraphs: [
                'This chess app is built entirely with vanilla JavaScript and CSS Grid, focusing on correctness and clarity rather than heavy frameworks.',
                'Each move is processed by a validation pipeline: checking basic moves, collisions, board limits, and finally king safety to detect checks and checkmates.',
                'The board is represented in a clean data structure so that UI (pieces on screen) and state (legal moves, turn, history) never go out of sync.',
                'Because the logic is separated from the visuals, it is easy to extend with features like timers, move history, or AI opponents in the future.'
            ]
        }
    };

    function openProjectModal(key) {
        const data = projectDetails[key];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalBody.innerHTML = '';

        data.paragraphs.forEach(text => {
            const p = document.createElement('p');
            p.textContent = text;
            modalBody.appendChild(p);
        });

        projectModal.classList.add('active');
    }

    function closeProjectModal() {
        projectModal.classList.remove('active');
    }

    document.querySelectorAll('.project-card').forEach(card => {
        const key = card.getAttribute('data-project');
        const btn = card.querySelector('.project-more');
        if (!btn || !key) return;

        btn.addEventListener('click', () => openProjectModal(key));
    });

    modalClose.addEventListener('click', closeProjectModal);
    projectModal.addEventListener('click', (e) => {
        if (e.target === projectModal) closeProjectModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
});
