// 3D tilt effect for cards
(function () {
    const tiltCards = document.querySelectorAll('.tilt-card');

    const maxTilt = 10; // degrees

    function handleMove(e) {
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const percentX = (x - centerX) / centerX;
        const percentY = (y - centerY) / centerY;

        const rotateY = percentX * maxTilt;
        const rotateX = -percentY * maxTilt;

        card.style.transform =
            `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
    }

    function resetTilt(e) {
        const card = e.currentTarget;
        card.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0)';
    }

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', handleMove);
        card.addEventListener('mouseleave', resetTilt);
    });
})();

// Scroll reveal (pop-in) and skill bar animation
(function () {
    const observerOptions = {
        threshold: 0.18
    };

    const callback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                el.classList.add('visible');

                // Animate skill bars when they come into view
                if (el.classList.contains('skill-card')) {
                    const bar = el.querySelector('.skill-progress');
                    if (bar && !bar.dataset.filled) {
                        const target = bar.dataset.progress || 0;
                        bar.style.width = `${target}%`;
                        bar.dataset.filled = 'true';
                    }
                }

                observer.unobserve(el);
            }
        });
    };

    const observer = new IntersectionObserver(callback, observerOptions);
    document.querySelectorAll('.pop-in').forEach(el => observer.observe(el));
})();

// Project modal popup
(function () {
    const modal = document.getElementById('project-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalBody = document.getElementById('modal-body');
    const modalClose = document.getElementById('modal-close');

    const projectDetails = {
        diagnostic: {
            title: 'Mobile Hardware Diagnostic Suite',
            body: `
This project is built to behave like a mini lab on a mobile device.

It runs network tests in a **sequential async pipeline** (download then upload), so you can
observe how each stage performs instead of just showing one combined number.

For speakers, it uses the **Web Audio API** to generate low‑frequency oscillations that help
vibrate out dust or water from the speaker grill. On top of that, it uses
**navigator.mediaDevices** to cycle between user and environment cameras, letting you quickly
verify sensors, autofocus, and exposure in a single interface.

The goal: turn a regular browser into a powerful diagnostic tool with no extra apps.
            `
        },
        chess: {
            title: 'Interactive Chess Application',
            body: `
This chess app focuses on correctness and clarity over heavy frameworks.

Each move passes through a **validation pipeline**: piece rules, board boundaries, collision checks,
and king safety checks (to detect checks and checkmates). Turn state is tracked in a single source
of truth, so the UI is always synced with the underlying game logic.

Visually, it uses **CSS Grid** to represent the board and plain DOM updates for moves, so the
implementation stays understandable and easy to extend with new features (move history, timers, etc.).
            `
        }
    };

    function openModal(projectKey) {
        const data = projectDetails[projectKey];
        if (!data) return;

        modalTitle.textContent = data.title;
        modalBody.textContent = ''; // clear
        // Preserve paragraphs from template string
        data.body.trim().split('\n\n').forEach(chunk => {
            const p = document.createElement('p');
            p.textContent = chunk.replace(/\s+/g, ' ').trim();
            modalBody.appendChild(p);
        });

        modal.classList.add('active');
    }

    function closeModal() {
        modal.classList.remove('active');
    }

    document.querySelectorAll('.project-card').forEach(card => {
        const projectKey = card.getAttribute('data-project');
        const btn = card.querySelector('.project-more');
        if (!btn || !projectKey) return;

        btn.addEventListener('click', () => openModal(projectKey));
    });

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
})();
