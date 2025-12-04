const shapeSel = document.getElementById("shape");
const wInput = document.getElementById("width");
const hInput = document.getElementById("height");
const strokeInput = document.getElementById("stroke");
const radiusInput = document.getElementById("radius");
const speedInput = document.getElementById("speed");

const modeInput = document.getElementById("color-mode");
const fxInput = document.getElementById("effect");

const c1Input = document.getElementById("c1");
const c2Input = document.getElementById("c2");
const c3Input = document.getElementById("c3");
const c4Input = document.getElementById("c4");

const preview = document.getElementById("previewBar");
const linkBox = document.getElementById("obs-link");

/* Gradiente suave */
function smoothGradient(c1, c2, c3, c4, mode) {
    if (mode === "2") {
        return `
        linear-gradient(90deg,
            ${c1} 0%,
            ${c1} 40%,
            ${c2} 60%,
            ${c2} 100%)`;
    }
    return `
    linear-gradient(90deg,
        ${c1} 0%,
        ${c1} 20%,
        ${c2} 35%,
        ${c2} 50%,
        ${c3} 65%,
        ${c3} 80%,
        ${c4} 90%,
        ${c4} 100%)`;
}

function updatePreview() {
    const w = Number(wInput.value);
    const h = Number(hInput.value);
    const s = Number(strokeInput.value);
    const r = Number(radiusInput.value);
    const spd = Number(speedInput.value);
    const fx = fxInput.value;

    const c1 = c1Input.value;
    const c2 = c2Input.value;
    const c3 = c3Input.value;
    const c4 = c4Input.value;
    const mode = modeInput.value;

    preview.className = "";
    preview.style.animation = `slide ${spd}s linear infinite`;

    preview.style.setProperty("--c1", c1);
    preview.style.setProperty("--c2", c2);
    preview.style.setProperty("--c3", c3);

    const g = smoothGradient(c1, c2, c3, c4, mode);

    preview.style.border = `${s}px solid transparent`;
    preview.style.borderRadius = `${r}px`;
    preview.style.backgroundImage = `linear-gradient(#0000,#0000), ${g}`;

    const shape = shapeSel.value;
    if (shape === "line-h") {
        preview.style.width = "85%";
        preview.style.height = "10px";
    } else if (shape === "line-v") {
        preview.style.width = "10px";
        preview.style.height = "85%";
    } else {
        preview.style.width = w + "px";
        preview.style.height = h + "px";
    }

    if (fx === "neon") preview.classList.add("glow-neon");
    if (fx === "emboss") preview.classList.add("emboss");
    if (fx === "shadow") preview.classList.add("shadow-animated");
    if (fx === "turbo") preview.classList.add("glow-neon","emboss","shadow-animated");
}

document.getElementById("generate").onclick = () => {
    const url = new URL(location.href);
    url.pathname = "view.html";

    url.searchParams.set("shape", shapeSel.value);
    url.searchParams.set("w", wInput.value);
    url.searchParams.set("h", hInput.value);
    url.searchParams.set("s", strokeInput.value);
    url.searchParams.set("r", radiusInput.value);
    url.searchParams.set("spd", speedInput.value);
    url.searchParams.set("mode", modeInput.value);
    url.searchParams.set("fx", fxInput.value);

    url.searchParams.set("c1", c1Input.value);
    url.searchParams.set("c2", c2Input.value);
    url.searchParams.set("c3", c3Input.value);
    url.searchParams.set("c4", c4Input.value);

    linkBox.value = url.toString();
};

["input","change"].forEach(ev =>
    document.addEventListener(ev, updatePreview)
);

updatePreview();
