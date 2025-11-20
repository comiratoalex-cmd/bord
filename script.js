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
const resolutionSel = document.getElementById("resolution");

const modeSelect = document.getElementById("color-mode");
const color1 = document.getElementById("color1");
const color2 = document.getElementById("color2");
const color3 = document.getElementById("color3");
const color4 = document.getElementById("color4");

const glowSel = document.getElementById("glow");
const debugSel = document.getElementById("debug");

const generateBtn = document.getElementById("generate");
const copyBtn = document.getElementById("copy");
const obsLinkBox = document.getElementById("obs-link");

/* ============================================================
   FUNÇÃO PRINCIPAL — ATUALIZA PREVIEW
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

    const mode = modeSelect.value;
    const c1 = color1.value;
    const c2 = color2.value;
    const c3 = color3.value;
    const c4 = color4.value;

    const glow = glowSel.value;
    const debug = debugSel.value;

    /* -----------------------------
       GRADIENTE COM LOOP PERFEITO
    ------------------------------ */
    let stops = "";

    if (mode === "2") {
        stops = `
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="100%" stop-color="${c2}"/>
        `;
    }

    if (mode === "4") {
        stops = `
            <stop offset="0%" stop-color="${c1}"/>
            <stop offset="33%" stop-color="${c2}"/>
            <stop offset="66%" stop-color="${c3}"/>
            <stop offset="100%" stop-color="${c4}"/>
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

    /* -----------------------------
       SHAPES DISPONÍVEIS
    ------------------------------ */
    let shape;

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
            rx: w / 2 - s,
            ry: h / 2 - s
        });
    }

    if (type === "line-h") {
        shape = makeSVG("line", {
            x1: s,
            y1: h / 2,
            x2: w - s,
            y2: h / 2,
            "stroke-linecap": "round"
        });
    }

    if (type === "line-v") {
        shape = makeSVG("line", {
            x1: w / 2,
            y1: s,
            x2: w / 2,
            y2: h - s,
            "stroke-linecap": "round"
        });
    }

    shape.setAttribute("stroke", "url(#movingGradient)");
    shape.setAttribute("stroke-width", s);
    shape.setAttribute("stroke-opacity", o);
    shape.setAttribute("fill", "none");

    if (glow === "neon") {
        shape.classList.add("neon-active");
    }

    if (debug === "grid") {
        preview.classList.add("grid-bg");
    } else {
        preview.classList.remove("grid-bg");
    }

    if (debug === "viewbox") {
        shape.classList.add("viewbox-border");
    }

    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
    preview.appendChild(shape);
}

/* ============================================================
   SVG UTILITY
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
    opacityInput, speedInput, resolutionSel, modeSelect,
    color1, color2, color3, color4, glowSel, debugSel
].forEach(e => e.oninput = updatePreview);

updatePreview();

/* ============================================================
   BOTÃO GERAR (CORRIGIDO PARA GITHUB PAGES)
============================================================ */
generateBtn.onclick = () => {

    const params = new URLSearchParams({
        shape: shapeSel.value,
        w: widthInput.value,
        h: heightInput.value,
        r: radiusInput.value,
        stroke: strokeInput.value,
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

    const base = window.location.href.replace("index.html", "");
    const url = base + "view.html?" + params.toString();

    obsLinkBox.value = url;
};

/* ============================================================
   BOTÃO COPIAR
============================================================ */
copyBtn.onclick = async () => {
    await navigator.clipboard.writeText(obsLinkBox.value);
    copyBtn.innerText = "Copiado!";
    setTimeout(() => copyBtn.innerText = "Copiar", 1000);
};
