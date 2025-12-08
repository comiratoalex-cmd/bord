/* ============================================================
   SHORTCUT
============================================================ */
const $ = id => document.getElementById(id);

/* ============================================================
   RENDER AUTOMÁTICO AO MUDAR QUALQUER CONTROLE
============================================================ */

function attachAutoRender() {
    [
        "shape", "width", "height", "stroke", "radius", "speed",
        "c1", "c2", "c3", "c4",
        "fx3d", "fxWet", "fxTurbo", "fxAudio"
    ].forEach(id => {
        const el = $(id);
        if (el) {
            el.addEventListener("input", renderAllLayers);
            el.addEventListener("change", renderAllLayers);
        }
    });
}

attachAutoRender();

/* ============================================================
   PRESETS PASTEL
============================================================ */
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

$("presetButton")?.addEventListener("click", () => {
    const p = THEOWOO_PRESETS[Math.floor(Math.random() * THEOWOO_PRESETS.length)];
    $("c1").value = p[0];
    $("c2").value = p[1];
    $("c3").value = p[2];
    $("c4").value = p[3];
    renderAllLayers();
});

/* ============================================================
   GERAR LINK VIEWER
============================================================ */
$("exportViewer")?.addEventListener("click", () => {
    const u = new URL(location.href);
    u.pathname = "/bord/view.html";

    [
        "shape","width","height","stroke","radius","speed",
        "c1","c2","c3","c4",
        "fx3d","fxWet","fxTurbo","fxAudio"
    ].forEach(key => {
        const el = $(key);
        if (el) {
            u.searchParams.set(key, el.type === "checkbox" ? el.checked : el.value);
        }
    });

    $("viewerLink").value = u.toString();
});

/* ============================================================
   GERAR LINK OBS TRANSPARENTE
============================================================ */
$("exportOBS")?.addEventListener("click", () => {
    const u = new URL(location.href);
    u.pathname = "/bord/obs.html";

    [
        "shape","width","height","stroke","radius","speed",
        "c1","c2","c3","c4",
        "fx3d","fxWet","fxTurbo","fxAudio"
    ].forEach(key => {
        const el = $(key);
        if (el) {
            u.searchParams.set(key, el.type === "checkbox" ? el.checked : el.value);
        }
    });

    $("obsLink").value = u.toString();
});

/* ============================================================
   INICIALIZAÇÃO
============================================================ */
window.onload = () => {
    renderAllLayers();
};
