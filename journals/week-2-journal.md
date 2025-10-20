# Weekly Dev Journal: Week 2
**Date:** October 3, 2025 > **Project:** training-john >
### This Week's Goal:
strengthen fundamentals (validation, error paths, table-driven tests) across four CLIs and set up CI to report test coverage on all PRs.
What Happened / Output:
- Increased the expense app's test coverage from 25% to over 90% by adding robust error-path tests.
- Added new features to the todo app, including the --due Today option.
- Refactored the stopwatch with golden file tests to stabilize and verify output formatting.
- Scaffolded the quote app from scratch after discovering it was missing.
- Completed a documentation fidelity review for all apps to align specs and outputs.
Bugs & Fixes:
- Bug: > The expense app printed $25.5 instead of $25.50.
  - Fix: > Applied number formatting with .toFixed(2).
- Bug: > The entire quote app was missing from the repository.
  - Fix: > Generated the app from scratch using AI, then wired tests and docs.
Concepts Learned:
- Workflow discipline: using small, focused-scope branches and PRs for each task.
- Documentation fidelity as a form of testing to catch output mismatches early.
- Table-driven tests for concise, comprehensive validation coverage.
Reflection:
This week was successful even though the schedule was shuffled. Focusing on error paths and validation made the work feel much more professional. My first target for Week 3 is to be more disciplined with branching from day one and to apply a test-first mindset to new tasks.


---
### Evidence Links

* **Capstone PR:** https://github.com/Maximus-Technologies-Uganda/training-john/pull/108
* **Successful CI Run:** https://github.com/Maximus-Technologies-Uganda/training-john/pull/108/commits/22220e0c74a9ea1d6f6e8d8c4b81e54e693da133
* **Review Packet Artifact:** https://github.com/Maximus-Technologies-Uganda/training-john/actions/runs/18636044451/artifacts/4312324065
* **Coverage Reports Artifact:** https://github.com/Maximus-Technologies-Uganda/training-john/actions/runs/18636044451/artifacts/4312323978
* **Test Results Artifact:** https://github.com/Maximus-Technologies-Uganda/training-john/actions/runs/18636044451/artifacts/4312323935