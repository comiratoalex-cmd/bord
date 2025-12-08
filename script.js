/* ============================================================
   COMIAL PRO — SCRIPT PRINCIPAL
============================================================ */

const $ = id => document.getElementById(id);

/* Atualiza o preview automaticamente */
function updatePreview(){
    renderAllLayers();
}

document.addEventListener("input", updatePreview);
document.addEventListener("change", updatePreview);

/* Força um render ao carregar */
setTimeout(updatePreview, 100);


/* ============================================================
   EXPORTAÇÃO DOS LINKS
============================================================ */

$("exportViewer").onclick = () => {
    const url = new URL(location.origin + "/bord/view.html");

    ["shape","width","height","stroke","radius","speed","c1","c2","c3","c4"]
        .forEach(k => url.searchParams.set(k, $(k).value));

    url.searchParams.set("fx3d", $("fx3d").checked);
    url.searchParams.set("fxWet", $("fxWet").checked);
    url.searchParams.set("fxTurbo", $("fxTurbo").checked);

    $("viewerLink").value = url.toString();
};

$("exportOBS").onclick = () => {
    const url = new URL(location.origin + "/bord/obs.html");

    ["shape","width","height","stroke","radius","speed","c1","c2","c3","c4"]
        .forEach(k => url.searchParams.set(k, $(k).value));

    url.searchParams.set("fx3d", $("fx3d").checked);
    url.searchParams.set("fxWet", $("fxWet").checked);
    url.searchParams.set("fxTurbo", $("fxTurbo").checked);

    $("obsLink").value = url.toString();
};
