"use strict";

// Static SQL statement with no user-controlled interpolation.
function lookup(database) {
  const sql = `
    SELECT id, username
    FROM employees
  `;

  return database.prepare(sql).all();
}

module.exports = { lookup };
