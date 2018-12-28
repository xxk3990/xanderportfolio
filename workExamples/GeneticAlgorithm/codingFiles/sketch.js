"use strict";
/**
 * Project 3 phase 4. - Xander Kaylan
 * 4/16/18
 **/


let cnv; //making the canvas a global variable
let mxDvSlider; //slider to adjust maxDev
let mxDvLabel; //label for maxDev slider
let resetBut; //reset button
let tpSlider; //transparency slider
let tpLabel; //label for transparency slider
let huGd; //array of 9 hueGrids!
let gen; //Genetics class object
let mutateBut; //mutation button
let xOverBut; //crossover button
let selBut; // normal button that does the selection
let breed1But; //breed1 button
let breedGenBut; //breed new generation button

function setup() {
    cnv = createCanvas(980, 720);
    colorMode(HSB);
    background(100);
    noStroke();
    huGd = [];
    mxDvSlider = createSlider(0, 50, 1, 0);
    mxDvSlider.position(20, 20);
    mxDvLabel = createDiv("Max Dev");
    mxDvLabel.position(mxDvSlider.x + 2, mxDvSlider.y + 20);

    resetBut = createButton("Reset");
    resetBut.position(width - 400, 20);
    resetBut.mousePressed(reset); //calling reset function when mouse is pressed

    tpSlider = createSlider(0.0, 1.0, 1, 0);
    tpSlider.position(width - 110, 20);
    tpLabel = createDiv("Transparency");
    tpLabel.position(tpSlider.x + 2, tpSlider.y + 20);

    mutateBut = createButton("Mutate");
    mutateBut.position(width - 600, 20);
    mutateBut.mousePressed(mutate); //calling mutate function when mouse is pressed

    xOverBut = createButton("Crossover");
    xOverBut.position(width - 500, 20);
    xOverBut.mousePressed(crossOver);

    selBut = createButton("Select 1");
    selBut.position(width - 700, 20);
    selBut.mousePressed(doSelect);

    breed1But = createButton("Breed 1");
    breed1But.position(width - 800, 20);
    breed1But.mousePressed(breed1);

    breedGenBut = createButton("Breed Gen");
    breedGenBut.position(width - 300, 20);
    breedGenBut.mousePressed(breedGen);

    gen = new Genetics(9, 9);
    //displaying the 9 hueGrids
    let newChrom = gen.randChrom();
    huGd[0] = new HueGrid(newChrom, 20, 80, 300, 200);
    gen.insertNew(newChrom, 0, 0);

    newChrom = gen.randChrom();
    huGd[1] = new HueGrid(newChrom, 340, 80, 300, 200);
    gen.insertNew(newChrom, 0, 1);

    newChrom = gen.randChrom();
    huGd[2] = new HueGrid(newChrom, 660, 80, 300, 200);
    gen.insertNew(newChrom, 0, 2);

    newChrom = gen.randChrom();
    huGd[3] = new HueGrid(newChrom, 20, 300, 300, 200);
    gen.insertNew(newChrom, 0, 3);

    newChrom = gen.randChrom();
    huGd[4] = new HueGrid(newChrom, 340, 300, 300, 200);
    gen.insertNew(newChrom, 0, 4);

    newChrom = gen.randChrom();
    huGd[5] = new HueGrid(newChrom, 660, 300, 300, 200);
    gen.insertNew(newChrom, 0, 5);

    newChrom = gen.randChrom();
    huGd[6] = new HueGrid(newChrom, 20, 520, 300, 200);
    gen.insertNew(newChrom, 0, 6);

    newChrom = gen.randChrom();
    huGd[7] = new HueGrid(newChrom, 340, 520, 300, 200);
    gen.insertNew(newChrom, 0, 7);

    newChrom = gen.randChrom();
    huGd[8] = new HueGrid(newChrom, 660, 520, 300, 200);
    gen.insertNew(newChrom, 0, 8);

    //using random chromosome method from genetics class to call stuff in reset() from huegrid class


    reset(); //call to reset function



}


function reset() {
    for (let i = 0; i < huGd.length; i++) {
        let newChrom = gen.randChrom();
        huGd[i].reset(newChrom);
        gen.insertNew(newChrom, 0, i);
    }


}

function mutate() {
    let mutChrom = gen.mutation(huGd[0].chrom);
    huGd[0].reset(mutChrom);
    gen.insertNew(mutChrom, 0, 0);
}

function crossOver() {
    let randNum = Math.floor(random(1, 8)); //random number between 1-8
    let crossChrom = gen.crossOver(huGd[0].chrom, huGd[randNum].chrom); //random hue grid in hue grid array
    huGd[0].reset(crossChrom);
    gen.insertNew(crossChrom, 0, 0);
}

function doSelect() {
    let newChrom = gen.select();
    huGd[0].reset(newChrom);
    gen.insertNew(newChrom, 0, 0);

}

function breed1() {
    let breedOne = gen.breed1(); //does crossover, mutation and selection all @ once
    huGd[0].reset(breedOne);
    gen.insertNew(breedOne, 0, 0);
}

function breedGen() {
    let nextGen = []; //local array for next generation of huegrids
    let nextChrom = gen.highestFit();
    nextGen[0] = nextChrom;
    
    for (let i = 1; i < 9; i++) {
        nextGen[i] = gen.breed1(); //breed new huegrid at index i
    }
    
    for (let j = 0; j < 9; j++) {
        gen.insertNew(nextGen[j], 0, j);
        huGd[j].reset(nextGen[j]);
    }

}


function draw() {
    //calling display method in hue grid class, adjusting maxDev and transparency
    mxDvLabel.html("Max Dev: " + Math.round(mxDvSlider.value()));
    tpLabel.html("Transparency: " + nf(tpSlider.value(), 1, 2));

    for (let j = 0; j < huGd.length; j++) {
        huGd[j].display();
    }

}

function keyTyped() {
    let where = -1;
    for (let i = 0; i < huGd.length; i++) {
        if (huGd[i].mouseOver()) {
            where = i;
        }
    }
    if (where >= 0) {
        if (key == '+') {
            gen.bumpFit(where, 1);
        } else if (key == '-') {
            gen.bumpFit(where, -1);
        }
    }



}
