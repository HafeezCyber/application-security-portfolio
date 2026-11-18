"use strict";

// Synthetic static-analysis fixtures.
// Do not execute these examples.

const { exec, execFile } = require("node:child_process");

// CASE 1: Template literal assigned to a variable.
function caseOne(input) {
  const command = `nslookup ${input}`;
  exec(command, () => {});
}

// CASE 2: Direct template literal.
function caseTwo(input) {
  exec(`nslookup ${input}`, () => {});
}

// CASE 3: String concatenation.
function caseThree(input) {
  const command = "nslookup " + input;
  exec(command, () => {});
}

// CASE 4: Direct concatenation.
function caseFour(input) {
  exec("nslookup " + input, () => {});
}

// CASE 5: Dynamic variable passed directly.
function caseFive(command) {
  exec(command, () => {});
}

// CASE 6: Shell execution explicitly enabled.
function caseSix(input) {
  execFile("nslookup", [input], { shell: true }, () => {});
}

// CASE 7: Safe execution with shell disabled.
function caseSeven(input) {
  execFile("nslookup", [input], { shell: false }, () => {});
}
