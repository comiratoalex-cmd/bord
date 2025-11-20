// ===============================
// ELEMENTOS DO DOM
// ===============================
const preview = document.getElementById("preview");
const shapeSel = document.getElementById("shape");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const radiusInput = document.getElementById("radius");
const strokeInput = document.getElementById("stroke");
const speedInput = document.getElementById("speed");

const modeSelect = document.getElementById("color-mode");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const color3 = document.getElementById("color3");
const color4 = document.getElementById("color4");

updatePreview();

// ===============================
// FUNÇÃO PRINCIPAL — ATUALIZAR PREVIEW
// ===============================
function updatePreview() {
    preview.innerHTML = "";

    const w = +widthInput.value;
    const h = +heightInput.value;
    const r = +radiusInput.value;
    const s = +strokeInput.value;
    const speed = +speedInput.value;
    const type = shapeSel.value;

    const mode = modeSelect.value;
    const c1 = color1.value;
    const c2 = color2.value;
    const c3 = color3.value;
    const c4 = color4.value;

    // ---------------------------
    // GRADIENTE DINÂMICO
    // ---------------------------
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
        <linearGradient id="movingGradient" gradientUnits="userSpaceOnUse"
            x1="0" y1="0" x2="600" y2="0">

            ${stops}

            <animate attributeName="x1" values="0;-600" dur="${speed}s"
                repeatCount="indefinite"/>
            <animate attributeName="x2" values="600;0" dur="${speed}s"
                repeatCount="indefinite"/>
        </linearGradient>
    `;

    preview.appendChild(defs);

    let shape;

    // ---------------------------
    // FORMAS DISPONÍVEIS
    // ---------------------------
    if (type === "rect") {
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
        shape = makeSVG("rect", {
            x: s,
            y: s,
            width: size - s * 2,
            height: size - s * 2,
            rx: r
        });
    }

    if (type === "ellipse") {
        shape = makeSVG("ellipse", {
            cx: w / 2,
            cy: h / 2,
            rx: (w / 2) - s,
            ry: (h / 2) - s
        });
    }

    if (type === "line-h") {
        shape = makeSVG("line", {
            x1: 0,
            y1: h / 2,
            x2: w,
            y2: h / 2
        });
    }

    if (type === "line-v") {
        shape = makeSVG("line", {
            x1: w / 2,
            y1: 0,
            x2: w / 2,
            y2: h
        });
    }

    if (type === "png") {
        preview.innerHTML =
            "<text x='50%' y='50%' fill='white' font-size='20' text-anchor='middle'>Modo PNG em construção</text>";
        return;
    }

    // ---------------------------
    // APLICAR ESTILO
    // ---------------------------
    shape.classList.add("pastel-gradient");
    shape.style.setProperty("--stroke", s);

    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
    preview.appendChild(shape);
}

// ===============================
// FUNÇÃO UTILITÁRIA SVG
// ===============================
function makeSVG(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let key in attrs) el.setAttribute(key, attrs[key]);
    return el;
}

// ===============================
// EVENTOS QUE ATUALIZAM O PREVIEW
// ===============================
shapeSel.onchange = updatePreview;
widthInput.oninput = updatePreview;
heightInput.oninput = updatePreview;
radiusInput.oninput = updatePreview;
strokeInput.oninput = updatePreview;
speedInput.oninput = updatePreview;

modeSelect.onchange = updatePreview;
color1.oninput = updatePreview;
color2.oninput = updatePreview;
color3.oninput = updatePreview;
color4.oninput = updatePreview;

// ===============================
// GERAR LINK PARA OBS
// ===============================
document.getElementById("generate").onclick = () => {

    const shape = shapeSel.value;
    const w = widthInput.value;
    const h = heightInput.value;
    const stroke = strokeInput.value;
    const speed = speedInput.value;

    const mode = modeSelect.value;

    const c1 = color1.value;
    const c2 = color2.value;
    const c3 = color3.value;
    const c4 = color4.value;

    const url =
        window.location.origin +
        `/bord/view.html` +
        `?shape=${shape}` +
        `&w=${w}` +
        `&h=${h}` +
        `&stroke=${stroke}` +
        `&speed=${speed}` +
        `&mode=${mode}` +
        `&c1=${encodeURIComponent(c1)}` +
        `&c2=${encodeURIComponent(c2)}` +
        `&c3=${encodeURIComponent(c3)}` +
        `&c4=${encodeURIComponent(c4)}`;

    document.getElementById("obs-link").value = url;
};
