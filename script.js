/* ======== UTIL ======== */
const $ = id => document.getElementById(id);
const preview = $("previewBar");

/* ======== 25 PRESETS THEOWOO PASTEL ======== */
const THEOWOO_PRESETS = [
    ["#aee7ff","#ffc0e6","#ffe4b3","#ffd9c7"],
    ["#cbe9ff","#ffcdf2","#ffe6cc","#fff2d9"],
    ["#d6f0ff","#ffbfe8","#ffe2c3","#fff8de"],
    ["#c8f7ff","#ffc1dd","#ffeac7","#ffe0ef"],
    ["#bdf2ff","#ffc8ea","#ffeac5","#fdf1f8"],
    ["#a3e2ff","#ffb6e8","#ffddb8","#ffe7f4"],
    ["#c7f4ff","#ffc7e2","#fff2c1","#ffdfdf"],
    ["#bdefff","#ffcdee","#ffeec4","#ffe1f2"],
    ["#c5f3ff","#ffbfe0","#ffe6c2","#fcebf5"],
    ["#d3f8ff","#ffbaea","#fff1c6","#ffe3f6"],
    ["#b3edff","#ffc1fa","#ffe1bf","#f9dffd"],
    ["#c2f6ff","#ffb8e3","#ffe3be","#ffebf6"],
    ["#b6f1ff","#ffbde9","#ffe0c4","#fbe8f2"],
    ["#ccf3ff","#ffb2d7","#ffe8cc","#ffeff6"],
    ["#aff0ff","#ffb9e3","#ffe3bf","#ffeaf7"],
    ["#bcf5ff","#ffc0f5","#ffe6c8","#ffe5ea"],
    ["#d0f7ff","#ffbbe1","#ffe8c7","#fff1fa"],
    ["#c8f6ff","#ffafe1","#ffefc5","#ffdeef"],
    ["#defaff","#ffb9d9","#ffe9c2","#fff7dd"],
    ["#a8eaff","#ffb8e0","#ffdcb1","#ffe5d4"],
    ["#cef7ff","#ffcbec","#ffecc7","#ffe7f9"],
    ["#c1f4ff","#ffbce0","#ffe1be","#ffeefd"],
    ["#d4f7ff","#ffbae0","#ffe4ca","#fff0ea"],
    ["#bdf3ff","#ffcaf2","#ffe3cc","#ffeef4"],
    ["#c6f9ff","#ffcbef","#fff0c7","#ffeafa"]
];

/* ======== GRADIENTE LOOP PERFEITO ======== */
function gradientSmooth(c1, c2, c3, c4, mode) {
    if (mode === "2") {
        return `linear-gradient(90deg,
            ${c1} 0%, ${c1} 25%,
            ${c2} 50%,
            ${c1} 75%, ${c1} 100%
        )`;
    }
    return `linear-gradient(90deg,
        ${c1} 0%, ${c1} 15%,
        ${c2} 30%, ${c2} 45%,
        ${c3} 60%, ${c3} 75%,
        ${c4} 90%, ${c1} 100%
    )`;
}

/* ======== PREVIEW ======== */
function updatePreview() {
    const shape = $("shape").value;
    const w = +$("width").value;
    const h = +$("height").value;
    const s = +$("stroke").value;
    const r = +$("radius").value;
    const spd = +$("speed").value;
    const mode = $("color-mode").value;

    const c1 = $("c1").value;
    const c2 = $("c2").value;
    const c3 = $("c3").value;
    const c4 = $("c4").value;

    preview.style.animation = `slide ${spd}s linear infinite`;
    preview.style.border = `${s}px solid transparent`;
    preview.style.borderRadius = `${r}px`;
    preview.style.backgroundImage =
        `linear-gradient(#0000,#0000), ${gradientSmooth(c1, c2, c3, c4, mode)}`;

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

    preview.className = "";
    const fx = $("effect").value;
    if (fx === "neon") preview.classList.add("glow-neon");
    if (fx === "emboss") preview.classList.add("emboss");
    if (fx === "shadow") preview.classList.add("shadow-animated");
    if (fx === "turbo") preview.classList.add("glow-neon","emboss","shadow-animated");
}

/* ======== PRESETS ======== */
$("presetButton").onclick = () => {
    const p = THEOWOO_PRESETS[Math.floor(Math.random() * THEOWOO_PRESETS.length)];

    $("c1").value = p[0];
    $("c2").value = p[1];
    $("c3").value = p[2];
    $("c4").value = p[3];

    updatePreview();
};

/* ======== GERAR LINK OBS ======== */
$("generate").onclick = () => {
    const u = new URL(location.href);
    u.pathname = "view.html";

    [
        "shape","width","height","stroke","radius","speed",
        "color-mode","effect","c1","c2","c3","c4"
    ].forEach(key => u.searchParams.set(key, $(key).value));

    $("obs-link").value = u.toString();
};

/* ======== AUTO UPDATE ======== */
document.addEventListener("input", updatePreview);
document.addEventListener("change", updatePreview);
updatePreview();
