# Speaking Platform Execution Plan

## Summary
Add a speaking platform inside BrendonRColeman.com as a natural extension of the existing Letters of Light system. The first release stays static, lightweight, and factual: Brendon R. Coleman is the person people invite, Letters of Light is the writing and message body, and Letters of Light Live is the spoken expression of that work.

The current Letters media should be treated as a featured Letter/release artifact, not a speaker reel. No testimonials, event clients, audience sizes, speaking history, credentials, follower counts, or other proof should be invented.

## Current-State Assessment
- Repository root: `E:\githubpage\brendonrcoleman.com-main\brendonrcoleman.com-main`.
- Deployment shape: static GitHub Pages site on `main`, with `CNAME` set to `brendonrcoleman.com` and `.nojekyll` present.
- Routes are folder-based static HTML pages, including `/services/`, `/whitepapers/`, `/letters/`, `/letters/1c4a6e6838a7d2f0/`, `/noble/`, `/mini-sites/`, and `/laviathon/`.
- Primary visual system: `assets/style.css`, using the existing dark theme, `site-shell`, `hero`, `section`, `card-grid`, `card`, `btn`, and `contact-box` patterns.
- Existing data/rendering: `assets/data/services.json`, `assets/data/whitepapers.json`, `assets/data/latest.json`, `assets/js/content-renderer.js`, and `assets/js/latest-router.js`.
- Contact capability: mailto links across main pages; `laviathon/index.html` demonstrates a static local mailto-prep form. There is no backend contact system in this repository.
- Existing Letters of Light proof available now:
  - `/letters/`
  - `/letters/1c4a6e6838a7d2f0/`
  - `/assets/letters/1c4a6e6838a7d2f0/visual.png`
  - `/assets/letters/1c4a6e6838a7d2f0/final.mp4`
- Guardrail: `/letters/` content is machine-managed. Speaking work should link to Letters pages and assets without manually editing generated Letters files.

## Recommended Architecture
- Create three static routes:
  - `/speaking/`
  - `/speaking/letters-of-light-live/`
  - `/speaking/invite/`
- Keep first-release pages hand-authored static HTML, matching the current site architecture and avoiding new build tooling.
- Add `assets/data/speaking.json` as a lightweight future-facing content model. Do not dynamically render it in Phases 1-2.
- Connect speaking messages to Letters of Light through stable Letter URLs, Letter IDs, themes, scripture references, excerpts, and owned media assets.
- Over time, add recordings, clips, essays, PDFs, appearances, and testimonials only when they exist and can be documented.

## Page-By-Page Content Plan

### `/speaking/`
- Purpose: main speaking hub for Brendon R. Coleman.
- Target visitor: church leaders, small-group hosts, classroom organizers, podcast hosts, interviewers, and community event organizers.
- Section order: hero positioning, relationship between Brendon / Letters of Light / Letters of Light Live, speaking formats, initial topics, real Letter proof, invitation CTA.
- Required content: core positioning, four speaking formats, five initial topics, one real proof card for The Letter of Release.
- Calls to action: Invite Brendon to Speak, Explore Letters of Light Live, Read Letters of Light.
- Publish now: positioning, formats, topics, and featured Letter/release proof.
- Publish later: testimonials, event history, client logos, attendance numbers, speaker reel, fee claims, and media kit claims.

### `/speaking/letters-of-light-live/`
- Purpose: explain the signature speaking expression of Letters of Light.
- Target visitor: hosts who want a Scripture-rooted spoken message shaped from actual Letters material.
- Section order: hero, format explanation, how a Letter becomes a spoken message, featured Letter artifact, topic examples, invitation CTA.
- Required content: 20-30 minute format description, Scripture-rooted reflective language, real link to The Letter of Release, current release media as featured Letter artifact.
- Calls to action: Invite This Format and Read Letters of Light.
- Publish now: format description and featured Letter artifact.
- Publish later: full on-camera messages, live speaking clips, downloadable host materials, and additional Letter-derived talks.

### `/speaking/invite/`
- Purpose: collect the information needed for a speaking invitation using current static-site capabilities.
- Target visitor: event organizer ready to inquire.
- Section order: intro, local draft notice, invitation form, prepared draft actions, direct email fallback.
- Fields: name, organization, email, event date or timing, location or virtual, audience type, expected attendance, requested format, event purpose, budget or honorarium range (optional), message.
- Behavior: validate organizer email, event timing, requested format, and event purpose/message; prepare a local mailto draft to `noblebrendon150@gmail.com`; include every completed field in the draft; offer a copy-to-clipboard fallback.
- Publish now: local email draft flow only.
- Publish later: backend form handling only if a reliable deployment-compatible service is chosen.

## Inquiry Flow Plan
- Destination: `noblebrendon150@gmail.com`.
- Subject: `Speaking Invitation`.
- Implementation: static form plus JavaScript that validates required fields, generates readable inquiry text, creates a `mailto:` link, and exposes a copy fallback.
- Required validation: organizer email, event date or timing, requested format, and event purpose/message.
- Safety: do not store submissions, do not claim delivery, and include a direct email fallback.

## Content Model Proposal
Use `assets/data/speaking.json` with lightweight arrays for:
- `formats`
- `topics`
- `featured_letters`
- `featured_recordings`
- `upcoming_appearances`
- `past_appearances`
- `testimonials`

Only real formats, topics, and the current featured Letter/release artifact should be populated in the first release. Empty arrays are acceptable placeholders for future proof.

## Implementation Sequence

### Phase 0: Inventory And Asset Selection
- Confirm approved Letters assets and source pages.
- Confirm the contact email.
- Acceptance: no generated Letters files are edited.

### Phase 1: Minimum Publishable Speaking Pages
- Create `/speaking/` and `/speaking/letters-of-light-live/`.
- Create `assets/data/speaking.json`.
- Add a small root homepage Speaking entry point.
- Acceptance: pages render statically, match the current visual system, and use only factual proof.

### Phase 2: Invitation Form
- Create `/speaking/invite/`.
- Add local mailto-prep behavior, preferably in `assets/js/speaking-invite.js`.
- Add only minimal reusable form CSS.
- Acceptance: validation works, the draft includes every completed field, and no delivery is falsely implied.

### Phase 3: Proof And Media Integration
- Add real recordings, clips, PDFs, essays, testimonials, or event pages only after they exist.
- Not included in this implementation.

### Phase 4: Structured Archive And Future Automation
- Add rendering or automation only after the static first release proves useful.
- Not included in this implementation.

## Exact First-Release Recommendation
Ship:
- `/speaking/`
- `/speaking/letters-of-light-live/`
- `/speaking/invite/`
- `assets/data/speaking.json`

Use:
- Existing Letter of Release page.
- Existing Letter of Release visual.
- Existing Letter of Release release video.
- Existing contact email.

Omit:
- Testimonials.
- Client logos.
- Event history.
- Follower counts.
- Audience sizes.
- Speaker reel language.
- Fee claims.
- Media kit claims.

## Risks And Guardrails
- Overbuilding: do not add frameworks, package dependencies, build tooling, analytics, external form services, or archive automation in Phases 1-2.
- Fragmented branding: reuse the existing dark site system and treat speaking as part of Brendon R. Coleman / Letters of Light.
- Fake authority: use only real Letters assets as proof.
- Broken form delivery: describe the form as draft preparation, not submission.
- Machine-managed conflicts: do not edit `/letters/` generated pages by hand.
- Coherence: keep Letters of Light as the content body and Letters of Light Live as the spoken expression.

## Implementation Handoff
- Proposed file changes:
  - `index.html`
  - `assets/style.css`
- Proposed new files:
  - `SPEAKING_PLATFORM_EXECUTION_PLAN.md`
  - `speaking/index.html`
  - `speaking/letters-of-light-live/index.html`
  - `speaking/invite/index.html`
  - `assets/data/speaking.json`
  - `assets/js/speaking-invite.js`
- Unresolved technical questions:
  - Whether to use a dedicated speaking inbox later.
  - Whether to add backend form delivery later.
  - Where the upstream Letters generator lives.
- Pre-approval checklist:
  - No fake proof.
  - No generated Letters edits.
  - All links resolve.
  - Mailto body includes every completed field.
  - Budget field reads `Budget or honorarium range (optional)`.
  - Current release media is not called a speaker reel.
  - JSON is valid.
  - Pages use existing styling.
  - Root page exposes Speaking clearly.
