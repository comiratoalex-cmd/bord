const shapeSel = document.getElementById("shape");
const wInput = document.getElementById("width");
const hInput = document.getElementById("height");
const rInput = document.getElementById("radius");
const sInput = document.getElementById("stroke");
const speedInput = document.getElementById("speed");

const modeInput = document.getElementById("color-mode");
const c1Input = document.getElementById("c1");
const c2Input = document.getElementById("c2");
const c3Input = document.getElementById("c3");
const c4Input = document.getElementById("c4");

const previewBar = document.getElementById("previewBar");
const previewSvg = document.getElementById("previewSvg");

function updatePreview() {
    const shape = shapeSel.value;
    const w = Number(wInput.value);
    const h = Number(hInput.value);
    const r = Number(rInput.value);
    const s = Number(sInput.value);
    const speed = Number(speedInput.value);
    const mode = modeInput.value;

    const c1 = c1Input.value;
    const c2 = c2Input.value;
    const c3 = c3Input.value;
    const c4 = c4Input.value;

    const gradient = (mode === "2")
        ? `linear-gradient(90deg, ${c1}, ${c2})`
        : `linear-gradient(90deg, ${c1}, ${c2}, ${c3}, ${c4})`;

    /* -------------------------------
       BARRA → DIV
    --------------------------------*/
    if (shape === "line-h" || shape === "line-v") {
        previewSvg.style.display = "none";
        previewBar.style.display = "block";

        previewBar.style.background = gradient;
        previewBar.style.animation = `slide ${speed}s linear infinite`;

        if (shape === "line-v") {
            previewBar.style.width = "18px";
            previewBar.style.height = "70%";
        } else {
            previewBar.style.width = "85%";
            previewBar.style.height = "18px";
        }
        return;
    }

    /* -------------------------------
       SHAPES → SVG
    --------------------------------*/
    previewBar.style.display = "none";
    previewSvg.style.display = "block";

    previewSvg.innerHTML = "";
    previewSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const NS = "http://www.w3.org/2000/svg";

    const defs = document.createElementNS(NS, "defs");
    const grad = document.createElementNS(NS, "linearGradient");

    grad.setAttribute("id", "g");
    grad.setAttribute("x1", "0");
    grad.setAttribute("y1", "0");
    grad.setAttribute("x2", w);
    grad.setAttribute("y2", "0");

    function stop(o,c){
        const st = document.createElementNS(NS,"stop");
        st.setAttribute("offset",o);
        st.setAttribute("stop-color",c);
        grad.appendChild(st);
    }

    if(mode==="2"){
        stop("0%",c1);
        stop("100%",c2);
    } else {
        stop("0%",c1);
        stop("33%",c2);
        stop("66%",c3);
        stop("100%",c4);
    }

    /* Animação sem reset */
    const anim = document.createElementNS(NS,"animateTransform");
    anim.setAttribute("attributeName","gradientTransform");
    anim.setAttribute("type","translate");
    anim.setAttribute("dur",`${speed}s`);
    anim.setAttribute("repeatCount","indefinite");
    anim.setAttribute("values",`-${w} 0; 0 0; -${w} 0`);
    grad.appendChild(anim);

    defs.appendChild(grad);
    previewSvg.appendChild(defs);

    let shapeEl;

    if(shape==="rect"){
        shapeEl=document.createElementNS(NS,"rect");
        shapeEl.setAttribute("x",s);
        shapeEl.setAttribute("y",s);
        shapeEl.setAttribute("width",w - s*2);
        shapeEl.setAttribute("height",h - s*2);
        shapeEl.setAttribute("rx",r);
    }
    if(shape==="square"){
        let size=Math.min(w,h);
        shapeEl=document.createElementNS(NS,"rect");
        shapeEl.setAttribute("x",s);
        shapeEl.setAttribute("y",s);
        shapeEl.setAttribute("width",size - s*2);
        shapeEl.setAttribute("height",size - s*2);
        shapeEl.setAttribute("rx",r);
    }
    if(shape==="ellipse"){
        shapeEl=document.createElementNS(NS,"ellipse");
        shapeEl.setAttribute("cx",w/2);
        shapeEl.setAttribute("cy",h/2);
        shapeEl.setAttribute("rx",w/2 - s);
        shapeEl.setAttribute("ry",h/2 - s);
    }

    shapeEl.setAttribute("stroke","url(#g)");
    shapeEl.setAttribute("stroke-width",s);
    shapeEl.setAttribute("fill","none");
    shapeEl.setAttribute("stroke-linecap","round");

    previewSvg.appendChild(shapeEl);
}

["input","change"].forEach(ev=>{
    document.addEventListener(ev,updatePreview);
});

updatePreview();
