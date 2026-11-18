"use strict";

const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const databasePath = path.join(
  __dirname,
  "../database/lab.sqlite"
);

/*
 * REMEDIATED IMPLEMENTATION
 *
 * Uses SQLite prepared statements and bound
 * parameters to separate SQL syntax from data.
 *
 * The database is opened in read-only mode.
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
    const statement = database.prepare(`
      SELECT id, username, department, role
      FROM employees
      WHERE username = ?
    `);

    return statement.all(username);
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
