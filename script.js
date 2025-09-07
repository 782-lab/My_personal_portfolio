document.addEventListener('DOMContentLoaded', () => {

    // --- CUSTOM CURSOR LOGIC ---
    // This logic makes a custom dot follow the mouse and grow on hover.
    const cursor = document.querySelector('.cursor');
    window.addEventListener('mousemove', e => {
        // Update cursor position to follow the mouse
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });
    
    // Select all interactive elements that should trigger the cursor animation
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseover', () => cursor.classList.add('hover-grow'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hover-grow'));
    });

    // --- PARTICLE BACKGROUND LOGIC ---
    // This creates the animated, interconnected particle background.
    const canvas = document.getElementById('particle-canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    // Particle class defines the behavior and appearance of each dot.
    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }
        // Method to draw the particle on the canvas
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = 'rgba(100, 255, 218, 0.5)';
            ctx.fill();
        }
        // Method to update particle's position and handle collisions with walls
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    // Function to create and initialize the particles array.
    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.height * canvas.width) / 9000;
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 2) + 1;
            let x = (Math.random() * ((innerWidth - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((innerHeight - size * 2) - (size * 2)) + size * 2);
            let directionX = (Math.random() * .4) - .2;
            let directionY = (Math.random() * .4) - .2;
            particlesArray.push(new Particle(x, y, directionX, directionY, size));
        }
    }
    
    // Function to draw connecting lines between nearby particles.
    function connectParticles(){
        let opacityValue = 1;
        for(let a = 0; a < particlesArray.length; a++){
            for(let b = a; b < particlesArray.length; b++){
                let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x))
                + ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
                if(distance < (canvas.width/7) * (canvas.height/7)){
                   opacityValue = 1 - (distance/20000);
                   ctx.strokeStyle = `rgba(100, 255, 218, ${opacityValue})`;
                   ctx.lineWidth = 1;
                   ctx.beginPath();
                   ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                   ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                   ctx.stroke();
                }
            }
        }
    }

    // Animation loop to update and draw particles and connections.
    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, innerWidth, innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    // Recalculate canvas and particles on window resize.
    window.addEventListener('resize', () => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();
    
    // --- 3D TILT EFFECT FOR PROJECT CARDS ---
    // This gives project cards a cool 3D tilt effect on mouse hover.
    const cards = document.querySelectorAll('.project-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateX = -y / 20; // Adjust divisor for sensitivity
            const rotateY = x / 20;

            // Apply the 3D transform style
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        // Reset the transform when the mouse leaves the card
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // --- SCROLL REVEAL ANIMATION ---
    // This uses Intersection Observer to fade in elements as they are scrolled into view.
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.15 }); // Trigger when 15% of the element is visible

    // Observe all elements with the '.reveal' class
    const revealElements = document.querySelectorAll('.reveal');
    revealElements.forEach(el => observer.observe(el));
});