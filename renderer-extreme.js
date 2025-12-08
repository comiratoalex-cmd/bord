/* ============================================================
   COMIAL PRO — RENDER ENGINE UNIVERSAL
   COMPATÍVEL COM INDEX, VIEW e OBS
============================================================ */

window.renderAllLayers = function () {
    const preview = document.getElementById("preview");
    if (!preview) return;

    preview.innerHTML = "";

    // parâmetros
    const shape = $("shape")?.value ?? "rect";
    const w = +($("width")?.value ?? 800);
    const h = +($("height")?.value ?? 300);
    const stroke = +($("stroke")?.value ?? 4);
    const radius = +($("radius")?.value ?? 20);
    const speed = +($("speed")?.value ?? 10);

    const c1 = $("c1")?.value ?? "#aee7ff";
    const c2 = $("c2")?.value ?? "#ffc0e6";
    const c3 = $("c3")?.value ?? "#ffe4b3";
    const c4 = $("c4")?.value ?? "#ffd9c7";

    const layer = document.createElement("div");
    layer.className = "shape-layer";

    /* SHAPES ================================================== */
    if (shape === "rect") {
        layer.style.width = w + "px";
        layer.style.height = h + "px";
    }

    if (shape === "square") {
        const s = Math.min(w, h);
        layer.style.width = s + "px";
        layer.style.height = s + "px";
    }

    if (shape === "line-h") {
        layer.style.width = w + "px";
        layer.style.height = stroke + "px";
    }

    if (shape === "line-v") {
        layer.style.width = stroke + "px";
        layer.style.height = h + "px";
    }

    /* BORDA DINÂMICA ========================================= */
    layer.style.border = `${stroke}px solid transparent`;
    layer.style.borderRadius = radius + "px";

    layer.style.borderImage = `
        linear-gradient(90deg,
            ${c1},
            ${c2},
            ${c3},
            ${c4},
            ${c1}
        ) 1
    `;

    layer.style.animation = `borderFlow ${speed}s linear infinite`;

    /* EFEITOS ================================================= */
    if ($("fx3d")?.checked) layer.classList.add("neon-3d");
    if ($("fxWet")?.checked) layer.classList.add("wet-glow");
    if ($("fxTurbo")?.checked) layer.classList.add("turbo-glow");

    preview.appendChild(layer);
};
