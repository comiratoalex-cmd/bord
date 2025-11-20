const preview = document.getElementById("preview");
const shapeSel = document.getElementById("shape");
const widthInput = document.getElementById("width");
const heightInput = document.getElementById("height");
const radiusInput = document.getElementById("radius");
const strokeInput = document.getElementById("stroke");
const speedInput = document.getElementById("speed");
const uploadInput = document.getElementById("upload");

// Atualiza o preview ao carregar
updatePreview();

/* ======================================================
   FUNÇÃO PRINCIPAL: Atualizar o preview
====================================================== */
function updatePreview() {
    preview.innerHTML = "";

    const w = +widthInput.value;
    const h = +heightInput.value;
    const r = +radiusInput.value;
    const s = +strokeInput.value;
    const speed = +speedInput.value;
    const type = shapeSel.value;

    /* ======================================================
       GRADIENTE PASTEL ANIMADO
    ====================================================== */
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");

    defs.innerHTML = `
        <linearGradient id="movingGradient" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="600" y2="0">
            <stop offset="0%" stop-color="#ffb8c6" />
            <stop offset="25%" stop-color="#e6b5ff" />
            <stop offset="50%" stop-color="#9ed6ff" />
            <stop offset="75%" stop-color="#7ff0e8" />
            <stop offset="100%" stop-color="#ffe7c0" />

            <!-- MOVIMENTO DO GRADIENTE -->
            <animate attributeName="x1" values="0;-600" dur="${speed}s" repeatCount="indefinite"/>
            <animate attributeName="x2" values="600;0" dur="${speed}s" repeatCount="indefinite"/>
        </linearGradient>
    `;

    preview.appendChild(defs);

    let shape;

    /* ======================================================
       FORMAS DISPONÍVEIS
    ====================================================== */

    // RETÂNGULO
    if (type === "rect") {
        shape = makeSVG("rect", {
            x: s,
            y: s,
            width: w - s * 2,
            height: h - s * 2,
            rx: r
        });
    }

    // QUADRADO
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

    // ELIPSE
    if (type === "ellipse") {
        shape = makeSVG("ellipse", {
            cx: w / 2,
            cy: h / 2,
            rx: (w / 2) - s,
            ry: (h / 2) - s
        });
    }

    // LINHA HORIZONTAL
    if (type === "line-h") {
        shape = makeSVG("line", {
            x1: 0,
            y1: h / 2,
            x2: w,
            y2: h / 2
        });
    }

    // LINHA VERTICAL
    if (type === "line-v") {
        shape = makeSVG("line", {
            x1: w / 2,
            y1: 0,
            x2: w / 2,
            y2: h
        });
    }

    /* PNG — IMPLEMENTAÇÃO DEPOIS */
    if (type === "png") {
        preview.innerHTML =
            "<text x='50%' y='50%' fill='white' font-size='20' text-anchor='middle'>Upload PNG ainda em construção</text>";
        return;
    }

    /* ======================================================
       APLICAR ESTILO
    ====================================================== */
    shape.classList.add("pastel-gradient");
    shape.style.setProperty("--stroke", s);

    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
    preview.appendChild(shape);
}

/* ======================================================
   Função utilitária para criar elementos SVG
====================================================== */
function makeSVG(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let key in attrs) el.setAttribute(key, attrs[key]);
    return el;
}

/* ======================================================
   EVENTOS QUE ATUALIZAM O PREVIEW
====================================================== */
shapeSel.onchange = updatePreview;
widthInput.oninput = updatePreview;
heightInput.oninput = updatePreview;
radiusInput.oninput = updatePreview;
strokeInput.oninput = updatePreview;
speedInput.oninput = updatePreview;

/* ======================================================
   GERAR LINK PARA OBS
====================================================== */
document.getElementById("generate").onclick = () => {
    const url =
        window.location.origin +
        `/bord/?shape=${shapeSel.value}&w=${widthInput.value}&h=${heightInput.value}&stroke=${strokeInput.value}&speed=${speedInput.value}`;

    document.getElementById("obs-link").value = url;
};
