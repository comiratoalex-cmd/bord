/* ============================================================
   Pastel Border Generator — SCRIPT PREMIUM
   Funções:
   ✔ Shapes
   ✔ Gradiente pastel animado
   ✔ 2–4 cores
   ✔ Glow / Neon / Blur
   ✔ Opacidade
   ✔ Resolução OBS
   ✔ Presets
   ✔ URL Save
   ✔ Dark/Light Theme
   ✔ Tabs
   ✔ Exportar SVG
   ✔ Debug (grid / viewbox)
   ✔ Copiar link OBS
============================================================ */

// -------------------------------------------------------------
// ELEMENTOS
// -------------------------------------------------------------
const preview = document.getElementById("preview");

const shape = document.getElementById("shape");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const radius = document.getElementById("radius");
const stroke = document.getElementById("stroke");
const opacity = document.getElementById("opacity");
const speed = document.getElementById("speed");
const resolution = document.getElementById("resolution");

const modeSelect = document.getElementById("color-mode");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const color3 = document.getElementById("color3");
const color4 = document.getElementById("color4");

const glow = document.getElementById("glow");
const debug = document.getElementById("debug");

const btnGenerate = document.getElementById("generate");
const btnCopy = document.getElementById("copy");
const obsLink = document.getElementById("obs-link");

const btnSaveURL = document.getElementById("save-url");
const urlOutput = document.getElementById("url-output");

const toggleTheme = document.getElementById("toggle-theme");


// -------------------------------------------------------------
// TABS
// -------------------------------------------------------------
document.querySelectorAll(".tab").forEach(tab => {
    tab.addEventListener("click", () => {
        document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
        document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

        tab.classList.add("active");
        document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
    });
});


// -------------------------------------------------------------
// TEMA CLARO / ESCURO
// -------------------------------------------------------------
toggleTheme.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    document.body.classList.toggle("light");

    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
});

// restaurar tema
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.remove("light");
    document.body.classList.add("dark");
}


// -------------------------------------------------------------
// APLICAR PRESETS
// -------------------------------------------------------------
const presets = {
    pastel: ["#ffb8c6", "#b6d9ff", "#ffe7a3", "#e8c8ff"],
    sakura: ["#ffd1e8", "#ffb7d5", "#ffc9e9", "#ffeef6"],
    ocean:  ["#9ed6ff", "#bff2ff", "#83caff", "#d6f7ff"],
    space:  ["#ff86d8", "#9b6bff", "#6ecbff", "#ffe16b"],
    toxic:  ["#b1ff3d", "#5eff00", "#00ffaa", "#00ffe7"],
    sunset: ["#ff8e72", "#ffd56b", "#ffbc6b", "#ffa272"]
};

document.querySelectorAll(".preset").forEach(p => {
    p.addEventListener("click", () => {
        const pset = presets[p.dataset.preset];
        color1.value = pset[0];
        color2.value = pset[1];
        color3.value = pset[2];
        color4.value = pset[3];
        updatePreview();
    });
});


// -------------------------------------------------------------
// SALVAR URL COM PRESET
// -------------------------------------------------------------
btnSaveURL.addEventListener("click", () => {
    const params = new URLSearchParams({
        shape: shape.value,
        w: widthInput.value,
        h: heightInput.value,
        r: radius.value,
        stroke: stroke.value,
        speed: speed.value,
        mode: modeSelect.value,
        c1: color1.value,
        c2: color2.value,
        c3: color3.value,
        c4: color4.value,
        glow: glow.value,
        opacity: opacity.value
    });

    const url = `${window.location.origin}${window.location.pathname}?${params}`;
    urlOutput.value = url;
});


// -------------------------------------------------------------
// APLICAR RESOLUÇÃO OBS AUTOMÁTICA
// -------------------------------------------------------------
resolution.addEventListener("change", () => {
    if (resolution.value.includes("x")) {
        const [w, h] = resolution.value.split("x");
        widthInput.value = w;
        heightInput.value = h;
        updatePreview();
    }
});


// -------------------------------------------------------------
// FUNÇÃO PRINCIPAL: UPDATE PREVIEW
// -------------------------------------------------------------
function updatePreview() {
    preview.innerHTML = "";

    const w = +widthInput.value;
    const h = +heightInput.value;
    const r = +radius.value;
    const s = +stroke.value;
    const op = +opacity.value;
    const spd = +speed.value;
    const type = shape.value;

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
            <animate attributeName="x2" values="600;0"  dur="${spd}s" repeatCount="indefinite"/>
        </linearGradient>
    `;

    preview.appendChild(defs);


    // ------------ CRIAR SHAPE --------------
    let shapeEl;

    if (type === "rect") {
        shapeEl = makeSVG("rect", {
            x: s,
            y: s,
            width: w - s * 2,
            height: h - s * 2,
            rx: r,
        });
    }

    if (type === "square") {
        const size = Math.min(w, h);
        shapeEl = makeSVG("rect", {
            x: s,
            y: s,
            width: size - s * 2,
            height: size - s * 2,
            rx: r,
        });
    }

    if (type === "ellipse") {
        shapeEl = makeSVG("ellipse", {
            cx: w / 2,
            cy: h / 2,
            rx: w / 2 - s,
            ry: h / 2 - s,
        });
    }

    if (type === "line-h") {
        shapeEl = makeSVG("line", {
            x1: 0,
            y1: h / 2,
            x2: w,
            y2: h / 2,
        });
    }

    if (type === "line-v") {
        shapeEl = makeSVG("line", {
            x1: w / 2,
            y1: 0,
            x2: w / 2,
            y2: h,
        });
    }


    // --------- APLICAR ESTILO PADRÃO ----------
    shapeEl.setAttribute("stroke", "url(#movingGradient)");
    shapeEl.setAttribute("stroke-width", s);
    shapeEl.setAttribute("fill", "none");
    shapeEl.setAttribute("stroke-linecap", "round");
    shapeEl.setAttribute("stroke-linejoin", "round");
    shapeEl.setAttribute("opacity", op);


    // --------- GLOW / NEON / BLUR ----------
    if (glow.value !== "none") {
        shapeEl.style.filter =
            glow.value === "soft" ? "drop-shadow(0 0 6px currentColor)" :
            glow.value === "neon" ? "drop-shadow(0 0 12px currentColor)" :
            glow.value === "blurred" ? "blur(2px) drop-shadow(0 0 8px currentColor)" :
            "none";
    } else {
        shapeEl.style.filter = "none";
    }


    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
    preview.appendChild(shapeEl);


    // ----------- DEBUG MODE ----------
    preview.classList.remove("grid-bg");
    preview.classList.remove("viewbox-border");

    if (debug.value === "grid") {
        preview.classList.add("grid-bg");
    }
    if (debug.value === "viewbox") {
        preview.classList.add("viewbox-border");
    }
}


// UTIL CREATE SVG
function makeSVG(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}


// -------------------------------------------------------------
// GERAR LINK OBS
// -------------------------------------------------------------
btnGenerate.addEventListener("click", () => {
    const params = new URLSearchParams({
        shape: shape.value,
        w: widthInput.value,
        h: heightInput.value,
        r: radius.value,
        stroke: stroke.value,
        speed: speed.value,
        mode: modeSelect.value,
        c1: color1.value,
        c2: color2.value,
        c3: color3.value,
        c4: color4.value,
        opacity: opacity.value,
        glow: glow.value
    });

    const url = `${window.location.origin}/bord/view.html?${params}`;
    obsLink.value = url;
});


// -------------------------------------------------------------
// COPIAR LINK
// -------------------------------------------------------------
btnCopy.addEventListener("click", () => {
    obsLink.select();
    document.execCommand("copy");
    btnCopy.innerText = "Copiado!";
    setTimeout(() => (btnCopy.innerText = "Copiar"), 1200);
});


// -------------------------------------------------------------
// EXPORTAR SVG
// -------------------------------------------------------------
document.getElementById("export-svg").addEventListener("click", () => {
    const svgData = preview.outerHTML;
    const blob = new Blob([svgData], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "border.svg";
    a.click();
});


// -------------------------------------------------------------
// EVENTOS DE ATUALIZAÇÃO
// -------------------------------------------------------------
[
    shape, widthInput, heightInput,
    radius, stroke, opacity, speed,
    modeSelect, color1, color2, color3, color4,
    glow, debug
].forEach(el => el.addEventListener("input", updatePreview));


// inicializar
updatePreview();
