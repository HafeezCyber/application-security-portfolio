# Lab 02 — SQL Injection: Detection, Exploitation and Remediation

## Executive Summary

This laboratory demonstrates an end-to-end application security
assessment of a deliberately vulnerable Node.js employee lookup
function backed by a synthetic SQLite database.

A SQL injection vulnerability was introduced through direct
interpolation of user-controlled input into a SQL query.

Controlled exploitation demonstrated that a crafted input could
alter the query predicate and return all six synthetic employee
records instead of the single record expected from a legitimate
lookup.

The vulnerability was remediated using parameterized SQL queries.
The original payload subsequently returned zero records against
the remediated implementation, while legitimate functionality
remained intact.

A custom Semgrep rule was also developed, evaluated, refined,
and used for post-remediation verification.

**Outcome:** Remediation verified for the demonstrated SQL
injection vulnerability in this controlled laboratory.

## Security Classification

| Attribute | Classification |
|---|---|
| Vulnerability | SQL Injection |
| CWE | CWE-89 |
| OWASP | A03:2021 — Injection |
| Provisional severity | High |
| Environment | Local synthetic laboratory |
| Assessment type | Application security testing |
| Remediation status | Verified for demonstrated payload |

The provisional severity reflects the demonstrated ability
to bypass the intended SQL query filter and retrieve additional
synthetic records. No formal CVSS score was calculated.

## Technology Stack

- JavaScript and Node.js
- Node.js built-in SQLite module (`node:sqlite`)
- SQLite
- Semgrep static analysis
- Node.js built-in test runner
- Git and GitHub Codespaces

## Assessment Objectives

1. Construct a controlled synthetic database.
2. Implement and identify a vulnerable SQL query.
3. Demonstrate the security impact through local exploitation.
4. Develop and evaluate custom static-analysis detection.
5. Implement parameterized-query remediation.
6. Verify remediation using runtime and static analysis.
7. Preserve reproducible technical evidence.

## Laboratory Architecture

The laboratory contains a synthetic SQLite database with six
fictional employee records.

The vulnerable and remediated lookup implementations are
maintained separately to enable direct behavioral comparison.

```text
labs/02-sql-injection/
├── README.md
├── FINDING-001.md
├── database/
│   └── init.js
├── vulnerable/
│   └── lookup.js
├── remediated/
│   └── lookup.js
├── rules/
│   └── node-sql-injection.yml
├── tests/
│   ├── lookup.test.js
│   └── fixtures/
└── evidence/
```

The generated SQLite database is excluded from Git.
It can be recreated locally using the initialization script.

## Methodology

### 1. Synthetic Environment Preparation

A local SQLite database was initialized with six fictional
employee records.

The database was used exclusively for controlled testing.
No production or third-party system was assessed.

### 2. Vulnerability Identification

The vulnerable implementation constructs a SQL statement by
interpolating the supplied username directly into the query.

```javascript
const query = `
  SELECT id, username, department, role
  FROM employees
  WHERE username = '${username}'
`;
```

This allows untrusted input to become part of the SQL syntax.

### 3. Controlled Exploitation

A legitimate lookup for `alice` returned one employee record.

The following payload was then supplied:

```text
' OR '1'='1
```

This changed the SQL predicate into a tautological condition.

**Observed result:** All six synthetic employee records
were returned.

The demonstrated impact was SQL query-filter bypass and
disclosure of additional synthetic employee records.

No separate authorization-control vulnerability was established.

### 4. Detection Engineering

An initial custom Semgrep rule was created to detect SQL
template interpolation.

Six synthetic JavaScript fixtures were then used to evaluate
its detection behavior:

- Three intentionally unsafe examples.
- Three benign examples.

The initial rule missed two unsafe examples.

The rule was refined to detect both SQL template interpolation
and string concatenation when passed to the targeted
`database.prepare()` pattern.

#### Detection Performance

| Metric | Initial | Refined |
|---|---:|---:|
| True positives | 1 | 3 |
| False negatives | 2 | 0 |
| False positives | 0 | 0 |
| True negatives | 3 | 3 |
| Precision | 100% | 100% |
| Recall | 33.33% | 100% |

These measurements apply only to the six controlled fixtures.

They do not establish general detection accuracy across
arbitrary JavaScript applications.

### 5. Secure Remediation

The remediated implementation uses a prepared statement with
a bound parameter:

```javascript
const statement = database.prepare(`
  SELECT id, username, department, role
  FROM employees
  WHERE username = ?
`);

return statement.all(username);
```

The SQL structure is fixed, while the username is supplied
separately as data.

The implementation also rejects non-string username inputs
and uses a read-only database connection.

### 6. Runtime Remediation Verification

| Test | Vulnerable | Remediated |
|---|---:|---:|
| Legitimate lookup (`alice`) | 1 record | 1 record |
| Injection payload | 6 records | 0 records |

The remediated lookup preserved legitimate functionality
and prevented the demonstrated payload from expanding
the query result set.

The database retained all six synthetic records.

### 7. Automated Security Regression Testing

A permanent Node.js test suite was implemented.

**Verified results:**

- Tests executed: 10
- Passed: 10
- Failed: 0
- Skipped: 0

The tests cover legitimate functionality, vulnerable behavior,
injection resistance, input validation, and database integrity.

### 8. Post-Remediation Static Analysis

The refined Semgrep rule was executed against both
implementations.

| Implementation | Findings |
|---|---:|
| Vulnerable lookup | 1 |
| Remediated lookup | 0 |

Both files were confirmed scanned.

This result supports the remediation for the targeted
detection pattern. It is not evidence that all possible
SQL injection vulnerabilities have been eliminated.

## Reproducing the Laboratory

Run the following commands from the repository root.

### Initialize the Synthetic Database

```bash
node labs/02-sql-injection/database/init.js
```

### Execute the Automated Regression Tests

```bash
node --test labs/02-sql-injection/tests/lookup.test.js
```

### Run the Custom Semgrep Rule

```bash
semgrep scan \
  --config labs/02-sql-injection/rules/node-sql-injection.yml \
  labs/02-sql-injection/vulnerable/lookup.js \
  labs/02-sql-injection/remediated/lookup.js
```

Semgrep ignore configuration may affect direct scans.
The recorded verification used isolated copies of the
implementations to confirm that both files were scanned.

## Technical Evidence

| Evidence | Artifact |
|---|---|
| Formal vulnerability finding | [FINDING-001.md](FINDING-001.md) |
| Controlled exploitation | [SQL injection PoC](evidence/sql-injection-poc.json) |
| Initial detection rule | [Original Semgrep rule](evidence/semgrep-initial-rule.yml) |
| Initial detection evaluation | [Initial metrics](evidence/semgrep-initial-evaluation.json) |
| Refined detection evaluation | [Refined metrics](evidence/semgrep-refined-evaluation.json) |
| Refined detection findings | [Refined scan results](evidence/semgrep-refined-results.json) |
| Post-remediation scan | [SAST results](evidence/semgrep-remediation-results.json) |
| Remediation verification | [Verification summary](evidence/semgrep-remediation-verification.json) |
| Regression tests | [Automated test suite](tests/lookup.test.js) |

## Security Lessons

1. SQL string interpolation can allow untrusted input
   to change query semantics.
2. Parameterized queries separate SQL syntax from data.
3. Security controls should be verified through
   reproducible testing.
4. Static-analysis rules require positive and negative
   test cases to evaluate detection quality.
5. Detection improvements should be measured rather
   than assumed.
6. Remediation verification benefits from both
   runtime testing and static analysis.

## Scope and Limitations

- This was an authorized, purpose-built local laboratory.
- All employee data was fictional.
- No production database or third-party application was tested.
- The observed impact was limited to the demonstrated
  query-filter bypass and synthetic record disclosure.
- No independent authorization bypass was established.
- The Semgrep rule is pattern-based and does not perform
  comprehensive interprocedural taint analysis.
- The six-fixture evaluation is not representative of
  general-world detection accuracy.
- The remediation was verified against the demonstrated
  payload and the implemented regression suite.
- No claim of complete vulnerability elimination is made.

## Final Outcome

**Lab 02 successfully demonstrated SQL injection identification,
controlled exploitation, custom detection engineering,
parameterized-query remediation, and security verification.**

The laboratory provides reproducible evidence of an
application security workflow using synthetic data.
