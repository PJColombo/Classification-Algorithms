import Matrix from "../data_structures/Matrix";

export default  class LloydAlgorithm {
    constructor(datatable) {
        this.learningConstant = 0.1;
        this.epsilon = Math.pow(10, -10);
        this.maxIteration = 10;
        this.samples = new Map();
        this.centroids = this.generateDefaultInitialCenters();
        this.previousCentroids = this.cloneCentroids(this.centroids);
        this.classes = [];
        datatable.forEach((row, index) => {
            let dataRow = row.filter((val, index) => {
                if(index < row.length - 1)
                    return val;
            });
            if(this.samples.has(row[row.length - 1]))
                this.samples.get(row[row.length - 1]).push(dataRow);
            else  {
                this.classes.push(row[row.length - 1]);
                this.samples.set(row[row.length - 1], [dataRow]);
            }
            console.log(this.classes);
        });
        console.log(this.samples);
    }

    classifyData(dataMatrix) {
        let res = {
            classData: "",
            distance: Number.MAX_VALUE
        };
        this.centroids.forEach((centroid, index) => {
            let distance = this.calculateEuclidianDistance(dataMatrix, centroid);
            if (distance < res.distance) {
                res.distance = distance;
                res.classData = this.classes[index];
            }
        });
        console.log(res);
        return res;
    }
    execute() {
        let i = 0;
        let smallestDistance, distance;
        let smallestIndex;
        let areEqual = false;
        while(i < this.maxIteration && !areEqual) {
            //Iterate over every data.
            this.samples.forEach(val => {
               val.forEach(dataRow => {
                   let dataMatrix = new Matrix([dataRow]);
                   //Calculate distance to every centroid.
                   smallestDistance = Number.MAX_VALUE;
                    this.centroids.forEach((centroid, index) => {
                        distance = this.calculateEuclidianDistance(centroid, dataMatrix);
                        if(distance < smallestDistance) {
                            smallestDistance = distance;
                            smallestIndex = index;
                        }
                    });
                    this.centroids[smallestIndex] = this.updateCentroid(this.centroids[smallestIndex], dataMatrix);
               });
            });
            areEqual = this.isCentroidEquals(this.centroids, this.previousCentroids);
            this.previousCentroids = this.cloneCentroids(this.centroids);
            i++;
        }
    }
    updateCentroid(centroid, dataMatrix) {
        let subtractMatrix = dataMatrix.basicArithmeticOperation(centroid, false);
        centroid = centroid.basicArithmeticOperation(subtractMatrix.multiplyByNumber(this.learningConstant), true);
        return centroid;
    }

    isCentroidEquals(centroids, previousCentroids) {
        for (let i = 0; i < centroids.length; i++) {
            console.log(this.calculateEuclidianDistance(previousCentroids[i], centroids[i]));
            if(this.calculateEuclidianDistance(previousCentroids[i], centroids[i]) >= this.epsilon)
                return false;
        }
        return true;
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

    cloneCentroids(centroids) {
        return centroids.map(centroid => {
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