const preview = document.getElementById("preview");

function updatePreview() {

    const w = +document.getElementById("width").value;
    const h = +document.getElementById("height").value;
    const r = +document.getElementById("radius").value;
    const s = +document.getElementById("stroke").value;
    const op = +document.getElementById("opacity").value;
    const speed = +document.getElementById("speed").value;

    const shape = document.getElementById("shape").value;
    const mode = document.getElementById("color-mode").value;

    const c1 = document.getElementById("color1").value;
    const c2 = document.getElementById("color2").value;
    const c3 = document.getElementById("color3").value;
    const c4 = document.getElementById("color4").value;

    const glow = document.getElementById("glow").value;
    const anim = document.getElementById("anim").value;

    preview.innerHTML = "";

    preview.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const defs = document.createElementNS("http://www.w3.org/2000/svg","defs");
    const grad = document.createElementNS("http://www.w3.org/2000/svg","linearGradient");

    grad.setAttribute("id","g");
    grad.setAttribute("gradientUnits","userSpaceOnUse");

    // direction
    if (anim === "horizontal") {
        grad.setAttribute("x1","0");  
        grad.setAttribute("x2", w);
        grad.setAttribute("y1","0");
        grad.setAttribute("y2","0");
    }
    if (anim === "vertical") {
        grad.setAttribute("x1","0");
        grad.setAttribute("y1","0");
        grad.setAttribute("x2","0");
        grad.setAttribute("y2", h);
    }
    if (anim === "diagonal") {
        grad.setAttribute("x1","0");
        grad.setAttribute("y1","0");
        grad.setAttribute("x2", w);
        grad.setAttribute("y2", h);
    }

    // rainbow, prism, rgb
    if (anim === "prism") {
        grad.setAttribute("x1","0");
        grad.setAttribute("x2", w);
        grad.setAttribute("y1","0");
        grad.setAttribute("y2","0");
    }

    // stops
    const addStop = (offset, color) => {
        const st = document.createElementNS("http://www.w3.org/2000/svg","stop");
        st.setAttribute("offset", offset);
        st.setAttribute("stop-color", color);
        grad.appendChild(st);
    };

    if (mode === "2") {
        addStop("0%", c1);
        addStop("100%", c2);
    } else {
        addStop("0%", c1);
        addStop("33%", c2);
        addStop("66%", c3);
        addStop("100%", c4);
    }

    // LOOP INFINITO ✔
    const animLoop = document.createElementNS("http://www.w3.org/2000/svg","animate");
    animLoop.setAttribute("attributeName", "gradientTransform");
    animLoop.setAttribute("type","translate");

    // cycle
    animLoop.setAttribute("dur", `${speed}s`);
    animLoop.setAttribute("repeatCount","indefinite");
    animLoop.setAttribute("keyTimes","0;1");
    animLoop.setAttribute("values", `0 0; -${w} 0`);

    grad.appendChild(animLoop);
    defs.appendChild(grad);
    preview.appendChild(defs);

    const NS = "http://www.w3.org/2000/svg";
    let shapeEl;

    if (shape === "rect") {
        shapeEl = document.createElementNS(NS,"rect");
        shapeEl.setAttribute("x", s);
        shapeEl.setAttribute("y", s);
        shapeEl.setAttribute("width", w-s*2);
        shapeEl.setAttribute("height", h-s*2);
        shapeEl.setAttribute("rx", r);
    }
    if (shape === "square") {
        const size = Math.min(w,h);
        shapeEl = document.createElementNS(NS,"rect");
        shapeEl.setAttribute("x", s);
        shapeEl.setAttribute("y", s);
        shapeEl.setAttribute("width", size-s*2);
        shapeEl.setAttribute("height", size-s*2);
        shapeEl.setAttribute("rx", r);
    }
    if (shape === "ellipse") {
        shapeEl = document.createElementNS(NS,"ellipse");
        shapeEl.setAttribute("cx", w/2);
        shapeEl.setAttribute("cy", h/2);
        shapeEl.setAttribute("rx", w/2-s);
        shapeEl.setAttribute("ry", h/2-s);
    }
    if (shape === "line-h") {
        shapeEl = document.createElementNS(NS,"line");
        shapeEl.setAttribute("x1","0");
        shapeEl.setAttribute("y1", h/2);
        shapeEl.setAttribute("x2", w);
        shapeEl.setAttribute("y2", h/2);
    }
    if (shape === "line-v") {
        shapeEl = document.createElementNS(NS,"line");
        shapeEl.setAttribute("x1", w/2);
        shapeEl.setAttribute("y1","0");
        shapeEl.setAttribute("x2", w/2);
        shapeEl.setAttribute("y2", h);
    }

    shapeEl.setAttribute("stroke", "url(#g)");
    shapeEl.setAttribute("stroke-width", s);
    shapeEl.setAttribute("fill","none");
    shapeEl.setAttribute("opacity", op);
    shapeEl.setAttribute("stroke-linecap","round");

    if (glow === "neon") shapeEl.classList.add("neon");

    preview.appendChild(shapeEl);
}


// update on user input
document.querySelectorAll("input,select").forEach(el=>{
    el.addEventListener("input",updatePreview);
});

updatePreview();

document.getElementById("generate").onclick = () => {
    const url = new URL(window.location.origin + "/view.html");

    const params = [
        "shape","width","height","radius","stroke",
        "opacity","speed","color-mode",
        "color1","color2","color3","color4",
        "glow","anim"
    ];

    params.forEach(id=>{
        const v = document.getElementById(id).value;
        url.searchParams.set(id.replace("-",""), v);
    });

    document.getElementById("obsLink").value = url.toString();
};

document.getElementById("copy").onclick = () => {
    navigator.clipboard.writeText(document.getElementById("obsLink").value);
};
