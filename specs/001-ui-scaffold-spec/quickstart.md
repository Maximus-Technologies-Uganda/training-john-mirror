# Quickstart: Monday UI Foundations

## Prerequisites
- Node.js 18+
- npm 9+
- Playwright browsers installed (`npx playwright install`)

## Local Setup
1. Install dependencies: `npm install`
2. Create UI app directories (scaffold scripts will handle, see implementation tasks).
3. Generate Playwright artifacts directory: `mkdir -p review-artifacts/playwright`

## Spec-Kit Review
Follow these steps for **each** Spec-Kit (`specs/todo/`, `specs/expense/`). Keep the feature spec (`specs/001-ui-scaffold-spec/spec.md`) open so you can cross-check acceptance criteria.

1. **spec.md quality**
   - Confirm the **Product Goals** align with the feature spec’s business intent and are current.
   - Scan the **Gherkin scenarios** to ensure they cover happy path, error, and loading flows with explicit acceptance criteria.
   - Verify the **Empty / Loading / Error** states are defined with actionable guidance for UI behaviour and accessibility.
   - Flag and resolve any gaps before proceeding; do not mark the review complete if scenarios or states are missing.
2. **test-matrix.csv coverage**
   - Ensure required columns exist (`case-id`, `input`, `flags`, `prestate`, `expected`, `notes`).
   - Trace each Gherkin scenario to at least one matrix row; add notes where a single case covers multiple scenarios.
   - Confirm edge cases (validation errors, offline/latency handling) are represented so QA can derive tests without extra context.
3. **ux-checklist.md accessibility**
   - Confirm every checklist item is explicitly checked or annotated with why it is not applicable.
   - Cross-reference checklist items with `spec.md` copy or interaction guidance to guarantee reviewers have supportive narrative.
4. **Record validation evidence**
   - Append a dated entry to the app’s `validation-log.md` capturing reviewer name, checklist outcome, and any follow-up actions.
   - Note any deviations and link to the follow-up issue or commit where they will be addressed.
5. **Re-verify on change**
   - Re-run this checklist whenever Spec-Kit content changes before merge. Update the validation log with the new review date and outcome.

## Run UI Unit Tests
```bash
npm run test -- --project apps/<app>/ui
```
_Replace `<app>` with `todo`, `expense`, `stopwatch`, or `temp`. Ensure coverage reports populate under `review-artifacts/ui-coverage-<app>/`._

## Run Playwright Smoke Tests
```bash
npx playwright test --config playwright.smoke.config.ts --project <app>
```
- Confirms one end-to-end flow per app.
- Artifacts published to `review-artifacts/playwright/<app>/`.

## CI Pipeline Expectations
- Vitest job: executes UI suites, uploads coverage per app, stores summary JSON.
- Playwright job: runs smoke suite, uploads traces/screenshots/videos.
- Review Packet references both artifact locations.

## Final Verification After Workflows Run
1. Trigger the `UI CI` workflow on your feature PR and confirm every `Vitest UI (<app>)` check shows as **Required** and blocks merge until it passes.
   - From the workflow run details, verify that each matrix job uploads a `ui-coverage-<app>` artifact. Download at least one artifact and confirm it contains `summary.json` with coverage + runtime metadata alongside the HTML report (`index.html`).
   - If any coverage folder or summary is missing, fix the underlying issue and rerun the job before proceeding.
2. Trigger the `Playwright Smoke` workflow and confirm all `Playwright Smoke (<app>)` checks are required and green.
   - Inspect the artifacts for each matrix job and ensure `review-artifacts/playwright/<app>/` includes `report/index.html`, `traces/`, `screenshots/`, `videos/`, and `runtime.json`.
   - Re-run the workflow if any artifact is absent or stale.
3. After both workflows succeed, download the artifacts locally (GitHub UI or `gh run download`) so `review-artifacts/` mirrors the CI output, then run `node generate-review-packet.js`.
   - Open `_review/summary.md` and confirm the **UI Coverage Artifacts** and **Playwright Smoke Artifacts** sections link to every app’s folder.
   - Verify the **Runtime SLA (≤ 15 minutes)** section lists each Vitest and Playwright suite with a ✓ indicator and durations at or below 15 minutes.
   - Capture the verification outcome (including reruns, if any) in the relevant `validation-log.md` entries before marking the task complete.