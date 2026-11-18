"use strict";

const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const databasePath = path.join(
  __dirname,
  "../database/lab.sqlite"
);

/*
 * INTENTIONALLY VULNERABLE — EDUCATIONAL USE ONLY
 *
 * The username parameter is untrusted.
 * Direct interpolation into SQL can allow
 * attackers to change the query structure.
 *
 * Only use with the synthetic local lab database.
 */

function findEmployee(username) {
  if (typeof username !== "string") {
    throw new TypeError("Username must be a string");
  }

  const database = new DatabaseSync(
    databasePath,
    { readOnly: true }
  );

  try {
    const query = `
      SELECT id, username, department, role
      FROM employees
      WHERE username = '${username}'
    `;

    return database.prepare(query).all();
  } finally {
    database.close();
  }
}

module.exports = { findEmployee };

if (require.main === module) {
  const username = process.argv[2];

  if (!username) {
    console.error(
      "Usage: node lookup.js <username>"
    );
    process.exitCode = 1;
  } else {
    const results = findEmployee(username);
    console.table(results);
    console.log("Records returned:", results.length);
  }
}
