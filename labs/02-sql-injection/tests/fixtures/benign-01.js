"use strict";

// Safe SQL parameter binding.
function lookup(database, username) {
  const query = `
    SELECT * FROM employees
    WHERE username = ?
  `;

  return database.prepare(query).all(username);
}

module.exports = { lookup };
