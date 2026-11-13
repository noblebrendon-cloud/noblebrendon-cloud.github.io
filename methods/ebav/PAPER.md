---
title: "Evidence-Bound Adversarial Verification (EBAV): A Governed Field Method for AI-Assisted Software Verification and Release"
author: "Brendon R. Coleman"
date: "November 13, 2026"
subtitle: "Version 0.1.0 · Working Paper / Open Method"
lang: en-US
keywords: [software verification, adversarial testing, AI-assisted development, release governance, provenance, reproducible builds, human authorization]
---

# Abstract

AI-assisted software development can produce executable artifacts faster than the evidence needed to trust, install, or deploy them. Conventional testing, peer inspection, reproducible builds, supply-chain provenance, and change authorization address different portions of that problem; none alone establishes all the facts required for a controlled operational transition. **Evidence-Bound Adversarial Verification (EBAV)** is proposed here as a compositional field method that binds seven activities into one governed cycle: **Construct, Freeze, Challenge, Classify, Correct, Reverify, Authorize**. The proposed invariant is that **no claim may authorize a greater action than the evidence supporting that claim establishes**. EBAV separates the builder, adversarial reviewer, owner-authorizer, and operator; preserves rejected revisions and their evidence; translates confirmed failures into retained regression tests; and treats the authorization of a particular artifact as separate from authorization to install or execute it.

This paper defines EBAV's claims, gate state, records, minimum evidence, failure semantics, authorization boundaries, and validation agenda. A retrospective case account draws on reported review records from the *Jesus Is King* (JIK) application and its Phase 15B2 cloud-inventory wrapper, where successive independent reviews found defects not exposed by increasingly large passing suites. Those reports illustrate EBAV's operational logic but do **not** establish comparative effectiveness, formal certification, cryptographic reviewer identity, or public deployment readiness. The contribution is an inspectable workflow synthesis rather than a claim to have invented its constituent techniques. EBAV v0.1.0 is released as a field method for independent replication and empirical evaluation.

**Keywords:** adversarial verification; evidence provenance; AI-assisted software engineering; bounded authorization; reproducible builds; mutation testing; release governance.

# 1. Introduction: the evidence-to-authority gap

A software team may be able to say that a unit test passed but still be unable to say whether the shipped package came from the tested source, whether another party challenged the assumptions behind the tests, whether the target server is the one intended, or whether the person approving a package also authorized a database migration. These are distinct claims with different evidence requirements. The risk grows in AI-assisted development when drafting, editing, reviewing, and summarizing can be compressed into one conversational workflow. A coherent explanation from the same system that generated the code is not independent assurance.

EBAV addresses the **evidence-to-authority gap**: movement from a limited observation (for example, *tests passed in a mock environment*) to an unjustified operational conclusion (*therefore this tool may run in production*). It does not replace threat modeling, secure coding, formal methods, penetration testing, or provider-specific operational controls. Instead, it supplies a governance envelope around those practices: exact candidate identity, challenge, falsifiable evidence, independent disposition, bounded human authorization, and retained uncertainty.

The central formulation is:

> **EBAV invariant:** No claim may authorize a greater action than the evidence supporting that claim establishes.

This is a normative design rule, not a mathematically proven property of any implementation. The gates must be enforced through procedure and, where feasible, independently testable controls.

# 2. Position relative to established work

EBAV deliberately combines practices that predate it. The following relationships are based on published primary sources rather than assertions of novelty.

| Established practice | What it contributes | What EBAV adds as a workflow choice |
|---|---|---|
| Structured code inspection | Distinct inspection roles, criteria, and defect classification (Fagan, 1976) [1] | Preserves a reviewer's challenge as evidence tied to an exact candidate and gate decision. |
| Mutation testing | Deliberately changed programs probe whether tests detect faults (Jia & Harman, 2011) [2] | Requires a distinction between targeted assertion catches and harness stops; mutations alone cannot certify correctness. |
| Secure development guidance | NIST SSDF frames preparation, protection, development, and vulnerability response [3] | Adds explicit claim-to-authorization scoping and preserves conditional decisions in each transition. |
| Security testing guidance | OWASP WSTG catalogs adaptable security-testing methods [4] | Requires threat-driven negative cases and recordable reviewer dispositions, not only a checklist. |
| Reproducible builds | Matching defined source, build environment, and instructions produce bit-identical artifacts [5] | Separates byte identity from safety and from permission to deploy. |
| Software-supply-chain provenance | SLSA specifies build provenance expectations and levels; in-toto describes attestations about ordered steps [6,7] | Uses identity and evidence records without claiming SLSA conformance or cryptographic attestations unless actually established. |
| AI risk management | NIST AI RMF's Generative AI Profile addresses voluntary risk-management practices [8] | Makes review-source independence, uncertainty, and human authority explicit in AI-assisted coding. |

**Novelty boundary.** EBAV's proposed contribution is the **composition and operating contract**: (a) promote only bounded claims, (b) preserve immutable candidate revisions, (c) require adversarial review independent of builder self-attestation, (d) turn confirmed defects into retained tests, and (e) keep operational approval distinct from artifact acceptance. The paper does **not** assert priority over all earlier workflows, invent new cryptography, claim certification, or offer experimental evidence of superiority.

# 3. Model and terminology

## 3.1 Core objects

Let a candidate state be:

\[
S_n = (A_n, I_n, T_n, E_n, F_n, G_n)
\]

where **A** is an artifact or implementation, **I** its explicitly pinned identity (for example source commit and artifact digests), **T** the test set and environment, **E** the evidence ledger, **F** the open findings and uncertainty, and **G** the current gate disposition. A review/repair transformation produces a successor state:

\[
S_n \xrightarrow{\mathrm{challenge,\ repair,\ review}} S_{n+1}
\]

An **evidence-bounded claim** is a tuple:

`C = (subject, assertion, scope, method, evidence_refs, limits, observed_at, reviewer)`

An **authorization** is not an inference from `C`; it is a separate, affirmative event:

`U = (actor_as_recorded, action, target, artifact_identity, preconditions, exclusions, expiry_or_session, evidence_ref)`

A release gate is a decision about a specified set of claims and acceptance criteria. Valid states are `PASS`, `CONDITIONAL`, `FAIL`, and `NOT_REVIEWED`. A CONDITIONAL decision identifies remaining evidence gaps and does not silently promote an artifact to the next operational authority level.

## 3.2 Evidence classes

The ledger distinguishes **independently reproduced** results (IR), **directly observed** results (DO), **owner-attested** actions (OA), **builder-reported** checks (BR), **inference** (IN), and **unknown/unverified** matters (UN). An independent review of transferred copies is not the same claim as a live inspection of authoritative originals. A checksum verifies equality to a digest if the digest source is trusted; it does not prove who created the file, whether the contents are true, or whether the action was authorized.

## 3.3 Non-negotiable invariants

1. **Identity:** An approval or PASS names the exact candidate revision and evidence boundary. Any material successor receives its own identity.
2. **Preservation:** Rejected and superseded candidates are retained; repair creates a successor instead of rewriting the reviewed original.
3. **Challenge:** Builder self-tests do not substitute for independent adversarial review. Organizational, tooling, and model-family independence must be described, not assumed.
4. **Evidence honesty:** Missing stdout, partial captures, redactions, unverified timestamps, or inherited permissions remain explicit limitations; a consistent ledger is not proof of authentic external execution.
5. **Regression retention:** A confirmed defect leads to a reproducible negative test or an explicit documented reason that reproduction is not feasible.
6. **Least authority:** Package acceptance does not authorize installation; installation does not authorize migrations, secrets access, public intake, or unrelated provider changes.
7. **Fail-closed uncertainty:** Ambiguous identity, unsafe output capture, incomplete process cleanup, uncertain provider state, or a failed review blocks the relevant advancement without silent retry.
8. **Confidentiality:** Public evidence packages must omit secret payloads, live challenge codes, access tokens, and unnecessarily identifying operator data. Hashes are not redaction.

# 4. The EBAV seven-stage protocol

## Stage 1 — Construct

The builder receives a bounded task and a written scope that separates requested outcomes, excluded actions, assumptions, environment, and acceptance criteria. It produces a candidate and baseline tests. The builder may report tests but cannot certify that its own implementation satisfies the independent review gate.

**Minimum outputs:** task contract; candidate source; dependency/environment description; baseline test identifiers; known limitations; excluded operations.

## Stage 2 — Freeze

Identify exact source and artifacts with suitable cryptographic digests and source-control references. Preserve test definitions, commands, environments and results. Choose whether the unit of identity is a commit, tree, manifest, archive, binary, or all of them. Record build reproducibility separately from source provenance and package acceptance.

**Minimum outputs:** immutable candidate identifier; manifest of files and checksums; source/rebuild bindings; preservation statement; disclosure of unavailable evidence.

## Stage 3 — Challenge

A reviewer not acting as the builder validates the seal, inspects source and trust boundaries, runs baseline tests in an appropriate isolated environment, then independently devises falsification attempts. Techniques can include malformed-input probes, encoded-data bypasses, permission denial, process-lifecycle races, mutated code, contradictory evidence, stale configuration, and altered authorization messages. Reviews must include the actual mechanism by which a fault could cross a trust boundary, not merely a numerical test count.

**Minimum outputs:** reviewer identity as represented, environment, source/candidate identity, executed tests, independent negative cases, reproduction artifacts, and limits of reviewer independence.

## Stage 4 — Classify

For each finding, record evidence class, severity or consequence, reproduced/possible/unverified status, affected claim, and remediation criterion. The gate decision is PASS, CONDITIONAL, FAIL, or NOT_REVIEWED **for a named scope**. A PASS may have disclosed limitations; it is not a universal safety claim. CONDITIONAL must not be relabeled PASS merely because prior tests were green.

**Minimum outputs:** decision; findings matrix; tested/not-tested boundaries; confidentiality and authenticity limits; exact next authorized *review* activity.

## Stage 5 — Correct

The builder creates a successor candidate. Each reproduced defect is mapped to a code change and regression test that fails against the predecessor and passes against the successor, wherever practical. Tests for previously accepted cases retain stable identities unless changes are explained. Do not silently patch the sealed predecessor or repair provider state under the authority of a code-review request.

**Minimum outputs:** successor identity; change summary; new test IDs; reproduction-before/fix-after evidence; baseline preservation checks.

## Stage 6 — Reverify

Independently verify the successor's seal, baseline preservation, original defect fixes, newly introduced changes, and residual risks. Count successful tests, targeted mutation catches, incidental harness failures, and untested environmental assumptions separately. If a new defect is found, return to Stage 4 and Stage 5 with a new successor; do not manufacture a PASS to end a long cycle.

**Minimum outputs:** successor decision with precise coverage; independent test ledger; contradiction checks; conditions that remain.

## Stage 7 — Authorize

The human authority issues a *new*, scoped decision for one concrete transition after reviewing the evidence. Approval identifies artifact digest, target resource or environment, exact action, permissions, duration, preconditions, exclusions, and stop/recovery behavior. Executing the action yields new operational observations that must themselves be reconciled. Acceptance of a package is never transitive permission to install or deploy it.

**Minimum outputs:** affirmative authorization record; exact action binding; execution receipt if run; post-action verification; unreconciled state left explicitly open.

# 5. Roles, separation and threat model

EBAV distinguishes four functions: **builder** (implementation), **adversarial reviewer** (falsification and independent disposition), **owner-authorizer** (scope and consent), and **operator** (execution within authority). One person may hold multiple responsibilities in a small project, but a review should declare that limitation. Using two AI agents or two chat windows does not guarantee independence if they share source assumptions, training tendencies, or context. A model-generated statement of PASS is a claim requiring reproducible evidence, not an external audit certificate.

EBAV focuses on these failure modes: unrecognized software defects, unsafe output handling, dishonest or incomplete evidence, confusion between artifact identity and operational target, excessive or inherited privileges, replay or scope expansion of old approvals, and unexamined assumptions about cloud state. It is not a substitute for secure cloud configuration, incident response, identity proofing, or penetration testing against a real deployment.

# 6. Retrospective field case: Jesus Is King (October–November 2026)

## 6.1 Context and evidence boundary

*Jesus Is King* is a proposed global witness web application using country selection, PostgreSQL-backed submissions, moderation, and public map/count presentation. The case considered here concerns packaging and preparation for controlled private staging—not a completed public launch. The chronology below is reconstructed from operator-provided development and independent-review reports in the working conversation. Some primary logs and original E: artifacts were not independently readable by the reviewer; the table must therefore not be cited as a third-party research audit.

## 6.2 Package gates

The development record identifies a frozen source commit beginning `22629ac3`, with two offline builds (A01/B01) that the builder reported were byte-identical and each passed 613 focused tests. A subsequent package review reached PASS within stated limitations after evidence-transfer and owner-provenance checks. Package acceptance (Gate 4) then received a separately recorded human decision, an execution receipt, and an independent post-execution PASS **within the transferred-record evidence scope**. That acceptance expressly did not authorize VM installation, IAM cleanup, database changes, Cloud Run deployment, or public intake.

The historical E: originals were not directly inspected in the post-execution independent review, and the full 39/39 postcheck console capture was not retained. Thus the case supports *bounded evidence management* rather than stronger claims about system-wide state.

## 6.3 Adversarial inventory-wrapper revisions

The project next developed a read-only cloud inventory wrapper intended to establish current VM and IAM state without executing provider mutations. The builder's own passing tests repeatedly failed to anticipate adversarial cases devised by a separate reviewer.

The revision sequence is summarized below. Each item distinguishes the builder's reported test baseline from Silas's independent disposition.

- **r1 — 104 builder tests reported.** Independent review: CONDITIONAL. Findings included persisted credential-bearing stderr, HTTP logging not blocked by preflight, uncertain interrupted-child handling, and a validator that accepted fabricated COMPLETE evidence.
- **r2 — 217 tests and 44 mutants reported caught.** Independent review: CONDITIONAL. Findings included unexpected nested provider output entering evidence, confusion between parent reaping and process-group termination, and an unknown-configuration policy gap.
- **r3 — 279 tests and 65 mutants reported caught.** Independent review: CONDITIONAL. Findings included a JSON-escaping bypass in credential detection and a narrow, theoretical process-group identifier reuse race.
- **r4 — 349 builder tests and 11 replays reported passing.** As of the supplied development update, the 85-mutation run and final seal remained unfinished, and no independent r4 review had occurred. The candidate was not authorized for Cloud Shell execution.

The examples demonstrate the methodological value of reviewer-designed counterexamples **in this project**: green baseline suites alone did not justify a run. They do not estimate the method's statistical effectiveness, compare it against other workflows, or show that every revision improved deployed security. The mutation counts describe developer/reviewer reports rather than a separately published reproduction package.

## 6.4 What was and was not established

**Supported by the case reports:** exact source/package identities, independently reviewed transferred evidence, conditional findings and successor requirements, retained tests, multiple human approval boundaries, and a continued block on live installation. **Not established:** proof that AI reviewers were institutionally independent, verified Cloud Shell compatibility of the unexecuted wrapper, successful paused-IAM cleanup, a bound VM installation, complete live witness-to-map behavior, or public deployment. The reported Phase 15B2 provider inventory had not run as of the case cutoff.

# 7. Evidence and authorization records

A minimal EBAV packet can be implemented in Markdown, JSON, or a governed ledger. Format alone does not make records authentic. The following field contract is a specification proposal, not a claim that it has been implemented as an external service.

| Record | Required fields |
|---|---|
| Candidate manifest | `candidate_id`, `source_ref`, `file_sha256`, `build_environment`, `supersedes`, `preservation_scope` |
| Review request | `scope`, `threat_boundaries`, `negative_tests`, `excluded_actions`, `reviewer_constraints` |
| Finding | `finding_id`, `reproduction_status`, `mechanism`, `evidence_refs`, `affected_claim`, `remediation_criteria` |
| Gate decision | `candidate_id`, `status`, `passed_checks`, `unverified_checks`, `limitations`, `reviewer_as_recorded`, `evidence_digest` |
| Human authorization | `approver_as_recorded`, `action`, `exact_target`, `artifact_digest`, `time_window`, `exclusions`, `required_prechecks`, `stop_conditions` |
| Operational receipt | `actual_commands`, `observed_utc_times`, `exit_codes`, `stdout_stderr_handling`, `output_hashes`, `unresolved_state` |

**Evidence-strength rule:** `hash match` is weaker than `source-to-output provenance`, which in turn is different from `correct behavior` and `authorized operation`. A valid record may explicitly show UNKNOWN. Any omitted capture or reviewer-access limitation must survive into downstream summaries.

# 8. Proposed evaluation program

EBAV's effectiveness is a **research question**, not a demonstrated outcome. A rigorous subsequent study should pre-register comparison criteria and apply EBAV to multiple projects with different risk profiles.

**Questions and hypotheses.** (RQ1) Does independent EBAV review detect additional unique, reproducible defects beyond developer testing? (RQ2) Does evidence classification reduce unsupported release-readiness claims? (RQ3) Do scoped gates reduce unauthorized operational actions or accidental scope expansion? (RQ4) What engineering time, failure-to-completion, and review burden does EBAV impose?

**Design.** Select several comparable tasks/projects; establish a conventional CI/test-review baseline; use equivalent independent security evaluators; record candidate histories and environmental controls; compare EBAV and baseline under documented budgets. Consider randomized or crossover allocation where feasible, with a blind downstream adjudicator for whether a finding is a genuine defect. Replicate at least one project outside Jesus Is King and one project with non-AI-generated code to distinguish AI-specific from generic effects.

**Measures.** Unique confirmed defects per review-hour; percentage of confirmed defects with retained regressions; mutation score with equivalent/invalid mutants excluded; number of claim-evidence mismatches; number and severity of unauthorized action attempts; false-positive rate; mean time to bounded resolution; and the proportion of decisions with complete provenance. Record negative findings and stopped runs. A growing test count is not itself a security outcome.

**Threats to validity.** One case and retrospective self-selection, reviewer's access to the builder's earlier findings, shared AI model biases, changing tools/providers, inconsistent test environments, unreliable or unavailable primary evidence, confidentiality limits on reproducibility, and reviewer time costs. Positive evidence cannot prove absence of future vulnerabilities.

# 9. Adoption, publishing and responsible disclosure

EBAV v0.1.0 is designed to be **tool-agnostic**: no requirement to use Claude, ChatGPT, a particular repository service, or a specific cloud provider. An adopter should begin with the highest-risk boundaries and size evidence requirements proportionately. For a static personal page the full protocol may be excessive; for credential-bearing tools that can mutate production systems, authorization and fail-closed evidence capture deserve greater scrutiny.

Public publication should distinguish the reusable method from private operational artifacts. Do not publish keys, live interactive challenges, sensitive log excerpts, full principal inventories, unreleased deployment access paths, or unredacted owner-machine details. A Zenodo DOI archives a versioned research object; it does not independently validate the research or prove historical priority. GitHub commits and releases preserve a public version history, not cryptographic identity verification of every collaborator.

The GitHub-to-Zenodo publication route should use a dedicated repository, an explicit license, versioned method documents, machine-readable citation metadata, a tagged GitHub release, and a verified Zenodo record DOI. At the time of this manuscript, no DOI is assigned to EBAV v0.1.0; no DOI should be fabricated or placed in publication metadata before archiving succeeds.

# 10. Conclusion

EBAV proposes a disciplined transition from **code that exists**, to **claims with bounded evidence**, to **independently challenged artifacts**, to **human-authorized actions**. Its key practical guardrail is that a result never carries more authority than the actual observation and approval justify. The Jesus Is King field case illustrates how successive adversarial findings can improve tests while the operational gate remains closed; the case does not establish external validation or public-readiness. Version 0.1.0 is a documented, reproducible *method proposal* ready for external testing, critique, and refinement.

# References

1. Fagan, M. E. (1976). Design and code inspections to reduce errors in program development. *IBM Systems Journal, 15*(3), 182–211. https://doi.org/10.1147/sj.153.0182
2. Jia, Y., & Harman, M. (2011). An analysis and survey of the development of mutation testing. *IEEE Transactions on Software Engineering, 37*(5), 649–678. https://doi.org/10.1109/TSE.2010.62
3. Souppaya, M., Scarfone, K., & Dodson, D. (2022). *Secure Software Development Framework (SSDF) Version 1.1*. NIST SP 800-218. https://doi.org/10.6028/NIST.SP.800-218
4. OWASP Foundation. *Web Security Testing Guide*, version 4.2. https://wstg.owasp.org/v4.2/
5. Reproducible Builds project. *Definitions: When is a build reproducible?* https://reproducible-builds.org/docs/definition/
6. SLSA Framework. *SLSA specification v1.2: Tracks and build provenance.* https://slsa.dev/spec/v1.2/tracks
7. in-toto Project. (2023). *in-toto specification v1.0.0.* https://github.com/in-toto/specification/blob/master/in-toto-spec.md
8. Autio, C., et al. (2024). *Artificial Intelligence Risk Management Framework: Generative Artificial Intelligence Profile.* NIST AI 600-1. https://doi.org/10.6028/NIST.AI.600-1
9. Zenodo. *Archive a release from GitHub.* https://help.zenodo.org/docs/github/archive-software/github-upload/
10. Zenodo. *.zenodo.json and GitHub release metadata.* https://help.zenodo.org/docs/github/describe-software/zenodo-json/

# Appendix A. Minimal reviewer decision (illustrative)

```json
{
  "method": "EBAV",
  "method_version": "0.1.0",
  "candidate_id": "example-r2",
  "candidate_sha256": "sha256:<full-value-required>",
  "review_scope": "offline, no provider access",
  "decision": "CONDITIONAL",
  "evidence_classes": ["independently_reproduced", "builder_reported"],
  "reproduced_findings": ["EXAMPLE-001"],
  "limitations": ["Live environment compatibility not tested"],
  "authorized_next_action": "prepare successor candidate for review",
  "excluded_actions": ["installation", "deployment", "IAM mutation"]
}
```

# Appendix B. Reuse declaration

**Version:** v0.1.0 — Field Method / Working Paper (not peer reviewed, not formally certified).  
**Author and proposed-method attribution:** Brendon R. Coleman.  
**AI assistance disclosure:** AI systems assisted research synthesis, manuscript drafting, code-oriented workflow design, and editorial preparation under human direction. This disclosure is not a claim of independent methodological validation.  
**License:** Creative Commons Attribution 4.0 International (CC BY 4.0) for method documentation and reusable templates.  
**Primary case:** Jesus Is King, retrospective reports through November 13, 2026.  
**Archival status:** GitHub/Zenodo release pending external publication and DOI verification.
