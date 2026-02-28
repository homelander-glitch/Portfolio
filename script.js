document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;

    // Intro sequence: name reveal -> slide to logo -> show app
    setTimeout(() => {
        body.classList.add('app-logo-move');
    }, 2300);

    setTimeout(() => {
        body.classList.add('app-ready');
    }, 3400);

    // 1. 3D tilt effect – softer, no crazy glitches
    const tiltMaxLarge = 7;
    const tiltMaxSmall = 4;
    const tiltElements = document.querySelectorAll('.tilt-card, .tilt-small');

    tiltElements.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const percentX = (x - centerX) / centerX;
            const percentY = (y - centerY) / centerY;

            const max = card.classList.contains('tilt-small') ? tiltMaxSmall : tiltMaxLarge;
            const rotateY = percentX * max;
            const rotateX = -percentY * max;

            card.style.transform =
                `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform =
                'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
        });
    });

    // 2. Parallax background – subtle weights
    const bgLayers = document.querySelectorAll('.bg-layer');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        bgLayers.forEach((layer, index) => {
            const depth = 10 + index * 6; // 10, 16, 22
            const moveX = -x * depth;
            const moveY = -y * depth * 0.7;
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });

    // 3. Scroll reveal + skill bar fill
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            el.classList.add('visible');

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

    document
        .querySelectorAll('.pop-in:not(.project-card)')
        .forEach(el => observer.observe(el));

    // 4. Waterfall reveal for project cards
    const projectCards = Array.from(document.querySelectorAll('.waterfall-grid .waterfall-item'));
    if (projectCards.length) {
        const waterfallObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 140);
                });

                obs.disconnect();
            });
        }, { threshold: 0.2 });

        waterfallObserver.observe(projectCards[0]);
    }

    // 5. Logic Overlay / System Toggle
    const systemToggle = document.getElementById('system-toggle');
    const logicOverlay = document.getElementById('logic-overlay');

    if (systemToggle && logicOverlay) {
        systemToggle.addEventListener('click', () => {
            const active = logicOverlay.classList.toggle('active');
            body.classList.toggle('logic-on', active);
            systemToggle.textContent = active ? 'System Toggle: ON' : 'System Toggle';
        });

        logicOverlay.addEventListener('click', (e) => {
            if (e.target === logicOverlay) {
                logicOverlay.classList.remove('active');
                body.classList.remove('logic-on');
                systemToggle.textContent = 'System Toggle';
            }
        });
    }

    // 6. Project modal – logic details
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    const projectDetails = {
        diagnostic: {
            title: 'Mobile Hardware Diagnostic Suite',
            paragraphs: [
                'This suite behaves like a small diagnostic lab, running a controlled, sequential async throughput pipeline so download and upload are measured in distinct phases.',
                'For speakers, it uses the Web Audio API to drive low-frequency oscillation patterns that help shake out dust or water from the grill while staying within safe limits.',
                'Using navigator.mediaDevices, the interface walks the user through front and rear camera checks so sensors, autofocus, and exposure can be verified quickly from one place.'
            ]
        },
        chess: {
            title: 'Logic-Driven Chess Application',
            paragraphs: [
                'The chess app is built as a rule engine first and a UI second. Each move passes through a rule-validation pipeline that checks piece rules, board boundaries, collisions, and king safety.',
                'Board state is stored in a clean structure, so the rendering layer (CSS Grid + DOM) simply reflects decisions already made by the engine, keeping visuals and logic synced.',
                'Because state and UI are decoupled, it is straightforward to extend the engine with timers, move history, or AI players without rewriting the core logic.'
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

    if (modalClose) {
        modalClose.addEventListener('click', closeProjectModal);
    }
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) closeProjectModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
});
