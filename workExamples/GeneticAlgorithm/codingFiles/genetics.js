"use strict";
class Genetics {

    constructor(nBits, popSize) {
        this.nBits = nBits; //nBits = 9
        this.popSize = popSize; //popSize = 9;
        this.popArr = []; //population array
        this.fitArr = []; //fitness array

    }

    randChrom() {
        return Math.floor(random(2 ** 9));
        //same as Math.floor(random(512)) from phases 1 and 2

    }

    mutation(chrom) {
        let bitLoc = Math.floor(random(this.nBits)); //random mutate point
        let mask = (2 ** bitLoc);
        let newChrom = mask ^ chrom; //newChrom = mask xor chrom
        return newChrom;

    }

    crossOver(p1, p2) {
        let crossPt = Math.floor(random(this.nBits)); //random crossover point
        let p1Mask = ((crossPt + 1) ** 2) - 1;
        let p1Cont = p1 & p1Mask;
        let p2Cont = p2 >>> (crossPt + 1)
        p2 >>> (crossPt + 1);
        let result = p1Cont | p2Cont; //result = p1Cont or p2Cont
        return result;



    }

    insertNew(chrom, fitness, index) {
        this.popArr[index] = chrom;
        this.fitArr[index] = fitness;
    }

    bumpFit(index, amount) {

        this.fitArr[index] += amount;
        print(index, this.fitArr[index]);
    }

    select() {
        let sel1 = Math.floor(random(this.popSize));
        let sel2 = Math.floor(random(this.popSize));

        let fit1 = this.fitArr[sel1]; //fitness value of first random huegrid
        let fit2 = this.fitArr[sel2]; //fitness value of second random huegrid

        print(sel1, fit1, sel2, fit2);


        if (fit1 > fit2) {
            return this.popArr[sel1];
        } else {
            return this.popArr[sel2];
        }


    }

    breed1() {
        //does crossover, mutation and selection all @ once
        let p1 = this.select();
        let p2 = this.select();
        let breed = this.crossOver(p1, p2)
        let child = this.mutation(breed);
        return child;
        
    }

    highestFit() {
        let where = 0;
        for (let i = 1; i < this.popSize; i++) {
            if (this.fitArr[i] > this.fitArr[where]) {
                where = i;
            }
        } return this.popArr[where];  

    }









}
