const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let particles = [];

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resize();
window.onresize = resize;

function newParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: 2 + Math.random() * 3,
        speedY: -0.3 - Math.random() * 0.7,
        color: `hsl(${Math.random() * 360}, 70%, 75%)`
    };
}

for (let i = 0; i < 140; i++) particles.push(newParticle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
        p.y += p.speedY;

        if (p.y < -10) {
            particles[i] = newParticle();
            particles[i].y = canvas.height + 10;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}

animateParticles();
