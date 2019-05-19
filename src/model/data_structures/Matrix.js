export default  class Matrix {
    constructor(matrix) {
        this.matrix = matrix;
        if(matrix && matrix[0]) {
            this.height = matrix.length;
            this.width = matrix[0].length;
        }
        else {
            this.height = 0;
            this.width = 0;
        }
    }

    basicArithmeticOperation(matrix2, addition) {
        if(this.height === matrix2.height && this.width === matrix2.width) {
            let resMatrix = [];
            for(let i = 0; i < this.height; i++) {
                let row = [];
                for(let j = 0; j < this.width; j++) {
                    if(addition)
                        row.push(this.matrix[i][j] + matrix2.matrix[i][j]);
                    else
                        row.push(this.matrix[i][j] - matrix2.matrix[i][j]);
                }
                resMatrix.push(row);
            }
            return new Matrix(resMatrix);
        }
    }
    multiply(matrix2) {
        let resMatrix = [];
        if(this.width === matrix2.height) {
            let row, col2, resRow;
            for(let i = 0; i < this.height; i++) {
                resRow = [];
                row = this.matrix[i];
                for(let j = 0; j < matrix2.width; j++) {
                    col2 = Matrix.matrixColumn(matrix2.matrix, j);
                    let sum = 0;
                    for(let k = 0; k < row.length; k++) {
                        let n = row[k] * col2[k];
                        sum += n;
                    }
                    resRow.push(sum);
                }
                resMatrix.push(resRow);
            }
            return new Matrix(resMatrix);
        }
    }
    multiplyByNumber(n) {
        return new Matrix(this.matrix.map(row => {
            return row.map(val => {
                let mul = val * n;
                return mul;
            });
        }));
    }
    divideBy(n) {
        return new Matrix(this.matrix.map(row => {
            return row.map(val => {
                let div = val / n;
                return div;
            });
        }));
    }
    transpose() {
        let resMatrix = [];
        for(let i = 0; i < this.width; i++)
            resMatrix.push(Matrix.matrixColumn(this.matrix, i));
        return new Matrix(resMatrix);
    }
    determinant() {
        return this.calculateDeterminant(this);
    }
    inverse() {
        let m = this.clone();
        let auxiliaryMatrix, invertedMatrix;
        let index;
        auxiliaryMatrix = m.createFilledMatrix(m.width, m.height);
        invertedMatrix = m.createFilledMatrix(m.width, m.height);
        index = m.createFilledArray(m.height);


        auxiliaryMatrix.matrix.forEach((val, index, arr) => {
            arr[index][index] = 1;
        });

        m.transformToUpperTriangle(m, index);

        for(let i = 0; i < m.height - 1; i++) {
            for(let j = i + 1; j < m.height; j++) {
                for(let k = 0; k < m.height; k++)
                    auxiliaryMatrix.matrix[index[j]][k] -= m.matrix[index[j]][i] * auxiliaryMatrix.matrix[index[i]][k];
            }
        }

        for(let i = 0; i < m.height; i++) {
            invertedMatrix.matrix[m.height - 1][i] = (auxiliaryMatrix.matrix[index[m.height - 1]][i] /
                m.matrix[index[m.height - 1]][m.height - 1]);
            for(let j = m.height - 2; j >= 0; j--) {
                invertedMatrix.matrix[j][i] = auxiliaryMatrix.matrix[index[j]][i];
                for(let k = j + 1; k < m.height; k++)
                    invertedMatrix.matrix[j][i] -= (m.matrix[index[j]][k] * invertedMatrix.matrix[k][i]);
                invertedMatrix.matrix[j][i] /= m.matrix[index[j]][j];
            }
        }

        return invertedMatrix;
    }

    transformToUpperTriangle(matrix, index) {
        let c = this.createFilledArray(matrix.height);
        let c0, c1, pi0, pi1, pj;
        let itmp, k;

        for(let i = 0; i < matrix.height; i++)
            index[i] = i;

        for(let i = 0; i < matrix.height; i++) {
            c1 = 0;
            for(let j = 0; j < matrix.height; j++) {
                c0 = Math.abs(matrix.matrix[i][j]);
                if(c0 > c1)
                    c1 = c0;
            }
            c[i] = c1;
        }
        k = 0;

        for(let j = 0; j < matrix.height - 1; j++) {
            pi1 = 0;
            for(let i = j; i < matrix.height; i++) {
                pi0 = Math.abs(matrix.matrix[i][j]);
                pi0 /= c[index[i]];
                if(pi0 > pi1) {
                    pi1 = pi0;
                    k = i;
                }
            }
            itmp = index[j];
            index[j] = index[k];
            index[k] = itmp;

            for(let i = j + 1; i < matrix.height; i++) {
                pj = matrix.matrix[index[i]][j] / matrix.matrix[index[j]][j];
                matrix.matrix[index[i]][j] = pj;
                for(let l = j + 1; l < matrix.height; l++)
                    matrix.matrix[index[i]][l] -= pj * matrix.matrix[index[j]][l];
            }
        }
    }
    calculateDeterminant(m) {
        let res = 0;
        if(m.width === m.height) {
            if(m.width === 1)
                return m.matrix[0][0];

            if(m.width === 2)
                return (m.matrix[0][0] * m.matrix[1][1]) - (m.matrix[0][1] * m.matrix[1][0]);
            let temporary;
            for(let i = 0; i < m.width; i++) {
                temporary = m.createFilledMatrix(m.width - 1, m.height - 1);
                for(let j = 1; j < m.height; j++) {
                    for(let k = 0; k < m.width; k++) {
                        if (k < i)
                            temporary.matrix[j - 1][k] = m.matrix[j][k];
                        else if (k > i)
                            temporary.matrix[j - 1][k - 1] = m.matrix[j][k];
                    }
                }
                res += m.matrix[0][i] * Math.pow(-1, i) * this.calculateDeterminant(temporary);
            }
            return res;
        }
        else
            return null;
    }

    createFilledMatrix(width, height, defaultValue) {
        return new Matrix([...Array(height)].map(val => {
            return [...Array(width)].map(e => {
                if(defaultValue && defaultValue !== 0)
                    return defaultValue;
                else
                    return 0;
            });
        }));
    }
    createFilledArray(size) {
        return [...Array(size)].map(val => { return 0 });
    }

    clone() {
        return new Matrix(this.matrix.map(row => {
            return Array.from(row);
        }));
    }

    static matrixColumn(matrix, colIndex) {
        return matrix.map(row => {
            return row[colIndex];
        });
    }
}