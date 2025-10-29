# Monday: UI Scaffolding, Spec-Kit Creation, and CI Configuration PR

## Scope
- [ ] UI scaffolding updates
- [ ] Spec-Kit documentation changes
- [ ] CI workflows & scripts
- [ ] Review Packet / documentation updates
- [ ] Other (explain below)

*Check every area touched by this PR; add context in Summary when multiple apps or docs are involved.*

## Summary
<!-- Provide a concise summary of the changes in this PR. Highlight impacted apps, tooling, and any follow-up items. -->

## Verification Checklist
- [ ] `npm run test -- --project apps/<app>/ui` (apps exercised: _______________)
- [ ] `npx playwright test --config playwright.smoke.config.ts --project <app>` (apps exercised: _______________)
- [ ] `UI CI` workflow is green (`Vitest UI (todo|expense|stopwatch|temp)` checks required)
- [ ] `Playwright Smoke` workflow is green (`Playwright Smoke (todo|expense|stopwatch|temp)` checks required)
- [ ] Review Packet `_review/summary.md` shows **Runtime SLA (≤ 15 minutes)** with ✓ for each suite (link below)
- [ ] Branch protection shows Vitest UI & Playwright checks required before merge (attach evidence in Notes if screenshots are used)

## Review Packet & Artifact Links
<!-- Replace placeholder links with the latest successful run. Remove any rows that do not apply. -->
- [ ] Review Packet summary: [summary.md](<link-to-_review/summary.md>)
- [ ] UI coverage summary (todo): [summary.json](<link-to-review-artifacts/ui-coverage-todo/summary.json>)
- [ ] UI coverage summary (expense): [summary.json](<link-to-review-artifacts/ui-coverage-expense/summary.json>)
- [ ] UI coverage summary (stopwatch): [summary.json](<link-to-review-artifacts/ui-coverage-stopwatch/summary.json>)
- [ ] UI coverage summary (temp): [summary.json](<link-to-review-artifacts/ui-coverage-temp/summary.json>)
- [ ] Playwright artifacts (todo): [folder](<link-to-review-artifacts/playwright/todo/>)
- [ ] Playwright artifacts (expense): [folder](<link-to-review-artifacts/playwright/expense/>)
- [ ] Playwright artifacts (stopwatch): [folder](<link-to-review-artifacts/playwright/stopwatch/>)
- [ ] Playwright artifacts (temp): [folder](<link-to-review-artifacts/playwright/temp/>)
- [ ] CI run logs: [UI CI workflow](<link-to-ui-ci-run>)
- [ ] CI run logs: [Playwright Smoke workflow](<link-to-playwright-smoke-run>)

## Notes
<!-- Call out follow-ups, risks, or anything reviewers should know -->






