# Case Study 01 — OS Command Injection

## Executive Summary

This case study documents a controlled application security
exercise involving OS command injection in a purpose-built
Node.js hostname lookup function.

The exercise demonstrates source-code analysis, custom
Semgrep rule development, vulnerability triage, secure
remediation, automated regression testing, and evidence
collection.

The original implementation constructed a shell command
using an untrusted hostname. The remediated implementation
validates the hostname and invokes the executable directly
without shell interpretation.

Final verification identified one finding in the vulnerable
implementation and zero findings in the remediated version.
All 17 automated behavioral tests passed.

These results apply to the controlled lab and do not
establish comprehensive security assurance.

## 1. Security Finding

**Finding:** Potential OS Command Injection

**Classification:** CWE-78

**OWASP Mapping:** A03:2021 — Injection

**Affected component:** Node.js hostname lookup function

**Assessment environment:** Synthetic local laboratory

**Severity:** Potentially high impact; no formal CVSS
score was assigned because exploitability and deployment
conditions were not established.

### Vulnerable Code

```javascript
const command = `nslookup ${hostname}`;
exec(command, callback);
```

The function incorporates an untrusted hostname into a
shell command.

Because `child_process.exec()` executes commands through
a shell, shell metacharacters within untrusted input could
alter the intended command.

### Root Cause

The root cause is unsafe command construction across a
trust boundary.

Untrusted input is interpolated into a string that is
subsequently interpreted by a command shell.

The implementation does not separate executable arguments
from shell syntax.

## 2. Assessment Methodology

The assessment used:

1. Manual JavaScript source-code review.
2. Semgrep static application security testing.
3. Purpose-built unsafe and benign detection fixtures.
4. Iterative rule refinement.
5. Secure code remediation.
6. Automated behavioral regression testing.
7. JSON and TAP evidence capture.

The exercise focused on local source code and did not
involve scanning external or production systems.

## 3. Detection Engineering

Two custom Semgrep rules were developed.

### Dynamic Shell Command Detection

**Rule ID:** `node-dynamic-shell-command`

**Configured severity:** ERROR

This rule identifies selected patterns involving dynamic
shell-command construction and shell-enabled subprocess
execution.

### Shell Execution Review

**Rule ID:** `node-shell-execution-review`

**Configured severity:** INFO

This rule identifies selected shell execution calls that
require further review when input provenance is unknown.

An informational finding does not independently establish
the presence of command injection.

### Detection Refinement

Initial broad matching introduced false positives and
overlapping alerts.

The rules were refined to exclude selected constant-string
patterns and suppress redundant informational alerts for
patterns already covered by the higher-severity rule.

### Final Controlled Fixture Results

| Metric | Verified result |
|---|---:|
| Unsafe fixtures detected | 6 of 6 |
| Benign fixtures flagged | 0 of 5 |
| Total unsafe fixture findings | 6 |
| Duplicate findings in tested fixtures | 0 |
| Semgrep configuration errors | 0 |

The six unsafe fixtures represent potentially risky
code patterns, not six demonstrated exploitable
vulnerabilities.

These results are specific to the included fixtures.
They should not be interpreted as general detection
accuracy, precision, or recall.

## 4. Secure Remediation

The remediated implementation applies hostname validation
and invokes the executable directly.

```javascript
execFile(
  "nslookup",
  [hostname],
  { shell: false, timeout: 5000 },
  callback
);
```

### Security Controls

- Hostname input type and format validation.
- Rejection of invalid hostname labels.
- Separation of executable and arguments.
- Explicit disabling of shell execution.
- A five-second subprocess timeout.

The primary command-injection mitigation is avoiding
shell interpretation of untrusted input.

Input validation provides an additional defensive layer.

## 5. Verification

### Static Analysis

| Assessment target | Findings |
|---|---:|
| Vulnerable implementation | 1 |
| Remediated implementation | 0 |
| Unsafe fixtures | 6 |
| Benign fixtures | 0 |

No Semgrep scan errors were reported in the final
captured results.

### Behavioral Testing

The Node.js built-in test runner was used with mocked
subprocess execution.

**Verified result: 17 tests passed, 0 failed.**

The tests covered valid hostname acceptance, shell
execution configuration, timeout configuration, and
rejection of unsafe or invalid inputs.

## 6. Evidence

The following evidence files support the assessment:

| Evidence | File |
|---|---|
| Vulnerable code scan | `evidence/final-vulnerable-scan.json` |
| Remediated code scan | `evidence/final-remediated-scan.json` |
| Unsafe fixture scan | `evidence/final-unsafe-fixtures.json` |
| Benign fixture scan | `evidence/final-benign-fixtures.json` |
| Behavioral test results | `evidence/final-security-tests.tap` |
| Earlier fixture baselines | `evidence/unsafe-fixtures-baseline.json` and `evidence/benign-fixtures-baseline.json` |
| Overlap analysis | `evidence/step19-unsafe-findings.json` |

The source code, detection rules, and test fixtures
are included in this laboratory directory.

## 7. Limitations

This assessment has the following limitations:

- The vulnerable function was not executed with a
  malicious payload.
- The lab does not demonstrate exploitation of a
  deployed service.
- Behavioral tests use mocked subprocess execution.
- Semgrep rules rely on selected syntactic patterns
  rather than comprehensive interprocedural taint analysis.
- Other command-construction patterns may not be detected.
- Zero findings do not guarantee that code is secure.
- No production environment or external target was assessed.

## 8. Security Engineering Outcomes

This exercise demonstrates:

- Identification of an unsafe source-to-shell boundary.
- Development and refinement of custom SAST rules.
- Reduction of false positives in controlled fixtures.
- Removal of duplicate alerts in tested examples.
- Remediation using safer subprocess APIs.
- Automated regression testing.
- Evidence-based remediation verification.

## 9. Conclusion

The exercise established a reproducible workflow for
identifying, triaging, remediating, and verifying selected
OS command-injection risks in Node.js applications.

The final controlled scans and behavioral tests support
the effectiveness of the implemented remediation for
the tested scenarios.

Further testing would be required before applying these
findings or detection rules to production systems.
