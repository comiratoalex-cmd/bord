/* ============================================================
   COMIAL PRO — ANIMATED BACKGROUND PARTICLES
============================================================ */

const canvas = document.getElementById("bgCanvas");
const ctx = canvas.getContext("2d");

let particles = [];
let mouse = { x: null, y: null };

resize();
window.addEventListener("resize", resize);

canvas.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function createParticle() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 4 + 2,
        color: pastel()
    };
}

function pastel() {
    const hue = Math.random() * 360;
    return `hsl(${hue}, 80%, 80%)`;
}

for (let i = 0; i < 80; i++) {
    particles.push(createParticle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
        let dx = p.x - mouse.x;
        let dy = p.y - mouse.y;
        let dist = Math.sqrt(dx*dx + dy*dy);

        if (dist < 150) {
            p.x += dx / dist * 3;
            p.y += dy / dist * 3;
        }

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
    });

    requestAnimationFrame(animate);
}

animate();
