/* =========================================================
   SELECTORS
========================================================= */
const shapeSel = document.getElementById("shape");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const radiusInput = document.getElementById("radius");
const strokeInput = document.getElementById("stroke");
const opacityInput = document.getElementById("opacity");
const speedInput = document.getElementById("speed");

const modeSelect = document.getElementById("color-mode");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const color3 = document.getElementById("color3");
const color4 = document.getElementById("color4");

const glowSel = document.getElementById("glow");
const debugSel = document.getElementById("debug");

const preview = document.getElementById("preview");

/* =========================================================
   UPDATE PREVIEW
========================================================= */
function updatePreview() {
    preview.innerHTML = "";

    const w = +widthInput.value;
    const h = +heightInput.value;
    const r = +radiusInput.value;
    const s = +strokeInput.value;
    const op = +opacityInput.value;
    const speed = +speedInput.value;

    const mode = modeSelect.value;
    const c1v = color1.value;
    const c2v = color2.value;
    const c3v = color3.value;
    const c4v = color4.value;

    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    /* GRADIENTE DINÂMICO EM LOOP PERFEITO */
    const grad = document.createElementNS("http://www.w3.org/2000/svg", "linearGradient");
    grad.setAttribute("id", "g");
    grad.setAttribute("gradientUnits", "userSpaceOnUse");
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "0");
    grad.setAttribute("x2", w);
    grad.setAttribute("y2", "0");

    function addStop(offset, color) {
        const st = document.createElementNS("http://www.w3.org/2000/svg", "stop");
        st.setAttribute("offset", offset);
        st.setAttribute("stop-color", color);
        grad.appendChild(st);
    }

    if (mode === "2") {
        addStop("0%", c1v);
        addStop("100%", c2v);
    } else {
        addStop("0%", c1v);
        addStop("33%", c2v);
        addStop("66%", c3v);
        addStop("100%", c4v);
    }

    const anim = document.createElementNS("http://www.w3.org/2000/svg", "animateTransform");
    anim.setAttribute("attributeName", "gradientTransform");
    anim.setAttribute("type", "translate");
    anim.setAttribute("from", `-${w} 0`);
    anim.setAttribute("to", `${w} 0`);
    anim.setAttribute("dur", `${speed}s`);
    anim.setAttribute("repeatCount", "indefinite");

    grad.appendChild(anim);
    defs.appendChild(grad);
    preview.appendChild(defs);

    /* SHAPE */
    const shape = createShape(shapeSel.value, w, h, r, s);
    shape.setAttribute("stroke", "url(#g)");
    shape.setAttribute("stroke-width", s);
    shape.setAttribute("fill", "none");
    shape.setAttribute("opacity", op);
    shape.setAttribute("stroke-linecap", "round");

    if (glowSel.value === "neon") shape.classList.add("neon-active");
    else shape.classList.remove("neon-active");

    preview.appendChild(shape);

    /* DEBUG */
    if (debugSel.value === "grid") preview.classList.add("grid-bg");
    else preview.classList.remove("grid-bg");

    if (debugSel.value === "viewbox") preview.classList.add("viewbox-border");
    else preview.classList.remove("viewbox-border");
}

/* =========================================================
   SHAPES
========================================================= */
function createShape(type, w, h, r, s) {
    const svgNS = "http://www.w3.org/2000/svg";

    if (type === "rect") {
        const el = document.createElementNS(svgNS, "rect");
        el.setAttribute("x", s);
        el.setAttribute("y", s);
        el.setAttribute("rx", r);
        el.setAttribute("width", w - s * 2);
        el.setAttribute("height", h - s * 2);
        return el;
    }

    if (type === "square") {
        const size = Math.min(w, h);
        const el = document.createElementNS(svgNS, "rect");
        el.setAttribute("x", s);
        el.setAttribute("y", s);
        el.setAttribute("rx", r);
        el.setAttribute("width", size - s * 2);
        el.setAttribute("height", size - s * 2);
        return el;
    }

    if (type === "ellipse") {
        const el = document.createElementNS(svgNS, "ellipse");
        el.setAttribute("cx", w / 2);
        el.setAttribute("cy", h / 2);
        el.setAttribute("rx", w / 2 - s);
        el.setAttribute("ry", h / 2 - s);
        return el;
    }

    if (type === "line-h") {
        const el = document.createElementNS(svgNS, "line");
        el.setAttribute("x1", 0);
        el.setAttribute("y1", h / 2);
        el.setAttribute("x2", w);
        el.setAttribute("y2", h / 2);
        return el;
    }

    if (type === "line-v") {
        const el = document.createElementNS(svgNS, "line");
        el.setAttribute("x1", w / 2);
        el.setAttribute("y1", 0);
        el.setAttribute("x2", w / 2);
        el.setAttribute("y2", h);
        return el;
    }
}

/* =========================================================
   EVENT LISTENERS
========================================================= */
[
    shapeSel, widthInput, heightInput, radiusInput,
    strokeInput, opacityInput, speedInput,
    modeSelect, color1, color2, color3, color4,
    glowSel, debugSel
].forEach(el => el.oninput = updatePreview);

/* =========================================================
   THEME TOGGLE
========================================================= */
document.getElementById("toggle-theme").onclick = () => {
    document.body.classList.toggle("light");
    document.body.classList.toggle("dark");
};

/* =========================================================
   TABS
========================================================= */
document.querySelectorAll(".tab").forEach(tab => {
    tab.onclick = () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add("active");
    };
});

/* =========================================================
   PRESETS
========================================================= */
const presets = {
    pastel: ["#ffb8c6", "#b6d9ff", "#ffe7a3", "#e8c8ff"],
    sakura: ["#ffc1dc", "#ff8fbf", "#ff5fa7", "#ff2e95"],
    ocean: ["#8fd1ff", "#3da9ff", "#0077cc", "#004a8f"],
    space: ["#ff7bf2", "#7b47ff", "#4cb3ff", "#00f5d4"],
    toxic: ["#ccff00", "#66ff00", "#00ff88", "#00ffaa"],
    sunset: ["#ffaf87", "#ff8c42", "#ff3c38", "#a23e48"]
};

document.querySelectorAll(".preset").forEach(btn => {
    btn.onclick = () => {
        const p = presets[btn.dataset.preset];
        color1.value = p[0];
        color2.value = p[1];
        color3.value = p[2];
        color4.value = p[3];
        updatePreview();
    };
});

/* =========================================================
   COPIAR LINK
========================================================= */
document.getElementById("copy").onclick = () => {
    navigator.clipboard.writeText(
        document.getElementById("obs-link").value
    );
};

/* =========================================================
   GENERATE URL FOR OBS
========================================================= */
document.getElementById("generate").onclick = () => {
    const params = new URLSearchParams({
        shape: shapeSel.value,
        w: widthInput.value,
        h: heightInput.value,
        r: radiusInput.value,
        s: strokeInput.value,
        op: opacityInput.value,
        spd: speedInput.value,
        mode: modeSelect.value,
        c1: color1.value,
        c2: color2.value,
        c3: color3.value,
        c4: color4.value,
        glow: glowSel.value
    });

    const base = window.location.href.replace("index.html", "");
    const url = base + "view.html?" + params.toString();
    document.getElementById("obs-link").value = url;
};

/* =========================================================
   PARTICLES
========================================================= */
const partCanvas = document.getElementById("particles");
const ctx = partCanvas.getContext("2d");
let particles = [];

function resizeParticles() {
    partCanvas.width = window.innerWidth;
    partCanvas.height = window.innerHeight;
}
resizeParticles();

window.onresize = resizeParticles;

for (let i = 0; i < 60; i++) {
    particles.push({
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r: 1 + Math.random() * 2,
        s: 0.3 + Math.random() * 0.8,
        dx: -0.5 + Math.random(),
        dy: -0.5 + Math.random()
    });
}

function drawParticles() {
    ctx.clearRect(0, 0, partCanvas.width, partCanvas.height);
    ctx.fillStyle = "#ffffff55";

    particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x += p.dx * p.s;
        p.y += p.dy * p.s;

        if (p.x < 0 || p.x > innerWidth) p.dx *= -1;
        if (p.y < 0 || p.y > innerHeight) p.dy *= -1;
    });

    requestAnimationFrame(drawParticles);
}
drawParticles();

/* =========================================================
   INITIAL RENDER
========================================================= */
updatePreview();
