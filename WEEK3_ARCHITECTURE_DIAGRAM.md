# Week 3 Capstone: Architecture & Data Flow Diagrams 📐

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                     WEEK 3 CAPSTONE TEST INFRASTRUCTURE                  │
└─────────────────────────────────────────────────────────────────────────┘

                              LOCAL DEVELOPMENT
┌──────────────────────────────────────────────────────────────────────────┐
│                                                                            │
│  Developer Machine (Windows/Mac/Linux)                                   │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │                                                                    │  │
│  │  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐   │  │
│  │  │  Expense App    │  │ Stopwatch App   │  │   Temp App      │   │  │
│  │  │                 │  │                 │  │                 │   │  │
│  │  │ ├─ playwright   │  │ ├─ playwright   │  │ ├─ playwright   │   │  │
│  │  │ │  .config.ts   │  │ │  .config.ts   │  │ │  .config.ts   │   │  │
│  │  │ ├─ e2e/         │  │ ├─ e2e/         │  │ ├─ e2e/         │   │  │
│  │  │ ├─ package.json │  │ ├─ package.json │  │ ├─ package.json │   │  │
│  │  │                 │  │                 │  │                 │   │  │
│  │  └─────────────────┘  └─────────────────┘  └─────────────────┘   │  │
│  │         │                     │                     │              │  │
│  │         │ npm run e2e         │ npm run e2e         │              │  │
│  │         │                     │                     │              │  │
│  │         ├─────────────────────┴─────────────────────┤              │  │
│  │         │                                           │              │  │
│  │         ▼ ▼ ▼                                       ▼              │  │
│  │    Playwright Test Engine                                          │  │
│  │    ┌──────────────────────────────────────────────────────┐       │  │
│  │    │ ✅ Traces         ✅ Screenshots   ✅ Videos         │       │  │
│  │    │ ✅ HTML Reports   ✅ JSON Results  ✅ Metadata       │       │  │
│  │    └──────────────────────────────────────────────────────┘       │  │
│  │                     │                                             │  │
│  │         ┌───────────┼───────────┐                                │  │
│  │         ▼           ▼           ▼                                │  │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐               │  │
│  │  │ expense/    │ │ stopwatch/  │ │ temp/       │               │  │
│  │  │ ui/         │ │ ui/         │ │ ui/         │               │  │
│  │  │ test-       │ │ test-       │ │ test-       │               │  │
│  │  │ results/    │ │ results/    │ │ results/    │               │  │
│  │  │ playwright/ │ │ playwright/ │ │ playwright/ │               │  │
│  │  └─────────────┘ └─────────────┘ └─────────────┘               │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
│  Local Artifact Locations:                                               │
│  - apps/expense/ui/test-results/playwright/index.html                   │
│  - apps/stopwatch/ui/test-results/playwright/index.html                 │
│  - apps/temp/ui/test-results/playwright/index.html                      │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘


                            GITHUB CI/CD PIPELINE
┌──────────────────────────────────────────────────────────────────────────┐
│                        .github/workflows/playwright.yml                  │
│                                                                            │
│  Trigger: push/PR to main/develop                                        │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  PARALLEL JOBS (Run Simultaneously)                               │  │
│  │                                                                    │  │
│  │  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐ │  │
│  │  │  test-expense    │  │ test-stopwatch   │  │  test-temp       │ │  │
│  │  │                  │  │                  │  │                  │ │  │
│  │  │ 1. Checkout      │  │ 1. Checkout      │  │ 1. Checkout      │ │  │
│  │  │ 2. Node 18       │  │ 2. Node 18       │  │ 2. Node 18       │ │  │
│  │  │ 3. npm ci        │  │ 3. npm ci        │  │ 3. npm ci        │ │  │
│  │  │ 4. Install PW    │  │ 4. Install PW    │  │ 4. Install PW    │ │  │
│  │  │ 5. npm run e2e   │  │ 5. npm run e2e   │  │ 5. npm run e2e   │ │  │
│  │  │ 6. Upload (always) │ │ 6. Upload (always) │ │ 6. Upload (always) │ │
│  │  │                  │  │                  │  │                  │ │  │
│  │  └────────┬─────────┘  └────────┬─────────┘  └────────┬─────────┘ │  │
│  │           │ Artifacts           │ Artifacts           │ Artifacts  │  │
│  │           ▼                     ▼                     ▼            │  │
│  │  playwright-expense-artifacts                                      │  │
│  │  playwright-stopwatch-artifacts                                    │  │
│  │  playwright-temp-artifacts                                         │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                          │                                                │
│                          ▼ All jobs complete (even on failure)            │
│                                                                            │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  publish-artifacts Job                                            │  │
│  │                                                                    │  │
│  │  1. Download all artifacts                                       │  │
│  │  2. Organize:                                                    │  │
│  │     review-artifacts/                                            │  │
│  │     ├── playwright/                                              │  │
│  │     │   ├── expense/   (30 day retention)                        │  │
│  │     │   ├── stopwatch/ (30 day retention)                        │  │
│  │     │   └── temp/      (30 day retention)                        │  │
│  │     └── ...                                                      │  │
│  │                                                                    │  │
│  │  3. Upload consolidated artifact (90 day retention)              │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                          │                                                │
│                          ▼                                                │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │  GitHub Artifacts Storage                                         │  │
│  │                                                                    │  │
│  │  Available for 90 days in Actions tab                             │  │
│  │  - review-artifacts/                                             │  │
│  │  - playwright-[app]-artifacts                                    │  │
│  │                                                                    │  │
│  └────────────────────────────────────────────────────────────────────┘  │
│                                                                            │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## Local Test Execution Flow

```
                         LOCAL TEST EXECUTION
                              Flow Chart

┌─────────────────────────────────────────────────────────────────┐
│  START: npm run e2e                                             │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  1. Parse playwright.config.ts                                  │
│     - outputDir: 'test-results/playwright'                      │
│     - trace: 'on-first-retry'                                   │
│     - screenshot: 'only-on-failure'                             │
│     - video: 'retain-on-failure'                                │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  2. Auto-start dev server                                       │
│     - Expense: http://localhost:3000                            │
│     - Stopwatch: http://localhost:5173                          │
│     - Temp: http://localhost:5173                               │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│  3. Discover tests in ./e2e/ directory                          │
│     - Find all *.spec.ts files                                  │
│     - Parse test cases                                          │
└────────────────────────────┬──────────────────────────────────────┘
                             │
                    ┌────────┼────────┐
                    │        │        │
                    ▼        ▼        ▼
        ┌─────────────────────────────────────┐
        │ Run Tests in 3 Browsers:            │
        │ - Chromium                          │
        │ - Firefox                           │
        │ - WebKit                            │
        └──────────┬──────────────────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼ (Test Pass)         ▼ (Test Fail)
    Skip trace           Capture:
    Skip screenshot      - Screenshot
    Skip video           - Video
    Generate HTML        - Trace
    Report               - Generate HTML
        │                 │ Report
        │                 │
        └────────┬────────┘
                 │
                 ▼
    ┌─────────────────────────────────┐
    │ 4. Create test-results/          │
    │    playwright/ directory         │
    │                                  │
    │ Structure:                       │
    │ index.html                       │
    │ test-results/                    │
    │ ├── chromium/                    │
    │ ├── firefox/                     │
    │ ├── webkit/                      │
    │ data/                            │
    └─────────────┬───────────────────┘
                  │
                  ▼
    ┌─────────────────────────────────┐
    │ 5. User opens index.html         │
    │    - View test summary           │
    │    - Click on tests              │
    │    - View screenshots            │
    │    - Watch videos                │
    │    - Inspect traces              │
    └─────────────┬───────────────────┘
                  │
                  ▼
    ┌─────────────────────────────────┐
    │ Complete ✅                     │
    └─────────────────────────────────┘
```

---

## Artifact Generation Matrix

```
┌──────────────────┬───────────────┬──────────────┬──────────────────┐
│ Artifact Type    │ When Created  │ File Format  │ Location         │
├──────────────────┼───────────────┼──────────────┼──────────────────┤
│ HTML Report      │ Always        │ .html        │ index.html       │
│                  │               │              │ (root)           │
├──────────────────┼───────────────┼──────────────┼──────────────────┤
│ Trace Files      │ On first      │ .zip         │ test-results/    │
│                  │ retry         │              │ [browser]/       │
│                  │               │              │ trace.zip        │
├──────────────────┼───────────────┼──────────────┼──────────────────┤
│ Screenshots      │ On failure    │ .png         │ test-results/    │
│                  │ only          │              │ [browser]/       │
│                  │               │              │ [test]/          │
│                  │               │              │ screenshots/     │
├──────────────────┼───────────────┼──────────────┼──────────────────┤
│ Videos           │ On failure    │ .webm        │ test-results/    │
│                  │ only          │              │ [browser]/       │
│                  │               │              │ [test]/          │
│                  │               │              │ video.webm       │
├──────────────────┼───────────────┼──────────────┼──────────────────┤
│ JSON Results     │ Always        │ .json        │ data/            │
│                  │               │              │ [results].json   │
├──────────────────┼───────────────┼──────────────┼──────────────────┤
│ Test Metadata    │ Always        │ .json        │ data/            │
│                  │               │              │ [metadata].json  │
└──────────────────┴───────────────┴──────────────┴──────────────────┘
```

---

## Playwright Configuration Flow

```
PROJECT STRUCTURE & CONFIGURATION HIERARCHY

┌─ apps/
│  │
│  ├─ expense/
│  │  │
│  │  ├─ ui/
│  │  │  │
│  │  │  ├─ playwright.config.ts ◄─── UPDATED ✅
│  │  │  │  ├── outputDir: 'test-results/playwright'
│  │  │  │  ├── use:
│  │  │  │  │   ├── baseURL: http://localhost:3000
│  │  │  │  │   ├── trace: 'on-first-retry'
│  │  │  │  │   ├── screenshot: 'only-on-failure' ◄─── NEW
│  │  │  │  │   └── video: 'retain-on-failure' ◄─── NEW
│  │  │  │  └── projects: [chromium, firefox, webkit]
│  │  │  │
│  │  │  ├─ package.json
│  │  │  │  └── "e2e": "playwright test"
│  │  │  │
│  │  │  └─ e2e/
│  │  │     └── *.spec.ts
│  │  │
│  │  └─ test-results/
│  │     └─ playwright/  ◄─── GENERATED BY PLAYWRIGHT
│  │        └── index.html
│  │
│  ├─ stopwatch/
│  │  │
│  │  ├─ ui/
│  │  │  │
│  │  │  ├─ playwright.config.ts ◄─── UPDATED ✅
│  │  │  ├─ e2e/
│  │  │  └─ test-results/
│  │  │     └─ playwright/  ◄─── GENERATED
│  │  │        └── index.html
│  │
│  └─ temp/
│     │
│     ├─ ui/
│     │  │
│     │  ├─ playwright.config.ts ◄─── UPDATED ✅
│     │  ├─ e2e/
│     │  └─ test-results/
│     │     └─ playwright/  ◄─── GENERATED
│     │        └── index.html
│
├─ .github/
│  │
│  └─ workflows/
│     │
│     └─ playwright.yml ◄─── CREATED ✅
│        ├── test-expense job
│        ├── test-stopwatch job
│        ├── test-temp job
│        └── publish-artifacts job
│
└─ review-artifacts/
   │
   └─ playwright/ ◄─── GENERATED BY CI/CD
      ├── expense/
      │  └── index.html
      ├── stopwatch/
      │  └── index.html
      └── temp/
         └── index.html
```

---

## Browser Testing Matrix

```
MULTI-BROWSER TEST EXECUTION

Each App Tests Against 3 Browsers:

expense-workflow.spec.ts
├── Chromium (Blink engine)
│   ├── Step 1: Navigate to app
│   ├── Step 2: Interact with UI
│   ├── Step 3: Assert results
│   └── Generate trace/screenshot/video (if fail)
│
├── Firefox (Gecko engine)
│   ├── Step 1: Navigate to app
│   ├── Step 2: Interact with UI
│   ├── Step 3: Assert results
│   └── Generate trace/screenshot/video (if fail)
│
└── WebKit (Safari-compatible)
    ├── Step 1: Navigate to app
    ├── Step 2: Interact with UI
    ├── Step 3: Assert results
    └── Generate trace/screenshot/video (if fail)

Result: 3 test runs per test file
Total: N tests × 3 browsers = 3N test results
```

---

## Artifact Retention Timeline

```
ARTIFACT LIFECYCLE

Local Development
─────────────────

npm run e2e → test-results/playwright/ → Developer views → Deletes manually
                  (unlimited)              (or pushes to GIT)


GitHub Actions - Individual Runs
────────────────────────────────

Workflow triggers → Jobs run → Artifacts upload
     │
     └─ Individual artifact retention:
        playwright-expense-artifacts ──┐
        playwright-stopwatch-artifacts ├─ Retained for 30 days
        playwright-temp-artifacts ─────┘


GitHub Actions - Consolidated Review
─────────────────────────────────────

publish-artifacts consolidates all ──→ review-artifacts/ ──→ 90 day retention

Timeline:
├─ Day 1: Tests run, artifacts created
├─ Day 7: Available for review
├─ Day 30: Individual artifacts auto-delete
├─ Day 90: review-artifacts/ auto-deletes
└─ After: Archived or manually downloaded
```

---

## Configuration Precedence

```
PLAYWRIGHT CONFIGURATION HIERARCHY

┌─────────────────────────────────────────────────┐
│ Global Config (playwright.config.ts)            │
│ ├─ outputDir: 'test-results/playwright'        │
│ ├─ reporter: ['html', 'json']                   │
│ ├─ use:                                         │
│ │  ├─ baseURL: 'http://localhost:[PORT]'       │
│ │  ├─ trace: 'on-first-retry'                  │
│ │  ├─ screenshot: 'only-on-failure'            │
│ │  └─ video: 'retain-on-failure'               │
│ └─ projects: []                                 │
└─────────────────────────┬───────────────────────┘
                          │
                          │ Applied to each project
                          │
        ┌─────────┬───────┴────────┬────────┐
        ▼         ▼                ▼        ▼
    Chromium  Firefox           WebKit   Mobile
    
    ├─ Desktop Chrome        ├─ Desktop Firefox   ├─ Desktop Safari
    ├─ Retries: 2 (CI)       ├─ Retries: 2 (CI)   ├─ Retries: 2 (CI)
    ├─ Workers: 1 (CI)       ├─ Workers: 1 (CI)   ├─ Workers: 1 (CI)
    │ (parallel locally)      │ (parallel locally)  │ (parallel locally)
    │                         │                     │
    ├─ Traces enabled ✅     ├─ Traces enabled ✅ ├─ Traces enabled ✅
    ├─ Screenshots on fail ✅ ├─ Screenshots on fail ✅ ├─ Screenshots on fail ✅
    ├─ Videos on fail ✅     ├─ Videos on fail ✅ ├─ Videos on fail ✅
    │                         │                     │
    └─ Output: test-results/  └─ Output: test-results/ └─ Output: test-results/
       playwright/               playwright/           playwright/
```

---

## Summary: Complete Data Flow

```
                           END-TO-END DATA FLOW

LOCAL DEVELOPMENT                    GITHUB INTEGRATION
─────────────────                    ──────────────────

Developer                            
    │ Types
    │
    ▼ npm run e2e
    
Dev Server              Playwright Test Engine        Artifacts Generated
(localhost)             (chromium, firefox, webkit)   (screenshots, traces, videos)
    │                          │                              │
    ▼                          ▼                              ▼
html/css/js ──────→ Execute tests ─────────→ test-results/playwright/
  +API calls             against each                 │
                       browser variant                 ├── index.html
                          │                           ├── traces/
                          │                           ├── screenshots/ 
                          ├─ PASS ─────┐              ├── videos/
                          │             │              └── data/
                          └─ FAIL ──────┤
                                        │
                                        ▼ Collect results
                                        
                                        Developer reviews locally
                                        
                                        ▼ git push
                                        
                                        GitHub Webhook
                                        │
        ┌───────────────────────────────┼───────────────────────────────┐
        │                               │                               │
        ▼                               ▼                               ▼
    test-expense                    test-stopwatch                  test-temp
    Job                             Job                             Job
    │                               │                               │
    ├─ npm ci                       ├─ npm ci                       ├─ npm ci
    ├─ playwright install           ├─ playwright install           ├─ playwright install
    ├─ npm run e2e                  ├─ npm run e2e                  ├─ npm run e2e
    │ (generate artifacts)          │ (generate artifacts)          │ (generate artifacts)
    │                               │                               │
    └─ Upload (if: always) ─────────┴─ Upload (if: always) ─────────┴─ Upload (if: always)
            │                           │                               │
            │ playwright-expense-       │ playwright-stopwatch-         │ playwright-temp-
            │ artifacts (30 days)       │ artifacts (30 days)           │ artifacts (30 days)
            │                           │                               │
            └───────────────────────────┼───────────────────────────────┘
                                        │
                                        ▼ All jobs complete
                                        
                                    publish-artifacts Job
                                        │
                                        ├─ Download all artifacts
                                        ├─ Organize into review-artifacts/
                                        │
                                        ▼
                                    
                                review-artifacts/
                                playwright/
                                ├── expense/       (index.html, traces, videos...)
                                ├── stopwatch/     (index.html, traces, videos...)
                                └── temp/          (index.html, traces, videos...)
                                (90 day retention)
                                        │
                                        ▼
                                        
                                GitHub Actions Artifacts Tab
                                     │
                                     ├─ Download review-artifacts
                                     └─ Extract and review all reports
```

---

## Configuration Quick Reference Table

| Component | Property | Value | Purpose |
|-----------|----------|-------|---------|
| **Playwright** | testDir | `./e2e` | Where tests are located |
| | testMatch | `**/*.spec.ts` | Test file pattern |
| | outputDir | `test-results/playwright` | Artifact output location |
| | reporter | `['html', 'json']` | Report formats |
| **Use** | baseURL | App URL (3000/5173) | Test application location |
| | trace | `'on-first-retry'` | Detailed execution logs |
| | screenshot | `'only-on-failure'` | Capture on test failure |
| | video | `'retain-on-failure'` | Record on test failure |
| **Projects** | chromium | Desktop Chrome | Blink engine tests |
| | firefox | Desktop Firefox | Gecko engine tests |
| | webkit | Desktop Safari | WebKit engine tests |
| **CI** | retries | 2 (CI only) | Retry failed tests |
| | workers | 1 (CI only) | Single worker in CI |
| | forbidOnly | true (CI) | Prevent `.only()` in CI |

---

This completes your Week 3 Capstone architecture overview! All systems are configured and ready for production.

