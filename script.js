function updatePreview() {
    const shape = shapeSel.value;
    const w = Number(width.value);
    const h = Number(height.value);
    const s = Number(stroke.value);
    const r = Number(radius.value);
    const spd = Number(speed.value);

    const mode = color-mode.value;
    const c1 = c1Input.value;
    const c2 = c2Input.value;
    const c3 = c3Input.value;
    const c4 = c4Input.value;

    const gradient = (mode === "2")
        ? `linear-gradient(90deg, ${c1}, ${c2})`
        : `linear-gradient(90deg, ${c1}, ${c2}, ${c3}, ${c4})`;

    previewSvg.style.display = "none";
    previewBar.style.display = "block";

    previewBar.style.width = (shape === "line-v") ? "18px" : w + "px";
    previewBar.style.height = (shape === "line-h") ? "18px" : h + "px";

    previewBar.style.border = s + "px solid transparent";
    previewBar.style.borderRadius = r + "px";
    previewBar.style.background = gradient;
    previewBar.style.backgroundSize = "400% 400%";
    previewBar.style.animation = `slide ${spd}s linear infinite`;
}

["input","change"].forEach(ev=>{
    document.addEventListener(ev, updatePreview);
});

updatePreview();
