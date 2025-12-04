const shapeSel = document.getElementById("shape");
const wInput = document.getElementById("width");
const hInput = document.getElementById("height");
const strokeInput = document.getElementById("stroke");
const radiusInput = document.getElementById("radius");
const speedInput = document.getElementById("speed");

const modeInput = document.getElementById("color-mode");
const c1Input = document.getElementById("c1");
const c2Input = document.getElementById("c2");
const c3Input = document.getElementById("c3");
const c4Input = document.getElementById("c4");

const preview = document.getElementById("previewBar");
const linkBox = document.getElementById("obs-link");

function updatePreview() {
    const shape = shapeSel.value;
    const w = Number(wInput.value);
    const h = Number(hInput.value);
    const s = Number(strokeInput.value);
    const r = Number(radiusInput.value);
    const spd = Number(speedInput.value);

    const mode = modeInput.value;
    const c1 = c1Input.value;
    const c2 = c2Input.value;
    const c3 = c3Input.value;
    const c4 = c4Input.value;

    /* Forma */
    if (shape === "line-h") {
        preview.style.width = "85%";
        preview.style.height = "18px";
    } else if (shape === "line-v") {
        preview.style.width = "18px";
        preview.style.height = "85%";
    } else {
        preview.style.width = w + "px";
        preview.style.height = h + "px";
    }

    preview.style.border = `${s}px solid transparent`;
    preview.style.borderRadius = `${r}px`;

    const gradient =
        mode === "2"
            ? `linear-gradient(90deg, ${c1}, ${c2})`
            : `linear-gradient(90deg, ${c1}, ${c2}, ${c3}, ${c4})`;

    preview.style.backgroundImage =
        `linear-gradient(#0000, #0000), ${gradient}`;

    preview.style.backgroundSize = "100% 100%, 400% 400%";
    preview.style.animation = `slide ${spd}s linear infinite`;
}

/* GERAR LINK OBS */
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

    url.searchParams.set("c1", c1Input.value);
    url.searchParams.set("c2", c2Input.value);
    url.searchParams.set("c3", c3Input.value);
    url.searchParams.set("c4", c4Input.value);

    linkBox.value = url.toString();
};

["input", "change"].forEach(ev => {
    document.addEventListener(ev, updatePreview);
});

updatePreview();
