"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const vulnerable = require("../vulnerable/lookup.js");
const remediated = require("../remediated/lookup.js");

const databasePath = path.join(
  __dirname,
  "../database/lab.sqlite"
);

const injectionPayload = "' OR '1'='1";

test("legitimate lookup returns the expected employee", () => {
  const results = remediated.findEmployee("alice");

  assert.equal(results.length, 1);
  assert.equal(results[0].username, "alice");
  assert.equal(results[0].department, "Engineering");
});

test("legitimate lookup behavior is preserved", () => {
  const vulnerableResults = vulnerable.findEmployee("alice");
  const remediatedResults = remediated.findEmployee("alice");

  assert.deepEqual(remediatedResults, vulnerableResults);
});

test("unknown employee returns no records", () => {
  assert.deepEqual(
    remediated.findEmployee("nonexistent"),
    []
  );
});

test("baseline vulnerability remains reproducible", () => {
  const results = vulnerable.findEmployee(injectionPayload);

  assert.equal(results.length, 6);
});

test("parameterized query blocks the demonstrated injection", () => {
  const results = remediated.findEmployee(injectionPayload);

  assert.deepEqual(results, []);
});

test("injection cannot expand the remediated result set", () => {
  const results = remediated.findEmployee(injectionPayload);

  assert.ok(results.length < 6);
  assert.equal(results.length, 0);
});

test("numeric input is rejected", () => {
  assert.throws(
    () => remediated.findEmployee(123),
    TypeError
  );
});

test("null input is rejected", () => {
  assert.throws(
    () => remediated.findEmployee(null),
    TypeError
  );
});

test("object input is rejected", () => {
  assert.throws(
    () => remediated.findEmployee({ username: "alice" }),
    TypeError
  );
});

test("database retains all six synthetic records", () => {
  const database = new DatabaseSync(
    databasePath,
    { readOnly: true }
  );

  try {
    const result = database.prepare(
      "SELECT COUNT(*) AS total FROM employees"
    ).get();

    assert.equal(result.total, 6);
  } finally {
    database.close();
  }
});
