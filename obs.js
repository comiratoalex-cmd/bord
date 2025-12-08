function getParam(id, def=null){
    const p = new URLSearchParams(location.search);
    return p.get(id) ?? def;
}

window.fx3d    = { checked: getParam("fx3d") === "true" };
window.fxWet   = { checked: getParam("fxWet") === "true" };
window.fxTurbo = { checked: getParam("fxTurbo") === "true" };
window.fxAudio = { checked: getParam("fxAudio") === "true" };

let params = `
<input id="shape" value="${getParam("shape")}">
<input id="width" value="${getParam("width")}">
<input id="height" value="${getParam("height")}">
<input id="stroke" value="${getParam("stroke")}">
<input id="radius" value="${getParam("radius")}">
<input id="speed" value="${getParam("speed")}">

<input id="c1" value="${getParam("c1")}">
<input id="c2" value="${getParam("c2")}">
<input id="c3" value="${getParam("c3")}">
<input id="c4" value="${getParam("c4")}">
`;

document.body.insertAdjacentHTML("beforeend", params);

// DELAY PARA O LAYOUT CARREGAR
setTimeout(() => {
    renderAllLayers();
}, 40);
