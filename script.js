/* ===========================================================
   UTILIDADES
=========================================================== */
const $ = (sel) => document.querySelector(sel);
const svgNS = "http://www.w3.org/2000/svg";

/* ===========================================================
   ELEMENTOS PRINCIPAIS
=========================================================== */
const preview = $("#preview");

const shapeSel = $("#shape");
const widthInput = $("#width");
const heightInput = $("#height");
const radiusInput = $("#radius");
const strokeInput = $("#stroke");
const speedInput = $("#speed");
const opacityInput = $("#opacity");

const modeSelect = $("#color-mode");
const color1 = $("#color1");
const color2 = $("#color2");
const color3 = $("#color3");
const color4 = $("#color4");

const glowSelect = $("#glow");
const debugSelect = $("#debug");

const obsInput = $("#obs-link");
const generateBtn = $("#generate");

const tabButtons = document.querySelectorAll(".tab");
const tabContents = document.querySelectorAll(".tab-content");

const animationGrid = $("#animation-grid");

/* ===========================================================
   TABS
=========================================================== */
tabButtons.forEach((tab) => {
    tab.onclick = () => {
        tabButtons.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");

        tabContents.forEach(c => c.classList.remove("active"));
        $("#" + tab.dataset.tab).classList.add("active");
    };
});

/* ===========================================================
   SHAPES (principal e mini-previews)
=========================================================== */
function makeShape(type, w, h, r, s) {
    if (type === "rect" || type === "square") {
        const size = type === "square" ? Math.min(w, h) : null;
        const el = document.createElementNS(svgNS, "rect");
        el.setAttribute("x", s);
        el.setAttribute("y", s);
        el.setAttribute("rx", r);
        el.setAttribute("width", (size ? size : w) - s * 2);
        el.setAttribute("height", (size ? size : h) - s * 2);
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

/* ===========================================================
   GRADIENTES & EFEITOS
=========================================================== */

const animationEffects = {
    "horizontal": { transform: "translate(-100%,0) ; translate(100%,0) ; translate(-100%,0)" },
    "vertical":   { transform: "translate(0,-100%) ; translate(0,100%) ; translate(0,-100%)" },
    "diagonal":   { transform: "translate(-100%,-100%) ; translate(100%,100%) ; translate(-100%,-100%)" },
    "circular":   { transform: "rotate(0 0 0) ; rotate(360 0 0) ; rotate(0 0 0)" },

    "pulse-slide": {
        transform: "translate(-100%,0) ; translate(100%,0) ; translate(-100%,0)",
        pulse: true
    },

    "rgb": { mode: "rgb" },
    "vaporwave": { mode: "vaporwave" },
    "prism": { mode: "prism" },
    "cinema": { mode: "blend" }
};

let currentAnimation = "horizontal";

/* ===========================================================
   CRIAR GRADIENTE ANIMADO
=========================================================== */
function buildGradient(defs, id, w, h, speed) {
    let grad = document.createElementNS(svgNS, "linearGradient");
    grad.setAttribute("id", id);
    grad.setAttribute("gradientUnits", "userSpaceOnUse");
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "0");
    grad.setAttribute("x2", w);
    grad.setAttribute("y2", "0");

    function addStop(offset, color) {
        const s = document.createElementNS(svgNS, "stop");
        s.setAttribute("offset", offset);
        s.setAttribute("stop-color", color);
        grad.appendChild(s);
    }

    const mode = modeSelect.value;
    const c1 = color1.value;
    const c2 = color2.value;
    const c3 = color3.value;
    const c4 = color4.value;

    if (mode === "2") {
        addStop("0%", c1);
        addStop("100%", c2);
    } else {
        addStop("0%", c1);
        addStop("33%", c2);
        addStop("66%", c3);
        addStop("100%", c4);
    }

    const anim = document.createElementNS(svgNS, "animateTransform");
    anim.setAttribute("attributeName", "gradientTransform");
    anim.setAttribute("type", "translate");
    anim.setAttribute("dur", `${speed}s`);
    anim.setAttribute("repeatCount", "indefinite");

    let effect = animationEffects[currentAnimation];
    if (!effect) effect = animationEffects["horizontal"];

    anim.setAttribute("keyTimes", "0;0.5;1");

    if (effect.transform) {
        anim.setAttribute("values", effect.transform);
    }

    grad.appendChild(anim);
    defs.appendChild(grad);
}

/* ===========================================================
   ATUALIZAR PREVIEW PRINCIPAL
=========================================================== */
function updatePreview() {
    const w = +widthInput.value;
    const h = +heightInput.value;
    const r = +radiusInput.value;
    const s = +strokeInput.value;
    const speed = +speedInput.value;
    const op = +opacityInput.value;
    const type = shapeSel.value;

    preview.innerHTML = "";
    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const defs = document.createElementNS(svgNS, "defs");
    preview.appendChild(defs);

    buildGradient(defs, "grad1", w, h, speed);

    const shape = makeShape(type, w, h, r, s);
    shape.setAttribute("fill", "none");
    shape.setAttribute("stroke", "url(#grad1)");
    shape.setAttribute("stroke-width", s);
    shape.setAttribute("opacity", op);
    shape.setAttribute("stroke-linecap", "round");

    // Glow
    shape.classList.toggle("neon", glowSelect.value === "neon");

    preview.appendChild(shape);

    // Debug
    $("#preview-area").classList.toggle("grid-bg", debugSelect.value === "grid");
    preview.classList.toggle("viewbox-outline", debugSelect.value === "viewbox");
}

/* ===========================================================
   MINI-PREVIEW (cards)
=========================================================== */
function createMiniPreview(effectName) {
    const w = 160;
    const h = 50;
    const s = 4;

    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const defs = document.createElementNS(svgNS, "defs");
    svg.appendChild(defs);

    buildGradient(defs, "gradMini", w, h, 6);

    const shape = makeShape("rect", w, h, 10, s);
    shape.setAttribute("fill", "none");
    shape.setAttribute("stroke", "url(#gradMini)");
    shape.setAttribute("stroke-width", s);

    svg.appendChild(shape);

    return svg;
}

/* ===========================================================
   CARDS DE ANIMAÇÃO
=========================================================== */
function buildAnimationCards() {
    animationGrid.innerHTML = "";

    Object.keys(animationEffects).forEach(name => {
        const card = document.createElement("div");
        card.className = "animation-card";

        const title = document.createElement("div");
        title.className = "animation-card-title";
        title.textContent = name;

        const previewDiv = document.createElement("div");
        previewDiv.className = "animation-preview";

        const mini = createMiniPreview(name);
        previewDiv.appendChild(mini);

        card.appendChild(title);
        card.appendChild(previewDiv);

        card.onclick = () => {
            currentAnimation = name;
            updatePreview();
        };

        animationGrid.appendChild(card);
    });
}

/* ===========================================================
   GERAR URL OBS
=========================================================== */
generateBtn.onclick = () => {
    const params = new URLSearchParams();

    params.set("shape", shapeSel.value);
    params.set("w", widthInput.value);
    params.set("h", heightInput.value);
    params.set("r", radiusInput.value);
    params.set("s", strokeInput.value);
    params.set("spd", speedInput.value);
    params.set("op", opacityInput.value);

    params.set("mode", modeSelect.value);
    params.set("c1", color1.value);
    params.set("c2", color2.value);
    params.set("c3", color3.value);
    params.set("c4", color4.value);

    params.set("glow", glowSelect.value);
    params.set("debug", debugSelect.value);

    params.set("anim", currentAnimation);

    obsInput.value = `${location.origin}/src/view.html?${params.toString()}`;
};

/* Copy button */
$("#copy").onclick = () => {
    navigator.clipboard.writeText(obsInput.value);
    alert("URL copiada!");
};

/* ===========================================================
   PARTICLES
=========================================================== */
function startParticles() {
    const canvas = $("#particles");
    const ctx = canvas.getContext("2d");

    canvas.width = innerWidth;
    canvas.height = innerHeight;

    const particles = [];
    for (let i = 0; i < 70; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            s: Math.random() * 2 + 1,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4
        });
    }

    function loop() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.fillStyle = "#ffffff44";
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
            ctx.fill();
        }

        requestAnimationFrame(loop);
    }
    loop();
}

/* ===========================================================
   EVENTOS
=========================================================== */
[
    shapeSel, widthInput, heightInput, radiusInput, strokeInput,
    speedInput, opacityInput,
    modeSelect, color1, color2, color3, color4,
    glowSelect, debugSelect
].forEach(el => el.oninput = updatePreview);

/* ===========================================================
   INIT
=========================================================== */
startParticles();
buildAnimationCards();
updatePreview();
