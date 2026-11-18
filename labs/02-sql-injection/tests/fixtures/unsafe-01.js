"use strict";

// Unsafe: user-controlled input enters SQL syntax.
function lookup(database, username) {
  const query = `
    SELECT * FROM employees
    WHERE username = '${username}'
  `;

  return database.prepare(query).all();
}

module.exports = { lookup };
