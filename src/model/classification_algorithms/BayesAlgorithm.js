import Matrix from '../data_structures/Matrix';
import BayesData from '../data_structures/BayesData';

export default class BayesAlgorithm {
    constructor(dataTable) {
        console.log(dataTable);
        this.samples = new Map();
        dataTable.forEach(row => {
            let dataRow = row.filter((val, index) => {
                if(index < row.length - 1)
                    return val;
            });
            if(this.samples.has(row[row.length - 1]))
                this.samples.get(row[row.length - 1]).dataTable.push(dataRow);
            else
                this.samples.set(row[row.length - 1], new BayesData([dataRow]));
        });
        console.log(this.samples);
    }
    execute() {
        this.samples.forEach((value, key) => {
            value.averageMatrix = this.calculateAverageMatrix(value.dataTable);
            value.cMatrix = this.calculateCMatrix(value.dataTable, value.averageMatrix);
        });
        /*let res = this.classifyData(new Matrix([[50, 200, 100]]));
        console.log("Classification: ");
        console.log(res.classData, res.probability);*/
    }
    calculateAverageMatrix(dataTable) {
        let avgArr = [];
        let res;
        for (let i = 0; i < dataTable[0].length; i++) {
            console.log(Matrix.matrixColumn(dataTable, i));
            /*Take every column and calculate its average value.*/
            res = Matrix.matrixColumn(dataTable, i).reduce((prev, curr) => {
                return prev + curr;
            }) / dataTable.length;
            avgArr.push(res.toFixed(2));
        }
        return new Matrix([avgArr]);
    }
    calculateCMatrix(dataTable, averageMatrix) {
        let firstMatrixOperand, secondMatrixOperand;
        let sumMatrix;
        dataTable.forEach(row => {
            secondMatrixOperand = new Matrix([row]).basicArithmeticOperation(averageMatrix, false);
            firstMatrixOperand = secondMatrixOperand.transpose();
            if(!sumMatrix)
                sumMatrix = firstMatrixOperand.multiply(secondMatrixOperand);
            else
                sumMatrix = sumMatrix.basicArithmeticOperation(firstMatrixOperand.multiply(secondMatrixOperand), true);
        });
        if(sumMatrix)
            return sumMatrix.divideBy(dataTable.length);
    }
    classifyData(dataMatrix) {
        let res = {
            classData: "",
            probability: Number.MAX_VALUE
        };
        let currProbability;
        this.samples.forEach((value, key) => {
            if(value.cMatrix.determinant() !== 0) {
                currProbability = this.calculateProbability(dataMatrix, value.cMatrix, value.averageMatrix);
                if(currProbability < res.probability) {
                    console.log("aqui " + currProbability);
                   res.probability = currProbability;
                   res.classData = key;
                }
            }
            else
                console.log(`Class ${key} C matrix has determinant 0`);
        });
        return res;
    }
    calculateProbability(dataMatrix, cMatrix, avgMatrix) {
        console.log("Distance: " + this.calculateDistance(dataMatrix, cMatrix, avgMatrix));
        return Math.pow(Math.E, (- 1 / 2) * this.calculateDistance(dataMatrix, cMatrix, avgMatrix));
    }
    calculateDistance(dataMatrix, cMatrix, avgMatrix) {
        let firstMatrixOperand, secondMatrixOperand, inverseCMatrix;
        secondMatrixOperand = dataMatrix.basicArithmeticOperation(avgMatrix, false);
        firstMatrixOperand = secondMatrixOperand.transpose();
        inverseCMatrix = cMatrix.inverse();
        console.log(secondMatrixOperand);
        return secondMatrixOperand.multiply(inverseCMatrix).multiply(firstMatrixOperand).matrix[0][0];
    }
}