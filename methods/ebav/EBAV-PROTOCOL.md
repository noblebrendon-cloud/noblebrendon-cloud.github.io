# EBAV Operating Specification — v0.1.0

**Invariant:** No claim may authorize a greater action than the evidence supporting that claim establishes.

## Stage contract

| Stage | Entry | Evidence required for exit | Reject/stop conditions |
|---|---|---|---|
| Construct | Named task and excluded actions | Candidate + executable tests + declared assumptions | Missing scope, hidden privileged action |
| Freeze | Candidate passes builder checks | Exact source/artifact hashes and bounded environment | Unstable identity or overwritten predecessor |
| Challenge | Frozen candidate | Independent seal, baseline and novel adversarial tests | Uncontrolled provider access, untrusted test environment |
| Classify | Review evidence | PASS / CONDITIONAL / FAIL and itemized evidence limits | Unsupported PASS or missing reproductions |
| Correct | Confirmed defects | New candidate, predecessor preserved, permanent tests | Silent modification of reviewed original |
| Reverify | Sealed successor | Independent retest and explicit residual risks | Review gaps or contradictory COMPLETE claim |
| Authorize | Accepted scoped evidence | New affirmative human approval for exact action and target | Scope expansion, expired approval, ambiguous target |

## Evidence classes

- `IR`: independently reproduced with specified inputs and environment.
- `DO`: directly observed by named actor; requires observation scope.
- `OA`: owner-attested, without assuming cryptographic authentication.
- `BR`: builder-reported, not independently reproduced.
- `IN`: inference, never interchangeable with observation.
- `UN`: unknown/unverified.

## Decision semantics

- `PASS`: designated criteria supported for named scope, with recorded limits.
- `CONDITIONAL`: one or more material safeguards or evidence gaps remain. No permission automatically follows.
- `FAIL`: criterion contradicted or a blocking flaw confirmed.
- `NOT_REVIEWED`: no qualifying independent assessment has occurred.

## Failure discipline

Preserve failed/partial evidence; stop on uncertain identity or unsafe output; never silently retry an operation with externally visible effects; create a successor rather than rewriting a sealed reviewed artifact. Preserve test IDs and classify mutation catches as targeted, incidental crash, or inconclusive.

## Human authorization

An approval binds an actor-as-recorded, exact action, artifact digest, target, time/session, preconditions, exclusions and recovery behavior. A package acceptance does not authorize VM installation, IAM mutation, database migrations or public intake.

## Operationalization

Small projects may use a Markdown ledger plus SHA256SUMS. Higher-risk projects should use a separate authenticated approval system, immutable logging and cryptographically verifiable provenance where justified. This method does not supply those mechanisms by itself.