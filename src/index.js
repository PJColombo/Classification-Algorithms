import 'bootstrap';
import $ from "jquery";

import './scss/app.scss';
import './css/style.css';

import Matrix from "./model/data_structures/Matrix";

const fr = new FileReader();
const $dataFileSelector = "#inp-datafile";
const $executeBtnSelector = "#btn-execute";

let matrixText = [];
$(document).ready(() => {
    let  m = new Matrix([
        [4, 7],
        [2, 6],
    ]);
    console.log(m);
    console.log(m.divideBy(2));
    console.log(m.inverse());
    console.log(m.multiply(m.inverse()));
    $($dataFileSelector).change(onChangeInpFile(fr, $dataFileSelector));
    fr.onload = onLoadDataFile;
    $($executeBtnSelector).on("click", onExecute);
});

function onExecute() {
    console.log("Executing algorithm");
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
    matrixText = dataText.split(/\n/).map(val => {
        return val.split(",");
    });

    console.log(matrixText);
}