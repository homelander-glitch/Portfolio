document.addEventListener('DOMContentLoaded', () => {
    // Intro sequence: name reveal -> slide to logo -> show app
    const body = document.body;
    const intro = document.querySelector('.intro');

    // Cinematic sequence timings
    setTimeout(() => {
        body.classList.add('app-logo-move');
    }, 2300); // after name fade in

    setTimeout(() => {
        body.classList.add('app-ready');
    }, 3400); // reveal app & fade intro

    // 1. 3D tilt effect (reuse logic pattern)
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

    // 2. Parallax background (reuse pattern, make weighted)
    const bgLayers = document.querySelectorAll('.bg-layer');
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;

        bgLayers.forEach((layer, index) => {
            const depth = (index + 1) * 18;
            const moveX = -x * depth;
            const moveY = -y * depth * 0.7; // slightly reduced vertical weight
            layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
        });
    });

    // 3. Scroll reveal (cinematic, weighted) + skill bar fill
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

    // All pop-in elements except project cards (handled by waterfall)
    document.querySelectorAll('.pop-in:not(.project-card)').forEach(el => observer.observe(el));

    // 4. Waterfall reveal for projects
    const projectCards = Array.from(document.querySelectorAll('.waterfall-grid .waterfall-item'));
    if (projectCards.length) {
        const waterfallObserver = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                projectCards.forEach((card, index) => {
                    setTimeout(() => {
                        card.classList.add('visible');
                    }, index * 140); // staggered reveal
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

    // 6. Project modal – details on click
    const projectModal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    const projectDetails = {
        diagnostic: {
            title: 'Mobile Hardware Diagnostic Suite',
            paragraphs: [
                'This suite behaves like a small diagnostic lab, running a controlled, sequential async throughput pipeline: download and upload are measured in separate phases so you can reason about each stage independently.',
                'For speakers, it uses the Web Audio API to drive a low-frequency oscillator (LFO) pattern designed to shake out dust or water from the grill while staying within safe bounds.',
                'Using navigator.mediaDevices, the interface walks the user through front and rear camera checks so sensors, autofocus, and exposure can be verified quickly from one place.'
            ]
        },
        chess: {
            title: 'Logic-Driven Chess Application',
            paragraphs: [
                'The chess app is built as a rule engine first, UI second. Each move passes through a rule-validation pipeline that checks piece rules, board boundaries, collisions, and king safety.',
                'Board state is stored in a clear structure, so the rendering layer (CSS Grid + DOM) only reflects decisions the engine already made, keeping visuals and logic in sync.',
                'Because state and UI are decoupled, it is straightforward to extend the engine with timers, move history, or AI players without rewriting the board.'
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
