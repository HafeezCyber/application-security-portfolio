"use strict";

// Static-analysis fixtures only.
// These functions are not executed.

const { exec, execFile } = require("node:child_process");

// CASE 1: Constant shell command.
function benignOne() {
  exec("date", () => {});
}

// CASE 2: Constant command stored in a variable.
function benignTwo() {
  const command = "date";
  exec(command, () => {});
}

// CASE 3: Constant command assembled from literals.
function benignThree() {
  const command = "echo " + "hello";
  exec(command, () => {});
}

// CASE 4: Shell disabled with validated argument.
function benignFour(hostname) {
  if (!/^[a-zA-Z0-9.-]+$/.test(hostname)) {
    throw new TypeError("Invalid hostname");
  }

  execFile(
    "nslookup",
    [hostname],
    { shell: false },
    () => {}
  );
}

// CASE 5: Fixed executable and fixed arguments.
function benignFive() {
  execFile(
    "node",
    ["--version"],
    { shell: false },
    () => {}
  );
}
