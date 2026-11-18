# Application Security Engineering Portfolio

**Hafeez Adebukola Azeez**

Application Security Engineering | Secure Code Review |
Vulnerability Research | Detection Engineering | DevSecOps

## Overview

This repository documents practical application security
engineering work, with emphasis on identifying security
weaknesses, demonstrating their impact, developing detection
techniques, implementing remediation, and verifying results.

Each completed laboratory includes reproducible source code,
security tests, technical evidence, and documentation of
assessment limitations.

The objective is to demonstrate a repeatable, evidence-based
approach to application security assurance.

## Completed Security Engineering Laboratories

| Laboratory | Classification | Technical Focus | Status |
|---|---|---|---|
| [Lab 01 — OS Command Injection](labs/01-command-injection/README.md) | CWE-78 | Secure subprocess execution, custom SAST rules, regression testing | Completed |
| [Lab 02 — SQL Injection](labs/02-sql-injection/README.md) | CWE-89 | Controlled exploitation, parameterized SQL, Semgrep detection refinement | Completed |

### Lab 01 — OS Command Injection (CWE-78)

**Technology:** JavaScript, Node.js, Semgrep

This laboratory examines unsafe construction of operating
system commands in a deliberately vulnerable hostname
lookup function.

The engineering workflow included:

- Analysis of unsafe shell-command construction.
- Development and refinement of custom Semgrep rules.
- Evaluation against unsafe and benign JavaScript fixtures.
- Remediation using input validation and shell-free execution.
- Automated behavioral testing and static-analysis verification.

#### Verified Results

| Verification | Result |
|---|---:|
| Vulnerable implementation | 1 finding |
| Remediated implementation | 0 findings |
| Unsafe fixtures detected | 6/6 |
| Benign fixtures flagged | 0/5 |
| Automated behavioral tests passed | 17/17 |
| Final scan errors | 0 |

These results apply to the controlled laboratory and
associated fixtures, not arbitrary production applications.

**Technical resources:**

- [Technical case study](labs/01-command-injection/CASE_STUDY.md)
- [Custom Semgrep rules](labs/01-command-injection/rules/node-command-injection.yml)
- [Vulnerable implementation](labs/01-command-injection/vulnerable/lookup.js)
- [Remediated implementation](labs/01-command-injection/remediated/lookup.js)
- [Automated regression tests](labs/01-command-injection/tests/lookup.test.js)
- [Supporting evidence](labs/01-command-injection/evidence/)

### Lab 02 — SQL Injection (CWE-89)

**Technology:** JavaScript, Node.js, SQLite, Semgrep

This laboratory demonstrates the identification and
controlled exploitation of SQL injection in a synthetic
employee lookup application.

The engineering workflow included:

- Construction of a six-record synthetic SQLite database.
- Identification of unsafe SQL query interpolation.
- Controlled demonstration of SQL query-filter bypass.
- Development and refinement of a custom Semgrep rule.
- Remediation using prepared statements and bound parameters.
- Runtime verification, regression testing, and evidence capture.

#### Verified Results

| Verification | Result |
|---|---:|
| Legitimate lookup | 1 record |
| Vulnerable injection result | 6 synthetic records |
| Remediated injection result | 0 records |
| Initial Semgrep fixture recall | 33.33% |
| Refined Semgrep fixture recall | 100% |
| Refined fixture false positives | 0/3 benign |
| Post-remediation SAST | 0 findings |
| Automated regression tests passed | 10/10 |

Detection metrics were measured against six controlled
fixtures and should not be generalized beyond that test set.

The demonstrated impact was SQL query-filter bypass and
synthetic record disclosure. No independent authorization
bypass was established.

**Technical resources:**

- [Technical case study](labs/02-sql-injection/README.md)
- [Formal vulnerability finding](labs/02-sql-injection/FINDING-001.md)
- [Controlled exploitation evidence](labs/02-sql-injection/evidence/sql-injection-poc.json)
- [Custom Semgrep rule](labs/02-sql-injection/rules/node-sql-injection.yml)
- [Detection evaluation evidence](labs/02-sql-injection/evidence/semgrep-refined-evaluation.json)
- [Vulnerable implementation](labs/02-sql-injection/vulnerable/lookup.js)
- [Remediated implementation](labs/02-sql-injection/remediated/lookup.js)
- [Automated regression tests](labs/02-sql-injection/tests/lookup.test.js)
- [Remediation verification evidence](labs/02-sql-injection/evidence/semgrep-remediation-verification.json)

## Demonstrated Security Engineering Capabilities

The completed laboratories provide practical evidence of:

| Capability | Supporting Work |
|---|---|
| Vulnerability identification | Command injection and SQL injection code analysis |
| Controlled exploitation | SQL injection proof of concept |
| Detection engineering | Custom Semgrep rules and fixture-based evaluation |
| Secure coding | Shell-free subprocess execution and parameterized SQL |
| Remediation verification | Before-and-after runtime and static-analysis comparisons |
| Automated security testing | Node.js regression test suites |
| Security documentation | Technical case studies, findings, and JSON evidence |
| Reproducible workflows | Version-controlled source code and test artifacts |

## Engineering Methodology

The laboratories follow a repeatable assessment workflow:

1. Define scope, assumptions, and trust boundaries.
2. Identify potentially vulnerable implementation patterns.
3. Analyze the underlying security weakness.
4. Demonstrate impact where appropriate and authorized.
5. Develop and evaluate detection techniques.
6. Implement secure remediation.
7. Execute regression tests and static-analysis verification.
8. Preserve evidence and document limitations.

## Tools and Technologies Used

The completed laboratories use:

- JavaScript and Node.js
- SQLite and Node.js built-in SQLite support
- Semgrep static application security testing
- Custom Semgrep YAML detection rules
- Node.js built-in test runner
- Python for test orchestration and evidence processing
- Git and GitHub Codespaces

Additional tools and frameworks will be documented as
they are implemented in future projects.

## Future Development Areas

Potential future portfolio work includes:

- Threat modeling and security design reviews.
- Authentication and authorization testing.
- API security assessment.
- Software dependency and supply-chain security.
- CI/CD security automation.
- Additional secure code review and remediation exercises.

These are development interests, not claims of completed
laboratory work.

## Responsible Security Research

All intentionally vulnerable applications and databases
in this repository are purpose-built for controlled
security engineering exercises.

Synthetic data is used for exploitation demonstrations.

No production systems, third-party targets, real
credentials, or confidential application code are
included in the laboratory materials.

The repository does not authorize testing against
systems without explicit permission.

## Author

**Hafeez Adebukola Azeez**

Cybersecurity and IT Audit Professional

Professional interests include Application Security,
Security Assurance, Vulnerability Management,
Detection Engineering, and Secure Software Development.

[GitHub Profile](https://github.com/HafeezCyber)
