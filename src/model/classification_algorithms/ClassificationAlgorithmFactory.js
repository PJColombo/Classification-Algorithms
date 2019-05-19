import BayesAlgorithm from "./BayesAlgorithm";
import LloydAlgorithm from "./LloydAlgorithm";
import KMeansAlgorithm from "./KMeansAlgorithm";

export default  class ClassificationAlgorithmFactory {
    static createClassificationAlgorithm(name, datatable) {
        switch(name.toLowerCase()) {
            case "bayes":
                return new BayesAlgorithm(datatable);
            case "lloyd":
                return new LloydAlgorithm(datatable);
            case "k-means":
                return new KMeansAlgorithm(datatable);
            default:
                return new KMeansAlgorithm(datatable);
        }
    }
}