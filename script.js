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

// ----------------------------------
// CARREGAR PNG
// ----------------------------------
upload.onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    uploadedPNG = await loadImage(file);

    // remove fundo + extrai contorno real
    extractedPath = await processPNG(uploadedPNG);

    updatePreview();
};

// carrega imagem
function loadImage(file) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(file);
    });
}

// ===============================
// PROCESSAR PNG COMPLETO
// ===============================
async function processPNG(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0);

    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const alphaMask = removeBackground(data);
    return marchingSquares(alphaMask, canvas.width, canvas.height);
}

// ===============================
// MODO 2 – REMOÇÃO DE FUNDO
// ===============================
function removeBackground(imgData) {
    const { width, height, data } = imgData;
    const mask = new Uint8Array(width * height);

    // 1️⃣ sample bordas para descobrir a cor do fundo
    let r = 0, g = 0, b = 0, count = 0;
    const borderStep = 10;

    for (let x = 0; x < width; x += borderStep) {
        const i1 = (0 * width + x) * 4;
        const i2 = ((height - 1) * width + x) * 4;
        r += data[i1]; g += data[i1 + 1]; b += data[i1 + 2];
        r += data[i2]; g += data[i2 + 1]; b += data[i2 + 2];
        count += 2;
    }

    for (let y = 0; y < height; y += borderStep) {
        const i1 = (y * width + 0) * 4;
        const i2 = (y * width + (width - 1)) * 4;
        r += data[i1]; g += data[i1 + 1]; b += data[i1 + 2];
        r += data[i2]; g += data[i2 + 1]; b += data[i2 + 2];
        count += 2;
    }

    const bg = [r / count, g / count, b / count];

    // tolerância dinâmica
    const tol = 50;

    // 2️⃣ gera máscara alfa
    for (let i = 0; i < data.length; i += 4) {
        const pr = data[i];
        const pg = data[i + 1];
        const pb = data[i + 2];

        const dist =
            Math.abs(pr - bg[0]) +
            Math.abs(pg - bg[1]) +
            Math.abs(pb - bg[2]);

        mask[i / 4] = dist > tol ? 1 : 0;
    }

    return mask;
}

// ===============================
// MARCHING SQUARES – A1 REAL
// ===============================
function marchingSquares(mask, width, height) {
    const path = [];

    const visited = new Uint8Array(mask.length);
    const dirs = [
        [1, 0],  // direita
        [0, 1],  // baixo
        [-1,0],  // esquerda
        [0,-1],  // cima
    ];

    function isInside(x, y) {
        if (x < 0 || y < 0 || x >= width || y >= height) return false;
        return mask[y * width + x] === 1;
    }

    function findStart() {
        for (let y = 0; y < height; y++)
            for (let x = 0; x < width; x++)
                if (isInside(x, y)) return [x, y];
        return null;
    }

    const start = findStart();
    if (!start) return "";

    let [x, y] = start;
    let dir = 0;

    do {
        path.push([x, y]);
        visited[y * width + x] = 1;

        let found = false;
        for (let i = 0; i < 4; i++) {
            const nd = (dir + i) % 4;
            const nx = x + dirs[nd][0];
            const ny = y + dirs[nd][1];
            if (isInside(nx, ny)) {
                x = nx;
                y = ny;
                dir = nd;
                found = true;
                break;
            }
        }
        if (!found) break;

    } while (!(x === start[0] && y === start[1]));

    // converter path → SVG
    let d = `M ${path[0][0]},${path[0][1]} `;
    for (let i = 1; i < path.length; i++)
        d += `L ${path[i][0]},${path[i][1]} `;
    d += "Z";

    return d;
}

// ===============================
// PREVIEW NORMAL
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
