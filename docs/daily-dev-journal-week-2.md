**Daily Dev Journal: Week 2**
**Date:** 15th October, 2025
**Project:** CLI Hardening & Coverage Uplift Initiative
**This Week's Goal:** Refactor the Quote, Expense, To-Do, and Stopwatch CLIs into testable cores with thin wrappers, expand automated coverage beyond quality gates, and practice disciplined Git/Linear workflows.
**What Happened / Output:** Refactored each CLI into a pure-core module with a thin CLI entry point, then wrote targeted unit suites including table-driven coverage for Expense and Temp-converter plus golden-file verification for Stopwatch; delivered repo-hygiene updates such as `.gitattributes` and a coverage table in the CI `review-packet` workflow; analyzed coverage gaps and backfilled Expense error-path tests to meet uplift targets; applied Capstone polish by adding edge-case coverage and small quality-of-life improvements across Quote, Expense, To-Do, and Stopwatch.
**Bugs & Fixes:** Resolved repeated `MODULE_NOT_FOUND` runtime failures by launching each CLI from its correct working directory and verifying paths with `ls`; fixed the GitHub Actions "Implicit keys need to be on a single line" YAML error by switching the workflow step to a proper heredoc block; prevented Vitest watch-mode hangs from blocking coverage feedback by exiting with `q`/`Ctrl+C` and reviewing the generated `lcov-report/index.html` artifact.
**Concepts Learned:** Reinforced the pure-core versus thin-CLI separation to isolate side effects; practiced advanced testing patterns such as table-driven suites and golden-file assertions; interpreted coverage reports to prioritize untested branches; safely modified GitHub Actions workflows; used `git stash` to shuttle work-in-progress changes between feature branches without polluting PR history.
**Reflection:**
* How did my plan for the week compare to what I actually shipped?  I closely tracked the original plan—each CLI received the pure-core/thin-CLI refactor, targeted coverage uplift, and documentation polish that I scoped at the outset.
* What was a key bug or issue that my tests or the CI process helped me find?  The coverage uplift effort surfaced gaps in the Expense app, and the added tests uncovered invalid-date filtering cases that would have slipped through without the coverage gate.
* What is one concept from this week that was strongly reinforced for me?  Separating pure business logic from I/O proved invaluable: it keeps tests focused, stabilizes the CLI surface, and makes coverage easier to reason about.
* What is my first target for improvement in Week 3?  I want to tighten the feedback loop by scripting repeatable coverage checks and linting YAML changes locally before raising PRs.

---

**Date:** 23rd October, 2025

- 17:05 UTC — Hardened Expense and To-Do CLIs to store runtime data in `data/persistence/`, enforced positive-ID validation, and expanded fake-clock plus corrupt-file tests; confirmed full suite via `npm test`. (PR: _not yet opened_) (CI: _manual run, N/A_) (Artifacts: `review-artifacts/index.html`)
