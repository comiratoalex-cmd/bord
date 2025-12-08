/* RENDER ENGINE COMIAL PRO — COMPLETO */

/* Atalho */
const $ = id => document.getElementById(id);

window.renderAllLayers = function () {
    const preview = $("preview");
    preview.innerHTML = "";

    const shape  = $("shape").value;
    const width  = +$("width").value;
    const height = +$("height").value;
    const stroke = +$("stroke").value;
    const radius = +$("radius").value;
    const speed  = +$("speed").value;

    const c1 = $("c1").value;
    const c2 = $("c2").value;
    const c3 = $("c3").value;
    const c4 = $("c4").value;

    const layer = document.createElement("div");
    layer.className = "shape-layer";

    /* Dimensões */
    if (shape === "rect") {
        preview.style.width = width + "px";
        preview.style.height = height + "px";
    }
    if (shape === "square") {
        const s = Math.min(width, height);
        preview.style.width = preview.style.height = s + "px";
    }
    if (shape === "line-h") {
        preview.style.width = width + "px";
        preview.style.height = stroke + "px";
    }
    if (shape === "line-v") {
        preview.style.width = stroke + "px";
        preview.style.height = height + "px";
    }

    /* Borda */
    layer.style.border = `${stroke}px solid transparent`;
    layer.style.borderRadius = radius + "px";
    layer.style.borderImage = `
        linear-gradient(90deg,
            ${c1},${c2},${c3},${c4},${c1}
        ) 1
    `;
    layer.style.animation = `borderFlow ${speed}s linear infinite`;

    preview.appendChild(layer);
};
