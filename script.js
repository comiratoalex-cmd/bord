document.addEventListener("input", renderAllLayers);
document.addEventListener("change", renderAllLayers);

setTimeout(renderAllLayers, 80);

/* Export Viewer */
exportViewer.onclick = () => {
    const url = new URL(location.origin + "/bord/view.html");

    ["shape", "width", "height", "stroke", "radius", "speed",
     "c1", "c2", "c3", "c4"].forEach(k =>
        url.searchParams.set(k, $(k).value)
    );

    viewerLink.value = url.toString();
};

/* Export OBS */
exportOBS.onclick = () => {
    const url = new URL(location.origin + "/bord/obs.html");

    ["shape", "width", "height", "stroke", "radius", "speed",
     "c1", "c2", "c3", "c4"].forEach(k =>
        url.searchParams.set(k, $(k).value)
    );

    obsLink.value = url.toString();
};
