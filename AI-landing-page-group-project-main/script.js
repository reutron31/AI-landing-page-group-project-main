// Force page to always load at the top
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.scrollTo(0, 0);

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation Scroll Effect
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 2. Hamburger Menu Toggle
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('active');
        hamburger.classList.toggle('open');
        hamburger.setAttribute('aria-expanded', isOpen);

        if (isOpen) {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '80px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = 'white';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 10px 10px rgba(0,0,0,0.1)';
        } else {
            navLinks.style.display = '';
        }
    });

    // 3. Scroll Reveal Intersection Observer
    const revealElements = document.querySelectorAll('[data-reveal]');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Survey Submission
    const surveyForm = document.getElementById('survey-form');
    const surveyThanks = document.getElementById('survey-thanks');

    surveyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const selectedOption = surveyForm.querySelector('input[name="vote"]:checked');
        
        if (selectedOption) {
            // Trigger results state
            surveyForm.classList.add('show-results');
            
            // Mark the user's choice
            const selectedContainer = selectedOption.closest('.option-container');
            if (selectedContainer) {
                selectedContainer.classList.add('user-choice');
            }
            
            // Animate each bar based on data-percent
            const options = surveyForm.querySelectorAll('.option-container');
            options.forEach(option => {
                const percent = option.getAttribute('data-percent');
                const fill = option.querySelector('.result-fill');
                
                // Small timeout to ensure CSS transition triggers properly after class add
                setTimeout(() => {
                    fill.style.width = percent + '%';
                }, 100);
            });

            // Show thanks message after animation starts
            setTimeout(() => {
                surveyThanks.classList.remove('hidden');
            }, 1000);
            
        } else {
            alert('אנא בחר אחת מהאפשרויות');
        }
    });

    // 5. Logo Scroll to Top
    const logo = document.getElementById('logo');
    logo.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // 6. Checklist Interaction
    initChecklist();
});

function initChecklist() {
    const checklistItems = document.querySelectorAll('.checklist-item');
    const completionBtn = document.getElementById('btn-completion');
    let selectedCount = 0;

    checklistItems.forEach(item => {
        const toggleItem = () => {
            item.classList.toggle('selected');
            item.style.transform = 'scale(0.95)';
            setTimeout(() => {
                item.style.transform = '';
            }, 100);
        };

        item.addEventListener('click', toggleItem);
        
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleItem();
            }
        });
    });

    const surveyOptions = document.querySelectorAll('.option-container');
    surveyOptions.forEach(option => {
        option.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const input = option.querySelector('input');
                input.checked = true;
                // Manually trigger change if needed or just styling
            }
        });
    });

    completionBtn.addEventListener('click', () => {
        triggerConfetti();
        
        const response = document.createElement('div');
        response.style.position = 'absolute';
        response.style.top = '50%';
        response.style.left = '50%';
        response.style.transform = 'translate(-50%, -50%)';
        response.style.background = '#000';
        response.style.color = '#fff';
        response.style.padding = '30px 60px';
        response.style.fontSize = '1.5rem';
        response.style.fontWeight = '900';
        response.style.zIndex = '200';
        response.style.textAlign = 'center';
        response.style.border = '4px solid #fff';
        response.style.boxShadow = '20px 20px 0px rgba(0,0,0,0.3)';
        response.textContent = "מצוין! אנחנו מוכנים לשינוי 🇮🇱";
        
        document.querySelector('.hero-left').appendChild(response);
        
        completionBtn.classList.remove('visible');
        
        setTimeout(() => {
            response.style.transition = 'opacity 1s, transform 1s';
            response.style.opacity = '0';
            response.style.transform = 'translate(-50%, -60%)';
            setTimeout(() => response.remove(), 1000);
        }, 3000);
    });
}

function triggerConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let particles = [];
    const colors = ['#3661FF', '#FFE14B', '#FF5722', '#4CAF50', '#ffffff'];

    for (let i = 0; i < 100; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: canvas.height + Math.random() * 100,
            r: Math.random() * 6 + 4,
            d: Math.random() * 100,
            color: colors[Math.floor(Math.random() * colors.length)],
            tilt: Math.random() * 10 - 10,
            tiltAngleIncremental: Math.random() * 0.07 + 0.05,
            tiltAngle: 0
        });
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach((p, i) => {
            ctx.beginPath();
            ctx.lineWidth = p.r;
            ctx.strokeStyle = p.color;
            ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
            ctx.stroke();
        });
        update();
    }

    function update() {
        particles.forEach((p, i) => {
            p.tiltAngle += p.tiltAngleIncremental;
            p.y -= 3 + Math.random() * 2;
            p.tilt = Math.sin(p.tiltAngle) * 15;

            if (p.y < -10) {
                particles[i] = null;
            }
        });
        particles = particles.filter(p => p !== null);
        if (particles.length > 0) {
            requestAnimationFrame(draw);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    draw();
}
