/*
	The purpose of this file is to take in the analyser node and a <canvas> element: 
	  - the module will create a drawing context that points at the <canvas> 
	  - it will store the reference to the analyser node
	  - in draw(), it will loop through the data in the analyser node
	  - and then draw something representative on the canvas
	  - maybe a better name for this file/module would be *visualizer.js* ?
*/

import * as utils from './utils.js';

let ctx, canvasWidth, canvasHeight, gradient, analyserNode, audioData,
    freqRad, waveRad, topTriColor, bottomTriColor, curveHueSlider, curveHueLabel, topTriButton, bottomTriButton, bothTriangleColors;

const displays = { //display options
    showFreq: true,
    showWave: false
}


function setupCanvas(canvasElement, analyserNodeRef, freqRadio, waveRadio, curveSlider, curveLabel, triTopColorButton, triBottomColorButton, bothTriColors) {
    // create drawing context
    ctx = canvasElement.getContext("2d");
    canvasWidth = canvasElement.width;
    canvasHeight = canvasElement.height;
    //variables for wave and frequency radio buttons
    freqRad = freqRadio;
    waveRad = waveRadio;
    curveHueSlider = curveSlider;
    curveHueLabel = curveLabel;
    topTriButton = triTopColorButton;
    bottomTriButton = triBottomColorButton;
    bothTriangleColors = bothTriColors;
    //changed gradient to use the same random gradient function I created in my project 1
    gradient = utils.getRandomGradient(ctx, canvasWidth, canvasHeight);
    topTriColor = utils.getRandomColor(); //set color of top triangle
    bottomTriColor = utils.getRandomColor(); //set color of bottom triangle
    // keep a reference to the analyser node
    analyserNode = analyserNodeRef;
    // this is the array where the analyser data will be stored
    audioData = new Uint8Array(analyserNode.fftSize / 2);
    waveRad.onchange = () => {
        displays.showWave = true; // switch to waveform
        displays.showFreq = false;
    }
    freqRad.onchange = () => {
        displays.showWave = false;
        displays.showFreq = true; //switch back to frequency
    }
    topTriButton.onclick = () => {
        topTriColor = utils.getRandomColor();
    }
    bottomTriButton.onclick = () => {
        bottomTriColor = utils.getRandomColor();
    }
    bothTriangleColors.onclick = () => {
        topTriColor = utils.getRandomColor();
        bottomTriColor = utils.getRandomColor();
    }

}

function draw(params = {}) {

    analyserNode.getByteFrequencyData(audioData); //frequency display by default

    if (displays.showWave) {
        analyserNode.getByteTimeDomainData(audioData); //waveform data
    }
    if (displays.showFreq) {
        analyserNode.getByteFrequencyData(audioData);
    }

    //variables used throughout the different displays
    let rotate = 0;
    let rotateAmt = 0.05;
    let halfWidth = canvasWidth / 2;
    let halfHeight = canvasHeight / 2;

    // 2 - draw background
    ctx.save();
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    ctx.restore();

    // 4 - draw bars
    if (params.showBars) {
        let barSpacing = 4;
        let margin = 5;
        let screenWidthForBars = canvasWidth - (audioData.length * barSpacing) - margin * 2;
        let barWidth = screenWidthForBars / audioData.length;
        let barHeight = 200;
        let topSpacing = 100;
        ctx.save();
        ctx.fillStyle = gradient;
        if (displays.showFreq) {
            ctx.globalAlpha = .5;
        } else { //make bars less flashy in waveform mode
            ctx.globalAlpha = .15;
        }
        //loop through the data and draw!

        for (let i = 0; i < audioData.length; i++) {
            ctx.beginPath();
            ctx.rect(margin + i * (barWidth + barSpacing), topSpacing + 256 - audioData[i], barWidth, barHeight);
            ctx.closePath();
            ctx.fill();
        }
        ctx.restore();
    }
    // 5 - draw triangles

    if (params.showTriangles) {
        ctx.save();
        for (let i = 0; i < audioData.length; i++) {
            ctx.save();
            ctx.strokeStyle = topTriColor;
            ctx.beginPath();
            let lineLength = audioData[i] / 2;
            ctx.moveTo(halfWidth - lineLength, halfHeight);
            ctx.lineTo(halfWidth + lineLength, halfHeight);
            ctx.lineTo(halfWidth, halfHeight - lineLength);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

            //upside-down triangle
            ctx.save();
            ctx.strokeStyle = bottomTriColor;
            ctx.beginPath();
            ctx.moveTo(halfWidth - lineLength, halfHeight + 5); // +5 in between the two for better spacing
            ctx.lineTo(halfWidth + lineLength, halfHeight + 5);
            ctx.lineTo(halfWidth, halfHeight + lineLength);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();

        }

        ctx.restore();

    }
    //draw bezier curve
    if (params.showCurves) {
        ctx.save();
        ctx.translate(halfWidth, halfHeight); //move to half the canvas width, half the canvas height
        if(displays.showFreq) {
            ctx.globalAlpha = 1.0;
        }
        else {
            ctx.globalAlpha = 0.5; //less flashiness in waveform mode
        }
        for (let i = 0; i < audioData.length; i++) {
            ctx.save();
            //change stroke color based on audio and have the hue multiplier change based on the bezier slider value
            ctx.strokeStyle = `hsl(${audioData[i] * curveHueSlider.value},100%, 50%)`;
            curveHueLabel.innerHTML = "Audio data * " + curveHueSlider.value;
            ctx.scale(.2, .2); //rotate the curve
            ctx.rotate(rotate);
            ctx.lineWidth = 10;
            ctx.translate(halfWidth, halfHeight); //had to translate a 2nd time to get bigger curve
            ctx.beginPath();
            ctx.bezierCurveTo(halfWidth + audioData[i], halfHeight + audioData[i], halfWidth, halfHeight - audioData[i], canvasWidth, halfHeight);
            ctx.closePath();
            ctx.stroke();
            ctx.restore();
            rotate += rotateAmt;
        }
        ctx.restore();

    }
    let imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight);
    let data = imageData.data;
    let length = data.length;
    let width = imageData.width;

    for (let i = 0; i < length; i += 4) {
        if (params.showNoise && Math.random() < .05) {
            // makes the channel an awesome shade of blue I often use, hex value #054B93
            data[i] = 5;
            data[i + 1] = 75;
            data[i + 2] = 147;
        }
        if (params.showInvert) { //too flashy in waveform!
            let red = data[i],
                green = data[i + 1],
                blue = data[i + 2];

            data[i] = 255 - red;
            data[i + 1] = 255 - green;
            data[i + 2] = 255 - blue;

        }
    }
    if (params.showEmboss) {
        for (let i = 0; i < length; i++) {
            if (i % 4 == 3) {
                continue;
            }
            data[i] = 127 + 2 * data[i] - data[i + 4] - data[i + width * 4];
        }
    }


    // D) copy image data back to canvas
    ctx.putImageData(imageData, 0, 0);

}

export {
    setupCanvas,
    displays,
    draw
};