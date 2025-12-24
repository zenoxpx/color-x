import { hsvToRgb } from "../color.js";

function assertEquals(actual, expected, message) {
  const EPSILON = 0.000001;
  const isClose = (a, b) => Math.abs(a - b) < EPSILON;

  const passed = isClose(actual.r, expected.r) &&
                 isClose(actual.g, expected.g) &&
                 isClose(actual.b, expected.b);

  if(passed) {
    console.log(`%c[ PASS ] ${message}`, "color: green");
  } else {
    console.error(`[FAIL] ${message}`, { actual, expected });
  }
}

console.group("hsvToRgb Test Suite");

assertEquals(hsvToRgb(0, 100, 100), {r: 1, g: 0, b:0}, "Red: 0deg, 100%, 100%");
assertEquals(hsvToRgb(120, 100, 100), {r: 0, g: 1, b:0}, "Green: 120deg, 100%, 100%");
assertEquals(hsvToRgb(240, 100, 100), {r: 0, g: 0, b:1}, "Blue: 240deg, 100%, 100%");
assertEquals(hsvToRgb(0, 0, 100), {r: 1, g: 1, b:1}, "White: 0deg, 0%, 100%");
assertEquals(hsvToRgb(0, 0, 0), {r: 0, g: 0, b:0}, "Black: 0deg, 0%, 0%");

console.groupEnd();