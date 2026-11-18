"use strict";

// Unsafe: SQL constructed through string concatenation.
function lookup(database, username) {
  const sql =
    "SELECT * FROM employees WHERE username = '" +
    username +
    "'";

  return database.prepare(sql).all();
}

module.exports = { lookup };
