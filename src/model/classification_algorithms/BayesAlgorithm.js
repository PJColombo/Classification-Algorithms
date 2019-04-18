import Matrix from '../data_structures/Matrix';

export default class BayesAlgorithm {
    constructor(dataTable) {
        this.dataTable = dataTable;
        this.cMatrix = [];
        this.averageMatrix = [];
    }
    execute() {

    }
    calculateAverageMatrix() {
        console.log(Matrix.matrixColumn(this.dataTable, 1));
    }
}