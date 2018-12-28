"use strict";
class HueGrid {

    constructor(chrom, xOr, yOr, wdth, hght) {
        this.hueVal; // global 2D array of hue values which means we need an array of arrays (because it is 2D)
        this.chrom = chrom;
        this.cSize = 10;
        this.maxDev = 5;
        this.reset(chrom);
        this.xOr = xOr;
        this.yOr = yOr;
        this.wdth = wdth;
        this.hght = hght;


        /**
        bits: 
        cSize = 0-3 (2^4 = 16, a range of 2-18), 
        init = 4-5 (2^2 = 4, 4 init methods), 
        colors = 6-7 (2^2 = 4, 4 colors), 
        stroke = 8 (2^1 = 2, 2 "states", on or off), 
        2^9 = 512 
        **/
    }

    reset(chrom) {
        background(100);
        this.chrom = chrom;
        this.cSize = (this.chrom & 15) + 3;
        this.initMeth = (this.chrom >>> 4) & 3;
        this.colorBit = (this.chrom >>> 6) & 3;
        this.stBit = (this.chrom >>> 8) & 1;
        this.hueVal = [];
        let rowLength = Math.floor(this.wdth / this.cSize);
        let colLength = Math.floor(this.hght / this.cSize);
        let grade = 360 / (rowLength + colLength); //creating a gradient
        for (let i = 0; i < rowLength; i++) {
            this.hueVal[i] = [];
            for (let j = 0; j < colLength; j++) {
                switch (this.colorBit) {
                    case 0:
                        this.hueVal[i][j] = (Math.random() * 360);
                        switch (this.initMeth) {

                            case 0:

                                this.hueVal[i][j] = Math.random() * 360
                                break;

                            case 1:

                                this.hueVal[i][j] = (j * 72) % 360;

                                break;

                            case 2:

                                this.hueVal[i][j] = (i * 72) % 360;
                                break;


                            case 3:

                                this.hueVal[i][j] = (i + j) * grade;
                                break;


                            default:
                                this.hueVal[i][j] = (Math.random() * 360);
                                break;

                        }
                        break;

                    case 1:
                        this.hueVal[i][j] = (Math.random() * 120) + 240;
                        switch (this.initMeth) {

                            case 0:

                                this.hueVal[i][j] = (Math.random() * 120) + 240;
                                break;

                            case 1:

                                this.hueVal[i][j] = (((j * 72) % 120) + 240);

                                break;

                            case 2:

                                this.hueVal[i][j] = (((i * 72) % 120) + 240);
                                break;


                            case 3:

                                this.hueVal[i][j] = (((i + j) * grade) % 120) + 240;
                                break;


                            default:
                                this.hueVal[i][j] = (Math.random() * 360);
                                break;

                        }
                        break;

                    case 2:
                        this.hueVal[i][j] = (Math.random() * 120) + 120;
                        switch (this.initMeth) {

                            case 0:
                                this.hueVal[i][j] = ((Math.random() * 120) + 120);
                                break;

                            case 1:
                                this.hueVal[i][j] = (((j * 72) % 120) + 120);

                                break;

                            case 2:
                                this.hueVal[i][j] = (((i * 72) % 120) + 120);
                                break;

                            case 3:
                                this.hueVal[i][j] = (((i + j) * grade) % 120) + 120;
                                break;



                            default:
                                this.hueVal[i][j] = ((Math.random() * 120) + 120);
                                break;

                        }
                        break;

                    case 3:
                        this.hueVal[i][j] = (Math.random() * 120);
                        switch (this.initMeth) {

                            case 0:
                                this.hueVal[i][j] = Math.random() * 120;
                                break;

                            case 1:
                                this.hueVal[i][j] = (j * 72) % 120;

                                break;

                            case 2:
                                this.hueVal[i][j] = (i * 72) % 120;
                                break;

                            case 3:
                                this.hueVal[i][j] = (((i + j) * grade) % 120);
                                break;

                            default:
                                this.hueVal[i][j] = Math.random() * 120;
                                break;

                        }
                        break;
                    default:
                        this.hueVal[i] = Math.random() * 360;
                        break;

                }

            }

        }
    }


    display() {
        push();
        translate(this.xOr, this.yOr);
        switch (this.stBit) {
            case 0:
                noStroke();
                break;

            case 1:
                stroke(0);
                break;

        }

        this.maxDev = mxDvSlider.value();


        for (let i = 0; i < this.hueVal.length; i++) {
            for (let j = 0; j < this.hueVal[i].length; j++) {
                this.hueVal[i][j] = this.hueVal[i][j] + random(-this.maxDev, this.maxDev);

                if (this.hueVal[i][j] > 360) {

                    this.hueVal[i][j] -= 360;

                } else if (this.hueVal[i][j] < 0) {

                    this.hueVal[i][j] += 360;
                }

                fill(this.hueVal[i][j], 100, 100, tpSlider.value());
                rect(i * this.cSize, j * this.cSize, this.cSize, this.cSize);

            }
        }
        pop();
    }

    mouseOver() {
        if (mouseX >= this.xOr && mouseY >= this.yOr && mouseX <= (this.wdth + this.xOr) && mouseY <= (this.hght + this.yOr)) {
            return true;
        } else {
            return false;
        }

    }

}
