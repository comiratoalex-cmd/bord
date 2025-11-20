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
    // ----------------
