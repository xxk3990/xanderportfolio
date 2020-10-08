// Why are the all of these ES6 Arrow functions instead of regular JS functions?
// No particular reason, actually, just that it's good for you to get used to this syntax
// For Project 2 - any code added here MUST also use arrow function syntax

const makeColor = (red, green, blue, alpha = 1) => {
    return `rgba(${red},${green},${blue},${alpha})`;
};

const getRandom = (min, max) => {
    return Math.random() * (max - min) + min;
};

const getRandomColor = () => {
    const floor = 35; // so that colors are not too bright or too dark 
    const getByte = () => getRandom(floor, 255 - floor);
    return `rgba(${getByte()},${getByte()},${getByte()},1)`;
};

const getLinearGradient = (ctx, startX, startY, endX, endY, colorStops) => {
    let lg = ctx.createLinearGradient(startX, startY, endX, endY);
    for (let stop of colorStops) {
        lg.addColorStop(stop.percent, stop.color);
    }
    return lg;
};

const getRandomGradient = (ctx, canvasWidth, canvasHeight) => {
    /*
    Same get random gradient function I created in project 1 
    */
   let startColor = getRandomColor(); //start color
   let stop1 = getRandomColor(); //25%
   let midColor = getRandomColor(); //halfway point
   let stop3 = getRandomColor(); //75%
   let endColor = getRandomColor(); //end color

   let grade = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
   grade.addColorStop(0, startColor);
   grade.addColorStop(0.25, stop1);
   grade.addColorStop(.5, midColor);
   grade.addColorStop(.75, stop3);
   grade.addColorStop(1, endColor);
    return grade;
};


const goFullscreen = (element) => {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.mozRequestFullscreen) {
        element.mozRequestFullscreen();
    } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
        element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    }
    // .. and do nothing if the method is not supported
};

export {
    makeColor,
    getRandomColor,
    getLinearGradient,
    getRandomGradient,
    goFullscreen
};