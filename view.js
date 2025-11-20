const params = new URLSearchParams(window.location.search);

const shape = params.get("shape");
const w = +params.get("w");
const h = +params.get("h");
const s = +params.get("stroke");
const speed = +params.get("speed");

const mode = params.get("mode"); // 2 ou 4 cores

const c1 = params.get("c1");
const c2 = params.get("c2");
const c3 = params.get("c3");
const c4 = params.get("c4");

const preview = document.getElementById("preview");
preview.setAttribute("viewBox", `0 0 ${w} ${h}`);

/* Gradient */
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
    <linearGradient id="grad" x1="0" y1="0" x2="600" y2="0">
        ${stops}
        <animate attributeName="x1" values="0;-600" dur="${speed}s" repeatCount="indefinite" />
        <animate attributeName="x2" values="600;0" dur="${speed}s" repeatCount="indefinite" />
    </linearGradient>
`;
preview.appendChild(defs);

/* Create Shape */
let element;

if (shape === "rect") {
    element = `<rect x="${s}" y="${s}" width="${w - s * 2}" height="${h - s * 2}" stroke="url(#grad)" stroke-width="${s}" fill="none" rx="20" />`;
}
if (shape === "square") {
    const size = Math.min(w, h);
    element = `<rect x="${s}" y="${s}" width="${size - s * 2}" height="${size - s * 2}" stroke="url(#grad)" stroke-width="${s}" fill="none" rx="20"/>`;
}
if (shape === "ellipse") {
    element = `<ellipse cx="${w/2}" cy="${h/2}" rx="${w/2 - s}" ry="${h/2 - s}" stroke="url(#grad)" stroke-width="${s}" fill="none"/>`;
}
if (shape === "line-h") {
    element = `<line x1="0" y1="${h/2}" x2="${w}" y2="${h/2}" stroke="url(#grad)" stroke-width="${s}" />`;
}
if (shape === "line-v") {
    element = `<line x1="${w/2}" y1="0" x2="${w/2}" y2="${h}" stroke="url(#grad)" stroke-width="${s}" />`;
}

preview.innerHTML += element;
