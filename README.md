# Application Security Engineering Portfolio

**Hafeez Adebukola Azeez**

Application Security | Secure Code Review | Vulnerability
Assessment | Detection Engineering | DevSecOps

## Overview

This repository contains hands-on application security
engineering exercises demonstrating how software
vulnerabilities can be identified, analysed, remediated,
and verified.

Each laboratory is designed to provide reproducible
technical evidence rather than relying solely on
theoretical descriptions.

The portfolio focuses on secure software engineering,
custom security detection, vulnerability triage,
automated verification, and practical security assurance.

## Featured Security Engineering Projects

### Lab 01 — OS Command Injection

**Technology:** JavaScript / Node.js

**Security classification:** CWE-78 — OS Command Injection

**Tools:** Semgrep, Node.js Test Runner, Git

A controlled application security exercise involving
an intentionally vulnerable hostname lookup function.

The project demonstrates:

- Identification of unsafe shell-command construction.
- Development of custom Semgrep detection rules.
- Refinement of detection logic to reduce false positives.
- Elimination of overlapping alerts in controlled fixtures.
- Remediation using validated input and shell-free execution.
- Automated regression testing and evidence capture.

#### Verified Results

| Verification | Result |
|---|---:|
| Vulnerable implementation | 1 finding |
| Remediated implementation | 0 findings |
| Unsafe detection fixtures | 6 of 6 detected |
| Benign detection fixtures | 0 of 5 flagged |
| Automated behavioral tests | 17 of 17 passed |
| Final scan errors | 0 |

These results apply to controlled test fixtures and
should not be interpreted as comprehensive detection
accuracy or proof of production security.

**Project resources:**

- [Technical Case Study](labs/01-command-injection/CASE_STUDY.md)
- [Lab Overview](labs/01-command-injection/README.md)
- [Custom Semgrep Rules](labs/01-command-injection/rules/node-command-injection.yml)
- [Vulnerable Implementation](labs/01-command-injection/vulnerable/lookup.js)
- [Remediated Implementation](labs/01-command-injection/remediated/lookup.js)
- [Automated Security Tests](labs/01-command-injection/tests/lookup.test.js)
- [Supporting Evidence](labs/01-command-injection/evidence/)

## Technical Focus Areas

This portfolio is being developed around:

- Application security testing and secure code review.
- Vulnerability identification, triage, and remediation.
- Static application security testing and custom rule engineering.
- Threat modelling and security design review.
- Secure software development practices.
- DevSecOps security automation.
- Evidence-based security verification and reporting.

Additional laboratories will be introduced as they
are implemented and verified.

## Methodology

The exercises follow a repeatable security engineering
workflow:

1. Define the assessment scope and trust boundaries.
2. Identify potentially vulnerable code or configurations.
3. Analyse the underlying security weakness.
4. Develop or apply appropriate detection techniques.
5. Implement secure remediation.
6. Execute automated verification and regression tests.
7. Preserve evidence and document limitations.

## Tools and Technologies

**Implemented in Lab 01:**

- JavaScript and Node.js
- Semgrep
- Node.js built-in test runner
- Python for evidence processing
- Git and GitHub Codespaces

Additional tools will be documented when they are
used in completed projects.

## Responsible Security Research

All intentionally vulnerable examples in this repository
are synthetic and intended for controlled educational
and research purposes.

No production systems, third-party targets, credentials,
or confidential source code are included.

The exercises do not authorize testing against systems
without explicit permission.

## Author

**Hafeez Adebukola Azeez**

Cybersecurity and IT Audit Professional

Areas of professional interest include Application Security,
Security Assurance, Vulnerability Management, Detection
Engineering, and Secure Software Development.
