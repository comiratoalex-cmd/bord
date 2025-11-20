/* ============================================================
   PARTICLE ENGINE — PASTEL CANDY
============================================================ */

const pCanvas = document.getElementById("particles");
const pCtx = pCanvas.getContext("2d");

function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
}

resizeParticles();
window.addEventListener("resize", resizeParticles);

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
const resolutionSelect = document.getElementById("resolution");

const modeSelect = document.getElementById("color-mode");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const color3 = document.getElementById("color3");
const color4 = document.getElementById("color4");

const glowSelect = document.getElementById("glow");
const debugSelect = document.getElementById("debug");

const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const obsLink = document.getElementById("obs-link");

const saveURLBtn = document.getElementById("save-url");
const urlOutput = document.getElementById("url-output");

const toggleThemeBtn = document.getElementById("toggle-theme");


/* ============================================================
   TABS
============================================================ */

document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
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

if (localStorage.getItem("theme") === "light") {
    document.body.classList.remove("dark");
    document.body.classList.add("light");
}



/* ============================================================
   PRESETS
============================================================ */

const presets = {
    pastel: ["#ffb8c6", "#b6d9ff", "#ffe7a3", "#e8c8ff"],
    sakura: ["#ffd1e8", "#ffb7d5", "#ffc9e9", "#ffeef6"],
    ocean: ["#9ed6ff", "#bff2ff", "#83caff", "#d6f7ff"],
    space: ["#ff86d8", "#9b6bff", "#6ecbff", "#ffe16b"],
    toxic: ["#b1ff3d", "#5eff00", "#00ffaa", "#00ffe7"],
    sunset: ["#ff8e72", "#ffd56b", "#ffbc6b", "#ffa272"]
};

document.querySelectorAll(".preset").forEach(p => {
    p.addEventListener("click", () => {
        const c = presets[p.dataset.preset];
        color1.value = c[0];
        color2.value = c[1];
        color3.value = c[2];
        color4.value = c[3];
        updatePreview();
    });
});



/* ============================================================
   RESOLUÇÕES OBS
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

function updatePreview() {
    preview.innerHTML = "";

    const w = +widthInput.value;
    const h = +heightInput.value;
    const r = +radiusInput.value;
    const s = +strokeInput.value;
    const op = +opacityInput.value;
    const spd = +speedInput.value;
    const type = shapeSel.value;

    const mode = modeSelect.value;
    const c1 = color1.value;
    const c2 = color2.value;
    const c3 = color3.value;
    const c4 = color4.value;

    let stops = "";

    if (mode === "2") {
        stops = `
            <stop offset="0%" stop-color="${c1}" />
            <stop offset="100%" stop-color="${c2}" />
        `;
    }

    if (mode === "4") {
        stops = `
            <stop offset="0%" stop-color="${c1}" />
            <stop offset="33%" stop-color="${c2}" />
            <stop offset="66%" stop-color="${c3}" />
            <stop offset="100%" stop-color="${c4}" />
        `;
    }

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
       FORMAS
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


    /* ========= LINHA H ========= */
    if (type === "line-h") {
        preview.setAttribute("viewBox", `0 0 ${w} ${s * 4}`);
        shape = makeSVG("line", {
            x1: 0,
            y1: s * 2,
            x2: w,
            y2: s * 2
        });
    }

    /* ========= LINHA V ========= */
    if (type === "line-v") {
        preview.setAttribute("viewBox", `0 0 ${s * 4} ${h}`);
        shape = makeSVG("line", {
            x1: s * 2,
            y1: 0,
            x2: s * 2,
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
       GLOW
    ============================================================= */

    if (glowSelect.value === "soft") {
        shape.style.filter = "drop-shadow(0 0 6px currentColor)";
    }

    if (glowSelect.value === "neon") {
        shape.style.filter = "drop-shadow(0 0 18px currentColor)";
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
   FUNÇÃO UTIL DE SVG
============================================================ */

function makeSVG(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}



/* ============================================================
   OBS LINK
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
        glow: glowSelect.value
    });

    obsLink.value = `${window.location.origin}/bord/view.html?${params}`;
});



/* ============================================================
   COPIAR LINK
============================================================ */

copyBtn.addEventListener("click", () => {
    obsLink.select();
    document.execCommand("copy");
    copyBtn.innerText = "Copiado!";
    setTimeout(() => (copyBtn.innerText = "Copiar"), 1200);
});



/* ============================================================
   EXPORT SVG
============================================================ */

document.getElementById("export-svg").addEventListener("click", () => {
    const svgData = preview.outerHTML;

    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "borda.svg";
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
   EVENTOS DE ATUALIZAÇÃO DO PREVIEW
============================================================ */

[
    shapeSel, widthInput, heightInput, radiusInput,
    strokeInput, opacityInput, speedInput,
    modeSelect, color1, color2, color3, color4,
    glowSelect, debugSelect
].forEach(el => el.addEventListener("input", updatePreview));



/* ============================================================
   INICIAR
============================================================ */
updatePreview();
