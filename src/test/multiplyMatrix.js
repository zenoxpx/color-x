import { multiplyMatrix } from "../color.js";

function assert(actual, expected, message) {
  const isArrayEqual = (arrayA, arrayB) => {
    if(arrayA === null) {
      return arrayB === null;
    }
    return arrayA.toString() === arrayB.toString();
  }
  
  const passed = isArrayEqual(actual, expected);

  if(passed) {
    console.log(`%c[ PASS ] ${message}`, "color: green");
  } else {
    console.error(`[ FAIL ] ${message}`, { actual, expected });
  }
}

// TODO: テストケースをもう少し追加
console.group("multiplyMatrix Test Suite");
let matA, matB, matC;

matA = [
  [1, 1],
  [2, 1]
];
matB = [
  [2, 3],
  [1, 1]
];
matC = [
  [3, 4],
  [5, 7]
]
assert(multiplyMatrix(matA, matB), matC, "case1");

matA = [];
matB = [
  [1]
]
matC = null;
assert(multiplyMatrix(matA, matB), matC, "case2");

console.groupEnd();