/*
	main.js is primarily responsible for hooking up the UI to the rest of the application 
	and setting up the main event loop
*/

import * as utils from './utils.js';
import * as audio from './audio.js';
import * as canvas from './visualizer.js'; //canvas visualizer
const drawParams = {
    showBars: true,
    showTriangles: true,
    showCurves: true,
    showNoise: false,
    showInvert: false,
    showEmboss: false
};
// 1 - here we are faking an enumeration
const DEFAULTS = Object.freeze({
    sound1: "media/New Adventure Theme.mp3"
});
let progSlider = document.querySelector("#progressSlider");
let freqRadio = document.querySelector("#freq-radio");
let waveRadio = document.querySelector("#wave-radio");
let distSlider = document.querySelector("#distSlider");
let distCheck = document.querySelector("#distortCB");
let distortOn = false;
let distSliderChanged = false;
//slider that allows you to adjust how much the audio data is multiplied by for the bezier curve hue value
let curveHueSlider = document.querySelector("#curveSlider");
let curveHueLabel = document.querySelector("#curveLabel");
let curveHueTitle = document.querySelector("#curveHueTitle");

//made the cb variable below script level so I could adjust it in loop()
let curveCheck = document.querySelector("#curvesCB");
let triCheck = document.querySelector('#trianglesCB');

let triTopColorButton = document.querySelector("#topColor");
let triBottomColorButton = document.querySelector("#bottomColor");
let bothTriColorsButton = document.querySelector("#bothColors");
let triColorTitle = document.querySelector("#triangleColorTitle");
//below added in September 2021. Adds new color features and additional stuff.
let bgbtn = document.querySelector("#background-btn");
let randCurveGrade = document.querySelector("#rand-gradient");
let oneCurveColor = document.querySelector("#one-curve-color");
let audioCurveColor = document.querySelector("#normal-mode")
let audioCurveLabel = document.querySelector("#normal-mode-label");
let randGradeCurveLabel = document.querySelector("#rand-grade-label");
let oneCurveColorLabel = document.querySelector("#one-curve-color-label");
let bgColorRandGrade = document.querySelector("#background-btn-rand-grade");
let bgColorSingleColor = document.querySelector("#background-btn-one-color");

function init() {
    audio.setupWebaudio(DEFAULTS.sound1);
    let canvasElement = document.querySelector("canvas"); // hookup <canvas> element
    canvas.setupCanvas(canvasElement, audio.analyserNode, freqRadio, waveRadio, curveHueSlider, curveHueLabel, triTopColorButton, triBottomColorButton, bothTriColorsButton, bgbtn,
        randCurveGrade, audioCurveColor, oneCurveColor, bgColorRandGrade, bgColorSingleColor);
    setupUI(canvasElement);
    progSlider.value = audio.element.currentTime / audio.element.duration;
    progSlider.oninput = () => { //allow user to change point in song
        if (audio.element) {
            audio.element.currentTime = (progSlider.value * audio.element.duration); //update progress slider
        }

    }
    if (playButton.dataset.playing == 'yes') { //only allow progress slider changes if in 'play' mode
        progSlider.onmousedown = (e) => {
            audio.pauseCurrentSound(); //stops audio from playing if the user changes the progress slider
        }
        progSlider.onmouseup = (e) => {
            audio.playCurrentSound();
        }
    }
    distCheck.checked = distortOn;
    distCheck.onchange = e => {
        distortOn = e.target.checked; //turn on distortion if checked
        audio.disableDistort();
        if (distortOn) { //set distortion amount = slider value
            audio.setDistortAmount(distSlider.value);
            audio.setDistortionCurve();
            audio.waveShaperNode.oversample = "4x";
        } else {
            audio.disableDistort(); //disable if distortion is off
        }
    }
    distSlider.onchange = e => {
        distSliderChanged = true;
    }


    loop();
}

function loop() {
    requestAnimationFrame(loop);

    canvas.draw(drawParams);

    let progLabel = document.querySelector("#progressLabel");
    /* 
    current time code below from https://mikeheavers.com/tutorials/format_html5_current_time_property/
    except I ended up not needing to do "parseInt((audio.currentTime / 60) % 60);" which is the equation 
    they use for minutes, and only had to do currentTime / 60. 
    */
    let curSec = parseInt(audio.element.currentTime % 60);
    let curMin = parseInt(audio.element.currentTime / 60);

    //end time code same as current time code above in terms of math but uses duration property instead
    let endSec = parseInt(audio.element.duration % 60);
    let endMin = parseInt(audio.element.duration / 60);
    if (curSec < 10) {
        //adds a 0 if current second is below 10
        progLabel.innerHTML = curMin + ":0" + curSec + " / " + endMin + ":" + endSec;
    }
    if (endSec < 10) {
        //add 0 if endSec is less than 10
        progLabel.innerHTML = curMin + ":" + curSec + " / " + endMin + ":0" + endSec;

    }
    if (curSec < 10 && endSec < 10) {
        //add a zero to both if they both are
        progLabel.innerHTML = curMin + ":0" + curSec + " / " + endMin + ":0" + endSec;

    }
    if (curSec >= 10 && endSec >= 10) {
        //default
        progLabel.innerHTML = curMin + ":" + curSec + " / " + endMin + ":" + endSec;
    }

    progSlider.value = audio.element.currentTime / audio.element.duration; //slider value is the current time / the total time
    if (audio.element.currentTime == audio.element.duration) {
        //change play/pause button to "pause" state if the timer ends
        playButton.dataset.playing = "no";
    }

    if (distortOn) {
        if (distSliderChanged) {
            audio.setDistortAmount(distSlider.value);
            audio.setDistortionCurve();
            distSliderChanged = false;
        }
    }
    if (curveCheck.checked == false) {
        curveHueSlider.setAttribute("disabled", true); //disable hue multiplier slider if bezier cb is unchecked
        //set text on either side of slider to 0.5 opacity, will happen by default for slider when disabled
        curveHueLabel.style.opacity = "0.5";
        curveHueTitle.style.opacity = "0.5";
        curveHueSlider.style.cursor = "default"; //remove click cursor to avoid confusion
        //below added September 2021. Adds functionality for enabling/disabling new curve color radio buttons
        randCurveGrade.setAttribute("disabled", true);
        audioCurveColor.setAttribute('disabled', true);
        oneCurveColor.setAttribute('disabled', true);
        randGradeCurveLabel.style.opacity = '0.5';
        audioCurveLabel.style.opacity = '0.5';
        oneCurveColorLabel.style.opacity = '0.5';

    } else {
        if (audioCurveColor.checked) {
            //below added September 2021. Adds functionality for enabling/disabling new curve color radio buttons and curve hue slider
            curveHueSlider.removeAttribute("disabled"); //disable hue multiplier slider if bezier cb is unchecked and audio curve color is unchecked
            //set text on either side of slider to 0.5 opacity, will happen by default for slider when disabled
            curveHueLabel.style.opacity = "1.0";
            curveHueTitle.style.opacity = "1.0";
            curveHueSlider.style.cursor = "pointer";
        } else {
            curveHueSlider.setAttribute("disabled", true); //disable hue multiplier slider if bezier cb is unchecked
            //set text on either side of slider to 0.5 opacity, will happen by default for slider when disabled
            curveHueLabel.style.opacity = "0.5";
            curveHueTitle.style.opacity = "0.5";
            curveHueSlider.style.cursor = "default"; //remove click cursor to avoid confusion
        }
        //below added September 2021. Adds functionality for enabling/disabling new curve color radio buttons
        randCurveGrade.removeAttribute("disabled");
        audioCurveColor.removeAttribute('disabled');
        oneCurveColor.removeAttribute('disabled');
        randGradeCurveLabel.removeAttribute('disabled');
        audioCurveLabel.removeAttribute('disabled');
        oneCurveColorLabel.removeAttribute('disabled');
        randGradeCurveLabel.style.opacity = '1';
        audioCurveLabel.style.opacity = '1';
        oneCurveColorLabel.style.opacity = '1';
    }
    if (triCheck.checked == false) {
        triTopColorButton.setAttribute("disabled", true); //disable tri color buttons if tri cb is unchecked
        triBottomColorButton.setAttribute("disabled", true);
        bothTriColorsButton.setAttribute("disabled", true);

        triColorTitle.style.opacity = "0.5"; //change opacity to 0.5 on title

        //reset cursor to default to avoid confusion
        triTopColorButton.style.cursor = "default";
        triBottomColorButton.style.cursor = "default";
        bothTriColorsButton.style.cursor = "default";

    } else {
        triTopColorButton.removeAttribute("disabled"); //restore if it's checked
        triBottomColorButton.removeAttribute("disabled");
        bothTriColorsButton.removeAttribute("disabled");

        triColorTitle.style.opacity = "1"; //restore opacity

        //restore cursor to pointer
        triTopColorButton.style.cursor = "pointer";
        triBottomColorButton.style.cursor = "pointer";
        bothTriColorsButton.style.cursor = "pointer";
    }
}

function setupUI(canvasElement) {
    const fsButton = document.querySelector("#fsButton");

    fsButton.onclick = e => {
        console.log("init called");
        utils.goFullscreen(canvasElement);
    };
    playButton.onclick = e => {
        if (audio.audioCtx.state == "suspended") {
            audio.audioCtx.resume();
        }

        if (e.target.dataset.playing == 'no') {
            audio.playCurrentSound();
            e.target.dataset.playing = "yes";
        } else {
            audio.pauseCurrentSound();
            e.target.dataset.playing = "no";
        }
    }
    let volumeSlider = document.querySelector("#volumeSlider");
    let volumeLabel = document.querySelector("#volumeLabel");

    volumeSlider.oninput = e => {
        audio.setVolume(e.target.value);
        volumeLabel.innerHTML = Math.round((e.target.value / 2 * 100));

    }
    progSlider.dispatchEvent(new Event("change"));

    //set value of label to match initial value of slider
    volumeSlider.dispatchEvent(new Event("input"));

    distSlider.dispatchEvent(new Event("change")); //setup distortion slider

    //setup track select and audio upload
    let trackSelect = document.querySelector("#trackSelect");
    let trackRadio = document.querySelector("#toggle-track");
    let audioUpload = document.querySelector("#audio-upload");
    let uploadRadio = document.querySelector("#toggle-upload");
    let uploaded = false; //bool for checking if something was uploaded
    let uploadSrc; //src for uploaded file

    trackSelect.onchange = (e) => { //default
        audio.loadSoundFile(e.target.value);
        distortOn = distCheck.checked = distSliderChanged = false;
        audio.disableDistort(); //disable distortion when switching tracks
        distSlider.value = 0; //reset to zero
        if (playButton.dataset.playing = "yes") {
            playButton.dispatchEvent(new MouseEvent("click"));
        }
    }

    trackRadio.onchange = () => {
        trackSelect.removeAttribute("disabled"); //enable track select mode
        audioUpload.setAttribute("disabled", true); //disable audio upload mode
        trackSelect.style.cursor = "pointer"; //give dropdown click cursor
        audioUpload.style.cursor = "default"; //remove click cursor on audio upload
        playButton.dataset.playing = "no";
        audio.pauseCurrentSound();
        //if you toggled distortion on your uploaded file but switched back to track, disable distortion
        distortOn = distCheck.checked = distSliderChanged = false;
        audio.disableDistort();
        distSlider.value = 0; //reset to zero again
        audio.loadSoundFile(trackSelect.value); //load current selection in dropdown
        trackSelect.onchange = (e) => {
            audio.loadSoundFile(e.target.value);
            //had to disable distortion again here, so it resets when you change tracks
            distortOn = distCheck.checked = distSliderChanged = false;
            audio.disableDistort();
            distSlider.value = 0; //reset to zero
            if (playButton.dataset.playing = "yes") {
                playButton.dispatchEvent(new MouseEvent("click"));
            }
        }
    }
    uploadRadio.onchange = () => {
        trackSelect.setAttribute("disabled", true);
        audioUpload.removeAttribute("disabled");
        trackSelect.style.cursor = "default"; //remove click cursor on track select
        audioUpload.style.cursor = "pointer"; //add click cursor on audio upload button
        playButton.dataset.playing = "no";
        audio.pauseCurrentSound();
        //if you toggled distortion on the track dropdown but switched to upload, disable distortion
        distortOn = distCheck.checked = distSliderChanged = false;
        audio.disableDistort();
        distSlider.value = 0; //reset to zero here too
        audioUpload.onchange = e => {
            const files = e.target.files;
            //set function scope src variable equal to files so the uploaded file can be saved
            try { //if user selects a file to upload
                uploadSrc = URL.createObjectURL(files[0]);
                audio.element.src = uploadSrc;
                uploaded = true;
            } catch { //if they don't pick one (aka hit cancel), stop playing
                audio.pauseCurrentSound();
                playButton.dataset.playing = "no";
            }
            if (playButton.dataset.playing = "yes") {
                playButton.dispatchEvent(new MouseEvent("click"));
            }
            //if you upload a new file, disable distortion
            distortOn = distCheck.checked = distSliderChanged = false;
            audio.disableDistort();
            distSlider.value = 0; //reset to zero here too
        }
        if (uploaded) {
            //if clicking on upload a second time but not uploading a new song, play current upload
            audio.element.src = uploadSrc;
        }
    }

    //last but not least, setup remaining checkboxes and connect to respective drawParams
    let barCheck = document.querySelector('#barsCB');
    let invertCheck = document.querySelector('#invertCB');
    let noiseCheck = document.querySelector('#noiseCB');
    let embossCheck = document.querySelector('#embossCB');

    barCheck.checked = drawParams.showBars;
    barCheck.onchange = e => {
        drawParams.showBars = e.target.checked;
        canvas.draw(drawParams.showBars);
    }

    triCheck.checked = drawParams.showTriangles;
    triCheck.onchange = e => {
        drawParams.showTriangles = e.target.checked;
        canvas.draw(drawParams.showTriangles);
    };

    curveCheck.checked = drawParams.showCurves;
    curveCheck.onchange = e => {
        drawParams.showCurves = e.target.checked;
        canvas.draw(drawParams.showCurves);
    }
    noiseCheck.checked = drawParams.showNoise;
    noiseCheck.onchange = e => {
        drawParams.showNoise = e.target.checked;
        canvas.draw(drawParams.showNoise);
    };

    invertCheck.checked = drawParams.showInvert;
    invertCheck.onchange = e => {
        drawParams.showInvert = e.target.checked;
        canvas.draw(drawParams.showInvert);
    };
    embossCheck.checked = drawParams.showEmboss;
    embossCheck.onchange = e => {
        drawParams.showEmboss = e.target.checked;
        canvas.draw(drawParams.showEmboss);
    };

} // end setupUI

export {
    init
};