import BayesAlgorithm from "./BayesAlgorithm";

export default  class ClassificationAlgorithmFactory {
    static createClassificationAlgorithm(name, datatable) {
        switch(name.toLowerCase()) {
            case "bayes":
                return new BayesAlgorithm(datatable);
            case "lloyd":
                return -1;
            case "k-means":
                return -1;
            default:
                return -1;
        }
    }
}