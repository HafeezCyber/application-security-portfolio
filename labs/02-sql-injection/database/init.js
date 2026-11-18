"use strict";

const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");

const databasePath = path.join(__dirname, "lab.sqlite");

const employees = [
  ["alice", "Engineering", "Developer"],
  ["bob", "Finance", "Analyst"],
  ["charlie", "IT Security", "Security Analyst"],
  ["diana", "Human Resources", "HR Officer"],
  ["eve", "Internal Audit", "IT Auditor"],
  ["frank", "Operations", "Operations Manager"]
];

const database = new DatabaseSync(databasePath);

try {
  database.exec(`
    CREATE TABLE IF NOT EXISTS employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      department TEXT NOT NULL,
      role TEXT NOT NULL
    );
  `);

  database.exec("DELETE FROM employees");

  const insert = database.prepare(`
    INSERT INTO employees (username, department, role)
    VALUES (?, ?, ?)
  `);

  for (const employee of employees) {
    insert.run(...employee);
  }

  const count = database.prepare(
    "SELECT COUNT(*) AS total FROM employees"
  ).get();

  const records = database.prepare(`
    SELECT id, username, department, role
    FROM employees
    ORDER BY id
  `).all();

  console.log("Database initialized:", databasePath);
  console.log("Synthetic employee records:", count.total);
  console.table(records);

  if (count.total !== 6) {
    throw new Error("Unexpected employee record count");
  }

  console.log("PASS: Synthetic database verification completed.");
} finally {
  database.close();
}
