const sel = (id) => document.getElementById(id);

const shapeSel = sel("shape");
const wInput = sel("width");
const hInput = sel("height");
const strokeInput = sel("stroke");
const radiusInput = sel("radius");
const speedInput = sel("speed");

const modeInput = sel("color-mode");
const fxInput = sel("effect");

const c1Input = sel("c1");
const c2Input = sel("c2");
const c3Input = sel("c3");
const c4Input = sel("c4");

const preview = sel("previewBar");
const linkBox = sel("obs-link");

/* FADE SUAVE */
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

/* ATUALIZA PREVIEW */
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

sel("generate").onclick = () => {
    const url = new URL(location.href);
    url.pathname = "view.html";

    url.searchParams.set("shape", shapeSel.value);
    url.searchParams.set("w", wInput.value);
    url.searchParams.set("h", hInput.value);
    url.searchParams.set("s", strokeInput.value);
    url.searchParams.set("r", radiusInput.value);
    url.searchParams.set("spd", speedInput.value);
    url.searchParams.set("fx", fxInput.value);
    url.searchParams.set("mode", modeInput.value);

    url.searchParams.set("c1", c1Input.value);
    url.searchParams.set("c2", c2Input.value);
    url.searchParams.set("c3", c3Input.value);
    url.searchParams.set("c4", c4Input.value);

    linkBox.value = url.toString();
};

/* Detect changes */
["input","change"].forEach(ev =>
    document.addEventListener(ev, updatePreview)
);

updatePreview();
