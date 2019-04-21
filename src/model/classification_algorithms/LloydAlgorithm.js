import Matrix from "../data_structures/Matrix";

export default  class LloydAlgorithm {
    constructor(datatable) {
        this.learningConstant = 0.1;
        this.maxIteration = 10;
        this.tolerance = Math.pow(10, -10);
        this.samples = new Map();
        this.initialCenters = [];
        dataTable.forEach(row => {
            let dataRow = row.filter((val, index) => {
                if(index < row.length - 1)
                    return val;
            });
            if(this.samples.has(row[row.length - 1]))
                this.samples.get(row[row.length - 1]).dataTable.push(dataRow);
            else
                this.samples.set(row[row.length - 1], [dataRow]);
        });
        console.log(this.samples);
    }
    execute() {
        let i = 0;
        let centroids;
        let smallestDistance = Number.MAX_VALUE, distance;
        let smallestIndex;
        let previousCentroids, areEqual = false;
        while(i < this.maxIteration || !areEqual) {
            centroids = this.generateInitialCenters();
            //Iterate over every data.
            this.samples.forEach(val => {
               val.datatable.forEach(dataRow => {
                   let dataMatrix = new Matrix([dataRow]);
                   //Calculate distance to every centroid.
                    centroids.forEach((centroid, index) => {
                        distance = this.calculateDistance(centroid, dataMatrix);
                        if(distance < smallestDistance) {
                            smallestDistance = distance;
                            smallestIndex = index;
                        }
                    });
                    centroids[smallestIndex] = this.updateCentroid(centroids[smallestIndex], dataMatrix);
               });
            });
            areEqual = this.isCentroidEquals(centroids, previousCentroids);
            previousCentroids = centroids;
            i++;
        }
    }
    updateCentroid(centroid, dataMatrix) {
        let subtractMatrix = dataMatrix.basicArithmeticOperation(centroid, false);
        centroid = centroid.basicArithmeticOperation(subtractMatrix.multiplyByNumber(this.learningConstant), true);
        return centroid;
    }
    //TODO Implement centroid equals logic.
    isCentroidEquals(centroids, previousCentroids) {
        return false;
    }

    calculateDistance(centroidMatrix, dataMatrix) {
        let subtractElements = [];
        for(let i = 0; i < centroidMatrix.matrix.height; i++) {
            for(let j = 0; j < centroidMatrix.width; j++)
                subtractElements.push(Math.pow(centroidMatrix.matrix[i][j] - dataMatrix.matrix[i][j], 2));
        }
        let sum = subtractElements.reduce((previousValue, currentValue) => {
            return previousValue + currentValue;
        });
        return Math.sqrt(sum);
    }
    generateInitialCenters() {
        let totalSamples = 0;
        let numberVariables;
        let centroids = [];
        this.samples.forEach(value => {
            totalSamples += value.datatable.length;
            if(!numberVariables)
                numberVariables = value.datatable[0].length;
        });
        for(let i = 0; this.samples.size; i++) {
            let randomIndexSamples = [], centroid = [];
            for(let k = 0; k < numberVariables; k++)
                randomIndexSamples.push(Math.floor(Math.random() * totalSamples));
            randomIndexSamples.sort();
            let previousSize = 0;
            let i = 0;
            this.samples.forEach(value => {
                while(i < randomIndexSamples.length && randomIndexSamples[i] < value.datatable.length + previousSize) {
                    centroid.push(value.datatable[i][randomIndexSamples[i] + previousSize]);
                    i++;
                }
                previousSize += value.datatable.length;
            });
            centroids.push(new Matrix([centroid]));
        }
        return centroids;
    }
}