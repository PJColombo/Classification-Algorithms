import Matrix from "../data_structures/Matrix";

export default class KMeansAlgorithm {
    constructor(samples) {
        this.epsilon = 0.01;
        this.b = 2;
        this.centroids = this.generateDefaultInitialCenters();
        this.prevCentroids = this.cloneCentroids();
        this.samples = [];
        this.classes = [];
        samples.forEach(sample => {
            let filteredSample = sample.filter((val, index) => {
                if(index < sample.length - 1)
                    return val;
            });
            if(this.classes.length > 0 && this.classes[this.classes.length - 1] !== sample[sample.length - 1])
                this.classes.push(sample[sample.length - 1]);
            else if(this.classes.length === 0)
                this.classes.push(sample[sample.length - 1]);
            this.samples.push(new Matrix([filteredSample]));
        });
        this.uMatrix = this.generateUMatrix();
    }

    classifyData(dataMatrix) {
        let res = {
            classData: "",
            probability: Number.MIN_VALUE
        };
        this.centroids.forEach((centroid, index) => {
            let p = this.calculateProbability(dataMatrix, index);
            if (p > res.probability) {
                res.probability = p;
                res.classData = this.classes[index];
            }
        });
        return res;
    }
    execute() {
        let iter = 0;
        let stop = false;
        while(!stop) {
            //Calculate new centroids.
            for(let i = 0; i < this.prevCentroids.length; i++)
                this.centroids[i] = this.calculateCentroid(i);
            stop = this.stopAlgorithm();
            if(!stop) {
                this.prevCentroids = this.cloneCentroids();
                //Generate U matrix using new centroids.
                this.uMatrix = this.generateUMatrix();
                iter++;
            }
        }
    }

    generateUMatrix() {
        let uMatrix = [];
        let row;
        for (let i = 0; i < this.centroids.length; i++) {
            row = [];
            for (let j = 0; j < this.samples.length; j++) {
                row.push(this.calculateProbability(this.samples[j], i));
            }
            uMatrix.push(row);
        }
        return new Matrix(uMatrix);
    }

    calculateCentroid(indexCentroid) {
        let probability, sumProbability = 0, matrixSum, matrix;
        for (let j = 0; j < this.samples.length; j++) {
            probability = this.uMatrix.matrix[indexCentroid][j];
            probability = Math.pow(probability, this.b);
            sumProbability += probability;
            matrix = this.samples[j].multiplyByNumber(probability);
            if(!matrixSum)
                matrixSum = matrix;
            else
                matrixSum = matrixSum.basicArithmeticOperation(matrix, true);
        }
        return matrixSum.divideBy(sumProbability);
    }
    calculateEuclidianDistance(matrix1, matrix2) {
        let sum = 0;
        if(matrix1.height === 1 && matrix1.height === matrix2.height && matrix1.width === matrix2.width) {
            for (let i = 0; i < matrix1.width; i++)
                sum += Math.pow(matrix1.matrix[0][i] - matrix2.matrix[0][i], 2);
            return Math.sqrt(sum);
        }
        else
            return -1;
    }

    calculateProbability(xMatrix, indexCentroid) {
        let numerator, denominator, bExponent = this.b - 1;
        numerator = Math.pow(1 / Math.pow(this.calculateEuclidianDistance(xMatrix, this.centroids[indexCentroid]), 2), bExponent);
        denominator = this.centroids.reduce((accum, currCentroid) => {
            return accum + Math.pow(1 / Math.pow(this.calculateEuclidianDistance(currCentroid, xMatrix), 2), bExponent);
        }, 0);
        return numerator / denominator;
    }

    stopAlgorithm() {
        for(let i = 0; i < this.centroids.length; i++) {
            if(this.calculateEuclidianDistance(this.centroids[i], this.prevCentroids[i]) >= this.epsilon)
                return false;
        }
        return true;
    }

    cloneCentroids() {
        return this.centroids.map(centroid => {
            return centroid.clone();
        });
    }
    generateDefaultInitialCenters() {
        let centroids = [];
        centroids.push(new Matrix([[4.6, 3.0, 4.0, 0.0]]));
        centroids.push(new Matrix([[6.8, 3.4, 4.6, 0.7]]));

        return centroids;
    }
}