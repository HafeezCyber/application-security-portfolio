"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const Module = require("node:module");
const path = require("node:path");

const target = path.resolve(
  __dirname,
  "../remediated/lookup.js"
);

function loadWithMockExecFile() {
  const calls = [];
  const originalLoad = Module._load;

  try {
    Module._load = function (request, parent, isMain) {
      if (request === "node:child_process") {
        return {
          execFile: (...args) => {
            calls.push(args);
          },
        };
      }
      return originalLoad.call(this, request, parent, isMain);
    };

    delete require.cache[target];
    const implementation = require(target);
    return { implementation, calls };
  } finally {
    Module._load = originalLoad;
    delete require.cache[target];
  }
}

test("accepts a valid hostname", () => {
  const { implementation, calls } = loadWithMockExecFile();
  const callback = () => {};

  implementation.lookupHost("example.com", callback);

  assert.equal(calls.length, 1);
  assert.equal(calls[0][0], "nslookup");
  assert.deepEqual(calls[0][1], ["example.com"]);
  assert.equal(calls[0][3], callback);
});

test("disables shell execution", () => {
  const { implementation, calls } = loadWithMockExecFile();

  implementation.lookupHost("example.com", () => {});

  assert.equal(calls.length, 1);
  assert.equal(calls[0][2].shell, false);
});

test("enforces a command timeout", () => {
  const { implementation, calls } = loadWithMockExecFile();

  implementation.lookupHost("example.com", () => {});

  assert.equal(calls[0][2].timeout, 5000);
});

const maliciousInputs = [
  "example.com;id",
  "example.com && whoami",
  "example.com | cat /etc/passwd",
  "$(whoami)",
  "`whoami`",
  "example.com\nwhoami",
  "example.com > output.txt",
  "-malicious.com",
  "example..com",
  "example.com.",
  "",
  null,
  undefined,
  12345,
];

for (const input of maliciousInputs) {
  test(`rejects unsafe input: ${JSON.stringify(input)}`, () => {
    const { implementation, calls } = loadWithMockExecFile();

    assert.throws(
      () => implementation.lookupHost(input, () => {}),
      TypeError
    );

    assert.equal(
      calls.length,
      0,
      "Invalid input must not reach the subprocess API"
    );
  });
}
