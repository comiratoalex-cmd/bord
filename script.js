const preview = document.getElementById("preview");
const upload = document.getElementById("upload");

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

let uploadedPNG = null;
let extractedPath = null;

upload.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    uploadedPNG = await loadImage(file);
    extractedPath = await extractPNGContour(uploadedPNG);

    updatePreview();
};

function loadImage(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(file);
    });
}

// -------------------------------------
// ALGORITMO MARCHING SQUARES
// -------------------------------------
async function extractPNGContour(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, img.width, img.height);
    const alpha = imgData.data;

    const threshold = 10;
    const points = [];

    for (let y = 0; y < img.height; y++) {
        for (let x = 0; x < img.width; x++) {

            const i = (y * img.width + x) * 4;
            if (alpha[i + 3] > threshold) points.push([x, y]);
        }
    }

    if (points.length === 0) return null;

    // Convex Hull -> borda exata simplificada
    const hull = convexHull(points);
    return hullToPath(hull);
}

// Convex Hull - Graham Scan
function convexHull(points) {
    points.sort((a,b)=> a[0]===b[0]?a[1]-b[1]:a[0]-b[0]);

    const cross = (o,a,b)=> (a[0]-o[0])*(b[1]-o[1]) - (a[1]-o[1])*(b[0]-o[0]);
    const lower = [];
    const upper = [];

    for (const p of points) {
        while (lower.length>=2 && cross(lower[lower.length-2], lower[lower.length-1], p)<=0)
            lower.pop();
        lower.push(p);
    }

    for (let i=points.length-1;i>=0;i--) {
        const p = points[i];
        while (upper.length>=2 && cross(upper[upper.length-2], upper[upper.length-1], p)<=0)
            upper.pop();
        upper.push(p);
    }

    upper.pop();
    lower.pop();

    return lower.concat(upper);
}

function hullToPath(hull) {
    let d = `M ${hull[0][0]},${hull[0][1]} `;
    for (let i=1;i<hull.length;i++) {
        d += `L ${hull[i][0]},${hull[i][1]} `;
    }
    d += "Z";
    return d;
}

// ----------------------------------------
// ATUALIZAR PREVIEW
// ----------------------------------------
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
            <animate attributeName="x1" values="0;-600" dur="${speed}s" repeatCount="indefinite"/>
            <animate attributeName="x2" values="600;0" dur="${speed}s" repeatCount="indefinite"/>
        </linearGradient>
    `;
    preview.appendChild(defs);

    let shape;

    // ---------------------
    // FORMAS PADRÃO
    // ---------------------
    if (type !== "png") {
        shape = makeShape(type, w, h, r, s);
    }

    // ---------------------
    // MODO PNG
    // ---------------------
    if (type === "png") {
        if (!uploadedPNG || !extractedPath) {
            preview.innerHTML =
                "<text x='50%' y='50%' fill='white' font-size='20' text-anchor='middle'>Envie um PNG...</text>";
            return;
        }

        shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shape.setAttribute("d", extractedPath);

        const scaleX = w / uploadedPNG.width;
        const scaleY = h / uploadedPNG.height;

        shape.setAttribute("transform", `scale(${scaleX}, ${scaleY})`);
    }

    shape.setAttribute("stroke", "url(#movingGradient)");
    shape.setAttribute("stroke-width", s);
    shape.setAttribute("fill", "none");
    shape.setAttribute("stroke-linejoin", "round");
    shape.setAttribute("stroke-linecap", "round");

    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
    preview.appendChild(shape);
}

function makeShape(type, w, h, r, s) {
    if (type === "rect") {
        return makeSVG("rect", { x: s, y: s, width: w-s*2, height: h-s*2, rx: r });
    }
    if (type === "square") {
        const size = Math.min(w,h);
        return makeSVG("rect", { x: s, y: s, width: size-s*2, height: size-s*2, rx: r });
    }
    if (type === "ellipse") {
        return makeSVG("ellipse", { cx: w/2, cy: h/2, rx: w/2-s, ry: h/2-s });
    }
    if (type === "line-h") {
        return makeSVG("line", { x1: 0, y1: h/2, x2: w, y2: h/2 });
    }
    if (type === "line-v") {
        return makeSVG("line", { x1: w/2, y1: 0, x2: w/2, y2: h });
    }
}

function makeSVG(tag, attrs) {
    const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
    for (let k in attrs) el.setAttribute(k, attrs[k]);
    return el;
}

// ---------------------
// EVENTOS
// ---------------------
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
