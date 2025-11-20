/* ============================================================
   PARTICLES — PASTEL & REACTIVE
============================================================ */

const pCanvas = document.getElementById("particles");
const pCtx = pCanvas.getContext("2d");
let mouse = { x: null, y: null };

function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener("resize", resizeParticles);

let particles = [];

function createParticles() {
    particles.length = 0;

    const colors = ["#ffb8c6", "#b6d9ff", "#ffe7a3", "#e8c8ff"];

    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * pCanvas.width,
            y: Math.random() * pCanvas.height,
            size: Math.random() * 3 + 1,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4
        });
    }
}

function drawParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);

    particles.forEach(p => {
        // Movimento base
        p.x += p.speedX;
        p.y += p.speedY;

        // Interação com mouse
        if (mouse.x !== null) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const dist = Math.sqrt(dx*dx + dy*dy);

            if (dist < 140) {
                p.x += dx * 0.03;
                p.y += dy * 0.03;
            }
        }

        // Loop de borda
        if (p.x < 0) p.x = pCanvas.width;
        if (p.x > pCanvas.width) p.x = 0;
        if (p.y < 0) p.y = pCanvas.height;
        if (p.y > pCanvas.height) p.y = 0;

        // Desenhar
        pCtx.beginPath();
        pCtx.fillStyle = p.color + "66";
        pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        pCtx.fill();
    });

    requestAnimationFrame(drawParticles);
}

createParticles();
drawParticles();

window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

/* ============================================================
   NEVOA PASTEL (FAIXA ANIMADA)
============================================================ */

const fog = document.createElement("div");
fog.classList.add("pastel-fog");
document.body.appendChild(fog);

/* ============================================================
   ELEMENTOS DO PAINEL
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

const glowSelect = document.getElementById("glow");
const debugSelect = document.getElementById("debug");
const resolutionSelect = document.getElementById("resolution");

const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const obsLink = document.getElementById("obs-link");

const saveURLBtn = document.getElementById("save-url");
const urlOutput = document.getElementById("url-output");
const toggleThemeBtn = document.getElementById("toggle-theme");
/* ============================================================
   TABS DO PAINEL
============================================================ */

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        tab.classList.add("active");
        const id = tab.dataset.tab;
        document.getElementById("tab-" + id).classList.add("active");
    });
});

/* ============================================================
   TEMA DARK/LIGHT
============================================================ */

toggleThemeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");

    const theme = document.body.classList.contains("dark") ? "dark" : "light";
    localStorage.setItem("theme", theme);
});

// Carregar tema salvo
if (localStorage.getItem("theme") === "light") {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
}

/* ============================================================
   PRESETS ULTRA COLORIDOS
============================================================ */

const presets = {
    pastel: ["#ffb8c6", "#b6d9ff", "#ffe7a3", "#e8c8ff"],

    rainbow: ["#ff2a6d", "#ff9a00", "#f9f871", "#4dd0e1"],
    candy: ["#ff76c5", "#ffb5e8", "#b28dff", "#aff8db"],
    neon: ["#ff0099", "#ff6a00", "#ffe600", "#00f0ff"],
    galaxy: ["#7f00ff", "#e100ff", "#4b00e0", "#00dbff"],
    aqua: ["#00ffcc", "#00bbff", "#0066ff", "#0000ff"],
    cyberpink: ["#ff009d", "#ff4ecd", "#ff85d0", "#ffe0ff"],
    tropical: ["#ff8200", "#ffd56b", "#61d836", "#1ccad8"],
    aurora: ["#8affd0", "#4deeea", "#74f9ff", "#f2f2f2"],
    pride: ["#ff0000", "#ff8c00", "#ffee00", "#008026"],
    bluetech: ["#0041ff", "#008cff", "#00e5ff", "#5fffff"],
    toxic: ["#b6ff00", "#80ff00", "#00ff80", "#00ffaa"],
    mystic: ["#b300ff", "#d600ff", "#ff00b8", "#ff0090"],

    sakura: ["#ffd1e8", "#ffb7d5", "#ffc9e9", "#ffeef6"],
    ocean: ["#9ed6ff", "#bff2ff", "#83caff", "#d6f7ff"],
    space: ["#ff86d8", "#9b6bff", "#6ecbff", "#ffe16b"],
    sunset: ["#ff8e72", "#ffd56b", "#ffbc6b", "#ffa272"]
};

document.querySelectorAll(".preset").forEach(preset => {
    preset.addEventListener("click", () => {
        const set = presets[preset.dataset.preset];
        color1.value = set[0];
        color2.value = set[1];
        color3.value = set[2];
        color4.value = set[3];
        updatePreview();
    });
});

/* ============================================================
   ALTERAR RESOLUÇÃO DO PREVIEW
============================================================ */

resolutionSelect.addEventListener("change", () => {
    if (resolutionSelect.value.includes("x")) {
        const [w, h] = resolutionSelect.value.split("x");
        widthInput.value = w;
        heightInput.value = h;
        updatePreview();
    }
});
/* ============================================================
   FUNÇÃO PRINCIPAL — UPDATE PREVIEW
============================================================ */

let rainbowTick = 0;

function updatePreview() {
    preview.innerHTML = "";

    const w = +widthInput.value;
    const h = +heightInput.value;
    const r = +radiusInput.value;
    const s = +strokeInput.value;
    const op = +opacityInput.value;
    const spd = +speedInput.value;
    const type = shapeSel.value;

    let c1 = color1.value;
    let c2 = color2.value;
    let c3 = color3.value;
    let c4 = color4.value;

    /* ============================================================
       MODE RAINBOW (auto rainbow)
    ============================================================= */
    if (modeSelect.value === "rainbow-auto") {
        rainbowTick += 0.02;
        c1 = `hsl(${(rainbowTick * 40) % 360}, 90%, 70%)`;
        c2 = `hsl(${(rainbowTick * 40 + 90) % 360}, 90%, 70%)`;
        c3 = `hsl(${(rainbowTick * 40 + 180) % 360}, 90%, 70%)`;
        c4 = `hsl(${(rainbowTick * 40 + 270) % 360}, 90%, 70%)`;
        requestAnimationFrame(updatePreview);
    }

    /* ============================================================
       STOP COLORS
    ============================================================= */
    let stops = "";

    if (modeSelect.value === "2") {
        stops = `
            <stop offset="0%" stop-color="${c1}" />
            <stop offset="100%" stop-color="${c2}" />
        `;
    }

    if (modeSelect.value === "4" || modeSelect.value === "rainbow-auto") {
        stops = `
            <stop offset="0%" stop-color="${c1}" />
            <stop offset="33%" stop-color="${c2}" />
            <stop offset="66%" stop-color="${c3}" />
            <stop offset="100%" stop-color="${c4}" />
        `;
    }

    /* ============================================================
       GRADIENTE ANIMADO
    ============================================================= */
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <linearGradient id="movingGradient" x1="0" y1="0" x2="600" y2="0">
            ${stops}
            <animate attributeName="x1" values="0;-600" dur="${spd}s" repeatCount="indefinite"/>
            <animate attributeName="x2" values="600;0" dur="${spd}s" repeatCount="indefinite"/>
        </linearGradient>
    `;
    preview.appendChild(defs);

    /* ============================================================
       SHAPES
    ============================================================= */
    let shape;

    if (type === "rect") {
        preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
        shape = makeSVG("rect", {
            x: s,
            y: s,
            width: w - s * 2,
            height: h - s * 2,
            rx: r
        });
    }

    if (type === "square") {
        const size = Math.min(w, h);
        preview.setAttribute("viewBox", `0 0 ${size} ${size}`);
        shape = makeSVG("rect", {
            x: s,
            y: s,
            width: size - s * 2,
            height: size - s * 2,
            rx: r
        });
    }

    if (type === "ellipse") {
        preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
        shape = makeSVG("ellipse", {
            cx: w / 2,
            cy: h / 2,
            rx: w / 2 - s,
            ry: h / 2 - s
        });
    }

    /* ============================================================
       LINHA HORIZONTAL — corrigida
    ============================================================= */
    if (type === "line-h") {
        const safeHeight = Math.max(s * 4, 40);
        preview.setAttribute("viewBox", `0 0 ${w} ${safeHeight}`);
        shape = makeSVG("line", {
            x1: 0,
            y1: safeHeight / 2,
            x2: w,
            y2: safeHeight / 2
        });
    }

    /* ============================================================
       LINHA VERTICAL — corrigida
    ============================================================= */
    if (type === "line-v") {
        const safeWidth = Math.max(s * 4, 40);
        preview.setAttribute("viewBox", `0 0 ${safeWidth} ${h}`);
        shape = makeSVG("line", {
            x1: safeWidth / 2,
            y1: 0,
            x2: safeWidth / 2,
            y2: h
        });
    }

    /* ============================================================
       APLICAR ESTILO
    ============================================================= */
    shape.setAttribute("stroke", "url(#movingGradient)");
    shape.setAttribute("stroke-width", s);
    shape.setAttribute("stroke-linecap", "round");
    shape.setAttribute("stroke-linejoin", "round");
    shape.setAttribute("fill", "none");
    shape.setAttribute("opacity", op);

    /* ============================================================
       GLOW / NEON / BLUR / PULSE
    ============================================================= */
    shape.classList.remove("neon-active");

    if (glowSelect.value === "soft") {
        shape.style.filter = "drop-shadow(0 0 6px currentColor)";
    }
    if (glowSelect.value === "neon") {
        shape.classList.add("neon-active");
    }
    if (glowSelect.value === "blurred") {
        shape.style.filter = "blur(2px) drop-shadow(0 0 12px currentColor)";
    }
    if (glowSelect.value === "none") {
        shape.style.filter = "none";
    }

    preview.appendChild(shape);

    /* ============================================================
       DEBUG
    ============================================================= */
    preview.classList.remove("grid-bg", "viewbox-border");
    if (debugSelect.value === "grid") preview.classList.add("grid-bg");
    if (debugSelect.value === "viewbox") preview.classList.add("viewbox-border");
}

/* ============================================================
   FUNÇÃO UTILITÁRIA
============================================================ */
function makeSVG(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}
/* ============================================================
   GERAR LINK PARA OBS
============================================================ */

generateBtn.addEventListener("click", () => {
    const params = new URLSearchParams({
        shape: shapeSel.value,
        w: widthInput.value,
        h: heightInput.value,
        r: radiusInput.value,
        stroke: strokeInput.value,
        speed: speedInput.value,
        opacity: opacityInput.value,
        mode: modeSelect.value,
        c1: color1.value,
        c2: color2.value,
        c3: color3.value,
        c4: color4.value,
        glow: glowSelect.value,
        debug: debugSelect.value
    });

    obsLink.value = `${window.location.origin}/bord/view.html?${params}`;
});

/* ============================================================
   BOTÃO COPIAR LINK OBS
============================================================ */

copyBtn.addEventListener("click", () => {
    obsLink.select();
    document.execCommand("copy");

    copyBtn.innerText = "Copiado!";
    setTimeout(() => (copyBtn.innerText = "Copiar"), 1300);
});

/* ============================================================
   EXPORTAR SVG
============================================================ */

document.getElementById("export-svg").addEventListener("click", () => {
    const svgData = preview.outerHTML;

    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const link = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = link;
    a.download = "border.svg";
    a.click();
});

/* ============================================================
   SALVAR PRESET COMO URL
============================================================ */

saveURLBtn.addEventListener("click", () => {
    const params = new URLSearchParams({
        shape: shapeSel.value,
        w: widthInput.value,
        h: heightInput.value,
        stroke: strokeInput.value,
        mode: modeSelect.value,
        c1: color1.value,
        c2: color2.value,
        c3: color3.value,
        c4: color4.value
    });

    urlOutput.value = `${window.location.origin}${window.location.pathname}?${params}`;
});

/* ============================================================
   EVENTOS QUE ATUALIZAM O PREVIEW AUTOMATICAMENTE
============================================================ */

[
    shapeSel, widthInput, heightInput,
    radiusInput, strokeInput, opacityInput, speedInput,
    modeSelect, color1, color2, color3, color4,
    glowSelect, debugSelect
].forEach(el => el.addEventListener("input", updatePreview));
/* ============================================================
   INICIALIZAÇÃO FINAL
============================================================ */

// Atualiza a pré-visualização ao iniciar
updatePreview();

// Cria partículas iniciais
createParticles();

// Observa movimento do mouse para partículas reativas
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

// Recria partículas ao clicar (efeito especial)
window.addEventListener("click", () => {
    createParticles();
});

// Carrega tema salvo
if (localStorage.getItem("theme") === "light") {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
} else {
    document.body.classList.add("dark");
}

// Observador contínuo do modo arco-íris
if (modeSelect.value === "rainbow-auto") {
    requestAnimationFrame(updatePreview);
}

// Força o preview a atualizar após 100ms
setTimeout(updatePreview, 100);

/* ============================================================
   FIM DO SCRIPT.JS
============================================================ */
