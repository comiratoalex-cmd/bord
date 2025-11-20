/* ============================================================
   ELEMENTOS DO DOM
============================================================ */
const preview = document.getElementById("preview");

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

const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const obsLink = document.getElementById("obs-link");

const tabs = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");
const themeToggle = document.getElementById("toggle-theme");

/* ============================================================
   MUDAR TABS
============================================================ */
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        const target = tab.dataset.tab;

        tabContents.forEach(c => {
            c.classList.remove("active");
            if (c.id === "tab-" + target) c.classList.add("active");
        });
    });
});

/* ============================================================
   TEMA ESCURO / CLARO
============================================================ */
themeToggle.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
        document.body.classList.remove("dark");
        document.body.classList.add("light");
        themeToggle.textContent = "☀️";
    } else {
        document.body.classList.remove("light");
        document.body.classList.add("dark");
        themeToggle.textContent = "🌙";
    }
});

/* ============================================================
   FUNÇÃO PRINCIPAL – DESENHAR PREVIEW
============================================================ */
function updatePreview() {
    preview.innerHTML = "";

    const w = +widthInput.value;
    const h = +heightInput.value;
    const r = +radiusInput.value;
    const s = +strokeInput.value;
    const o = +opacityInput.value;
    const speed = +speedInput.value;
    const type = shapeSel.value;

    /* =========================
       GRADIENTE DINÂMICO
    ========================== */
    let stops = "";

    if (modeSelect.value === "2") {
        stops = `
            <stop offset="0%" stop-color="${color1.value}" />
            <stop offset="100%" stop-color="${color2.value}" />
        `;
    }

    if (modeSelect.value === "4") {
        stops = `
            <stop offset="0%" stop-color="${color1.value}" />
            <stop offset="33%" stop-color="${color2.value}" />
            <stop offset="66%" stop-color="${color3.value}" />
            <stop offset="100%" stop-color="${color4.value}" />
        `;
    }

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
       <linearGradient id="movingGradient" gradientUnits="userSpaceOnUse">
    ${stops}
    <animateTransform 
        attributeName="gradientTransform"
        type="translate"
        from="-600 0"
        to="600 0"
        dur="${speed}s"
        repeatCount="indefinite"
    />
</linearGradient>
    `;
    preview.appendChild(defs);

    /* =========================
       CRIA A FORMA
    ========================== */
    let shape = makeShape(type, w, h, r, s);

    shape.setAttribute("stroke", "url(#movingGradient)");
    shape.setAttribute("stroke-width", s);
    shape.setAttribute("stroke-opacity", o);
    shape.setAttribute("fill", "none");

    if (glowSel.value === "neon") {
        shape.classList.add("neon-active");
    }

    /* DEBUG MODES */
    if (debugSel.value === "grid") {
        preview.classList.add("grid-bg");
    } else {
        preview.classList.remove("grid-bg");
    }

    if (debugSel.value === "viewbox") {
        shape.classList.add("viewbox-border");
    }

    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
    preview.appendChild(shape);
}

/* ============================================================
   CRIA FORMAS (inclui linhas corrigidas)
============================================================ */
function makeShape(type, w, h, r, s) {

    if (type === "rect") {
        return makeSVG("rect", {
            x: s,
            y: s,
            width: w - s * 2,
            height: h - s * 2,
            rx: r
        });
    }

    if (type === "square") {
        const size = Math.min(w, h);
        return makeSVG("rect", {
            x: s,
            y: s,
            width: size - s * 2,
            height: size - s * 2,
            rx: r
        });
    }

    if (type === "ellipse") {
        return makeSVG("ellipse", {
            cx: w / 2,
            cy: h / 2,
            rx: (w / 2) - s,
            ry: (h / 2) - s
        });
    }

    if (type === "line-h") {
        return makeSVG("line", {
            x1: s,
            y1: h / 2,
            x2: w - s,
            y2: h / 2,
            "stroke-linecap": "round"
        });
    }

    if (type === "line-v") {
        return makeSVG("line", {
            x1: w / 2,
            y1: s,
            x2: w / 2,
            y2: h - s,
            "stroke-linecap": "round"
        });
    }
}

/* ============================================================
   UTIL SVG
============================================================ */
function makeSVG(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

/* ============================================================
   EVENTOS
============================================================ */
[
    shapeSel, widthInput, heightInput, radiusInput, strokeInput,
    opacityInput, speedInput, modeSelect, color1, color2, color3, color4,
    glowSel, debugSel
].forEach(el => el.oninput = updatePreview);

/* ============================================================
   GERAR URL OBS
============================================================ */
generateBtn.onclick = () => {
    const params = new URLSearchParams({
        shape: shapeSel.value,
        w: widthInput.value,
        h: heightInput.value,
        r: radiusInput.value,
        s: strokeInput.value,
        o: opacityInput.value,
        speed: speedInput.value,
        mode: modeSelect.value,
        c1: color1.value,
        c2: color2.value,
        c3: color3.value,
        c4: color4.value,
        glow: glowSel.value,
        debug: debugSel.value
    });

    obsLink.value =
        window.location.origin + "/view.html?" + params.toString();
};

/* ============================================================
   COPIAR LINK
============================================================ */
copyBtn.onclick = () => {
    obsLink.select();
    document.execCommand("copy");
};

/* ============================================================
   INICIAR
============================================================ */
updatePreview();

/* ============================================================
   PARTICLES EFFECT (canvas)
============================================================ */
const particleCanvas = document.getElementById("particles");
const ctx = particleCanvas.getContext("2d");

function resizeParticles() {
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener("resize", resizeParticles);

let particles = [];
for (let i = 0; i < 90; i++) {
    particles.push({
        x: Math.random() * particleCanvas.width,
        y: Math.random() * particleCanvas.height,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        color: `hsl(${Math.random() * 360}, 70%, 70%)`
    });
}

function animateParticles() {
    ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    particles.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > particleCanvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > particleCanvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
    });

    requestAnimationFrame(animateParticles);
}
animateParticles();
