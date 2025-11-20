/* ============================================================
   PARTICLE ENGINE — Pastel Candy Particles
============================================================ */

const pCanvas = document.getElementById("particles");
const pCtx = pCanvas.getContext("2d");

function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}

resizeParticles();
window.onresize = resizeParticles;

let particles = [];

function createParticles() {
    particles = [];

    const colors = ["#ffb8c6", "#b6d9ff", "#ffe7a3", "#e8c8ff"];

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * pCanvas.width,
            y: Math.random() * pCanvas.height,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
        });
    }
}

function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

    particles.forEach(p => {
        pCtx.beginPath();
        pCtx.fillStyle = p.color + "66";
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fill();

        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;
    });

    requestAnimationFrame(drawParticles);
}

createParticles();
drawParticles();
