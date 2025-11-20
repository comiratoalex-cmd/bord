// ===============================
// ELEMENTOS
// ===============================
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


// ===============================
// CARREGAR PNG
// ===============================
upload.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    uploadedPNG = await loadImage(file);
    extractedPath = await extractShapeA2(uploadedPNG);

    updatePreview();
};

function loadImage(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(file);
    });
}


// ===============================
// A2 — EXTRAÇÃO DO CONTORNO SUAVE
// ===============================
async function extractShapeA2(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // detectar cor do fundo automaticamente
    const bg = detectBackground(data);

    // gerar máscara binária
    const mask = generateMask(data, bg, 40);

    // extrair contorno via marching squares
    const contour = marchingSquares(mask, canvas.width, canvas.height);

    // suavizar o contorno
    const smooth = smoothPath(contour, 8);

    // converter para path SVG
    return pathToSVG(smooth);
}



// ===============================
// DETECTAR COR DO FUNDO
// ===============================
function detectBackground(imgData) {
    const { width, height, data } = imgData;

    let r = 0, g = 0, b = 0, count = 0;

    for (let x = 0; x < width; x += 5) {
        const i1 = (0 * width + x) * 4;
        const i2 = ((height - 1) * width + x) * 4;
        r += data[i1]; g += data[i1 + 1]; b += data[i1 + 2];
        r += data[i2]; g += data[i2 + 1]; b += data[i2 + 2];
        count += 2;
    }

    return [r / count, g / count, b / count];
}



// ===============================
// GERAR MÁSCARA (FORMA vs FUNDO)
// ===============================
function generateMask(imgData, bg, tolerance) {
    const { data, width, height } = imgData;
    const mask = new Uint8Array(width * height);

    for (let i = 0; i < data.length; i += 4) {
        const pr = data[i];
        const pg = data[i + 1];
        const pb = data[i + 2];

        const d =
            Math.abs(pr - bg[0]) +
            Math.abs(pg - bg[1]) +
            Math.abs(pb - bg[2]);

        mask[i / 4] = d > tolerance ? 1 : 0;
    }

    return mask;
}


// ===============================
// MARCHING SQUARES (A2)
// ===============================
function marchingSquares(mask, width, height) {
    const path = [];

    function inside(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return 0;
        return mask[y * width + x];
    }

    // encontrar pixel inicial
    let start = null;
    for (let i = 0; i < mask.length; i++) {
        if (mask[i] === 1) {
            start = [i % width, Math.floor(i / width)];
            break;
        }
    }
    if (!start) return [];

    let x = start[0];
    let y = start[1];
    let dir = 0; // 0=direita,1=baixo,2=esquerda,3=cima

    do {
        path.push([x, y]);

        // marching squares step:
        const tl = inside(x, y);
        const tr = inside(x + 1, y);
        const bl = inside(x, y + 1);
        const br = inside(x + 1, y + 1);

        const square = tl * 8 + tr * 4 + bl * 2 + br;

        switch (square) {
            case 1: case 5: case 13: dir = 3; break; // subir
            case 8: case 12: case 14: dir = 0; break; // direita
            case 2: case 3: case 11: dir = 1; break; // baixo
            case 4: case 6: case 7: dir = 2; break; // esquerda
            case 9: dir = dir === 0 ? 3 : 0; break;
            case 10: dir = dir === 1 ? 2 : 1; break;
            default: return path;
        }

        if (dir === 0) x++;
        if (dir === 1) y++;
        if (dir === 2) x--;
        if (dir === 3) y--;

    } while (!(x === start[0] && y === start[1]));

    return path;
}



// ===============================
// SUAVIZAÇÃO DO CONTORNO
// ===============================
function smoothPath(points, factor) {
    const smooth = [];
    for (let i = 0; i < points.length; i++) {
        const p0 = points[(i - 1 + points.length) % points.length];
        const p1 = points[i];
        const p2 = points[(i + 1) % points.length];

        smooth.push([
            (p0[0] + p1[0] + p2[0]) / 3,
            (p0[1] + p1[1] + p2[1]) / 3
        ]);
    }
    return smooth;
}



// ===============================
// GERAR PATH SVG
// ===============================
function pathToSVG(points) {
    if (!points.length) return "";

    let d = `M ${points[0][0]},${points[0][1]} `;
    for (let i = 1; i < points.length; i++) {
        d += `L ${points[i][0]},${points[i][1]} `;
    }
    return d + "Z";
}



// ===============================
// PREVIEW
// ===============================
function updatePreview() {
    preview.innerHTML = "";

    const w = +widthInput.value;
    const h = +heightInput.value;
    const s = +strokeInput.value;
    const speed = +speedInput.value;
    const type = shapeSel.value;

    const mode = modeSelect.value;
    const c1 = color1.value;
    const c2 = color2.value;
    const c3 = color3.value;
    const c4 = color4.value;

    let stops = `
        <stop offset="0%" stop-color="${c1}" />
        <stop offset="33%" stop-color="${c2}" />
        <stop offset="66%" stop-color="${c3}" />
        <stop offset="100%" stop-color="${c4}" />
    `;

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.innerHTML = `
        <linearGradient id="movingGradient" x1="0" y1="0" x2="600" y2="0">
            ${stops}
            <animate attributeName="x1" values="0;-600" dur="${speed}s" repeatCount="indefinite"/>
            <animate attributeName="x2" values="600;0" dur="${speed}s" repeatCount="indefinite"/>
        </linearGradient>`;
    preview.appendChild(defs);

    let shape;

    if (type === "png") {
        if (!extractedPath) {
            preview.innerHTML =
                "<text x='50%' y='50%' fill='white' font-size='20' text-anchor='middle'>Envie um PNG...</text>";
            return;
        }

        shape = document.createElementNS("http://www.w3.org/2000/svg", "path");
        shape.setAttribute("d", extractedPath);

        // escala baseada no PNG
        const scaleX = w / uploadedPNG.width;
        const scaleY = h / uploadedPNG.height;
        shape.setAttribute("transform", `scale(${scaleX}, ${scaleY})`);
    }

    shape.setAttribute("stroke", "url(#movingGradient)");
    shape.setAttribute("stroke-width", s);
    shape.setAttribute("fill", "none");
    shape.setAttribute("stroke-linecap", "round");
    shape.setAttribute("stroke-linejoin", "round");

    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);
    preview.appendChild(shape);
}
