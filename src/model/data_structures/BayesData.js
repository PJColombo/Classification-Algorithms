import Matrix from "./Matrix";

export default class BayesData {
    constructor(dataTable) {
        this.dataTable = dataTable;
        this.cMatrix = new Matrix();
        this.averageMatrix = new Matrix();
    }
}