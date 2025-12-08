/* MULTILAYER — THEOWOO TURBO */

function enhanceTurboLayers(theme){
    const preview=document.getElementById("preview");

    createLayer(preview,theme,1.05,20,0.45);
    createLayer(preview,theme,1.10,30,0.35);
    createLayer(preview,theme,1.15,45,0.28);
}

function createLayer(preview,theme,scale,blur,opacity){
    const L=document.createElement("div");
    L.className="shape-layer";
    L.style.transform=`scale(${scale})`;
    L.style.filter=`drop-shadow(0 0 ${blur}px ${hex(theme.c2,opacity)})`;
    preview.appendChild(L);
}

function hex(h,a){
    h=h.replace("#","");
    let r=parseInt(h.slice(0,2),16);
    let g=parseInt(h.slice(2,4),16);
    let b=parseInt(h.slice(4,6),16);
    return `rgba(${r},${g},${b},${a})`;
}
