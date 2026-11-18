# FINDING-001 — SQL Injection in Employee Lookup

## Finding Summary

| Attribute | Description |
|---|---|
| Finding ID | APPSEC-LAB02-001 |
| Title | SQL Injection in Employee Lookup |
| Classification | CWE-89 |
| OWASP Mapping | A03:2021 — Injection |
| Affected Component | `vulnerable/lookup.js` |
| Assessment Type | Controlled local application security testing |
| Finding Status | Confirmed in vulnerable implementation |
| Remediation Status | Pending |
| Severity | High (provisional laboratory assessment) |
| CVSS | Not assigned |

## 1. Description

The employee lookup function constructs an SQL statement
by directly interpolating an untrusted username.

An attacker controlling this input can introduce SQL
syntax that changes the intended query condition.

A controlled proof of concept demonstrated that the
function returned all six synthetic employee records
instead of a single requested record.

## 2. Root Cause

The implementation fails to maintain separation between
untrusted application data and executable SQL syntax.

The username is embedded directly into the query string
rather than supplied as a bound SQL parameter.

## 3. Vulnerable Code

```javascript
const query = `
  SELECT id, username, department, role
  FROM employees
  WHERE username = '${username}'
`;

return database.prepare(query).all();
```

## 4. Proof of Concept

**Test environment:** Local Node.js application with a
synthetic SQLite employee database.

### Legitimate Request

Input:

```text
alice
```

SQL condition:

```sql
WHERE username = 'alice'
```

**Observed result:** 1 employee record.

### Injection Request

Input:

```text
' OR '1'='1
```

Resulting SQL condition:

```sql
WHERE username = '' OR '1'='1'
```

**Observed result:** 6 employee records.

### Evidence

[SQL Injection Proof of Concept](evidence/sql-injection-poc.json)

The test verified that the injected SQL condition
expanded the query results beyond the intended
single-record lookup.

## 5. Security Impact

The demonstrated impact is unintended disclosure of
records from the synthetic employee table.

In a real application, similar weaknesses may expose
sensitive database records depending on query structure,
database privileges, and surrounding access controls.

No production impact has been established.

## 6. Recommended Remediation

Replace string interpolation with a parameterized query.

Example:

```javascript
const statement = database.prepare(`
  SELECT id, username, department, role
  FROM employees
  WHERE username = ?
`);

return statement.all(username);
```

Additional defensive measures include:

- Validating input against expected application rules.
- Restricting database privileges.
- Avoiding unnecessary sensitive data in query results.
- Implementing automated security regression tests.
- Reviewing other dynamically constructed SQL statements.

Parameterized queries are the primary remediation
because they separate SQL structure from user data.

## 7. Verification Plan

Remediation will be considered verified when:

1. Legitimate employee lookups still work.
2. The injection input no longer expands query results.
3. Automated regression tests pass.
4. Static analysis no longer reports the targeted
   vulnerable query pattern.
5. Evidence confirms the expected behavior.

## 8. Limitations

- The database contains only fictional employee records.
- The proof of concept used a local laboratory.
- No external application or production database was tested.
- The database connection was read-only.
- No destructive SQL statements were attempted.
- Severity is provisional and is not based on a
  completed CVSS assessment.
- The finding does not establish an independent
  authorization-control vulnerability.

## 9. Current Status

**Confirmed vulnerability. Remediation and regression
verification pending.**

## Remediation Implementation and Verification

### Implemented Remediation

The vulnerable employee lookup constructed SQL using direct
JavaScript string interpolation, allowing attacker-controlled
input to alter the SQL query structure.

The remediated implementation uses SQLite prepared statements
with positional parameter binding:

```javascript
const statement = database.prepare(`
  SELECT id, username, department, role
  FROM employees
  WHERE username = ?
`);

return statement.all(username);
```

The query structure is fixed, while the supplied username is
passed separately as a bound value.

The remediated function also rejects non-string username inputs
and opens the synthetic SQLite database in read-only mode.

**Implementation:** [`remediated/lookup.js`](remediated/lookup.js)

### Runtime Verification

The original SQL injection payload was:

```text
' OR '1'='1
```

The following results were observed:

| Test | Vulnerable | Remediated |
|---|---:|---:|
| Legitimate lookup (`alice`) | 1 record | 1 record |
| Injection payload | 6 records | 0 records |

The legitimate employee lookup remained functional after
remediation. The injection payload no longer expanded the
result set.

The synthetic database retained all six employee records.

### Automated Regression Testing

A permanent regression suite was implemented using Node.js's
built-in test runner.

**Test suite:** [`tests/lookup.test.js`](tests/lookup.test.js)

Verified execution results:

- Total tests: 10
- Passed: 10
- Failed: 0
- Skipped: 0

The tests cover legitimate lookups, unknown users, reproduction
of the vulnerable behavior, injection resistance, input type
validation, and database integrity.

### Static Analysis Verification

A custom Semgrep rule was refined and evaluated against six
synthetic JavaScript fixtures.

| Metric | Initial rule | Refined rule |
|---|---:|---:|
| True positives | 1 | 3 |
| False negatives | 2 | 0 |
| False positives | 0 | 0 |
| True negatives | 3 | 3 |
| Precision | 100% | 100% |
| Recall | 33.33% | 100% |

These figures describe performance on the six controlled
fixtures only and do not represent general-world detection
accuracy.

A subsequent Semgrep scan of both implementations produced:

| Implementation | Findings |
|---|---:|
| Vulnerable employee lookup | 1 |
| Remediated employee lookup | 0 |

Both files were confirmed scanned successfully.

### Supporting Evidence

- [Original SQL injection proof of concept](evidence/sql-injection-poc.json)
- [Initial Semgrep evaluation](evidence/semgrep-initial-evaluation.json)
- [Refined Semgrep evaluation](evidence/semgrep-refined-evaluation.json)
- [Refined Semgrep raw findings](evidence/semgrep-refined-results.json)
- [Post-remediation SAST results](evidence/semgrep-remediation-results.json)
- [Post-remediation verification summary](evidence/semgrep-remediation-verification.json)

### Verification Outcome

**Status: Remediation verified for the demonstrated SQL injection
vulnerability in the controlled local laboratory.**

Parameterized SQL execution prevented the tested payload from
altering query behavior. Automated regression testing and the
targeted Semgrep scan independently supported the remediation.

### Scope and Limitations

- All testing was performed against synthetic local laboratory data.
- The demonstrated impact was SQL query-filter bypass and
  disclosure of additional synthetic employee records.
- No separate authorization-control bypass was established.
- The Semgrep rule is pattern-based and does not provide
  comprehensive interprocedural taint analysis.
- Zero findings from this custom rule do not establish that
  the application is free from all vulnerabilities.
- No production system was targeted or assessed.
