"use strict";

// Harmless template interpolation, not executable SQL.
function greeting(username) {
  const message = `Welcome, ${username}`;
  return message;
}

module.exports = { greeting };
