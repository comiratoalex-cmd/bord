/* AUDIO REACTIVE BORDER */

navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{
    const ctx=new AudioContext();
    const src=ctx.createMediaStreamSource(stream);
    const analyser=ctx.createAnalyser();

    analyser.fftSize=256;
    src.connect(analyser);

    const data=new Uint8Array(analyser.frequencyBinCount);

    function update(){
        analyser.getByteFrequencyData(data);
        let avg=data.reduce((a,b)=>a+b)/data.length;

        let amp=1+(avg/350);
        document.documentElement.style.setProperty("--audioAmp",amp);

        requestAnimationFrame(update);
    }

    update();
});
