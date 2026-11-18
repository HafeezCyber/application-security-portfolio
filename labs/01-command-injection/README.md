# Lab 01 — Command Injection: Detection, Triage and Remediation

## Objective

Demonstrate an application security workflow for identifying,
analysing, remediating and verifying an OS command injection
vulnerability in a purpose-built JavaScript example.

## Scope

- JavaScript source code review
- Semgrep static application security testing
- Vulnerability triage and root-cause analysis
- Secure remediation
- Automated verification
- Evidence-based technical reporting

## Safety

This lab uses synthetic, intentionally vulnerable code.

No production systems, external targets, credentials,
or private application source code are included.

The vulnerable example must not be deployed as a service.

## Status

Implementation and controlled regression testing completed. Final verification: 1 finding in the vulnerable implementation, 0 in the remediated implementation, 6 unsafe fixture findings, 0 benign fixture findings, and 17/17 behavioral tests passed.

See [CASE_STUDY.md](CASE_STUDY.md) for methodology, findings, remediation, evidence, and limitations.
