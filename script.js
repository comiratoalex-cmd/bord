const el = (id) => document.getElementById(id);

const preview = el("previewBar");

/* GRADIENTE SUAVE LOOPANDO */
function gradientSmooth(c1, c2, c3, c4, mode) {
    if (mode === "2") {
        return `linear-gradient(90deg,
            ${c1} 0%,
            ${c1} 25%,
            ${c2} 50%,
            ${c1} 75%,
            ${c1} 100%
        )`;
    }

    return `linear-gradient(90deg,
        ${c1} 0%,
        ${c1} 15%,
        ${c2} 30%,
        ${c2} 45%,
        ${c3} 60%,
        ${c3} 75%,
        ${c4} 90%,
        ${c1} 100%
    )`;
}

/* PREVIEW UPDATE */
function updatePreview() {
    const w = +el("width").value;
    const h = +el("height").value;
    const s = +el("stroke").value;
    const r = +el("radius").value;
    const spd = +el("speed").value;
    const mode = el("color-mode").value;
    const fx = el("effect").value;

    const c1 = el("c1").value;
    const c2 = el("c2").value;
    const c3 = el("c3").value;
    const c4 = el("c4").value;

    preview.className = "";
    preview.style.animation = `slide ${spd}s linear infinite`;

    preview.style.setProperty("--c1", c1);
    preview.style.setProperty("--c2", c2);
    preview.style.setProperty("--c3", c3);

    const shape = el("shape").value;

    if (shape === "line-h") {
        preview.style.width = "85%";
        preview.style.height = "10px";
    } else if (shape === "line-v") {
        preview.style.width = "10px";
        preview.style.height = "85%";
    } else {
        preview.style.width = `${w}px`;
        preview.style.height = `${h}px`;
    }

    preview.style.border = `${s}px solid transparent`;
    preview.style.borderRadius = `${r}px`;

    preview.style.backgroundImage = 
        `linear-gradient(#0000,#0000), ${gradientSmooth(c1,c2,c3,c4,mode)}`;

    if (fx === "neon") preview.classList.add("glow-neon");
    if (fx === "emboss") preview.classList.add("emboss");
    if (fx === "shadow") preview.classList.add("shadow-animated");
    if (fx === "turbo") preview.classList.add("glow-neon","emboss","shadow-animated");
}

/* BIND */
["input","change"].forEach(evt =>
    document.addEventListener(evt, updatePreview)
);

updatePreview();

/* PRESETS CANDY */
el("presetButton").onclick = () => {
    const presets = [
        ["#aee7ff","#ffc0e6","#ffe4b3","#ffd9c7"],
        ["#d4f1ff","#ffb7dc","#ffe1c4","#fff5d6"],
        ["#b8f0f5","#ffcae0","#ffeec8","#ffd6f2"],
        ["#b0eaff","#ffbef0","#ffe8c0","#ffd6e1"],
        ["#b9f2ff","#ffcce3","#ffe4c1","#fff2d7"]
    ];

    const p = presets[Math.floor(Math.random()*presets.length)];

    el("c1").value = p[0];
    el("c2").value = p[1];
    el("c3").value = p[2];
    el("c4").value = p[3];

    updatePreview();
};

/* GENERATE OBS LINK */
el("generate").onclick = () => {
    const url = new URL(location.href);
    url.pathname = "view.html";

    [
        "shape","width","height","stroke","radius","speed",
        "color-mode","effect","c1","c2","c3","c4"
    ].forEach(id => url.searchParams.set(id, el(id).value));

    el("obs-link").value = url.toString();
};
