import 'bootstrap';
import $ from "jquery";
import './scss/app.scss';
import './css/style.css';

import Matrix from "./model/data_structures/Matrix";
import Bayes from "./model/classification_algorithms/BayesAlgorithm";
import ClassificationAlgorithmFactory from "./model/classification_algorithms/ClassificationAlgorithmFactory";

const fr = new FileReader();

const $dataFileSelector = "#inp-datafile";
const $executeBtnSelector = "#btn-execute";
const $dropdownMenuItemSelector = ".dropdown-item";
const $algorithmNameSelector = "#algorithm-name";
const $algorithmContainerSelector = ".bayes-learning-data";
const $classifyInpSelector = "#classify-inp";
const $testContainerSelector = ".test-data-container";
const $classifyBtnSelector = "#btn-classify";

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
});



function onClickClassifyData() {
    if(!algorithm)
        console.log("algorithm doesn't exists");
    else {
        console.log(testDataMatrix);
        console.log(algorithm.classifyData(testDataMatrix));
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
    algorithm = new Bayes(dataTable);
    algorithm.execute();
    showBayesResults(algorithm.samples);
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
    dataTable = matrixText.map(row => {
        return row.map((val, index) => {
            if(index < row.length - 1)
                return parseFloat(val);
            else
                return val;
        });
    });
}