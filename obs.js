function getParam(id, def=null){
    const p = new URLSearchParams(location.search);
    return p.get(id) ?? def;
}

window.fx3d    = { checked: getParam("fx3d")==="true" };
window.fxWet   = { checked: getParam("fxWet")==="true" };
window.fxTurbo = { checked: getParam("fxTurbo")==="true" };
window.fxAudio = { checked: getParam("fxAudio")==="true" };

let params = `
<input id="shape" value="${getParam("shape","rect")}">
<input id="width" value="${getParam("width","800")}">
<input id="height" value="${getParam("height","300")}">
<input id="stroke" value="${getParam("stroke","4")}">
<input id="radius" value="${getParam("radius","25")}">
<input id="speed" value="${getParam("speed","10")}">

<input id="c1" value="${getParam("c1","#aee7ff")}">
<input id="c2" value="${getParam("c2","#ffc0e6")}">
<input id="c3" value="${getParam("c3","#ffe4b3")}">
<input id="c4" value="${getParam("c4","#ffd9c7")}">
`;

document.body.insertAdjacentHTML("beforeend", params);

// delay necessário pro OBS
setTimeout(() => {
    renderAllLayers();
}, 100);
