import 'bootstrap';
import $ from "jquery";
import './scss/app.scss';
import './css/style.css';

import Matrix from "./model/data_structures/Matrix";
import Bayes from "./model/classification_algorithms/BayesAlgorithm";
import ClassificationAlgorithmFactory from "./model/classification_algorithms/ClassificationAlgorithmFactory";
import KMeansAlgorithm from "./model/classification_algorithms/KMeansAlgorithm";
import LloydAlgorithm from "./model/classification_algorithms/LloydAlgorithm";

const fr = new FileReader();

const $dataFileSelector = "#inp-datafile";
const $executeBtnSelector = "#btn-execute";
const $dropdownMenuItemSelector = ".dropdown-item";
const $algorithmNameSelector = "#algorithm-name";
const $algorithmContainerSelector = ".bayes-learning-data";
const $classifyInpSelector = "#classify-inp";
const $testContainerSelector = ".test-data-container";
const $testDataResultsSelector = ".test-data-results";
const $classifyBtnSelector = "#btn-classify";
const $clearBtnSelector = "#btn-clear";
// We need classesTable to keep record of every itemn class
let dataTable;
let selectedAlgorithm;
let algorithm;
let oldText;
let testDataMatrix;

$(document).ready(() => {
    $($dataFileSelector).change(onChangeInpFile(fr, $dataFileSelector));
    fr.onload = onLoadDataFile;
    $($executeBtnSelector).on("click", onExecuteLearning);
    $($dropdownMenuItemSelector).on("click", onDropdownItemSelected);
    $($classifyInpSelector).on("change paste input", onChangeInputTestData);
    $($classifyBtnSelector).on("click", onClickClassifyData);
    $($clearBtnSelector).on("click", clearFields);
});

function clearFields() {
    $($algorithmContainerSelector).empty();
    $($testDataResultsSelector).empty();
    $($testContainerSelector).empty();
}

function onClickClassifyData() {
    console.log(dataTable)
    if(!algorithm)
        alert('Choose an algorithm, upload data file and click "Execute learning".');
    else {
        $($testDataResultsSelector).empty();

        if(testDataMatrix && testDataMatrix.width === dataTable[0].length - 1) {
            let res = algorithm.classifyData(testDataMatrix);
            if(selectedAlgorithm.toLowerCase() !== "k-means")
                $($testDataResultsSelector).append(`<p>Sample data  is at a distance of <span class="result-number">${res.distance}</span> from <span class="result-group">${res.classData}</span></p>`);
            else
                $($testDataResultsSelector).append(`<p>Sample data has <span class="result-number">${res.probability*100}</span> probability to be <span class="result-group">${res.classData}</span></p>`);
        }
        else {
            alert("Please, type in a valid input (Remember that every number must be separated by spaces).");
        }
    }
}

function onChangeInputTestData() {
    let newText = $($classifyInpSelector).val();
    if(newText && newText !== oldText) {
        let numbersText = newText.split(" ");
        numbersText = numbersText.filter(val => {
            if(val)
                return val;
        });
        let n, i = 0;
        let allNumbers = true;
        let testDataNumbers = [];
        while(allNumbers && i < numbersText.length) {
            n = parseFloat(numbersText[i]);
            if(isNaN(n))
                allNumbers = false;
            else
                testDataNumbers.push(n);
            i++;
        }
        if(!allNumbers)
            console.log("Invalid input. Type in numbers only.");
        else {
            displayInputTestData(testDataNumbers);
            testDataMatrix = new Matrix([testDataNumbers]);
            oldText = newText;
        }
    }
    else {
        if(!newText)
            $($testContainerSelector).empty();
        else
            console.log("No se ha escrito en el input");
    }
}
function displayInputTestData(inputData) {
    $($testContainerSelector).empty();
    let inputDataMatrixDiv = `\\[ \\begin{pmatrix}\n`;
    inputData.forEach(val => {
        inputDataMatrixDiv += `${val}\\\\\n`;
    });
    inputDataMatrixDiv += `\\end{pmatrix}\\]`;
    $($testContainerSelector).append(inputDataMatrixDiv);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);

}

function onExecuteLearning() {
    console.log("Executing algorithm");
    console.log(selectedAlgorithm);
    // algorithm = ClassificationAlgorithmFactory.createClassificationAlgorithm(selectedAlgorithm);
    if(selectedAlgorithm.toLowerCase() === "bayes") {
        algorithm = new Bayes(dataTable);
        algorithm.execute();
        showBayesResults(algorithm.samples)
    }
    else if (selectedAlgorithm.toLowerCase() === "lloyd") {
        algorithm = new LloydAlgorithm(dataTable);
        algorithm.execute();
        showLloydResults({centroids: algorithm.centroids, classes: algorithm.classes});
    }
    else if (selectedAlgorithm.toLowerCase() === "k-means") {
        algorithm = new KMeansAlgorithm(dataTable);
        algorithm.execute();
        showKMeansResults({centroids: algorithm.centroids, uMatrix: algorithm.uMatrix, classes: algorithm.classes});
    }
}

function showLloydResults(data) {
    $($algorithmContainerSelector).empty();
    let centroidsDiv = "";
    let i = 1;
    data.centroids.forEach((centroid, index) => {
        centroidsDiv = `<div><h4>Class ${data.classes[index]} Final Centroid</h4></div>\\[ \\mathbf{C}_${i} = \\begin{pmatrix}\n`;
        centroid.matrix.forEach(row => {
            row.forEach((val, index) => {
                if(index < row.length - 1)
                    centroidsDiv += `${val} & `;
                else
                    centroidsDiv += `${val}\\\\\n`;
            });
        });
        centroidsDiv += `\\end{pmatrix}\\]</div>`;
        $($algorithmContainerSelector).append(centroidsDiv);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        i++;
    });
}

function showKMeansResults(data) {
    console.log(data);
    $($algorithmContainerSelector).empty();
    let uMatrixDiv, centroidsDiv;
    let i = 1;
    centroidsDiv = "";
    uMatrixDiv = `<div><h4>Final U Matrix</h4></div><div class="u-matrix-container">\\[U = \\begin{pmatrix}\n`;
    data.uMatrix.matrix.forEach(row => {
        console.log(row);
        row.forEach((val, index) => {
            if(index < row.length - 1)
                uMatrixDiv += `${val} & `;
            else
                uMatrixDiv += `${val}\\\\\n`;
        });

    });
    uMatrixDiv += `\\end{pmatrix}\\]</div>`;
    $($algorithmContainerSelector).append(uMatrixDiv);
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
    i++;
    i = 1;
    data.centroids.forEach((centroid, index) => {
        centroidsDiv = `<div><h4>Class ${data.classes[index]} Final Centroid</h4></div>\\[ \\mathbf{V}_${i} = \\begin{pmatrix}\n`;
        centroid.matrix.forEach(row => {
            row.forEach((val, index) => {
                if(index < row.length - 1)
                    centroidsDiv += `${val} & `;
                else
                    centroidsDiv += `${val}\\\\\n`;
            });
        });
        centroidsDiv += `\\end{pmatrix}\\]</div>`;
        $($algorithmContainerSelector).append(centroidsDiv);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        i++;
    });
}

function showBayesResults(samples) {
    $($algorithmContainerSelector).empty();
    let cMatrixDiv, avgMatrixDiv;
    cMatrixDiv = avgMatrixDiv = "";
    let i = 1;
    samples.forEach((value, key) => {
        cMatrixDiv = `<h4 class="bayes-sample">Class ${key}</h4><div>\\[ \\mathbf{C}_${i} = \\begin{pmatrix}\n`;
        avgMatrixDiv = `<div>\\[ \\mathbf{m}_${i} = \\begin{pmatrix}\n`;
        value.cMatrix.matrix.forEach(row => {
            row.forEach((val, index) => {
                if(index < row.length - 1)
                    cMatrixDiv += `${val} & `;
                else
                    cMatrixDiv += `${val}\\\\\n`;
            });
        });
        value.averageMatrix.matrix.forEach(row => {
            row.forEach(val => {
                avgMatrixDiv += `${val}\\\\\n`;
            });
        });
        cMatrixDiv += `\\end{pmatrix}\\]</div>`;
        avgMatrixDiv += `\\end{pmatrix}\\]</div>`;
        $($algorithmContainerSelector).append(cMatrixDiv);
        $($algorithmContainerSelector).append(avgMatrixDiv);
        MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
        i++;
    });
}

function onDropdownItemSelected() {
    selectedAlgorithm = $(this).text().toLowerCase();
    $($algorithmNameSelector).text($(this).text());
    clearFields();
}

function onChangeInpFile(fileReader, selector) {
    return () => {
        let file = $(selector).prop('files');
        if(file.length > 0)
            fileReader.readAsText(file[0]);
    };
}

function onLoadDataFile() {
    let dataText = fr.result;
    console.log(dataText);
    let matrixText = dataText.split(/\n/).map(val => {
        return val.split(",");
    });
    console.log(matrixText);
    dataTable = matrixText.map(row => {
        return row.map((val, index) => {
            if(index < row.length - 1)
                return parseFloat(val);
            else
                return val;
        });
    });
    if(dataTable[dataTable.length - 1].length > 0 && dataTable[dataTable.length - 1][0] === "") {
        console.log("Deleting empty position...");
        dataTable.pop();
    }
}

