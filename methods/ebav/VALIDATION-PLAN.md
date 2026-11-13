# EBAV Independent Evaluation Plan — Proposal v0.1.0

## Research questions

- RQ1: Does EBAV detect additional confirmed defects beyond baseline CI and ordinary review, normalized for reviewer-hours?
- RQ2: Does EBAV improve calibration between claims, evidence, and release decisions?
- RQ3: Does the separate authorization step reduce unjustified operational transitions?
- RQ4: How much time and complexity does EBAV add?

## Preregisterable outcomes

Unique independently adjudicated defects; valid negative-case reproductions; regression retention; mutation adequacy (excluding equivalent mutants); incorrect PASS rate; scope-expansion attempts blocked; evidence completeness; review-hours and time to resolution.

## Study design

Use 3+ projects with differing risk and architecture. Compare a baseline CI/review workflow and EBAV using equivalent independent evaluators and review budgets. Where possible randomize workflow order or use a crossover design. Blindly adjudicate genuine defects and publish sanitized test fixtures. Include non-AI-created code to test generality.

## Limitations to report

Small sample, retrospective observations, independence confounds, shared model biases, security secrecy constraints, unobservable cloud behavior, external validity and costs. Do not claim causality from a single retrospective JIK case or rising test counts.
