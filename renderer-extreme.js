/* COMIAL PRO — RENDER ENGINE EXTREME */

function renderAllLayers(){
    const preview=document.getElementById("preview");
    preview.innerHTML="";

    const shape=document.getElementById("shape").value;
    const stroke=parseFloat(document.getElementById("stroke").value);
    const radius=parseFloat(document.getElementById("radius").value);
    const speed=parseFloat(document.getElementById("speed").value);

    const theme={
        c1:document.getElementById("c1").value,
        c2:document.getElementById("c2").value,
        c3:document.getElementById("c3").value,
        c4:document.getElementById("c4").value
    };

    const W=preview.clientWidth;
    const H=preview.clientHeight;

    const layer=document.createElement("div");
    layer.className="shape-layer";

    /* SHAPE */
    if(shape==="rect"){layer.style.width=W+"px";layer.style.height=H+"px";}
    if(shape==="square"){let S=Math.min(W,H);layer.style.width=S+"px";layer.style.height=S+"px";}
    if(shape==="line-h"){layer.style.width=W+"px";layer.style.height=stroke+"px";}
    if(shape==="line-v"){layer.style.width=stroke+"px";layer.style.height=H+"px";}

    layer.style.border=`${stroke}px solid transparent`;
    layer.style.borderRadius=radius+"px";
    layer.style.borderImage=`linear-gradient(90deg,
        ${theme.c1},
        ${theme.c2},
        ${theme.c3},
        ${theme.c4}
    ) 1`;
    layer.style.animation=`borderFlow ${speed}s linear infinite`;

    /* EFFECTS */
    if(document.getElementById("fx3d").checked) layer.classList.add("neon-3d");
    if(document.getElementById("fxWet").checked) layer.classList.add("wet-glow");
    if(document.getElementById("fxTurbo").checked) layer.classList.add("turbo-glow");
    if(document.getElementById("fxAudio").checked) layer.classList.add("audio-reactive");

    preview.appendChild(layer);

    enhanceTurboLayers(theme);
}
