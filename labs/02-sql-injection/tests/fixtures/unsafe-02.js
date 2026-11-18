"use strict";

// Unsafe: SQL interpolation uses a different variable name.
function lookup(database, department) {
  const lookupText = `
    SELECT * FROM employees
    WHERE department = '${department}'
  `;

  return database.prepare(lookupText).all();
}

module.exports = { lookup };
